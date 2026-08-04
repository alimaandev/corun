import { describe, it, expect } from 'vitest'
import { ALL_PUZZLES, getPuzzlesForLevel, getPuzzle } from './codePuzzles'

describe('ALL_PUZZLES', () => {
  it('has 52 quality puzzles', () => {
    expect(Object.keys(ALL_PUZZLES)).toHaveLength(52)
  })

  it('every puzzle has required fields', () => {
    for (const [id, puzzle] of Object.entries(ALL_PUZZLES)) {
      expect(puzzle.id).toBe(id)
      expect(puzzle.title).toBeTruthy()
      expect(puzzle.description).toBeTruthy()
      expect(puzzle.template).toContain('function')
      expect(puzzle.test).toContain('return')
      expect(puzzle.hint).toBeTruthy()
      expect(puzzle.successMessage).toBeTruthy()
    }
  })

  it('each level has at least 2 puzzles, with levels 1-9 having bonus puzzles and levels 10-12 added', () => {
    const counts = new Map<number, number>()
    for (const puzzle of Object.values(ALL_PUZZLES)) {
      counts.set(puzzle.levelId, (counts.get(puzzle.levelId) || 0) + 1)
    }
    for (let i = 1; i <= 12; i++) {
      expect(counts.get(i)).toBeGreaterThanOrEqual(2)
    }
  })

  it('covers 12 levels', () => {
    const levels = new Set(Object.values(ALL_PUZZLES).map((p) => p.levelId))
    expect(levels.size).toBe(12)
  })

  it('puzzle ids are unique', () => {
    const ids = Object.values(ALL_PUZZLES).map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getPuzzlesForLevel', () => {
  it('returns correct puzzles for level 1', () => {
    const puzzles = getPuzzlesForLevel(1)
    expect(puzzles.length).toBeGreaterThanOrEqual(4)
    expect(puzzles[0].levelId).toBe(1)
  })

  it('returns correct puzzles for level 9', () => {
    const puzzles = getPuzzlesForLevel(9)
    expect(puzzles.length).toBeGreaterThanOrEqual(4)
    expect(puzzles.every((p) => p.levelId === 9)).toBe(true)
  })

  it('returns correct puzzles for level 12', () => {
    const puzzles = getPuzzlesForLevel(12)
    expect(puzzles.length).toBeGreaterThanOrEqual(4)
    expect(puzzles.every((p) => p.levelId === 12)).toBe(true)
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
