import { useMemo } from 'react'
import * as THREE from 'three'
import { spriteToTexture } from '../../utils/spriteToTexture'

interface Props {
  drawFn: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, t: number) => void
  spriteId: string
  position: [number, number, number]
  scale?: number
  flipped?: boolean
}

export default function SpriteBillboard({ drawFn, spriteId, position, scale = 3, flipped }: Props) {
  const texture = useMemo(() => spriteToTexture(drawFn, spriteId, scale), [drawFn, spriteId, scale])
  const aspect = texture?.image?.height ? texture.image.width / texture.image.height : 1
  const h = 1.2
  const w = h * aspect

  return (
    <mesh position={position} scale={flipped ? [-1, 1, 1] : [1, 1, 1]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} depthTest />
    </mesh>
  )
}
