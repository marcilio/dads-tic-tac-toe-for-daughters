# "Play Again" after a tournament starts another Best of 5, not practice

**Date:** 2026-05-11  
**Status:** Accepted

## Context
After a tournament ends, players see the TournamentWinner screen with "Play Again" and "Change Players" buttons. We needed to decide what "Play Again" means in this context.

## Decision
"Play Again" on the TournamentWinner screen restarts another Best of 5 tournament with the same players and mode. It does not return to Practice. "Change Players" always returns to Setup.

## Consequences
Players who want a rematch stay in tournament mode — the competitive context is preserved. Players who want to go back to casual play use "Change Players" and reconfigure from Setup. This keeps the two modes cleanly separated post-tournament.
