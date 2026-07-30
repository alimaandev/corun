import { useState } from 'react'
import { HUDData } from '../game/types'
import { isMuted, toggleMute } from '../game/audio'

interface Props extends HUDData {
  isBoss?: boolean
  isBonus?: boolean
  levelName?: string
  speedRunTime?: number
  survivalLives?: number
}

const c = (opacity: number) => `rgba(240,235,227,${opacity})`

export default function HUD({
  score,
  gap,
  streak,
  isBoss,
  levelName,
  speedRunTime,
  survivalLives,
}: Props) {
  const [muted, setMuted] = useState(isMuted())
  const [showKeys, setShowKeys] = useState(false)
  const barColor = gap > 40 ? '#769826' : gap > 20 ? '#F0EBE3' : c(0.4)

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          background: 'rgba(10,10,10,0.85)',
          borderBottom: `1px solid ${c(0.08)}`,
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0 }}>
          <div
            style={{
              color: c(0.5),
              fontSize: 11,
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 300,
              letterSpacing: 1,
            }}
          >
            SCORE
          </div>
          <div
            style={{
              color: '#F0EBE3',
              fontSize: 15,
              fontWeight: 700,
              lineHeight: 1.1,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: 1,
            }}
          >
            {score.toLocaleString()}
          </div>
        </div>

        {streak >= 3 && (
          <div
            style={{
              alignSelf: 'flex-start',
              marginTop: 2,
              padding: '1px 5px',
              border: `1px solid ${c(0.15)}`,
              background: c(0.04),
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span style={{ color: '#769826', fontSize: 9 }}>★</span>
            <span
              style={{ color: '#F0EBE3', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
            >
              {streak}x
            </span>
          </div>
        )}

        {levelName && (
          <div
            style={{
              color: c(0.15),
              fontSize: 11,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              letterSpacing: 1,
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            {levelName}
          </div>
        )}

        <div
          style={{
            flex: 1,
            minWidth: 0,
            maxWidth: 160,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            padding: '0 4px',
          }}
        >
          <div
            style={{
              color: c(0.5),
              fontSize: 11,
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 300,
              letterSpacing: 1,
            }}
          >
            GAP
          </div>
          <div
            style={{
              width: '100%',
              height: 5,
              background: c(0.08),
              overflow: 'hidden',
              borderRadius: 2,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.max(2, gap)}%`,
                background: barColor,
                boxShadow: gap < 20 ? `0 0 8px ${barColor}` : 'none',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          </div>
          <div style={{ color: c(0.5), fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            {Math.round(gap)}m
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {speedRunTime !== undefined && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div
                style={{
                  color: c(0.5),
                  fontSize: 11,
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 300,
                  letterSpacing: 1,
                }}
              >
                TIME
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: speedRunTime <= 10 ? '#ff4444' : '#F0EBE3',
                }}
              >
                {speedRunTime}s
              </div>
            </div>
          )}
          {survivalLives !== undefined && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div
                style={{
                  color: c(0.5),
                  fontSize: 11,
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 300,
                  letterSpacing: 1,
                }}
              >
                LIVES
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: survivalLives <= 1 ? '#ff4444' : '#F0EBE3',
                }}
              >
                {'♥'.repeat(survivalLives)}
                {'♡'.repeat(Math.max(0, 3 - survivalLives))}
              </div>
            </div>
          )}
          {!speedRunTime && survivalLives === undefined && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div
                style={{
                  color: c(0.5),
                  fontSize: 11,
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 300,
                  letterSpacing: 1,
                }}
              >
                STREAK
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: streak >= 3 ? '#769826' : c(0.4),
                }}
              >
                {streak >= 3 ? `${1 + Math.floor(streak / 2) * 0.5}x` : `${streak}`}
              </div>
            </div>
          )}
          <button
            aria-label={muted ? 'Unmute' : 'Mute'}
            onClick={() => setMuted(toggleMute())}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              pointerEvents: 'auto',
              color: muted ? c(0.25) : c(0.6),
              fontSize: 13,
              padding: '2px 4px',
              lineHeight: 1,
            }}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            aria-label="Shortcuts"
            onClick={() => setShowKeys((v) => !v)}
            style={{
              background: showKeys ? c(0.1) : 'none',
              border: 'none',
              cursor: 'pointer',
              pointerEvents: 'auto',
              color: showKeys ? '#F0EBE3' : c(0.35),
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              padding: '2px 5px',
              lineHeight: 1,
              borderRadius: 3,
            }}
          >
            ?
          </button>
        </div>
      </div>

      {showKeys && (
        <div
          style={{
            position: 'fixed',
            zIndex: 100,
            top: 44,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#111',
            border: `1px solid ${c(0.1)}`,
            borderRadius: 8,
            padding: 16,
            fontFamily: "'Roboto', sans-serif",
            fontSize: 10,
            color: '#F0EBE3',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 220,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
              fontSize: 11,
              marginBottom: 4,
              letterSpacing: 1,
            }}
          >
            SHORTCUTS
          </div>
          {[
            ['Enter', 'Restart game'],
            ['Esc', 'Close / Back'],
            ['Ctrl+Enter', 'Run code test'],
          ].map(([k, d]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }}>
              <span style={{ color: c(0.4) }}>{k}</span>
              <span>{d}</span>
            </div>
          ))}
          <div style={{ fontSize: 9, color: c(0.2), marginTop: 4, textAlign: 'center' }}>
            Click ? again to close
          </div>
        </div>
      )}
    </>
  )
}
