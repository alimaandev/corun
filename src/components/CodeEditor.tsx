import { useCallback, useEffect, useRef } from 'react'
import {
  Caret,
  indentSelection,
  insertNewlineWithIndent,
  lineCount,
  unindentSelection,
} from '../game/editor/editorOps'
import { colors, fonts, alpha } from '../lib/theme'

interface Props {
  value: string
  onChange: (value: string) => void
  onRun?: () => void
  accent?: string
  disabled?: boolean
  minHeight?: number
  autoFocus?: boolean
}

export default function CodeEditor({
  value,
  onChange,
  onRun,
  accent = colors.accentBright,
  disabled = false,
  minHeight = 160,
  autoFocus = false,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const lines = lineCount(value)

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus()
  }, [autoFocus])

  const apply = useCallback(
    (fn: (value: string, caret: Caret) => { value: string; caret: Caret }) => {
      const el = textareaRef.current
      if (!el) return
      const caret: Caret = { start: el.selectionStart, end: el.selectionEnd }
      const result = fn(value, caret)
      onChange(result.value)
      requestAnimationFrame(() => {
        el.focus()
        el.setSelectionRange(result.caret.start, result.caret.end)
      })
    },
    [value, onChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (disabled) return
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        onRun?.()
        return
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        if (e.shiftKey) apply(unindentSelection)
        else apply(indentSelection)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        apply(insertNewlineWithIndent)
        return
      }
    },
    [disabled, onRun, apply],
  )

  const handleScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.currentTarget.scrollTop
    }
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        background: 'rgba(0,0,0,0.45)',
        border: `1px solid ${alpha(0.12)}`,
        borderRadius: 6,
        overflow: 'hidden',
        fontFamily: fonts.mono,
        fontSize: 13,
        lineHeight: 1.55,
      }}
    >
      <div
        ref={gutterRef}
        style={{
          padding: '8px 8px 8px 10px',
          textAlign: 'right',
          color: alpha(0.25),
          userSelect: 'none',
          overflow: 'hidden',
          minWidth: 34,
          borderRight: `1px solid ${alpha(0.08)}`,
          flexShrink: 0,
        }}
      >
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        style={{
          flex: 1,
          minHeight,
          background: 'transparent',
          color: colors.fg,
          border: 'none',
          outline: 'none',
          padding: '8px 10px',
          fontFamily: fonts.mono,
          fontSize: 13,
          lineHeight: 1.55,
          resize: 'vertical',
          whiteSpace: 'pre',
          overflowX: 'auto',
          tabSize: 2,
          caretColor: accent,
        }}
      />
    </div>
  )
}
