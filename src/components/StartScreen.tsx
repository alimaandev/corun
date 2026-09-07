import { useState, useEffect, ReactNode } from 'react'
import Backdrop from '../ui/Backdrop'
import GlassButton from './GlassButton'
import GlassPanel from './GlassPanel'
import { TOPICS } from '../game/engine/data/challenges'
import {
  isDailyCompleted,
  getGlobalLeaderboard,
  getDailyLeaderboard,
  type LeaderboardEntry,
  type RunSession,
} from '../lib/store'
import { Topic, Difficulty } from '../game/types'
import { setLocale, getLocale, getSupportedLocales, t, type Locale } from '../lib/i18n'
import { colors, fonts, alpha, radius, glassPanel, transition, shadows } from '../lib/theme'

interface Props {
  highScore: number
  onStart: (topic: Topic | null, difficulty: Difficulty, isDaily?: boolean) => void
  onSpeedRun: () => void
  onSurvival: () => void
  onPuzzleEditor: () => void
  onCustomPuzzles: () => void
  onStory: () => void
  playerName?: string
  profileId?: string
  resumeSession?: RunSession | null
  onResume?: (session: RunSession) => void
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

const CARD_ACCENTS: Record<string, string> = {
  freeplay: colors.accentBright,
  daily: colors.gold,
  speedrun: '#7aa2ff',
  survival: '#ff7a7a',
  story: '#8faf2f',
}

function resumeLabel(session: RunSession): string {
  const pts = session.score.toLocaleString()
  if (session.mode === 'speedrun') return `SPEED RUN — ${pts} PTS`
  if (session.mode === 'survival') return `SURVIVAL — ${pts} PTS`
  if (session.isDaily) return `DAILY — ${pts} PTS`
  return `FREE PLAY — ${pts} PTS`
}

function ModeCard({
  id,
  title,
  subtitle,
  onPlay,
  disabled,
  children,
}: {
  id: string
  title: string
  subtitle: string
  onPlay?: () => void
  disabled?: boolean
  children?: ReactNode
}) {
  const [hover, setHover] = useState(false)
  const accent = CARD_ACCENTS[id]
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...glassPanel,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        borderColor: hover ? accent : undefined,
        boxShadow: hover ? shadows.md : undefined,
        transform: hover ? 'translateY(-2px)' : undefined,
        transition,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{ color: accent, fontSize: 14, letterSpacing: 3, fontWeight: 600 }}>{title}</div>
      <div
        style={{
          color: alpha(0.55),
          fontSize: 14,
          lineHeight: 1.5,
          fontFamily: fonts.body,
          flex: 1,
        }}
      >
        {subtitle}
      </div>
      {children}
      {onPlay && !disabled && (
        <div style={{ marginTop: 'auto', paddingTop: 6 }}>
          <GlassButton size="sm" onClick={onPlay}>
            RUN
          </GlassButton>
        </div>
      )}
    </div>
  )
}

function StatChip({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div
      style={{
        ...glassPanel,
        padding: '10px 16px',
        minWidth: 110,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 13, letterSpacing: 3, color: alpha(0.4), fontWeight: 300 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          fontFamily: fonts.heading,
          color: accent ?? colors.fg,
          marginTop: 2,
        }}
      >
        {value}
      </div>
    </div>
  )
}

