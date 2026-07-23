import { useState, useEffect, useRef } from 'react'
import { Challenge } from '../game/types'

interface Props {
  challenge: Challenge
  timeLimit: number
  onAnswer: (index: number) => void
  onTimeout: () => void
  onTextAnswer?: (text: string) => void
  isBoss?: boolean
  isBonus?: boolean
}

const colors: Record<string, string> = { easy: '#769826', medium: '#F0EBE3', hard: 'rgba(240,235,227,0.4)' }
const labels: Record<string, string> = { easy: 'EASY', medium: 'MEDIUM', hard: 'HARD' }
const typeLabels: Record<string, string> = {
  'multiple': 'MULTIPLE CHOICE',
  'fill-blank': 'FILL IN THE BLANK',
  'output': 'OUTPUT PREDICTION',
  'spot-bug': 'SPOT THE BUG',
}

export default function ChallengeModal({ challenge, timeLimit, onAnswer, onTimeout, onTextAnswer, isBoss, isBonus }: Props) {
  const [timer, setTimer] = useState(timeLimit)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [textInput, setTextInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const start = useRef(Date.now())
  const interval = useRef<number>(0)

  useEffect(() => {
    start.current = Date.now()
    setTimer(timeLimit)
    setSelected(null)
    setAnswered(false)
    setTextInput('')
    interval.current = window.setInterval(() => {
      const elapsed = (Date.now() - start.current) / 1000
      const remaining = Math.max(0, timeLimit - elapsed)
      setTimer(remaining)
      if (remaining <= 0) clearInterval(interval.current)
    }, 100)
    return () => clearInterval(interval.current)
  }, [challenge, timeLimit])

  const timeoutFired = useRef(false)
  useEffect(() => {
    if (timer <= 0 && !answered && !timeoutFired.current) {
      timeoutFired.current = true
      setAnswered(true)
      onTimeout()
    }
  }, [timer, answered, onTimeout])

  useEffect(() => {
    if (challenge.type === 'fill-blank' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [challenge.type])

  function select(i: number) {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    clearInterval(interval.current)
    onAnswer(i)
  }

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (answered || !textInput.trim()) return
    setAnswered(true)
    clearInterval(interval.current)
    const userAnswer = textInput.trim().toLowerCase()
    const correctAnswer = challenge.options[challenge.correct].toLowerCase()
    if (userAnswer === correctAnswer) {
      onAnswer(challenge.correct)
    } else {
      onAnswer(-1)
    }
    if (onTextAnswer) onTextAnswer(textInput)
  }

  const correct = selected === challenge.correct
  const pct = timeLimit > 0 ? (timer / timeLimit) * 100 : 0
  const urgent = timer <= timeLimit * 0.25
  const dc = colors[challenge.difficulty]

  function renderCodeBlock(code: string) {
    return (
      <pre style={styles.codeBlock}>
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <div style={styles.overlay}>
      <div className="modal-card" style={{ ...styles.card, borderColor: isBoss ? 'rgba(240,235,227,0.2)' : isBonus ? 'rgba(240,235,227,0.2)' : 'rgba(118,152,38,0.2)' }}>
        <div style={styles.top}>
          <div style={styles.left}>
            <span style={{ ...styles.badge, borderColor: dc, color: dc, background: `${dc}15` }}>
              {labels[challenge.difficulty]}
            </span>
            {!isBoss && !isBonus && (
              <span style={styles.typeLabel}>{typeLabels[challenge.type] || 'CHALLENGE'}</span>
            )}
            {isBoss &&             <span style={{ ...styles.typeLabel, color: '#F0EBE3' }}>⚔ BOSS BATTLE</span>}
            {isBonus && <span style={{ ...styles.typeLabel, color: '#F0EBE3' }}>⚡ BONUS ROUND</span>}
          </div>
          <div style={styles.timerBox}>
            <div style={styles.tBar}>
              <div style={{
                ...styles.tFill, width: `${pct}%`,
                background: urgent ? 'rgba(240,235,227,0.4)' : timer <= timeLimit * 0.5 ? 'rgba(240,235,227,0.6)' : '#769826',
              }} />
            </div>
            <span style={{
              color: 'rgba(240,235,227,0.6)',
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
              minWidth: 30, textAlign: 'right' as const,
            }}>
              {Math.ceil(timer)}s
            </span>
          </div>
        </div>

        <p style={styles.q}>{challenge.question}</p>

        {challenge.code && (challenge.type === 'output' || challenge.type === 'spot-bug') && renderCodeBlock(challenge.code)}

        {challenge.code && challenge.type === 'fill-blank' && (
          <div style={styles.codeWithBlank}>
            <pre style={styles.codeBlock}><code>{challenge.code}</code></pre>
          </div>
        )}

        {challenge.type === 'fill-blank' ? (
          <form onSubmit={handleTextSubmit} style={styles.textForm}>
            <input
              ref={inputRef}
              type="text"
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={answered}
              style={{
                ...styles.textInput,
                borderColor: answered
                  ? (correct ? '#769826' : 'rgba(240,235,227,0.3)')
                  : 'rgba(240,235,227,0.15)',
              }}
              autoComplete="off"
              spellCheck={false}
            />
            {!answered && (
              <button type="submit" style={styles.submitBtn}>
                ⏎ ENTER
              </button>
            )}
            {answered && (
              <div style={{
                ...styles.fb,
                borderColor: correct ? 'rgba(118,152,38,0.3)' : 'rgba(240,235,227,0.2)',
                color: correct ? '#769826' : 'rgba(240,235,227,0.6)',
              }}>
                {correct ? '> CORRECT!' : `> Expected: ${challenge.options[challenge.correct]}. ${challenge.explanation}`}
              </div>
            )}
          </form>
        ) : (
          <div style={styles.opts}>
            {challenge.options.map((opt, i) => {
              let bg = 'transparent'
              let border = 'rgba(240,235,227,0.15)'
              let disabled = false
              if (answered) {
                disabled = true
                if (i === challenge.correct) { bg = 'rgba(118,152,38,0.1)'; border = '#769826' }
                else if (i === selected) { bg = 'rgba(240,235,227,0.04)'; border = 'rgba(240,235,227,0.3)' }
              }
              return (
                <button
                  key={i}
                  onClick={() => select(i)}
                  disabled={disabled}
                  style={{ ...styles.opt, background: bg, borderColor: border }}
                  onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = 'rgba(240,235,227,0.06)'; e.currentTarget.style.borderColor = 'rgba(240,235,227,0.3)' } }}
                  onMouseLeave={e => { if (!disabled) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border } }}
                >
                  <span style={{
                    ...styles.letter,
                    color: answered && i === challenge.correct ? '#769826' : answered && i === selected ? 'rgba(240,235,227,0.6)' : '#F0EBE3',
                    background: answered && i === challenge.correct ? 'rgba(118,152,38,0.15)' : answered && i === selected ? 'rgba(240,235,227,0.08)' : 'rgba(240,235,227,0.04)',
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={styles.optText}>{opt}</span>
                  {answered && i === challenge.correct && <span style={{ color: '#769826', fontSize: 14 }}>●</span>}
                  {answered && i === selected && i !== challenge.correct && <span style={{ color: 'rgba(240,235,227,0.4)', fontSize: 14 }}>●</span>}
                </button>
              )
            })}
          </div>
        )}

        {answered && challenge.type !== 'fill-blank' && (
          <div style={{
            ...styles.fb,
            borderColor: correct ? 'rgba(118,152,38,0.3)' : 'rgba(240,235,227,0.2)',
            color: correct ? '#769826' : 'rgba(240,235,227,0.6)',
          }}>
            {correct ? '> CORRECT!' : `> ${challenge.explanation}`}
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 12,
    background: 'rgba(0,0,0,0.7)',
  },
  card: {
    background: '#0a0a0a',
    border: '1px solid rgba(240,235,227,0.12)',
    borderRadius: 12,
    padding: '16px 18px',
    maxWidth: 520, width: '100%',
  },
  top: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', gap: 8, marginBottom: 12,
    flexWrap: 'wrap' as const,
  },
  left: { display: 'flex', alignItems: 'center', gap: 8 },
  badge: {
    padding: '2px 8px',
    border: '1px solid',
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 500,
    letterSpacing: 2,
    lineHeight: '16px',
    fontFamily: "'Roboto', sans-serif",
  },
  typeLabel: {
    color: 'rgba(240,235,227,0.5)', fontSize: 8,
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 300,
    letterSpacing: 1,
  },
  timerBox: { display: 'flex', alignItems: 'center', gap: 4, minWidth: 80 },
  tBar: { flex: 1, height: 6, background: 'rgba(240,235,227,0.06)', overflow: 'hidden', borderRadius: 3 },
  tFill: { height: '100%', transition: 'width 0.1s linear' },
  q: {
    color: '#F0EBE3', fontSize: 13,
    lineHeight: 1.5, marginBottom: 10,
    textAlign: 'center' as const,
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 300,
  },
  codeBlock: {
    background: '#0d0d0d',
    border: '1px solid rgba(240,235,227,0.08)',
    borderRadius: 8,
    padding: '10px 12px',
    marginBottom: 12,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: '#F0EBE3',
    lineHeight: 1.5,
    overflowX: 'auto' as const,
    whiteSpace: 'pre-wrap' as const,
  },
  codeWithBlank: {
    marginBottom: 8,
  },
  textForm: {
    display: 'flex', flexDirection: 'column' as const, gap: 8,
    marginBottom: 8,
  },
  textInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid rgba(240,235,227,0.15)',
    borderRadius: 8,
    background: '#0d0d0d',
    color: '#F0EBE3',
    fontSize: 14,
    fontFamily: "'JetBrains Mono', monospace",
    outline: 'none',
    transition: 'border-color 0.1s',
  },
  submitBtn: {
    padding: '8px 20px',
    border: 'none',
    borderRadius: 8,
    background: '#F0EBE3',
    color: '#0a0a0a',
    fontSize: 10,
    fontWeight: 500,
    fontFamily: "'Roboto', sans-serif",
    cursor: 'pointer',
    letterSpacing: 2,
    alignSelf: 'center',
  },
  opts: { display: 'flex', flexDirection: 'column' as const, gap: 5 },
  opt: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 12px',
    border: '1px solid rgba(240,235,227,0.1)',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 12, color: '#F0EBE3',
    textAlign: 'left' as const, width: '100%',
    transition: 'all 0.08s',
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 300,
  },
  letter: {
    width: 22, height: 22,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 500, fontSize: 9,
    flexShrink: 0,
    borderRadius: 4,
    fontFamily: "'Roboto', sans-serif",
  },
  optText: { flex: 1, lineHeight: 1.3 },
  fb: {
    marginTop: 6, padding: '6px 10px',
    border: '1px solid',
    borderRadius: 6,
    fontSize: 10, lineHeight: 1.4,
    textAlign: 'center' as const,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: 1,
  },
}
