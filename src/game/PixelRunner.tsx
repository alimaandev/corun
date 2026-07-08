import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Challenge, HUDData, Difficulty } from './types'
import { getRandomChallenge } from './challenges'

const GAP_START = 60
const GAP_DRAIN = 1.8
const CHALLENGE_MIN = 2500
const CHALLENGE_MAX = 6000
const CORRECT_BOOST = 25
const WRONG_PENALTY = 18
const TIMEOUT_PENALTY = 30
const BOOST_DURATION = 3500
const PENALTY_DURATION = 2000
const BASE_SPEED = 1
const BOOST_SPEED = 2.0
const PENALTY_SPEED = 0.5
const LANE_W = 60
const PLAYER_W = 28
const PLAYER_H = 36

export interface PixelRunnerHandle {
  startGame: (topic?: string, difficulty?: Difficulty) => void
  handleAnswer: (correct: boolean) => void
  handleTimeout: () => void
  setPaused: (paused: boolean) => void
  setMultiplier: (mult: number) => void
  setPreferredDifficulty: (diff?: string) => void
}

interface Props {
  topic?: string
  difficulty?: Difficulty
  onChallenge: (challenge: Challenge) => void
  onGameOver: (score: number) => void
  onHUDUpdate: (data: HUDData) => void
}

interface GameS {
  score: number; gap: number; speed: number; streak: number
  currentLane: number; runDist: number
  boostUntil: number; penaltyUntil: number
  scrollY: number; screenShake: number
  paused: boolean; multiplier: number
}

function drawPixelPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  ctx.imageSmoothingEnabled = false
  const s = 2
  const legSwing = Math.sin(frame * 0.12) * 3

  ctx.fillStyle = '#fc0000'
  ctx.fillRect(x - 6 * s, y - 18 * s, 12 * s, 5 * s)

  ctx.fillStyle = '#fcb8a0'
  ctx.fillRect(x - 5 * s, y - 13 * s, 10 * s, 5 * s)
  ctx.fillRect(x - 3 * s, y - 8 * s, 6 * s, 2 * s)

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x - 3 * s, y - 11 * s, 2 * s, 2 * s)
  ctx.fillRect(x + 1 * s, y - 11 * s, 2 * s, 2 * s)

  ctx.fillStyle = '#000'
  ctx.fillRect(x - 2 * s, y - 10 * s, 1 * s, 1 * s)
  ctx.fillRect(x + 1 * s, y - 10 * s, 1 * s, 1 * s)

  ctx.fillStyle = '#fc0000'
  ctx.fillRect(x - 6 * s, y - 6 * s, 12 * s, 10 * s)

  ctx.fillStyle = '#fcb8a0'
  ctx.fillRect(x - 8 * s, y - 4 * s, 3 * s, 7 * s)
  ctx.fillRect(x + 5 * s, y - 4 * s, 3 * s, 7 * s)

  ctx.fillStyle = '#0000b0'
  ctx.fillRect(x - 5 * s, y + 4 * s, 4 * s, 7 * s)
  ctx.fillRect(x + 1 * s, y + 4 * s, 4 * s, 7 * s)

  ctx.fillStyle = '#8B4513'
  ctx.fillRect(x - 5 * s, y + 4 * s + legSwing, 4 * s, 3 * s)
  ctx.fillRect(x + 1 * s, y + 4 * s - legSwing, 4 * s, 3 * s)
}

