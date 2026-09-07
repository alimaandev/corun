export interface DialogueState {
  lines: string[]
  lineIndex: number
  charIndex: number
  finished: boolean
}

export const DIALOGUE_CPS = 42

export function createDialogue(lines: string[]): DialogueState {
  return { lines, lineIndex: 0, charIndex: 0, finished: lines.length === 0 }
}

export function updateDialogue(
  s: DialogueState,
  dt: number,
  cps: number = DIALOGUE_CPS,
): DialogueState {
  if (s.finished) return s
  const line = s.lines[s.lineIndex]
  const next = Math.min(line.length, s.charIndex + dt * cps)
  return { ...s, charIndex: next }
}

export function advanceDialogue(s: DialogueState): DialogueState {
  if (s.finished) return s
  const line = s.lines[s.lineIndex]
  if (s.charIndex < line.length) {
    return { ...s, charIndex: line.length }
  }
  if (s.lineIndex + 1 >= s.lines.length) {
    return { ...s, finished: true }
  }
  return { ...s, lineIndex: s.lineIndex + 1, charIndex: 0 }
}

export function currentLine(s: DialogueState): string {
  if (s.finished) return ''
  return s.lines[s.lineIndex].slice(0, s.charIndex)
}

export function lineRevealed(s: DialogueState): boolean {
  if (s.finished) return true
  return s.charIndex >= s.lines[s.lineIndex].length
}

export function dialogueProgress(s: DialogueState): number {
  if (s.lines.length === 0) return 1
  return (s.lineIndex + s.charIndex / Math.max(1, s.lines[s.lineIndex].length)) / s.lines.length
}
