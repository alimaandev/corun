import { useRef, useState } from 'react'
import { CodePuzzle } from '../game/types'
import { generatePuzzleId, saveCustomPuzzle, shareUrl } from '../game/puzzleShare'
import { useFocusTrap } from '../lib/useFocusTrap'

interface Props {
  onClose: () => void
  onSave: (puzzle: CodePuzzle) => void
}

export default function PuzzleEditor({ onClose, onSave }: Props) {
  const trapRef = useFocusTrap(true)
  const puzzleIdRef = useRef(generatePuzzleId())
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [template, setTemplate] = useState('function solve() {\n  // YOUR CODE HERE\n}')
  const [test, setTest] = useState('return solve() === true')
  const [hint, setHint] = useState('')
  const [successMessage, setSuccessMessage] = useState('Puzzle solved!')
  const [levelId, setLevelId] = useState(1)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!title.trim() || !template.trim() || !test.trim()) return
    const puzzle: CodePuzzle = {
      id: puzzleIdRef.current,
      title: title.trim(),
      description: description.trim(),
      template: template.trim(),
      test: test.trim(),
      hint: hint.trim(),
      successMessage: successMessage.trim(),
      levelId,
    }
    saveCustomPuzzle(puzzle)
    onSave(puzzle)
    setSaved(true)
  }

  function handleShare() {
    if (!title.trim() || !template.trim() || !test.trim()) return
    const puzzle: CodePuzzle = {
      id: puzzleIdRef.current,
      title: title.trim(),
      description: description.trim(),
      template: template.trim(),
      test: test.trim(),
      hint: hint.trim(),
      successMessage: successMessage.trim(),
      levelId,
    }
    const url = shareUrl(puzzle)
    navigator.clipboard.writeText(url)
    setSaved(true)
  }

  const s: Record<string, React.CSSProperties> = {
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 500,
    },
    panel: {
      width: '90%',
      maxWidth: 600,
      maxHeight: '90vh',
      overflow: 'auto',
      background: '#0a0a0a',
      border: '1px solid rgba(240,235,227,0.12)',
      borderRadius: 12,
      padding: 24,
    },
    h1: {
      color: '#F0EBE3',
      fontSize: 16,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
      marginBottom: 20,
    },
    label: {
      color: 'rgba(240,235,227,0.6)',
      fontSize: 13,
      fontFamily: "'Roboto', sans-serif",
      display: 'block',
      marginBottom: 4,
      marginTop: 12,
    },
    input: {
      width: '100%',
      background: '#0d0d0d',
      border: '1px solid rgba(240,235,227,0.1)',
      color: '#F0EBE3',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 16,
      padding: '8px 10px',
      borderRadius: 6,
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      background: '#0d0d0d',
      border: '1px solid rgba(240,235,227,0.1)',
      color: '#F0EBE3',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 16,
      padding: 10,
      borderRadius: 6,
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    row: { display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 },
    btn: {
      background: '#F0EBE3',
      border: 'none',
      color: '#0a0a0a',
      cursor: 'pointer',
      fontFamily: "'Roboto', sans-serif",
      fontSize: 13,
      fontWeight: 500,
      padding: '8px 20px',
      borderRadius: 8,
      letterSpacing: 2,
    },
    btnSecondary: {
      background: 'rgba(240,235,227,0.05)',
      border: '1px solid rgba(240,235,227,0.15)',
      color: 'rgba(240,235,227,0.6)',
      cursor: 'pointer',
      fontFamily: "'Roboto', sans-serif",
      fontSize: 13,
      fontWeight: 500,
      padding: '8px 16px',
      borderRadius: 8,
      letterSpacing: 1,
    },
    saved: {
      color: '#769826',
      fontSize: 13,
      fontFamily: "'Roboto', sans-serif",
      marginTop: 12,
      textAlign: 'center',
    },
  }

  if (saved) {
    return (
      <div
        ref={trapRef}
        style={s.overlay}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Puzzle Editor"
      >
        <div style={s.panel} onClick={(e) => e.stopPropagation()}>
          <div style={s.h1}>Puzzle Saved!</div>
          <div
            style={{
              color: 'rgba(240,235,227,0.7)',
              fontSize: 13,
              fontFamily: "'Roboto', sans-serif",
              lineHeight: 1.6,
            }}
          >
            Your puzzle has been saved locally. Share it by clicking "Share" when editing.
          </div>
          <div style={s.row}>
            <button style={s.btn} onClick={onClose}>
              CLOSE
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={trapRef}
      style={s.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Puzzle Editor"
    >
      <div style={s.panel} onClick={(e) => e.stopPropagation()}>
        <div style={s.h1}>Puzzle Editor</div>

        <label style={s.label}>Title</label>
        <input
          style={s.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Puzzle"
        />

        <label style={s.label}>Description</label>
        <textarea
          style={{ ...s.textarea, height: 50 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the puzzle..."
        />

        <label style={s.label}>Code Template (player fills in the blank)</label>
        <textarea
          style={{ ...s.textarea, height: 100 }}
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        />

        <label style={s.label}>Test (must contain `return` statement)</label>
        <textarea
          style={{ ...s.textarea, height: 60 }}
          value={test}
          onChange={(e) => setTest(e.target.value)}
          placeholder='return solve() === "expected"'
        />

        <label style={s.label}>Hint</label>
        <input
          style={s.input}
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Try: return ..."
        />

        <label style={s.label}>Success Message</label>
        <input
          style={s.input}
          value={successMessage}
          onChange={(e) => setSuccessMessage(e.target.value)}
        />

        <label style={s.label}>Level (1-12)</label>
        <input
          style={s.input}
          type="number"
          min={1}
          max={12}
          value={levelId}
          onChange={(e) => setLevelId(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
        />

        <div style={s.row}>
          <button style={s.btn} onClick={handleSave}>
            SAVE
          </button>
          <button style={s.btnSecondary} onClick={handleShare}>
            SAVE & SHARE
          </button>
          <button style={s.btnSecondary} onClick={onClose}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  )
}
