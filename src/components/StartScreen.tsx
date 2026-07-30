import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import TerminalScene from './three/TerminalScene'
import GlassButton from './GlassButton'
import GlassPanel from './GlassPanel'
import { TOPICS, isDailyCompleted } from '../game/challenges'
import {
  getGlobalLeaderboard,
  getDailyLeaderboard,
  type LeaderboardEntry,
} from '../lib/leaderboard'
import { Topic, Difficulty } from '../game/types'
import { setLocale, getLocale, getSupportedLocales, type Locale } from '../lib/i18n'

interface Props {
  highScore: number
  onStart: (topic: Topic | null, difficulty: Difficulty, isDaily?: boolean) => void
  onStoryMode: () => void
  onSpeedRun: () => void
  onSurvival: () => void
  onPuzzleEditor: () => void
  onCustomPuzzles: () => void
  playerName?: string
  profileId?: string
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

export default function StartScreen({
  highScore,
  onStart,
  onStoryMode,
  onSpeedRun,
  onSurvival,
  onPuzzleEditor,
  onCustomPuzzles,
  playerName,
  profileId,
}: Props) {
  const [view, setView] = useState<'main' | 'play' | 'leaderboard'>('main')
  const [subject, setSubject] = useState<Topic | 'all'>('all')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [dailyDone, setDailyDone] = useState(false)

  const [lbTab, setLbTab] = useState(0)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [dailyLeaderboard, setDailyLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerRank, setPlayerRank] = useState<number | null>(null)

  useEffect(() => {
    setDailyDone(isDailyCompleted())
  }, [])

  useEffect(() => {
    if (!profileId) return
    getGlobalLeaderboard(profileId)
      .then((r) => {
        setLeaderboard(r.entries || [])
        setPlayerRank(r.yourRank ?? null)
      })
      .catch(() => setLeaderboard([]))
  }, [profileId])

  useEffect(() => {
    if (!profileId) return
    getDailyLeaderboard(profileId)
      .then((r) => setDailyLeaderboard(r.entries || []))
      .catch(() => setDailyLeaderboard([]))
  }, [profileId])

  const entries = lbTab === 0 ? leaderboard : dailyLeaderboard

  const s: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: '#0a0a0a',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0a0a', zIndex: 100 }}>
      <Canvas
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 30 }}
        style={{ position: 'fixed', inset: 0, display: 'block', zIndex: 0 }}
      >
        <TerminalScene />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        {view === 'main' && (
          <>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                letterSpacing: 3,
                color: '#F0EBE3',
                fontFamily: "'Poppins', sans-serif",
                textShadow: '0 0 60px rgba(240,235,227,0.12)',
                marginBottom: 4,
              }}
            >
              CORUN
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 300,
                letterSpacing: 6,
                color: 'rgba(240,235,227,0.45)',
                fontFamily: "'Roboto', sans-serif",
                marginBottom: 40,
              }}
            >
              ESCAPE THE MONSTER
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}
            >
              <button
                onClick={() => setView('play')}
                style={{
                  width: 220,
                  padding: '14px 0',
                  background: '#F0EBE3',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 0 30px rgba(240,235,227,0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 50px rgba(240,235,227,0.3)'
                  e.currentTarget.style.transform = 'scale(1.03)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(240,235,227,0.15)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                PLAY
              </button>
              <GlassButton size="lg" onClick={onStoryMode}>
                STORY MODE
              </GlassButton>
              <GlassButton size="md" variant="secondary" onClick={onPuzzleEditor}>
                PUZZLE EDITOR
              </GlassButton>
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
              <button
                onClick={() => setView('leaderboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(240,235,227,0.3)',
                  fontSize: 10,
                  fontFamily: "'Roboto', sans-serif",
                  letterSpacing: 1,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                LEADERBOARD
              </button>
              <select
                value={getLocale()}
                onChange={(e) => {
                  setLocale(e.target.value as Locale)
                  window.location.reload()
                }}
                style={{
                  background: 'none',
                  color: 'rgba(240,235,227,0.3)',
                  border: '1px solid rgba(240,235,227,0.1)',
                  borderRadius: 4,
                  padding: '2px 6px',
                  outline: 'none',
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: 10,
                  cursor: 'pointer',
                }}
                aria-label="Language"
              >
                {getSupportedLocales().map((l) => (
                  <option key={l} value={l}>
                    {l.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {view === 'play' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 300,
                letterSpacing: 4,
                color: 'rgba(240,235,227,0.4)',
                fontFamily: "'Roboto', sans-serif",
                marginBottom: 4,
              }}
            >
              SELECT MODE
            </div>

            <button
              onClick={() => onStart(subject === 'all' ? null : subject, difficulty)}
              style={{
                width: 240,
                padding: '14px 0',
                background: '#F0EBE3',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              FREE PLAY
            </button>
            <GlassButton
              size="lg"
              onClick={dailyDone ? undefined : () => onStart(null, 'medium', true)}
              style={{ opacity: dailyDone ? 0.4 : 1 }}
            >
              {dailyDone ? 'DAILY — DONE' : 'DAILY CHALLENGE'}
            </GlassButton>
            <GlassButton size="md" onClick={onSpeedRun}>
              SPEED RUN
            </GlassButton>
            <GlassButton size="md" onClick={onSurvival}>
              SURVIVAL
            </GlassButton>

            <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                marginTop: 4,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Topic | 'all')}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  color: '#F0EBE3',
                  border: '1px solid rgba(240,235,227,0.15)',
                  borderRadius: 6,
                  padding: '5px 8px',
                  outline: 'none',
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: 10,
                  cursor: 'pointer',
                }}
              >
                <option value="all">ALL TOPICS</option>
                {TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label.toUpperCase()}
                  </option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: 4 }}>
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    style={{
                      background: difficulty === d ? 'rgba(240,235,227,0.1)' : 'transparent',
                      color: difficulty === d ? '#F0EBE3' : 'rgba(240,235,227,0.4)',
                      border:
                        difficulty === d
                          ? '1px solid rgba(240,235,227,0.3)'
                          : '1px solid rgba(240,235,227,0.1)',
                      borderRadius: 6,
                      padding: '4px 10px',
                      cursor: 'pointer',
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: 10,
                      textTransform: 'capitalize',
                      transition: 'all 0.2s',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setView('main')}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(240,235,227,0.25)',
                fontSize: 10,
                fontFamily: "'Roboto', sans-serif",
                letterSpacing: 1,
                cursor: 'pointer',
                marginTop: 8,
              }}
            >
              {'←'} BACK
            </button>
          </div>
        )}

        {view === 'leaderboard' && (
          <GlassPanel
            style={{
              width: '90%',
              maxWidth: 420,
              padding: 20,
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
              {['ALL TIME', 'TODAY'].map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setLbTab(i)}
                  style={{
                    flex: 1,
                    background: lbTab === i ? 'rgba(240,235,227,0.08)' : 'transparent',
                    color: lbTab === i ? '#F0EBE3' : 'rgba(240,235,227,0.3)',
                    border: '1px solid rgba(240,235,227,0.1)',
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: 11,
                    fontWeight: 300,
                    padding: '8px 0',
                    cursor: 'pointer',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 11,
                color: 'rgba(240,235,227,0.3)',
                fontFamily: "'Roboto', sans-serif",
                padding: '0 4px 6px',
                borderBottom: '1px solid rgba(240,235,227,0.08)',
              }}
            >
              <span style={{ width: 30 }}>#</span>
              <span style={{ flex: 1 }}>NAME</span>
              <span style={{ width: 60, textAlign: 'right' }}>SCORE</span>
            </div>
            {entries.slice(0, 10).map((entry) => (
              <div
                key={entry.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px 4px',
                  borderBottom: '1px solid rgba(240,235,227,0.04)',
                  fontSize: 11,
                  color: 'rgba(240,235,227,0.6)',
                  fontFamily: "'Roboto', sans-serif",
                  background: playerRank === entry.rank ? 'rgba(240,235,227,0.04)' : 'transparent',
                }}
              >
                <span
                  style={{
                    width: 30,
                    color: entry.rank <= 3 ? '#F0EBE3' : 'rgba(240,235,227,0.4)',
                  }}
                >
                  #{entry.rank}
                </span>
                <span
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.player_name}
                  {playerRank === entry.rank && (
                    <span style={{ color: 'rgba(240,235,227,0.5)', marginLeft: 6 }}>(you)</span>
                  )}
                </span>
                <span style={{ width: 60, textAlign: 'right', color: '#F0EBE3' }}>
                  {entry.score.toLocaleString()}
                </span>
              </div>
            ))}
            {playerRank !== null && (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: 12,
                  fontSize: 11,
                  color: 'rgba(240,235,227,0.5)',
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                YOUR RANK: #{playerRank}
              </div>
            )}
            <button
              onClick={() => setView('main')}
              style={{
                display: 'block',
                margin: '12px auto 0',
                background: 'none',
                border: 'none',
                color: 'rgba(240,235,227,0.25)',
                fontSize: 10,
                fontFamily: "'Roboto', sans-serif",
                letterSpacing: 1,
                cursor: 'pointer',
              }}
            >
              ← BACK
            </button>
          </GlassPanel>
        )}
      </div>

      <div
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 20,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 300,
            color: 'rgba(240,235,227,0.4)',
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          {playerName || 'RUNNER'}
        </span>
      </div>
    </div>
  )
}
