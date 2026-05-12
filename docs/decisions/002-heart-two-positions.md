# Two heart positions for asymmetric name widths in SwapNames

**Date:** 2026-05-11  
**Status:** Accepted

## Context
The splash screen animates "Marina" and "Ana" swapping positions with a red heart centered in the gap between them. The heart must stay visually centered as the names alternate sides.

## Decision
Compute two distinct heart positions from DOM measurements after both names finish scrambling:
- `normal`: `m.right - row.left` — gap center when Marina is on the left
- `swapped`: `m.left - row.left + (m.width + a.width) / 2` — gap center when Ana is on the left

The heart transitions between these two values using the same cubic-bezier as the name swap.

## Consequences
"Marina" and "Ana" have different rendered widths, so the midpoint of the gap shifts depending on which name is on which side. A single centered position looks correct in one orientation and visibly off in the other. Anyone replacing this with a single `50%` or a static offset will break centering in one of the two swap orientations.

Positions are computed once via `getBoundingClientRect()` after the scramble animation completes, when the DOM has settled to final dimensions.
