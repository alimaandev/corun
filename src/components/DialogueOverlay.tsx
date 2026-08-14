import { useEffect, useMemo, useRef, useState } from 'react'
import {
  advanceDialogue,
  createDialogue,
  currentLine,
  dialogueProgress,
  lineRevealed,
  updateDialogue,
} from '../game/engine/story/dialogue'
import { StoryLine } from '../game/engine/story/levels'
import { colors, fonts } from '../lib/theme'

interface Props {
  lines: StoryLine[]
  accent: string
  onDone: () => void
}

export default function DialogueOverlay({ lines, accent, onDone }: Props) {
  const [state, setState] = useState(() => createDialogue(lines.map((l) => l.text)))
  const [revealed, setRevealed] = useState(false)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    setState(createDialogue(lines.map((l) => l.text)))
  }, [lines])

  useEffect(() => {
    setRevealed(lineRevealed(state))
  }, [state])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((s) => updateDialogue(s, 1 / 30))
    }, 1000 / 30)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (state.finished) onDoneRef.current()
  }, [state.finished])

  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        setState((s) => advanceDialogue(s))
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [])

  const speaker = lines[state.lineIndex]?.speaker ?? ''
  const text = useMemo(() => currentLine(state), [state])
  const progress = dialogueProgress(state)

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5,3,15,0.92)',
        borderTop: `2px solid ${accent}`,
        padding: '10px 14px 12px',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 6,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            background: accent,
            color: '#05030f',
            fontFamily: fonts.heading,
            fontSize: 13,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
          }}
        >
          {speaker[0] ?? '?'}
        </div>
        <span
          style={{
            color: accent,
            fontSize: 10,
            letterSpacing: 3,
            fontFamily: fonts.heading,
            fontWeight: 700,
          }}
        >
          {speaker}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            color: colors.fg,
            fontFamily: fonts.mono,
            fontSize: 10,
            opacity: 0.6,
          }}
        >
          {revealed ? '[SPACE]' : ''}
        </span>
      </div>
      <div
        style={{
          color: colors.fg,
          fontFamily: fonts.body,
          fontSize: 13,
          lineHeight: 1.5,
          minHeight: 40,
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
        {!revealed && <span style={{ color: accent }}>&#x2588;</span>}
      </div>
      <div
        style={{
          height: 2,
          background: 'rgba(255,255,255,0.08)',
          marginTop: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: accent,
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </div>
  )
}
