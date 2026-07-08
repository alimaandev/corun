import React, { useRef, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Challenge, HUDData, Difficulty } from './types'
import { getRandomChallenge } from './challenges'

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
const BOOST_SPEED = 2
const PENALTY_SPEED = 0.55
const LANE_WIDTH = 2.2


interface GameState3D {
  score: number
  gap: number
  speed: number
  streak: number
  currentLane: number
  runDist: number
  boostUntil: number
  penaltyUntil: number
  screenShake: number
}

export interface ThreeGameHandle {
  startGame: (topic?: string, difficulty?: Difficulty) => void
  handleAnswer: (correct: boolean) => void
  handleTimeout: () => void
}

interface Props {
  topic?: string
  difficulty?: Difficulty
  onChallenge: (challenge: Challenge) => void
  onGameOver: (score: number) => void
  onHUDUpdate: (data: HUDData) => void
}

function PlayerModel({ stateRef }: { stateRef: { current: GameState3D } }) {
  const groupRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)
  const leftArmRef = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!groupRef.current) return
    const s = stateRef.current
    const targetX = s.currentLane * LANE_WIDTH
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.12

    const bob = Math.abs(Math.sin(s.runDist * 0.8)) * 0.12 * s.speed
    groupRef.current.position.y = bob

    const swing = Math.sin(s.runDist * 0.8) * 0.35
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.6
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.6
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.45, 8, 12]} />
        <meshStandardMaterial color="#4FC3F7" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.25, 10, 10]} />
        <meshStandardMaterial color="#FFCC80" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.35, -0.18]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#FFCC80" roughness={0.7} />
      </mesh>
      <mesh ref={leftLegRef} position={[-0.14, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.22, 6, 8]} />
        <meshStandardMaterial color="#1565C0" roughness={0.6} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.14, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.22, 6, 8]} />
        <meshStandardMaterial color="#1565C0" roughness={0.6} />
      </mesh>
      <mesh ref={leftArmRef} position={[-0.34, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.2, 6, 8]} />
        <meshStandardMaterial color="#FFCC80" roughness={0.7} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.34, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.2, 6, 8]} />
        <meshStandardMaterial color="#FFCC80" roughness={0.7} />
      </mesh>
      <mesh position={[-0.08, 1.4, -0.22]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#222" />
      </mesh>
      <mesh position={[0.08, 1.4, -0.22]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#222" />
      </mesh>
    </group>
  )
}

function MonsterModel({ stateRef }: { stateRef: { current: GameState3D } }) {
  const groupRef = useRef<THREE.Group>(null)
  const eyeGlowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const s = stateRef.current
    const t = clock.getElapsedTime()

    const monsterZ = 3 + (100 - Math.min(100, s.gap)) * 0.035
    groupRef.current.position.z = monsterZ

    const danger = Math.max(0, Math.min(1, (70 - s.gap) / 70))
    const scale = 1 + danger * 0.35
    groupRef.current.scale.setScalar(scale)

    const bob = Math.sin(t * 2.5) * 0.04 * (0.5 + danger * 0.5)
    groupRef.current.position.y = -0.4 + bob

    if (eyeGlowRef.current) {
      const mat = eyeGlowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.3 + Math.sin(t * 4) * 0.2 + danger * 0.3
    }
  })

  const danger = () => Math.max(0, Math.min(1, (70 - stateRef.current.gap) / 70))

  return (
    <group ref={groupRef} position={[0, -0.4, 5]}>
      <mesh ref={eyeGlowRef} position={[0, 2.2, -0.6]}>
        <planeGeometry args={[1.2, 0.4]} />
        <meshBasicMaterial color="#ff2200" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 1.5, 8]} />
        <meshStandardMaterial color="#1a0808" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshStandardMaterial color="#2a0a0a" roughness={0.7} />
      </mesh>
      <mesh position={[-0.25, 1.7, -0.45]}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color="#ff1100" emissive="#ff0000" emissiveIntensity={1.5} roughness={0.1} />
      </mesh>
      <mesh position={[0.25, 1.7, -0.45]}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color="#ff1100" emissive="#ff0000" emissiveIntensity={1.5} roughness={0.1} />
      </mesh>
      <mesh position={[-0.3, 2.2, 0]} rotation={[0, 0, -0.35]} castShadow>
        <coneGeometry args={[0.18, 0.45, 6]} />
        <meshStandardMaterial color="#0a0505" roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 2.2, 0]} rotation={[0, 0, 0.35]} castShadow>
        <coneGeometry args={[0.18, 0.45, 6]} />
        <meshStandardMaterial color="#0a0505" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.4, -0.45]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.08]} />
        <meshStandardMaterial color="#3a0a0a" roughness={0.9} />
      </mesh>
      <mesh position={[-0.5, 1.2, -0.2]} rotation={[0.2, 0, 0.15]} castShadow>
        <capsuleGeometry args={[0.1, 0.4, 6, 8]} />
        <meshStandardMaterial color="#1a0808" roughness={0.8} />
      </mesh>
      <mesh position={[0.5, 1.2, -0.2]} rotation={[0.2, 0, -0.15]} castShadow>
        <capsuleGeometry args={[0.1, 0.4, 6, 8]} />
        <meshStandardMaterial color="#1a0808" roughness={0.8} />
      </mesh>
      <pointLight position={[0, 1.5, -0.2]} color="#ff2200" intensity={0.6} distance={3} />
    </group>
  )
}

