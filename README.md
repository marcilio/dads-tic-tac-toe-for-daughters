# Tic-Tac-Toe

A fun, polished Tic-Tac-Toe web app built with React + Vite.

Made with love by Marcilio for his daughters **Ana** and **Marina**.

🎮 **Play it live:** https://tic-tac-toe-two-iota-73.vercel.app

---

## Features

- **Player setup** — enter your name (up to 16 chars) and pick an emoji avatar
- **Avatar on the board** — pieces show each player's avatar instead of X/O
- **vs Computer** — play against an AI with Easy (random) or Hard (unbeatable minimax) difficulty
- **Scoreboard** — tracks wins across rounds; turns alternate who starts each game
- **Tournament mode** — Best of 3 or Best of 5 series with a champion screen and confetti
- **Avatar reactions** — winner bounces, loser shakes, draw wiggles
- **Audio** — distinct sounds for each player's move, win fanfare, draw tone, and ambient background music
- **Splash screen** — animated intro with names swapping, intro jingle, and a 5-second countdown

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- Web Audio API (all sounds generated programmatically — no audio files)
- Deployed on [Vercel](https://vercel.com/)

---

## Claude Code Automation

This project uses [Claude Code](https://claude.ai/code) as an AI coding assistant. Rather than treating Claude as a plain chat tool, we configured it with project-specific **hooks** and **commands** — automation that runs automatically or on demand to keep code quality consistent and deployments safe.

The rationale: the more autonomously Claude edits files, the more important it is to have guardrails that catch problems *immediately*, in the same session where the edit happened. Waiting until a CI run or a manual lint step means errors accumulate. Catching them right after the edit keeps the feedback loop tight.

### Hook — ESLint on every edit

**File:** `.claude/hooks/post-edit-lint.sh`  
**Trigger:** automatically after Claude uses `Edit` or `Write` on any file

Whenever Claude creates or modifies a `.js` or `.jsx` file, ESLint runs on that file before the next action. Claude sees the output inline and can fix violations immediately — no separate lint step required. CSS, JSON, and other file types are skipped.

```
.claude/
├── hooks/
│   └── post-edit-lint.sh   ← shell script invoked by the hook
└── settings.json           ← declares the PostToolUse hook binding
```

`settings.json` wires it up:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/post-edit-lint.sh" }
        ]
      }
    ]
  }
}
```

### Command — `/deploy`

**File:** `.claude/commands/deploy.md`  
**Trigger:** type `/deploy` in the Claude Code prompt

A custom slash command that encodes the safe deploy procedure as a reusable instruction. Instead of asking Claude to "deploy the app" and hoping it follows the right steps, `/deploy` tells it precisely: run `npm run build` first, then `vercel --prod`, then confirm the live URL. It acts as a runbook written once and reused on every deploy.

```
/deploy   →   npm run build → vercel --prod → confirm https://tic-tac-toe-two-iota-73.vercel.app
```

Both the hook and the command live in `.claude/`, which is committed to the repo so any contributor (or future Claude session) picks them up automatically.
