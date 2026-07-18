import * as THREE from 'three'

const textureCache = new Map<string, THREE.CanvasTexture>()

export function spriteToTexture(
  drawFn: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) => void,
  id: string,
  scale: number = 3,
  width: number = 64,
  height: number = 80,
): THREE.CanvasTexture {
  const key = `${id}@${scale}`
  const cached = textureCache.get(key)
  if (cached) return cached

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false

  ctx.clearRect(0, 0, width, height)
  drawFn(ctx, width / 2, height - 8, scale, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  texture.needsUpdate = true

  textureCache.set(key, texture)
  return texture
}
