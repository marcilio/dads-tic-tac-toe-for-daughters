# Design Decisions

Non-obvious architectural and design choices for this project.
Each file explains the *why* behind a decision that would otherwise surprise a future reader.

## Index

<!-- Add one line per decision. Be specific enough to judge relevance without opening the file.
     Format: - [NNN-slug.md](NNN-slug.md) — one-line hook naming real concepts/symbols -->

- [001-countdown-two-effects.md](001-countdown-two-effects.md) — `countdown===0` trigger and tick are two separate effects; merging them causes turn-reversal bug via React state updater anti-pattern
- [002-heart-two-positions.md](002-heart-two-positions.md) — `heartPositions.normal` vs `heartPositions.swapped` computed from DOM because Marina and Ana have different rendered widths
- [003-easy-mode-random-not-minimax.md](003-easy-mode-random-not-minimax.md) — `randomMove()` used for Easy difficulty; weakened minimax still wins too often for the target audience
- [004-avatars-as-board-pieces.md](004-avatars-as-board-pieces.md) — board squares hold `player.avatar` strings, not `'X'`/`'O'`; 🤖 reserved for computer and excluded from human picker
- [005-programmatic-audio-no-files.md](005-programmatic-audio-no-files.md) — `AudioContext` created lazily in `getCtx()`; eager creation breaks browser autoplay policy
- [006-gametitle-in-setup-not-own-file.md](006-gametitle-in-setup-not-own-file.md) — `GameTitle` exported from `Setup.jsx` rather than its own file; too small to warrant isolation
- [007-history-tournament-only.md](007-history-tournament-only.md) — only completed tournaments saved to `ttt-history`; practice rounds are ephemeral by design
- [008-practice-mode-single-tournament.md](008-practice-mode-single-tournament.md) — "Casual" renamed to "Practice"; Best of 3 removed; `tournament === null` means Practice, `tournament === 3` means Best of 5
- [009-tournament-prompt-after-practice.md](009-tournament-prompt-after-practice.md) — overlay after every practice round end; Yes resets scores and starts fresh Best of 5; only fires when `tournament === null`
- [010-play-again-restarts-tournament.md](010-play-again-restarts-tournament.md) — "Play Again" on `TournamentWinner` restarts Best of 5; "Change Players" is the only path back to Setup
- [011-hard-cpu-position-aware-blend.md](011-hard-cpu-position-aware-blend.md) — Hard CPU calls `bestMove` only for immediate win/block; all other moves use `randomMove`; pure minimax preserved but unused
- [012-localstorage-schema-and-eviction.md](012-localstorage-schema-and-eviction.md) — `ttt-history` key; 20-entry cap with oldest-first eviction; schema includes date, players, scores, winner, mode, rounds
- [013-history-ux-progressive-disclosure.md](013-history-ux-progressive-disclosure.md) — last result as single hook line below Start button; tap opens slide-up panel with last 20 entries; empty state message on first use
