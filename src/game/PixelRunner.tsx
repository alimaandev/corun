import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Challenge, HUDData, Difficulty } from './types'
import { getRandomChallenge, clearAIPool } from './challenges'
import { THEMES, LevelTheme } from './themes'


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
let PX_SCALE = 2
function updateScale(w: number) {
  PX_SCALE = Math.max(1.5, Math.min(3, Math.floor(w / 200)))
}
const LANE_W = () => PX_SCALE * 30
const PLAYER_W = () => PX_SCALE * 14
const PLAYER_H = () => PX_SCALE * 18

export interface PixelRunnerHandle {
  startGame: (topic?: string, difficulty?: Difficulty) => void
  handleAnswer: (correct: boolean) => void
  handleTimeout: () => void
  setPaused: (paused: boolean) => void
  setMultiplier: (mult: number) => void
  setPreferredDifficulty: (diff?: string) => void
  startRecording: () => void
  stopRecording: () => Promise<Blob | null>
  isRecording: () => boolean
}

interface Props {
  topic?: string
  difficulty?: Difficulty
  themeId?: number
  onChallenge: (challenge: Challenge) => void
  onGameOver: (score: number) => void
  onHUDUpdate: (data: HUDData) => void
}

interface GameS {
  score: number; gap: number; speed: number; streak: number
  currentLane: number
  displayLane: number
  boostUntil: number; penaltyUntil: number
  scrollY: number; screenShake: number
  flashTimer: number
  flashGreen: boolean
  paused: boolean; multiplier: number
}

function drawPixelPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  ctx.imageSmoothingEnabled = false
  const s = PX_SCALE
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

function drawPixelMonster(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, danger: number, theme?: LevelTheme) {
  ctx.imageSmoothingEnabled = false
  const s = PX_SCALE
  const bob = Math.sin(frame * 0.12) * 5 * danger
  const sc = 0.55 + danger * 0.95
  const sx = x
  const sy = y + bob

  ctx.save()
  ctx.translate(sx, sy)
  ctx.scale(sc, sc)
  ctx.translate(-sx, -sy)

  const body = theme?.monsterBody || '#1a1a00'
  const eye = theme?.monsterEye || '#ff0000'
  const mouth = theme?.monsterMouth || '#8B0000'
  const teeth = theme?.monsterTeeth || '#ffffff'

  ctx.fillStyle = body
  ctx.fillRect(x - 14 * s, y - 10 * s, 28 * s, 20 * s)

  ctx.fillStyle = body
  ctx.fillRect(x - 16 * s, y - 12 * s, 32 * s, 16 * s)
  ctx.fillRect(x - 14 * s, y - 14 * s, 28 * s, 4 * s)
  ctx.fillRect(x - 12 * s, y - 18 * s, 24 * s, 6 * s)

  ctx.fillStyle = eye
  ctx.fillRect(x - 8 * s, y - 14 * s, 6 * s, 6 * s)
  ctx.fillRect(x + 2 * s, y - 14 * s, 6 * s, 6 * s)
  ctx.fillStyle = '#ffff00'
  ctx.fillRect(x - 6 * s, y - 12 * s, 2 * s, 2 * s)
  ctx.fillRect(x + 4 * s, y - 12 * s, 2 * s, 2 * s)

  ctx.fillStyle = body
  ctx.fillRect(x - 4 * s, y - 22 * s, 3 * s, 5 * s)
  ctx.fillRect(x + 1 * s, y - 22 * s, 3 * s, 5 * s)

  ctx.fillStyle = mouth
  ctx.fillRect(x - 10 * s, y + 2 * s, 20 * s, 3 * s)

  ctx.fillStyle = teeth
  for (let tx = -8 * s; tx <= 6 * s; tx += 4 * s) {
    ctx.fillRect(x + tx, y + 1 * s, 2 * s, 3 * s)
  }

  ctx.fillStyle = '#0a0a00'
  ctx.fillRect(x - 14 * s, y + 8 * s, 8 * s, 6 * s)
  ctx.fillRect(x + 6 * s, y + 8 * s, 8 * s, 6 * s)

  ctx.restore()
}

