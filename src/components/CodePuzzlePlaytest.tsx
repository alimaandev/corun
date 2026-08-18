import { useState, useEffect } from 'react'
import { CodePuzzle } from '../game/types'
import { evaluateCode } from '../game/engine/codeEvaluator'

interface Props {
  puzzle: CodePuzzle
  onClose: () => void
  onSolved?: () => void
}

type TestStatus = 'idle' | 'running' | 'pass' | 'fail'

export default function CodePuzzlePlaytest({ puzzle, onClose, onSolved }: Props) {
  const [code, setCode] = useState(puzzle.template)
  const [status, setStatus] = useState<TestStatus>('idle')
  const [output, setOutput] = useState('')

  useEffect(() => {
    setCode(puzzle.template)
    setStatus('idle')
    setOutput('')
  }, [puzzle])

  async function handleRun() {
    setStatus('running')
    setOutput('')
    const result = await evaluateCode(code, puzzle.test)
    if (result.success) {
      setStatus('pass')
      setOutput(result.output || puzzle.successMessage)
      onSolved?.()
    } else {
      setStatus('fail')
      setOutput(result.output || 'Test failed')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleRun()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Test puzzle"
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Roboto', sans-serif",
        color: '#F0EBE3',
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: 600,
          maxHeight: '90vh',
          background: '#0a0a0a',
          border: '1px solid rgba(240,235,227,0.1)',
          borderRadius: 8,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          overflow: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div
              style={{
                fontSize: 14,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                color: '#F0EBE3',
              }}
            >
              {puzzle.title || 'Untitled Puzzle'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(240,235,227,0.5)', marginTop: 4 }}>
              Level {puzzle.levelId}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(240,235,227,0.4)',
              fontSize: 16,
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ fontSize: 11, color: 'rgba(240,235,227,0.6)', lineHeight: 1.6 }}>
          {puzzle.description}
        </div>

        <textarea
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setStatus('idle')
          }}
          onTouchStart={(e) => e.stopPropagation()}
          spellCheck={false}
          style={{
            width: '100%',
            minHeight: 200,
            background: '#111',
            color: '#F0EBE3',
            border: `1px solid ${status === 'pass' ? '#769826' : status === 'fail' ? '#aa3333' : 'rgba(240,235,227,0.1)'}`,
            borderRadius: 4,
            padding: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            lineHeight: 1.5,
            resize: 'vertical',
            outline: 'none',
            touchAction: 'manipulation',
          }}
        />

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={handleRun}
            disabled={status === 'running'}
            style={{
              background: '#F0EBE3',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: 6,
              padding: '8px 20px',
              fontSize: 10,
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 600,
              letterSpacing: 2,
              cursor: status === 'running' ? 'default' : 'pointer',
              opacity: status === 'running' ? 0.5 : 1,
              textTransform: 'uppercase',
            }}
          >
            {status === 'running' ? 'RUNNING...' : 'RUN TEST'}
          </button>
          {puzzle.hint && (
            <div style={{ fontSize: 10, color: 'rgba(240,235,227,0.35)', fontStyle: 'italic' }}>
              Hint: {puzzle.hint}
            </div>
          )}
        </div>

        {output && (
          <div
            style={{
              padding: 12,
              borderRadius: 4,
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              lineHeight: 1.5,
              background: status === 'pass' ? 'rgba(118,152,38,0.1)' : 'rgba(170,51,51,0.1)',
              border: `1px solid ${status === 'pass' ? 'rgba(118,152,38,0.3)' : 'rgba(170,51,51,0.3)'}`,
              color: status === 'pass' ? '#769826' : '#cc4444',
            }}
          >
            {output}
          </div>
        )}

        <div style={{ fontSize: 10, color: 'rgba(240,235,227,0.2)', textAlign: 'center' }}>
          Ctrl+Enter to run · Esc to close
        </div>
      </div>
    </div>
  )
}
