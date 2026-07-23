import { describe, it, expect } from 'vitest'
import { ALL_PUZZLES, getPuzzlesForLevel, getPuzzle } from './codePuzzles'

describe('ALL_PUZZLES', () => {
  it('has 18 puzzles (2 per level for 9 levels)', () => {
    expect(Object.keys(ALL_PUZZLES)).toHaveLength(18)
  })

  it('every puzzle has required fields', () => {
    for (const [id, puzzle] of Object.entries(ALL_PUZZLES)) {
      expect(puzzle.id).toBe(id)
      expect(puzzle.levelId).toBeGreaterThanOrEqual(1)
      expect(puzzle.levelId).toBeLessThanOrEqual(9)
      expect(puzzle.title).toBeTruthy()
      expect(puzzle.description).toBeTruthy()
      expect(puzzle.template).toContain('function')
      expect(puzzle.test).toContain('return')
      expect(puzzle.hint).toBeTruthy()
      expect(puzzle.successMessage).toBeTruthy()
    }
  })

  it('each level has exactly 2 puzzles', () => {
    const counts = new Map<number, number>()
    for (const puzzle of Object.values(ALL_PUZZLES)) {
      counts.set(puzzle.levelId, (counts.get(puzzle.levelId) || 0) + 1)
    }
    for (let i = 1; i <= 9; i++) {
      expect(counts.get(i)).toBe(2)
    }
  })

  it('puzzle ids are unique', () => {
    const ids = Object.values(ALL_PUZZLES).map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getPuzzlesForLevel', () => {
  it('returns correct puzzles for level 1', () => {
    const puzzles = getPuzzlesForLevel(1)
    expect(puzzles).toHaveLength(2)
    expect(puzzles[0].levelId).toBe(1)
  })

  it('returns correct puzzles for level 9', () => {
    const puzzles = getPuzzlesForLevel(9)
    expect(puzzles).toHaveLength(2)
    expect(puzzles.every((p) => p.levelId === 9)).toBe(true)
  })

  it('returns empty array for non-existent level', () => {
    expect(getPuzzlesForLevel(99)).toHaveLength(0)
  })
})

describe('getPuzzle', () => {
  it('returns the correct puzzle by id', () => {
    const puzzle = getPuzzle('cell-distract')
    expect(puzzle).toBeDefined()
    expect(puzzle!.id).toBe('cell-distract')
    expect(puzzle!.title).toBe('Distract the Guard')
  })

  it('returns undefined for unknown id', () => {
    expect(getPuzzle('nonexistent')).toBeUndefined()
  })
})
