import { useMemo } from 'react'
import * as THREE from 'three'
import { LevelTheme } from '../../game/themes'
import { GroundSegment } from '../../game/types'

const SCALE = 0.01
const CORRIDOR_Z = 3

interface Props {
  ground: GroundSegment[]
  blockers: GroundSegment[]
  theme: LevelTheme
  worldWidth: number
}

function decorateType(type: string, ww: number, theme: LevelTheme): React.ReactNode[] {
  const els: React.ReactNode[] = []
  const w = ww * SCALE

  switch (type) {
    case 'walls': {
      for (let wx = 0; wx < w; wx += 0.6) {
        const h = 0.15 + Math.sin(wx * 13) * 0.05
        els.push(
          <mesh key={`w-${wx}`} position={[wx, 0.6 + h / 2, -CORRIDOR_Z + 0.05]}>
            <boxGeometry args={[0.03, h, 0.1]} />
            <meshBasicMaterial color={theme.sceneryColor1} />
          </mesh>,
          <mesh key={`wb-${wx}`} position={[wx, 0.6 + h / 2, CORRIDOR_Z - 0.05]}>
            <boxGeometry args={[0.03, h, 0.1]} />
            <meshBasicMaterial color={theme.sceneryColor1} />
          </mesh>,
        )
      }
      break
    }
    case 'pillars': {
      for (let px = 0.5; px < w; px += 1.2) {
        els.push(
          <mesh key={`p-${px}`} position={[px, 0.8, -CORRIDOR_Z + 0.15]}>
            <boxGeometry args={[0.08, 1.2, 0.08]} />
            <meshBasicMaterial color={theme.sceneryColor2} />
          </mesh>,
          <mesh key={`pb-${px}`} position={[px, 0.8, CORRIDOR_Z - 0.15]}>
            <boxGeometry args={[0.08, 1.2, 0.08]} />
            <meshBasicMaterial color={theme.sceneryColor2} />
          </mesh>,
        )
      }
      break
    }
    case 'trees': {
      for (let tx = 0.3; tx < w; tx += 0.7) {
        els.push(
          <mesh key={`t-${tx}`} position={[tx, 0.6, -CORRIDOR_Z + 0.1]}>
            <coneGeometry args={[0.12, 0.3, 4]} />
            <meshBasicMaterial color={theme.sceneryColor1} />
          </mesh>,
          <mesh key={`tb-${tx}`} position={[tx, 0.4, CORRIDOR_Z - 0.1]}>
            <coneGeometry args={[0.12, 0.3, 4]} />
            <meshBasicMaterial color={theme.sceneryColor1} />
          </mesh>,
        )
      }
      break
    }
    case 'buildings': {
      for (let bx = 0.6; bx < w; bx += 1) {
        els.push(
          <mesh key={`bd-${bx}`} position={[bx, 0.5, -CORRIDOR_Z + 0.1]}>
            <boxGeometry args={[0.15, 0.5, 0.15]} />
            <meshBasicMaterial color={theme.sceneryColor1} />
          </mesh>,
          <mesh key={`bdb-${bx}`} position={[bx, 0.7, CORRIDOR_Z - 0.1]}>
            <boxGeometry args={[0.12, 0.6, 0.12]} />
            <meshBasicMaterial color={theme.sceneryColor2} />
          </mesh>,
        )
      }
      break
    }
    case 'columns': {
      for (let cx = 0.4; cx < w; cx += 0.8) {
        els.push(
          <mesh key={`c-${cx}`} position={[cx, 0.9, -CORRIDOR_Z + 0.1]}>
            <cylinderGeometry args={[0.04, 0.06, 1.2, 6]} />
            <meshBasicMaterial color={theme.sceneryColor1} />
          </mesh>,
          <mesh key={`cb-${cx}`} position={[cx, 0.9, CORRIDOR_Z - 0.1]}>
            <cylinderGeometry args={[0.04, 0.06, 1.2, 6]} />
            <meshBasicMaterial color={theme.sceneryColor1} />
          </mesh>,
        )
      }
      break
    }
    case 'pipes': {
      for (let px = 0.3; px < w; px += 0.8) {
        els.push(
          <mesh key={`pi-${px}`} position={[px, 0.5, -CORRIDOR_Z + 0.15]}>
            <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} rotation={[0, 0, Math.PI / 2]} />
            <meshBasicMaterial color={theme.sceneryColor2} />
          </mesh>,
          <mesh key={`pib-${px}`} position={[px, 0.5, CORRIDOR_Z - 0.15]}>
            <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} rotation={[0, 0, Math.PI / 2]} />
            <meshBasicMaterial color={theme.sceneryColor2} />
          </mesh>,
        )
      }
      break
    }
    case 'grand': {
      for (let gx = 0.4; gx < w; gx += 0.6) {
        els.push(
          <mesh key={`g-${gx}`} position={[gx, 0.6, -CORRIDOR_Z + 0.12]}>
            <boxGeometry args={[0.06, 0.8, 0.06]} />
            <meshBasicMaterial color={theme.sceneryColor1} />
          </mesh>,
          <mesh key={`gb-${gx}`} position={[gx, 0.6, CORRIDOR_Z - 0.12]}>
            <boxGeometry args={[0.06, 0.8, 0.06]} />
            <meshBasicMaterial color={theme.sceneryColor1} />
          </mesh>,
          <mesh key={`gc-${gx}`} position={[gx, 1.0, -CORRIDOR_Z + 0.12]}>
            <boxGeometry args={[0.1, 0.04, 0.1]} />
            <meshBasicMaterial color={theme.accentColor} />
          </mesh>,
          <mesh key={`gcb-${gx}`} position={[gx, 1.0, CORRIDOR_Z - 0.12]}>
            <boxGeometry args={[0.1, 0.04, 0.1]} />
            <meshBasicMaterial color={theme.accentColor} />
          </mesh>,
        )
      }
      break
    }
  }
  return els
}

