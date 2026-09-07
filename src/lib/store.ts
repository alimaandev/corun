import { db } from './db'
import { Difficulty, Topic } from '../game/types'

/**
 * Single persistence layer for Corun. All game state (run sessions, high
 * score, daily markers, badges, scores, profiles) is stored directly in
 * IndexedDB via Dexie. LocalStorage is only used for player-name/profile-id
 * lookups that are needed before the DB opens.
 */

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
  await db.badges.add({ topic, earned_at: new Date().toISOString() })
}

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
  await db.scores.add({
    profile_id: LOCAL_PROFILE_ID,
    player_name: 'Runner',
    score,
    mode,
    level_id: 0,
    created_at: new Date().toISOString().slice(0, 10),
  })
}

// ── Global profiles & leaderboards ───────────────────────────

export interface LeaderboardEntry {
  profile_id: string
  player_name: string
  score: number
  rank: number
  is_you?: boolean
}

export interface PlayerProfile {
  id: string
  player_name: string
}

const NAME_KEY = 'corun_player_name'
const PID_KEY = 'corun_profile_id'

function getNameKey(userId?: string): string {
  return userId ? `${NAME_KEY}_${userId}` : NAME_KEY
}

function getProfileIdKey(userId?: string): string {
  return userId ? `${PID_KEY}_${userId}` : PID_KEY
}

export function getLocalPlayerName(userId?: string): string {
  try {
    return localStorage.getItem(getNameKey(userId)) || ''
  } catch {
    return ''
  }
}

export function setLocalPlayerName(name: string, userId?: string): void {
  try {
    localStorage.setItem(getNameKey(userId), name)
  } catch {}
}

function getOrCreateProfileId(userId?: string): string {
  try {
    const key = getProfileIdKey(userId)
    let id = localStorage.getItem(key)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(key, id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

export async function initSession(userId?: string): Promise<PlayerProfile | null> {
  const profileId = getOrCreateProfileId(userId)
  const localName = getLocalPlayerName(userId) || 'Runner'

  const existing = await db.profiles.get(profileId)
  if (existing) {
    if (localName !== existing.player_name) {
      await db.profiles.update(profileId, {
        player_name: localName,
        last_seen: new Date().toISOString(),
      })
    } else {
      await db.profiles.update(profileId, { last_seen: new Date().toISOString() })
    }
    setLocalPlayerName(existing.player_name, userId)
    return { id: existing.id, player_name: existing.player_name }
  }

  setLocalPlayerName(localName, userId)
  await db.profiles.put({
    id: profileId,
    player_name: localName,
    last_seen: new Date().toISOString(),
  })
  return { id: profileId, player_name: localName }
}

export async function updatePlayerName(
  profileId: string,
  name: string,
  userId?: string,
): Promise<boolean> {
  setLocalPlayerName(name, userId)
  try {
    await db.profiles.update(profileId, {
      player_name: name,
      last_seen: new Date().toISOString(),
    })
    return true
  } catch {
    return false
  }
}

export async function submitScore(
  profileId: string,
  score: number,
  mode: 'freeplay' | 'daily' | 'story',
): Promise<boolean> {
  try {
    const profile = await db.profiles.get(profileId)
    await db.scores.add({
      profile_id: profileId,
      player_name: profile?.player_name || 'Runner',
      score,
      mode,
      level_id: 0,
      created_at: new Date().toISOString(),
    })
    return true
  } catch {
    return false
  }
}

function bestPerProfile(
  rows: { profile_id: string; player_name: string; score: number }[],
  profileId: string,
) {
  const map = new Map<string, { name: string; score: number }>()
  for (const r of rows) {
    if (!map.has(r.profile_id) || r.score > map.get(r.profile_id)!.score) {
      map.set(r.profile_id, { name: r.player_name || 'Runner', score: r.score })
    }
  }
  const sorted = Array.from(map.entries())
    .sort((a, b) => b[1].score - a[1].score)
    .map(([pid, v], i) => ({
      profile_id: pid,
      player_name: v.name,
      score: v.score,
      rank: i + 1,
      is_you: pid === profileId,
    }))
  const yourBest = sorted.find((e) => e.is_you)?.score || 0
  const yourRank = yourBest > 0 ? sorted.findIndex((e) => e.is_you) + 1 : 0
  return { sorted, yourRank, yourBest }
}

export async function getGlobalLeaderboard(
  profileId: string,
  _page = 1,
  _limit = 100,
): Promise<{ entries: LeaderboardEntry[]; yourRank: number; yourBest: number }> {
  try {
    const allScores = await db.scores.toArray()
    const { sorted, yourRank, yourBest } = bestPerProfile(allScores, profileId)
    return { entries: sorted.slice(0, 100), yourRank, yourBest }
  } catch {
    return { entries: [], yourRank: 0, yourBest: 0 }
  }
}

export async function getDailyLeaderboard(
  profileId: string,
): Promise<{ entries: LeaderboardEntry[]; yourRank: number; yourBest: number }> {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const allScores = await db.scores.where('created_at').startsWith(today).toArray()
    const { sorted, yourRank, yourBest } = bestPerProfile(allScores, profileId)
    return { entries: sorted.slice(0, 100), yourRank, yourBest }
  } catch {
    return { entries: [], yourRank: 0, yourBest: 0 }
  }
}
