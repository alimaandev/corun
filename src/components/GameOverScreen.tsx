import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import Chamber from './three/Chamber'
import StoneButton from './StoneButton'
interface Props {
  score: number
  highScore: number
  playerRank: number | null
  playerName?: string
  badges?: { topic: string; label: string; count: number }[]
  savedClips?: { id: number; url: string; score: number; date: string }[]
  levelMode?: boolean
  levelName?: string
  clipBlob?: Blob | null
  onRestart?: () => void
  onRetryLevel?: () => void
  onBackToLevels?: () => void
  onDeleteClip?: (id: number) => void
}

function Slab({ score, highScore, isNewHighScore }: { score: number; highScore: number; isNewHighScore: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.min(0.3, meshRef.current.position.y + 0.02)
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={[0, -2, 0]}>
        <boxGeometry args={[2.5, 0.2, 1.2]} />
        <meshBasicMaterial color="#2a2a3a" />
      </mesh>
      {isNewHighScore && (
        <mesh position={[0, 0.7, 0]}>
          <planeGeometry args={[1.5, 0.2]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

function Badge({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8 + position[0]) * 0.15
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.3, 0.3]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  )
}

export default function GameOverScreen({
  score, highScore, playerRank, playerName,
  badges = [], savedClips = [],
  levelMode, levelName, clipBlob,
  onRestart, onRetryLevel, onBackToLevels, onDeleteClip,
}: Props) {
  const [canvasKey, setCanvasKey] = useState(0)
  const isStoryMode = !!levelMode
  const isNewHighScore = score > 0 && score >= highScore
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0a0a0a',
      color: '#F0EBE3',
      fontFamily: "'Roboto', sans-serif",
      zIndex: 100,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <Canvas
        key={canvasKey}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 2, 4.5], fov: 50, near: 0.1, far: 30 }}
        style={{ position: 'fixed', inset: 0, display: 'block' }}
        frameloop="demand"
        onCreated={(state) => {
          state.gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            setTimeout(() => setCanvasKey(k => k + 1), 500)
          }, false)
          state.gl.domElement.addEventListener('webglcontextrestored', () => {
            state.invalidate()
          }, false)
        }}
        onError={() => setCanvasKey(k => k + 1)}
      >
        <Chamber />
        <Slab score={score} highScore={highScore} isNewHighScore={isNewHighScore} />
        {badges.slice(0, 3).map((_, i) => (
          <Badge
            key={i}
            position={[
              Math.cos((i / 3) * Math.PI * 2) * 1.2,
              1 + Math.sin((i / 3) * Math.PI * 2) * 0.5,
              Math.sin((i / 3) * Math.PI * 2) * 0.5,
            ]}
            color={['#F0EBE3', '#769826', '#F0EBE3'][i]}
          />
        ))}
      </Canvas>

      <div style={{
        position: 'absolute', zIndex: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 12, textAlign: 'center',
      }}>
        <div style={{ fontSize: 7, color: 'rgba(240,235,227,0.5)', letterSpacing: 4, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
          GAME OVER
        </div>
        <div style={{ fontSize: 12, color: 'rgba(240,235,227,0.6)', fontFamily: "'Roboto', sans-serif", fontWeight: 300 }}>
          THE MONSTER CAUGHT YOU
        </div>
        <div style={{ fontSize: 28, color: '#F0EBE3', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
          {score.toLocaleString()}
        </div>
        {isNewHighScore && (
          <div style={{ fontSize: 7, color: '#F0EBE3', letterSpacing: 2, fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
            NEW HIGH SCORE
          </div>
        )}
        {playerRank !== null && (
          <div style={{ fontSize: 7, color: '#769826', letterSpacing: 1, fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
            GLOBAL RANK: #{playerRank}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {isStoryMode ? (
            <>
              <StoneButton variant="primary" onClick={onRetryLevel ?? onRestart}>
                RETRY
              </StoneButton>
              <StoneButton variant="secondary" onClick={onBackToLevels ?? onRestart}>
                LEVELS
              </StoneButton>
            </>
          ) : (
            <StoneButton variant="primary" onClick={onRestart}>
              PLAY AGAIN
            </StoneButton>
          )}
        </div>

        <div style={{ fontSize: 6, color: '#555', marginTop: 4 }}>
          PRESS ENTER
        </div>
      </div>
    </div>
  )
}
