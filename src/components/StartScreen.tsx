import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import TerminalScene from './three/TerminalScene'
import GlassButton from './GlassButton'
import GlassPanel from './GlassPanel'
import { TOPICS } from '../game/engine/data/challenges'
import { isDailyCompleted } from '../lib/storage'
import {
  getGlobalLeaderboard,
  getDailyLeaderboard,
  type LeaderboardEntry,
} from '../lib/leaderboard'
import { Topic, Difficulty } from '../game/types'
import type { RunSession } from '../lib/storage'
import { setLocale, getLocale, getSupportedLocales, type Locale } from '../lib/i18n'
import { colors, fonts, alpha, radius } from '../lib/theme'

interface Props {
  highScore: number
  onStart: (topic: Topic | null, difficulty: Difficulty, isDaily?: boolean) => void
  onSpeedRun: () => void
  onSurvival: () => void
  onPuzzleEditor: () => void
  onCustomPuzzles: () => void
  playerName?: string
  profileId?: string
  resumeSession?: RunSession | null
  onResume?: (session: RunSession) => void
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

function resumeLabel(session: RunSession): string {
  const pts = session.score.toLocaleString()
  if (session.mode === 'speedrun') return `SPEED RUN — ${pts} PTS`
  if (session.mode === 'survival') return `SURVIVAL — ${pts} PTS`
  if (session.isDaily) return `DAILY — ${pts} PTS`
  return `FREE PLAY — ${pts} PTS`
}

export default function StartScreen({
  onStart,
  onSpeedRun,
  onSurvival,
  onPuzzleEditor,
  playerName,
  profileId,
  resumeSession,
  onResume,
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
    isDailyCompleted().then(setDailyDone)
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

  return (
    <div style={{ position: 'fixed', inset: 0, background: colors.bg, zIndex: 100 }}>
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
                color: colors.fg,
                fontFamily: fonts.heading,
                textShadow: `0 0 60px ${alpha(0.12)}`,
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
                color: alpha(0.45),
                fontFamily: fonts.body,
                marginBottom: 40,
              }}
            >
              ESCAPE THE MONSTER
            </div>

            {resumeSession && onResume && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  alignItems: 'center',
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: 3,
                    color: colors.accentBright,
                    fontFamily: fonts.heading,
                    fontWeight: 600,
                  }}
                >
                  RUN SAVED
                </div>
                <GlassButton size="lg" variant="primary" onClick={() => onResume(resumeSession)}>
                  CONTINUE — {resumeLabel(resumeSession)}
                </GlassButton>
              </div>
            )}

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}
            >
              <GlassButton size="lg" onClick={() => setView('play')}>
                PLAY
              </GlassButton>
              <GlassButton size="md" variant="secondary" onClick={onPuzzleEditor}>
                PUZZLE EDITOR
              </GlassButton>
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
              <GlassButton size="sm" variant="secondary" onClick={() => setView('leaderboard')}>
                LEADERBOARD
              </GlassButton>
              <select
                value={getLocale()}
                onChange={(e) => {
                  setLocale(e.target.value as Locale)
                  window.location.reload()
                }}
                style={{
                  background: 'none',
                  color: alpha(0.3),
                  border: `1px solid ${alpha(0.1)}`,
                  borderRadius: radius.sm,
                  padding: '2px 6px',
                  outline: 'none',
                  fontFamily: fonts.body,
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
                color: alpha(0.4),
                fontFamily: fonts.body,
                marginBottom: 4,
              }}
            >
              SELECT MODE
            </div>

            <GlassButton
              size="lg"
              onClick={() => onStart(subject === 'all' ? null : subject, difficulty)}
            >
              FREE PLAY
            </GlassButton>
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
                  color: colors.fg,
                  border: `1px solid ${alpha(0.15)}`,
                  borderRadius: radius.md,
                  padding: '5px 8px',
                  outline: 'none',
                  fontFamily: fonts.body,
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
                      background: difficulty === d ? alpha(0.1) : 'transparent',
                      color: difficulty === d ? colors.fg : alpha(0.4),
                      border:
                        difficulty === d ? `1px solid ${alpha(0.3)}` : `1px solid ${alpha(0.1)}`,
                      borderRadius: radius.md,
                      padding: '4px 10px',
                      cursor: 'pointer',
                      fontFamily: fonts.body,
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

            <GlassButton
              size="sm"
              variant="secondary"
              onClick={() => setView('main')}
              style={{ marginTop: 8 }}
            >
              ← BACK
            </GlassButton>
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
                    background: lbTab === i ? alpha(0.08) : 'transparent',
                    color: lbTab === i ? colors.fg : alpha(0.3),
                    border: `1px solid ${alpha(0.1)}`,
                    fontFamily: fonts.body,
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
                color: alpha(0.3),
                fontFamily: fonts.body,
                padding: '0 4px 6px',
                borderBottom: `1px solid ${alpha(0.08)}`,
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
                  borderBottom: `1px solid ${alpha(0.04)}`,
                  fontSize: 11,
                  color: alpha(0.6),
                  fontFamily: fonts.body,
                  background: playerRank === entry.rank ? alpha(0.04) : 'transparent',
                }}
              >
                <span
                  style={{
                    width: 30,
                    color: entry.rank <= 3 ? colors.fg : alpha(0.4),
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
                    <span style={{ color: alpha(0.5), marginLeft: 6 }}>(you)</span>
                  )}
                </span>
                <span style={{ width: 60, textAlign: 'right', color: colors.fg }}>
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
                  color: alpha(0.5),
                  fontFamily: fonts.body,
                }}
              >
                YOUR RANK: #{playerRank}
              </div>
            )}
            <GlassButton
              size="sm"
              variant="secondary"
              onClick={() => setView('main')}
              style={{ display: 'block', margin: '12px auto 0' }}
            >
              ← BACK
            </GlassButton>
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
            color: alpha(0.4),
            fontFamily: fonts.body,
          }}
        >
          {playerName || 'RUNNER'}
        </span>
      </div>
    </div>
  )
}
