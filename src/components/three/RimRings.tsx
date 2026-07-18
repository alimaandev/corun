import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  colorRef: React.MutableRefObject<THREE.Color>
  intensityRef: React.MutableRefObject<number>
  sectionRef: React.MutableRefObject<number>
}

export default function RimRings({ colorRef, intensityRef, sectionRef }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const ring1Ref = useRef<THREE.LineLoop>(null)
  const ring2Ref = useRef<THREE.LineLoop>(null)

  const [ring1Geo, ring2Geo] = useMemo(() => {
    const r1 = new THREE.BufferGeometry()
    const r2 = new THREE.BufferGeometry()
    const segments = 80
    const pos1 = new Float32Array(segments * 3)
    const pos2 = new Float32Array(segments * 3)
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      const rx = 2.4
      const rz = 2.4
      pos1[i * 3] = rx * Math.cos(theta)
      pos1[i * 3 + 1] = 0
      pos1[i * 3 + 2] = rz * Math.sin(theta)
      const tilt = 0.4
      pos2[i * 3] = rx * 1.3 * Math.cos(theta)
      pos2[i * 3 + 1] = rx * 0.5 * Math.sin(theta + tilt) * 0.6
      pos2[i * 3 + 2] = rz * 1.3 * Math.sin(theta)
    }
    r1.setAttribute('position', new THREE.BufferAttribute(pos1, 3))
    r2.setAttribute('position', new THREE.BufferAttribute(pos2, 3))
    return [r1, r2]
  }, [])

  useFrame(({ clock }) => {
    if (!ring1Ref.current || !ring2Ref.current || !groupRef.current) return

    const color = colorRef.current
    const intensity = intensityRef.current

    groupRef.current.visible = sectionRef.current >= 1

    const t = clock.elapsedTime
    ring1Ref.current.rotation.x = 0.1
    ring1Ref.current.rotation.y = t * 0.08
    ring2Ref.current.rotation.x = 0.6 + Math.sin(t * 0.05) * 0.1
    ring2Ref.current.rotation.z = t * 0.05

    const mat1 = ring1Ref.current.material as THREE.LineBasicMaterial
    const mat2 = ring2Ref.current.material as THREE.LineBasicMaterial
    mat1.color.copy(color)
    mat2.color.copy(color)
    mat1.opacity = 0.15 + intensity * 0.35
    mat2.opacity = 0.1 + intensity * 0.25
  })

  return (
    <group ref={groupRef}>
      <lineLoop ref={ring1Ref} geometry={ring1Geo}>
        <lineBasicMaterial transparent opacity={0.3} />
      </lineLoop>
      <lineLoop ref={ring2Ref} geometry={ring2Geo}>
        <lineBasicMaterial transparent opacity={0.2} />
      </lineLoop>
    </group>
  )
}
