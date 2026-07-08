interface Props {
  highScore: number
  onStart: () => void
}

export default function StartScreen({ highScore, onStart }: Props) {
  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.titleRow}>
          <span style={styles.emoji}>🏃</span>
          <h1 style={styles.title}>Code Run</h1>
          <span style={styles.emoji}>👾</span>
        </div>
        <p style={styles.subtitle}>Escape the Monster</p>

        <div style={styles.divider} />

        <div style={styles.instructions}>
          <div style={styles.instruction}>
            <span style={styles.instrIcon}>⚡</span>
            <span>Coding challenges appear &mdash; answer correctly to speed up!</span>
          </div>
          <div style={styles.instruction}>
            <span style={styles.instrIcon}>🐢</span>
            <span>Wrong or too slow &mdash; the monster gets closer!</span>
          </div>
          <div style={styles.instruction}>
            <span style={styles.instrIcon}>🔥</span>
            <span>Build streaks for bonus speed!</span>
          </div>
        </div>

        <button style={styles.startBtn} onClick={onStart}>
          START RUNNING
        </button>

        <p style={styles.hint}>Press <kbd style={styles.kbd}>Enter</kbd> or tap to start</p>

        {highScore > 0 && (
          <p style={styles.highScore}>🏆 High Score: {highScore.toLocaleString()}</p>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(ellipse at center, #0d0d2b 0%, #050510 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: 20,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 420,
    width: '100%',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 40,
    lineHeight: 1,
  },
  title: {
    color: '#4FC3F7',
    fontSize: 48,
    fontWeight: 800,
    fontFamily: 'monospace',
    textShadow: '0 0 30px rgba(79,195,247,0.3)',
    letterSpacing: 2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontFamily: 'monospace',
    marginTop: 4,
    letterSpacing: 4,
    textTransform: 'uppercase' as const,
  },
  divider: {
    width: '60%',
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(79,195,247,0.3), transparent)',
    margin: '24px 0',
  },
  instructions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    width: '100%',
    marginBottom: 28,
  },
  instruction: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontFamily: 'monospace',
    lineHeight: 1.4,
  },
  instrIcon: {
    fontSize: 18,
    flexShrink: 0,
  },
  startBtn: {
    padding: '14px 48px',
    borderRadius: 10,
    border: '2px solid #4FC3F7',
    background: 'linear-gradient(135deg, rgba(79,195,247,0.15), rgba(21,101,192,0.15))',
    color: '#4FC3F7',
    fontSize: 18,
    fontWeight: 700,
    fontFamily: 'monospace',
    cursor: 'pointer',
    letterSpacing: 2,
    transition: 'all 0.2s',
    textShadow: '0 0 10px rgba(79,195,247,0.3)',
    boxShadow: '0 0 20px rgba(79,195,247,0.1)',
  },
  hint: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 16,
  },
  kbd: {
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 4,
    padding: '1px 6px',
    fontSize: 11,
    fontFamily: 'monospace',
    background: 'rgba(255,255,255,0.05)',
  },
  highScore: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'monospace',
    marginTop: 12,
  },
}
