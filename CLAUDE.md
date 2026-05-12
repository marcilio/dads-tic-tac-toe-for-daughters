# Tic-Tac-Toe — Claude Instructions

## Project
A polished Tic-Tac-Toe React web app made by Marcilio for his daughters Ana and Marina.
Live at: https://tic-tac-toe-two-iota-73.vercel.app
GitHub: git@github.com:marcilio/dads-tic-tac-toe-for-daughters.git

## Commands
```bash
npm run dev      # start dev server at localhost:5173
npm run build    # production build
vercel --prod    # deploy to production
```

## Tech Stack
- React + Vite (all logic in src/App.jsx, styles in src/App.css)
- Web Audio API — all sounds generated programmatically, no audio files
- Web Speech API — voice cheers on moves/wins/draws
- Deployed on Vercel

## Key Files
- `src/App.jsx` — entire app: hooks, components, game logic
- `src/App.css` — all styles
- `src/index.css` — minimal reset + root flex layout

## Architecture
Single-file React app. No external state library. Key components:
- `Game` — root component, owns all state
- `Board` — renders the grid, handles click and countdown display
- `Setup` — player name/avatar/mode selection screen
- `Splash` — animated intro screen with scramble animation
- `SwapNames` — Marina/Ana scramble + split + swap animation
- `TournamentWinner` — series champion screen with confetti

## Conventions
- No comments unless the WHY is non-obvious
- Functional components, hooks only (no classes)
- All audio via `useAudio` hook (Web Audio API)
- All speech via `useSpeech` hook (Web Speech API)
- CSS animations via @keyframes, no animation libraries
- Avatar 🤖 is reserved for the computer — never show it for human players

## Features
- Player setup: name (≤16 chars) + emoji avatar
- vs Computer: Easy (random) or Hard (minimax, unbeatable)
- Scoreboard across rounds; turn order alternates each round
- Tournament mode: Best of 3 or Best of 5
- Timed mode: 5-second countdown per turn; auto random move on timeout
- Avatar reactions: winner bounces, loser shakes, draw wiggles
- Voice cheers via SpeechSynthesis
- Ambient background music during gameplay
- Splash screen with intro jingle and name scramble animation

## Don'ts
- Don't split into multiple files — keep everything in App.jsx / App.css
- Don't add npm dependencies without asking
- Don't modify index.html
- Don't use classes or Redux
