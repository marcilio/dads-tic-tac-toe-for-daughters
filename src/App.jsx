import { useState, useRef } from 'react'
import './App.css'

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
    // ascending C-E-G arpeggio
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
    // descending two-tone "wah-wah"
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

  return {
    playX: () => playTone({ frequency: 520, type: 'triangle', duration: 0.18, gainPeak: 0.4 }),
    playO: () => playTone({ frequency: 300, type: 'sine', duration: 0.22, gainPeak: 0.35 }),
    playWin,
    playDraw,
  }
}

function Square({ value, onClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onClick}>
      {value}
    </button>
  )
}

function Board({ squares, onPlay, xIsNext, audio }) {
  const { winner, line } = calculateWinner(squares)
  const isDraw = !winner && squares.every(Boolean)

  function handleClick(i) {
    if (squares[i] || winner) return
    const next = squares.slice()
    next[i] = xIsNext ? 'X' : 'O'
    const { winner: nextWinner } = calculateWinner(next)
    const nextDraw = !nextWinner && next.every(Boolean)
    if (nextWinner) audio.playWin()
    else if (nextDraw) audio.playDraw()
    else xIsNext ? audio.playX() : audio.playO()
    onPlay(next)
  }

  let status
  if (winner) status = `Winner: ${winner}`
  else if (isDraw) status = "It's a draw!"
  else status = `Next player: ${xIsNext ? 'X' : 'O'}`

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

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const current = history[currentMove]
  const xIsNext = currentMove % 2 === 0
  const audio = useAudio()

  function handlePlay(next) {
    const nextHistory = history.slice(0, currentMove + 1).concat([next])
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrentMove(0)
  }

  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>
      <div className="game-board">
        <Board squares={current} onPlay={handlePlay} xIsNext={xIsNext} audio={audio} />
      </div>
      <div className="game-info">
        <button className="restart-btn" onClick={restart}>Restart</button>
        <ol>
          {history.map((_, move) => (
            <li key={move}>
              <button onClick={() => setCurrentMove(move)}>
                {move === 0 ? 'Go to start' : `Go to move #${move}`}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
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
