import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import IsometricMap from './three/IsometricMap'
import Chamber from './three/Chamber'
import StoneButton from './StoneButton'
import { ALL_LEVELS } from '../game/levels'
import { LevelProgress } from '../game/types'

interface Props {
  progress: LevelProgress
  onSelectLevel: (id: number) => void
  onBack: () => void
}

export default function LevelSelect({ progress, onSelectLevel, onBack }: Props) {
  const [canvasKey, setCanvasKey] = useState(0)
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0a0a0a',
      color: '#F0EBE3',
      fontFamily: "'Roboto', sans-serif",
      zIndex: 100,
    }}>
      <Canvas
        key={canvasKey}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 3.5, 5], fov: 50, near: 0.1, far: 30 }}
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
        <IsometricMap progress={progress} onSelectLevel={onSelectLevel} />
      </Canvas>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px',
      }}>
        <StoneButton size="sm" variant="secondary" onClick={onBack}>
          &larr; BACK
        </StoneButton>
        <span style={{ fontSize: 10, color: '#F0EBE3', letterSpacing: 3, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
          STORY MODE
        </span>
      </div>
    </div>
  )
}
