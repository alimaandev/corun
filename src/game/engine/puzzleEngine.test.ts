import { describe, it, expect } from 'vitest'
import { toCodePuzzle, validateCodePuzzle } from './puzzleEngine'

const VALID_PUZZLE = {
  id: 'p1',
  levelId: 1,
  title: 'Hello',
  description: 'desc',
  template: 'function solve() {}',
  test: 'return true',
  hint: 'hint',
  successMessage: 'done',
}

describe('validateCodePuzzle', () => {
  it('accepts a well-formed puzzle', () => {
    const r = validateCodePuzzle(VALID_PUZZLE)
    expect(r.valid).toBe(true)
    expect(r.errors).toEqual([])
  })

  it('rejects non-objects', () => {
    expect(validateCodePuzzle(null).valid).toBe(false)
    expect(validateCodePuzzle('puzzle').valid).toBe(false)
  })

  it('rejects missing required fields', () => {
    const r = validateCodePuzzle({ levelId: 1 })
    expect(r.valid).toBe(false)
    expect(r.errors).toContain('title must be a non-empty string')
    expect(r.errors).toContain('test must be a non-empty string')
  })

  it('rejects bad levelId', () => {
    const r = validateCodePuzzle({ ...VALID_PUZZLE, levelId: -1 })
    expect(r.valid).toBe(false)
    expect(r.errors).toContain('levelId must be a non-negative integer')
  })

  it('rejects oversized fields', () => {
    const r = validateCodePuzzle({ ...VALID_PUZZLE, template: 'x'.repeat(5001) })
    expect(r.valid).toBe(false)
  })

  it('accepts missing optional fields', () => {
    const minimal: Record<string, unknown> = { ...VALID_PUZZLE }
    delete minimal.hint
    delete minimal.successMessage
    expect(validateCodePuzzle(minimal).valid).toBe(true)
  })
})

describe('toCodePuzzle', () => {
  it('returns null for invalid input', () => {
    expect(toCodePuzzle(null)).toBeNull()
    expect(toCodePuzzle({})).toBeNull()
  })

  it('coerces a valid object into a CodePuzzle', () => {
    const p = toCodePuzzle({ ...VALID_PUZZLE, title: '  Hello  ' })
    expect(p).not.toBeNull()
    expect(p!.title).toBe('Hello')
    expect(p!.hint).toBe('hint')
  })

  it('generates an id when missing', () => {
    const noId: Record<string, unknown> = { ...VALID_PUZZLE }
    delete noId.id
    const p = toCodePuzzle(noId)
    expect(p).not.toBeNull()
    expect(p!.id).toBeTruthy()
  })
})
