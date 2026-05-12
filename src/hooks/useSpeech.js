const MOVE_CHEERS = [
  'Good move!', 'Nice one!', 'Awesome play!', 'Brilliant!',
  'Smart thinking!', 'Interesting choice!', 'Well played!',
  'Strong move!', "I like it!", 'Making your mark!', 'Going for it!',
]
const WIN_PHRASES = [
  n => `${n} wins! Amazing!`,
  n => `What a game! ${n} takes it!`,
  n => `Brilliant play, ${n}!`,
  n => `Well done, ${n}! You won!`,
  n => `Unstoppable! ${n} wins!`,
  n => `${n} is on fire!`,
]
const DRAW_PHRASES = [
  "It's a draw! Well played both!",
  "A tie! Nobody wins this time!",
  "What a match! It's a draw!",
  "Equal skills! What a battle!",
  "No winner! Both played great!",
]

export function useSpeech() {
  const ok = typeof window !== 'undefined' && 'speechSynthesis' in window

  function say(text, rate = 1.1, pitch = 1.2) {
    if (!ok) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = rate
    u.pitch = pitch
    u.volume = 0.85
    window.speechSynthesis.speak(u)
  }

  function cheerMove(playerName) {
    if (Math.random() > 0.35) return
    const phrase = MOVE_CHEERS[Math.floor(Math.random() * MOVE_CHEERS.length)]
    say(Math.random() > 0.5 ? `${playerName}! ${phrase}` : phrase)
  }

  function announceWin(playerName) {
    const fn = WIN_PHRASES[Math.floor(Math.random() * WIN_PHRASES.length)]
    say(fn(playerName), 1.0, 1.3)
  }

  function announceDraw() {
    say(DRAW_PHRASES[Math.floor(Math.random() * DRAW_PHRASES.length)])
  }

  return { cheerMove, announceWin, announceDraw }
}
