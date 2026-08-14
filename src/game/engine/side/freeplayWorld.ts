import { SideWorld } from './types'
import { WORLD } from './world'

export const FREEPLAY = {
  baseLength: 2400,
  lengthPerSegment: 260,
  maxSegments: 6,
  exitGap: 120,
} as const

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface FreeplayParams {
  difficulty: 'easy' | 'medium' | 'hard'
  segment: number
}

const DANGER = {
  easy: { gaps: 2, hazards: 4, coins: 6, platforms: 4, enemies: 2 },
  medium: { gaps: 4, hazards: 8, coins: 8, platforms: 6, enemies: 3 },
  hard: { gaps: 6, hazards: 12, coins: 10, platforms: 8, enemies: 4 },
} as const

export function generateFreeplayWorld({ difficulty, segment }: FreeplayParams): SideWorld {
  const rng = mulberry32(
    (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3) * 1000 + segment,
  )
  const length = FREEPLAY.baseLength + segment * FREEPLAY.lengthPerSegment
  const d = DANGER[difficulty]
  const groundY = WORLD.groundY
  const ground: { x: number; w: number }[] = [{ x: 0, w: length }]
  const platforms: { x: number; y: number; w: number; h: number }[] = []
  const hazardSpots: { x: number; w: number }[] = []
  const coinSpots: { x: number; y: number }[] = []
  const enemySpots: { x: number; speed: number }[] = []

  for (let i = 0; i < d.gaps; i++) {
    const w = 40 + rng() * 40 + segment * 6
    const gx = 240 + rng() * (length - 480 - w)
    const idx = ground.findIndex((g) => gx >= g.x && gx + w <= g.x + g.w)
    if (idx === -1) continue
    const g = ground[idx]
    ground.splice(idx, 1)
    if (gx - g.x > 60) ground.push({ x: g.x, w: gx - g.x })
    if (g.x + g.w - (gx + w) > 60) ground.push({ x: gx + w, w: g.x + g.w - gx - w })
    ground.sort((a, b) => a.x - b.x)
  }

  for (const g of ground) {
    platforms.push({ x: g.x, y: groundY, w: g.w, h: 64 })
  }

  for (let i = 0; i < d.platforms; i++) {
    const px = 250 + rng() * (length - 700)
    if (ground.some((g) => px >= g.x - 20 && px <= g.x + g.w + 20)) {
      platforms.push({
        x: px,
        y: groundY - 55 - rng() * 70,
        w: 70 + rng() * 70,
        h: 16,
      })
    }
  }

  for (let i = 0; i < d.hazards; i++) {
    const hx = 250 + rng() * (length - 500)
    if (!ground.some((g) => hx >= g.x + 30 && hx + 60 <= g.x + g.w - 30)) continue
    hazardSpots.push({ x: hx, w: 40 + rng() * 30 })
  }

  for (let i = 0; i < d.coins; i++) {
    coinSpots.push({ x: 200 + rng() * (length - 400), y: groundY - 30 - rng() * 80 })
  }

  for (let i = 0; i < d.enemies; i++) {
    const ex = 300 + rng() * (length - 600)
    if (!ground.some((g) => ex >= g.x + 60 && ex <= g.x + g.w - 60)) continue
    enemySpots.push({ x: ex, speed: 50 + rng() * 60 })
  }

  return {
    bounds: { minX: 0, maxX: length },
    groundY,
    spawn: { x: 48, y: groundY - 24 },
    platforms,
    hazards: hazardSpots.map((h) => ({ x: h.x, y: groundY - 12, w: h.w, h: 12 })),
    coins: coinSpots.map((c, i) => ({
      id: i + 1,
      aabb: { x: c.x, y: c.y, w: 12, h: 12 },
      taken: false,
    })),
    exit: { x: length - FREEPLAY.exitGap, y: groundY - 40, w: 48, h: 40 },
    enemies: enemySpots.map((e, i) => ({
      id: i + 1,
      x: e.x,
      y: groundY - 16,
      patrol: [Math.max(0, e.x - 90), Math.min(length, e.x + 90)],
      speed: e.speed,
    })),
  }
}
