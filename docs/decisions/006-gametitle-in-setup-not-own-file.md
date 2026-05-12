# GameTitle component lives in Setup.jsx, not its own file

**Date:** 2026-05-11  
**Status:** Accepted

## Context
During the App.jsx module split, `GameTitle` needed a home. It is used in two places: inside `Setup` (the player configuration screen) and directly in `Game` (the main game screen). It could have its own file or live inside one of the existing component files.

## Decision
`GameTitle` lives in `Setup.jsx` and is exported as a named export. `Game` in `App.jsx` imports it from there.

## Consequences
A component this small (8 lines) does not warrant its own file — creating `src/components/GameTitle.jsx` would add a file with no meaningful isolation benefit. It lives in `Setup.jsx` because it first appears there and the two are visually cohesive (both are part of the setup screen header).

The slight awkwardness is that `App.jsx` imports `GameTitle` from `Setup.jsx`, which is not immediately intuitive. If `GameTitle` grows significantly or gains its own state, it should be extracted to its own file at that point.
