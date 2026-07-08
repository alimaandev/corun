import { Topic } from '../game/types'

interface Badge {
  topic: Topic
  label: string
  count: number
}

interface Props {
  score: number
  highScore: number
  onRestart: () => void
  badges?: Badge[]
  clipBlob?: Blob | null
}

const BADGE_LABELS: Record<string, string> = {
  general: 'GENERAL CS',
  javascript: 'JAVASCRIPT',
  python: 'PYTHON',
  web: 'WEB DEV',
  databases: 'DATABASES',
  algorithms: 'ALGORITHMS',
}

const BADGE_COLORS: Record<string, string> = {
  general: '#9C27B0',
  javascript: '#FFA000',
  python: '#4CAF50',
  web: '#4FC3F7',
  databases: '#F44336',
  algorithms: '#00BCD4',
}

export default function GameOverScreen({ score, highScore, onRestart, badges }: Props) {
  const newHigh = score >= highScore && score > 0

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <div style={styles.title}>GAME OVER</div>
        <div style={styles.sub}>THE MONSTER CAUGHT YOU</div>

        <div style={styles.scoreBox}>
          <div style={styles.scoreLabel}>SCORE</div>
          <div style={styles.scoreVal}>{score.toLocaleString()}</div>
        </div>

        {newHigh && (
          <div style={styles.newHigh}>★ NEW HIGH SCORE ★</div>
        )}

        <div style={styles.bestRow}>
          <span style={styles.bestLabel}>BEST</span>
          <span style={styles.bestVal}>{highScore.toLocaleString()}</span>
        </div>

        {badges && badges.length > 0 && (
          <div style={styles.badgeSection}>
            <div style={styles.badgeTitle}>MASTERY BADGES</div>
            <div style={styles.badgeRow}>
              {badges.map(b => (
                <div key={b.topic} style={{ ...styles.badge, borderColor: BADGE_COLORS[b.topic] || '#555' }}>
                  <span style={{ color: BADGE_COLORS[b.topic] || '#555', fontSize: 10 }}>★</span>
                  <span style={styles.badgeText}>{BADGE_LABELS[b.topic] || b.topic}</span>
                  <span style={{ ...styles.badgeCount, color: BADGE_COLORS[b.topic] || '#555' }}>{b.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {clipBlob && (
          <button
            onClick={() => {
              if (navigator.share && clipBlob) {
                navigator.share({
                  title: 'Code Run - My Score!',
                  text: `I scored ${score} points in Code Run! Can you beat me?`,
                  files: [new File([clipBlob], 'code-run-clip.webm', { type: 'video/webm' })],
                }).catch(() => {})
              }
            }}
            style={styles.shareBtn}
          >
            🎬 SHARE CLIP
          </button>
        )}

        <button onClick={onRestart} style={styles.btn}>
          ↻ PLAY AGAIN
        </button>

        <div style={styles.hint}>PRESS ENTER</div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: 'fixed', inset: 0, zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
  },
  content: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    maxWidth: 340, width: '100%',
    animation: 'fadeIn 0.3s ease-out',
    background: 'rgba(0,0,0,0.8)',
    border: '4px solid rgba(244,67,54,0.3)',
    padding: '24px 20px 20px',
    maxHeight: '90vh', overflowY: 'auto' as const,
  },
  title: {
    color: '#F44336', fontSize: 24, fontWeight: 900,
    letterSpacing: 6, fontFamily: "'Press Start 2P', monospace",
    marginBottom: 4, textShadow: '3px 3px 0 #3a1a1a',
  },
  sub: { color: '#666', fontSize: 8, letterSpacing: 3, fontFamily: "'Press Start 2P', monospace", marginBottom: 16 },
  scoreBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '10px 28px',
    border: '3px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
    marginBottom: 8,
    width: '100%', maxWidth: 200,
  },
  scoreLabel: { color: '#888', fontSize: 8, letterSpacing: 3, marginBottom: 4, fontFamily: "'Press Start 2P', monospace" },
  scoreVal: { color: '#fff', fontSize: 34, fontWeight: 700, lineHeight: 1, fontFamily: "'Press Start 2P', monospace", letterSpacing: 2 },
  newHigh: { color: '#FFD700', fontSize: 10, fontFamily: "'Press Start 2P', monospace", letterSpacing: 2, marginBottom: 8, textShadow: '2px 2px 0 #3a3a00' },
  bestRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 },
  bestLabel: { color: '#666', fontSize: 8, fontFamily: "'Press Start 2P', monospace", letterSpacing: 2 },
  bestVal: { color: '#FFD700', fontSize: 12, fontFamily: "'Press Start 2P', monospace", letterSpacing: 1 },
  badgeSection: { width: '100%', marginBottom: 12 },
  badgeTitle: { color: '#888', fontSize: 8, fontFamily: "'Press Start 2P', monospace", letterSpacing: 2, marginBottom: 6, textAlign: 'center' as const },
  badgeRow: { display: 'flex', flexWrap: 'wrap' as const, gap: 4, justifyContent: 'center' },
  badge: {
    display: 'flex', alignItems: 'center', gap: 3,
    padding: '3px 6px',
    border: '2px solid',
    background: 'rgba(255,255,255,0.02)',
  },
  badgeText: { color: '#aaa', fontSize: 7, fontFamily: "'Press Start 2P', monospace", letterSpacing: 1 },
  badgeCount: { fontSize: 7, fontFamily: "'Press Start 2P', monospace" },
  btn: {
    padding: '10px 36px',
    border: '4px solid rgba(244,67,54,0.5)',
    background: '#1a1a1a',
    color: '#F44336', fontSize: 11, fontWeight: 700, cursor: 'pointer',
    letterSpacing: 3, transition: 'all 0.1s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Press Start 2P', monospace",
  },
  hint: { color: '#444', fontSize: 8, marginTop: 8, fontFamily: "'Press Start 2P', monospace", letterSpacing: 2 },
  shareBtn: {
    padding: '8px 24px',
    border: '3px solid rgba(79,195,247,0.4)',
    background: '#1a2a3a',
    color: '#4FC3F7', fontSize: 9, fontWeight: 700, cursor: 'pointer',
    letterSpacing: 2, transition: 'all 0.1s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Press Start 2P', monospace",
    marginBottom: 6,
  },
}