function Ground({ stateRef }: { stateRef: { current: GameState3D } }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const tileLength = 4

  useFrame(() => {
    if (!meshRef.current) return
    const s = stateRef.current
    const offset = (s.runDist * 0.5) % tileLength
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    if (mat.map) mat.map.offset.y = offset / (tileLength * 25)
  })

  const tiles = useMemo(() => {
    const p: number[] = []
    for (let i = 0; i < 25; i++) p.push(-i * tileLength)
    return p
  }, [])

  return (
    <group>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, -50]} receiveShadow>
        <planeGeometry args={[LANE_WIDTH * 3 + 2.5, 100, 3, tiles.length]} />
        <meshStandardMaterial color="#c4a46c" roughness={0.9} />
      </mesh>
      {tiles.map((z, i) => (
        <React.Fragment key={i}>
          <mesh position={[-LANE_WIDTH - 0.1, -0.5, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.6, tileLength - 0.2]} />
            <meshBasicMaterial color="#8b7355" />
          </mesh>
          <mesh position={[LANE_WIDTH + 0.1, -0.5, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.6, tileLength - 0.2]} />
            <meshBasicMaterial color="#8b7355" />
          </mesh>
          <mesh position={[0, -0.48, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.04, tileLength - 0.5]} />
            <meshBasicMaterial color="rgba(255,200,100,0.3)" transparent />
          </mesh>
          <mesh position={[-LANE_WIDTH, -0.48, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.04, tileLength - 0.5]} />
            <meshBasicMaterial color="rgba(255,200,100,0.3)" transparent />
          </mesh>
          <mesh position={[LANE_WIDTH, -0.48, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.04, tileLength - 0.5]} />
            <meshBasicMaterial color="rgba(255,200,100,0.3)" transparent />
          </mesh>
          {i % 3 === 0 && (
            <mesh position={[0, -0.47, z + tileLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[LANE_WIDTH * 2.5, 0.06]} />
              <meshBasicMaterial color="rgba(255,180,80,0.15)" transparent />
            </mesh>
          )}
        </React.Fragment>
      ))}
    </group>
  )
}

function Pillars({ stateRef }: { stateRef: { current: GameState3D } }) {
  const groupRef = useRef<THREE.Group>(null)
  const pillarPositions = useMemo(() => {
    const p: number[] = []
    for (let i = 0; i < 25; i++) p.push(-i * 4 - 2)
    return p
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    const s = stateRef.current
    const offset = (s.runDist * 0.5) % 4
    groupRef.current.position.z = offset
  })

  return (
    <group ref={groupRef}>
      {pillarPositions.map((z, i) => (
        <React.Fragment key={i}>
          <mesh position={[-LANE_WIDTH - 1.8, 1.2, z]} castShadow>
            <boxGeometry args={[0.5, 2.8, 0.5]} />
            <meshStandardMaterial color="#a0845c" roughness={0.8} />
          </mesh>
          <mesh position={[-LANE_WIDTH - 1.8, 2.9, z]} castShadow>
            <boxGeometry args={[0.7, 0.2, 0.7]} />
            <meshStandardMaterial color="#d4a84c" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[-LANE_WIDTH - 1.8, -0.2, z]} castShadow>
            <boxGeometry args={[0.6, 0.3, 0.6]} />
            <meshStandardMaterial color="#8b7355" roughness={0.9} />
          </mesh>
          <mesh position={[LANE_WIDTH + 1.8, 1.2, z]} castShadow>
            <boxGeometry args={[0.5, 2.8, 0.5]} />
            <meshStandardMaterial color="#a0845c" roughness={0.8} />
          </mesh>
          <mesh position={[LANE_WIDTH + 1.8, 2.9, z]} castShadow>
            <boxGeometry args={[0.7, 0.2, 0.7]} />
            <meshStandardMaterial color="#d4a84c" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[LANE_WIDTH + 1.8, -0.2, z]} castShadow>
            <boxGeometry args={[0.6, 0.3, 0.6]} />
            <meshStandardMaterial color="#8b7355" roughness={0.9} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  )
}

function Environment() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[8, 20, 5]} intensity={1.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}>
        <orthographicCamera args={[-12, 12, 12, -12, 1, 40]} />
      </directionalLight>
      <pointLight position={[0, 8, -5]} intensity={0.5} color="#ffcc88" />
      <hemisphereLight args={['#87ceeb', '#c4a46c', 0.5]} />
      <fog attach="fog" args={['#d4c8a8', 12, 30]} />
    </>
  )
}

