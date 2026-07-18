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
  const valid = npc.npcId in NPC_DRAWERS
  if (!valid) console.warn(`NPCController: unknown npcId "${npc.npcId}"`)
  const drawer = valid ? NPC_DRAWERS[npc.npcId as NpcId] : undefined
  const texture = drawer ? spriteToTexture(drawer, npc.npcId, 3) : undefined
  const hasPatrol = npc.patrol !== undefined

  useFrame(() => {
    if (!meshRef.current) return

    if (hasPatrol && npc.patrol) {
      const [lo, hi] = npc.patrol
      const speed = 0.5 * SCALE
      xRef.current += dirRef.current * speed
      if (xRef.current >= hi * SCALE) { xRef.current = hi * SCALE; dirRef.current = -1 }
      if (xRef.current <= lo * SCALE) { xRef.current = lo * SCALE; dirRef.current = 1 }
    }

    meshRef.current.position.x = xRef.current
    meshRef.current.scale.x = dirRef.current < 0 ? -1 : 1
  })

  if (!valid || !drawer || !texture) return null

  const aspect = texture?.image?.height ? texture.image.width / texture.image.height : 1
  const h = 1.2
  const w = h * aspect

  return (
    <mesh
      ref={meshRef}
      position={[xRef.current, 0.6, 0]}
    >
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} depthTest />
    </mesh>
  )
}
