The Button 🎯
Basic Details

Team Name: ZeroDay

Team Members
Team Lead: Ridhul K Roy - Carmel College Of Engineering And TEchnology
Member 2: Saalim A  - Carmel College Of Engineering And TEchnology

Project Description

The Button is a deliberately useless project built around one giant “PRESS ME” button.

Every press increases the user's personal count and the global press count, while a live leaderboard ranks the world's most dedicated button pressers.

The Problem (that doesn't exist)

The world has many important problems.

But nobody has solved the most important one:

What if I really, really want to press a button for absolutely no reason?

People deserve a button that serves no purpose whatsoever.

The Solution (that nobody asked for)

We built The Button.

Users choose a name, press the giant button, watch their personal and global counts increase, and compete on a live leaderboard.

There are no rewards.

There is no productivity.

There is no point.

Just press the button.

Technical Details

Technologies/Components Used
For Software

Languages:

HTML5
CSS3
JavaScript (ES6+)

Frameworks:

None — Vanilla JavaScript

Services & Libraries:

Firebase Authentication
Cloud Firestore
Firebase Web SDK v12.18.0

Tools:

Visual Studio Code
Git
GitHub
Browser Developer Tools
For Hardware

Not applicable.

The project runs entirely in a web browser.

Implementation
Installation


No additional npm packages are required. The Firebase Web SDK is imported directly from Google's CDN.

Run

Run the project using a local web server such as VS Code Live Server.

Open the project in Visual Studio Code.
Open index.html.
Start Live Server.
Open the provided localhost URL in your browser.
How It Works
Firebase is initialized when the application starts.
Each visitor is authenticated anonymously using Firebase Authentication.
The user selects a leaderboard name.
A Firestore document is created for the player.
Every button press atomically increments:
The player's personal press count.
The global press count.
Firestore real-time listeners immediately update the UI.
The top 10 players are displayed on the live leaderboard.
The user's rank is calculated using a Firestore count query.
Rank requests are debounced to avoid unnecessary database queries during rapid clicking.
When a visitor leaves, their temporary leaderboard entry is removed while the global press count remains intact.
Project Documentation

Screenshots

<img width="1866" height="930" alt="Screenshot 2026-09-12 071934" src="https://github.com/user-attachments/assets/86b512d2-8e40-4a65-a94a-299681f5217e" />

Name Selection: Users choose the name that will appear on the live leaderboard.

<img width="1778" height="927" alt="Screenshot 2026-09-12 072000" src="https://github.com/user-attachments/assets/8224d280-b930-4dd6-b23b-4e5a10888abe" />
Home Screen: The main interface showing the personal press count, global press count, and the giant PRESS ME button.
<img width="1860" height="958" alt="Screenshot 2026-09-12 072111" src="https://github.com/user-attachments/assets/8984b634-89bb-4a42-a17b-2ebb69b17bba" />
Live Leaderboard: Displays the top players in real time and highlights the current player.

Workflow


Workflow: User → Anonymous Firebase Authentication → Choose Name → Press Button → Firestore Updates → Real-Time UI Update → Leaderboard.

Project Demo

Video

https://drive.google.com/drive/folders/1Ls8xd1Cc_6MA8nkori_kcHFnhYth1qHl?usp=sharing

Technical contributions

Saalim

Project concept and development
Frontend implementation
UI/UX design
HTML and CSS development
JavaScript application logic

Ridhul 

Firebase Authentication integration
Cloud Firestore integration
Real-time leaderboard
Global and personal press counters
Rank calculation and optimization
Git/GitHub management

live link
https://rems-abcd0.web.app



Made with ❤️ at TinkerHub Useless Projects
THE BUTTON
A beautifully pointless competition.

There is no point.

Press it anyway. 🔴










