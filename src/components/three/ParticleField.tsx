import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 2000
const COLORS = [
  new THREE.Color('#F0EBE3'),
  new THREE.Color('#769826'),
]

interface Props {
  colorRef: React.MutableRefObject<THREE.Color>
  spreadRef: React.MutableRefObject<number>
  intensityRef: React.MutableRefObject<number>
}

export default function ParticleField({ colorRef, spreadRef, intensityRef }: Props) {
  const ref = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)

  const [positions, particleColors] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const cols = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2 + Math.random() * 4
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.6
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

      const c = COLORS[Math.floor(Math.random() * COLORS.length)]
      cols[i * 3] = c.r
      cols[i * 3 + 1] = c.g
      cols[i * 3 + 2] = c.b
    }
    return [pos, cols]
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current || !materialRef.current) return

    const color = colorRef.current
    const spread = spreadRef.current
    const intensity = intensityRef.current

    const t = clock.elapsedTime
    const pos = ref.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      const baseR = 2 + (i % 4)
      const angleOffset = (i / COUNT) * Math.PI * 2
      const currentR = baseR * spread

      const theta = t * 0.02 + angleOffset + Math.sin(t * 0.1 + i * 0.01) * 0.1
      const phi = Math.acos(2 * ((i / COUNT) + Math.sin(t * 0.05 + i * 0.005) * 0.05) - 1)

      pos[i3] = currentR * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = currentR * Math.cos(phi) * 0.6 + Math.sin(t * 0.15 + i * 0.02) * 0.3
      pos[i3 + 2] = currentR * Math.sin(phi) * Math.sin(theta)
    }
    ref.current.geometry.attributes.position.needsUpdate = true

    materialRef.current.color.copy(color)
    materialRef.current.opacity = 0.3 + intensity * 0.5
    materialRef.current.size = 0.04 + intensity * 0.06
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={COUNT} array={particleColors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.06}
        transparent
        opacity={0.5}
        vertexColors
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
