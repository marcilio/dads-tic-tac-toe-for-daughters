# Tic-Tac-Toe

A fun, polished Tic-Tac-Toe web app built with React + Vite.

Made with love by Marcilio for his daughters **Ana** and **Marina**.

🎮 **Play it live:** https://tic-tac-toe-two-iota-73.vercel.app

---

## Features

- **Player setup** — enter your name (up to 16 chars) and pick an emoji avatar
- **Avatar on the board** — pieces show each player's avatar instead of X/O
- **vs Computer** — Easy (random moves) or Hard (blocks your wins, takes its own — beatable with strategy)
- **Practice mode** — open-ended rounds with no score limit; after each round a "Ready for a Tournament?" prompt appears
- **Tournament mode** — Best of 5 series; first to 3 wins crowned champion with confetti; "Play Again" restarts another Best of 5
- **Tournament history** — completed tournaments saved locally; last result shown as a hook on the setup screen, tap to expand full history
- **Scoreboard** — tracks wins across rounds; turn order alternates each round
- **Timed mode** — optional 5-second countdown per turn; auto random move fires on timeout
- **Avatar reactions** — winner bounces, loser shakes, draw wiggles
- **Voice cheers** — Web Speech API announces moves, wins, and draws
- **Audio** — distinct tones per player, win fanfare, draw tone, ambient background music (all programmatic — no audio files)
- **Splash screen** — animated intro with name scramble, swapping animation, and intro jingle

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

### Skill — `/new-design-decision`

**File:** `.claude/skills/new-design-decision/SKILL.md`  
**Trigger:** automatically by Claude at the start of any implementation task

Claude evaluates whether a feature, bug fix, or refactor involves a non-obvious design choice worth capturing. If yes, it creates an ADR-format file in `docs/decisions/` before or after coding and updates the index at `docs/decisions/README.md`.

This keeps architectural reasoning retrievable without burdening the codebase with inline comments. See `docs/decisions/` for all recorded decisions.
