# The Button — Web

A responsive static website backed by the Firebase project configuration provided for `rems-abcd0`.

## Run it locally

Serve this folder from a local web server (do not open `index.html` directly). For example, in VS Code use the **Live Server** extension, then open its local URL. Firebase Authentication requires an approved domain.

## Firebase Console checklist

1. **Authentication → Sign-in method → Anonymous → Enable**.
2. **Firestore Database → Create database**.
3. **Firestore Database → Rules**: paste and publish `firestore.rules` from this folder.
4. **Authentication → Settings → Authorized domains**: add your deployed website's domain. `localhost` is normally already present for local development.

## Deploy

The directory can be deployed as-is to Firebase Hosting, Netlify, Vercel, or GitHub Pages. Add the production domain to Firebase Authentication's Authorized domains list afterward.

## Important

The included Firestore rules are usable for a demo. They do not make a public leaderboard tamper-proof: a malicious client could manipulate the global counter. For a public game, handle every press through a callable Cloud Function (or other trusted server) and lock client writes to `/stats/global`.

## Player cleanup

Visitors must enter a name before they can press the button. Their player document is removed when they leave the page, while `stats/global` is retained. Browser close events are best-effort: for guaranteed deletion after a browser crash or sudden loss of connection, add Firebase Realtime Database presence (`onDisconnect`) plus a Cloud Function to remove the corresponding Firestore document.
