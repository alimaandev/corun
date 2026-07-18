import { supabase } from './supabase'

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
  try { return localStorage.getItem(getNameKey(userId)) || '' } catch { return '' }
}

export function setLocalPlayerName(name: string, userId?: string) {
  try { localStorage.setItem(getNameKey(userId), name) } catch {}
}

const PID_KEY = 'corun_profile_id'

function getProfileIdKey(userId?: string): string {
  return userId ? `${PID_KEY}_${userId}` : PID_KEY
}

function getLocalProfileId(userId?: string): string {
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
  try {
    if (!import.meta.env.VITE_SUPABASE_URL) return null

    const profileId = getLocalProfileId(userId)
    const localName = getLocalPlayerName(userId)
    const name = localName || 'Runner'

    const { data: existing } = await supabase
      .from('profiles')
      .select('id, player_name')
      .eq('id', profileId)
      .maybeSingle()

    if (existing) {
      if (localName && localName !== existing.player_name) {
        await supabase
          .from('profiles')
          .update({ player_name: localName, last_seen: new Date().toISOString() })
          .eq('id', profileId)
      } else {
        await supabase
          .from('profiles')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', profileId)
      }
      setLocalPlayerName(existing.player_name, userId)
      return { id: existing.id, player_name: existing.player_name }
    }

    setLocalPlayerName(name, userId)
    const { data: created } = await supabase
      .from('profiles')
      .insert({ id: profileId, player_name: name })
      .select('id, player_name')
      .maybeSingle()

    return created ? { id: created.id, player_name: created.player_name } : { id: profileId, player_name: name }
  } catch (e) {
    console.warn('[leaderboard] Init failed:', e)
    return null
  }
}

export async function updatePlayerName(profileId: string, name: string, userId?: string): Promise<boolean> {
  setLocalPlayerName(name, userId)
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ player_name: name })
      .eq('id', profileId)
    return !error
  } catch { return false }
}

export async function submitScore(
  profileId: string,
  score: number,
  mode: 'freeplay' | 'story' | 'daily',
  levelId = 0
): Promise<boolean> {
  const { error } = await supabase
    .from('scores')
    .insert({ profile_id: profileId, score, mode, level_id: levelId })
  if (error) {
    try {
      const queue = JSON.parse(localStorage.getItem('corun_score_queue') || '[]')
      queue.push({ profile_id: profileId, score, mode, level_id: levelId, ts: Date.now() })
      localStorage.setItem('corun_score_queue', JSON.stringify(queue.slice(-50)))
    } catch {}
    return false
  }
  return true
}

export async function flushScoreQueue(): Promise<number> {
  try {
    const queue = JSON.parse(localStorage.getItem('corun_score_queue') || '[]')
    if (queue.length === 0) return 0
    let flushed = 0
    for (const item of queue) {
      const { error } = await supabase.from('scores').insert(item)
      if (!error) flushed++
    }
    if (flushed > 0) {
      localStorage.setItem('corun_score_queue', JSON.stringify([]))
    }
    return flushed
  } catch { return 0 }
}

export async function getGlobalLeaderboard(
  profileId: string,
  page = 1,
  limit = 100
): Promise<{ entries: LeaderboardEntry[]; yourRank: number; yourBest: number }> {
  try {
    const from = (page - 1) * limit

    let rows: any[] | null = null
    const { data: rpcData, error: rpcErr } = await supabase
      .rpc('get_leaderboard', { lim: limit, off: from })

    if (!rpcErr && rpcData) {
      rows = rpcData
    } else {
      const { data: scores } = await supabase
        .from('scores')
        .select('profile_id, score, profiles!inner(player_name)')
        .order('score', { ascending: false })

      if (scores) {
        const map = new Map<string, { name: string; score: number }>()
        for (const s of scores) {
          const pid = s.profile_id
          if (!map.has(pid) || s.score > map.get(pid)!.score) {
            map.set(pid, { name: (s.profiles as any)?.player_name || 'Runner', score: s.score })
          }
        }
        rows = Array.from(map.entries())
          .sort((a, b) => b[1].score - a[1].score)
          .slice(from, from + limit)
          .map(([pid, v]) => ({ profile_id: pid, player_name: v.name, best_score: v.score }))
      }
    }

    const entries: LeaderboardEntry[] = (rows || []).map((r: any, i: number) => ({
      profile_id: r.profile_id,
      player_name: r.player_name,
      score: r.best_score,
      rank: from + i + 1,
      is_you: r.profile_id === profileId,
    }))

    const { data: yourBestRow } = await supabase
      .from('scores')
      .select('score')
      .eq('profile_id', profileId)
      .order('score', { ascending: false })
      .limit(1)

    const yourBest = yourBestRow?.[0]?.score || 0

    let yourRank = 0
    if (yourBest > 0) {
      const { count } = await supabase
        .from('scores')
        .select('*', { count: 'exact', head: true })
        .gt('score', yourBest)
      yourRank = (count || 0) + 1
    }

    return { entries, yourRank, yourBest }
  } catch {
    return { entries: [], yourRank: 0, yourBest: 0 }
  }
}

export async function getDailyLeaderboard(
  profileId: string
): Promise<{ entries: LeaderboardEntry[]; yourRank: number; yourBest: number }> {
  try {
    const today = new Date().toISOString().slice(0, 10)

    let rows: any[] | null = null
    const { data: rpcData, error: rpcErr } = await supabase
      .rpc('get_daily_leaderboard', { day: today })

    if (!rpcErr && rpcData) {
      rows = rpcData
    } else {
      const { data: scores } = await supabase
        .from('scores')
        .select('profile_id, score, profiles!inner(player_name)')
        .gte('created_at', today)
        .order('score', { ascending: false })

      if (scores) {
        const map = new Map<string, { name: string; score: number }>()
        for (const s of scores) {
          const pid = s.profile_id
          if (!map.has(pid) || s.score > map.get(pid)!.score) {
            map.set(pid, { name: (s.profiles as any)?.player_name || 'Runner', score: s.score })
          }
        }
        rows = Array.from(map.entries())
          .sort((a, b) => b[1].score - a[1].score)
          .slice(0, 100)
          .map(([pid, v]) => ({ profile_id: pid, player_name: v.name, best_score: v.score }))
      }
    }

    const entries: LeaderboardEntry[] = (rows || []).map((r: any, i: number) => ({
      profile_id: r.profile_id,
      player_name: r.player_name,
      score: r.best_score,
      rank: i + 1,
      is_you: r.profile_id === profileId,
    }))

    const { data: yourBestRow } = await supabase
      .from('scores')
      .select('score')
      .eq('profile_id', profileId)
      .gte('created_at', today)
      .order('score', { ascending: false })
      .limit(1)

    const yourBest = yourBestRow?.[0]?.score || 0

    let yourRank = 0
    if (yourBest > 0) {
      const { count } = await supabase
        .from('scores')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)
        .gt('score', yourBest)
      yourRank = (count || 0) + 1
    }

    return { entries, yourRank, yourBest }
  } catch {
    return { entries: [], yourRank: 0, yourBest: 0 }
  }
}
