import { useCallback, useEffect, useRef, useState } from 'react'
import {
  SideViewCanvas,
  SideViewCanvasHandle,
  SideHudSnapshot,
} from '../game/sideView/SideViewCanvas'
import DialogueOverlay from './DialogueOverlay'
import { getChallengePool } from '../game/engine/data/challenges'
import { Challenge } from '../game/types'
import { StoryLevelNode } from '../game/engine/story/levels'
import { colors, fonts, alpha, glassPanel, radius, transition } from '../lib/theme'

interface Props {
  node: StoryLevelNode
  onComplete: (stars: number, score: number) => void
  onExit: () => void
}

type Phase = 'dialogue' | 'play' | 'question' | 'feedback' | 'complete' | 'gameover'

const QUESTION_DISTANCE = 380
const SCORE_PER_ANSWER = 100
const FEEDBACK_MS = 1600

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQueue(node: StoryLevelNode): Challenge[] {
  const pool = getChallengePool().filter((c) => c.topic === node.topic)
  const fallback = getChallengePool().filter((c) => c.difficulty === node.difficulty)
  const source = pool.length > 0 ? pool : fallback
  return shuffle(source).slice(0, node.questions)
}

const typeLabels: Record<string, string> = {
  multiple: 'MULTIPLE CHOICE',
  'fill-blank': 'FILL IN THE BLANK',
  output: 'OUTPUT PREDICTION',
  'spot-bug': 'SPOT THE BUG',
}

