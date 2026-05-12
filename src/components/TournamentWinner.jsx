import { useMemo } from 'react'

function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: ['#e94560','#feca57','#ff9f43','#48dbfb','#ff6b9d','#a29bfe','#55efc4'][Math.floor(Math.random() * 7)],
      delay: Math.random() * 3,
      duration: 2.5 + Math.random() * 2,
      size: 7 + Math.random() * 8,
      rotate: Math.random() * 360,
    })), [])

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`,
          background: p.color,
          width: p.size,
          height: p.size,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          '--rot': `${p.rotate}deg`,
        }} />
      ))}
    </div>
  )
}

export function TournamentWinner({ winner, players, scores, onPlayAgain, onChangePlayers }) {
  return (
    <div className="tournament-screen">
      <Confetti />
      <div className="tw-content">
        <p className="tw-subtitle">Tournament Champion</p>
        <div className="tw-avatar">{winner.avatar}</div>
        <h2 className="tw-name">{winner.name}</h2>
        <div className="tw-scores">
          {players.map((p, i) => (
            <div key={i} className={`tw-score-card ${p === winner ? 'tw-score-winner' : ''}`}>
              <span>{p.avatar}</span>
              <span>{p.name}</span>
              <span className="tw-score-val">{scores[i]}</span>
            </div>
          ))}
        </div>
        <div className="game-buttons">
          <button className="restart-btn" onClick={onPlayAgain}>Play Again</button>
          <button className="secondary-btn" onClick={onChangePlayers}>Change Players</button>
        </div>
      </div>
    </div>
  )
}