export default function StartScreen({
  highScore,
  onStart,
  onSpeedRun,
  onSurvival,
  onPuzzleEditor,
  onCustomPuzzles,
  onStory,
  playerName,
  profileId,
  resumeSession,
  onResume,
}: Props) {
  const [view, setView] = useState<'main' | 'leaderboard'>('main')
  const [locale, setLocaleState] = useState<Locale>(() => getLocale())
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
      <Backdrop />

      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 20,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 300,
            letterSpacing: 2,
            color: alpha(0.5),
            fontFamily: fonts.body,
            background: 'rgba(0,0,0,0.35)',
            border: `1px solid ${alpha(0.1)}`,
            borderRadius: radius.xl,
            padding: '5px 12px',
          }}
        >
          {playerName || 'RUNNER'}
        </span>
      </div>

      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 20,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <select
          value={locale}
          onChange={(e) => {
            const next = e.target.value as Locale
            setLocale(next)
            setLocaleState(next)
          }}
          style={{
            background: 'rgba(0,0,0,0.35)',
            color: alpha(0.5),
            border: `1px solid ${alpha(0.1)}`,
            borderRadius: radius.xl,
            padding: '5px 10px',
            outline: 'none',
            fontFamily: fonts.body,
            fontSize: 13,
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 760,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                letterSpacing: 3,
                color: colors.fg,
                fontFamily: fonts.heading,
                textShadow: `0 0 60px ${alpha(0.12)}`,
                lineHeight: 1,
              }}
            >
              CORUN
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 300,
                letterSpacing: 6,
                color: alpha(0.5),
                fontFamily: fonts.body,
                marginBottom: 24,
                marginTop: 6,
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
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    letterSpacing: 3,
                    color: colors.accentBright,
                    fontFamily: fonts.heading,
                    fontWeight: 600,
                  }}
                >
                  RUN SAVED
                </div>
                <GlassButton size="lg" variant="primary" onClick={() => onResume(resumeSession)}>
                  {t('btn.resume')} — {resumeLabel(resumeSession)}
                </GlassButton>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <StatChip label={t('start.highScore')} value={highScore.toLocaleString()} />
              <StatChip
                label={t('start.worldRank')}
                value={playerRank !== null ? `#${playerRank}` : '—'}
                accent={playerRank !== null && playerRank <= 3 ? colors.gold : undefined}
              />
              <StatChip
                label={t('mode.daily')}
                value={dailyDone ? 'DONE' : 'OPEN'}
                accent={dailyDone ? colors.danger : colors.accentBright}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: 14,
                width: '100%',
                marginBottom: 22,
              }}
            >
              <ModeCard id="freeplay" title={t('mode.free')} subtitle={t('start.freeplay.desc')}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Topic | 'all')}
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      color: colors.fg,
                      border: `1px solid ${alpha(0.15)}`,
                      borderRadius: radius.md,
                      padding: '7px 10px',
                      outline: 'none',
                      fontFamily: fonts.body,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="all">{t('start.topics')}</option>
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
                          flex: 1,
                          background: difficulty === d ? alpha(0.1) : 'transparent',
                          color: difficulty === d ? colors.fg : alpha(0.4),
                          border:
                            difficulty === d
                              ? `1px solid ${alpha(0.3)}`
                              : `1px solid ${alpha(0.1)}`,
                          borderRadius: radius.md,
                          padding: '7px 0',
                          cursor: 'pointer',
                          fontFamily: fonts.body,
                          fontSize: 13,
                          textTransform: 'capitalize',
                          transition,
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: 6 }}>
                  <GlassButton
                    size="sm"
                    onClick={() => onStart(subject === 'all' ? null : subject, difficulty)}
                  >
                    RUN
                  </GlassButton>
                </div>
              </ModeCard>

              <ModeCard
                id="daily"
                title={t('start.dailyTitle')}
                subtitle={t('start.daily.desc')}
                onPlay={dailyDone ? undefined : () => onStart(null, 'medium', true)}
                disabled={dailyDone}
              />

              <ModeCard
                id="speedrun"
                title={t('mode.speedrun')}
                subtitle={t('start.speedrun.desc')}
                onPlay={onSpeedRun}
              />

              <ModeCard
                id="story"
                title={t('story.enter')}
                subtitle={t('start.story.desc')}
                onPlay={onStory}
              />

              <ModeCard
                id="survival"
                title={t('mode.survival')}
                subtitle={t('start.survival.desc')}
                onPlay={onSurvival}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <GlassButton size="sm" variant="secondary" onClick={() => setView('leaderboard')}>
                {t('start.leaderboard')}
              </GlassButton>
              <GlassButton size="sm" variant="secondary" onClick={onPuzzleEditor}>
                {t('btn.puzzleEditor')}
              </GlassButton>
              <GlassButton size="sm" variant="secondary" onClick={onCustomPuzzles}>
                {t('btn.customPuzzles')}
              </GlassButton>
            </div>
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
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: 13,
                letterSpacing: 3,
                color: colors.accentBright,
                fontFamily: fonts.heading,
                fontWeight: 600,
                marginBottom: 12,
                textAlign: 'center',
              }}
            >
              {t('start.leaderboard')}
            </div>
            <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
              {[t('lb.allTime'), t('lb.today')].map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setLbTab(i)}
                  style={{
                    flex: 1,
                    background: lbTab === i ? alpha(0.08) : 'transparent',
                    color: lbTab === i ? colors.fg : alpha(0.3),
                    border: `1px solid ${alpha(0.1)}`,
                    fontFamily: fonts.body,
                    fontSize: 13,
                    fontWeight: 400,
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
                fontSize: 13,
                color: alpha(0.35),
                fontFamily: fonts.body,
                padding: '0 4px 6px',
                borderBottom: `1px solid ${alpha(0.08)}`,
              }}
            >
              <span style={{ width: 30 }}>#</span>
              <span style={{ flex: 1 }}>{t('lb.name')}</span>
              <span style={{ width: 60, textAlign: 'right' }}>{t('lb.score')}</span>
            </div>
            {entries.slice(0, 10).map((entry) => (
              <div
                key={entry.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 4px',
                  borderBottom: `1px solid ${alpha(0.04)}`,
                  fontSize: 13,
                  color: alpha(0.65),
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
                    <span style={{ color: alpha(0.5), marginLeft: 6 }}>{t('lb.you')}</span>
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
                  fontSize: 13,
                  color: alpha(0.55),
                  fontFamily: fonts.body,
                }}
              >
                {t('lb.yourRank', { rank: playerRank })}
              </div>
            )}
            <GlassButton
              size="sm"
              variant="secondary"
              onClick={() => setView('main')}
              style={{ display: 'block', margin: '12px auto 0' }}
            >
              {t('btn.back')}
            </GlassButton>
          </GlassPanel>
        )}
      </div>
    </div>
  )
}
