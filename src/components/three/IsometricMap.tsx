import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ALL_LEVELS } from '../../game/levels'
import { LevelProgress } from '../../game/types'

interface Props {
  progress: LevelProgress
  onSelectLevel: (id: number) => void
}

export default function IsometricMap({ progress, onSelectLevel }: Props) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.15) * 0.08
    }
  })

  const levels = ALL_LEVELS

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* Level rooms */}
      {levels.map((level, i) => {
        const x = (i - (levels.length - 1) / 2) * 1.8
        const isUnlocked = level.id <= progress.unlockedUpTo
        const isCompleted = progress.completed.includes(level.id)
        const stars = progress.stars[level.id] || 0
        const isCurrent = level.id === progress.unlockedUpTo && !isCompleted

        let color = 'rgba(240,235,227,0.05)'
        if (isCompleted) color = '#769826'
        else if (isCurrent) color = '#F0EBE3'
        else if (!isUnlocked) color = '#0a0a0a'

        return (
          <group key={level.id}>
            {/* Room */}
            <mesh
              position={[x, 0.3, 0]}
              onClick={() => isUnlocked && onSelectLevel(level.id)}
              onPointerOver={isUnlocked ? () => { document.body.style.cursor = 'pointer' } : undefined}
              onPointerOut={isUnlocked ? () => { document.body.style.cursor = 'default' } : undefined}
            >
              <boxGeometry args={[1.2, 0.6, 0.8]} />
              <meshBasicMaterial color={color} transparent opacity={isUnlocked ? 1 : 0.3} />
            </mesh>
            {/* Arch opening */}
            <mesh position={[x, 0.3, 0.42]}>
              <planeGeometry args={[0.6, 0.4]} />
              <meshBasicMaterial color="#0a0a0a" />
            </mesh>
            {/* Level label */}
            <mesh position={[x, -0.4, 0]}>
              <planeGeometry args={[1, 0.15]} />
              <meshBasicMaterial color="#0a0a0a" />
            </mesh>
            {/* Connection path to next level */}
            {i < levels.length - 1 && (
              <mesh position={[x + 0.9, 0.05, 0]}>
                <boxGeometry args={[0.6, 0.1, 0.2]} />
                <meshBasicMaterial
                  color={level.id < progress.unlockedUpTo ? '#769826' : 'rgba(240,235,227,0.05)'}
                  transparent
                  opacity={level.id < progress.unlockedUpTo ? 0.6 : 0.3}
                />
              </mesh>
            )}
            {/* Stars */}
            {stars > 0 && (
              <mesh position={[x, 0.7, 0]}>
                <planeGeometry args={[0.4 * stars, 0.12]} />
                <meshBasicMaterial color="#F0EBE3" transparent opacity={0.8} />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}
