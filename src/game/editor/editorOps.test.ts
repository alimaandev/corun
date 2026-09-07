import { describe, it, expect } from 'vitest'
import {
  indentSelection,
  insertNewlineWithIndent,
  insertText,
  lineCount,
  lineEndAt,
  lineStartAt,
  unindentSelection,
} from './editorOps'

describe('editorOps', () => {
  it('counts lines', () => {
    expect(lineCount('a\nb\nc')).toBe(3)
    expect(lineCount('')).toBe(1)
  })

  it('inserts text and moves caret', () => {
    const r = insertText('ab', { start: 1, end: 1 }, 'X')
    expect(r.value).toBe('aXb')
    expect(r.caret).toEqual({ start: 2, end: 2 })
  })

  it('replaces a selection', () => {
    const r = insertText('abcd', { start: 1, end: 3 }, 'Z')
    expect(r.value).toBe('aZd')
    expect(r.caret.start).toBe(2)
  })

  it('finds line boundaries', () => {
    const value = 'aa\nbb\ncc'
    expect(lineStartAt(value, 4)).toBe(3)
    expect(lineEndAt(value, 0)).toBe(2)
    expect(lineEndAt(value, 7)).toBe(8)
  })

  it('indents the selected lines', () => {
    const r = indentSelection('a\nb\nc', { start: 2, end: 5 })
    expect(r.value).toBe('a\n  b\n  c')
  })

  it('indents a single caret line', () => {
    const r = indentSelection('x\ny', { start: 3, end: 3 })
    expect(r.value).toBe('x\n  y')
  })

  it('unindents lines that have indentation', () => {
    const r = unindentSelection('  a\n  b', { start: 0, end: 6 })
    expect(r.value).toBe('a\nb')
  })

  it('leaves unindented lines alone', () => {
    const r = unindentSelection('a\nb', { start: 0, end: 2 })
    expect(r.value).toBe('a\nb')
  })

  it('inserts newline with current indentation', () => {
    const r = insertNewlineWithIndent('  foo', { start: 6, end: 6 })
    expect(r.value).toBe('  foo\n  ')
    expect(r.caret.start).toBe(9)
  })
})
