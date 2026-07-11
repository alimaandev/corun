import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { LevelConfig, LevelProgress } from '../game/types'
import { ALL_LEVELS, getLevelProgress, isLevelUnlocked } from '../game/levels'

interface Props {
  onSelectLevel: (level: LevelConfig) => void
  onBack: () => void
}

const font = "'Press Start 2P', monospace"
const sans = `'JetBrains Mono', 'Inter', monospace`

export default function LevelSelect({ onSelectLevel, onBack }: Props) {
  const { user, logout } = useAuth0()
  const [progress, setProgress] = useState<LevelProgress>(getLevelProgress)
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
      display: 'flex', flexDirection: 'column',
      padding: m ? '0 12px' : '0 32px',
      overflow: 'auto',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent',
          color: '#888', fontSize: m ? 10 : 12,
          padding: m ? '4px 10px' : '6px 14px',
          cursor: 'pointer', fontFamily: sans,
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >◀ BACK</button>
        <span style={{ color: '#fff', fontSize: m ? 11 : 13, fontFamily: sans }}>
          {user?.nickname || user?.name || 'player'}
        </span>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent',
            color: '#fff', fontSize: m ? 10 : 12,
            padding: m ? '4px 10px' : '6px 14px',
            cursor: 'pointer', fontFamily: sans,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >Logout</button>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        flex: 1, padding: m ? '16px 0' : '24px 0',
      }}>
        <div style={{
          color: '#4FC3F7', fontSize: m ? 22 : 28,
          fontFamily: font, letterSpacing: 4,
          marginBottom: 4,
        }}>STORY MODE</div>
        <div style={{
          color: '#555', fontSize: m ? 10 : 12,
          fontFamily: sans, marginBottom: m ? 16 : 24,
        }}>Escape. Fight. Rescue.</div>

        <div style={{
          display: 'flex', justifyContent: 'center', gap: m ? 8 : 12,
          flexWrap: 'wrap', width: '100%',
          maxWidth: 720,
        }}>
          {ALL_LEVELS.map((level) => {
            const unlocked = isLevelUnlocked(level.id, progress)
            const completed = progress.completed.includes(level.id)
            const stars = progress.stars[String(level.id)] || 0

            return (
              <button
                key={level.id}
                onClick={() => unlocked ? onSelectLevel(level) : undefined}
                disabled={!unlocked}
                style={{
                  width: m ? 140 : 155, padding: m ? '10px 8px' : '14px 10px',
                  border: '3px solid',
                  borderColor: !unlocked ? 'rgba(255,255,255,0.03)' : completed ? 'rgba(255,215,0,0.2)' : '#4FC3F7',
                  background: !unlocked ? 'rgba(255,255,255,0.01)' : completed ? 'rgba(255,215,0,0.03)' : 'rgba(79,195,247,0.04)',
                  cursor: unlocked ? 'pointer' : 'default',
                  opacity: unlocked ? 1 : 0.2,
                  transition: 'all 0.15s',
                  position: 'relative',
                  textAlign: 'center',
                  fontFamily: font,
                }}
              >
                <div style={{
                  position: 'absolute', top: 2, left: 4,
                  color: 'rgba(79,195,247,0.12)',
                  fontSize: m ? 7 : 8, letterSpacing: 1,
                  opacity: unlocked ? 1 : 0,
                }}>
                  {level.arc}
                </div>
                <div style={{
                  color: !unlocked ? '#333' : completed ? '#FFD700' : '#4FC3F7',
                  fontSize: m ? 10 : 11, letterSpacing: 1,
                  marginBottom: 3,
                }}>
                  {level.id}
                </div>
                <div style={{
                  color: !unlocked ? '#222' : completed ? '#aaa' : '#888',
                  fontSize: m ? 8 : 9, fontFamily: sans, letterSpacing: 0,
                }}>
                  {level.name}
                </div>
                {completed && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 4 }}>
                    {[1, 2, 3].map(s => (
                      <span key={s} style={{
                        color: s <= stars ? '#FFD700' : '#333',
                        fontSize: m ? 8 : 9,
                      }}>★</span>
                    ))}
                  </div>
                )}
                {!unlocked && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 22, color: '#333',
                  }}>🔒</div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
