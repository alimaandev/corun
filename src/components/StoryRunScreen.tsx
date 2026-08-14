import { useCallback, useEffect, useRef, useState } from 'react'
import {
  SideViewCanvas,
  SideViewCanvasHandle,
  SideHudSnapshot,
} from '../game/sideView/SideViewCanvas'
import DialogueOverlay from './DialogueOverlay'
import CodeEditor from './CodeEditor'
import { StoryLevelNode } from '../game/engine/story/levels'
import { getStoryTasks, StoryTask } from '../game/engine/story/tasks'
import { evaluateCode } from '../game/engine/codeEvaluator'
import { colors, fonts, alpha, glassPanel, radius } from '../lib/theme'

interface Props {
  node: StoryLevelNode
  onComplete: (stars: number, score: number) => void
  onExit: () => void
}

type Phase = 'dialogue' | 'play' | 'question' | 'feedback' | 'complete' | 'gameover'

const QUESTION_DISTANCE = 380
const SCORE_PER_TASK = 100
const FEEDBACK_MS = 2200

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function TaskPanel({
  task,
  accent,
  onSolved,
  onFailed,
  failedBefore,
}: {
  task: StoryTask
  accent: string
  onSolved: () => void
  onFailed: (output: string) => void
  failedBefore: boolean
}) {
  const [code, setCode] = useState(task.template)
  const [status, setStatus] = useState<'idle' | 'running' | 'pass' | 'fail'>('idle')
  const [output, setOutput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const taskIdRef = useRef(task.id)

  useEffect(() => {
    taskIdRef.current = task.id
    setCode(task.template)
    setStatus('idle')
    setOutput('')
    setShowHint(false)
  }, [task])

  const run = useCallback(async () => {
    if (status === 'running') return
    setStatus('running')
    setOutput('')
    const result = await evaluateCode(code, task.test)
    if (result.success) {
      setStatus('pass')
      setOutput(result.output || task.successMessage)
      onSolved()
    } else {
      setStatus('fail')
      setOutput(result.output || 'Test failed')
      onFailed(result.output || 'Test failed')
    }
  }, [code, task, status, onSolved, onFailed])

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
          TASK
        </span>
        <span
          style={{ color: colors.fg, fontSize: 11, fontFamily: fonts.heading, fontWeight: 700 }}
        >
          {task.title}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            color: alpha(0.4),
            fontSize: 9,
            fontFamily: fonts.body,
            letterSpacing: 1,
          }}
        >
          {failedBefore ? '-1 HP IF THIS FAILS' : 'FIRST FAILURE COSTS 1 HP'}
        </span>
      </div>

      <div style={{ color: alpha(0.75), fontSize: 11, lineHeight: 1.5, fontFamily: fonts.body }}>
        {task.description}
      </div>

      <CodeEditor
        value={code}
        onChange={(v) => {
          setCode(v)
          setStatus('idle')
        }}
        onRun={run}
        accent={accent}
        disabled={status === 'running'}
        minHeight={130}
        autoFocus
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={run}
          disabled={status === 'running'}
          style={{
            background: accent,
            color: '#05030f',
            border: 'none',
            borderRadius: 6,
            padding: '8px 18px',
            fontFamily: fonts.heading,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            cursor: status === 'running' ? 'default' : 'pointer',
            opacity: status === 'running' ? 0.5 : 1,
          }}
        >
          {status === 'running' ? 'RUNNING...' : 'RUN TEST'}
        </button>
        <button
          onClick={() => setShowHint((v) => !v)}
          style={{
            background: 'transparent',
            color: alpha(0.6),
            border: `1px solid ${alpha(0.2)}`,
            borderRadius: 6,
            padding: '8px 14px',
            fontFamily: fonts.heading,
            fontSize: 10,
            letterSpacing: 1,
            cursor: 'pointer',
          }}
        >
          HINT
        </button>
        <span
          style={{ marginLeft: 'auto', color: alpha(0.3), fontSize: 9, fontFamily: fonts.mono }}
        >
          CTRL+ENTER TO RUN
        </span>
      </div>

      {showHint && (
        <div
          style={{
            color: alpha(0.6),
            fontSize: 10,
            fontStyle: 'italic',
            fontFamily: fonts.body,
            lineHeight: 1.5,
            borderLeft: `2px solid ${accent}`,
            paddingLeft: 8,
          }}
        >
          {task.hint}
        </div>
      )}

      {status !== 'idle' && output && (
        <div
          style={{
            padding: '8px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: fonts.mono,
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            background: status === 'pass' ? 'rgba(79,227,193,0.08)' : 'rgba(255,45,120,0.08)',
            border: `1px solid ${status === 'pass' ? 'rgba(79,227,193,0.3)' : 'rgba(255,45,120,0.3)'}`,
            color: status === 'pass' ? '#4fe3c1' : '#ff7a7a',
          }}
        >
          {status === 'pass' ? '> TASK CLEARED — ' : '> '}
          {output}
        </div>
      )}
    </div>
  )
}

