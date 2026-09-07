import { describe, it, expect } from 'vitest'
import { burst, createParticles, spawnParticle, stepParticles } from './particles'

describe('particles', () => {
  it('creates a fixed inactive pool', () => {
    const pool = createParticles()
    expect(pool.length).toBe(400)
    expect(pool.every((p) => !p.active)).toBe(true)
  })

  it('spawns and activates a particle', () => {
    const pool = createParticles()
    spawnParticle(pool, 'dust', 10, 20, 1, 2, 0.5, 2, '#fff')
    const p = pool.find((e) => e.active)
    expect(p).toBeDefined()
    if (!p) return
    expect(p.x).toBe(10)
    expect(p.y).toBe(20)
  })

  it('deactivates particles after life expires', () => {
    const pool = createParticles()
    spawnParticle(pool, 'spark', 0, 0, 0, 0, 0.1, 2, '#fff')
    stepParticles(pool, 0.2, 0)
    expect(pool.every((p) => !p.active)).toBe(true)
  })

  it('applies gravity to non-spark particles', () => {
    const pool = createParticles()
    spawnParticle(pool, 'dust', 0, 0, 0, 0, 1, 2, '#fff')
    stepParticles(pool, 0.1, 100)
    const p = pool.find((e) => e.active)
    if (!p) throw new Error('expected active particle')
    expect(p.vy).toBeGreaterThan(0)
  })

  it('burst spawns the requested count', () => {
    const pool = createParticles()
    burst(pool, 'glyph', 0, 0, 12, 100, 50, 3, ['#fff'], () => 0.5)
    expect(pool.filter((p) => p.active).length).toBe(12)
  })
})
