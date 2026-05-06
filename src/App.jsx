import { useState, useRef, useEffect } from 'react'
import './App.css'

const AVATARS = ['🐶','🐱','🐯','🦊','🐻','🐼','🐨','🦁','🐸','🐙','🦋','🦄','🐲','🤖','👾','🎃','🌟','🔥','💎','🎯']
const NAME_RE = /^[a-zA-Z0-9 '_-]+$/

function useAudio() {
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

  // Background music — gentle C major pentatonic arpeggio loop
  const bgSchedulerRef = useRef(null)
  const bgNextBeatRef = useRef(0)
  const bgBeatRef = useRef(0)
  const BG_NOTES = [261.63, 329.63, 392.00, 440.00, 392.00, 329.63] // C4 E4 G4 A4 G4 E4
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

    // [frequency, startTime, duration, gainPeak, waveType]
    const score = [
      // — Rising fanfare (0–1.0s) —
      [130.81, 0.00, 0.50, 0.12, 'sine'],     // C3 bass thud
      [261.63, 0.05, 0.20, 0.28, 'triangle'], // C4
      [329.63, 0.22, 0.20, 0.28, 'triangle'], // E4
      [392.00, 0.39, 0.20, 0.28, 'triangle'], // G4
      [523.25, 0.56, 0.45, 0.32, 'triangle'], // C5 peak

      // — Melody (1.1–2.8s) —
      [523.25, 1.10, 0.18, 0.22, 'triangle'], // C5
      [587.33, 1.30, 0.18, 0.22, 'triangle'], // D5
      [659.25, 1.50, 0.30, 0.26, 'triangle'], // E5
      [523.25, 1.90, 0.18, 0.22, 'triangle'], // C5
      [659.25, 2.15, 0.18, 0.22, 'triangle'], // E5
      [784.00, 2.38, 0.55, 0.30, 'triangle'], // G5 hold

      // — Bass walk under melody —
      [130.81, 1.10, 0.35, 0.10, 'sine'],    // C3
      [164.81, 1.50, 0.35, 0.10, 'sine'],    // E3
      [196.00, 1.90, 0.35, 0.10, 'sine'],    // G3
      [261.63, 2.38, 0.60, 0.12, 'sine'],    // C4

      // — Harmony shimmer (2.4–3.2s) —
      [659.25, 2.40, 0.80, 0.10, 'sine'],    // E5
      [783.99, 2.55, 0.80, 0.08, 'sine'],    // G5

      // — Grand resolution chord (3.1–4.8s) —
      [130.81, 3.10, 1.60, 0.14, 'sine'],    // C3
      [261.63, 3.10, 1.60, 0.12, 'sine'],    // C4
      [523.25, 3.10, 1.60, 0.18, 'triangle'],// C5
      [659.25, 3.10, 1.50, 0.12, 'triangle'],// E5
      [783.99, 3.20, 1.40, 0.10, 'triangle'],// G5
      [1046.5, 3.35, 1.20, 0.08, 'sine'],    // C6 sparkle
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

function PlayerSetup({ label, player, takenAvatar, onChange }) {
  const error = player.name.length > 0 && !NAME_RE.test(player.name)

  function handleName(e) {
    const val = e.target.value.slice(0, 16)
    onChange({ ...player, name: val })
  }

  return (
    <div className="player-setup">
      <div className="player-setup-label">{label}</div>
      <div className="avatar-preview">{player.avatar}</div>
      <input
        className={`name-input ${error ? 'name-input-error' : ''}`}
        type="text"
        placeholder="Enter name"
        value={player.name}
        onChange={handleName}
        maxLength={16}
      />
      {error && <div className="name-error">Letters, numbers, spaces, ' _ - only</div>}
      <div className="avatar-grid">
        {AVATARS.map(a => (
          <button
            key={a}
            className={`avatar-btn ${player.avatar === a ? 'avatar-selected' : ''} ${a === takenAvatar ? 'avatar-taken' : ''}`}
            onClick={() => a !== takenAvatar && onChange({ ...player, avatar: a })}
            disabled={a === takenAvatar}
            title={a === takenAvatar ? 'Taken by other player' : undefined}
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  )
}

function GameTitle() {
  return (
    <div className="game-title">
      <h1>Tic-Tac-Toe</h1>
      <p className="dedication">From Marcilio to his lovely daughters Ana and Marina</p>
    </div>
  )
}

const CPU_PLAYER = { name: 'Computer', avatar: '🤖' }

function Setup({ onStart }) {
  const [mode, setMode] = useState('2p')
  const [difficulty, setDifficulty] = useState('hard')
  const [p1, setP1] = useState({ name: 'Ana', avatar: '🐶' })
  const [p2, setP2] = useState({ name: 'Marina', avatar: '🐱' })

  const p1Valid = p1.name.trim().length > 0 && NAME_RE.test(p1.name)
  const p2Valid = p2.name.trim().length > 0 && NAME_RE.test(p2.name)
  const canStart = p1Valid && (mode === 'cpu' || p2Valid)

  function handleStart() {
    onStart(p1, mode === 'cpu' ? CPU_PLAYER : p2, mode, difficulty)
  }

  return (
    <div className="setup">
      <GameTitle />
      <div className="mode-toggle">
        <button className={`mode-btn ${mode === '2p' ? 'mode-btn-active' : ''}`} onClick={() => setMode('2p')}>2 Players</button>
        <button className={`mode-btn ${mode === 'cpu' ? 'mode-btn-active' : ''}`} onClick={() => setMode('cpu')}>vs Computer</button>
      </div>
      <div className="setup-players">
        <PlayerSetup label="Player 1" player={p1} takenAvatar={mode === '2p' ? p2.avatar : CPU_PLAYER.avatar} onChange={setP1} />
        <div className="setup-divider">VS</div>
        {mode === 'cpu' ? (
          <div className="cpu-card">
            <div className="player-setup-label">Computer</div>
            <div className="avatar-preview">🤖</div>
            <div className="difficulty-toggle">
              <button className={`diff-btn ${difficulty === 'easy' ? 'diff-btn-active' : ''}`} onClick={() => setDifficulty('easy')}>Easy</button>
              <button className={`diff-btn ${difficulty === 'hard' ? 'diff-btn-active' : ''}`} onClick={() => setDifficulty('hard')}>Hard</button>
            </div>
          </div>
        ) : (
          <PlayerSetup label="Player 2" player={p2} takenAvatar={p1.avatar} onChange={setP2} />
        )}
      </div>
      <button className="restart-btn" disabled={!canStart} onClick={handleStart}>
        Start Game
      </button>
    </div>
  )
}

function Square({ value, onClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onClick}>
      {value}
    </button>
  )
}

function Board({ squares, onPlay, xIsNext, players, audio, cpuTurn }) {
  const { winner, line } = calculateWinner(squares)
  const isDraw = !winner && squares.every(Boolean)
  const current = players[xIsNext ? 0 : 1]
  const winnerPlayer = winner ? players.find(p => p.avatar === winner) : null

  function handleClick(i) {
    if (squares[i] || winner || cpuTurn) return
    const next = squares.slice()
    next[i] = current.avatar
    const { winner: nextWinner } = calculateWinner(next)
    const nextDraw = !nextWinner && next.every(Boolean)
    if (nextWinner) audio.playWin()
    else if (nextDraw) audio.playDraw()
    else xIsNext ? audio.playX() : audio.playO()
    onPlay(next)
  }

  let status
  if (winnerPlayer) status = `${winnerPlayer.avatar} ${winnerPlayer.name} wins!`
  else if (isDraw) status = "It's a draw!"
  else if (cpuTurn) status = '🤖 Computer is thinking...'
  else status = `${current.avatar} ${current.name}'s turn`

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map(row => (
        <div key={row} className="board-row">
          {[0, 1, 2].map(col => {
            const i = row * 3 + col
            return (
              <Square
                key={i}
                value={squares[i]}
                onClick={() => handleClick(i)}
                highlight={line?.includes(i)}
              />
            )
          })}
        </div>
      ))}
    </>
  )
}

function SwapNames({ active }) {
  const anaRef = useRef(null)
  const marinaRef = useRef(null)
  const [offset, setOffset] = useState(0)
  const [swapped, setSwapped] = useState(false)

  useEffect(() => {
    if (anaRef.current && marinaRef.current) {
      const a = anaRef.current.getBoundingClientRect()
      const m = marinaRef.current.getBoundingClientRect()
      setOffset(m.left - a.left)
    }
  }, [])

  useEffect(() => {
    if (!active) { setSwapped(false); return }
    const id = setInterval(() => setSwapped(s => !s), 2000)
    return () => clearInterval(id)
  }, [active])

  const transition = 'transform 0.9s cubic-bezier(0.68, -0.4, 0.27, 1.4)'

  return (
    <div className="names-swap-area">
      <div className="names-swap-row">
        <span
          ref={anaRef}
          className="splash-names"
          style={{
            display: 'inline-block',
            transform: `translateX(${swapped ? offset : 0}px)`,
            transition,
            position: 'relative',
            zIndex: swapped ? 2 : 1,
          }}
        >Ana</span>
        <span
          ref={marinaRef}
          className="splash-names"
          style={{
            display: 'inline-block',
            transform: `translateX(${swapped ? -offset : 0}px)`,
            transition,
            position: 'relative',
            zIndex: swapped ? 1 : 2,
          }}
        >Marina</span>
      </div>
    </div>
  )
}

function Splash({ onDone, playIntroMusic }) {
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

export default function Game() {
  const [splash, setSplash] = useState(true)
  const [players, setPlayers] = useState(null)
  const [mode, setMode] = useState('2p')
  const [difficulty, setDifficulty] = useState('hard')
  const [scores, setScores] = useState([0, 0])
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [roundStarter, setRoundStarter] = useState(true)
  const audio = useAudio()

  const cpuTurn = mode === 'cpu' && !xIsNext && !calculateWinner(squares).winner && !squares.every(Boolean)

  useEffect(() => {
    if (!cpuTurn || !players) return
    const timer = setTimeout(() => {
      const next = squares.slice()
      const move = difficulty === 'easy'
        ? randomMove(next)
        : bestMove(next, players[0].avatar, players[1].avatar)
      next[move] = players[1].avatar
      const { winner } = calculateWinner(next)
      const isDraw = !winner && next.every(Boolean)
      if (winner) {
        audio.playWin()
        setScores(s => s.map((v, i) => i === 1 ? v + 1 : v))
      } else if (isDraw) {
        audio.playDraw()
      } else {
        audio.playO()
      }
      setSquares(next)
      setXIsNext(true)
    }, 650)
    return () => clearTimeout(timer)
  }, [cpuTurn, squares, players, difficulty])

  if (splash) return <Splash onDone={() => setSplash(false)} playIntroMusic={audio.playIntroMusic} />

  function handleStart(p1, p2, gameMode, gameDifficulty) {
    setPlayers([p1, p2])
    setMode(gameMode)
    setDifficulty(gameDifficulty)
    setScores([0, 0])
    setRoundStarter(true)
    audio.startBgMusic()
  }

  function handlePlay(next) {
    const { winner } = calculateWinner(next)
    if (winner) {
      const idx = players.findIndex(p => p.avatar === winner)
      if (idx !== -1) setScores(s => s.map((v, i) => i === idx ? v + 1 : v))
    }
    setSquares(next)
    setXIsNext(x => !x)
  }

  function restart() {
    const nextStarter = !roundStarter
    setRoundStarter(nextStarter)
    setSquares(Array(9).fill(null))
    setXIsNext(nextStarter)
  }

  function changePlayers() {
    audio.stopBgMusic()
    setPlayers(null)
    setScores([0, 0])
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setRoundStarter(true)
  }

  if (!players) return <Setup onStart={handleStart} />

  return (
    <div className="game">
      <GameTitle />
      <div className="scoreboard">
        {players.map((p, i) => (
          <div key={i} className={`score-card ${xIsNext === (i === 0) ? 'score-card-active' : ''}`}>
            <span className="score-avatar">{p.avatar}</span>
            <span className="score-name">{p.name}</span>
            <span className="score-value">{scores[i]}</span>
          </div>
        ))}
      </div>
      <div className="game-board">
        <Board squares={squares} onPlay={handlePlay} xIsNext={xIsNext} players={players} audio={audio} cpuTurn={cpuTurn} />
      </div>
      <div className="game-buttons">
        <button className="restart-btn" onClick={restart}>Next Round</button>
        <button className="secondary-btn" onClick={changePlayers}>Change Players</button>
      </div>
    </div>
  )
}

function randomMove(squares) {
  const empty = squares.map((s, i) => s === null ? i : null).filter(i => i !== null)
  return empty[Math.floor(Math.random() * empty.length)]
}

function minimax(squares, isMax, humanAvatar, cpuAvatar) {
  const { winner } = calculateWinner(squares)
  if (winner === cpuAvatar) return 10
  if (winner === humanAvatar) return -10
  if (squares.every(Boolean)) return 0
  let best = isMax ? -Infinity : Infinity
  for (let i = 0; i < 9; i++) {
    if (squares[i]) continue
    squares[i] = isMax ? cpuAvatar : humanAvatar
    const score = minimax(squares, !isMax, humanAvatar, cpuAvatar)
    squares[i] = null
    best = isMax ? Math.max(best, score) : Math.min(best, score)
  }
  return best
}

function bestMove(squares, humanAvatar, cpuAvatar) {
  let best = -Infinity, move = -1
  for (let i = 0; i < 9; i++) {
    if (squares[i]) continue
    squares[i] = cpuAvatar
    const score = minimax(squares, false, humanAvatar, cpuAvatar)
    squares[i] = null
    if (score > best) { best = score; move = i }
  }
  return move
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] }
    }
  }
  return { winner: null, line: null }
}