export default function LevelEnvironment({ ground, blockers, theme, worldWidth: ww }: Props) {
  const groundHeight = 50 * SCALE
  const skyHeight = 3.5

  const decorations = useMemo(() => {
    return decorateType(theme.sceneryType, ww, theme)
  }, [theme, ww])

  const starsGeo = useMemo(() => {
    const count = 80
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * (ww * SCALE + 2)
      positions[i * 3 + 1] = 2 + Math.random() * 1.5
      positions[i * 3 + 2] = -CORRIDOR_Z - 0.5 - Math.random() * 2
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [ww])

  return (
    <group>
      {ground.map((g, i) => (
        <mesh key={`ground-${i}`} position={[(g.x + g.w / 2) * SCALE, -groundHeight / 2, 0]}>
          <boxGeometry args={[g.w * SCALE, groundHeight, CORRIDOR_Z * 2]} />
          <meshBasicMaterial color={theme.roadFill} />
        </mesh>
      ))}
      {ground.map((g, i) => (
        <mesh key={`ground-edge-${i}`} position={[(g.x + g.w / 2) * SCALE, 0.015, 0]}>
          <boxGeometry args={[g.w * SCALE, 0.03, CORRIDOR_Z * 2]} />
          <meshBasicMaterial color={theme.roadEdge} />
        </mesh>
      ))}
      {blockers.map((b, i) => (
        <mesh key={`blocker-${i}`} position={[(b.x + b.w / 2) * SCALE, (b.h / 2) * SCALE, 0]}>
          <boxGeometry args={[b.w * SCALE, b.h * SCALE, CORRIDOR_Z * 2]} />
          <meshBasicMaterial color={theme.sceneryColor1} />
        </mesh>
      ))}
      <mesh position={[0, 2.8, -CORRIDOR_Z - 0.3]}>
        <planeGeometry args={[ww * SCALE + 2, skyHeight]} />
        <meshBasicMaterial color={theme.skyTop} />
      </mesh>
      <mesh position={[0, 2.0, -CORRIDOR_Z - 0.29]}>
        <planeGeometry args={[ww * SCALE + 2, 1.5]} />
        <meshBasicMaterial color={theme.skyBottom} />
      </mesh>
      <points geometry={starsGeo}>
        <pointsMaterial size={0.03} color="#F0EBE3" transparent opacity={0.5} />
      </points>
      <mesh position={[0, -0.01, 0]}>
        <planeGeometry args={[ww * SCALE + 2, 0.5]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color={theme.hillColor} />
      </mesh>
      {decorations}
    </group>
  )
}
