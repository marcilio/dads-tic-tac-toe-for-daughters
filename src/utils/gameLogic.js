export function calculateWinner(squares) {
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

export function randomMove(squares) {
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

export function bestMove(squares, humanAvatar, cpuAvatar) {
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

// See docs/decisions/011-hard-cpu-position-aware-blend.md
export function hardMove(squares, humanAvatar, cpuAvatar) {
  for (let i = 0; i < 9; i++) {
    if (squares[i]) continue
    squares[i] = cpuAvatar
    const { winner } = calculateWinner(squares)
    squares[i] = null
    if (winner) return i
  }
  for (let i = 0; i < 9; i++) {
    if (squares[i]) continue
    squares[i] = humanAvatar
    const { winner } = calculateWinner(squares)
    squares[i] = null
    if (winner) return i
  }
  return randomMove(squares)
}
