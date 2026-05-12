# "Ready for a Tournament?" overlay appears after every practice round ends

**Date:** 2026-05-11  
**Status:** Accepted

## Context
Practice is the default mode and has no natural endpoint. We needed a way to nudge players toward tournament play (which generates history) without forcing them out of practice.

## Decision
After every practice round ends (win or draw), an overlay appears with "Ready for a Tournament?" and Yes/No options. Yes starts a fresh Best of 5 with the same players and mode. No dismisses the overlay and stays in practice.

## Consequences
The overlay appears after every practice round, not just the first. This keeps the nudge present without burying it. Players who want to stay in practice simply tap No.

Saying Yes resets scores to 0-0 and starts a fresh tournament — practice scores do not carry over. The overlay must not appear mid-tournament (only when `tournament === null`).
