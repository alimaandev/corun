export interface ParallaxLayer {
  factor: number
  y: number
  seed: number
  palette: string[]
}

export const CYBERPUNK_TOKYO = {
  skyTop: '#05030f',
  skyBottom: '#1a0b2e',
  horizon: '#ff2d78',
  back: {
    factor: 0.1,
    y: 140,
    seed: 7,
    palette: ['#120a24', '#160d2e', '#0e0820', '#1a1034'],
  },
  mid: {
    factor: 0.35,
    y: 150,
    seed: 13,
    palette: ['#1c1030', '#241640', '#150d28', '#2a1a4a'],
  },
  fg: {
    factor: 0.7,
    y: 160,
    seed: 29,
    palette: ['#0c0818', '#120d22', '#0a0715'],
  },
} as const

export function layerOffset(cameraX: number, factor: number): number {
  return -cameraX * factor
}

export function hash2(i: number, seed: number): number {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453
  return x - Math.floor(x)
}

export interface SkylineRect {
  x: number
  y: number
  w: number
  h: number
  c: string
  windows: boolean
}

export function generateSkyline(
  layer: ParallaxLayer,
  cameraX: number,
  viewW: number,
  tileW: number,
): SkylineRect[] {
  const offset = layerOffset(cameraX, layer.factor)
  const firstCol = Math.floor(offset / tileW) - 1
  const cols = Math.ceil(viewW / tileW) + 3
  const out: SkylineRect[] = []
  for (let i = 0; i < cols; i++) {
    const col = firstCol + i
    const h = Math.floor(hash2(col, layer.seed) * 70) + 40
    const c = layer.palette[Math.floor(hash2(col + 1, layer.seed) * layer.palette.length)]
    const cx = col * tileW - offset
    out.push({
      x: cx,
      y: layer.y - h,
      w: tileW - 2,
      h,
      c,
      windows: hash2(col + 2, layer.seed) > 0.45,
    })
  }
  return out
}

export function windowPositions(
  rect: SkylineRect,
  rng: (i: number) => number,
): { x: number; y: number }[] {
  if (!rect.windows) return []
  const out: { x: number; y: number }[] = []
  for (let wx = rect.x + 4; wx < rect.x + rect.w - 3; wx += 6) {
    for (let wy = rect.y + 5; wy < rect.y + rect.h - 4; wy += 7) {
      if (rng(wx * 13 + wy * 7) > 0.62) out.push({ x: wx, y: wy })
    }
  }
  return out
}
