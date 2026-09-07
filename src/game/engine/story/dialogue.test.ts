import { describe, it, expect } from 'vitest'
import {
  advanceDialogue,
  createDialogue,
  currentLine,
  dialogueProgress,
  lineRevealed,
  updateDialogue,
} from './dialogue'

describe('dialogue', () => {
  it('starts on the first line', () => {
    const d = createDialogue(['Hello', 'World'])
    expect(currentLine(d)).toBe('')
    expect(d.finished).toBe(false)
    expect(d.lineIndex).toBe(0)
  })

  it('is finished when no lines are provided', () => {
    const d = createDialogue([])
    expect(d.finished).toBe(true)
    expect(dialogueProgress(d)).toBe(1)
  })

  it('reveals characters over time', () => {
    let d = createDialogue(['Hello world'])
    d = updateDialogue(d, 0.5, 10)
    expect(d.charIndex).toBe(5)
    expect(currentLine(d)).toBe('Hello')
  })

  it('caps char index at line length', () => {
    let d = createDialogue(['Hi'])
    d = updateDialogue(d, 10, 10)
    expect(d.charIndex).toBe(2)
    expect(lineRevealed(d)).toBe(true)
  })

  it('advance completes the line first, then moves on', () => {
    let d = createDialogue(['Hello', 'World'])
    d = advanceDialogue(d)
    expect(d.lineIndex).toBe(0)
    expect(lineRevealed(d)).toBe(true)
    expect(currentLine(d)).toBe('Hello')
    d = advanceDialogue(d)
    expect(d.lineIndex).toBe(1)
    expect(d.charIndex).toBe(0)
    d = advanceDialogue(d)
    expect(d.lineIndex).toBe(1)
    expect(lineRevealed(d)).toBe(true)
    d = advanceDialogue(d)
    expect(d.finished).toBe(true)
    d = advanceDialogue(d)
    expect(d.finished).toBe(true)
  })

  it('tracks overall progress', () => {
    let d = createDialogue(['A line', 'Second line'])
    expect(dialogueProgress(d)).toBe(0)
    d = updateDialogue(d, 10, 10)
    expect(dialogueProgress(d)).toBeGreaterThan(0)
    expect(dialogueProgress(d)).toBeLessThan(1)
    while (!d.finished) d = advanceDialogue(d)
    expect(dialogueProgress(d)).toBe(1)
  })
})
