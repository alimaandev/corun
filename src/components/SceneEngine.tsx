import { useEffect, useRef, useState, useCallback } from 'react'
import { LevelSceneData, CodePuzzle, TriggerZone } from '../game/types'
import { LevelTheme, THEMES } from '../game/themes'
import { getPuzzle } from '../game/codePuzzles'
import { getLevelScene } from '../game/levelScenes'
import { drawPlayerSprite, NPC_DRAWERS, NpcId } from '../game/sprites'
import CodeTerminal from './CodeTerminal'

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
  const frameRef = useRef(0)
  const rafRef = useRef(0)
  const keysDown = useRef<Set<string>>(new Set())
  const solvedPuzzles = useRef<Set<string>>(new Set())
  const npcs = useRef<NpcState[]>([])
  const sceneRef = useRef<LevelSceneData | null>(null)
  const themeRef = useRef<LevelTheme>(THEMES[1])
  const levelCompleteShown = useRef(false)
  const nearTriggerRef = useRef<TriggerZone | null>(null)
  const activePuzzleRef = useRef<CodePuzzle | null>(null)

  const [showPuzzle, setShowPuzzle] = useState<CodePuzzle | null>(null)
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

    const scene = sceneRef.current
    if (!scene) return
    npcs.current = scene.npcs.map(n => {
      let newX = n.x
      if (n.patrol) {
        const [lo, hi] = n.patrol
        newX = (n.x - lo) > (hi - n.x) ? lo + 15 : hi - 15
      }
      return { id: n.npcId, x: newX, y: n.y, dir: n.dir, patrol: n.patrol }
    })
  }, [])

  const handlePuzzleClose = useCallback(() => {
    activePuzzleRef.current = null
    setShowPuzzle(null)
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      keysDown.current.add(e.key.toLowerCase())
      if (e.key.toLowerCase() === 'e') handleInteract()
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

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

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
      const W = canvas.width
      const H = canvas.height
      const dpr = window.devicePixelRatio || 1
      const sc = Math.min(W / BASE_W / dpr, H / BASE_H / dpr)
      const ox = (W / dpr - BASE_W * sc) / 2
      const oy = (H / dpr - BASE_H * sc) / 2
      const scene = sceneRef.current
      const theme = themeRef.current
      const pxScale = Math.max(1, Math.floor(sc * 2))
      const frame = frameRef.current
      const camX = cameraX.current

      ctx.clearRect(0, 0, W, H)
      ctx.save()
      ctx.translate(ox * dpr, oy * dpr)
      ctx.scale(sc * dpr, sc * dpr)

      ctx.save()
      ctx.translate(-camX, 0)

      const skyH = Math.floor(BASE_H * 0.45)
      const grad = ctx.createLinearGradient(0, 0, 0, skyH)
      grad.addColorStop(0, theme.skyTop)
      grad.addColorStop(1, theme.skyBottom)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, (scene?.worldWidth ?? BASE_W) + BASE_W, skyH)

      ctx.fillStyle = theme.groundColor
      ctx.fillRect(0, GROUND_Y, (scene?.worldWidth ?? BASE_W) + BASE_W, BASE_H - GROUND_Y)

      if (scene) {
        for (const g of scene.ground) {
          ctx.fillStyle = theme.roadEdge || '#3a3a2a'
          ctx.fillRect(g.x, g.y, g.w, g.h)
          ctx.fillStyle = theme.roadFill || '#5a5a3a'
          ctx.fillRect(g.x + 2, g.y + 2, g.w - 4, g.h - 4)
        }

        for (const b of scene.blockers) {
          ctx.fillStyle = '#2a2a3a'
          ctx.fillRect(b.x, b.y, b.w, b.h)
          ctx.fillStyle = 'rgba(0,0,0,0.3)'
          ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4)
        }

        for (const t of scene.triggers) {
          if (solvedPuzzles.current.has(t.puzzleId)) {
            ctx.fillStyle = 'rgba(76,175,80,0.12)'
            ctx.fillRect(t.x, t.y, t.w, t.h)
            continue
          }
          const pulse = Math.sin(frame * 0.05) * 0.3 + 0.7
          ctx.fillStyle = `rgba(79,195,247,${pulse * 0.15})`
          ctx.fillRect(t.x, t.y, t.w, t.h)
          ctx.strokeStyle = `rgba(79,195,247,${pulse * 0.3})`
          ctx.lineWidth = 1
          ctx.strokeRect(t.x, t.y, t.w, t.h)
          ctx.fillStyle = `rgba(79,195,247,${pulse * 0.5})`
          ctx.font = '6px monospace'
          ctx.fillText('⚡', t.x + t.w / 2 - 3, t.y - 4)
        }

        if (scene.exitZone) {
          const ez = scene.exitZone
          const allSolved = scene.triggers.every(t => solvedPuzzles.current.has(t.puzzleId))
          if (allSolved) {
            const pulse = Math.sin(frame * 0.06) * 0.3 + 0.5
            ctx.fillStyle = `rgba(76,255,150,${pulse * 0.15})`
            ctx.fillRect(ez.x, ez.y, ez.w, ez.h)
            ctx.strokeStyle = `rgba(76,255,150,${pulse * 0.4})`
            ctx.lineWidth = 1
            ctx.strokeRect(ez.x, ez.y, ez.w, ez.h)
            ctx.fillStyle = '#4CFF96'
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
            ctx.translate(npc.x + 20, 0)
            ctx.scale(-1, 1)
            drawer(ctx, 0, npc.y - 20, pxScale, frame * 0.001)
          } else {
            drawer(ctx, npc.x, npc.y - 20, pxScale, frame * 0.001)
          }
          ctx.restore()
        }
      }

      drawPlayerSprite(ctx, playerX.current, GROUND_Y - PLAYER_H - 2, pxScale, frame * 0.001)

      ctx.restore()

      const nearTrigger = nearTriggerRef.current
      const hasActivePuzzle = activePuzzleRef.current
      if (nearTrigger && !hasActivePuzzle) {
        const pulse = Math.sin(frame * 0.08) * 0.3 + 0.7
        ctx.fillStyle = `rgba(79,195,247,${pulse})`
        ctx.font = '8px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('[E] INTERACT', BASE_W / 2, BASE_H - 20)
        ctx.textAlign = 'start'
      }

      ctx.restore()
      frameRef.current++
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const scene = sceneRef.current
      if (!scene) return

      if (keysDown.current.has('arrowleft') || keysDown.current.has('a')) {
        let nx = Math.max(0, playerX.current - PLAYER_SPEED)
        for (const b of scene.blockers) {
          if (nx < b.x + b.w && nx + PLAYER_W > b.x &&
              GROUND_Y - PLAYER_H < b.y + b.h && GROUND_Y > b.y) {
            nx = b.x + b.w
          }
        }
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
        playerX.current = nx
      }

      const targetCam = playerX.current - BASE_W / 2 + PLAYER_W / 2
      cameraX.current = Math.max(0, Math.min(scene.worldWidth - BASE_W, targetCam))

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
            setTimeout(() => onComplete(), 600)
          }
        }
      }
    }, 1000 / 60)

    return () => clearInterval(id)
  }, [onComplete])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#000', zIndex: 200,
    }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <div style={{
        position: 'fixed', top: 8, left: 8,
        color: '#555', fontSize: 8,
        fontFamily: "'Press Start 2P', monospace",
        zIndex: 210,
        letterSpacing: 1,
      }}>
        &larr; &rarr; MOVE &nbsp;|&nbsp; E INTERACT
      </div>
      {showComplete && (
        <div style={{
          position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
          color: '#4CAF50', fontSize: 14,
          fontFamily: "'Press Start 2P', monospace",
          zIndex: 300,
          textShadow: '0 0 20px rgba(76,175,80,0.5)',
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
