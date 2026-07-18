import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useAuth0 } from '@auth0/auth0-react'
import TerminalScene from './three/TerminalScene'
import GlassButton from './GlassButton'
import GlassPanel from './GlassPanel'
import { TOPICS, isDailyCompleted } from '../game/challenges'
import { getGlobalLeaderboard, getDailyLeaderboard } from '../lib/leaderboard'
import { Topic, Difficulty } from '../game/types'

interface Props {
  highScore: number
  onStart: (topic: Topic | null, difficulty: Difficulty, isDaily?: boolean) => void
  onStoryMode: () => void
  playerName?: string
  profileId?: string
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
const LEADERBOARD_TABS = ['ALL TIME', 'TODAY']

export default function StartScreen({ highScore, onStart, onStoryMode, playerName, profileId }: Props) {
  const { logout } = useAuth0()
  const [subject, setSubject] = useState<Topic | 'all'>('all')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [lbTab, setLbTab] = useState(0)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [dailyLeaderboard, setDailyLeaderboard] = useState<any[]>([])
  const [playerRank, setPlayerRank] = useState<number | null>(null)
  const [dailyDone, setDailyDone] = useState(false)

  useEffect(() => { setDailyDone(isDailyCompleted()) }, [])

  useEffect(() => {
    if (!profileId) return
    getGlobalLeaderboard(profileId).then(res => {
      if (res) { setLeaderboard(res.entries || []); setPlayerRank(res.yourRank ?? null) }
    }).catch(() => setLeaderboard([]))
  }, [profileId])

  useEffect(() => {
    if (!profileId) return
    getDailyLeaderboard(profileId).then(res => {
      if (res) setDailyLeaderboard(res.entries || [])
    }).catch(() => setDailyLeaderboard([]))
  }, [profileId])

  const entries = lbTab === 0 ? leaderboard : dailyLeaderboard

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0a0a', zIndex: 100 }}>
      <Canvas
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 30 }}
        style={{ position: 'fixed', inset: 0, display: 'block', zIndex: 0 }}
      >
        <TerminalScene />
      </Canvas>

      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '40px 16px', overflow: 'auto',
      }}>
        <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: 2, color: '#F0EBE3', fontFamily: "'Poppins', sans-serif", textShadow: '0 0 40px rgba(240,235,227,0.15)', marginBottom: 8 }}>
          CORUN
        </div>
        <div style={{ fontSize: 9, fontWeight: 300, letterSpacing: 6, color: 'rgba(240,235,227,0.5)', fontFamily: "'Roboto', sans-serif", marginBottom: 32 }}>
          SELECT YOUR MODE
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
          <GlassPanel onClick={onStoryMode} style={{ width: 160, padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(240,235,227,0.4)', fontFamily: "'Poppins', sans-serif", marginBottom: 8 }}>01</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#F0EBE3', fontFamily: "'Poppins', sans-serif", marginBottom: 8 }}>STORY</div>
            <div style={{ fontSize: 8, fontWeight: 300, color: 'rgba(240,235,227,0.6)', fontFamily: "'Roboto', sans-serif", lineHeight: 1.6 }}>
              9 levels. Escape the monster.
            </div>
          </GlassPanel>

          <GlassPanel onClick={() => onStart(subject === 'all' ? null : subject, difficulty)} style={{ width: 160, padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(240,235,227,0.4)', fontFamily: "'Poppins', sans-serif", marginBottom: 8 }}>02</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#F0EBE3', fontFamily: "'Poppins', sans-serif", marginBottom: 8 }}>FREE PLAY</div>
            <div style={{ fontSize: 8, fontWeight: 300, color: 'rgba(240,235,227,0.6)', fontFamily: "'Roboto', sans-serif", lineHeight: 1.6 }}>
              Endless challenges. Build your streak.
            </div>
          </GlassPanel>

          <GlassPanel
            onClick={dailyDone ? undefined : () => onStart(null, 'medium', true)}
            style={{ width: 160, padding: '20px 16px', textAlign: 'center', opacity: dailyDone ? 0.4 : 1 }}
            glow={dailyDone ? undefined : '#F0EBE3'}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(240,235,227,0.4)', fontFamily: "'Poppins', sans-serif", marginBottom: 8 }}>03</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#F0EBE3', fontFamily: "'Poppins', sans-serif", marginBottom: 8 }}>DAILY</div>
            <div style={{ fontSize: 8, fontWeight: 300, color: 'rgba(240,235,227,0.6)', fontFamily: "'Roboto', sans-serif", lineHeight: 1.6 }}>
              {dailyDone ? 'COMPLETED TODAY' : 'One shot. One score.'}
            </div>
          </GlassPanel>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 8, fontWeight: 300, color: 'rgba(240,235,227,0.5)', fontFamily: "'Roboto', sans-serif", letterSpacing: 1 }}>TOPIC</span>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.4)', color: '#F0EBE3',
                border: '1px solid rgba(240,235,227,0.15)',
                borderRadius: 8, padding: '6px 10px', outline: 'none',
                fontFamily: "'Roboto', sans-serif", fontSize: 9, cursor: 'pointer',
              }}
            >
              <option value="all">ALL</option>
              {TOPICS.map(t => (
                <option key={t.id} value={t.id}>{t.label.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 8, fontWeight: 300, color: 'rgba(240,235,227,0.5)', fontFamily: "'Roboto', sans-serif", letterSpacing: 1 }}>DIFF</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    background: difficulty === d ? 'rgba(240,235,227,0.1)' : 'transparent',
                    color: difficulty === d ? '#F0EBE3' : 'rgba(240,235,227,0.4)',
                    border: difficulty === d ? '1px solid rgba(240,235,227,0.3)' : '1px solid rgba(240,235,227,0.1)',
                    borderRadius: 8, padding: '4px 12px', cursor: 'pointer',
                    fontFamily: "'Roboto', sans-serif", fontSize: 10, fontWeight: 500,
                    textTransform: 'capitalize', transition: 'all 0.2s',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <GlassPanel style={{ width: '100%', maxWidth: 480, padding: 16 }}>
          <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
            {LEADERBOARD_TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setLbTab(i)}
                style={{
                  flex: 1,
                  background: lbTab === i ? 'rgba(240,235,227,0.08)' : 'transparent',
                  color: lbTab === i ? '#F0EBE3' : 'rgba(240,235,227,0.3)',
                  border: '1px solid rgba(240,235,227,0.1)',
                  fontFamily: "'Roboto', sans-serif", fontSize: 8, fontWeight: 300,
                  padding: '8px 0', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', fontSize: 7, color: 'rgba(240,235,227,0.3)', fontFamily: "'Roboto', sans-serif", padding: '0 4px 4px', borderBottom: '1px solid rgba(240,235,227,0.08)' }}>
            <span style={{ width: 30 }}>RANK</span>
            <span style={{ flex: 1 }}>NAME</span>
            <span style={{ width: 60, textAlign: 'right' }}>SCORE</span>
          </div>

          {entries.slice(0, 10).map(entry => (
            <div key={entry.rank} style={{
              display: 'flex', alignItems: 'center', padding: '5px 4px',
              borderBottom: '1px solid rgba(240,235,227,0.04)',
              fontSize: 8, fontWeight: 300, color: 'rgba(240,235,227,0.6)',
              fontFamily: "'Roboto', sans-serif",
              background: playerRank === entry.rank ? 'rgba(240,235,227,0.04)' : 'transparent',
            }}>
              <span style={{ width: 30, color: entry.rank <= 3 ? '#F0EBE3' : 'rgba(240,235,227,0.4)' }}>
                #{entry.rank}
              </span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.player_name}
                {playerRank === entry.rank && (
                  <span style={{ fontWeight: 300, color: 'rgba(240,235,227,0.7)', fontFamily: "'Roboto', sans-serif", fontSize: 7, marginLeft: 6 }}>(you)</span>
                )}
              </span>
              <span style={{ width: 60, textAlign: 'right', color: '#F0EBE3' }}>
                {entry.score.toLocaleString()}
              </span>
            </div>
          ))}

          {playerRank !== null && (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <span style={{ fontSize: 8, fontWeight: 300, color: 'rgba(240,235,227,0.7)', fontFamily: "'Roboto', sans-serif" }}>
                YOUR RANK: #{playerRank}
              </span>
            </div>
          )}
        </GlassPanel>
      </div>

      <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 9, fontWeight: 300, color: 'rgba(240,235,227,0.5)', fontFamily: "'Roboto', sans-serif" }}>
          {playerName || 'RUNNER'}
        </span>
        <GlassButton size="sm" variant="secondary" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          EXIT
        </GlassButton>
      </div>
    </div>
  )
}
