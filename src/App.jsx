import { useState, useRef } from 'react'
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

  return {
    playX: () => playTone({ frequency: 520, type: 'triangle', duration: 0.18, gainPeak: 0.4 }),
    playO: () => playTone({ frequency: 300, type: 'sine', duration: 0.22, gainPeak: 0.35 }),
    playWin,
    playDraw,
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

function Setup({ onStart }) {
  const [p1, setP1] = useState({ name: '', avatar: '🐶' })
  const [p2, setP2] = useState({ name: '', avatar: '🐱' })

  const p1Valid = p1.name.trim().length > 0 && NAME_RE.test(p1.name)
  const p2Valid = p2.name.trim().length > 0 && NAME_RE.test(p2.name)
  const canStart = p1Valid && p2Valid

  return (
    <div className="setup">
      <h1>Tic-Tac-Toe</h1>
      <p className="setup-subtitle">Set up your players</p>
      <div className="setup-players">
        <PlayerSetup label="Player 1" player={p1} takenAvatar={p2.avatar} onChange={setP1} />
        <div className="setup-divider">VS</div>
        <PlayerSetup label="Player 2" player={p2} takenAvatar={p1.avatar} onChange={setP2} />
      </div>
      <button
        className="restart-btn"
        disabled={!canStart}
        onClick={() => onStart(p1, p2)}
      >
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

function Board({ squares, onPlay, xIsNext, players, audio }) {
  const { winner, line } = calculateWinner(squares)
  const isDraw = !winner && squares.every(Boolean)
  const current = players[xIsNext ? 0 : 1]
  const winnerPlayer = winner ? players.find(p => p.avatar === winner) : null

  function handleClick(i) {
    if (squares[i] || winner) return
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

export default function Game() {
  const [players, setPlayers] = useState(null)
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const current = history[currentMove]
  const xIsNext = currentMove % 2 === 0
  const audio = useAudio()

  function handleStart(p1, p2) {
    setPlayers([p1, p2])
  }

  function handlePlay(next) {
    const nextHistory = history.slice(0, currentMove + 1).concat([next])
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrentMove(0)
  }

  function changePlayers() {
    setPlayers(null)
    setHistory([Array(9).fill(null)])
    setCurrentMove(0)
  }

  if (!players) return <Setup onStart={handleStart} />

  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>
      <div className="player-bar">
        <span className={`player-tag ${xIsNext ? 'player-tag-active' : ''}`}>
          {players[0].avatar} {players[0].name}
        </span>
        <span className={`player-tag ${!xIsNext ? 'player-tag-active' : ''}`}>
          {players[1].avatar} {players[1].name}
        </span>
      </div>
      <div className="game-board">
        <Board squares={current} onPlay={handlePlay} xIsNext={xIsNext} players={players} audio={audio} />
      </div>
      <div className="game-info">
        <div className="game-buttons">
          <button className="restart-btn" onClick={restart}>Restart</button>
          <button className="secondary-btn" onClick={changePlayers}>Change Players</button>
        </div>
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
