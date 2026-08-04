import { describe, it, expect, beforeEach } from 'vitest'
import Dexie from 'dexie'
import { db, resetDatabase } from './db'
import {
  getHighScore,
  setHighScore,
  getLevelProgress,
  saveLevelProgress,
  isDailyCompleted,
  markDailyCompleted,
  getSavedBadges,
  saveBadge,
  getLeaderboard,
  addToLeaderboard,
  getRunSession,
  saveRunSession,
  clearRunSession,
  SESSION_TTL_MS,
  DEFAULT_LEVEL_PROGRESS,
} from './storage'
import type { LevelProgress } from '../game/types'

beforeEach(async () => {
  localStorage.clear()
  await resetDatabase()
})

describe('high score', () => {
  it('returns 0 when nothing is stored', async () => {
    expect(await getHighScore()).toBe(0)
  })

  it('persists and reads back the high score', async () => {
    await setHighScore(420)
    await setHighScore(500)
    expect(await getHighScore()).toBe(500)
  })
})

describe('level progress', () => {
  it('returns the default progress when nothing is stored', async () => {
    expect(await getLevelProgress()).toEqual(DEFAULT_LEVEL_PROGRESS)
  })

  it('round-trips saved progress', async () => {
    const progress: LevelProgress = {
      unlockedUpTo: 5,
      completed: [1, 2, 3],
      stars: { '1': 3, '2': 2 },
    }
    await saveLevelProgress(progress)
    expect(await getLevelProgress()).toEqual(progress)
  })

  it('overwrites previous progress', async () => {
    await saveLevelProgress({ unlockedUpTo: 1, completed: [], stars: {} })
    const updated: LevelProgress = { unlockedUpTo: 2, completed: [1], stars: { '1': 3 } }
    await saveLevelProgress(updated)
    expect(await getLevelProgress()).toEqual(updated)
  })
})

describe('daily completion', () => {
  it('returns false when not completed', async () => {
    expect(await isDailyCompleted()).toBe(false)
  })

  it('returns true after marking completed', async () => {
    await markDailyCompleted()
    expect(await isDailyCompleted()).toBe(true)
  })
})

describe('badges', () => {
  it('returns an empty list by default', async () => {
    expect(await getSavedBadges()).toEqual([])
  })

  it('saves a badge through the outbox', async () => {
    await saveBadge('javascript')
    expect(await getSavedBadges()).toEqual(['javascript'])
  })

  it('does not duplicate badges', async () => {
    await saveBadge('algorithms')
    await saveBadge('algorithms')
    expect(await getSavedBadges()).toEqual(['algorithms'])
  })
})

describe('local leaderboard', () => {
  it('returns an empty list by default', async () => {
    expect(await getLeaderboard()).toEqual([])
  })

  it('keeps the top 10 entries sorted by score', async () => {
    for (let i = 1; i <= 12; i++) {
      await addToLeaderboard(i * 100)
    }
    const lb = await getLeaderboard()
    expect(lb).toHaveLength(10)
    expect(lb[0].score).toBe(1200)
    expect(lb[9].score).toBe(300)
  })
})

describe('run session', () => {
  it('returns null when no session is saved', async () => {
    expect(await getRunSession()).toBeNull()
  })

  it('round-trips a saved session', async () => {
    await saveRunSession({
      mode: 'speedrun',
      topic: null,
      difficulty: 'easy',
      score: 420,
      isDaily: false,
    })
    const session = await getRunSession()
    expect(session).toMatchObject({
      mode: 'speedrun',
      score: 420,
      isDaily: false,
    })
    expect(session!.savedAt).toBeTruthy()
  })

  it('clears a saved session', async () => {
    await saveRunSession({
      mode: 'normal',
      topic: 'javascript',
      difficulty: 'medium',
      score: 10,
      isDaily: false,
    })
    await clearRunSession()
    expect(await getRunSession()).toBeNull()
  })

  it('expires stale sessions and cleans them up', async () => {
    await saveRunSession({
      mode: 'normal',
      topic: null,
      difficulty: 'medium',
      score: 10,
      isDaily: false,
    })
    const row = await db.settings.get('runSession')
    if (!row) throw new Error('session row missing')
    row.value = {
      ...(row.value as object),
      savedAt: new Date(Date.now() - SESSION_TTL_MS - 1000).toISOString(),
    }
    await db.settings.put(row)

    expect(await getRunSession()).toBeNull()
    expect(await db.settings.get('runSession')).toBeUndefined()
  })
})

describe('v2 migration from localStorage', () => {
  // Simulates a user with the shipped v1 database: create the DB at
  // schema v1 only, then let the real instance open it and run the
  // v2 upgrade (which reads the legacy localStorage keys).
  async function seedLegacyV1Database() {
    await db.delete()
    const legacy = new Dexie('CorunDB')
    legacy.version(1).stores({
      profiles: 'id, player_name, last_seen',
      scores: '++id, profile_id, score, mode, created_at',
    })
    await legacy.open()
    await legacy.close()
    await db.open()
  }

  it('migrates all legacy keys and removes them', async () => {
    const stored: LevelProgress = {
      unlockedUpTo: 4,
      completed: [1, 2],
      stars: { '1': 3, '2': 2, '3': 1 },
    }
    localStorage.setItem('coderun_highscore', '900')
    localStorage.setItem('code_level_progress', JSON.stringify(stored))
    localStorage.setItem('code_daily_2025-08-04', 'done')
    localStorage.setItem('code_badges', JSON.stringify(['javascript', 'web']))
    localStorage.setItem('code_leaderboard', JSON.stringify([{ score: 500, date: '2026-08-01' }]))

    await seedLegacyV1Database()

    expect(await getHighScore()).toBe(900)
    expect(await getLevelProgress()).toEqual(stored)
    expect(await isDailyCompleted()).toBe(false)
    expect(await getSavedBadges()).toEqual(['javascript', 'web'])
    expect(await getLeaderboard()).toEqual([{ score: 500, date: '2026-08-01' }])

    expect(localStorage.getItem('coderun_highscore')).toBeNull()
    expect(localStorage.getItem('code_level_progress')).toBeNull()
    expect(localStorage.getItem('code_daily_2025-08-04')).toBeNull()
    expect(localStorage.getItem('code_badges')).toBeNull()
    expect(localStorage.getItem('code_leaderboard')).toBeNull()
  })

  it('skips corrupt legacy data gracefully', async () => {
    localStorage.setItem('code_level_progress', '{invalid}')
    localStorage.setItem('coderun_highscore', 'not-a-number')

    await seedLegacyV1Database()

    expect(await getHighScore()).toBe(0)
    expect(await getLevelProgress()).toEqual(DEFAULT_LEVEL_PROGRESS)
    expect(localStorage.getItem('code_level_progress')).toBeNull()
    expect(localStorage.getItem('coderun_highscore')).toBeNull()
  })

  it('migrates only past daily markers, not a future one', async () => {
    localStorage.setItem('code_daily_2025-12-25', 'done')
    localStorage.setItem('code_daily_nonsense', 'done')

    await seedLegacyV1Database()

    const dates = await db.daily.toArray()
    expect(dates.map((d) => d.date)).toEqual(['2025-12-25'])
  })
})