export default function StoryRunScreen({ node, onComplete, onExit }: Props) {
  const canvasRef = useRef<SideViewCanvasHandle>(null)
  const [phase, setPhase] = useState<Phase>('dialogue')
  const [queue, setQueue] = useState<StoryTask[]>(() => shuffle(getStoryTasks(node.id)))
  const [taskIndex, setTaskIndex] = useState(0)
  const [taskState, setTaskState] = useState<'idle' | 'solved'>('idle')
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
  const failedOnce = useRef(new Set<string>())

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

  const task = queue[taskIndex]

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
    setScore(scoreRef.current)
    setPhase('complete')
    onCompleteRef.current(stars, scoreRef.current)
  }, [])

  const advance = useCallback(() => {
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current)
      feedbackTimer.current = null
    }
    const next = taskIndex + 1
    setTaskState('idle')
    if (next >= queueRef.current.length) {
      finishCleared()
    } else {
      setTaskIndex(next)
      canvasRef.current?.pause(false)
      setPhase('play')
    }
  }, [taskIndex, finishCleared])

  const handleSolved = useCallback(() => {
    if (taskState !== 'idle') return
    setTaskState('solved')
    const gained = SCORE_PER_TASK * (hudRef.current?.multiplier ?? 1)
    canvasRef.current?.applyAnswer(true)
    setScore((s) => s + gained)
    setPhase('feedback')
    feedbackTimer.current = window.setTimeout(advance, FEEDBACK_MS)
  }, [taskState, advance])

  const handleFailed = useCallback(() => {
    const id = queueRef.current[taskIndex]?.id
    if (id && !failedOnce.current.has(id)) {
      failedOnce.current.add(id)
      canvasRef.current?.applyDamage(1)
    }
  }, [taskIndex])

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
    setQueue(shuffle(getStoryTasks(nodeRef.current.id)))
    setTaskIndex(0)
    setTaskState('idle')
    setScore(0)
    failedOnce.current = new Set()
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
              TASK{' '}
              {Math.min(
                taskIndex + (phase === 'question' || phase === 'feedback' ? 1 : 0),
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
            flex: '0 1 380px',
            minWidth: 300,
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
              Run the pipe. The next terminal activates as you progress.
              <div style={{ marginTop: 6, color: node.accent, fontSize: 10, letterSpacing: 2 }}>
                [A/D or \u2190/\u2192 move — SPACE jump]
              </div>
            </div>
          )}

          {(phase === 'question' || phase === 'feedback') && task && (
            <TaskPanel
              key={task.id}
              task={task}
              accent={node.accent}
              onSolved={handleSolved}
              onFailed={handleFailed}
              failedBefore={failedOnce.current.has(task.id)}
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
              Task cleared. Moving on...
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
