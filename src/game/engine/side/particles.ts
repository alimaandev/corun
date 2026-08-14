import { ParticleKind, SideParticle } from './types'

const MAX_PARTICLES = 400

export function createParticles(): SideParticle[] {
  return Array.from({ length: MAX_PARTICLES }, () => ({
    kind: 'dust' as ParticleKind,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 1,
    size: 2,
    color: '#ffffff',
    active: false,
  }))
}

export function spawnParticle(
  pool: SideParticle[],
  kind: ParticleKind,
  x: number,
  y: number,
  vx: number,
  vy: number,
  life: number,
  size: number,
  color: string,
): void {
  const p = pool.find((e) => !e.active)
  if (!p) return
  p.kind = kind
  p.x = x
  p.y = y
  p.vx = vx
  p.vy = vy
  p.life = life
  p.maxLife = life
  p.size = size
  p.color = color
  p.active = true
}

export function burst(
  pool: SideParticle[],
  kind: ParticleKind,
  x: number,
  y: number,
  count: number,
  speed: number,
  up: number,
  size: number,
  colors: string[],
  rng: () => number,
): void {
  for (let i = 0; i < count; i++) {
    const a = rng() * Math.PI * 2
    const v = speed * (0.4 + rng() * 0.6)
    spawnParticle(
      pool,
      kind,
      x,
      y,
      Math.cos(a) * v,
      Math.sin(a) * v - up,
      0.3 + rng() * 0.5,
      size * (0.7 + rng() * 0.6),
      colors[Math.floor(rng() * colors.length)],
    )
  }
}

export function stepParticles(pool: SideParticle[], dt: number, gravity: number): void {
  for (const p of pool) {
    if (!p.active) continue
    p.life -= dt
    if (p.life <= 0) {
      p.active = false
      continue
    }
    if (p.kind !== 'spark' && p.kind !== 'fire') {
      p.vy += gravity * dt * 0.6
    }
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.vx *= 1 - 1.5 * dt
    if (p.kind === 'fire') p.vy -= 60 * dt
  }
}
