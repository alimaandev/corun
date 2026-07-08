import { useState, useRef, useCallback, useEffect } from 'react'
import GameCanvas, { GameCanvasHandle } from './GameCanvas'
import ChallengeModal from './ChallengeModal'
import HUD from './HUD'
import StartScreen from './StartScreen'
import GameOverScreen from './GameOverScreen'
import { Challenge, HUDData, Difficulty } from '../game/types'

type Screen = 'start' | 'playing' | 'gameover'

function getTimeLimit(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':   return 3 + Math.random() * 3
    case 'medium': return 4 + Math.random() * 3
    case 'hard':   return 6 + Math.random() * 2
  }
}

export default function Game() {
  const [screen, setScreen] = useState<Screen>('start')
  const [hudData, setHudData] = useState<HUDData>({ score: 0, gap: 70, speed: 1, streak: 0 })
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [timeLimit, setTimeLimit] = useState(5)
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem('coderun_highscore') || '0', 10) }
    catch { return 0 }
  })
  const [finalScore, setFinalScore] = useState(0)

  const gameRef = useRef<GameCanvasHandle>(null)
  const challengeRef = useRef(false)

  const handleStart = useCallback(() => {
    setScreen('playing')
    setHudData({ score: 0, gap: 70, speed: 1, streak: 0 })
    setCurrentChallenge(null)
    challengeRef.current = false
    setTimeout(() => gameRef.current?.startGame(), 50)
  }, [])

  const handleChallenge = useCallback((challenge: Challenge) => {
    if (challengeRef.current) return
    challengeRef.current = true
    setCurrentChallenge(challenge)
    setTimeLimit(getTimeLimit(challenge.difficulty))
  }, [])

  const finishChallenge = useCallback(() => {
    challengeRef.current = false
    setCurrentChallenge(null)
  }, [])

  const handleAnswer = useCallback((answerIndex: number) => {
    if (!currentChallenge) return
    const correct = answerIndex === currentChallenge.correct
    gameRef.current?.handleAnswer(correct)
    finishChallenge()
  }, [currentChallenge, finishChallenge])

  const handleTimeout = useCallback(() => {
    gameRef.current?.handleTimeout()
    finishChallenge()
  }, [finishChallenge])

  const handleGameOver = useCallback((score: number) => {
    setFinalScore(score)
    setScreen('gameover')
    challengeRef.current = false
    setCurrentChallenge(null)
    setHighScore(prev => {
      const nh = Math.max(prev, score)
      if (nh > prev) {
        try { localStorage.setItem('coderun_highscore', String(nh)) } catch {}
      }
      return nh
    })
  }, [])

  const handleRestart = useCallback(() => {
    setScreen('start')
    setFinalScore(0)
    challengeRef.current = false
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        if (screen === 'start') handleStart()
        else if (screen === 'gameover') handleRestart()
      }
      if (currentChallenge && gameRef.current) {
        const n = parseInt(e.key)
        if (n >= 1 && n <= 4 && n <= currentChallenge.options.length) {
          handleAnswer(n - 1)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, handleStart, handleRestart, currentChallenge, handleAnswer])

  return (
    <div style={styles.root}>
      <GameCanvas
        ref={gameRef}
        onChallenge={handleChallenge}
        onGameOver={handleGameOver}
        onHUDUpdate={setHudData}
      />

      {screen === 'playing' && !currentChallenge && (
        <HUD {...hudData} />
      )}

      {screen === 'playing' && currentChallenge && (
        <ChallengeModal
          challenge={currentChallenge}
          timeLimit={timeLimit}
          onAnswer={handleAnswer}
          onTimeout={handleTimeout}
        />
      )}

      {screen === 'start' && (
        <StartScreen highScore={highScore} onStart={handleStart} />
      )}

      {screen === 'gameover' && (
        <GameOverScreen
          score={finalScore}
          highScore={highScore}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
}