function drawPixelMonster(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, danger: number) {
  ctx.imageSmoothingEnabled = false
  const s = 2
  const bob = Math.sin(frame * 0.12) * 5 * danger
  const sc = 0.55 + danger * 0.95
  const sx = x
  const sy = y + bob

  ctx.save()
  ctx.translate(sx, sy)
  ctx.scale(sc, sc)
  ctx.translate(-sx, -sy)

  ctx.fillStyle = '#1a1a00'
  ctx.fillRect(x - 14 * s, y - 10 * s, 28 * s, 20 * s)

  ctx.fillStyle = '#2a2a00'
  ctx.fillRect(x - 16 * s, y - 12 * s, 32 * s, 16 * s)
  ctx.fillRect(x - 14 * s, y - 14 * s, 28 * s, 4 * s)
  ctx.fillRect(x - 12 * s, y - 18 * s, 24 * s, 6 * s)

  ctx.fillStyle = '#ff0000'
  ctx.fillRect(x - 8 * s, y - 14 * s, 6 * s, 6 * s)
  ctx.fillRect(x + 2 * s, y - 14 * s, 6 * s, 6 * s)
  ctx.fillStyle = '#ffff00'
  ctx.fillRect(x - 6 * s, y - 12 * s, 2 * s, 2 * s)
  ctx.fillRect(x + 4 * s, y - 12 * s, 2 * s, 2 * s)

  ctx.fillStyle = '#3a3a00'
  ctx.fillRect(x - 4 * s, y - 22 * s, 3 * s, 5 * s)
  ctx.fillRect(x + 1 * s, y - 22 * s, 3 * s, 5 * s)

  ctx.fillStyle = '#8B0000'
  ctx.fillRect(x - 10 * s, y + 2 * s, 20 * s, 3 * s)

  ctx.fillStyle = '#ffffff'
  for (let tx = -8 * s; tx <= 6 * s; tx += 4 * s) {
    ctx.fillRect(x + tx, y + 1 * s, 2 * s, 3 * s)
  }

  ctx.fillStyle = '#0a0a00'
  ctx.fillRect(x - 14 * s, y + 8 * s, 8 * s, 6 * s)
  ctx.fillRect(x + 6 * s, y + 8 * s, 8 * s, 6 * s)

  ctx.restore()
}

function drawRoad(ctx: CanvasRenderingContext2D, w: number, h: number, scroll: number, speed: number) {
  const roadW = LANE_W * 3
  const roadX = (w - roadW) / 2

  ctx.fillStyle = '#7a7a5a'
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#5a5a3a'
  ctx.fillRect(roadX, 0, roadW, h)

  ctx.fillStyle = '#4a4a2a'
  ctx.fillRect(roadX, 0, roadW, 3)

  ctx.fillStyle = '#ffff00'
  const laneH = 30
  const gap = 20
  const total = laneH + gap
  const offset = scroll % total
  for (let lane = -1; lane <= 1; lane++) {
    const lx = roadX + (lane + 1) * LANE_W + (LANE_W - 4) / 2
    for (let y = -total + offset; y < h + total; y += total) {
      ctx.fillRect(lx, y, 4, laneH)
    }
  }

  ctx.fillStyle = '#3a3a2a'
  ctx.fillRect(roadX - 6, 0, 6, h)
  ctx.fillRect(roadX + roadW, 0, 6, h)
}

function drawPixelCloud(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, seed: number) {
  const patterns = [
    [[0,0,0,1,1,1,0,0,0],[0,1,1,1,1,1,1,0,0],[1,1,1,1,1,1,1,1,0],[1,1,1,0,0,0,1,1,1]],
    [[0,0,0,0,1,1,1,0,0,0],[0,0,1,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,1,1,0],[1,1,1,1,0,0,0,1,1,1]],
    [[0,0,1,1,1,0,0,0],[0,1,1,1,1,1,0,0],[1,1,1,1,1,1,1,0],[1,1,1,0,0,1,1,1]],
  ]
  const pat = patterns[seed % patterns.length]
  const rows = pat.length
  const cols = pat[0].length
  const bw = Math.floor(w / cols)
  const bh = Math.floor(bw * 0.6)
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pat[r][c]) ctx.fillRect(x + c * bw, y + r * bh, bw, bh)
    }
  }
}

function drawTrees(ctx: CanvasRenderingContext2D, w: number, h: number, scroll: number) {
  const treeSpacing = 80
  const offset = scroll % treeSpacing

  for (let y = -treeSpacing + offset; y < h + treeSpacing; y += treeSpacing) {
    const leftX = 16
    const rightX = w - 16 - 12

    ctx.fillStyle = '#4a2a0a'
    ctx.fillRect(leftX + 4, y + 40, 6, 20)
    ctx.fillRect(rightX + 2, y + 40, 6, 20)

    ctx.fillStyle = '#2a7a2a'
    ctx.fillRect(leftX, y + 28, 14, 14)
    ctx.fillRect(leftX + 2, y + 20, 10, 10)
    ctx.fillRect(rightX - 2, y + 28, 14, 14)
    ctx.fillRect(rightX, y + 20, 10, 10)

    ctx.fillStyle = '#3a9a3a'
    ctx.fillRect(leftX + 6, y + 16, 2, 4)
    ctx.fillRect(rightX + 4, y + 16, 2, 4)
  }
}

