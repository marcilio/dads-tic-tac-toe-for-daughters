# Rename Casual to Practice; remove Best of 3; single tournament option is Best of 5

**Date:** 2026-05-11  
**Status:** Accepted

## Context
The original mode selector offered Casual, Best of 3, and Best of 5. With history saving tournament sessions only, the mode naming and options needed to align with that model.

## Decision
- Rename "Casual" to "Practice" — better communicates intent (low-commitment, no history)
- Remove "Best of 3" — one tournament format simplifies the UI and decision surface
- Tournament means Best of 5 throughout the codebase (`tournament === 5`, not `2` or `3`)

## Consequences
The `tournament` state in `Game` and `Setup` previously used `null` (casual), `2` (best of 3), `3` (best of 5) as wins-needed values. After this change: `null` = Practice, `3` = Tournament (first to 3 wins in a Best of 5). The value `2` is no longer valid — any code checking `tournament === 2` must be removed.

Simplifying to one tournament format reduces cognitive load for the target audience (two kids) and makes the "Ready for a Tournament?" prompt unambiguous.
