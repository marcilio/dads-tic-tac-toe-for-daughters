# Game history saves tournament sessions only — practice rounds are ephemeral

**Date:** 2026-05-11  
**Status:** Accepted

## Context
The game supports two modes: Practice (open-ended rounds) and Tournament (Best of 5). We needed to decide what unit of play to persist in localStorage history.

## Decision
Only completed tournament sessions are saved to history. Practice rounds are not recorded.

## Consequences
Practice is intentionally low-commitment — no defined endpoint, no winner. Saving individual practice rounds would produce a noisy history of disconnected results with no narrative arc. A tournament has a champion, a score, and a defined arc — it's the meaningful unit worth remembering.

The side effect is that a player who only ever plays Practice will never see history. This is acceptable: the "Ready for a Tournament?" overlay after each practice round is the nudge toward tournament play.
