import { db } from './db'
import { enqueue, flushOutbox, registerOutboxHandler } from './outbox'

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

function getNameKey(userId?: string): string {
  return userId ? `${NAME_KEY}_${userId}` : NAME_KEY
}

export function getLocalPlayerName(userId?: string): string {
  try {
    return localStorage.getItem(getNameKey(userId)) || ''
  } catch {
    return ''
  }
}

export function setLocalPlayerName(name: string, userId?: string) {
  try {
    localStorage.setItem(getNameKey(userId), name)
  } catch {}
}

const PID_KEY = 'corun_profile_id'

function getProfileIdKey(userId?: string): string {
  return userId ? `${PID_KEY}_${userId}` : PID_KEY
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
    await enqueue('name', {
      profile_id: profileId,
      player_name: name,
      last_seen: new Date().toISOString(),
    })
    await flushOutbox()
    return true
  } catch {
    return false
  }
}

export async function submitScore(
  profileId: string,
  score: number,
  mode: 'freeplay' | 'story' | 'daily',
  levelId = 0,
): Promise<boolean> {
  try {
    await enqueue('score', { profile_id: profileId, score, mode, level_id: levelId })
    await flushOutbox()
    return true
  } catch {
    return false
  }
}

registerOutboxHandler('score', async (payload) => {
  const p = payload as {
    profile_id: string
    score: number
    mode: 'freeplay' | 'story' | 'daily'
    level_id: number
  }
  const profile = await db.profiles.get(p.profile_id)
  await db.scores.add({
    profile_id: p.profile_id,
    player_name: profile?.player_name || 'Runner',
    score: p.score,
    mode: p.mode,
    level_id: p.level_id,
    created_at: new Date().toISOString(),
  })
})

registerOutboxHandler('name', async (payload) => {
  const p = payload as { profile_id: string; player_name: string; last_seen: string }
  await db.profiles.update(p.profile_id, { player_name: p.player_name, last_seen: p.last_seen })
})

export async function getGlobalLeaderboard(
  profileId: string,
  _page = 1,
  _limit = 100,
): Promise<{ entries: LeaderboardEntry[]; yourRank: number; yourBest: number }> {
  try {
    const allScores = await db.scores.toArray()
    const map = new Map<string, { name: string; score: number }>()
    for (const s of allScores) {
      if (!map.has(s.profile_id) || s.score > map.get(s.profile_id)!.score) {
        map.set(s.profile_id, { name: s.player_name || 'Runner', score: s.score })
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
    const map = new Map<string, { name: string; score: number }>()
    for (const s of allScores) {
      if (!map.has(s.profile_id) || s.score > map.get(s.profile_id)!.score) {
        map.set(s.profile_id, { name: s.player_name || 'Runner', score: s.score })
      }
    }
    const sorted = Array.from(map.entries())
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 100)
      .map(([pid, v], i) => ({
        profile_id: pid,
        player_name: v.name,
        score: v.score,
        rank: i + 1,
        is_you: pid === profileId,
      }))

    const yourBest = sorted.find((e) => e.is_you)?.score || 0
    const yourRank = yourBest > 0 ? sorted.findIndex((e) => e.is_you) + 1 : 0

    return { entries: sorted, yourRank, yourBest }
  } catch {
    return { entries: [], yourRank: 0, yourBest: 0 }
  }
}
