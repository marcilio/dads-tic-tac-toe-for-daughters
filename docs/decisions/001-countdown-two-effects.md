# Two separate effects for countdown tick and auto-move

**Date:** 2026-05-11  
**Status:** Accepted

## Context
Timed mode needs to tick a 5-second countdown and fire a random move when it reaches zero. The natural approach is to handle both in a single `setInterval` callback — decrement the counter and, when it hits zero, call `handlePlay()`.

## Decision
Split into two `useEffect` hooks: one ticks the countdown with `setInterval`, a second watches for `countdown === 0` and fires `autoMoveRef.current()`.

## Consequences
Calling `handlePlay()` (which calls `setXIsNext`) inside a `setInterval` callback that itself runs inside a state updater is a React anti-pattern — side effects inside state updaters run during render and can execute multiple times. This caused a turn-reversal bug where the timer expiring would flip the active player incorrectly.

The two-effect pattern keeps state updates clean: the tick effect only updates `countdown`, the trigger effect only reacts to `countdown === 0`. Anyone "simplifying" this back to a single effect will reintroduce the turn-reversal bug.
