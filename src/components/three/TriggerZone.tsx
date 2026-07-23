import * as THREE from 'three'

const SCALE = 0.01

interface Props {
  x: number
  y: number
  w: number
  h: number
  solved: boolean
}

export default function TriggerZone({ x, y, w, h, solved }: Props) {
  if (solved) return null

  const px = x * SCALE
  const pw = w * SCALE
  const py = (450 - y - h) * SCALE
  const ph = h * SCALE

  return (
    <mesh position={[px + pw / 2, py + ph / 2, 0]}>
      <boxGeometry args={[pw, ph, 0.05]} />
      <meshBasicMaterial
        color="#F0EBE3"
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
