export const INDENT = '  '

export interface Caret {
  start: number
  end: number
}

export function lineCount(value: string): number {
  return value.split('\n').length
}

export function insertText(
  value: string,
  caret: Caret,
  text: string,
): { value: string; caret: Caret } {
  const next = value.slice(0, caret.start) + text + value.slice(caret.end)
  const pos = caret.start + text.length
  return { value: next, caret: { start: pos, end: pos } }
}

export function lineStartAt(value: string, index: number): number {
  const before = value.lastIndexOf('\n', index - 1)
  return before + 1
}

export function lineEndAt(value: string, index: number): number {
  const nl = value.indexOf('\n', index)
  return nl === -1 ? value.length : nl
}

export function indentSelection(value: string, caret: Caret): { value: string; caret: Caret } {
  const start = lineStartAt(value, caret.start)
  const end = lineEndAt(value, caret.end > caret.start ? caret.end - 1 : caret.end)
  const block = value.slice(start, end)
  const lines = block.split('\n')
  const indented = lines.map((l) => INDENT + l).join('\n')
  return {
    value: value.slice(0, start) + indented + value.slice(end),
    caret: { start: start + INDENT.length, end: end + INDENT.length * lines.length },
  }
}

export function unindentSelection(value: string, caret: Caret): { value: string; caret: Caret } {
  const start = lineStartAt(value, caret.start)
  const end = lineEndAt(value, caret.end > caret.start ? caret.end - 1 : caret.end)
  const block = value.slice(start, end)
  const lines = block.split('\n')
  let removed = 0
  const out = lines.map((l) => {
    if (l.startsWith(INDENT)) {
      removed++
      return l.slice(INDENT.length)
    }
    if (l.startsWith('\t')) {
      removed++
      return l.slice(1)
    }
    return l
  })
  return {
    value: value.slice(0, start) + out.join('\n') + value.slice(end),
    caret: {
      start: Math.max(start, start - INDENT.length),
      end: Math.max(start, end - INDENT.length * removed),
    },
  }
}

export function insertNewlineWithIndent(
  value: string,
  caret: Caret,
): { value: string; caret: Caret } {
  const line = value.slice(lineStartAt(value, caret.start), lineEndAt(value, caret.start))
  const indent = /^[\s]*/.exec(line)?.[0] ?? ''
  return insertText(value, caret, '\n' + indent)
}
