# All audio generated programmatically via Web Audio API — no audio files

**Date:** 2026-05-11  
**Status:** Accepted

## Context
The game needs sound effects (move tones, win fanfare, draw tone) and background music. The options were: pre-recorded audio files, a sound library, or the Web Audio API.

## Decision
All sounds are generated programmatically using the Web Audio API in `useAudio.js`. No `.mp3`, `.ogg`, or `.wav` files exist in the project. No audio libraries are used.

## Consequences
Zero asset dependencies — no files to host, version, or license. The entire sound design lives in code and can be tuned by changing frequency/duration/gain values.

The tradeoff is that the Web Audio API requires an `AudioContext`, which browsers suspend until a user gesture occurs. The context is created lazily on first use inside `getCtx()`, which handles this correctly. Any refactor that creates the `AudioContext` eagerly at module load will hit browser autoplay policy errors.

Background music uses a scheduler pattern (`setInterval` lookahead) rather than a single long oscillator, to avoid timing drift over long sessions.
