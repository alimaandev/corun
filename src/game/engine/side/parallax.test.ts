import { describe, it, expect } from 'vitest'
import { CYBERPUNK_TOKYO, generateSkyline, hash2, layerOffset, windowPositions } from './parallax'

describe('parallax', () => {
  it('offsets layers by camera factor', () => {
    expect(layerOffset(100, 0.1)).toBe(-10)
    expect(layerOffset(100, 0.35)).toBe(-35)
    expect(layerOffset(100, 1)).toBe(-100)
  })

  it('generates deterministic skylines', () => {
    const a = generateSkyline(CYBERPUNK_TOKYO.back, 0, 480, 64)
    const b = generateSkyline(CYBERPUNK_TOKYO.back, 0, 480, 64)
    expect(a.length).toBe(b.length)
    for (let i = 0; i < a.length; i++) {
      expect(a[i].x).toBe(b[i].x)
      expect(a[i].h).toBe(b[i].h)
    }
  })

  it('skylines shift with camera', () => {
    const a = generateSkyline(CYBERPUNK_TOKYO.back, 0, 480, 64)
    const b = generateSkyline(CYBERPUNK_TOKYO.back, 320, 480, 64)
    expect(b[0].x).not.toBe(a[0].x)
  })

  it('hash2 is deterministic and bounded', () => {
    expect(hash2(3, 7)).toBe(hash2(3, 7))
    const v = hash2(42, 13)
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThan(1)
  })

  it('windowPositions respects windows flag', () => {
    const rect = { x: 0, y: 0, w: 64, h: 64, c: '#fff', windows: false }
    expect(windowPositions(rect, () => 0.9)).toEqual([])
    const rect2 = { ...rect, windows: true }
    const pos = windowPositions(rect2, () => 0.9)
    expect(pos.length).toBeGreaterThan(0)
    const pos2 = windowPositions(rect2, () => 0.1)
    expect(pos2.length).toBe(0)
  })
})