function GameScene({
  stateRef, gameRunning,
}: {
  stateRef: { current: GameState3D }
  gameRunning: { current: boolean }
}) {
  const { camera } = useThree()

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const s = stateRef.current

    const targetCamPos = new THREE.Vector3(1.8, 3.5, 4.5)
    camera.position.lerp(targetCamPos, 0.05)
    camera.lookAt(0, 0.8, -0.5)

    if (!gameRunning.current) return

    s.runDist += s.speed * 5 * dt

    if (s.screenShake > 0) {
      s.screenShake *= 0.9
      if (s.screenShake < 0.01) s.screenShake = 0
    }

    const now = performance.now()
    if (now < s.boostUntil) {
      s.speed = BOOST_SPEED
      s.score += 10 * dt
    } else if (now < s.penaltyUntil) {
      s.speed = PENALTY_SPEED
      s.score += 3 * dt
    } else {
      s.speed = BASE_SPEED
      s.score += 6 * dt
    }

    s.gap -= GAP_DRAIN * s.speed * dt

    if (s.gap <= 0) {
      s.gap = 0
      gameRunning.current = false
    }
  })

  return (
    <>
      <Environment />
      <Ground stateRef={stateRef} />
      <Pillars stateRef={stateRef} />
      <PlayerModel stateRef={stateRef} />
      <MonsterModel stateRef={stateRef} />
    </>
  )
}

const ThreeGame = forwardRef<ThreeGameHandle, Props>((props, ref) => {
  const stateRef = useRef<GameState3D>({
    score: 0, gap: GAP_START, speed: BASE_SPEED, streak: 0,
    currentLane: 0, runDist: 0, boostUntil: 0, penaltyUntil: 0,
    screenShake: 0,
  })
  const gameRunning = useRef(false)
  const gameOverFired = useRef(false)
  const gameInitialized = useRef(false)
  const topicRef = useRef<string | undefined>(undefined)
  const usedChallengeIds = useRef<Set<number>>(new Set())
  const challengeTimerRef = useRef<number>(0)
  const frameCountRef = useRef(0)
  const propsRef = useRef(props)
  propsRef.current = props

  const autoStartRef = useRef({ topic: props.topic, difficulty: props.difficulty })

  useEffect(() => {
    topicRef.current = autoStartRef.current.topic
    resetState()
  }, [])

  function scheduleChallenge() {
    const delay = CHALLENGE_MIN + Math.random() * (CHALLENGE_MAX - CHALLENGE_MIN)
    challengeTimerRef.current = window.setTimeout(() => {
      if (gameRunning.current) {
        const challenge = getRandomChallenge(usedChallengeIds.current, topicRef.current)
        usedChallengeIds.current.add(challenge.id)
        propsRef.current.onChallenge(challenge)
      }
    }, delay)
  }

  function resetState() {
    const s = stateRef.current
    s.score = 0; s.gap = GAP_START; s.speed = BASE_SPEED; s.streak = 0
    s.currentLane = 0; s.runDist = 0; s.boostUntil = 0; s.penaltyUntil = 0
    s.screenShake = 0
    gameRunning.current = true
    gameOverFired.current = false
    gameInitialized.current = true
    usedChallengeIds.current.clear()
    frameCountRef.current = 0
    clearTimeout(challengeTimerRef.current)
    scheduleChallenge()
  }

  useImperativeHandle(ref, () => ({
    startGame(topic?: string, _difficulty?: Difficulty) {
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
    return () => clearTimeout(challengeTimerRef.current)
  }, [])

  return (
    <Canvas
      camera={{ position: [1.8, 3.5, 4.5], fov: 60 }}
      shadows
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <GameScene stateRef={stateRef} gameRunning={gameRunning} />
    </Canvas>
  )
})

export default ThreeGame
