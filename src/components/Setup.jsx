import { useState } from 'react'
import { AVATARS, NAME_RE } from '../constants'

const CPU_PLAYER = { name: 'Computer', avatar: '🤖' }

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
        {AVATARS.filter(a => a !== '🤖').map(a => (
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

export function GameTitle() {
  return (
    <div className="game-title">
      <h1>Tic-Tac-Toe</h1>
      <p className="dedication">From <a href="https://www.linkedin.com/in/marcilio/" target="_blank" rel="noreferrer" className="dedication-link">Marcilio</a> to his lovely daughters Ana and Marina</p>
    </div>
  )
}

export function Setup({ onStart }) {
  const [mode, setMode] = useState('2p')
  const [difficulty, setDifficulty] = useState('hard')
  const [tournament, setTournament] = useState(null)
  const [timed, setTimed] = useState(false)
  const [p1, setP1] = useState({ name: 'Ana', avatar: '🐶' })
  const [p2, setP2] = useState({ name: 'Marina', avatar: '🐱' })

  const p1Valid = p1.name.trim().length > 0 && NAME_RE.test(p1.name)
  const p2Valid = p2.name.trim().length > 0 && NAME_RE.test(p2.name)
  const canStart = p1Valid && (mode === 'cpu' || p2Valid)

  function handleStart() {
    onStart(p1, mode === 'cpu' ? CPU_PLAYER : p2, mode, difficulty, tournament, timed)
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
      <div className="tournament-toggle">
        <span className="tournament-label">Mode</span>
        <div className="mode-toggle">
          <button className={`mode-btn ${tournament === null ? 'mode-btn-active' : ''}`} onClick={() => setTournament(null)}>Casual</button>
          <button className={`mode-btn ${tournament === 2 ? 'mode-btn-active' : ''}`} onClick={() => setTournament(2)}>Best of 3</button>
          <button className={`mode-btn ${tournament === 3 ? 'mode-btn-active' : ''}`} onClick={() => setTournament(3)}>Best of 5</button>
        </div>
      </div>
      <div className="tournament-toggle">
        <span className="tournament-label">Timer</span>
        <div className="mode-toggle">
          <button className={`mode-btn ${!timed ? 'mode-btn-active' : ''}`} onClick={() => setTimed(false)}>Off</button>
          <button className={`mode-btn ${timed ? 'mode-btn-active' : ''}`} onClick={() => setTimed(true)}>5 sec</button>
        </div>
      </div>
      <button className="restart-btn" disabled={!canStart} onClick={handleStart}>
        Start Game
      </button>
    </div>
  )
}
