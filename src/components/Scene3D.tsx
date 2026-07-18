import { useEffect, useRef, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { LevelSceneData, CodePuzzle, TriggerZone as TriggerZoneType } from '../game/types'
import { LevelTheme, THEMES } from '../game/themes'
import { getPuzzle } from '../game/codePuzzles'
import { getLevelScene } from '../game/levelScenes'
import { playInteract, playLevelComplete } from '../game/sound'
import CodeTerminal from './CodeTerminal'
import CameraController from './three/CameraController'
import PlayerController from './three/PlayerController'
import NPCController from './three/NPCController'
import TriggerZone from './three/TriggerZone'
import LevelEnvironment from './three/LevelEnvironment'
import TorchLight from './three/TorchLight'
import { SceneNpc } from '../game/types'

interface Props {
  levelId: number
  onComplete: () => void
}

const MOBILE_BREAK = 768

export default function Scene3D({ levelId, onComplete }: Props) {
  const [canvasKey, setCanvasKey] = useState(0)
  const [scene, setScene] = useState<LevelSceneData | null>(null)
  const [theme, setTheme] = useState<LevelTheme>(THEMES[1])
  const playerX = useRef(80 * 0.01)
  const keysDown = useRef<Set<string>>(new Set())
  const solvedPuzzles = useRef<Set<string>>(new Set())
  const npcs = useRef<SceneNpc[]>([])
  const levelCompleteShown = useRef(false)
  const completeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(0)
  const [showPuzzle, setShowPuzzle] = useState<CodePuzzle | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [nearTrigger, setNearTrigger] = useState<TriggerZoneType | null>(null)
  const activePuzzleRef = useRef<CodePuzzle | null>(null)

  useEffect(() => {
    const data = getLevelScene(levelId)
    setScene(data ?? null)
    setTheme(THEMES[levelId] || THEMES[1])
    playerX.current = (data?.playerStart.x ?? 80) * 0.01
    solvedPuzzles.current = new Set()
    levelCompleteShown.current = false
    npcs.current = []
    setShowComplete(false)
    setShowPuzzle(null)
    activePuzzleRef.current = null
    setNearTrigger(null)

    if (data) {
      npcs.current = data.npcs.map(n => ({ ...n }))
    }
  }, [levelId])

  const handleInteract = useCallback(() => {
    if (activePuzzleRef.current) return
    const trigger = nearTrigger
    if (!trigger) return
    const puzzle = getPuzzle(trigger.puzzleId)
    if (puzzle) {
      playInteract()
      activePuzzleRef.current = puzzle
      setShowPuzzle(puzzle)
    }
  }, [nearTrigger])

  const handlePuzzleSolve = useCallback(() => {
    const puzzle = activePuzzleRef.current
    if (!puzzle) return
    solvedPuzzles.current.add(puzzle.id)
    activePuzzleRef.current = null
    setNearTrigger(null)
    setShowPuzzle(null)
  }, [])

  const handlePuzzleClose = useCallback(() => {
    activePuzzleRef.current = null
    setShowPuzzle(null)
  }, [])

  const handleExitZone = useCallback(() => {
    if (levelCompleteShown.current) return
    levelCompleteShown.current = true
    setShowComplete(true)
    playLevelComplete()
    completeTimeoutRef.current = window.setTimeout(() => onComplete(), 600)
  }, [onComplete])

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

  useEffect(() => {
    return () => clearTimeout(completeTimeoutRef.current)
  }, [])

  const allSolved = scene ? scene.triggers.every(t => solvedPuzzles.current.has(t.puzzleId)) : false

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#000', zIndex: 200,
    }}>
      <Canvas
        key={canvasKey}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 3.5, 7], fov: 45, near: 0.1, far: 50 }}
        style={{ display: 'block', touchAction: 'manipulation' }}
        onCreated={(state) => {
          state.gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            console.warn('[WebGL] Context lost, forcing remount...')
            setTimeout(() => setCanvasKey(k => k + 1), 500)
          }, false)
          state.gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('[WebGL] Context restored')
            state.invalidate()
          }, false)
        }}
      >
        <color attach="background" args={[theme.skyTop]} />
        <ambientLight color={theme.ambientLight} intensity={0.6} />
        <directionalLight color={theme.directionalLight} position={[5, 8, 3]} intensity={0.4} />

        {scene && (
          <>
            <LevelEnvironment
              ground={scene.ground}
              blockers={scene.blockers}
              theme={theme}
            />
            {scene.triggers.map((t, i) => (
              <TriggerZone
                key={t.puzzleId}
                x={t.x}
                y={t.y}
                w={t.w}
                h={t.h}
                solved={solvedPuzzles.current.has(t.puzzleId)}
              />
            ))}
            {npcs.current.map((npc) => (
              <NPCController key={`${levelId}-${npc.npcId}`} npc={npc} />
            ))}
            <PlayerController
              playerX={playerX}
              keysDown={keysDown}
              blockers={scene.blockers}
              triggers={scene.triggers}
              worldWidth={scene.worldWidth ?? 900}
              exitZone={scene.exitZone}
              solvedPuzzles={solvedPuzzles}
              allSolved={allSolved}
              onNearTrigger={setNearTrigger}
              onExitZone={handleExitZone}
            />
            {scene.triggers.map((t, i) => (
              <TorchLight
                key={`torch-${i}`}
                position={[(t.x + t.w / 2) * 0.01, 2.5, 2.5]}
                color={theme.accentColor}
                intensity={0.4}
              />
            ))}
          </>
        )}

        <CameraController
          playerX={playerX}
          worldWidth={(scene?.worldWidth ?? 900) * 0.01}
        />
      </Canvas>

      <div style={{
        position: 'fixed', top: 8, left: 8,
        color: '#555', fontSize: 8,
        fontFamily: "'Press Start 2P', monospace",
        zIndex: 210,
        letterSpacing: 1,
      }}>
        &larr; &rarr; MOVE &nbsp;|&nbsp; E INTERACT
      </div>

      {isMobile && (
        <>
          {['left', 'right', 'interact'].map(side => {
            const isLeft = side === 'left'
            const isRight = side === 'right'
            const style: React.CSSProperties = {
              position: 'fixed',
              bottom: isLeft || isRight ? 16 : 16,
              left: isLeft ? 16 : isRight ? 96 : undefined,
              right: isLeft || isRight ? undefined : 16,
              width: isLeft || isRight ? 64 : 56,
              height: isLeft || isRight ? 64 : 56,
              background: 'rgba(79,195,247,0.25)',
              border: '2px solid rgba(79,195,247,0.5)',
              borderRadius: isLeft || isRight ? 12 : '50%',
              color: '#4FC3F7', fontSize: isLeft || isRight ? 24 : 12,
              fontFamily: "'Press Start 2P', monospace",
              zIndex: 220, cursor: 'pointer',
              touchAction: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }
            if (isLeft) {
              return (
                <button key={side} style={style}
                  onTouchStart={() => keysDown.current.add('arrowleft')}
                  onTouchEnd={() => keysDown.current.delete('arrowleft')}
                  onTouchCancel={() => keysDown.current.delete('arrowleft')}
                  onMouseDown={() => keysDown.current.add('arrowleft')}
                  onMouseUp={() => keysDown.current.delete('arrowleft')}
                  onMouseLeave={() => keysDown.current.delete('arrowleft')}
                  onContextMenu={e => e.preventDefault()}
                  aria-label="Move left"
                >&larr;</button>
              )
            }
            if (isRight) {
              return (
                <button key={side} style={style}
                  onTouchStart={() => keysDown.current.add('arrowright')}
                  onTouchEnd={() => keysDown.current.delete('arrowright')}
                  onTouchCancel={() => keysDown.current.delete('arrowright')}
                  onMouseDown={() => keysDown.current.add('arrowright')}
                  onMouseUp={() => keysDown.current.delete('arrowright')}
                  onMouseLeave={() => keysDown.current.delete('arrowright')}
                  onContextMenu={e => e.preventDefault()}
                  aria-label="Move right"
                >&rarr;</button>
              )
            }
            return (
              <button key={side} style={style}
                onTouchStart={handleInteract}
                onClick={handleInteract}
                onContextMenu={e => e.preventDefault()}
                aria-label="Interact"
              >E</button>
            )
          })}
        </>
      )}

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
