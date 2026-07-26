import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NPC_DRAWERS, NpcId } from '../../game/sprites'
import { spriteToTexture } from '../../utils/spriteToTexture'
import { SceneNpc } from '../../game/types'

const SCALE = 0.01

interface Props {
  npc: SceneNpc
}

export default function NPCController({ npc }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const xRef = useRef(npc.x * SCALE)
  const dirRef = useRef(npc.dir === 'right' ? 1 : -1)
  const timeRef = useRef(Math.random() * 100)
  const valid = npc.npcId in NPC_DRAWERS
  const drawer = valid ? NPC_DRAWERS[npc.npcId as NpcId] : undefined
  const texture = drawer ? spriteToTexture(drawer, npc.npcId, 3) : undefined
  const hasPatrol = npc.patrol !== undefined

  useFrame((_, delta) => {
    timeRef.current += delta
    if (!meshRef.current) return

    const moving = hasPatrol && npc.patrol !== undefined

    if (moving && npc.patrol) {
      const [lo, hi] = npc.patrol
      const speed = 0.5 * SCALE
      xRef.current += dirRef.current * speed
      if (xRef.current >= hi * SCALE) {
        xRef.current = hi * SCALE
        dirRef.current = -1
      }
      if (xRef.current <= lo * SCALE) {
        xRef.current = lo * SCALE
        dirRef.current = 1
      }
    }

    meshRef.current.position.x = xRef.current
    meshRef.current.position.y =
      0.6 + Math.sin(timeRef.current * (moving ? 6 : 2.5)) * (moving ? 0.02 : 0.008)
    meshRef.current.scale.x = dirRef.current < 0 ? -1 : 1
  })

  if (!valid || !drawer || !texture) return null

  const aspect = texture?.image?.height ? texture.image.width / texture.image.height : 1
  const h = 1.2
  const w = h * aspect

  return (
    <mesh ref={meshRef} position={[xRef.current, 0.6, 0]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} depthTest />
    </mesh>
  )
}
