import { useState } from 'react'
import { HUDData } from '../game/types'
import { isMuted, toggleMute } from '../game/audio'
import { colors, fonts, alpha } from '../lib/theme'

interface Props extends HUDData {
  isBoss?: boolean
  isBonus?: boolean
  speedRunTime?: number
  survivalLives?: number
}

export default function HUD({ score, gap, streak, isBoss, speedRunTime, survivalLives }: Props) {
  const [muted, setMuted] = useState(isMuted())
  const [showKeys, setShowKeys] = useState(false)
  const barColor = gap > 40 ? colors.accent : gap > 20 ? colors.fg : alpha(0.4)

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
          borderBottom: `1px solid ${alpha(0.08)}`,
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0 }}>
          <div
            style={{
              color: alpha(0.5),
              fontSize: 11,
              fontFamily: fonts.body,
              fontWeight: 300,
              letterSpacing: 1,
            }}
          >
            SCORE
          </div>
          <div
            style={{
              color: colors.fg,
              fontSize: 15,
              fontWeight: 700,
              lineHeight: 1.1,
              fontFamily: fonts.mono,
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
              border: `1px solid ${alpha(0.15)}`,
              background: alpha(0.04),
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span style={{ color: colors.accent, fontSize: 9 }}>★</span>
            <span style={{ color: colors.fg, fontSize: 10, fontFamily: fonts.mono }}>
              {streak}x
            </span>
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
              color: alpha(0.5),
              fontSize: 11,
              fontFamily: fonts.body,
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
              background: alpha(0.08),
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
          <div style={{ color: alpha(0.5), fontSize: 11, fontFamily: fonts.mono }}>
            {Math.round(gap)}m
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {speedRunTime !== undefined && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div
                style={{
                  color: alpha(0.5),
                  fontSize: 11,
                  fontFamily: fonts.body,
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
                  fontFamily: fonts.mono,
                  color: speedRunTime <= 10 ? colors.danger : colors.fg,
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
                  color: alpha(0.5),
                  fontSize: 11,
                  fontFamily: fonts.body,
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
                  fontFamily: fonts.mono,
                  color: survivalLives <= 1 ? colors.danger : colors.fg,
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
                  color: alpha(0.5),
                  fontSize: 11,
                  fontFamily: fonts.body,
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
                  fontFamily: fonts.mono,
                  color: streak >= 3 ? colors.accent : alpha(0.4),
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
              color: muted ? alpha(0.25) : alpha(0.6),
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
              background: showKeys ? alpha(0.1) : 'none',
              border: 'none',
              cursor: 'pointer',
              pointerEvents: 'auto',
              color: showKeys ? colors.fg : alpha(0.35),
              fontSize: 11,
              fontFamily: fonts.mono,
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
            border: `1px solid ${alpha(0.1)}`,
            borderRadius: 8,
            padding: 16,
            fontFamily: fonts.body,
            fontSize: 10,
            color: colors.fg,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 220,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontFamily: fonts.heading,
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
              <span style={{ color: alpha(0.4) }}>{k}</span>
              <span>{d}</span>
            </div>
          ))}
          <div style={{ fontSize: 9, color: alpha(0.2), marginTop: 4, textAlign: 'center' }}>
            Click ? again to close
          </div>
        </div>
      )}
    </>
  )
}
