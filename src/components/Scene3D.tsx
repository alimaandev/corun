import { useEffect, useRef, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { LevelSceneData, CodePuzzle, TriggerZone as TriggerZoneType } from '../game/types'
import { LevelTheme, THEMES } from '../game/themes'
import { getPuzzle } from '../game/engine/data/codePuzzles'
import { getLevelScene } from '../game/engine/data/levelScenes'
import { playInteract, playLevelComplete } from '../game/sound'
import { startMusic, stopMusic, setIntensity } from '../game/audio'
import EditorPanel3D from './three/EditorPanel3D'
import Particles3D, { emitBurst } from './three/Particles3D'
import Joystick from './Joystick'
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
    startMusic(levelId, 0.3)

    if (data) {
      npcs.current = data.npcs.map((n) => ({ ...n }))
    }

    return () => stopMusic()
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

    emitBurst(playerX.current + 0.01, 0.6, 0, 40)

    const totalTriggers = scene?.triggers.length ?? 1
    const solved = solvedPuzzles.current.size
    const ratio = Math.min(1, solved / totalTriggers)
    const newIntensity = 0.3 + ratio * 0.5
    setIntensity(newIntensity)
  }, [scene])

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
      if (activePuzzleRef.current) return
      keysDown.current.add(e.key.toLowerCase())
      if (e.key.toLowerCase() === 'e' && !e.repeat) handleInteract()
    }
    function onKeyUp(e: KeyboardEvent) {
      keysDown.current.delete(e.key.toLowerCase())
    }
    function checkMobile() {
      setIsMobile(window.innerWidth < MOBILE_BREAK)
    }
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

  const allSolved = scene
    ? scene.triggers.every((t) => solvedPuzzles.current.has(t.puzzleId))
    : false

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
      }}
    >
      <Canvas
        key={canvasKey}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 3.5, 7], fov: 45, near: 0.1, far: 50 }}
        style={{ display: 'block', touchAction: 'manipulation' }}
        onCreated={(state) => {
          state.gl.domElement.addEventListener(
            'webglcontextlost',
            (e) => {
              e.preventDefault()
              setTimeout(() => setCanvasKey((k) => k + 1), 500)
            },
            false,
          )
          state.gl.domElement.addEventListener(
            'webglcontextrestored',
            () => {
              state.invalidate()
            },
            false,
          )
        }}
        onError={() => setCanvasKey((k) => k + 1)}
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
              worldWidth={scene.worldWidth}
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
            {showPuzzle && (
              <EditorPanel3D
                puzzle={showPuzzle}
                onSolve={handlePuzzleSolve}
                onClose={handlePuzzleClose}
                playerX={playerX.current}
              />
            )}
          </>
        )}

        <CameraController playerX={playerX} worldWidth={(scene?.worldWidth ?? 900) * 0.01} />
        <Particles3D />
      </Canvas>

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
        }}
      >
        &larr; &rarr; MOVE &nbsp;|&nbsp; E INTERACT
      </div>

      {isMobile && !showPuzzle && <Joystick keysDown={keysDown} onInteract={handleInteract} />}

      {showComplete && (
        <div
          style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            color: '#769826',
            fontSize: 14,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            letterSpacing: 3,
            zIndex: 300,
            textShadow: '0 0 20px rgba(118,152,38,0.3)',
          }}
        >
          LEVEL COMPLETE
        </div>
      )}
    </div>
  )
}
