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
