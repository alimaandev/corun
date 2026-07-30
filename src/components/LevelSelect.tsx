import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import IsometricMap from './three/IsometricMap'
import Chamber from './three/Chamber'
import GlassButton from './GlassButton'
import { ALL_LEVELS } from '../game/levels'
import { LevelProgress } from '../game/types'
import { colors, fonts, alpha } from '../lib/theme'

interface Props {
  progress: LevelProgress
  onSelectLevel: (id: number) => void
  onBack: () => void
}

export default function LevelSelect({ progress, onSelectLevel, onBack }: Props) {
  const [canvasKey, setCanvasKey] = useState(0)
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: colors.bg,
        color: colors.fg,
        fontFamily: fonts.body,
        zIndex: 100,
      }}
    >
      <Canvas
        key={canvasKey}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 3.5, 5], fov: 50, near: 0.1, far: 30 }}
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
            () => {
              state.invalidate()
            },
            false,
          )
        }}
        onError={() => setCanvasKey((k) => k + 1)}
      >
        <Chamber />
        <IsometricMap progress={progress} onSelectLevel={onSelectLevel} />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
        }}
      >
        <GlassButton size="sm" variant="secondary" onClick={onBack}>
          ← BACK
        </GlassButton>
        <span
          style={{
            fontSize: 10,
            color: colors.fg,
            letterSpacing: 3,
            fontFamily: fonts.heading,
            fontWeight: 600,
          }}
        >
          STORY MODE
        </span>
      </div>
    </div>
  )
}
