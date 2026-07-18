import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { playStep } from '../../game/sound'
import { drawPlayerSprite } from '../../game/sprites'
import { spriteToTexture } from '../../utils/spriteToTexture'
import { GroundSegment, TriggerZone as TriggerZoneType } from '../../game/types'

const SCALE = 0.01
const PW = 20 * SCALE
const PH = 30 * SCALE
const SPEED = 3 * SCALE

interface Props {
  playerX: React.MutableRefObject<number>
  keysDown: React.MutableRefObject<Set<string>>
  blockers: GroundSegment[]
  triggers: TriggerZoneType[]
  worldWidth: number
  exitZone: { x: number; y: number; w: number; h: number } | undefined
  solvedPuzzles: React.MutableRefObject<Set<string>>
  allSolved: boolean
  onNearTrigger: (t: TriggerZoneType | null) => void
  onExitZone: () => void
}

export default function PlayerController({
  playerX, keysDown, blockers, triggers, worldWidth, exitZone,
  solvedPuzzles, allSolved, onNearTrigger, onExitZone,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const stepCounter = useRef(0)
  const dir = useRef(1)
  const enteredExit = useRef(false)
  const prevTriggerId = useRef<string | null>(null)
  const texture = spriteToTexture(drawPlayerSprite, 'player', 3)

  useEffect(() => { enteredExit.current = false }, [exitZone])

  useFrame(() => {
    let moved = false

    if (keysDown.current.has('arrowleft') || keysDown.current.has('a')) {
      let nx = Math.max(0, playerX.current - SPEED)
      for (const b of blockers) {
        const bx = b.x * SCALE
        const bw = b.w * SCALE
        if (nx < bx + bw && nx + PW > bx) {
          nx = bx + bw
        }
      }
      if (nx !== playerX.current) moved = true
      playerX.current = nx
      if (moved) dir.current = -1
    }

    if (keysDown.current.has('arrowright') || keysDown.current.has('d')) {
      const worldW = worldWidth * SCALE
      let nx = Math.min(worldW - PW, playerX.current + SPEED)
      for (const b of blockers) {
        const bx = b.x * SCALE
        const bw = b.w * SCALE
        if (nx < bx + bw && nx + PW > bx) {
          nx = bx - PW
        }
      }
      if (nx !== playerX.current) moved = true
      playerX.current = nx
      if (moved) dir.current = 1
    }

    if (moved) {
      stepCounter.current++
      if (stepCounter.current % 6 === 0) playStep()
    }

    const px = playerX.current
    const py = 0
    let foundTrigger: TriggerZoneType | null = null
    for (const t of triggers) {
      if (solvedPuzzles.current.has(t.puzzleId)) continue
      const tx = t.x * SCALE
      const tw = t.w * SCALE
      const ty = (450 - t.y - t.h) * SCALE
      const th = t.h * SCALE
      if (px + PW > tx && px < tx + tw &&
          py + PH > ty && py < ty + th) {
        foundTrigger = t
        break
      }
    }
    const newTriggerId = foundTrigger?.puzzleId ?? null
    if (newTriggerId !== prevTriggerId.current) {
      prevTriggerId.current = newTriggerId
      onNearTrigger(foundTrigger)
    }

    if (exitZone && allSolved && !enteredExit.current) {
      const ex = exitZone.x * SCALE
      const ew = exitZone.w * SCALE
      const ey = (450 - exitZone.y - exitZone.h) * SCALE
      const eh = exitZone.h * SCALE
      if (px + PW > ex && px < ex + ew &&
          py + PH > ey && py < ey + eh) {
        enteredExit.current = true
        onExitZone()
      }
    }

    if (meshRef.current) {
      meshRef.current.position.x = px + PW / 2
      meshRef.current.scale.x = dir.current < 0 ? -1 : 1
    }
  })

  const aspect = texture?.image?.height ? texture.image.width / texture.image.height : 1
  const h = 1.2
  const w = h * aspect

  return (
    <mesh ref={meshRef} position={[playerX.current + PW / 2, 0.6, 0]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} depthTest />
    </mesh>
  )
}
