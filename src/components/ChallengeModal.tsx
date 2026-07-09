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

const colors: Record<string, string> = { easy: '#4CAF50', medium: '#FFA000', hard: '#F44336' }
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
      <div className="modal-card" style={{ ...styles.card, borderColor: isBoss ? 'rgba(244,67,54,0.4)' : isBonus ? 'rgba(255,215,0,0.4)' : 'rgba(79,195,247,0.2)' }}>
        <div style={styles.top}>
          <div style={styles.left}>
            <span style={{ ...styles.badge, borderColor: dc, color: dc, background: `${dc}15` }}>
              {labels[challenge.difficulty]}
            </span>
            {!isBoss && !isBonus && (
              <span style={styles.typeLabel}>{typeLabels[challenge.type] || 'CHALLENGE'}</span>
            )}
            {isBoss && <span style={{ ...styles.typeLabel, color: '#F44336' }}>⚔ BOSS BATTLE</span>}
            {isBonus && <span style={{ ...styles.typeLabel, color: '#FFD700' }}>⚡ BONUS ROUND</span>}
          </div>
          <div style={styles.timerBox}>
            <div style={styles.tBar}>
              <div style={{
                ...styles.tFill, width: `${pct}%`,
                background: urgent ? '#F44336' : timer <= timeLimit * 0.5 ? '#FFA000' : '#4FC3F7',
              }} />
            </div>
            <span style={{
              color: urgent ? '#F44336' : '#888',
              fontSize: 11, fontFamily: "'Press Start 2P', monospace",
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
                  ? (correct ? '#4CAF50' : '#F44336')
                  : '#333',
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
                borderColor: correct ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)',
                color: correct ? '#4CAF50' : '#F44336',
              }}>
                {correct ? '> CORRECT!' : `> Expected: ${challenge.options[challenge.correct]}. ${challenge.explanation}`}
              </div>
            )}
          </form>
        ) : (
          <div style={styles.opts}>
            {challenge.options.map((opt, i) => {
              let bg = '#0d0d0d'
              let border = '#2a2a2a'
              let disabled = false
              if (answered) {
                disabled = true
                if (i === challenge.correct) { bg = '#0a1a0a'; border = '#4CAF50' }
                else if (i === selected) { bg = '#1a0a0a'; border = '#F44336' }
              }
              return (
                <button
                  key={i}
                  onClick={() => select(i)}
                  disabled={disabled}
                  style={{ ...styles.opt, background: bg, borderColor: border }}
                  onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = '#151515'; e.currentTarget.style.borderColor = '#444' } }}
                  onMouseLeave={e => { if (!disabled) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border } }}
                >
                  <span style={{
                    ...styles.letter,
                    color: answered && i === challenge.correct ? '#4CAF50' : answered && i === selected ? '#F44336' : '#4FC3F7',
                    background: answered && i === challenge.correct ? 'rgba(76,175,80,0.15)' : answered && i === selected ? 'rgba(244,67,54,0.15)' : 'rgba(79,195,247,0.08)',
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={styles.optText}>{opt}</span>
                  {answered && i === challenge.correct && <span style={{ color: '#4CAF50', fontSize: 14 }}>●</span>}
                  {answered && i === selected && i !== challenge.correct && <span style={{ color: '#F44336', fontSize: 14 }}>●</span>}
                </button>
              )
            })}
          </div>
        )}

        {answered && challenge.type !== 'fill-blank' && (
          <div style={{
            ...styles.fb,
            borderColor: correct ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)',
            color: correct ? '#4CAF50' : '#F44336',
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
    border: '4px solid rgba(79,195,247,0.2)',
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
    border: '3px solid',
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 2,
    lineHeight: '16px',
    fontFamily: "'Press Start 2P', monospace",
  },
  typeLabel: {
    color: '#888', fontSize: 8,
    fontFamily: "'Press Start 2P', monospace",
    letterSpacing: 1,
  },
  timerBox: { display: 'flex', alignItems: 'center', gap: 4, minWidth: 80 },
  tBar: { flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.03)' },
  tFill: { height: '100%', transition: 'width 0.1s linear' },
  q: {
    color: '#ccc', fontSize: 13,
    lineHeight: 1.5, marginBottom: 10,
    textAlign: 'center' as const,
    fontFamily: "'Inter', sans-serif",
  },
  codeBlock: {
    background: '#0d0d1a',
    border: '2px solid rgba(79,195,247,0.1)',
    padding: '10px 12px',
    marginBottom: 12,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: '#aac',
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
    border: '3px solid',
    background: '#0d0d0d',
    color: '#fff',
    fontSize: 14,
    fontFamily: "'JetBrains Mono', monospace",
    outline: 'none',
    transition: 'border-color 0.1s',
  },
  submitBtn: {
    padding: '8px 20px',
    border: '3px solid rgba(79,195,247,0.4)',
    background: '#1a2a3a',
    color: '#4FC3F7',
    fontSize: 10,
    fontFamily: "'Press Start 2P', monospace",
    cursor: 'pointer',
    letterSpacing: 2,
    alignSelf: 'center',
  },
  opts: { display: 'flex', flexDirection: 'column' as const, gap: 5 },
  opt: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 12px',
    border: '3px solid',
    cursor: 'pointer',
    fontSize: 12, color: '#bbb',
    textAlign: 'left' as const, width: '100%',
    transition: 'all 0.08s',
    fontFamily: "'Inter', sans-serif",
  },
  letter: {
    width: 22, height: 22,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 9,
    flexShrink: 0,
    fontFamily: "'Press Start 2P', monospace",
  },
  optText: { flex: 1, lineHeight: 1.3 },
  fb: {
    marginTop: 6, padding: '6px 10px',
    border: '3px solid',
    fontSize: 10, lineHeight: 1.4,
    textAlign: 'center' as const,
    fontFamily: "'Press Start 2P', monospace",
    letterSpacing: 1,
  },
}
