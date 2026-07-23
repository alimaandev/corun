import { useState, useRef, useEffect } from 'react'
import { CodePuzzle } from '../game/types'
import { evaluateCode } from '../game/codePuzzles'
import { playSuccess, playError } from '../game/sound'

interface Props {
  puzzle: CodePuzzle
  onSolve: () => void
  onClose: () => void
}

export default function CodeTerminal({ puzzle, onSolve, onClose }: Props) {
  const [code, setCode] = useState(puzzle.template)
  const [result, setResult] = useState<{ success: boolean; output: string } | null>(null)
  const [running, setRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setCode(puzzle.template)
    setResult(null)
    setShowHint(false)
    setRunning(false)
  }, [puzzle.id, puzzle.template])

  useEffect(() => {
    textareaRef.current?.focus()
    const selStart = puzzle.template.indexOf('// YOUR CODE HERE')
    if (selStart >= 0 && textareaRef.current) {
      textareaRef.current.setSelectionRange(selStart, selStart + '// YOUR CODE HERE'.length)
    }
  }, [puzzle.template])

  async function handleSubmit() {
    if (running) return
    setRunning(true)
    setResult(null)
    const res = await evaluateCode(code, puzzle.test)
    setResult(res)
    setRunning(false)
    if (res.success) {
      try { playSuccess() } catch {}
      setTimeout(() => onSolve(), 1200)
    } else {
      try { playError() } catch {}
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      if (e.target instanceof HTMLTextAreaElement) return
      onClose()
    }
  }

  return (
    <div style={styles.overlay} onKeyDown={handleKeyDown}>
      <div style={styles.terminal}>
        <div style={styles.header}>
          <span style={styles.title}>{puzzle.title}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={styles.description}>{puzzle.description}</div>
        <textarea
          ref={textareaRef}
          style={styles.editor}
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          rows={8}
        />
        <div style={styles.actions}>
          <button
            style={styles.hintBtn}
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? 'HIDE HINT' : 'HINT'}
          </button>
          <button style={{
            ...styles.submitBtn,
            opacity: running ? 0.5 : 1,
            cursor: running ? 'not-allowed' : 'pointer',
          }} onClick={handleSubmit}>
            {running ? '⟳ RUNNING' : '▶ RUN'}
          </button>
        </div>
        {showHint && (
          <div style={styles.hintBox}>
            💡 {puzzle.hint}
          </div>
        )}
        {result && (
          <div style={{
            ...styles.resultBox,
            borderColor: result.success ? '#769826' : 'rgba(240,235,227,0.2)',
            color: result.success ? '#769826' : 'rgba(240,235,227,0.6)',
          }}>
            {result.success
              ? `✓ ${puzzle.successMessage}`
              : (result as any).error
                ? `✗ ${result.output}`
                : `✗ Test failed:\n${result.output || '(no output)'}`}
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 500,
  },
  terminal: {
    width: '90%', maxWidth: 640,
    background: '#0a0a0a',
    border: '1px solid rgba(240,235,227,0.12)',
    borderRadius: 12,
    padding: 24,
    position: 'relative',
    boxShadow: '0 0 40px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#F0EBE3',
    fontSize: 14,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
  },
  closeBtn: {
    background: 'none', border: '1px solid rgba(240,235,227,0.2)', color: 'rgba(240,235,227,0.5)',
    cursor: 'pointer', fontFamily: "'Roboto', sans-serif",
    fontSize: 10, padding: '4px 10px', borderRadius: 6,
  },
  description: {
    color: 'rgba(240,235,227,0.7)',
    fontSize: 9,
    lineHeight: 1.6,
    marginBottom: 12,
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 300,
  },
  editor: {
    width: '100%',
    background: '#0d0d0d',
    border: '1px solid rgba(240,235,227,0.1)',
    color: '#F0EBE3',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    padding: 12,
    resize: 'vertical',
    lineHeight: 1.5,
    borderRadius: 8,
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex', justifyContent: 'space-between', marginTop: 10,
    gap: 8,
  },
  hintBtn: {
    background: 'rgba(240,235,227,0.05)', border: '1px solid rgba(240,235,227,0.15)', color: 'rgba(240,235,227,0.6)',
    cursor: 'pointer', fontFamily: "'Roboto', sans-serif", fontSize: 9, fontWeight: 500,
    padding: '8px 16px', borderRadius: 8, letterSpacing: 1,
  },
  submitBtn: {
    background: '#F0EBE3', border: 'none', color: '#0a0a0a',
    cursor: 'pointer', fontFamily: "'Roboto', sans-serif", fontSize: 10, fontWeight: 500,
    padding: '8px 20px', borderRadius: 8, letterSpacing: 2,
  },
  hintBox: {
    marginTop: 8, padding: 8,
    background: 'rgba(118,152,38,0.08)', border: '1px solid rgba(118,152,38,0.2)',
    color: '#769826', fontSize: 9, lineHeight: 1.5, borderRadius: 6,
    fontFamily: "'Roboto', sans-serif",
  },
  resultBox: {
    marginTop: 8, padding: 10,
    background: '#0d0d0d', border: '1px solid',
    borderRadius: 6,
    fontSize: 9, lineHeight: 1.5,
    fontFamily: "'JetBrains Mono', monospace",
  },
}
