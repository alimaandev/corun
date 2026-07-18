import { useMemo } from 'react'
import * as THREE from 'three'
import { LevelTheme } from '../../game/themes'

interface Props {
  theme: LevelTheme
}

export default function SkyDome({ theme }: Props) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 0, 128)
    grad.addColorStop(0, theme.skyTop)
    grad.addColorStop(1, theme.skyBottom)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 2, 128)
    const tex = new THREE.CanvasTexture(canvas)
    tex.minFilter = THREE.NearestFilter
    tex.magFilter = THREE.NearestFilter
    return tex
  }, [theme.skyTop, theme.skyBottom])

  return (
    <mesh position={[0, 10, -20]}>
      <planeGeometry args={[60, 30]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  )
}
