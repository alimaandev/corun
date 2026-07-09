import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Difficulty, Topic } from '../game/types'
import { TOPICS, isDailyCompleted, getLeaderboard } from '../game/challenges'

interface Props {
  highScore: number
  onStart: (topic: Topic | null, difficulty: Difficulty, isDaily?: boolean) => void
}

const difficulties: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'EASY' },
  { id: 'medium', label: 'MEDIUM' },
  { id: 'hard', label: 'HARD' },
]

const diffColors: Record<string, string> = {
  easy: '#4CAF50',
  medium: '#FFA000',
  hard: '#F44336',
}

export default function StartScreen({ highScore, onStart }: Props) {
  const { user, logout } = useAuth0()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [diff, setDiff] = useState<Difficulty>('medium')
  const dailyDone = isDailyCompleted()
  const lb = getLeaderboard()

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <div style={styles.titleBlock}>
          <div className="screen-title" style={styles.pixelTitle}>CODE RUN</div>
          <div style={styles.pixelSub}>ESCAPE THE MONSTER</div>
        </div>

        <div style={styles.userBar}>
          <span style={styles.userName}>@{user?.nickname || user?.name || 'PLAYER'}</span>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} style={styles.logoutBtn}>✕ LOGOUT</button>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>SUBJECT</div>
          <div className="topic-grid" style={styles.topics}>
            <button
              onClick={() => setTopic(null)}
              style={{
                ...styles.topicBtn,
                borderColor: topic === null ? '#4FC3F7' : '#3a3a3a',
                background: topic === null ? '#1a2a3a' : '#111',
                color: topic === null ? '#4FC3F7' : '#555',
              }}
            >ALL</button>
            {TOPICS.map(t => (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                style={{
                  ...styles.topicBtn,
                  borderColor: topic === t.id ? '#4FC3F7' : '#3a3a3a',
                  background: topic === t.id ? '#1a2a3a' : '#111',
                  color: topic === t.id ? '#4FC3F7' : '#555',
                }}
              >{t.label.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>DIFFICULTY</div>
          <div style={styles.diffs}>
            {difficulties.map(d => (
              <button
                key={d.id}
                onClick={() => setDiff(d.id)}
                style={{
                  ...styles.diffBtn,
                  borderColor: diff === d.id ? diffColors[d.id] : '#3a3a3a',
                  background: diff === d.id ? '#1a1a1a' : '#111',
                  color: diff === d.id ? diffColors[d.id] : '#555',
                }}
              >{d.label}</button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart(null, 'medium', true)}
          disabled={dailyDone}
          style={{
            ...styles.dailyBtn,
            opacity: dailyDone ? 0.4 : 1,
            borderColor: dailyDone ? '#3a3a3a' : '#FFD700',
            color: dailyDone ? '#555' : '#FFD700',
            cursor: dailyDone ? 'default' : 'pointer',
          }}
        >
          {dailyDone ? '✓ DAILY DONE' : '☀ DAILY CHALLENGE'}
        </button>

        <button onClick={() => onStart(topic, diff)} style={styles.startBtn}>
          ▶ START GAME
        </button>

        <div style={styles.hint}>PRESS ENTER</div>

        {highScore > 0 && (
          <div style={styles.best}>
            ★ BEST: {highScore.toLocaleString()}
          </div>
        )}

        {lb.length > 0 && (
          <div style={styles.lbSection}>
            <div style={styles.sectionLabel}>LEADERBOARD</div>
            {lb.slice(0, 5).map((e, i) => (
              <div key={i} style={styles.lbRow}>
                <span style={styles.lbRank}>{i + 1}</span>
                <span style={styles.lbScore}>{e.score.toLocaleString()}</span>
                <span style={styles.lbDate}>{e.date}</span>
              </div>
            ))}
          </div>
        )}
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
    position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    maxWidth: 440, width: '100%',
    maxHeight: '95vh',
    overflowY: 'auto',
    animation: 'fadeIn 0.3s ease-out',
    background: 'rgba(0,0,0,0.75)',
    border: '4px solid rgba(79,195,247,0.3)',
    borderRadius: 0,
    padding: '28px 24px 24px',
  },
  titleBlock: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    marginBottom: 20,
  },
  pixelTitle: {
    color: '#4FC3F7',
    fontSize: 38,
    fontWeight: 900,
    letterSpacing: 6,
    fontFamily: "'Press Start 2P', monospace",
    lineHeight: 1.4,
    textShadow: '3px 3px 0 #1a3a4a',
  },
  pixelSub: {
    color: '#888',
    fontSize: 9,
    letterSpacing: 4,
    fontFamily: "'Press Start 2P', monospace",
    marginTop: 6,
  },
  section: {
    width: '100%', marginBottom: 14,
  },
  sectionLabel: {
    color: '#aaa', fontSize: 9,
    fontWeight: 700, letterSpacing: 3,
    marginBottom: 6,
    fontFamily: "'Press Start 2P', monospace",
  },
  topics: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: 4,
  },
  topicBtn: {
    padding: '8px 4px',
    border: '3px solid',
    fontSize: 9,
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'center' as const,
    transition: 'all 0.1s',
    fontFamily: "'Press Start 2P', monospace",
    letterSpacing: 1,
  },
  diffs: {
    display: 'flex', gap: 4,
  },
  diffBtn: {
    flex: 1,
    padding: '10px 12px',
    border: '3px solid',
    fontSize: 10,
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'center' as const,
    transition: 'all 0.1s',
    fontFamily: "'Press Start 2P', monospace",
    letterSpacing: 2,
  },
  dailyBtn: {
    padding: '8px 24px',
    border: '3px solid',
    background: '#1a1a00',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2,
    transition: 'all 0.1s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
    fontFamily: "'Press Start 2P', monospace",
  },
  startBtn: {
    padding: '12px 48px',
    border: '4px solid rgba(79,195,247,0.5)',
    background: '#1a2a3a',
    color: '#4FC3F7',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: 4,
    transition: 'all 0.1s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginTop: 6,
    fontFamily: "'Press Start 2P', monospace",
  },
  lbSection: {
    width: '100%', marginTop: 10,
  },
  lbRow: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '2px 0',
    fontSize: 8,
    fontFamily: "'Press Start 2P', monospace",
  },
  lbRank: { color: '#666', width: 14, textAlign: 'right' as const },
  lbScore: { color: '#FFD700', flex: 1, textAlign: 'right' as const },
  lbDate: { color: '#444', fontSize: 7 },
  hint: {
    color: '#444',
    fontSize: 8,
    marginTop: 10,
    fontFamily: "'Press Start 2P', monospace",
    letterSpacing: 2,
  },
  userBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginBottom: 12, width: '100%',
  },
  userName: {
    color: '#aaa', fontSize: 9,
    fontFamily: "'Press Start 2P', monospace", letterSpacing: 1,
  },
  logoutBtn: {
    border: '3px solid #3a3a3a', background: '#111',
    color: '#666', fontSize: 8, padding: '4px 10px',
    fontFamily: "'Press Start 2P', monospace", cursor: 'pointer',
    transition: 'all 0.1s',
  },
  best: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 700,
    marginTop: 8,
    fontFamily: "'Press Start 2P', monospace",
    letterSpacing: 1,
  },
}
