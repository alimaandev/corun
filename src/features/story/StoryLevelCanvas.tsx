import { useCallback, useEffect, useRef, useState } from 'react'
import { CodePuzzle, LevelSceneData, SceneNpc, TriggerZone } from '../../game/types'
import { LevelTheme, THEMES } from '../../game/themes'
import { getPuzzle } from '../../game/engine/data/codePuzzles'
import { getLevelScene } from '../../game/engine/data/levelScenes'
import { playInteract, playLevelComplete, playSuccess } from '../../game/sound'
import { startMusic, stopMusic } from '../../game/audio'
import { drawPlayerSprite, NPC_DRAWERS } from '../../game/sprites'
import { useGameLoop } from '../../game/useGameLoop'
import CodePuzzlePlaytest from '../../components/CodePuzzlePlaytest'

interface Props {
  levelId: number
  onComplete: () => void
}

const WORLD_BOTTOM = 560
const GROUND_Y = 450
const PLAYER_W = 20
const PLAYER_H = 30
const PLAYER_SPEED = 180
const NPC_SPEED = 45
const INTERACT_RANGE = 46
const MOBILE_BREAK = 768

interface NpcState {
  npc: SceneNpc
  x: number
  dir: 'left' | 'right'
}

interface BurstParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

const PARTICLE_COLORS: Record<string, string> = {
  torchlight: '#ff8833',
  fireflies: '#aaff88',
  snow: '#ffffff',
  bubbles: '#66ffee',
  embers: '#ff6633',
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function StoryLevelCanvas({ levelId, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const sceneRef = useRef<LevelSceneData | null>(null)
  const themeRef = useRef<LevelTheme>(THEMES[1])
  const playerX = useRef(80)
  const facing = useRef<1 | -1>(1)
  const keysDown = useRef<Set<string>>(new Set())
  const npcs = useRef<NpcState[]>([])
  const solvedPuzzles = useRef<Set<string>>(new Set())
  const nearTriggerRef = useRef<TriggerZone | null>(null)
  const activePuzzleRef = useRef<CodePuzzle | null>(null)
  const levelCompleteShown = useRef(false)
  const completeTimeoutRef = useRef<number>(0)
  const frameRef = useRef(0)
  const disposedRef = useRef(false)
  const ambientParticles = useRef<{ x: number; y: number; s: number; p: number }[]>([])
  const burstParticles = useRef<BurstParticle[]>([])
  const doneRef = useRef(onComplete)
  doneRef.current = onComplete

  const [showPuzzle, setShowPuzzle] = useState<CodePuzzle | null>(null)
  const [nearTrigger, setNearTrigger] = useState<TriggerZone | null>(null)
  const [showComplete, setShowComplete] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const data = getLevelScene(levelId)
    sceneRef.current = data ?? null
    themeRef.current = THEMES[levelId] || THEMES[1]
    playerX.current = data?.playerStart.x ?? 80
    facing.current = 1
    solvedPuzzles.current = new Set()
    npcs.current = (data?.npcs ?? []).map((n) => ({ npc: n, x: n.x, dir: n.dir }))
    nearTriggerRef.current = null
    setNearTrigger(null)
    activePuzzleRef.current = null
    setShowPuzzle(null)
    levelCompleteShown.current = false
    setShowComplete(false)

    const rand = mulberry32(levelId * 1337 + 1)
    ambientParticles.current = Array.from({ length: 32 }, () => ({
      x: rand() * (data?.worldWidth ?? 900),
      y: rand() * (GROUND_Y - 80),
      s: 1 + rand() * 2,
      p: rand() * Math.PI * 2,
    }))
    burstParticles.current = []
    startMusic(levelId, 0.3)
    return () => stopMusic()
  }, [levelId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctxRef.current = ctx

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas!.width = Math.floor(window.innerWidth * dpr)
      canvas!.height = Math.floor(window.innerHeight * dpr)
      canvas!.style.width = window.innerWidth + 'px'
      canvas!.style.height = window.innerHeight + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      setIsMobile(window.innerWidth < MOBILE_BREAK)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      disposedRef.current = true
      window.removeEventListener('resize', resize)
      clearTimeout(completeTimeoutRef.current)
    }
  }, [])

  const handleInteract = useCallback(() => {
    if (activePuzzleRef.current) return
    const trigger = nearTriggerRef.current
    if (!trigger) return
    const puzzle = getPuzzle(trigger.puzzleId)
    if (puzzle) {
      playInteract()
      activePuzzleRef.current = puzzle
      setShowPuzzle(puzzle)
    }
  }, [])

  const handlePuzzleClose = useCallback(() => {
    activePuzzleRef.current = null
    setShowPuzzle(null)
  }, [])

  const handlePuzzleSolve = useCallback(() => {
    const puzzle = activePuzzleRef.current
    if (!puzzle) return
    playSuccess()
    solvedPuzzles.current.add(puzzle.id)
    activePuzzleRef.current = null
    setShowPuzzle(null)
    burstParticles.current = Array.from({ length: 22 }, () => ({
      x: playerX.current + (Math.random() - 0.5) * 24,
      y: GROUND_Y - 20 + (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 90,
      vy: -30 - Math.random() * 90,
      life: 0.7,
    }))
  }, [])

  const handleExitZone = useCallback(() => {
    if (levelCompleteShown.current) return
    const scene = sceneRef.current
    if (!scene || solvedPuzzles.current.size < scene.triggers.length) return
    levelCompleteShown.current = true
    setShowComplete(true)
    playLevelComplete()
    completeTimeoutRef.current = window.setTimeout(() => {
      if (!disposedRef.current) doneRef.current()
    }, 650)
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (activePuzzleRef.current) return
      keysDown.current.add(e.key.toLowerCase())
      if (e.key.toLowerCase() === 'e' && !e.repeat) handleInteract()
    }
    function onKeyUp(e: KeyboardEvent) {
      keysDown.current.delete(e.key.toLowerCase())
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [handleInteract])

  useGameLoop((dt) => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    const scene = sceneRef.current
    if (!canvas || !ctx || !scene) return
    frameRef.current++

    const keys = keysDown.current
    const movingLeft = keys.has('arrowleft') || keys.has('a')
    const movingRight = keys.has('arrowright') || keys.has('d')

    if (!activePuzzleRef.current) {
      if (movingLeft) {
        playerX.current -= PLAYER_SPEED * dt
        facing.current = -1
      } else if (movingRight) {
        playerX.current += PLAYER_SPEED * dt
        facing.current = 1
      }
      playerX.current = Math.max(
        PLAYER_W / 2,
        Math.min(scene.worldWidth - PLAYER_W / 2, playerX.current),
      )

      for (const blocker of scene.blockers) {
        const pr = {
          x: playerX.current - PLAYER_W / 2,
          y: GROUND_Y - PLAYER_H,
          w: PLAYER_W,
          h: PLAYER_H,
        }
        if (
          pr.x < blocker.x + blocker.w &&
          pr.x + pr.w > blocker.x &&
          pr.y < blocker.y + blocker.h &&
          pr.y + pr.h > blocker.y
        ) {
          if (movingLeft) playerX.current = blocker.x + blocker.w + PLAYER_W / 2
          else if (movingRight) playerX.current = blocker.x - PLAYER_W / 2
        }
      }

      for (const n of npcs.current) {
        const patrol = n.npc.patrol
        if (patrol) {
          const [lo, hi] = patrol
          n.x += (n.dir === 'right' ? 1 : -1) * NPC_SPEED * dt
          if (n.x <= lo) {
            n.x = lo
            n.dir = 'right'
          } else if (n.x >= hi) {
            n.x = hi
            n.dir = 'left'
          }
        }
      }

      let nextNear: TriggerZone | null = null
      for (const t of scene.triggers) {
        if (solvedPuzzles.current.has(t.puzzleId)) continue
        const center = t.x + t.w / 2
        if (Math.abs(center - playerX.current) < t.w / 2 + INTERACT_RANGE) {
          nextNear = t
          break
        }
      }
      if (nextNear !== nearTriggerRef.current) {
        nearTriggerRef.current = nextNear
        setNearTrigger(nextNear)
      }

      const exit = scene.exitZone
      if (exit && solvedPuzzles.current.size >= scene.triggers.length) {
        const cx = playerX.current
        if (cx > exit.x && cx < exit.x + exit.w) handleExitZone()
      }
    }

    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    const scale = h / WORLD_BOTTOM
    const theme = themeRef.current
    const worldW = scene.worldWidth * scale
    const camX = Math.max(0, Math.min(worldW - w, playerX.current * scale - w * 0.45))
    const frame = frameRef.current
    const s = Math.max(3, Math.round(scale * 2))

    ctx.fillStyle = theme.skyTop
    ctx.fillRect(0, 0, w, h)
    const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y * scale)
    grad.addColorStop(0, theme.skyTop)
    grad.addColorStop(1, theme.skyBottom)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, GROUND_Y * scale)

    for (let i = 0; i < 42; i++) {
      const sx = (((i * 97 + 31) % w) + frame * 0.2) % w
      const sy = (i * 53 + 17) % Math.floor(GROUND_Y * scale * 0.8)
      const tw = Math.sin(frame * 0.05 + i) > 0 ? 1 : 0.35
      ctx.fillStyle = `rgba(255,255,255,${tw})`
      ctx.fillRect(sx, sy, 1.5, 1.5)
    }

    const groundScreenY = GROUND_Y * scale
    ctx.fillStyle = theme.hillColor
    ctx.beginPath()
    ctx.moveTo(0, groundScreenY)
    for (let x = 0; x <= w; x += 24) {
      const wx = x + camX * 0.08
      const yy = groundScreenY - 18 - Math.abs(Math.sin(wx * 0.006 + levelId)) * 26
      ctx.lineTo(x, yy)
    }
    ctx.lineTo(w, groundScreenY)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = theme.sceneryColor2
    ctx.beginPath()
    ctx.moveTo(0, groundScreenY)
    for (let x = 0; x <= w; x += 20) {
      const wx = x + camX * 0.28
      const yy = groundScreenY - 8 - Math.abs(Math.sin(wx * 0.011 + levelId * 3)) * 14
      ctx.lineTo(x, yy)
    }
    ctx.lineTo(w, groundScreenY)
    ctx.closePath()
    ctx.fill()

    const sceneryStep = 210
    const sceneryOff = camX * 0.25
    for (
      let x = -((sceneryOff % sceneryStep) + sceneryStep);
      x < w + sceneryStep;
      x += sceneryStep
    ) {
      const wx = x + sceneryOff
      const type = theme.sceneryType
      if (type === 'trees') {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(wx + 14, groundScreenY - 34, 6, 34)
        ctx.beginPath()
        ctx.moveTo(wx + 3, groundScreenY - 40)
        ctx.lineTo(wx + 17, groundScreenY - 74)
        ctx.lineTo(wx + 31, groundScreenY - 40)
        ctx.closePath()
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(wx + 6, groundScreenY - 56)
        ctx.lineTo(wx + 17, groundScreenY - 86)
        ctx.lineTo(wx + 28, groundScreenY - 56)
        ctx.closePath()
        ctx.fill()
      } else if (type === 'pillars') {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(wx + 4, groundScreenY - 66, 26, 66)
        ctx.fillStyle = theme.sceneryColor2
        ctx.fillRect(wx, groundScreenY - 72, 34, 8)
        ctx.fillRect(wx + 4, groundScreenY - 8, 26, 8)
      } else if (type === 'pipes') {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(wx + 6, groundScreenY - 60, 22, 60)
        ctx.fillStyle = theme.sceneryColor2
        for (let i = 0; i < 5; i++) ctx.fillRect(wx + 2, groundScreenY - 58 + i * 14, 30, 4)
      } else if (type === 'buildings') {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(wx + 2, groundScreenY - 58, 30, 58)
        ctx.fillRect(wx + 30, groundScreenY - 34, 22, 34)
        ctx.fillStyle = theme.sceneryColor2
        ctx.fillRect(wx + 7, groundScreenY - 50, 6, 6)
        ctx.fillRect(wx + 20, groundScreenY - 50, 6, 6)
        ctx.fillRect(wx + 36, groundScreenY - 26, 6, 6)
      } else if (type === 'columns') {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(wx + 10, groundScreenY - 78, 14, 78)
        ctx.fillStyle = theme.sceneryColor2
        ctx.fillRect(wx + 2, groundScreenY - 84, 30, 8)
        ctx.fillRect(wx + 2, groundScreenY - 16, 30, 16)
      } else if (type === 'grand') {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(wx + 6, groundScreenY - 72, 22, 72)
        ctx.fillStyle = theme.sceneryColor2
        ctx.beginPath()
        ctx.moveTo(wx, groundScreenY - 72)
        ctx.lineTo(wx + 17, groundScreenY - 96)
        ctx.lineTo(wx + 34, groundScreenY - 72)
        ctx.closePath()
        ctx.fill()
      } else {
        ctx.fillStyle = theme.sceneryColor1
        ctx.fillRect(wx + 2, groundScreenY - 56, 30, 56)
        ctx.fillStyle = theme.sceneryColor2
        ctx.fillRect(wx + 6, groundScreenY - 52, 22, 8)
        ctx.fillRect(wx + 6, groundScreenY - 30, 22, 8)
      }
    }

    for (const seg of scene.ground) {
      const gx = seg.x * scale - camX
      const gy = seg.y * scale
      ctx.fillStyle = theme.groundColor
      ctx.fillRect(gx, gy, seg.w * scale, seg.h * scale)
      ctx.fillStyle = 'rgba(0,0,0,0.28)'
      ctx.fillRect(gx, gy - 2, seg.w * scale, 3)
      ctx.fillStyle = 'rgba(255,255,255,0.04)'
      for (let x = gx + ((frame * 2) % 18); x < gx + seg.w * scale; x += 18) {
        ctx.fillRect(x, gy + 10, 8, 2)
        ctx.fillRect(x + 6, gy + 26, 8, 2)
      }
    }

    for (const bl of scene.blockers) {
      const bx = bl.x * scale - camX
      const by = bl.y * scale
      ctx.fillStyle = theme.sceneryColor2
      ctx.fillRect(bx, by, bl.w * scale, bl.h * scale)
      ctx.fillStyle = 'rgba(0,0,0,0.25)'
      ctx.fillRect(bx, by, 4, bl.h * scale)
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      for (let y = by + 12; y < by + bl.h * scale; y += 26)
        ctx.fillRect(bx + 6, y, bl.w * scale - 12, 8)
    }

    for (const t of scene.triggers) {
      const tx = t.x * scale - camX
      const ty = t.y * scale
      const tw = t.w * scale
      const th = t.h * scale
      const solved = solvedPuzzles.current.has(t.puzzleId)
      const pulse = 0.5 + Math.sin(frame * 0.08 + t.puzzleId.length) * 0.5
      const glow = ctx.createRadialGradient(
        tx + tw / 2,
        ty + th / 2,
        0,
        tx + tw / 2,
        ty + th / 2,
        tw,
      )
      if (solved) {
        glow.addColorStop(0, 'rgba(118,152,38,0.12)')
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = 'rgba(118,152,38,0.25)'
        ctx.fillRect(tx, ty, tw, th)
      } else {
        glow.addColorStop(0, `rgba(255,136,51,${0.14 + pulse * 0.06})`)
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = 'rgba(255,136,51,0.10)'
        ctx.fillRect(tx, ty, tw, th)
      }
      ctx.fillStyle = glow
      ctx.fillRect(tx - tw, ty - th * 0.6, tw * 3, th * 2.2)
      ctx.strokeStyle = solved ? 'rgba(118,152,38,0.8)' : `rgba(255,136,51,${0.5 + pulse * 0.4})`
      ctx.lineWidth = 2
      ctx.strokeRect(tx + 2, ty + 2, tw - 4, th - 4)
      if (solved) {
        ctx.fillStyle = '#8aba3c'
        ctx.font = `${Math.max(10, Math.floor(s * 5))}px monospace`
        ctx.fillText('✓', tx + tw / 2 - 4, ty + th / 2 + 4)
      } else {
        ctx.font = `${Math.max(9, Math.floor(s * 4))}px 'Poppins', sans-serif`
        ctx.textAlign = 'center'
        ctx.fillStyle = 'rgba(255,221,170,0.75)'
        ctx.fillText(t.promptText, tx + tw / 2, ty - 10)
        ctx.textAlign = 'left'
      }
    }

    const exit = scene.exitZone
    if (exit) {
      const ex = exit.x * scale - camX
      const ey = exit.y * scale
      const ew = exit.w * scale
      const open = solvedPuzzles.current.size >= scene.triggers.length
      const pulse = 0.5 + Math.sin(frame * 0.1) * 0.5
      ctx.fillStyle = open ? `rgba(118,152,38,${0.25 + pulse * 0.2})` : 'rgba(120,120,120,0.15)'
      ctx.fillRect(ex, ey, ew, exit.h * scale)
      ctx.strokeStyle = open ? '#8aba3c' : 'rgba(180,180,180,0.4)'
      ctx.lineWidth = 2
      ctx.strokeRect(ex + 2, ey + 2, ew - 4, exit.h * scale - 4)
      if (open) {
        ctx.font = `${Math.max(14, Math.floor(s * 7))}px monospace`
        ctx.textAlign = 'center'
        ctx.fillStyle = '#c8e86c'
        ctx.fillText('▶', ex + ew / 2, ey + exit.h * scale + 18 + Math.sin(frame * 0.15) * 3)
        ctx.textAlign = 'left'
      }
    }

    for (const n of npcs.current) {
      const drawer = NPC_DRAWERS[n.npc.npcId as keyof typeof NPC_DRAWERS]
      if (!drawer) continue
      const nx = n.x * scale - camX
      const ny = n.npc.y * scale
      ctx.save()
      if (n.dir === 'right') {
        ctx.translate(nx, 0)
        ctx.scale(-1, 1)
        ctx.translate(-nx, 0)
      }
      drawer(ctx, nx, ny, s, frame)
      ctx.restore()
    }

    ctx.save()
    if (facing.current === -1) {
      ctx.translate(playerX.current * scale - camX, 0)
      ctx.scale(-1, 1)
      ctx.translate(-(playerX.current * scale - camX), 0)
    }
    drawPlayerSprite(ctx, playerX.current * scale - camX, GROUND_Y * scale - 2, s, frame)
    ctx.restore()

    const particleType = theme.particleType ?? 'torchlight'
    const pc = PARTICLE_COLORS[particleType] || '#ff8833'
    for (const p of ambientParticles.current) {
      p.y -= particleType === 'snow' ? 14 * dt : 6 * dt
      p.x += Math.sin(frame * 0.02 + p.p) * 12 * dt
      if (p.y < 0) p.y = GROUND_Y - 80
      ctx.fillStyle = pc
      ctx.globalAlpha = 0.5 + Math.sin(frame * 0.1 + p.p) * 0.3
      ctx.fillRect(p.x * scale - camX, p.y * scale, p.s, p.s)
      ctx.globalAlpha = 1
    }

    for (let i = burstParticles.current.length - 1; i >= 0; i--) {
      const bp = burstParticles.current[i]
      bp.life -= dt
      if (bp.life <= 0) {
        burstParticles.current.splice(i, 1)
        continue
      }
      bp.x += bp.vx * dt
      bp.y += bp.vy * dt
      bp.vy += 90 * dt
      ctx.fillStyle = `rgba(168,186,60,${Math.min(1, bp.life)})`
      ctx.fillRect(bp.x * scale - camX, bp.y * scale, 3 * s * 0.4, 3 * s * 0.4)
    }

    const near = nearTriggerRef.current
    if (near && !activePuzzleRef.current) {
      const nx = playerX.current * scale - camX
      ctx.font = `600 ${Math.max(11, Math.floor(s * 5.5))}px 'Poppins', sans-serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#f6e9c8'
      ctx.fillText(`E · ${near.promptText.toUpperCase()}`, nx, GROUND_Y * scale - 34)
      ctx.textAlign = 'left'
    }
  })

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#000',
        zIndex: 200,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          touchAction: 'manipulation',
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 8,
          left: 8,
          color: 'rgba(240,235,227,0.4)',
          fontSize: 11,
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 300,
          zIndex: 210,
          letterSpacing: 2,
          pointerEvents: 'none',
        }}
      >
        ← → MOVE &nbsp;|&nbsp; E INTERACT
      </div>

      {isMobile && !showPuzzle && (
        <>
          <button
            aria-label="Move left"
            onPointerDown={(e) => {
              e.preventDefault()
              keysDown.current.add('arrowleft')
            }}
            onPointerUp={() => keysDown.current.delete('arrowleft')}
            onPointerLeave={() => keysDown.current.delete('arrowleft')}
            onPointerCancel={() => keysDown.current.delete('arrowleft')}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              position: 'fixed',
              bottom: 24,
              left: 24,
              width: 72,
              height: 72,
              borderRadius: 36,
              border: '1px solid rgba(240,235,227,0.2)',
              background: 'rgba(10,10,10,0.55)',
              color: 'rgba(240,235,227,0.75)',
              fontSize: 26,
              zIndex: 220,
              touchAction: 'none',
              userSelect: 'none',
            }}
          >
            ◀
          </button>
          <button
            aria-label="Move right"
            onPointerDown={(e) => {
              e.preventDefault()
              keysDown.current.add('arrowright')
            }}
            onPointerUp={() => keysDown.current.delete('arrowright')}
            onPointerLeave={() => keysDown.current.delete('arrowright')}
            onPointerCancel={() => keysDown.current.delete('arrowright')}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              width: 72,
              height: 72,
              borderRadius: 36,
              border: '1px solid rgba(240,235,227,0.2)',
              background: 'rgba(10,10,10,0.55)',
              color: 'rgba(240,235,227,0.75)',
              fontSize: 26,
              zIndex: 220,
              touchAction: 'none',
              userSelect: 'none',
            }}
          >
            ▶
          </button>
          {nearTrigger && (
            <button
              aria-label="Interact"
              onPointerDown={(e) => {
                e.preventDefault()
                handleInteract()
              }}
              style={{
                position: 'fixed',
                bottom: 28,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '12px 28px',
                borderRadius: 26,
                border: '1px solid rgba(255,136,51,0.5)',
                background: 'rgba(255,136,51,0.18)',
                color: '#f6e9c8',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: 2,
                zIndex: 220,
                touchAction: 'none',
                userSelect: 'none',
              }}
            >
              E ⚡
            </button>
          )}
        </>
      )}

      {showComplete && (
        <div
          style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            color: '#8aba3c',
            fontSize: 14,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            letterSpacing: 3,
            zIndex: 300,
            textShadow: '0 0 20px rgba(118,152,38,0.3)',
            pointerEvents: 'none',
          }}
        >
          LEVEL COMPLETE
        </div>
      )}

      {showPuzzle && (
        <CodePuzzlePlaytest
          puzzle={showPuzzle}
          onClose={handlePuzzleClose}
          onSolved={handlePuzzleSolve}
        />
      )}
    </div>
  )
}
