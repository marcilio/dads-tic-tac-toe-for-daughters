# Easy mode uses random moves, not a weakened minimax

**Date:** 2026-05-11  
**Status:** Accepted

## Context
The vs Computer mode offers Easy and Hard difficulty. Hard uses minimax and is unbeatable. Easy needed to feel genuinely beatable for younger or casual players.

## Decision
Easy mode picks a random empty square via `randomMove()`. It does not use a depth-limited or probability-weighted minimax.

## Consequences
A weakened minimax (e.g. random move 30% of the time, minimax 70%) still plays too well and wins often enough to feel unfair. Pure random is the only approach that feels consistently beatable and non-threatening for the target audience — Marcilio's daughters.

The tradeoff is that the computer occasionally makes obviously poor moves. This is intentional: the point of Easy mode is to let players win and build confidence, not to simulate a realistic weak opponent.