function drawRoad(ctx: CanvasRenderingContext2D, w: number, h: number, scroll: number, speed: number, theme?: LevelTheme) {
  const roadW = LANE_W() * 3
  const roadX = (w - roadW) / 2

  ctx.fillStyle = theme?.roadFill || '#7a7a5a'
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = theme?.roadFill || '#5a5a3a'
  ctx.fillRect(roadX, 0, roadW, h)

  ctx.fillStyle = theme?.roadEdge || '#4a4a2a'
  ctx.fillRect(roadX, 0, roadW, 3)

  ctx.fillStyle = theme?.roadStripe || '#ffff00'
  const laneH = 30
  const gap = 20
  const total = laneH + gap
  const offset = scroll % total
  for (let lane = -1; lane <= 1; lane++) {
    const lx = roadX + (lane + 1) * LANE_W() + (LANE_W() - 4) / 2
    for (let y = -total + offset; y < h + total; y += total) {
      ctx.fillRect(lx, y, 4, laneH)
    }
  }

  ctx.fillStyle = theme?.roadEdge || '#3a3a2a'
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

function drawScenery(ctx: CanvasRenderingContext2D, w: number, h: number, scroll: number, theme: LevelTheme) {
  const spacing = 80
  const offset = scroll % spacing
  const s = Math.max(1, Math.floor(w / 250))

  for (let y = -spacing + offset; y < h + spacing; y += spacing) {
    const lx = 16
    const rx = w - 16 - 12
    const sy = y + 40

    switch (theme.sceneryType) {
      case 'walls': {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(lx - 4, sy - 8, 24, 40)
        ctx.fillRect(rx - 4, sy - 8, 24, 40)
        ctx.fillStyle = theme.sceneryColor2
        ctx.fillRect(lx + 2, sy + 4, 6, 6)
        ctx.fillRect(lx + 12, sy + 4, 6, 6)
        ctx.fillRect(rx + 2, sy + 4, 6, 6)
        ctx.fillRect(rx + 12, sy + 4, 6, 6)
        break
      }
      case 'pillars': {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(lx, sy - 4, 20, 36)
        ctx.fillRect(rx, sy - 4, 20, 36)
        ctx.fillStyle = theme.sceneryColor2
        ctx.fillRect(lx + 3, sy - 4, 14, 4)
        ctx.fillRect(lx + 3, sy + 8, 14, 3)
        ctx.fillRect(rx + 3, sy - 4, 14, 4)
        ctx.fillRect(rx + 3, sy + 8, 14, 3)
        break
      }
      case 'pipes': {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(lx, sy, 22, 28)
        ctx.fillRect(rx, sy, 22, 28)
        ctx.fillStyle = theme.sceneryColor2
        ctx.fillRect(lx + 3, sy + 6, 5, 16)
        ctx.fillRect(rx + 3, sy + 6, 5, 16)
        ctx.fillStyle = 'rgba(0,0,0,0.2)'
        ctx.fillRect(lx + 8, sy + 3, 6, 4)
        ctx.fillRect(rx + 8, sy + 3, 6, 4)
        break
      }
      case 'trees': {
        ctx.fillStyle = '#4a2a0a'
        ctx.fillRect(lx + 4, sy, 6, 20)
        ctx.fillRect(rx + 2, sy, 6, 20)
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(lx, sy - 12, 14, 14)
        ctx.fillRect(lx + 2, sy - 20, 10, 10)
        ctx.fillRect(rx - 2, sy - 12, 14, 14)
        ctx.fillRect(rx, sy - 20, 10, 10)
        ctx.fillStyle = theme.sceneryColor2
        ctx.fillRect(lx + 6, sy - 24, 2, 4)
        ctx.fillRect(rx + 4, sy - 24, 2, 4)
        break
      }
      case 'buildings': {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(lx - 6, sy - 16, 28, 36)
        ctx.fillRect(rx - 6, sy - 16, 28, 36)
        ctx.fillStyle = theme.sceneryColor2
        ctx.fillRect(lx + 2, sy - 8, 6, 6)
        ctx.fillRect(lx + 14, sy - 8, 6, 6)
        ctx.fillRect(rx + 2, sy - 8, 6, 6)
        ctx.fillRect(rx + 14, sy - 8, 6, 6)
        ctx.fillStyle = theme.accentColor + '44'
        ctx.fillRect(lx + 6, sy - 12, 4, 4)
        ctx.fillRect(rx + 6, sy - 12, 4, 4)
        break
      }
      case 'columns': {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(lx - 6, sy - 8, 28, 36)
        ctx.fillRect(rx - 6, sy - 8, 28, 36)
        ctx.fillStyle = theme.sceneryColor2
        ctx.fillRect(lx, sy - 8, 4, 36)
        ctx.fillRect(lx + 16, sy - 8, 4, 36)
        ctx.fillRect(rx, sy - 8, 4, 36)
        ctx.fillRect(rx + 16, sy - 8, 4, 36)
        ctx.fillStyle = theme.accentColor + '33'
        ctx.fillRect(lx + 4, sy - 4, 12, 4)
        ctx.fillRect(rx + 4, sy - 4, 12, 4)
        break
      }
      case 'grand': {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(lx - 8, sy - 12, 32, 36)
        ctx.fillRect(rx - 8, sy - 12, 32, 36)
        ctx.fillStyle = theme.sceneryColor2
        ctx.fillRect(lx + 2, sy - 12, 4, 36)
        ctx.fillRect(lx + 20, sy - 12, 4, 36)
        ctx.fillRect(rx + 2, sy - 12, 4, 36)
        ctx.fillRect(rx + 20, sy - 12, 4, 36)
        ctx.fillStyle = theme.accentColor
        ctx.fillRect(lx + 6, sy - 8, 12, 3)
        ctx.fillRect(lx + 6, sy + 4, 12, 3)
        ctx.fillRect(rx + 6, sy - 8, 12, 3)
        ctx.fillRect(rx + 6, sy + 4, 12, 3)
        break
      }
    }
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number, theme: LevelTheme) {
  const t = theme.particleType
  if (!t) return
  const s = Math.max(1, Math.floor(w / 250))

  for (let i = 0; i < 8; i++) {
    const px = ((i * 137 + frame * (0.5 + i * 0.1)) % (w + 40)) - 20
    const py = ((i * 97 + frame * (0.8 + i * 0.05)) % (h * 0.6)) + h * 0.1

    switch (t) {
      case 'torchlight': {
        const flicker = Math.sin(frame * 0.05 + i * 2) * 0.3 + 0.7
        ctx.fillStyle = `rgba(255,${150 + i * 20},0,${flicker * 0.08})`
        const r = 4 + (i % 3) * 2
        ctx.beginPath()
        ctx.arc(px, py, r * s * 0.5, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'fireflies': {
        const glow = Math.sin(frame * 0.03 + i * 1.5) * 0.5 + 0.5
        ctx.fillStyle = `rgba(170,255,136,${glow * 0.15})`
        const r = 2 + (i % 2)
        ctx.beginPath()
        ctx.arc(px, py, r * s * 0.5, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'snow': {
        ctx.fillStyle = `rgba(255,255,255,${0.1 + (i % 3) * 0.05})`
        ctx.fillRect(px, py, 2, 3)
        break
      }
      case 'bubbles': {
        ctx.fillStyle = `rgba(50,200,80,${0.05 + (i % 3) * 0.03})`
        ctx.beginPath()
        ctx.arc(px, py, 2 + (i % 2), 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'embers': {
        const rise = Math.sin(frame * 0.04 + i) * 2
        ctx.fillStyle = `rgba(255,${80 + i * 20},0,${0.08 + (i % 3) * 0.04})`
        ctx.fillRect(px + rise, py - rise, 2, 3)
        break
      }
    }
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
    currentLane: 0, displayLane: 0,
    boostUntil: 0, penaltyUntil: 0,
    scrollY: 0, screenShake: 0,
    flashTimer: 0, flashGreen: false,
    paused: false, multiplier: 1,
  })
  const lastFrameTimeRef = useRef(0)
  const gameRunning = useRef(false)
  const gameOverFired = useRef(false)
  const gameInitialized = useRef(false)
  const topicRef = useRef<string | undefined>(undefined)
  const diffRef = useRef<string | undefined>(undefined)
  const usedChallengeIds = useRef<Set<number>>(new Set())
  const disposedRef = useRef(false)
  const challengeTimerRef = useRef<number>(0)
  const frameCountRef = useRef(0)
  const propsRef = useRef(props)
  const animRef = useRef<number>(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const themeRef = useRef<LevelTheme>(THEMES[props.themeId ?? 1] || THEMES[1])
  propsRef.current = props

  useEffect(() => {
    themeRef.current = THEMES[props.themeId ?? 1] || THEMES[1]
  }, [props.themeId])

  useEffect(() => {
    topicRef.current = props.topic
    diffRef.current = props.difficulty
  }, [props.topic, props.difficulty])

  useEffect(() => {
    resetState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playerX = () => {
    const cw = window.innerWidth
    const roadW = LANE_W() * 3
    const roadX = (cw - roadW) / 2
    return roadX + (stateRef.current.displayLane + 1) * LANE_W() + LANE_W() / 2
  }

  const playerY = () => window.innerHeight - 100

  const monsterY = () => {
    const s = stateRef.current
    const danger = Math.max(0, Math.min(1, (GAP_START - s.gap) / GAP_START))
    return playerY() + 25 + (1 - danger) * 130
  }

  function scheduleChallenge() {
    const s = stateRef.current
    if (s.paused) return
    const delay = CHALLENGE_MIN + Math.random() * (CHALLENGE_MAX - CHALLENGE_MIN)
    challengeTimerRef.current = window.setTimeout(async () => {
      try {
        if (gameRunning.current && !stateRef.current.paused) {
          const challenge = await getRandomChallenge(usedChallengeIds.current, topicRef.current, diffRef.current)
          if (!gameRunning.current || disposedRef.current) return
          usedChallengeIds.current.add(challenge.id)
          propsRef.current.onChallenge(challenge)
        }
      } catch (err) {
        console.error('PixelRunner challenge error:', err)
      }
    }, delay)
  }

  function resetState() {
    const s = stateRef.current
    s.score = 0; s.gap = GAP_START; s.speed = BASE_SPEED; s.streak = 0
    s.currentLane = 0; s.displayLane = 0; s.boostUntil = 0; s.penaltyUntil = 0
    s.scrollY = 0; s.screenShake = 0
    s.flashTimer = 0; s.flashGreen = false
    s.paused = false; s.multiplier = 1
    lastFrameTimeRef.current = 0
    gameRunning.current = true
    gameOverFired.current = false
    gameInitialized.current = true
    usedChallengeIds.current.clear()
    frameCountRef.current = 0
    disposedRef.current = false
    clearTimeout(challengeTimerRef.current)
    clearAIPool()
    scheduleChallenge()
  }

  useImperativeHandle(ref, () => ({
    startGame(topic?: string) {
      topicRef.current = topic
      resetState()
    },
    handleAnswer(correct: boolean) {
      if (!gameRunning.current) return
      const s = stateRef.current
      if (correct) {
        s.gap = Math.min(100, s.gap + CORRECT_BOOST)
        s.streak++
        s.boostUntil = performance.now() + BOOST_DURATION
        s.flashTimer = 0.3
        s.flashGreen = true
      } else {
        s.gap = Math.max(5, s.gap - WRONG_PENALTY)
        s.streak = 0
        s.penaltyUntil = performance.now() + PENALTY_DURATION
        s.screenShake = 0.5
        s.flashTimer = 0.3
        s.flashGreen = false
      }
      clearTimeout(challengeTimerRef.current)
      scheduleChallenge()
    },
    handleTimeout() {
      if (!gameRunning.current) return
      const s = stateRef.current
      s.gap = Math.max(5, s.gap - TIMEOUT_PENALTY)
      s.streak = 0
      s.penaltyUntil = performance.now() + PENALTY_DURATION
      s.screenShake = 0.8
      s.flashTimer = 0.3
      s.flashGreen = false
      clearTimeout(challengeTimerRef.current)
      scheduleChallenge()
    },
    setPaused(paused: boolean) {
      stateRef.current.paused = paused
      if (paused) clearTimeout(challengeTimerRef.current)
      else scheduleChallenge()
    },
    setMultiplier(mult: number) {
      stateRef.current.multiplier = mult
    },
    setPreferredDifficulty(diff?: string) {
      diffRef.current = diff
    },
    startRecording() {
      const canvas = canvasRef.current
      if (!canvas || mediaRecorderRef.current) return
      const stream = (canvas as HTMLCanvasElement).captureStream(30)
      const mr = new MediaRecorder(stream, { mimeType: 'video/webm' })
      recordedChunksRef.current = []
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data)
      }
      mr.start()
      mediaRecorderRef.current = mr
    },
    async stopRecording(): Promise<Blob | null> {
      const mr = mediaRecorderRef.current
      if (!mr || mr.state === 'inactive') return null
      return new Promise((resolve) => {
        mr.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
          mediaRecorderRef.current = null
          resolve(blob)
        }
        mr.stop()
      })
    },
    isRecording(): boolean {
      return mediaRecorderRef.current?.state === 'recording'
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

    let touchStartX = 0
    let touchStartY = 0
    function handleTouchStart(e: TouchEvent) {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }
    function handleTouchEnd(e: TouchEvent) {
      if (!gameRunning.current) return
      const dx = e.changedTouches[0].clientX - touchStartX
      const dy = e.changedTouches[0].clientY - touchStartY
      const s = stateRef.current
      if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
          if (dx < 0) s.currentLane = Math.max(-1, s.currentLane - 1)
          else s.currentLane = Math.min(1, s.currentLane + 1)
        }
      } else {
        const x = e.changedTouches[0].clientX
        if (x < window.innerWidth * 0.4) {
          s.currentLane = Math.max(-1, s.currentLane - 1)
        } else if (x > window.innerWidth * 0.6) {
          s.currentLane = Math.min(1, s.currentLane + 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameInitialized.current || disposedRef.current) return
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
    let disposed = false

    function resize() {
      const dpr = window.devicePixelRatio || 1
      updateScale(window.innerWidth)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    function loop(ts: number) {
      try {
        if (disposed) return
        const s = stateRef.current
        const dt = lastFrameTimeRef.current ? Math.min((ts - lastFrameTimeRef.current) / 1000, 0.05) : 0
        lastFrameTimeRef.current = ts

        if (gameRunning.current) {
          if (!s.paused)  {
            s.scrollY += s.speed * 4 * dt * 60

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

          s.displayLane += (s.currentLane - s.displayLane) * 0.15

          if (s.screenShake > 0) {
            s.screenShake *= 0.9
            if (s.screenShake < 0.01) s.screenShake = 0
          }

          if (s.flashTimer > 0) {
            s.flashTimer -= dt
          }

          if (s.gap <= 0) {
            s.gap = 0
            gameRunning.current = false
          }
        }

        const dpr = window.devicePixelRatio || 1
        const w = canvas.width / dpr
        const h = canvas.height / dpr

        ctx.save()

        if (s.screenShake > 0) {
          ctx.translate(
            (Math.random() - 0.5) * s.screenShake * 6,
            (Math.random() - 0.5) * s.screenShake * 6,
          )
        }

        if (s.flashTimer > 0) {
          ctx.fillStyle = s.flashGreen
            ? `rgba(118,152,38,${s.flashTimer * 0.5})`
            : `rgba(240,235,227,${s.flashTimer * 0.3})`
          ctx.fillRect(0, 0, w, h)
        }

        const theme = themeRef.current
        const skyH = Math.floor(h * 0.32)
        const grad = ctx.createLinearGradient(0, 0, 0, skyH)
        grad.addColorStop(0, theme.skyTop)
        grad.addColorStop(1, theme.skyBottom)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, skyH)

        for (let i = 0; i < 3; i++) {
          const cx = ((i * w * 0.25 + ts * 0.008 * (1 + i * 0.3)) % (w + 120)) - 60
          const cy = 10 + i * 25
          drawPixelCloud(ctx, cx, cy, 50 + i * 10, i)
        }

        ctx.fillStyle = theme.hillColor
        ctx.beginPath()
        ctx.moveTo(0, skyH - 8)
        for (let x = 0; x <= w; x += 8) {
          ctx.lineTo(x, skyH - 8 + Math.sin(x * 0.006 + 2) * 16 + Math.sin(x * 0.014) * 8)
        }
        ctx.lineTo(w, skyH + 20)
        ctx.lineTo(0, skyH + 20)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = theme.groundColor
        ctx.fillRect(0, skyH + 12, w, h - skyH)

        drawRoad(ctx, w, h, s.scrollY, s.speed, theme)
        drawScenery(ctx, w, h, s.scrollY, theme)
        drawParticles(ctx, w, h, ts * 0.001, theme)

        const danger = Math.max(0, Math.min(1, (GAP_START - s.gap) / GAP_START))
        drawPixelMonster(ctx, playerX(), monsterY(), ts * 0.001, danger, theme)
        drawPixelPlayer(ctx, playerX(), playerY(), ts * 0.001)

        drawSpeedLines(ctx, w, h, s.speed, ts * 0.001)

        if (s.gap < GAP_START * 0.35) {
          const intense = 1 - s.gap / (GAP_START * 0.35)
          ctx.fillStyle = `rgba(240,235,227,${intense * 0.06})`
          ctx.fillRect(0, 0, w, h)
          const bw = 4 + intense * 8
          ctx.strokeStyle = `rgba(240,235,227,${intense * 0.2})`
          ctx.lineWidth = bw
          ctx.strokeRect(bw / 2, bw / 2, w - bw, h - bw)
        }

        ctx.restore()
      } catch (err) {
        console.error('PixelRunner loop error:', err)
      }

      anim = requestAnimationFrame(loop)
    }

    anim = requestAnimationFrame(loop)

    return () => {
      disposed = true
      disposedRef.current = true
      gameRunning.current = false
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
        touchAction: 'none',
      }}
    />
  )
})

export default PixelRunner
