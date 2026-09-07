import { describe, expect, it } from 'vitest'
import { FREEPLAY, generateFreeplayWorld, mulberry32 } from './freeplayWorld'

describe('freeplayWorld', () => {
  it('is deterministic for the same difficulty and segment', () => {
    const a = generateFreeplayWorld({ difficulty: 'medium', segment: 2 })
    const b = generateFreeplayWorld({ difficulty: 'medium', segment: 2 })
    expect(a.platforms).toEqual(b.platforms)
    expect(a.hazards).toEqual(b.hazards)
    expect(a.coins).toEqual(b.coins)
  })

  it('grows longer per segment', () => {
    const a = generateFreeplayWorld({ difficulty: 'medium', segment: 0 })
    const b = generateFreeplayWorld({ difficulty: 'medium', segment: 3 })
    expect(b.bounds.maxX).toBeGreaterThan(a.bounds.maxX)
    expect(b.bounds.maxX).toBe(FREEPLAY.baseLength + 3 * FREEPLAY.lengthPerSegment)
  })

  it('hard has more hazards than easy', () => {
    const easy = generateFreeplayWorld({ difficulty: 'easy', segment: 0 })
    const hard = generateFreeplayWorld({ difficulty: 'hard', segment: 0 })
    expect(hard.hazards.length).toBeGreaterThan(easy.hazards.length)
    expect(hard.platforms.length).toBeGreaterThan(easy.platforms.length)
  })

  it('places the exit near the end and coins in bounds', () => {
    const w = generateFreeplayWorld({ difficulty: 'hard', segment: 5 })
    expect(w.exit.x + w.exit.w).toBeLessThanOrEqual(w.bounds.maxX)
    expect(w.exit.x).toBeGreaterThan(w.bounds.maxX - 400)
    for (const c of w.coins) {
      expect(c.aabb.x).toBeGreaterThanOrEqual(0)
      expect(c.aabb.x).toBeLessThan(w.bounds.maxX)
      expect(c.aabb.y).toBeGreaterThan(0)
    }
  })

  it('keeps hazards on solid ground (no pits under spikes)', () => {
    const w = generateFreeplayWorld({ difficulty: 'hard', segment: 4 })
    for (const h of w.hazards) {
      const supported = w.platforms.some(
        (p) => p.y >= w.groundY - 1 && h.x >= p.x - 8 && h.x + h.w <= p.x + p.w + 8,
      )
      expect(supported).toBe(true)
    }
  })

  it('mulberry32 is deterministic', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    const seqA = [a(), a(), a()]
    const seqB = [b(), b(), b()]
    expect(seqA).toEqual(seqB)
    expect(seqA.every((v) => v >= 0 && v < 1)).toBe(true)
  })
})
