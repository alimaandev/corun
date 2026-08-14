import { describe, it, expect } from 'vitest'
import { addTrauma, createShake, shakeMagnitude, shakeOffset, updateShake } from './shake'

describe('shake', () => {
  it('starts at zero trauma', () => {
    const s = createShake()
    expect(s.trauma).toBe(0)
    expect(shakeMagnitude(s)).toBe(0)
  })

  it('adds trauma up to a cap', () => {
    let s = createShake()
    s = addTrauma(s, 0.7)
    s = addTrauma(s, 0.7)
    expect(s.trauma).toBeLessThanOrEqual(1)
    expect(s.trauma).toBeGreaterThan(0.9)
  })

  it('decays over time', () => {
    let s = createShake()
    s = addTrauma(s, 1)
    s = updateShake(s, 0.5)
    expect(s.trauma).toBeLessThan(1)
  })

  it('has zero offset when calm', () => {
    const s = createShake()
    expect(shakeOffset(s, 10)).toEqual({ x: 0, y: 0 })
  })

  it('produces non-zero offset when shaking', () => {
    let s = createShake()
    s = addTrauma(s, 1)
    s = updateShake(s, 0.1)
    const o = shakeOffset(s, 10)
    expect(Math.abs(o.x)).toBeGreaterThan(0)
    expect(Math.abs(o.y)).toBeGreaterThan(0)
  })
})
