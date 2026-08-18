import { describe, it, expect } from 'vitest'
import { getComboMultiplier } from './scoring'

describe('getComboMultiplier', () => {
  it('matches the combo table', () => {
    expect(getComboMultiplier(0)).toBe(1)
    expect(getComboMultiplier(3)).toBe(1.5)
    expect(getComboMultiplier(5)).toBe(2)
    expect(getComboMultiplier(9)).toBe(4)
  })

  it('caps at 4x for 10+ streak', () => {
    expect(getComboMultiplier(10)).toBe(4)
    expect(getComboMultiplier(50)).toBe(4)
  })
})
