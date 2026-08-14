import { useCallback, useRef, useState } from 'react'
import {
  SideHudSnapshot,
  SideViewCanvas,
  SideViewCanvasHandle,
} from '../game/sideView/SideViewCanvas'
import { SideEvent, SideSimState } from '../game/engine/side/types'
import { colors, fonts } from '../lib/theme'

function Chips({ hud }: { hud: SideHudSnapshot }) {
  const hearts = Array.from({ length: Math.max(0, hud.hp) }, (_, i) => (
    <span key={i} style={{ color: '#ff2d78' }}>
      &#x2665;
    </span>
  ))
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        pointerEvents: 'none',
        fontFamily: fonts.mono,
        fontSize: 13,
        color: colors.fg,
      }}
    >
      <span>
        SCORE <b style={{ color: colors.accent }}>{hud.score}</b>
      </span>
      <span>HP {hearts}</span>
      <span>
        COINS <b style={{ color: '#ffd700' }}>{hud.coins}</b>
      </span>
      <span>TIME {hud.time.toFixed(1)}s</span>
      <span>
        COMBO <b style={{ color: hud.fire ? '#ff2d78' : '#4fe3c1' }}>{hud.streak}</b> x
        {hud.multiplier}
        {hud.fire ? ' FIRE' : ''}
      </span>
      <span style={{ marginLeft: 'auto', color: '#888' }}>
        X:{hud.x} {hud.phase}
      </span>
    </div>
  )
}

export default function SidePlayground() {
  const canvasRef = useRef<SideViewCanvasHandle>(null)
  const [hud, setHud] = useState<SideHudSnapshot | null>(null)
  const [hitboxes, setHitboxes] = useState(false)
  const [lastEvent, setLastEvent] = useState<string>('')
  const [complete, setComplete] = useState(false)

  const handleEvent = useCallback((event: SideEvent, _state: SideSimState) => {
    setLastEvent(event.type)
    if (event.type === 'levelComplete') setComplete(true)
    if (event.type === 'die') setComplete(false)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#05030f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        zIndex: 300,
      }}
    >
      <div
        style={{
          width: 'min(95vw, calc(95vh * 16 / 9))',
          aspectRatio: '16 / 9',
          border: `1px solid ${colors.border}`,
          boxShadow: `0 0 40px rgba(255,45,120,0.15)`,
          position: 'relative',
        }}
      >
        <SideViewCanvas
          ref={canvasRef}
          showHitboxes={hitboxes}
          onEvent={handleEvent}
          onHud={setHud}
        />
        {hud && <Chips hud={hud} />}
        {lastEvent && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 12,
              fontFamily: fonts.mono,
              fontSize: 11,
              color: '#888',
              pointerEvents: 'none',
            }}
          >
            last event: {lastEvent}
          </div>
        )}
        {complete && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              background: 'rgba(5,3,15,0.7)',
              fontFamily: fonts.heading,
              color: '#4fe3c1',
              fontSize: 32,
              letterSpacing: 3,
            }}
          >
            LEVEL COMPLETE
            <button
              onClick={() => {
                setComplete(false)
                canvasRef.current?.restart()
              }}
              style={{
                background: colors.accent,
                color: '#05030f',
                border: 'none',
                padding: '8px 18px',
                fontFamily: fonts.heading,
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              RUN AGAIN
            </button>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => canvasRef.current?.restart()} style={btnStyle}>
          RESTART
        </button>
        <button onClick={() => setHitboxes((v) => !v)} style={btnStyle}>
          HITBOXES {hitboxes ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => {
            location.hash = ''
            setComplete(false)
          }}
          style={btnStyle}
        >
          EXIT
        </button>
      </div>
      <div style={{ fontFamily: fonts.mono, fontSize: 11, color: '#666' }}>
        [A/D or Arrow keys] move [SPACE / W / Up] jump [S / Down] dodge-hold [touch] swipe halves,
        tap = jump
      </div>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  background: 'transparent',
  color: colors.fg,
  border: `1px solid ${colors.border}`,
  padding: '6px 16px',
  fontFamily: fonts.heading,
  fontSize: 13,
  cursor: 'pointer',
  letterSpacing: 1,
}
