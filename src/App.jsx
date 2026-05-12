import { useState, useRef, useEffect } from 'react'
import './App.css'
import { useAudio } from './hooks/useAudio'
import { useSpeech } from './hooks/useSpeech'
import { calculateWinner, randomMove, bestMove } from './utils/gameLogic'
import { Board } from './components/Board'
import { Setup, GameTitle } from './components/Setup'
import { Splash } from './components/Splash'
import { TournamentWinner } from './components/TournamentWinner'

export default function Game() {
  const [splash, setSplash] = useState(true)
  const [players, setPlayers] = useState(null)
  const [mode, setMode] = useState('2p')
  const [difficulty, setDifficulty] = useState('hard')
  const [tournament, setTournament] = useState(null)
  const [timedMode, setTimedMode] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const autoMoveRef = useRef(null)
  const [scores, setScores] = useState([0, 0])
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [roundStarter, setRoundStarter] = useState(true)
  const [roundResult, setRoundResult] = useState(null)
  const [seriesWinner, setSeriesWinner] = useState(null)
  const audio = useAudio()
  const speech = useSpeech()

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
        speech.announceWin(players[1].name)
        const newScores = scores.map((v, i) => i === 1 ? v + 1 : v)
        setScores(newScores)
        setRoundResult({ winnerIdx: 1 })
        if (tournament && newScores[1] >= tournament) setSeriesWinner(1)
      } else if (isDraw) {
        audio.playDraw()
        speech.announceDraw()
        setRoundResult({ winnerIdx: null })
      } else {
        audio.playO()
      }
      setSquares(next)
      setXIsNext(true)
    }, 650)
    return () => clearTimeout(timer)
  }, [cpuTurn, squares, players, difficulty])

  // Keep autoMoveRef current every render so the interval always has fresh state
  autoMoveRef.current = () => {
    const next = squares.slice()
    const move = randomMove(next)
    if (move === undefined) return
    const currentPlayer = players[xIsNext ? 0 : 1]
    next[move] = currentPlayer.avatar
    const { winner: nextWinner } = calculateWinner(next)
    const nextDraw = !nextWinner && next.every(Boolean)
    if (nextWinner) { audio.playWin(); speech.announceWin(currentPlayer.name) }
    else if (nextDraw) { audio.playDraw(); speech.announceDraw() }
    else { xIsNext ? audio.playX() : audio.playO(); speech.cheerMove(currentPlayer.name) }
    handlePlay(next)
  }

  // Start a fresh 5-second countdown whenever the active player changes
  useEffect(() => {
    if (!timedMode || !players || roundResult || cpuTurn) { setCountdown(null); return }
    setCountdown(5)
    const id = setInterval(() => setCountdown(c => (c <= 1 ? 0 : c - 1)), 1000)
    return () => clearInterval(id)
  }, [xIsNext, timedMode, !!roundResult, cpuTurn, !!players])

  // Fire the auto-move when countdown reaches zero (separate from the tick to avoid
  // calling setState side-effects inside a state updater)
  useEffect(() => {
    if (countdown !== 0) return
    setCountdown(null)
    autoMoveRef.current()
  }, [countdown])

  if (splash) return <Splash onDone={() => setSplash(false)} playIntroMusic={audio.playIntroMusic} />

  const copyright = <p className="game-copyright">© {new Date().getFullYear()} Made with ♥ by <a href="https://www.linkedin.com/in/marcilio/" target="_blank" rel="noreferrer" className="copyright-link">Marcilio</a> for Ana &amp; Marina</p>

  function handleStart(p1, p2, gameMode, gameDifficulty, gameTournament, gameTimed) {
    setPlayers([p1, p2])
    setMode(gameMode)
    setDifficulty(gameDifficulty)
    setTournament(gameTournament)
    setTimedMode(gameTimed)
    setScores([0, 0])
    setRoundStarter(true)
    setRoundResult(null)
    setSeriesWinner(null)
    audio.startBgMusic()
  }

  function handlePlay(next) {
    const { winner } = calculateWinner(next)
    if (winner) {
      const idx = players.findIndex(p => p.avatar === winner)
      if (idx !== -1) {
        const newScores = scores.map((v, i) => i === idx ? v + 1 : v)
        setScores(newScores)
        setRoundResult({ winnerIdx: idx })
        if (tournament && newScores[idx] >= tournament) setSeriesWinner(idx)
      }
    } else if (next.every(Boolean)) {
      setRoundResult({ winnerIdx: null })
    }
    setSquares(next)
    setXIsNext(x => !x)
  }

  function restart() {
    const nextStarter = !roundStarter
    setRoundStarter(nextStarter)
    setSquares(Array(9).fill(null))
    setXIsNext(nextStarter)
    setRoundResult(null)
  }

  function changePlayers() {
    audio.stopBgMusic()
    setPlayers(null)
    setScores([0, 0])
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setRoundStarter(true)
    setRoundResult(null)
    setSeriesWinner(null)
  }

  if (!players) return <><Setup onStart={handleStart} />{copyright}</>

  if (seriesWinner !== null) return (
    <>
      <TournamentWinner
        winner={players[seriesWinner]}
        players={players}
        scores={scores}
        onPlayAgain={() => {
          setScores([0, 0])
          setSquares(Array(9).fill(null))
          setXIsNext(true)
          setRoundStarter(true)
          setRoundResult(null)
          setSeriesWinner(null)
        }}
        onChangePlayers={changePlayers}
      />
      {copyright}
    </>
  )

  const tournamentLabel = tournament ? `Best of ${tournament === 2 ? 3 : 5} — first to ${tournament}` : null

  return (
    <>
    <div className="game">
      <GameTitle />
      {tournamentLabel && <p className="tournament-label-game">{tournamentLabel}</p>}
      <div className="scoreboard">
        {players.map((p, i) => (
          <div key={i} className={`score-card ${xIsNext === (i === 0) ? 'score-card-active' : ''}`}>
            <span className={`score-avatar ${
              roundResult?.winnerIdx === i ? 'avatar-win' :
              roundResult && roundResult.winnerIdx !== null && roundResult.winnerIdx !== i ? 'avatar-lose' :
              roundResult?.winnerIdx === null ? 'avatar-draw' : ''
            }`}>{p.avatar}</span>
            <span className="score-name">{p.name}</span>
            <span className="score-value">{scores[i]}</span>
          </div>
        ))}
      </div>
      <div className="game-board">
        <Board squares={squares} onPlay={handlePlay} xIsNext={xIsNext} players={players} audio={audio} speech={speech} cpuTurn={cpuTurn} countdown={countdown} />
      </div>
      <div className="game-buttons">
        <button className="restart-btn" onClick={restart}>Next Round</button>
        <button className="secondary-btn" onClick={changePlayers}>Change Players</button>
      </div>
    </div>
    {copyright}
    </>
  )
}
