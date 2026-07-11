import { useState, useRef, useEffect } from 'react'
import { CodePuzzle } from '../game/types'
import { evaluateCode } from '../game/codePuzzles'

interface Props {
  puzzle: CodePuzzle
  onSolve: () => void
  onClose: () => void
}

export default function CodeTerminal({ puzzle, onSolve, onClose }: Props) {
  const [code, setCode] = useState(puzzle.template)
  const [result, setResult] = useState<{ success: boolean; output: string } | null>(null)
  const [showHint, setShowHint] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
    const selStart = puzzle.template.indexOf('// YOUR CODE HERE')
    if (selStart >= 0 && textareaRef.current) {
      textareaRef.current.setSelectionRange(selStart, selStart + '// YOUR CODE HERE'.length)
    }
  }, [puzzle.template])

  function handleSubmit() {
    const res = evaluateCode(code, puzzle.test)
    setResult(res)
    if (res.success) {
      setTimeout(() => onSolve(), 1200)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
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
          <button style={styles.submitBtn} onClick={handleSubmit}>
            ▶ RUN
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
            borderColor: result.success ? '#4CAF50' : '#F44336',
            color: result.success ? '#8BC34A' : '#FF5252',
          }}>
            {result.success ? `✓ ${puzzle.successMessage}` : `✗ Error: ${result.output}`}
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
    border: '2px solid #4FC3F7',
    padding: 20,
    fontFamily: "'Press Start 2P', monospace",
    position: 'relative',
    boxShadow: '0 0 40px rgba(79,195,247,0.15)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#4FC3F7',
    fontSize: 14,
  },
  closeBtn: {
    background: 'none', border: '1px solid #555', color: '#888',
    cursor: 'pointer', fontFamily: "'Press Start 2P', monospace",
    fontSize: 10, padding: '4px 8px',
  },
  description: {
    color: '#aaa',
    fontSize: 9,
    lineHeight: 1.6,
    marginBottom: 12,
  },
  editor: {
    width: '100%',
    background: '#111',
    border: '1px solid #333',
    color: '#8BC34A',
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    padding: 12,
    resize: 'vertical',
    outline: 'none',
    lineHeight: 1.5,
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex', justifyContent: 'space-between', marginTop: 10,
    gap: 8,
  },
  hintBtn: {
    background: '#222', border: '1px solid #555', color: '#aaa',
    cursor: 'pointer', fontFamily: "'Press Start 2P', monospace",
    fontSize: 9, padding: '8px 16px',
  },
  submitBtn: {
    background: '#0a2a1a', border: '2px solid #4CAF50', color: '#8BC34A',
    cursor: 'pointer', fontFamily: "'Press Start 2P', monospace",
    fontSize: 10, padding: '8px 20px',
  },
  hintBox: {
    marginTop: 8, padding: 8,
    background: '#1a1a0a', border: '1px solid #FFD700',
    color: '#FFD700', fontSize: 9, lineHeight: 1.5,
  },
  resultBox: {
    marginTop: 8, padding: 10,
    background: '#111', border: '1px solid',
    fontSize: 9, lineHeight: 1.5,
  },
}
