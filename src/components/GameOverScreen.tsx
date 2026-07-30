import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Chamber from './three/Chamber'
import GlassButton from './GlassButton'
import { colors, fonts, alpha } from '../lib/theme'

interface Props {
  score: number
  highScore: number
  playerRank: number | null
  playerName?: string
  badges?: { topic: string; label: string; count: number }[]
  levelMode?: boolean
  levelName?: string
  onRestart?: () => void
  onRetryLevel?: () => void
  onBackToLevels?: () => void
}

function Slab({
  score,
  highScore,
  isNewHighScore,
}: {
  score: number
  highScore: number
  isNewHighScore: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (meshRef.current)
      meshRef.current.position.y = Math.min(0.3, meshRef.current.position.y + 0.02)
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
      meshRef.current.position.y =
        position[1] + Math.sin(clock.elapsedTime * 0.8 + position[0]) * 0.15
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
  score,
  highScore,
  playerRank,
  badges = [],
  levelMode,
  levelName,
  onRestart,
  onRetryLevel,
  onBackToLevels,
}: Props) {
  const [canvasKey, setCanvasKey] = useState(0)
  const isStoryMode = !!levelMode
  const isNewHighScore = score > 0 && score >= highScore

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: colors.bg,
        color: colors.fg,
        fontFamily: fonts.body,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Canvas
        key={canvasKey}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 2, 4.5], fov: 50, near: 0.1, far: 30 }}
        style={{ position: 'fixed', inset: 0, display: 'block' }}
        frameloop="demand"
        onCreated={(state) => {
          state.gl.domElement.addEventListener(
            'webglcontextlost',
            (e) => {
              e.preventDefault()
              setTimeout(() => setCanvasKey((k) => k + 1), 500)
            },
            false,
          )
          state.gl.domElement.addEventListener(
            'webglcontextrestored',
            () => state.invalidate(),
            false,
          )
        }}
        onError={() => setCanvasKey((k) => k + 1)}
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
            color={[colors.fg, colors.accent, colors.fg][i]}
          />
        ))}
      </Canvas>

      <div
        style={{
          position: 'absolute',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: alpha(0.4),
            letterSpacing: 4,
            fontFamily: fonts.heading,
            fontWeight: 600,
          }}
        >
          GAME OVER
        </div>
        {levelName ? (
          <div
            style={{
              fontSize: 12,
              color: alpha(0.5),
              fontFamily: fonts.body,
              fontWeight: 300,
            }}
          >
            {levelName} — CAUGHT
          </div>
        ) : (
          <div
            style={{
              fontSize: 12,
              color: alpha(0.5),
              fontFamily: fonts.body,
              fontWeight: 300,
            }}
          >
            THE MONSTER CAUGHT YOU
          </div>
        )}
        <div
          style={{
            fontSize: 36,
            color: colors.fg,
            fontFamily: fonts.mono,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {score.toLocaleString()}
        </div>

        {isNewHighScore && (
          <div
            style={{
              fontSize: 11,
              color: colors.fg,
              letterSpacing: 2,
              fontFamily: fonts.body,
              fontWeight: 500,
            }}
          >
            NEW HIGH SCORE
          </div>
        )}
        {playerRank !== null && (
          <div
            style={{
              fontSize: 11,
              color: colors.accent,
              letterSpacing: 1,
              fontFamily: fonts.body,
              fontWeight: 500,
            }}
          >
            RANK: #{playerRank}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 4,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {isStoryMode ? (
            <>
              <GlassButton variant="primary" onClick={onRetryLevel ?? onRestart}>
                RETRY
              </GlassButton>
              <GlassButton variant="secondary" onClick={onBackToLevels ?? onRestart}>
                LEVELS
              </GlassButton>
            </>
          ) : (
            <GlassButton variant="primary" onClick={onRestart}>
              PLAY AGAIN
            </GlassButton>
          )}
        </div>

        <div style={{ fontSize: 11, color: '#555' }}>PRESS ENTER</div>

        <a
          href="https://github.com/alimaandev/corun"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            color: alpha(0.2),
            textDecoration: 'none',
            fontFamily: fonts.body,
            fontSize: 10,
            letterSpacing: 1,
          }}
        >
          ★ STAR ON GITHUB
        </a>
      </div>
    </div>
  )
}
