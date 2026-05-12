# Player emoji avatars used as board pieces instead of X and O

**Date:** 2026-05-11  
**Status:** Accepted

## Context
Standard Tic-Tac-Toe uses X and O as board markers. The game is built for two specific players — Ana and Marina — with a personalisation-first design goal.

## Decision
Each player chooses an emoji avatar during setup. That avatar is placed on the board instead of X or O. The computer always uses 🤖 and that avatar is excluded from human player selection.

## Consequences
Board state is tracked by avatar string rather than a fixed `'X'` or `'O'` symbol. `calculateWinner`, `minimax`, and `bestMove` all operate on avatar values — callers pass `players[0].avatar` and `players[1].avatar` rather than hardcoded markers. Any code that assumes `'X'`/`'O'` will break.

The 🤖 avatar reservation is enforced in `PlayerSetup` by filtering it from the avatar grid. This must be maintained if the AVATARS list in `constants.js` is ever changed.
