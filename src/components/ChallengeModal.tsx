import { useState, useEffect, useRef } from 'react'
import { Challenge } from '../game/types'

interface Props {
  challenge: Challenge
  timeLimit: number
  onAnswer: (index: number) => void
  onTimeout: () => void
}

const difficultyColors: Record<string, string> = {
  easy: '#4CAF50',
  medium: '#FFA000',
  hard: '#F44336',
}

const difficultyLabels: Record<string, string> = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
}

export default function ChallengeModal({ challenge, timeLimit, onAnswer, onTimeout }: Props) {
  const [timer, setTimer] = useState(timeLimit)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const startTime = useRef(Date.now())
  const intervalRef = useRef<number>(0)

  useEffect(() => {
    startTime.current = Date.now()
    setTimer(timeLimit)
    setSelected(null)
    setAnswered(false)
    intervalRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTime.current) / 1000
      const remaining = Math.max(0, timeLimit - elapsed)
      setTimer(remaining)
      if (remaining <= 0) {
        clearInterval(intervalRef.current)
      }
    }, 100)
    return () => clearInterval(intervalRef.current)
  }, [challenge, timeLimit])

  useEffect(() => {
    if (timer <= 0 && !answered) {
      setAnswered(true)
      onTimeout()
    }
  }, [timer, answered, onTimeout])

  function handleSelect(index: number) {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    clearInterval(intervalRef.current)
    onAnswer(index)
  }

  const isCorrect = selected === challenge.correct
  const timerPct = timeLimit > 0 ? (timer / timeLimit) * 100 : 0

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={{
              ...styles.difficultyBadge,
              background: `${difficultyColors[challenge.difficulty]}22`,
              borderColor: difficultyColors[challenge.difficulty],
              color: difficultyColors[challenge.difficulty],
            }}>
              {difficultyLabels[challenge.difficulty]}
            </div>
            <span style={styles.headerTitle}>Code Challenge</span>
          </div>
          <div style={styles.timerWrap}>
            <div style={styles.timerBg}>
              <div style={{
                ...styles.timerFill,
                width: `${timerPct}%`,
                background: timer <= timeLimit * 0.2
                  ? '#F44336'
                  : timer <= timeLimit * 0.5
                    ? '#FFA000'
                    : '#4FC3F7',
              }} />
            </div>
            <span style={{
              ...styles.timerText,
              color: timer <= timeLimit * 0.2 ? '#F44336' : '#fff',
            }}>
              {Math.ceil(timer)}s
            </span>
          </div>
        </div>

        <div style={styles.question}>{challenge.question}</div>

        <div style={styles.options}>
          {challenge.options.map((opt, i) => {
            let bg = 'rgba(255,255,255,0.06)'
            let border = 'rgba(255,255,255,0.12)'
            if (answered) {
              if (i === challenge.correct) {
                bg = 'rgba(76,175,80,0.2)'
                border = '#4CAF50'
              } else if (i === selected) {
                bg = 'rgba(244,67,54,0.2)'
                border = '#F44336'
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{ ...styles.option, background: bg, borderColor: border }}
                disabled={answered}
              >
                <span style={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                <span style={styles.optionText}>{opt}</span>
                {answered && i === challenge.correct && <span style={styles.optionIcon}>✓</span>}
                {answered && i === selected && i !== challenge.correct && <span style={styles.optionIcon}>✗</span>}
              </button>
            )
          })}
        </div>

        {answered && (
          <div style={{
            ...styles.feedback,
            color: isCorrect ? '#4CAF50' : '#F44336',
          }}>
            {isCorrect ? '✅ Correct!' : `❌ ${challenge.explanation}`}
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.78)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: 12,
  },
  modal: {
    background: 'linear-gradient(135deg, #1a1a3e 0%, #0d0d2b 100%)',
    border: '1px solid rgba(100,100,255,0.25)',
    borderRadius: 14,
    padding: '18px 20px',
    maxWidth: 520,
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(79,195,247,0.08)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap' as const,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  difficultyBadge: {
    padding: '2px 10px',
    borderRadius: 6,
    border: '1.5px solid',
    fontSize: 10,
    fontWeight: 700,
    fontFamily: 'monospace',
    letterSpacing: 1,
    lineHeight: '20px',
  },
  headerTitle: {
    color: '#4FC3F7',
    fontSize: 16,
    fontWeight: 700,
    fontFamily: 'monospace',
  },
  timerWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
  },
  timerBg: {
    flex: 1,
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.1s linear',
  },
  timerText: {
    fontFamily: 'monospace',
    fontWeight: 700,
    fontSize: 14,
    minWidth: 26,
    textAlign: 'right' as const,
  },
  question: {
    color: '#e0e0e0',
    fontSize: 15,
    lineHeight: 1.5,
    marginBottom: 18,
    fontFamily: 'monospace',
  },
  options: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderRadius: 9,
    border: '1.5px solid',
    cursor: 'pointer',
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#ccc',
    textAlign: 'left' as const,
    width: '100%',
  },
  optionLetter: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: 'rgba(79,195,247,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    color: '#4FC3F7',
    fontSize: 12,
    flexShrink: 0,
  },
  optionText: {
    flex: 1,
    lineHeight: 1.3,
  },
  optionIcon: {
    fontSize: 16,
    flexShrink: 0,
  },
  feedback: {
    marginTop: 14,
    padding: '8px 12px',
    borderRadius: 8,
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 1.4,
    textAlign: 'center' as const,
  },
}
