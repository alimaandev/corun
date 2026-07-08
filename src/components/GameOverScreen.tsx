interface Props {
  score: number
  highScore: number
  onRestart: () => void
}

export default function GameOverScreen({ score, highScore, onRestart }: Props) {
  const isNewHighScore = score >= highScore && score > 0

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.skull}>💀</div>
        <h2 style={styles.title}>Game Over</h2>
        <p style={styles.subtitle}>The monster caught you!</p>

        <div style={styles.scoreBox}>
          <span style={styles.scoreLabel}>Score</span>
          <span style={styles.scoreValue}>{score.toLocaleString()}</span>
        </div>

        {isNewHighScore && (
          <div style={styles.newHighScore}>🏆 New High Score!</div>
        )}

        <div style={styles.highScoreRow}>
          <span style={styles.highScoreLabel}>Best</span>
          <span style={styles.highScoreValue}>{highScore.toLocaleString()}</span>
        </div>

        <button style={styles.restartBtn} onClick={onRestart}>
          RUN AGAIN
        </button>

        <p style={styles.hint}>Press <kbd style={styles.kbd}>Enter</kbd> to restart</p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(ellipse at center, #1a0000 0%, #050510 100%)',
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
    maxWidth: 360,
    width: '100%',
  },
  skull: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    color: '#F44336',
    fontSize: 36,
    fontWeight: 800,
    fontFamily: 'monospace',
    textShadow: '0 0 30px rgba(244,67,54,0.3)',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 24,
  },
  scoreBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 32px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
    marginBottom: 16,
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    marginBottom: 4,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 800,
    fontFamily: 'monospace',
  },
  newHighScore: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 700,
    marginBottom: 8,
    textShadow: '0 0 20px rgba(255,215,0,0.4)',
  },
  highScoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  highScoreLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  highScoreValue: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 700,
    fontFamily: 'monospace',
  },
  restartBtn: {
    padding: '14px 48px',
    borderRadius: 10,
    border: '2px solid #F44336',
    background: 'linear-gradient(135deg, rgba(244,67,54,0.15), rgba(200,0,0,0.15))',
    color: '#F44336',
    fontSize: 18,
    fontWeight: 700,
    fontFamily: 'monospace',
    cursor: 'pointer',
    letterSpacing: 2,
    transition: 'all 0.2s',
    textShadow: '0 0 10px rgba(244,67,54,0.3)',
    boxShadow: '0 0 20px rgba(244,67,54,0.1)',
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
}
