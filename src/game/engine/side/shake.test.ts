import { describe, it, expect } from 'vitest'
import { addTrauma, shakeOffset, updateShake } from './shake'

describe('shake', () => {
  it('adds trauma up to a cap', () => {
    let s = { trauma: 0, time: 0 }
    s = addTrauma(s, 0.7)
    s = addTrauma(s, 0.7)
    expect(s.trauma).toBeLessThanOrEqual(1)
    expect(s.trauma).toBeGreaterThan(0.9)
  })

  it('decays over time', () => {
    let s = { trauma: 0, time: 0 }
    s = addTrauma(s, 1)
    s = updateShake(s, 0.5)
    expect(s.trauma).toBeLessThan(1)
  })

  it('has zero offset when calm', () => {
    expect(shakeOffset({ trauma: 0, time: 0 }, 10)).toEqual({ x: 0, y: 0 })
  })

  it('produces non-zero offset when shaking', () => {
    let s = { trauma: 0, time: 0 }
    s = addTrauma(s, 1)
    s = updateShake(s, 0.1)
    const o = shakeOffset(s, 10)
    expect(Math.abs(o.x)).toBeGreaterThan(0)
    expect(Math.abs(o.y)).toBeGreaterThan(0)
  })
})
