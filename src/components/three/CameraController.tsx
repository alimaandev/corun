import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

interface Props {
  playerX: React.MutableRefObject<number>
  worldWidth: number
}

export default function CameraController({ playerX, worldWidth }: Props) {
  const { camera } = useThree()
  const smoothX = useRef(playerX.current)

  useFrame(() => {
    smoothX.current += (playerX.current - smoothX.current) * 0.08
    const clampedX = Math.max(-2, Math.min(worldWidth + 2, smoothX.current))
    camera.position.set(clampedX + 2, 3.5, 7)
    camera.lookAt(clampedX, 0.5, 0)
  })

  return null
}
