# localStorage schema for tournament history and 20-entry eviction

**Date:** 2026-05-11  
**Status:** Accepted

## Context
Tournament results need to be persisted across sessions in localStorage. We needed to define the schema and how many entries to keep.

## Decision
Store an array of tournament session objects under the key `ttt-history` in localStorage. Cap at 20 entries — evict the oldest when the limit is reached.

Schema per entry:
```json
{
  "date": "2026-05-11T21:00:00",
  "players": [
    { "name": "Ana", "avatar": "🐶" },
    { "name": "Marina", "avatar": "🐱" }
  ],
  "scores": [3, 1],
  "winner": "Ana",
  "mode": "2p",
  "rounds": 4
}
```

## Consequences
- `mode` is `"2p"` or `"cpu"` — distinguishes human vs human from human vs computer
- `winner` is the player name string — readable without dereferencing, tolerates future player object changes
- `rounds` is the total number of rounds played in the session
- 20 entries is generous for a family game and well within the ~5MB localStorage limit
- No time-based eviction — oldest entry is removed when the 21st is added
- localStorage is device and browser specific — history does not sync across devices
