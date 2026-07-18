import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Chamber() {
  const torch1 = useRef<THREE.PointLight>(null)
  const torch2 = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (torch1.current) torch1.current.intensity = 0.5 + Math.sin(clock.elapsedTime * 4) * 0.15
    if (torch2.current) torch2.current.intensity = 0.5 + Math.sin(clock.elapsedTime * 4 + 2) * 0.15
  })

  return (
    <group>
      <ambientLight color="#1a1a2a" intensity={0.5} />
      <directionalLight color="#ff8844" position={[0, 5, 2]} intensity={0.3} />

      <pointLight ref={torch1} position={[-3, 2.5, 2.5]} color="#ff8844" intensity={0.5} distance={6} decay={2} />
      <pointLight ref={torch2} position={[3, 2.5, 2.5]} color="#ff8844" intensity={0.5} distance={6} decay={2} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshBasicMaterial color="#1a1a2a" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.5, -5]}>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshBasicMaterial color="#0a0a1a" />
      </mesh>

      {/* Side walls */}
      <mesh position={[-10, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 10]} />
        <meshBasicMaterial color="#0a0a1a" />
      </mesh>
      <mesh position={[10, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 10]} />
        <meshBasicMaterial color="#0a0a1a" />
      </mesh>

      {/* Pillars */}
      {[[-4, 0, -4], [4, 0, -4], [-4, 0, -2], [4, 0, -2]].map(([x, _, z], i) => (
        <mesh key={`pillar-${i}`} position={[x, 1.5, z]}>
          <boxGeometry args={[0.6, 3, 0.6]} />
          <meshBasicMaterial color="#2a2a3a" />
        </mesh>
      ))}

      {/* Torch props on walls */}
      {[[-9, 1.8, -3], [9, 1.8, -3]].map(([x, y, z], i) => (
        <group key={`torch-${i}`}>
          <mesh position={[x, y - 0.3, z]}>
            <boxGeometry args={[0.08, 0.6, 0.08]} />
            <meshBasicMaterial color="#5a3a1a" />
          </mesh>
          <mesh position={[x + (i === 0 ? 0.15 : -0.15), y + 0.1, z]}>
            <planeGeometry args={[0.25, 0.25]} />
            <meshBasicMaterial color="#ff8844" transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
