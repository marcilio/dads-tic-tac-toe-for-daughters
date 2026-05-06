import { useState } from 'react'
import './App.css'

function Square({ value, onClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onClick}>
      {value}
    </button>
  )
}

function Board({ squares, onPlay, xIsNext }) {
  const { winner, line } = calculateWinner(squares)
  const isDraw = !winner && squares.every(Boolean)

  function handleClick(i) {
    if (squares[i] || winner) return
    const next = squares.slice()
    next[i] = xIsNext ? 'X' : 'O'
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
        <Board squares={current} onPlay={handlePlay} xIsNext={xIsNext} />
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
