import { useState, useRef, useEffect } from 'react'

const POOL = 'anamarina'

function useScramble(text) {
  const randChar = () => POOL[Math.floor(Math.random() * POOL.length)]
  const [display, setDisplay] = useState(() => text.split('').map(randChar).join(''))
  const [done, setDone] = useState(false)

  useEffect(() => {
    let frame = 0
    const FRAMES = 40
    const id = setInterval(() => {
      frame++
      const locked = Math.floor((frame / FRAMES) * text.length)
      setDisplay(text.split('').map((ch, i) => i < locked ? ch : randChar()).join(''))
      if (frame >= FRAMES) {
        clearInterval(id)
        setDisplay(text)
        setDone(true)
      }
    }, 50)
    return () => clearInterval(id)
  }, [])

  return { display, done }
}

// phases: scramble -> split (names drift apart) -> swap (they alternate)
function SwapNames({ active }) {
  const marinaRef = useRef(null)
  const anaRef = useRef(null)
  const rowRef = useRef(null)
  const [splitOffset, setSplitOffset] = useState(0)
  const [swapTransform, setSwapTransform] = useState(0)
  // two heart positions: marina-left vs ana-left orientations differ because widths differ
  const [heartPositions, setHeartPositions] = useState(null)
  const [phase, setPhase] = useState('scramble')
  const [swapped, setSwapped] = useState(false)

  const { display: marinaDisplay, done: marinaDone } = useScramble('Marina')
  const { display: anaDisplay, done: anaDone } = useScramble('Ana')
  const bothDone = marinaDone && anaDone

  useEffect(() => {
    if (!bothDone) return
    if (marinaRef.current && anaRef.current && rowRef.current) {
      const m = marinaRef.current.getBoundingClientRect()
      const a = anaRef.current.getBoundingClientRect()
      const row = rowRef.current.getBoundingClientRect()
      const GAP = 32
      const split = GAP / 2
      const centerDist = m.width / 2 + a.width / 2
      setSplitOffset(split)
      setSwapTransform(centerDist + split)
      setHeartPositions({
        normal: m.right - row.left,
        swapped: m.left - row.left + (m.width + a.width) / 2,
      })
    }
    const tid = setTimeout(() => setPhase('split'), 150)
    return () => clearTimeout(tid)
  }, [bothDone])

  useEffect(() => {
    if (phase !== 'split') return
    const tid = setTimeout(() => setPhase('swap'), 900)
    return () => clearTimeout(tid)
  }, [phase])

  useEffect(() => {
    if (phase !== 'swap' || !active) return
    const id = setInterval(() => setSwapped(s => !s), 2000)
    return () => clearInterval(id)
  }, [phase, active])

  useEffect(() => {
    if (!active) setSwapped(false)
  }, [active])

  const splitTrans = phase !== 'scramble' ? 'transform 0.8s ease-out' : 'none'
  const swapTrans = phase === 'swap' ? 'transform 0.9s cubic-bezier(0.68, -0.4, 0.27, 1.4)' : splitTrans

  let marinaX = 0, anaX = 0
  if (phase === 'split') { marinaX = -splitOffset; anaX = splitOffset }
  if (phase === 'swap') {
    marinaX = swapped ? swapTransform : -splitOffset
    anaX = swapped ? -swapTransform : splitOffset
  }

  return (
    <div className="names-swap-area">
      <div ref={rowRef} className="names-swap-row">
        <span
          ref={marinaRef}
          className="splash-names"
          style={{ display: 'inline-block', transform: `translateX(${marinaX}px)`, transition: swapTrans, position: 'relative', zIndex: swapped ? 1 : 2 }}
        >{marinaDisplay}</span>
        <span
          ref={anaRef}
          className="splash-names"
          style={{ display: 'inline-block', transform: `translateX(${anaX}px)`, transition: swapTrans, position: 'relative', zIndex: swapped ? 2 : 1 }}
        >{anaDisplay}</span>
        {heartPositions !== null && (
          <span
            className="names-heart"
            style={{
              left: swapped ? heartPositions.swapped : heartPositions.normal,
              transition: phase === 'swap'
                ? 'left 0.9s cubic-bezier(0.68, -0.4, 0.27, 1.4), opacity 0.6s ease'
                : 'opacity 0.6s ease',
              opacity: phase !== 'scramble' ? 1 : 0,
            }}
          >♥</span>
        )}
      </div>
    </div>
  )
}

export function Splash({ onDone, playIntroMusic }) {
  const [phase, setPhase] = useState('idle')

  function handleTap() {
    if (phase !== 'idle') return
    setPhase('in')
    playIntroMusic()
    setTimeout(() => setPhase('out'), 4200)
    setTimeout(onDone, 5000)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleTap)
    return () => window.removeEventListener('keydown', handleTap)
  }, [phase])

  return (
    <div className={`splash ${phase !== 'idle' ? `splash-${phase}` : ''}`} onClick={handleTap}>
      <h1 className="splash-title">Tic-Tac-Toe</h1>
      <p className="splash-dedication">From Marcilio to his lovely daughters</p>
      <SwapNames active={phase === 'idle'} />
      {phase === 'idle' && <p className="splash-tap">Click or press any key to start</p>}
    </div>
  )
}