function drawSpeedLines(ctx: CanvasRenderingContext2D, w: number, h: number, speed: number, frame: number) {
  if (speed <= 0.8) return
  const count = Math.floor((speed - 0.8) * 8)
  for (let i = 0; i < count; i++) {
    const lx = (i * 73 + frame * speed * 3) % w
    const ly = (i * 47 + frame * speed * 2) % h
    const lh = 8 + (i % 4) * 4
    ctx.fillStyle = `rgba(255,255,255,${(speed - 0.8) * 0.06})`
    ctx.fillRect(lx, ly, 2, lh)
  }
}

const PixelRunner = forwardRef<PixelRunnerHandle, Props>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<GameS>({
    score: 0, gap: GAP_START, speed: BASE_SPEED, streak: 0,
    currentLane: 0, runDist: 0, boostUntil: 0, penaltyUntil: 0,
    scrollY: 0, screenShake: 0,
    paused: false, multiplier: 1,
  })
  const gameRunning = useRef(false)
  const gameOverFired = useRef(false)
  const gameInitialized = useRef(false)
  const topicRef = useRef<string | undefined>(undefined)
  const diffRef = useRef<string | undefined>(undefined)
  const usedChallengeIds = useRef<Set<number>>(new Set())
  const challengeTimerRef = useRef<number>(0)
  const frameCountRef = useRef(0)
  const propsRef = useRef(props)
  const animRef = useRef<number>(0)
  const startTimeRef = useRef(0)
  propsRef.current = props

  const autoStartRef = useRef({ topic: props.topic })

  useEffect(() => {
    topicRef.current = autoStartRef.current.topic
    resetState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playerX = () => {
    const cw = canvasRef.current?.width || window.innerWidth
    const roadW = LANE_W * 3
    const roadX = (cw - roadW) / 2
    return roadX + (stateRef.current.currentLane + 1) * LANE_W + LANE_W / 2
  }

  const playerY = () => (canvasRef.current?.height || window.innerHeight) - 100

  const monsterY = () => {
    const s = stateRef.current
    const danger = Math.max(0, Math.min(1, (GAP_START - s.gap) / GAP_START))
    return playerY() + 25 + (1 - danger) * 130
  }

  function scheduleChallenge() {
    const s = stateRef.current
    if (s.paused) return
    const delay = CHALLENGE_MIN + Math.random() * (CHALLENGE_MAX - CHALLENGE_MIN)
    challengeTimerRef.current = window.setTimeout(() => {
      if (gameRunning.current && !stateRef.current.paused) {
        const challenge = getRandomChallenge(usedChallengeIds.current, topicRef.current, diffRef.current)
        usedChallengeIds.current.add(challenge.id)
        propsRef.current.onChallenge(challenge)
      }
    }, delay)
  }

  function resetState() {
    const s = stateRef.current
    s.score = 0; s.gap = GAP_START; s.speed = BASE_SPEED; s.streak = 0
    s.currentLane = 0; s.runDist = 0; s.boostUntil = 0; s.penaltyUntil = 0
    s.scrollY = 0; s.screenShake = 0
    s.paused = false; s.multiplier = 1
    gameRunning.current = true
    gameOverFired.current = false
    gameInitialized.current = true
    usedChallengeIds.current.clear()
    frameCountRef.current = 0
    startTimeRef.current = performance.now()
    clearTimeout(challengeTimerRef.current)
    scheduleChallenge()
  }

  useImperativeHandle(ref, () => ({
    startGame(topic?: string) {
      topicRef.current = topic
      resetState()
    },
    handleAnswer(correct: boolean) {
      const s = stateRef.current
      if (correct) {
        s.gap = Math.min(100, s.gap + CORRECT_BOOST)
        s.streak++
        s.boostUntil = performance.now() + BOOST_DURATION
      } else {
        s.gap = Math.max(5, s.gap - WRONG_PENALTY)
        s.streak = 0
        s.penaltyUntil = performance.now() + PENALTY_DURATION
        s.screenShake = 0.5
      }
      clearTimeout(challengeTimerRef.current)
      scheduleChallenge()
    },
    handleTimeout() {
      const s = stateRef.current
      s.gap = Math.max(5, s.gap - TIMEOUT_PENALTY)
      s.streak = 0
      s.penaltyUntil = performance.now() + PENALTY_DURATION
      s.screenShake = 0.8
      clearTimeout(challengeTimerRef.current)
      scheduleChallenge()
    },
    setPaused(paused: boolean) {
      stateRef.current.paused = paused
      if (paused) clearTimeout(challengeTimerRef.current)
    },
    setMultiplier(mult: number) {
      stateRef.current.multiplier = mult
    },
    setPreferredDifficulty(diff?: string) {
      diffRef.current = diff
    },
  }))

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!gameRunning.current) return
      const s = stateRef.current
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        s.currentLane = Math.max(-1, s.currentLane - 1)
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        s.currentLane = Math.min(1, s.currentLane + 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameInitialized.current) return
      if (!gameRunning.current) {
        if (!gameOverFired.current) {
          gameOverFired.current = true
          propsRef.current.onGameOver(Math.floor(stateRef.current.score))
        }
        return
      }
      frameCountRef.current++
      if (frameCountRef.current % 8 === 0) {
        const s = stateRef.current
        propsRef.current.onHUDUpdate({
          score: Math.floor(s.score),
          gap: Math.round(s.gap),
          speed: Math.round(s.speed * 10) / 10,
          streak: s.streak,
        })
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let anim = 0

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    function loop(ts: number) {
      const s = stateRef.current
      const elapsed = (ts - startTimeRef.current) / 1000
      const dt = Math.min((ts - (s.runDist || ts)) / 1000, 0.05)
      s.runDist = ts

      if (gameRunning.current) {
        s.scrollY += s.speed * 4

        if (!s.paused) {
          const now = performance.now()
          if (now < s.boostUntil) {
            s.speed = BOOST_SPEED
            s.score += 10 * dt * s.multiplier
          } else if (now < s.penaltyUntil) {
            s.speed = PENALTY_SPEED
            s.score += 3 * dt * s.multiplier
          } else {
            s.speed = BASE_SPEED
            s.score += 6 * dt * s.multiplier
          }

          s.gap -= GAP_DRAIN * s.speed * dt
        }

        if (s.screenShake > 0) {
          s.screenShake *= 0.9
          if (s.screenShake < 0.01) s.screenShake = 0
        }

        if (s.gap <= 0) {
          s.gap = 0
          gameRunning.current = false
        }
      }

      const w = canvas.width
      const h = canvas.height

      ctx.save()

      if (s.screenShake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * s.screenShake * 6,
          (Math.random() - 0.5) * s.screenShake * 6,
        )
      }

      const skyH = Math.floor(h * 0.32)
      const grad = ctx.createLinearGradient(0, 0, 0, skyH)
      grad.addColorStop(0, '#2a4a7a')
      grad.addColorStop(1, '#7ab8fc')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, skyH)

      for (let i = 0; i < 3; i++) {
        const cx = ((i * w * 0.25 + ts * 0.008 * (1 + i * 0.3)) % (w + 120)) - 60
        const cy = 10 + i * 25
        drawPixelCloud(ctx, cx, cy, 50 + i * 10, i)
      }

      ctx.fillStyle = '#2a5a2a'
      ctx.beginPath()
      ctx.moveTo(0, skyH - 8)
      for (let x = 0; x <= w; x += 8) {
        ctx.lineTo(x, skyH - 8 + Math.sin(x * 0.006 + 2) * 16 + Math.sin(x * 0.014) * 8)
      }
      ctx.lineTo(w, skyH + 20)
      ctx.lineTo(0, skyH + 20)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#3a7a3a'
      ctx.fillRect(0, skyH + 12, w, h - skyH)

      drawRoad(ctx, w, h, s.scrollY, s.speed)
      drawTrees(ctx, w, h, s.scrollY)

      const danger = Math.max(0, Math.min(1, (GAP_START - s.gap) / GAP_START))
      drawPixelMonster(ctx, playerX(), monsterY(), ts * 0.001, danger)
      drawPixelPlayer(ctx, playerX(), playerY(), ts * 0.001)

      drawSpeedLines(ctx, w, h, s.speed, ts * 0.001)

      if (s.gap < GAP_START * 0.35) {
        const intense = 1 - s.gap / (GAP_START * 0.35)
        ctx.fillStyle = `rgba(255,0,0,${intense * 0.12})`
        ctx.fillRect(0, 0, w, h)
        const bw = 4 + intense * 8
        ctx.strokeStyle = `rgba(255,0,0,${intense * 0.4})`
        ctx.lineWidth = bw
        ctx.strokeRect(bw / 2, bw / 2, w - bw, h - bw)
      }

      ctx.restore()

      anim = requestAnimationFrame(loop)
    }

    anim = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(anim)
      clearTimeout(challengeTimerRef.current)
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
        imageRendering: 'pixelated',
      }}
    />
  )
})

export default PixelRunner
