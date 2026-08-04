import { describe, it, expect } from 'vitest'
import { clampScore, getComboMultiplier, getLevelStars } from './scoring'

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

describe('getLevelStars', () => {
  it('awards 3 stars at combined >= 0.8', () => {
    expect(getLevelStars(1, 1)).toBe(3)
    expect(getLevelStars(0.8, 0.8)).toBe(3)
  })

  it('awards 2 stars at combined >= 0.5', () => {
    expect(getLevelStars(0.5, 0.5)).toBe(2)
    expect(getLevelStars(0.7, 0.3)).toBe(2)
  })

  it('awards 1 star otherwise', () => {
    expect(getLevelStars(0.1, 0.1)).toBe(1)
    expect(getLevelStars(0.49, 0.49)).toBe(1)
  })

  it('clamps inputs above 1', () => {
    expect(getLevelStars(2, 2)).toBe(3)
  })
})

describe('clampScore', () => {
  it('floors and clamps negatives', () => {
    expect(clampScore(12.9)).toBe(12)
    expect(clampScore(-5)).toBe(0)
    expect(clampScore(NaN)).toBe(0)
    expect(clampScore(Infinity)).toBe(0)
  })
})
