import { useState, useEffect } from 'react'
import { HUDData } from '../game/types'

interface Props extends HUDData {}

function useViewport() {
  const [vw, setVw] = useState(window.innerWidth)
  useEffect(() => {
    function handleResize() {
      setVw(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return vw
}

export default function HUD({ score, gap, speed, streak }: Props) {
  const vw = useViewport()
  const isMobile = vw < 480

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isMobile ? '6px 10px' : '8px 16px',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 100%)',
    zIndex: 50,
    pointerEvents: 'none',
    gap: isMobile ? 4 : 8,
  }

  const scoreStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1,
    minWidth: isMobile ? 50 : 70,
  }

  const scoreLabelStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.45)',
    fontSize: isMobile ? 8 : 10,
    fontFamily: 'monospace',
    letterSpacing: 1,
  }

  const scoreValueStyle: React.CSSProperties = {
    color: '#fff',
    fontSize: isMobile ? 16 : 20,
    fontWeight: 700,
    fontFamily: 'monospace',
  }

  const gapBarStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: isMobile ? 160 : 280,
    height: isMobile ? 5 : 6,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  }

  const gapFillStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    background: gap > 50 ? '#4CAF50' : gap > 25 ? '#FFA000' : '#D32F2F',
    borderRadius: 3,
    transition: 'width 0.3s ease, background 0.3s ease',
    width: `${Math.max(2, gap)}%`,
  }

  const rightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? 6 : 12,
  }

  const statBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 1,
  }

  const statLabelStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.45)',
    fontSize: isMobile ? 7 : 10,
    fontFamily: 'monospace',
    letterSpacing: 1,
  }

  const statValueStyle: React.CSSProperties = {
    color: '#4FC3F7',
    fontSize: isMobile ? 12 : 16,
    fontWeight: 700,
    fontFamily: 'monospace',
  }

  return (
    <div style={containerStyle}>
      <div style={scoreStyle}>
        <span style={scoreLabelStyle}>SCORE</span>
        <span style={scoreValueStyle}>{score.toLocaleString()}</span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ ...gapBarStyle }}>
          <div style={gapFillStyle} />
          {!isMobile && (
            <span style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 8,
              fontFamily: 'monospace',
              fontWeight: 600,
            }}>
              {gap}m
            </span>
          )}
        </div>
      </div>

      <div style={rightStyle}>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>SPD</span>
          <span style={statValueStyle}>{speed}x</span>
        </div>
        {streak > 0 && (
          <span style={{
            fontSize: isMobile ? 12 : 14,
            fontFamily: 'monospace',
            color: '#FFD700',
            fontWeight: 700,
          }}>
            🔥{streak}
          </span>
        )}
      </div>
    </div>
  )
}
