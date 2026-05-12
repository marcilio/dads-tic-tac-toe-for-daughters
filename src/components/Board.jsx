import { calculateWinner } from '../utils/gameLogic'

function Square({ value, onClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onClick}>
      {value}
    </button>
  )
}

export function Board({ squares, onPlay, xIsNext, players, audio, speech, cpuTurn, countdown }) {
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
    if (nextWinner) { audio.playWin(); speech.announceWin(current.name) }
    else if (nextDraw) { audio.playDraw(); speech.announceDraw() }
    else { xIsNext ? audio.playX() : audio.playO(); speech.cheerMove(current.name) }
    onPlay(next)
  }

  let status
  if (winnerPlayer) status = `${winnerPlayer.avatar} ${winnerPlayer.name} wins!`
  else if (isDraw) status = "It's a draw!"
  else if (cpuTurn) status = '🤖 Computer is thinking...'
  else status = `${current.avatar} ${current.name}'s turn`

  const countdownLevel = countdown >= 3 ? 'safe' : countdown === 2 ? 'warn' : 'danger'

  return (
    <>
      <div className="status-row">
        <div className="status">{status}</div>
        {countdown !== null && (
          <div className="countdown" data-level={countdownLevel}>{countdown}</div>
        )}
      </div>
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
