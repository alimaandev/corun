import { db } from './db'
import { enqueue, flushOutbox, registerOutboxHandler } from './outbox'
import { LevelProgress } from '../game/types'

const HIGH_SCORE_KEY = 'highScore'
const PROGRESS_ROW_ID = 'main'
const LOCAL_PROFILE_ID = 'local'

export const DEFAULT_LEVEL_PROGRESS: LevelProgress = { unlockedUpTo: 1, completed: [], stars: {} }

// ── High score ───────────────────────────────────────────────

export async function getHighScore(): Promise<number> {
  const row = await db.settings.get(HIGH_SCORE_KEY)
  return typeof row?.value === 'number' ? row.value : 0
}

export async function setHighScore(score: number): Promise<void> {
  await db.settings.put({ key: HIGH_SCORE_KEY, value: score })
}

// ── Level progress ───────────────────────────────────────────

export async function getLevelProgress(): Promise<LevelProgress> {
  const row = await db.levelProgress.get(PROGRESS_ROW_ID)
  if (!row) return { ...DEFAULT_LEVEL_PROGRESS }
  return {
    unlockedUpTo: row.value.unlockedUpTo ?? DEFAULT_LEVEL_PROGRESS.unlockedUpTo,
    completed: row.value.completed ?? [],
    stars: row.value.stars ?? {},
  }
}

export async function saveLevelProgress(progress: LevelProgress): Promise<void> {
  await db.levelProgress.put({ id: PROGRESS_ROW_ID, value: progress })
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

export async function getSavedBadges(): Promise<string[]> {
  const rows = await db.badges.toArray()
  return rows.map((r) => r.topic)
}

export async function saveBadge(topic: string): Promise<void> {
  if ((await getSavedBadges()).includes(topic)) return
  await enqueue('badge', topic)
  await flushOutbox()
}

registerOutboxHandler('badge', async (payload) => {
  await db.badges.add({ topic: payload as string, earned_at: new Date().toISOString() })
})

// ── Local top-10 leaderboard ─────────────────────────────────

export interface LeaderboardScore {
  score: number
  date: string
}

export async function getLeaderboard(): Promise<LeaderboardScore[]> {
  const rows = await db.scores.where('profile_id').equals(LOCAL_PROFILE_ID).sortBy('score')
  return rows
    .slice(-10)
    .reverse()
    .map((r) => ({ score: r.score, date: r.created_at.slice(0, 10) }))
}

export async function addToLeaderboard(score: number): Promise<void> {
  await enqueue('leaderboard', {
    score,
    date: new Date().toISOString().slice(0, 10),
  })
  await flushOutbox()
}

registerOutboxHandler('leaderboard', async (payload) => {
  const p = payload as LeaderboardScore
  await db.scores.add({
    profile_id: LOCAL_PROFILE_ID,
    player_name: 'Runner',
    score: p.score,
    mode: 'freeplay',
    level_id: 0,
    created_at: p.date,
  })
})
