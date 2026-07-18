import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  position: [number, number, number]
  color?: string
  intensity?: number
}

export default function TorchLight({ position, color = '#ff8844', intensity = 0.5 }: Props) {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = Math.max(0, intensity + Math.sin(clock.elapsedTime * 5 + position[0]) * 0.15)
    }
  })

  return (
    <pointLight
      ref={lightRef}
      position={position}
      color={color}
      intensity={intensity}
      distance={4}
      decay={2}
    />
  )
}
