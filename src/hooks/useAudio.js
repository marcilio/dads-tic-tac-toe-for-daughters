import { useRef } from 'react'

export function useAudio() {
  const ctxRef = useRef(null)

  function getCtx() {
    if (!ctxRef.current) ctxRef.current = new AudioContext()
    return ctxRef.current
  }

  function playTone({ frequency, type, duration, gainPeak }) {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    gain.gain.setValueAtTime(gainPeak, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  }

  function playWin() {
    [[523, 0], [659, 0.12], [784, 0.24], [1047, 0.38]].forEach(([freq, delay]) => {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
      gain.gain.setValueAtTime(0, ctx.currentTime + delay)
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + delay + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25)
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 0.25)
    })
  }

  function playDraw() {
    [[440, 0], [330, 0.18]].forEach(([freq, delay]) => {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
      osc.frequency.linearRampToValueAtTime(freq * 0.85, ctx.currentTime + delay + 0.2)
      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.22)
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 0.22)
    })
  }

  const bgSchedulerRef = useRef(null)
  const bgNextBeatRef = useRef(0)
  const bgBeatRef = useRef(0)
  const BG_NOTES = [261.63, 329.63, 392.00, 440.00, 392.00, 329.63]
  const BG_BEAT = 0.45

  function scheduleBgNote(freq, time, ctx) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, time)
    gain.gain.setValueAtTime(0, time)
    gain.gain.linearRampToValueAtTime(0.055, time + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.001, time + BG_BEAT * 0.85)
    osc.start(time)
    osc.stop(time + BG_BEAT)
  }

  function startBgMusic() {
    const ctx = getCtx()
    bgNextBeatRef.current = ctx.currentTime + 0.1
    bgBeatRef.current = 0
    bgSchedulerRef.current = setInterval(() => {
      const ctx = ctxRef.current
      if (!ctx) return
      while (bgNextBeatRef.current < ctx.currentTime + 0.4) {
        scheduleBgNote(
          BG_NOTES[bgBeatRef.current % BG_NOTES.length],
          bgNextBeatRef.current,
          ctx
        )
        bgNextBeatRef.current += BG_BEAT
        bgBeatRef.current++
      }
    }, 100)
  }

  function stopBgMusic() {
    clearInterval(bgSchedulerRef.current)
    bgSchedulerRef.current = null
  }

  function playIntroMusic() {
    const ctx = getCtx()
    const t = ctx.currentTime

    const score = [
      [130.81, 0.00, 0.50, 0.12, 'sine'],
      [261.63, 0.05, 0.20, 0.28, 'triangle'],
      [329.63, 0.22, 0.20, 0.28, 'triangle'],
      [392.00, 0.39, 0.20, 0.28, 'triangle'],
      [523.25, 0.56, 0.45, 0.32, 'triangle'],
      [523.25, 1.10, 0.18, 0.22, 'triangle'],
      [587.33, 1.30, 0.18, 0.22, 'triangle'],
      [659.25, 1.50, 0.30, 0.26, 'triangle'],
      [523.25, 1.90, 0.18, 0.22, 'triangle'],
      [659.25, 2.15, 0.18, 0.22, 'triangle'],
      [784.00, 2.38, 0.55, 0.30, 'triangle'],
      [130.81, 1.10, 0.35, 0.10, 'sine'],
      [164.81, 1.50, 0.35, 0.10, 'sine'],
      [196.00, 1.90, 0.35, 0.10, 'sine'],
      [261.63, 2.38, 0.60, 0.12, 'sine'],
      [659.25, 2.40, 0.80, 0.10, 'sine'],
      [783.99, 2.55, 0.80, 0.08, 'sine'],
      [130.81, 3.10, 1.60, 0.14, 'sine'],
      [261.63, 3.10, 1.60, 0.12, 'sine'],
      [523.25, 3.10, 1.60, 0.18, 'triangle'],
      [659.25, 3.10, 1.50, 0.12, 'triangle'],
      [783.99, 3.20, 1.40, 0.10, 'triangle'],
      [1046.5, 3.35, 1.20, 0.08, 'sine'],
    ]

    score.forEach(([freq, delay, dur, peak, type]) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = type
      osc.frequency.setValueAtTime(freq, t + delay)
      gain.gain.setValueAtTime(0, t + delay)
      gain.gain.linearRampToValueAtTime(peak, t + delay + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur)
      osc.start(t + delay)
      osc.stop(t + delay + dur + 0.05)
    })
  }

  return {
    playX: () => playTone({ frequency: 520, type: 'triangle', duration: 0.18, gainPeak: 0.4 }),
    playO: () => playTone({ frequency: 300, type: 'sine', duration: 0.22, gainPeak: 0.35 }),
    playWin,
    playDraw,
    startBgMusic,
    stopBgMusic,
    playIntroMusic,
  }
}
