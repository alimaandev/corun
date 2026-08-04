import { describe, it, expect, beforeEach } from 'vitest'
import {
  getChallengeById,
  getRandomChallenge,
  getDailyChallenge,
  isDailyCompleted,
  markDailyCompleted,
  clearAIPool,
} from './challenges'

beforeEach(() => {
  localStorage.clear()
  clearAIPool()
})

describe('getChallengeById', () => {
  it('returns the correct fallback challenge by id', () => {
    const c = getChallengeById(-1)
    expect(c).toBeDefined()
    expect(c!.id).toBe(-1)
  })

  it('returns undefined for unknown id', () => {
    expect(getChallengeById(9999)).toBeUndefined()
  })
})

describe('getRandomChallenge', () => {
  it('returns a challenge', async () => {
    const c = await getRandomChallenge(new Set())
    expect(c).toBeDefined()
    expect(c.question).toBeTruthy()
    expect(c.options.length).toBeGreaterThanOrEqual(2)
    expect(c.correct).toBeGreaterThanOrEqual(0)
  })

  it('filters by topic when specified', async () => {
    const c = await getRandomChallenge(new Set(), 'javascript')
    expect(c.topic).toBe('javascript')
  })

  it('filters by difficulty when specified', async () => {
    const c = await getRandomChallenge(new Set(), undefined, 'hard')
    expect(c.difficulty).toBe('hard')
  })

  it('does not return used ids', async () => {
    const used = new Set<number>([
      -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17,
    ])
    const c = await getRandomChallenge(used)
    expect(used.has(c.id)).toBe(false)
  })

  it('clears used set and returns a challenge when all exhausted', async () => {
    const allIds = new Set([
      -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17,
    ])
    const c = await getRandomChallenge(allIds)
    expect(c).toBeDefined()
  })
})

describe('getDailyChallenge', () => {
  it('returns a valid challenge', () => {
    const c = getDailyChallenge()
    expect(c).toBeDefined()
    expect(c.question).toBeTruthy()
    expect(c.correct).toBeGreaterThanOrEqual(0)
    expect(c.correct).toBeLessThan(c.options.length)
  })

  it('returns deterministic challenge for the same day', () => {
    const a = getDailyChallenge()
    const b = getDailyChallenge()
    expect(a.question).toBe(b.question)
  })
})

describe('daily completed', () => {
  it('returns false when not completed', () => {
    expect(isDailyCompleted()).toBe(false)
  })

  it('returns true after marking completed', () => {
    markDailyCompleted()
    expect(isDailyCompleted()).toBe(true)
  })
})
