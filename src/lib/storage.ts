import { db } from './db'
import { enqueue, flushOutbox, registerOutboxHandler } from './outbox'
import { Difficulty, Topic } from '../game/types'

const HIGH_SCORE_KEY = 'highScore'
const LOCAL_PROFILE_ID = 'local'
const SESSION_ROW_ID = 'runSession'

/** Max age of a saved run before it can no longer be resumed. */
export const SESSION_TTL_MS = 2 * 60 * 60 * 1000

export interface RunSession {
  mode: 'normal' | 'speedrun' | 'survival'
  topic: Topic | null
  difficulty: Difficulty
  score: number
  isDaily: boolean
  savedAt: string
}

// ── Run session (resume last run) ────────────────────────────

export async function getRunSession(): Promise<RunSession | null> {
  const row = await db.settings.get(SESSION_ROW_ID)
  const session = row?.value as RunSession | undefined
  if (!session) return null
  const age = Date.now() - new Date(session.savedAt).getTime()
  if (age > SESSION_TTL_MS) {
    await clearRunSession()
    return null
  }
  return session
}

export async function saveRunSession(session: Omit<RunSession, 'savedAt'>): Promise<void> {
  await db.settings.put({
    key: SESSION_ROW_ID,
    value: { ...session, savedAt: new Date().toISOString() },
  })
}

export async function clearRunSession(): Promise<void> {
  await db.settings.delete(SESSION_ROW_ID)
}

// ── High score ───────────────────────────────────────────────

export async function getHighScore(): Promise<number> {
  const row = await db.settings.get(HIGH_SCORE_KEY)
  return typeof row?.value === 'number' ? row.value : 0
}

export async function setHighScore(score: number): Promise<void> {
  await db.settings.put({ key: HIGH_SCORE_KEY, value: score })
}

// ── Daily challenge ──────────────────────────────────────────

export async function isDailyCompleted(): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10)
  return (await db.daily.get(today)) !== undefined
}

export async function markDailyCompleted(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10)
  await db.daily.put({ date: today, completed_at: new Date().toISOString() })
}

// ── Badges ───────────────────────────────────────────────────

export async function saveBadge(topic: string): Promise<void> {
  if ((await db.badges.where('topic').equals(topic).count()) > 0) return
  await enqueue('badge', topic)
  await flushOutbox()
}

registerOutboxHandler('badge', async (payload) => {
  await db.badges.add({ topic: payload as string, earned_at: new Date().toISOString() })
})

// ── Local leaderboard ────────────────────────────────────────

export interface LeaderboardScore {
  score: number
  date: string
  mode: 'freeplay' | 'daily'
}

export async function addToLeaderboard(
  score: number,
  mode: 'freeplay' | 'daily' = 'freeplay',
): Promise<void> {
  await enqueue('leaderboard', {
    score,
    date: new Date().toISOString().slice(0, 10),
    mode,
  })
  await flushOutbox()
}

registerOutboxHandler('leaderboard', async (payload) => {
  const p = payload as LeaderboardScore
  await db.scores.add({
    profile_id: LOCAL_PROFILE_ID,
    player_name: 'Runner',
    score: p.score,
    mode: p.mode,
    level_id: 0,
    created_at: p.date,
  })
})
