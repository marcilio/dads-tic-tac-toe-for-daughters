# History shown as single-line hook on Setup with slide-up panel for full list

**Date:** 2026-05-11  
**Status:** Accepted

## Context
History needs to be visible without polluting the Setup screen, especially on mobile. Progressive disclosure — show a little, reveal more on demand — is the right pattern for small screens.

## Decision
- Show the most recent tournament result as a single compact line below the Start button on Setup:
  `🏆 Ana beat Marina 3-1 · Best of 5 · May 11`
- Tapping it opens a slide-up panel showing the last 20 entries in reverse chronological order
- Empty state: subtle message "No tournaments yet — play one to start your history"
- Computer games displayed the same as human games (🤖 avatar as normal)
- Panel is dismissed by a Close button or tapping outside

## Consequences
The hook line takes minimal vertical space and only appears when history exists — no empty placeholder on first use. The slide-up panel is a mobile-native pattern that doesn't require navigation or a separate screen. Reverse chronological order means the most recent result is always at the top without scrolling.
