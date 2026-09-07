import { describe, it, expect } from 'vitest'
import { POOL, getRandomChallenge, getDailyChallenge } from './challenges'

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
    const used = new Set<number>(POOL.slice(0, 20).map((c) => c.id))
    const c = await getRandomChallenge(used)
    expect(used.has(c.id)).toBe(false)
  })

  it('clears used set and returns a challenge when all exhausted', async () => {
    const allIds = new Set(POOL.map((c) => c.id))
    const c = await getRandomChallenge(allIds)
    expect(c).toBeDefined()
  })
})

describe('challenge pool', () => {
  it('contains at least 50 challenges for each language topic', () => {
    for (const topic of ['javascript', 'python', 'typescript']) {
      expect(POOL.filter((c) => c.topic === topic).length).toBeGreaterThanOrEqual(50)
    }
  })

  it('has unique ids', () => {
    const ids = POOL.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has a reasonable difficulty spread per language', () => {
    for (const topic of ['javascript', 'python', 'typescript']) {
      const byDifficulty = POOL.filter((c) => c.topic === topic)
      expect(byDifficulty.filter((c) => c.difficulty === 'easy').length).toBeGreaterThanOrEqual(10)
      expect(byDifficulty.filter((c) => c.difficulty === 'medium').length).toBeGreaterThanOrEqual(
        10,
      )
      expect(byDifficulty.filter((c) => c.difficulty === 'hard').length).toBeGreaterThanOrEqual(10)
    }
  })

  it('has valid options and correct indexes everywhere', () => {
    for (const c of POOL) {
      expect(c.options.length).toBeGreaterThanOrEqual(2)
      expect(c.correct).toBeGreaterThanOrEqual(0)
      expect(c.correct).toBeLessThan(c.options.length)
      if (c.type !== 'multiple') expect(c.code).toBeTruthy()
    }
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
