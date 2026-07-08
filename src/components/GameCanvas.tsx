import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { GameState, Challenge, HUDData, Difficulty } from '../game/types'
import { renderFrame, spawnParticles, updateParticles } from '../game/renderer'
import { getRandomChallenge } from '../game/challenges'

const GAP_START = 70
const GAP_DRAIN = 0.8
const CHALLENGE_MIN = 6000
const CHALLENGE_MAX = 13000
const CORRECT_BOOST = 22
const WRONG_PENALTY = 15
const TIMEOUT_PENALTY = 28
const BOOST_DURATION = 4000
const PENALTY_DURATION = 2500
const BASE_SPEED = 1
const BOOST_SPEED = 1.6
const PENALTY_SPEED = 0.65
const PARTICLE_INTERVAL = 3

export interface GameCanvasHandle {
  startGame: (topic?: string, difficulty?: Difficulty) => void
  handleAnswer: (correct: boolean) => void
  handleTimeout: () => void
}

interface Props {
  onChallenge: (challenge: Challenge) => void
  onGameOver: (score: number) => void
  onHUDUpdate: (data: HUDData) => void
}

const GameCanvas = forwardRef<GameCanvasHandle, Props>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const stateRef = useRef<GameState>({
    score: 0, gap: GAP_START, speed: BASE_SPEED, streak: 0,
    runFrame: 0, scrollOffset: 0, boostUntil: 0, penaltyUntil: 0,
    particles: [], screenShake: 0, lastTime: 0,
  })
  const usedChallengeIds = useRef<Set<number>>(new Set())
  const frameCountRef = useRef(0)
  const lastParticleRef = useRef(0)
  const runningRef = useRef(false)
  const timeoutRef = useRef<number>(0)
  const messageRef = useRef({ text: '', timer: 0 })

  const topicRef = useRef<string | undefined>(undefined)
  const difficultyRef = useRef<Difficulty>('medium')
  const propsRef = useRef(props)
  propsRef.current = props

  function scheduleNext() {
    const delay = CHALLENGE_MIN + Math.random() * (CHALLENGE_MAX - CHALLENGE_MIN)
    const challenge = getRandomChallenge(usedChallengeIds.current, topicRef.current)
    usedChallengeIds.current.add(challenge.id)
    timeoutRef.current = window.setTimeout(() => {
      if (runningRef.current) {
        propsRef.current.onChallenge(challenge)
      }
    }, delay)
  }

  function resetState() {
    const s = stateRef.current
    s.score = 0; s.gap = GAP_START; s.speed = BASE_SPEED; s.streak = 0
    s.runFrame = 0; s.scrollOffset = 0; s.boostUntil = 0; s.penaltyUntil = 0
    s.particles = []; s.screenShake = 0; s.lastTime = 0
    messageRef.current = { text: '', timer: 0 }
    runningRef.current = true
    usedChallengeIds.current.clear()
    frameCountRef.current = 0
    lastParticleRef.current = 0
    clearTimeout(timeoutRef.current)
    scheduleNext()
  }

  useImperativeHandle(ref, () => ({
    startGame(topic?: string, difficulty?: Difficulty) {
      topicRef.current = topic
      if (difficulty) difficultyRef.current = difficulty
      resetState()
    },
    handleAnswer(correct: boolean) {
      const s = stateRef.current
      if (correct) {
        s.gap = Math.min(100, s.gap + CORRECT_BOOST)
        s.streak++
        s.boostUntil = performance.now() + BOOST_DURATION
        s.particles = spawnParticles(s.particles, 0, 0, 15, 'rgba(76,175,80,1)')
        messageRef.current = { text: '+Speed Boost!', timer: 1.5 }
      } else {
        s.gap = Math.max(5, s.gap - WRONG_PENALTY)
        s.streak = 0
        s.penaltyUntil = performance.now() + PENALTY_DURATION
        s.screenShake = 0.5
        s.particles = spawnParticles(s.particles, 0, 0, 10, 'rgba(244,67,54,1)')
        messageRef.current = { text: 'Wrong!', timer: 1.5 }
      }
      scheduleNext()
    },
    handleTimeout() {
      const s = stateRef.current
      s.gap = Math.max(5, s.gap - TIMEOUT_PENALTY)
      s.streak = 0
      s.penaltyUntil = performance.now() + PENALTY_DURATION
      s.screenShake = 0.8
      s.particles = spawnParticles(s.particles, 0, 0, 15, 'rgba(244,67,54,1)')
      messageRef.current = { text: 'Time\'s up!', timer: 2 }
      scheduleNext()
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = window.innerWidth + 'px'
      canvas!.style.height = window.innerHeight + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    function loop(timestamp: number) {
      const s = stateRef.current
      const dt = s.lastTime ? Math.min(timestamp - s.lastTime, 50) : 16.67
      s.lastTime = timestamp
      const dtSec = dt / 1000

      if (runningRef.current) {
        s.runFrame += s.speed * 5 * dtSec
        s.scrollOffset += s.speed * 150 * dtSec

        if (timestamp < s.boostUntil) {
          s.speed = BOOST_SPEED
          s.score += 10 * dtSec
        } else if (timestamp < s.penaltyUntil) {
          s.speed = PENALTY_SPEED
          s.score += 3 * dtSec
        } else {
          s.speed = BASE_SPEED
          s.score += 6 * dtSec
        }

        s.gap -= GAP_DRAIN * s.speed * dtSec

        if (s.screenShake > 0) {
          s.screenShake *= 0.92
          if (s.screenShake < 0.01) s.screenShake = 0
        }

        if (messageRef.current.timer > 0) {
          messageRef.current.timer -= dt / 1000
        }

        lastParticleRef.current++
        if (lastParticleRef.current >= PARTICLE_INTERVAL && s.speed > 0.5) {
          lastParticleRef.current = 0
          const h = canvas!.height / (window.devicePixelRatio || 1)
          s.particles = spawnParticles(
            s.particles,
            canvas!.width / (window.devicePixelRatio || 1) * 0.25,
            h * 0.70,
            1,
            'rgba(150,150,200,1)',
          )
        }

        s.particles = updateParticles(s.particles)

        if (s.gap <= 0) {
          s.gap = 0
          runningRef.current = false
          clearTimeout(timeoutRef.current)
          propsRef.current.onGameOver(Math.floor(s.score))
        }

        frameCountRef.current++
        if (frameCountRef.current % 6 === 0) {
          propsRef.current.onHUDUpdate({
            score: Math.floor(s.score),
            gap: Math.round(s.gap),
            speed: Math.round(s.speed * 10) / 10,
            streak: s.streak,
          })
        }
      }

      const w = canvas!.width / (window.devicePixelRatio || 1)
      const h = canvas!.height / (window.devicePixelRatio || 1)
      ctx!.clearRect(0, 0, w, h)
      renderFrame(ctx!, w, h, s, timestamp, messageRef.current.text, messageRef.current.timer)

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  )
})

export default GameCanvas
