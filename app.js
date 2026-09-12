import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  collection, deleteDoc, doc, getCountFromServer, getFirestore, increment, limit, onSnapshot,
  orderBy, query, serverTimestamp, setDoc, where, writeBatch
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

// This is the Firebase web configuration supplied for the rems-abcd0 project.
const firebaseConfig = {
  apiKey: "AIzaSyCFb0JEINw4Q9Q6pworo5eZIjJL1LeNkds",
  authDomain: "rems-abcd0.firebaseapp.com",
  projectId: "rems-abcd0",
  storageBucket: "rems-abcd0.firebasestorage.app",
  messagingSenderId: "252930564587",
  appId: "1:252930564587:web:633d9ccdfff0e0eb4d39ae",
  measurementId: "G-R57K82NEGZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const els = {
  button: document.querySelector("#press-button"),
  personal: document.querySelector("#personal-count"),
  global: document.querySelector("#global-count"),
  message: document.querySelector("#connection-message"),
  list: document.querySelector("#leader-list"),
  nameDialog: document.querySelector("#name-dialog"),
  nameForm: document.querySelector("#name-form"),
  nameInput: document.querySelector("#player-name")
};
const fmt = new Intl.NumberFormat();
const LEADERBOARD_SIZE = 10;
let userId = "";
let personalPresses = 0;
let latestLeaders = [];
let playerCreated = false;
let exitSent = false;
let rankTimer;

boot().catch(showError);

async function boot() {
  const credential = auth.currentUser ? { user: auth.currentUser } : await signInAnonymously(auth);
  userId = credential.user.uid;
  onSnapshot(doc(db, "stats", "global"), snapshot => {
    els.global.textContent = fmt.format(snapshot.data()?.presses || 0);
  });
  onSnapshot(query(collection(db, "users"), orderBy("presses", "desc"), limit(LEADERBOARD_SIZE)), snapshot => {
    latestLeaders = snapshot.docs.map(player => ({ id: player.id, ...player.data() }));
    renderLeaders();
  });

  els.nameDialog.showModal();
  els.nameInput.focus();
}

els.nameForm.addEventListener("submit", async event => {
  event.preventDefault();
  const name = els.nameInput.value.trim().replace(/\s+/g, " ");
  if (name.length < 2) return;
  const submit = els.nameForm.querySelector("button");
  submit.disabled = true;
  try {
    const userRef = doc(db, "users", userId);
    // Queue the write but do not make the player wait for a server round trip.
    // Firestore listeners receive the local document immediately.
    setDoc(userRef, { name, presses: 0, createdAt: serverTimestamp() })
      .catch(showError);
    playerCreated = true;
    onSnapshot(userRef, snapshot => {
      personalPresses = snapshot.data()?.presses || 0;
      els.personal.textContent = fmt.format(personalPresses);
      updateRank();
    });
    els.nameDialog.close();
    els.button.disabled = false;
    els.message.textContent = "You Don't Have To";
  } catch (error) {
    showError(error);
    submit.disabled = false;
  }
});

els.button.addEventListener("click", async () => {
  if (!userId) return;
  try {
    // Firestore applies this batch to its local cache before the server responds,
    // so snapshot listeners update the UI immediately even on a slow connection.
    const batch = writeBatch(db);
    batch.set(doc(db, "stats", "global"), { presses: increment(1) }, { merge: true });
    batch.set(doc(db, "users", userId), { presses: increment(1), lastPressedAt: serverTimestamp() }, { merge: true });
    batch.commit().catch(showError);
  } catch (error) {
    showError(error);
  }
});

function updateRank() {
  // A fast clicker should not make one server query for every single tap.
  clearTimeout(rankTimer);
  rankTimer = setTimeout(fetchRank, 350);
}

async function fetchRank() {
  if (!personalPresses) { renderLeaders(0); return; }
  try {
    const count = await getCountFromServer(query(collection(db, "users"), where("presses", ">", personalPresses)));
    renderLeaders(count.data().count + 1);
  } catch (error) {
    console.error("Could not fetch player rank", error);
    renderLeaders();
  }
}

function renderLeaders(rank) {
  const entries = latestLeaders.map((player, index) => ({ ...player, rank: index + 1 }));
  if (rank > LEADERBOARD_SIZE && !entries.some(player => player.id === userId)) {
    entries.push({ id: userId, name: "You", presses: personalPresses, rank });
  }
  els.list.replaceChildren();
  if (!entries.length) {
    els.list.innerHTML = '<p class="empty-state">Waiting for the first press…</p>';
    return;
  }
  entries.forEach(player => {
    const row = document.createElement("div");
    row.className = `leader-row${player.id === userId ? " current" : ""}`;
    row.innerHTML = `<span class="leader-rank">#${player.rank}</span><span class="leader-name"></span><span class="leader-score">${fmt.format(player.presses || 0)}</span>`;
    row.querySelector(".leader-name").textContent = player.id === userId ? "You" : (player.name || "Anonymous");
    els.list.append(row);
  });
}

function showError(error) {
  console.error(error);
  const code = error?.code ? ` (${error.code})` : "";
  els.message.textContent = `Firebase could not save that action${code}. Please try again.`;
}

// This runs when the visitor navigates away or closes the tab. The global stats
// document is deliberately not touched, so the worldwide total stays intact.
window.addEventListener("pagehide", () => {
  if (!playerCreated || exitSent) return;
  exitSent = true;
  deleteDoc(doc(db, "users", userId)).catch(error => console.warn("Could not remove player", error));
});
