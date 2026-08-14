import Dexie, { type EntityTable } from 'dexie'

export interface Profile {
  id: string
  player_name: string
  last_seen: string
}

export interface ScoreRow {
  id?: number
  profile_id: string
  player_name: string
  score: number
  mode: 'freeplay' | 'story' | 'daily'
  level_id: number
  created_at: string
}

export interface BadgeRow {
  id?: number
  topic: string
  earned_at: string
}

export interface DailyRow {
  date: string
  completed_at: string
}

export interface StoryProgressRow {
  id: string
  unlocked_up_to: number
  completed: Record<string, StoryProgressEntry>
  updated_at: string
}

export interface StoryProgressEntry {
  stars: number
  best_score: number
  completed_at: string
}

export interface SettingRow {
  key: string
  value: unknown
}

export type OutboxStatus = 'pending' | 'delivered' | 'failed'

export interface OutboxRow {
  id: number
  type: string
  payload: unknown
  status: OutboxStatus
  attempts: number
  next_attempt_at: number
  created_at: string
}

const db = new Dexie('CorunDB') as Dexie & {
  profiles: EntityTable<Profile, 'id'>
  scores: EntityTable<ScoreRow, 'id'>
  badges: EntityTable<BadgeRow, 'id'>
  daily: EntityTable<DailyRow, 'date'>
  settings: EntityTable<SettingRow, 'key'>
  outbox: EntityTable<OutboxRow, 'id'>
  storyProgress: EntityTable<StoryProgressRow, 'id'>
}

db.version(1).stores({
  profiles: 'id, player_name, last_seen',
  scores: '++id, profile_id, score, mode, created_at',
})

// v2: move remaining game state from localStorage into IndexedDB and
// introduce the outbox journal for durable, retryable writes.
db.version(2)
  .stores({
    badges: '++id, &topic, earned_at',
    daily: '&date, completed_at',
    settings: '&key, value',
    outbox: '++id, type, status, next_attempt_at, created_at',
  })
  .upgrade(async (tx) => {
    const read = (key: string): string | null => {
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    }
    const remove = (key: string) => {
      try {
        localStorage.removeItem(key)
      } catch {}
    }
    const now = new Date().toISOString()

    // High score
    const highScoreRaw = read('coderun_highscore')
    if (highScoreRaw) {
      const value = parseInt(highScoreRaw, 10)
      if (!isNaN(value)) {
        await tx.table('settings').put({ key: 'highScore', value })
      }
      remove('coderun_highscore')
    }

    // Daily completion markers (keyed by date)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('code_daily_')) {
        const date = key.slice('code_daily_'.length)
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          await tx.table('daily').put({ date, completed_at: now })
        }
        remove(key)
      }
    }

    // Badges
    const badgesRaw = read('code_badges')
    if (badgesRaw) {
      try {
        const topics = JSON.parse(badgesRaw) as string[]
        for (const topic of topics) {
          await tx.table('badges').put({ topic, earned_at: now })
        }
      } catch {}
      remove('code_badges')
    }

    // Local top-10 leaderboard (anonymous entries)
    const lbRaw = read('code_leaderboard')
    if (lbRaw) {
      try {
        const entries = JSON.parse(lbRaw) as { score: number; date: string }[]
        for (const e of entries) {
          await tx.table('scores').add({
            profile_id: 'local',
            player_name: 'Runner',
            score: e.score,
            mode: 'freeplay',
            level_id: 0,
            created_at: e.date,
          })
        }
      } catch {}
      remove('code_leaderboard')
    }
  })

// v3: story mode progress (campaign nodes, stars, best scores).
db.version(3).stores({
  storyProgress: '&id, unlocked_up_to, updated_at',
})

export async function resetDatabase(): Promise<void> {
  await db.delete()
  await db.open()
}

export { db }