function QuestionCard({
  challenge,
  onSelect,
  answered,
  onNext,
  accent,
}: {
  challenge: Challenge
  onSelect: (index: number) => void
  answered: number | null
  onNext: () => void
  accent: string
}) {
  const handleNext = useCallback(() => {
    onNext()
  }, [onNext])
  return (
    <div style={{ ...glassPanel, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            padding: '2px 8px',
            border: `1px solid ${accent}`,
            color: accent,
            borderRadius: 4,
            fontSize: 9,
            letterSpacing: 2,
            fontFamily: fonts.heading,
            fontWeight: 600,
          }}
        >
          {challenge.difficulty.toUpperCase()}
        </span>
        <span style={{ color: alpha(0.5), fontSize: 9, letterSpacing: 2, fontFamily: fonts.body }}>
          {typeLabels[challenge.type] || 'CHALLENGE'}
        </span>
        {answered === challenge.correct && (
          <span
            style={{ marginLeft: 'auto', color: '#4fe3c1', fontSize: 10, fontFamily: fonts.mono }}
          >
            +{SCORE_PER_ANSWER} PTS
          </span>
        )}
      </div>
      <div style={{ color: colors.fg, fontSize: 12, lineHeight: 1.5, fontFamily: fonts.body }}>
        {challenge.question}
      </div>
      {challenge.code && (
        <pre
          style={{
            background: 'rgba(0,0,0,0.45)',
            border: `1px solid ${alpha(0.1)}`,
            borderRadius: 6,
            padding: '8px 10px',
            fontFamily: fonts.mono,
            fontSize: 11,
            color: colors.fg,
            lineHeight: 1.5,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            margin: 0,
          }}
        >
          {challenge.code}
        </pre>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {challenge.options.map((opt, i) => {
          let bg = 'transparent'
          let border = alpha(0.15)
          let color = colors.fg
          let disabled = false
          if (answered !== null) {
            disabled = true
            if (i === challenge.correct) {
              bg = 'rgba(79,227,193,0.1)'
              border = '#4fe3c1'
            } else if (i === answered) {
              bg = 'rgba(255,45,120,0.08)'
              border = '#ff2d78'
              color = alpha(0.7)
            } else {
              color = alpha(0.4)
            }
          }
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onSelect(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 10px',
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 6,
                color,
                cursor: disabled ? 'default' : 'pointer',
                fontFamily: fonts.body,
                fontSize: 11,
                textAlign: 'left',
                transition,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background: alpha(0.08),
                  color: colors.fg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: fonts.heading,
                  flexShrink: 0,
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
      {answered !== null && (
        <button
          onClick={handleNext}
          style={{
            padding: '7px 0',
            background: accent,
            color: '#05030f',
            border: 'none',
            borderRadius: 6,
            fontFamily: fonts.heading,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            cursor: 'pointer',
          }}
        >
          {answered === challenge.correct ? 'NEXT →' : 'CONTINUE →'}
        </button>
      )}
      {answered !== null && answered !== challenge.correct && (
        <div
          style={{
            color: '#ff2d78',
            fontFamily: fonts.mono,
            fontSize: 10,
            lineHeight: 1.4,
            border: `1px solid rgba(255,45,120,0.3)`,
            borderRadius: 6,
            padding: '5px 8px',
          }}
        >
          {'> '}
          {challenge.explanation}
        </div>
      )}
    </div>
  )
}

export default function StoryRunScreen({ node, onComplete, onExit }: Props) {
  const canvasRef = useRef<SideViewCanvasHandle>(null)
  const [phase, setPhase] = useState<Phase>('dialogue')
  const [queue, setQueue] = useState<Challenge[]>(() => buildQueue(node))
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answered, setAnswered] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [hud, setHud] = useState<SideHudSnapshot | null>(null)
  const lastTriggerX = useRef(0)
  const feedbackTimer = useRef<number | null>(null)
  const onCompleteRef = useRef(onComplete)
  const nodeRef = useRef(node)
  const scoreRef = useRef(0)
  const hpRef = useRef(3)
  const hudRef = useRef<SideHudSnapshot | null>(null)
  const queueRef = useRef(queue)

  useEffect(() => {
    onCompleteRef.current = onComplete
    nodeRef.current = node
  }, [onComplete, node])

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    hpRef.current = hud?.hp ?? 3
    hudRef.current = hud
  }, [hud])

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  const challenge = queue[questionIndex]

  const startQuestion = useCallback(() => {
    setPhase('question')
    canvasRef.current?.pause(true)
  }, [])

  useEffect(() => {
    if (phase !== 'play') return
    if (!hud) return
    if (hud.x - lastTriggerX.current >= QUESTION_DISTANCE) {
      lastTriggerX.current = hud.x
      startQuestion()
    }
  }, [hud, phase, startQuestion])

  const finishCleared = useCallback(() => {
    const hp = hpRef.current
    const stars = hp === 3 ? 3 : hp === 2 ? 2 : 1
    const finalScore = scoreRef.current
    setScore(finalScore)
    setPhase('complete')
    onCompleteRef.current(stars, finalScore)
  }, [])

  const advanceAfterAnswer = useCallback(() => {
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current)
      feedbackTimer.current = null
    }
    const next = questionIndex + 1
    setAnswered(null)
    if (next >= queueRef.current.length) {
      finishCleared()
    } else {
      setQuestionIndex(next)
      canvasRef.current?.pause(false)
      setPhase('play')
    }
  }, [questionIndex, finishCleared])

  const handleAnswer = useCallback(
    (i: number) => {
      if (answered !== null) return
      setAnswered(i)
      const correct = i === challenge.correct
      canvasRef.current?.applyAnswer(correct)
      if (correct) {
        const gained = SCORE_PER_ANSWER * (hudRef.current?.multiplier ?? 1)
        setScore((s) => s + gained)
      } else {
        canvasRef.current?.applyDamage(1)
      }
      setPhase('feedback')
      feedbackTimer.current = window.setTimeout(advanceAfterAnswer, FEEDBACK_MS)
    },
    [answered, challenge, advanceAfterAnswer],
  )

  const handleCanvasEvent = useCallback((event: { type: string }) => {
    if (event.type === 'die') {
      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current)
        feedbackTimer.current = null
      }
      setPhase('gameover')
    }
  }, [])

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    }
  }, [])

  const hp = hud?.hp ?? 3
  const stars = hp === 3 ? 3 : hp === 2 ? 2 : 1

  const retry = useCallback(() => {
    setQueue(buildQueue(nodeRef.current))
    setQuestionIndex(0)
    setAnswered(null)
    setScore(0)
    lastTriggerX.current = 0
    canvasRef.current?.restart()
    setPhase('dialogue')
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#05030f',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: 10,
          padding: 10,
          minHeight: 0,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            flex: '1 1 420px',
            minWidth: 320,
            minHeight: 260,
            position: 'relative',
            border: `1px solid ${alpha(0.12)}`,
            borderRadius: radius.lg,
            overflow: 'hidden',
            background: '#05030f',
          }}
        >
          <SideViewCanvas ref={canvasRef} onEvent={handleCanvasEvent} onHud={setHud} />
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 10,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              pointerEvents: 'none',
              fontFamily: fonts.mono,
              fontSize: 11,
              color: colors.fg,
            }}
          >
            <span>
              {'\u2665'.repeat(Math.max(0, hp))}
              {'\u2661'.repeat(Math.max(0, 3 - hp))}
            </span>
            <span style={{ color: node.accent }}>{node.title}</span>
            <span style={{ color: alpha(0.5) }}>
              Q{' '}
              {Math.min(
                questionIndex + (phase === 'question' || phase === 'feedback' ? 1 : 0),
                queue.length,
              )}
              /{queue.length}
            </span>
          </div>
          {phase === 'dialogue' && (
            <DialogueOverlay
              lines={node.intro}
              accent={node.accent}
              onDone={() => {
                lastTriggerX.current = 0
                setPhase('play')
              }}
            />
          )}
          {(phase === 'complete' || phase === 'gameover') && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(5,3,15,0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                zIndex: 10,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 26,
                  letterSpacing: 3,
                  color: phase === 'complete' ? '#4fe3c1' : '#ff2d78',
                }}
              >
                {phase === 'complete' ? 'NODE CLEARED' : 'SIGNAL LOST'}
              </div>
              <div style={{ color: node.accent, fontSize: 18, letterSpacing: 3 }}>
                {'\u2605'.repeat(stars)}
                {'\u2606'.repeat(3 - stars)}
              </div>
              <div style={{ color: colors.fg, fontFamily: fonts.mono, fontSize: 14 }}>
                SCORE {score.toLocaleString()}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={retry} style={overlayBtn(node.accent)}>
                  RETRY
                </button>
                <button onClick={onExit} style={overlayBtn(node.accent)}>
                  MAP
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            flex: '0 1 340px',
            minWidth: 280,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            overflow: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={onExit}
              style={{
                background: 'transparent',
                color: alpha(0.6),
                border: `1px solid ${alpha(0.15)}`,
                borderRadius: radius.md,
                padding: '5px 12px',
                fontFamily: fonts.heading,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              ← MAP
            </button>
            <div
              style={{
                marginLeft: 'auto',
                fontFamily: fonts.mono,
                fontSize: 12,
                color: colors.fg,
              }}
            >
              SCORE <b style={{ color: node.accent }}>{score.toLocaleString()}</b>
            </div>
          </div>

          {phase === 'play' && (
            <div
              style={{
                ...glassPanel,
                padding: 14,
                textAlign: 'center',
                color: alpha(0.5),
                fontFamily: fonts.body,
                fontSize: 11,
                lineHeight: 1.6,
              }}
            >
              Run the pipe. The next junction query activates as you progress.
              <div style={{ marginTop: 6, color: node.accent, fontSize: 10, letterSpacing: 2 }}>
                [A/D or \u2190/\u2192 move — SPACE jump]
              </div>
            </div>
          )}

          {(phase === 'question' || phase === 'feedback') && challenge && (
            <QuestionCard
              challenge={challenge}
              accent={node.accent}
              onSelect={handleAnswer}
              answered={answered}
              onNext={advanceAfterAnswer}
            />
          )}

          {phase === 'feedback' && (
            <div
              style={{
                color: alpha(0.5),
                fontFamily: fonts.body,
                fontSize: 10,
                textAlign: 'center',
              }}
            >
              {answered === challenge?.correct ? 'Nice one.' : 'Keep moving — hearts are limited.'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function overlayBtn(accent: string): React.CSSProperties {
  return {
    background: accent,
    color: '#05030f',
    border: 'none',
    borderRadius: 6,
    padding: '8px 22px',
    fontFamily: fonts.heading,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2,
    cursor: 'pointer',
  }
}
