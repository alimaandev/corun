import * as THREE from 'three'
import { LevelTheme } from '../../game/themes'
import { GroundSegment } from '../../game/types'

const SCALE = 0.01
const CORRIDOR_Z = 3

interface Props {
  ground: GroundSegment[]
  blockers: GroundSegment[]
  theme: LevelTheme
}

export default function LevelEnvironment({ ground, blockers, theme }: Props) {
  const groundHeight = 50 * SCALE

  return (
    <group>
      {ground.map((g, i) => (
        <mesh key={`ground-${i}`} position={[(g.x + g.w / 2) * SCALE, -groundHeight / 2, 0]}>
          <boxGeometry args={[g.w * SCALE, groundHeight, CORRIDOR_Z * 2]} />
          <meshBasicMaterial color={theme.roadFill} />
        </mesh>
      ))}
      {ground.map((g, i) => (
        <mesh key={`ground-edge-${i}`} position={[(g.x + g.w / 2) * SCALE, 0.02, 0]}>
          <boxGeometry args={[g.w * SCALE, 0.04, CORRIDOR_Z * 2]} />
          <meshBasicMaterial color={theme.roadEdge} />
        </mesh>
      ))}
      {blockers.map((b, i) => (
        <mesh key={`blocker-${i}`} position={[(b.x + b.w / 2) * SCALE, (b.h / 2) * SCALE, 0]}>
          <boxGeometry args={[b.w * SCALE, b.h * SCALE, CORRIDOR_Z * 2]} />
          <meshBasicMaterial color={theme.sceneryColor1} />
        </mesh>
      ))}
      <mesh position={[0, 2.5, -CORRIDOR_Z]}>
        <planeGeometry args={[50, 5]} />
        <meshBasicMaterial color={theme.hillColor} />
      </mesh>
    </group>
  )
}
