# Hard CPU uses position-aware blend of minimax and random — not pure minimax

**Date:** 2026-05-11  
**Status:** Accepted

## Context
Pure minimax is unbeatable. In a Best of 5 tournament this makes Hard mode punishing and unfun, especially for younger players. We needed Hard to feel challenging but beatable.

## Decision
Hard CPU uses a position-aware blend: minimax when it can win in one move or block the opponent from winning in one move, random otherwise. `bestMove` is only called for immediate win/block situations; all other moves use `randomMove`.

## Consequences
The computer defends and attacks when it matters — it won't hand you a win it could block — but doesn't grind out perfect positional play. This makes it beatable through good strategy without feeling like it's throwing games randomly.

Pure minimax (`bestMove`) is preserved in `gameLogic.js` for potential future use but is no longer called for Hard mode. Easy mode remains pure `randomMove` — unchanged. Anyone restoring `bestMove` for Hard will make the computer unbeatable again.
