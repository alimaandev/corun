import { HUDData } from '../game/types'

interface Props extends HUDData {
  isBoss?: boolean
  isBonus?: boolean
}

export default function HUD({ score, gap, speed, streak, isBoss, isBonus }: Props) {
  const barColor = gap > 40 ? '#4CAF50' : gap > 20 ? '#FFA000' : '#F44336'

  return (
    <div style={{ ...styles.bar,
      borderBottomColor: isBoss ? 'rgba(244,67,54,0.4)' : isBonus ? 'rgba(255,215,0,0.4)' : 'rgba(79,195,247,0.2)',
    }}>
      <div style={styles.left}>
        <div style={styles.lLabel}>SCORE</div>
        <div style={styles.lVal}>{score.toLocaleString()}</div>
        {streak >= 3 && (
          <div style={styles.streakBadge}>
            <span style={styles.star}>★</span>
            <span style={styles.sNum}>{streak}x</span>
          </div>
        )}
      </div>

      <div style={styles.center}>
        <div style={styles.gapLabel}>GAP</div>
        <div style={styles.track}>
          <div style={{ ...styles.fill, width: `${Math.max(2, gap)}%`, background: barColor,
            boxShadow: gap < 20 ? `0 0 8px ${barColor}` : 'none' }} />
        </div>
        <div style={styles.gapNum}>{Math.round(gap)}m</div>
      </div>

      <div style={styles.right}>
        <div style={styles.stat}>
          <div style={styles.sLabel}>SPD</div>
          <div style={{ ...styles.sVal, color: speed > 1.3 ? '#4CAF50' : speed < 0.8 ? '#F44336' : '#4FC3F7' }}>
            {speed.toFixed(1)}x
          </div>
        </div>
        <div style={styles.stat}>
          <div style={styles.sLabel}>MULT</div>
          <div style={styles.sVal}>{streak >= 3 ? `${1 + Math.floor(streak / 2) * 0.5}x` : '1x'}</div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 8, padding: '6px 10px',
    background: 'rgba(0,0,0,0.75)',
    borderBottom: '3px solid rgba(79,195,247,0.2)',
    pointerEvents: 'none',
  },
  left: { display: 'flex', flexDirection: 'column', gap: 0, minWidth: 60, position: 'relative' as const },
  lLabel: { color: '#888', fontSize: 7, fontFamily: "'Press Start 2P', monospace", letterSpacing: 2 },
  lVal: { color: '#fff', fontSize: 16, fontWeight: 700, lineHeight: 1.2, fontFamily: "'Press Start 2P', monospace", letterSpacing: 1 },
  streakBadge: {
    position: 'absolute' as const, top: -2, right: -4,
    display: 'flex', alignItems: 'center', gap: 1,
    padding: '1px 3px',
    border: '2px solid rgba(255,215,0,0.15)',
    background: 'rgba(255,215,0,0.04)',
  },
  star: { color: '#FFD700', fontSize: 8 },
  sNum: { color: '#FFD700', fontSize: 7, fontFamily: "'Press Start 2P', monospace" },
  center: {
    flex: 1, maxWidth: 200,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 1,
  },
  gapLabel: { color: '#888', fontSize: 7, fontFamily: "'Press Start 2P', monospace", letterSpacing: 2 },
  track: { width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.05)' },
  fill: { height: '100%', transition: 'width 0.3s ease, background 0.3s ease' },
  gapNum: { color: '#888', fontSize: 7, fontFamily: "'Press Start 2P', monospace" },
  right: { display: 'flex', alignItems: 'center', gap: 6 },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0, minWidth: 36 },
  sLabel: { color: '#888', fontSize: 7, fontFamily: "'Press Start 2P', monospace", letterSpacing: 2 },
  sVal: { fontSize: 10, fontWeight: 700, fontFamily: "'Press Start 2P', monospace", letterSpacing: 1 },
}
