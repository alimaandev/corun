import { describe, it, expect, beforeEach } from 'vitest'
import { db, resetDatabase } from '../../../lib/db'
import {
  completeStoryLevel,
  emptyProgress,
  getStoryProgress,
  isStoryLevelUnlocked,
  saveStoryProgress,
  starsForNode,
  storyStarsTotal,
} from './progress'
import { STORY_NODES } from './levels'

beforeEach(async () => {
  localStorage.clear()
  await resetDatabase()
})

describe('story progress', () => {
  it('starts empty', async () => {
    const p = await getStoryProgress()
    expect(p.unlockedUpTo).toBe(0)
    expect(Object.keys(p.completed)).toHaveLength(0)
  })

  it('persists progress rows', async () => {
    const p = emptyProgress()
    await saveStoryProgress({ ...p, unlockedUpTo: 2 })
    const back = await getStoryProgress()
    expect(back.unlockedUpTo).toBe(2)
  })

  it('unlocks only the first node initially', () => {
    const p = emptyProgress()
    expect(isStoryLevelUnlocked(STORY_NODES[0], p)).toBe(true)
    expect(isStoryLevelUnlocked(STORY_NODES[1], p)).toBe(false)
    expect(isStoryLevelUnlocked(STORY_NODES[3], p)).toBe(false)
  })

  it('completing a node unlocks the next and stores stars', async () => {
    await completeStoryLevel(STORY_NODES[0], 3, 1200)
    const p = await getStoryProgress()
    expect(isStoryLevelUnlocked(STORY_NODES[1], p)).toBe(true)
    expect(starsForNode(STORY_NODES[0], p)).toBe(3)
    expect(p.completed[STORY_NODES[0].id]?.best_score).toBe(1200)
  })

  it('keeps the best stars and score', async () => {
    await completeStoryLevel(STORY_NODES[0], 2, 800)
    await completeStoryLevel(STORY_NODES[0], 3, 500)
    const p = await getStoryProgress()
    expect(starsForNode(STORY_NODES[0], p)).toBe(3)
    expect(p.completed[STORY_NODES[0].id]?.best_score).toBe(800)
  })

  it('boss completion does not unlock anything beyond itself', async () => {
    await completeStoryLevel(STORY_NODES[0], 1, 100)
    await completeStoryLevel(STORY_NODES[1], 2, 200)
    await completeStoryLevel(STORY_NODES[2], 3, 300)
    const p = await getStoryProgress()
    expect(p.unlockedUpTo).toBe(3)
    await completeStoryLevel(STORY_NODES[3], 2, 400)
    const after = await getStoryProgress()
    expect(after.unlockedUpTo).toBe(3)
  })

  it('tallies total stars', async () => {
    await completeStoryLevel(STORY_NODES[0], 2, 100)
    await completeStoryLevel(STORY_NODES[1], 1, 100)
    const p = await getStoryProgress()
    expect(storyStarsTotal(p)).toBe(3)
  })

  it('row exists in the storyProgress table', async () => {
    await saveStoryProgress({ unlockedUpTo: 1, completed: {} })
    const rows = await db.storyProgress.toArray()
    expect(rows.length).toBe(1)
    expect(rows[0].id).toBe('main')
  })
})
