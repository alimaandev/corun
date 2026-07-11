import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Difficulty, Topic } from '../game/types'
import { TOPICS, isDailyCompleted, getLeaderboard } from '../game/challenges'

interface Props {
  highScore: number
  onStart: (topic: Topic | null, difficulty: Difficulty, isDaily?: boolean) => void
  onStoryMode?: () => void
}

const difficulties: { id: Difficulty; label: string; color: string }[] = [
  { id: 'easy', label: 'Easy', color: '#4CAF50' },
  { id: 'medium', label: 'Medium', color: '#FFA000' },
  { id: 'hard', label: 'Hard', color: '#F44336' },
]

const mono = "'Press Start 2P', monospace"
const sans = "'JetBrains Mono', 'Inter', monospace"

export default function StartScreen({ highScore, onStart, onStoryMode }: Props) {
  const { user, logout } = useAuth0()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [diff, setDiff] = useState<Difficulty>('medium')
  const dailyDone = isDailyCompleted()
  const lb = getLeaderboard()
  const [m, setM] = useState(false)

  useEffect(() => {
    const check = () => setM(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#0a0a1a',
      display: 'grid', gridTemplateRows: 'auto 1fr auto',
      padding: m ? '0 16px' : '0 48px',
      overflow: 'auto',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ color: '#fff', fontSize: m ? 12 : 14, fontFamily: sans }}>
          {user?.nickname || user?.name || 'player'}
        </span>
        <button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent',
            color: '#fff', fontSize: m ? 11 : 13,
            padding: m ? '4px 12px' : '6px 16px',
            cursor: 'pointer', fontFamily: sans,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >Logout</button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: m ? 'column' : 'row',
        gap: m ? 24 : 64,
        alignItems: m ? 'stretch' : 'center',
        justifyContent: 'center',
        padding: m ? '16px 0' : 0,
        minHeight: 0,
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: m ? 20 : 32,
          flexShrink: 0,
          textAlign: m ? 'center' : 'left',
          alignItems: m ? 'center' : 'flex-start',
        }}>
          <div>
            <div style={{
              color: '#4FC3F7',
              fontSize: m ? 32 : 56,
              fontFamily: mono,
              letterSpacing: m ? 2 : 4,
              lineHeight: 1.2,
            }}>
              CORUN
            </div>
            <div style={{
              color: '#555',
              fontSize: m ? 13 : 16,
              fontFamily: sans, marginTop: 6,
            }}>
              Escape the Monster
            </div>
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            width: m ? '100%' : 'auto',
          }}>
            <button
              onClick={() => onStoryMode?.()}
              style={{
                border: '2px solid rgba(79,195,247,0.3)',
                background: 'rgba(79,195,247,0.06)',
                color: '#4FC3F7',
                fontSize: m ? 13 : 15,
                padding: m ? '10px 20px' : '12px 24px',
                cursor: 'pointer',
                fontFamily: mono,
                letterSpacing: 3,
                textAlign: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,195,247,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79,195,247,0.06)' }}
            >
              ⚔  STORY MODE
            </button>
            <button
              onClick={() => onStart(null, 'medium', true)}
              disabled={dailyDone}
              style={{
                border: '1px solid rgba(255,215,0,0.3)',
                background: 'rgba(255,215,0,0.04)',
                color: dailyDone ? '#333' : '#FFD700',
                fontSize: m ? 12 : 14,
                padding: m ? '7px 16px' : '8px 20px',
                cursor: dailyDone ? 'default' : 'pointer',
                fontFamily: sans,
                opacity: dailyDone ? 0.5 : 1,
                textAlign: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!dailyDone) e.currentTarget.style.background = 'rgba(255,215,0,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.04)' }}
            >
              {dailyDone ? 'Daily Challenge — Completed' : '☀ Daily Challenge'}
            </button>

            <button
              onClick={() => onStart(topic, diff)}
              style={{
                border: '2px solid #4FC3F7',
                background: '#4FC3F7',
                color: '#0a0a1a',
                fontSize: m ? 15 : 18,
                padding: m ? '12px 20px' : '14px 24px',
                cursor: 'pointer',
                fontFamily: mono,
                letterSpacing: 2,
                fontWeight: 700,
                transition: 'all 0.15s',
                textAlign: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#6dd5ff' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#4FC3F7' }}
            >
              ▶  START GAME
            </button>

            {highScore > 0 && (
              <div style={{ color: '#FFD700', fontSize: m ? 12 : 14, fontFamily: sans, textAlign: 'center' }}>
                ★ Best: {highScore.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: m ? 16 : 24,
          width: m ? '100%' : 'auto',
        }}>
          <div>
            <div style={{ color: '#888', fontSize: m ? 10 : 12, fontFamily: sans, marginBottom: 6, letterSpacing: 1 }}>
              SUBJECT
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              <button
                onClick={() => setTopic(null)}
                style={{
                  padding: m ? '6px 14px' : '8px 18px', border: '2px solid', cursor: 'pointer',
                  fontSize: m ? 11 : 13, fontFamily: sans, transition: 'all 0.15s',
                  borderColor: topic === null ? '#4FC3F7' : 'rgba(255,255,255,0.08)',
                  background: topic === null ? 'rgba(79,195,247,0.1)' : 'transparent',
                  color: topic === null ? '#4FC3F7' : '#666',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#4FC3F7'; e.currentTarget.style.color = '#4FC3F7' }}
                onMouseLeave={e => { if (topic !== null) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#666' } }}
              >All</button>
              {TOPICS.map(t => {
                const sel = topic === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setTopic(t.id)}
                    style={{
                      padding: m ? '6px 14px' : '8px 18px', border: '2px solid', cursor: 'pointer',
                      fontSize: m ? 11 : 13, fontFamily: sans, transition: 'all 0.15s',
                      borderColor: sel ? '#4FC3F7' : 'rgba(255,255,255,0.08)',
                      background: sel ? 'rgba(79,195,247,0.1)' : 'transparent',
                      color: sel ? '#4FC3F7' : '#666',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#4FC3F7'; e.currentTarget.style.color = '#4FC3F7' }}
                    onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#666' } }}
                  >{t.label}</button>
                )
              })}
            </div>
          </div>

          <div>
            <div style={{ color: '#888', fontSize: m ? 10 : 12, fontFamily: sans, marginBottom: 6, letterSpacing: 1 }}>
              DIFFICULTY
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {difficulties.map(d => {
                const sel = diff === d.id
                return (
                  <button
                    key={d.id}
                    onClick={() => setDiff(d.id)}
                    style={{
                      flex: 1, padding: m ? '8px 10px' : '10px 18px', border: '2px solid', cursor: 'pointer',
                      fontSize: m ? 12 : 14, fontFamily: sans, fontWeight: 600,
                      transition: 'all 0.15s',
                      borderColor: sel ? d.color : 'rgba(255,255,255,0.08)',
                      background: sel ? `${d.color}15` : 'transparent',
                      color: sel ? d.color : '#666',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = d.color; e.currentTarget.style.color = d.color }}
                    onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#666' } }}
                  >{d.label}</button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {lb.length > 0 && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          padding: m ? '10px 0' : '12px 0',
          display: 'flex', gap: m ? 8 : 16,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <span style={{ color: '#555', fontSize: m ? 10 : 12, fontFamily: sans, letterSpacing: 1 }}>
            LEADERBOARD
          </span>
          {lb.slice(0, 5).map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{
                color: i === 0 ? '#FFD700' : i === 1 ? '#aaa' : i === 2 ? '#CD7F32' : '#444',
                fontSize: m ? 10 : 11, fontFamily: sans,
              }}>
                {i + 1}
              </span>
              <span style={{ color: '#eee', fontSize: m ? 11 : 12, fontFamily: sans }}>
                {e.score.toLocaleString()}
              </span>
              <span style={{ color: '#444', fontSize: m ? 9 : 11, fontFamily: sans }}>
                {e.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
