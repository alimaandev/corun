import { useEffect, useRef, useState, useCallback } from 'react'
import { LevelSceneData, CodePuzzle, TriggerZone } from '../game/types'
import { LevelTheme, THEMES } from '../game/themes'
import { getPuzzle } from '../game/codePuzzles'
import { getLevelScene } from '../game/levelScenes'
import { drawPlayerSprite, NPC_DRAWERS, NpcId } from '../game/sprites'
import CodeTerminal from './CodeTerminal'
import { playInteract, playStep, playLevelComplete } from '../game/sound'

interface Props {
  levelId: number
  onComplete: () => void
}

const BASE_W = 800
const BASE_H = 500
const PLAYER_SPEED = 3
const PLAYER_W = 20
const PLAYER_H = 30
const GROUND_Y = 450
const MOBILE_BREAK = 768

interface NpcState {
  id: string
  x: number
  y: number
  dir: 'left' | 'right'
  patrol?: [number, number]
}

export default function SceneEngine({ levelId, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerX = useRef(80)
  const cameraX = useRef(0)
  const rafRef = useRef(0)
  const startTimeRef = useRef(0)
  const keysDown = useRef<Set<string>>(new Set())
  const solvedPuzzles = useRef<Set<string>>(new Set())
  const npcs = useRef<NpcState[]>([])
  const sceneRef = useRef<LevelSceneData | null>(null)
  const themeRef = useRef<LevelTheme>(THEMES[1])
  const levelCompleteShown = useRef(false)
  const completeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(0)
  const nearTriggerRef = useRef<TriggerZone | null>(null)
  const activePuzzleRef = useRef<CodePuzzle | null>(null)

  const viewportWRef = useRef(BASE_W)

  const [showPuzzle, setShowPuzzle] = useState<CodePuzzle | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

  useEffect(() => {
    const scene = getLevelScene(levelId)
    sceneRef.current = scene ?? null
    themeRef.current = THEMES[levelId] || THEMES[1]
    playerX.current = scene?.playerStart.x ?? 80
    cameraX.current = 0
    solvedPuzzles.current = new Set()
    levelCompleteShown.current = false
    npcs.current = []
    setShowComplete(false)
    setShowPuzzle(null)
    activePuzzleRef.current = null
    nearTriggerRef.current = null

    if (scene) {
      npcs.current = scene.npcs.map(n => ({
        id: n.npcId, x: n.x, y: n.y, dir: n.dir, patrol: n.patrol,
      }))
    }
  }, [levelId])

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

  const handlePuzzleSolve = useCallback(() => {
    const puzzle = activePuzzleRef.current
    if (!puzzle) return
    solvedPuzzles.current.add(puzzle.id)
    activePuzzleRef.current = null
    nearTriggerRef.current = null
    setShowPuzzle(null)
  }, [])

  const handlePuzzleClose = useCallback(() => {
    activePuzzleRef.current = null
    setShowPuzzle(null)
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      keysDown.current.add(e.key.toLowerCase())
      if (e.key.toLowerCase() === 'e' && !e.repeat) handleInteract()
    }
    function onKeyUp(e: KeyboardEvent) {
      keysDown.current.delete(e.key.toLowerCase())
    }
    function checkMobile() { setIsMobile(window.innerWidth < MOBILE_BREAK) }
    checkMobile()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', checkMobile)
    }
  }, [handleInteract])

  const handleTouchLeftStart = useCallback(() => { keysDown.current.add('arrowleft') }, [])
  const handleTouchLeftEnd = useCallback(() => { keysDown.current.delete('arrowleft') }, [])
  const handleTouchRightStart = useCallback(() => { keysDown.current.add('arrowright') }, [])
  const handleTouchRightEnd = useCallback(() => { keysDown.current.delete('arrowright') }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let stepCounter = 0

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    function loop() {
      startTimeRef.current === 0 && (startTimeRef.current = performance.now())
      const W = canvas.width
      const H = canvas.height
      const dpr = window.devicePixelRatio || 1
      const isMobile = window.innerWidth < MOBILE_BREAK
      const sc = isMobile
        ? Math.max(W / BASE_W / dpr, H / BASE_H / dpr)
        : Math.min(W / BASE_W / dpr, H / BASE_H / dpr)
      const ox = isMobile ? 0 : (W / dpr - BASE_W * sc) / 2
      const oy = isMobile ? 0 : (H / dpr - BASE_H * sc) / 2
      const viewW = W / dpr
      const scene = sceneRef.current
      const theme = themeRef.current
      const pxScale = Math.max(1, Math.floor(sc * 2))
      const frame = (performance.now() - startTimeRef.current) / (1000 / 60)
      const camX = cameraX.current

      if (scene && !activePuzzleRef.current) {
        let moved = false
        if (keysDown.current.has('arrowleft') || keysDown.current.has('a')) {
          let nx = Math.max(0, playerX.current - PLAYER_SPEED)
          for (const b of scene.blockers) {
            if (nx < b.x + b.w && nx + PLAYER_W > b.x &&
                GROUND_Y - PLAYER_H < b.y + b.h && GROUND_Y > b.y) {
              nx = b.x + b.w
            }
          }
          if (nx !== playerX.current) moved = true
          playerX.current = nx
        }
        if (keysDown.current.has('arrowright') || keysDown.current.has('d')) {
          let nx = Math.min(scene.worldWidth - PLAYER_W, playerX.current + PLAYER_SPEED)
          for (const b of scene.blockers) {
            if (nx < b.x + b.w && nx + PLAYER_W > b.x &&
                GROUND_Y - PLAYER_H < b.y + b.h && GROUND_Y > b.y) {
              nx = b.x - PLAYER_W
            }
          }
          if (nx !== playerX.current) moved = true
          playerX.current = nx
        }
        if (moved) {
          stepCounter++
          if (stepCounter % 6 === 0) playStep()
        }

        const vw = viewportWRef.current
        const targetCam = playerX.current - vw / 2 + PLAYER_W / 2
        cameraX.current = Math.max(0, Math.min(scene.worldWidth - vw, targetCam))

        const px = playerX.current
        const py = GROUND_Y - PLAYER_H
        let foundTrigger: TriggerZone | null = null
        for (const t of scene.triggers) {
          if (solvedPuzzles.current.has(t.puzzleId)) continue
          if (px + PLAYER_W > t.x && px < t.x + t.w &&
              py + PLAYER_H > t.y && py < t.y + t.h) {
            foundTrigger = t
            break
          }
        }
        nearTriggerRef.current = foundTrigger

      if (scene) {
        for (const npc of npcs.current) {
          if (npc.patrol) {
            const [lo, hi] = npc.patrol
            const speed = 0.5
            npc.x += npc.dir === 'right' ? speed : -speed
            if (npc.x >= hi) { npc.x = hi; npc.dir = 'left' }
            if (npc.x <= lo) { npc.x = lo; npc.dir = 'right' }
          }
        }

        if (scene.exitZone && !levelCompleteShown.current) {
          const allSolved = scene.triggers.every(t => solvedPuzzles.current.has(t.puzzleId))
          if (allSolved) {
            const ez = scene.exitZone
            if (px + PLAYER_W > ez.x && px < ez.x + ez.w &&
                py + PLAYER_H > ez.y && py < ez.y + ez.h) {
              levelCompleteShown.current = true
              setShowComplete(true)
              playLevelComplete()
              completeTimeoutRef.current = window.setTimeout(() => onComplete(), 600)
            }
          }
        }
      }

      viewportWRef.current = viewW / sc

      ctx.clearRect(0, 0, W, H)
      ctx.save()
      ctx.translate(ox * dpr, oy * dpr)
      ctx.scale(sc * dpr, sc * dpr)

      ctx.save()
      ctx.translate(-camX, 0)

      const fillW = (scene?.worldWidth ?? BASE_W) + BASE_W
      const fillH = BASE_H + 200
      const skyH = Math.floor(BASE_H * 0.45)
      const grad = ctx.createLinearGradient(0, 0, 0, skyH)
      grad.addColorStop(0, theme.skyTop)
      grad.addColorStop(1, theme.skyBottom)
      ctx.fillStyle = grad
      ctx.fillRect(-100, -100, fillW + 200, skyH + 100)

      ctx.fillStyle = theme.hillColor
      ctx.fillRect(-100, skyH, fillW + 200, GROUND_Y - skyH)

      ctx.fillStyle = theme.groundColor
      ctx.fillRect(-100, GROUND_Y, fillW + 200, fillH - GROUND_Y)

      if (scene) {
        for (const g of scene.ground) {
          ctx.fillStyle = theme.roadEdge || '#3a3a2a'
          ctx.fillRect(g.x, g.y, g.w, g.h)
          ctx.fillStyle = theme.roadFill || '#5a5a3a'
          ctx.fillRect(g.x + 2, g.y + 2, g.w - 4, g.h - 4)
        }

        for (const b of scene.blockers) {
          ctx.fillStyle = 'rgba(240,235,227,0.05)'
          ctx.fillRect(b.x, b.y, b.w, b.h)
          ctx.fillStyle = 'rgba(0,0,0,0.2)'
          ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4)
        }

        for (const t of scene.triggers) {
          if (solvedPuzzles.current.has(t.puzzleId)) {
            ctx.fillStyle = 'rgba(118,152,38,0.12)'
            ctx.fillRect(t.x, t.y, t.w, t.h)
            continue
          }
          const pulse = Math.sin(frame * 0.05) * 0.3 + 0.7
          ctx.fillStyle = `rgba(240,235,227,${pulse * 0.08})`
          ctx.fillRect(t.x, t.y, t.w, t.h)
          ctx.strokeStyle = `rgba(240,235,227,${pulse * 0.2})`
          ctx.lineWidth = 1
          ctx.strokeRect(t.x, t.y, t.w, t.h)
          ctx.fillStyle = `rgba(240,235,227,${pulse * 0.4})`
          ctx.font = '6px monospace'
          ctx.fillText('⚡', t.x + t.w / 2 - 3, t.y - 4)
        }

        if (scene.exitZone) {
          const ez = scene.exitZone
          const allSolved = scene.triggers.every(t => solvedPuzzles.current.has(t.puzzleId))
          if (allSolved) {
            const pulse = Math.sin(frame * 0.06) * 0.3 + 0.5
            ctx.fillStyle = `rgba(118,152,38,${pulse * 0.12})`
            ctx.fillRect(ez.x, ez.y, ez.w, ez.h)
            ctx.strokeStyle = `rgba(118,152,38,${pulse * 0.3})`
            ctx.lineWidth = 1
            ctx.strokeRect(ez.x, ez.y, ez.w, ez.h)
            ctx.fillStyle = '#769826'
            ctx.font = '6px monospace'
            ctx.fillText('▶', ez.x + ez.w / 2 - 3, ez.y - 4)
          }
        }
      }

      for (const npc of npcs.current) {
        const drawer = NPC_DRAWERS[npc.id as NpcId]
        if (drawer) {
          ctx.save()
          if (npc.dir === 'right') {
            ctx.translate(npc.x, 0)
            ctx.scale(-1, 1)
            drawer(ctx, 0, npc.y - 20, pxScale, frame * 0.001)
          } else {
            drawer(ctx, npc.x, npc.y - 20, pxScale, frame * 0.001)
          }
          ctx.restore()
        }
      }

      drawPlayerSprite(ctx, playerX.current, GROUND_Y - PLAYER_H, pxScale, frame * 0.001)
      }

      ctx.restore()

      const nearTrigger = nearTriggerRef.current
      const hasActivePuzzle = activePuzzleRef.current
      if (nearTrigger && !hasActivePuzzle) {
        const pulse = Math.sin(frame * 0.08) * 0.3 + 0.7
        ctx.fillStyle = `rgba(79,195,247,${pulse})`
        ctx.font = '8px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('[E] INTERACT', (W / dpr / 2 - ox) / sc, (H / dpr - 20) / sc)
        ctx.textAlign = 'start'
      }

      ctx.restore()
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
      clearTimeout(completeTimeoutRef.current)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#000', zIndex: 200,
    }}>
      <canvas ref={canvasRef} style={{ display: 'block', touchAction: 'manipulation' }} />
      <div style={{
        position: 'fixed', top: 8, left: 8,
        color: 'rgba(240,235,227,0.4)', fontSize: 8,
        fontFamily: "'Roboto', sans-serif",
        fontWeight: 300,
        zIndex: 210,
        letterSpacing: 2,
      }}>
        &larr; &rarr; MOVE &nbsp;|&nbsp; E INTERACT
      </div>
      {isMobile && (<><button
        onTouchStart={handleTouchLeftStart}
        onTouchEnd={handleTouchLeftEnd}
        onTouchCancel={handleTouchLeftEnd}
        onMouseDown={handleTouchLeftStart}
        onMouseUp={handleTouchLeftEnd}
        onMouseLeave={handleTouchLeftEnd}
        onContextMenu={e => e.preventDefault()}
        style={{
          position: 'fixed', bottom: 16, left: 16,
          width: 64, height: 64,
          background: 'rgba(240,235,227,0.08)',
          border: '1px solid rgba(240,235,227,0.2)',
          borderRadius: 12,
          color: '#F0EBE3', fontSize: 24,
          fontFamily: "'Roboto', sans-serif", fontWeight: 300,
          zIndex: 220,
          cursor: 'pointer',
          touchAction: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Move left"
      >&larr;</button>
      <button
        onTouchStart={handleTouchRightStart}
        onTouchEnd={handleTouchRightEnd}
        onTouchCancel={handleTouchRightEnd}
        onMouseDown={handleTouchRightStart}
        onMouseUp={handleTouchRightEnd}
        onMouseLeave={handleTouchRightEnd}
        onContextMenu={e => e.preventDefault()}
        style={{
          position: 'fixed', bottom: 16, left: 96,
          width: 64, height: 64,
          background: 'rgba(240,235,227,0.08)',
          border: '1px solid rgba(240,235,227,0.2)',
          borderRadius: 12,
          color: '#F0EBE3', fontSize: 24,
          fontFamily: "'Roboto', sans-serif", fontWeight: 300,
          zIndex: 220,
          cursor: 'pointer',
          touchAction: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Move right"
      >&rarr;</button>
      <button
        onTouchStart={handleInteract}
        onClick={handleInteract}
        onContextMenu={e => e.preventDefault()}
        style={{
          position: 'fixed', bottom: 16, right: 16,
          width: 56, height: 56,
          background: 'rgba(240,235,227,0.08)',
          border: '1px solid rgba(240,235,227,0.2)',
          borderRadius: '50%',
          color: '#F0EBE3', fontSize: 12,
          fontFamily: "'Roboto', sans-serif", fontWeight: 300,
          zIndex: 220,
          cursor: 'pointer',
          touchAction: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Interact"
      >E</button></>)}
      {showComplete && (
        <div style={{
          position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
          color: '#769826', fontSize: 14,
          fontFamily: "'Poppins', sans-serif", fontWeight: 700, letterSpacing: 3,
          zIndex: 300,
          textShadow: '0 0 20px rgba(118,152,38,0.3)',
        }}>
          LEVEL COMPLETE
        </div>
      )}
      {showPuzzle && (
        <CodeTerminal
          puzzle={showPuzzle}
          onSolve={handlePuzzleSolve}
          onClose={handlePuzzleClose}
        />
      )}
    </div>
  )
}
