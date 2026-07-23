import { describe, it, expect, beforeEach } from 'vitest'
import {
  ALL_LEVELS,
  ENDING_SCENE,
  getLevelProgress,
  saveLevelProgress,
  isLevelUnlocked,
} from './levels'
import type { LevelProgress } from './types'

beforeEach(() => {
  localStorage.clear()
})

describe('ALL_LEVELS', () => {
  it('has 9 levels', () => {
    expect(ALL_LEVELS).toHaveLength(9)
  })

  it('levels are sequential starting from id 1', () => {
    ALL_LEVELS.forEach((level, i) => {
      expect(level.id).toBe(i + 1)
    })
  })

  it('every level has required fields', () => {
    for (const level of ALL_LEVELS) {
      expect(level.name).toBeTruthy()
      expect(level.chapter).toBeTruthy()
      expect(level.arc).toBeTruthy()
      expect(level.scoreTarget).toBeGreaterThan(0)
      expect(level.enemyType).toBeTruthy()
      expect(level.boss).toBeDefined()
      expect(level.boss.name).toBeTruthy()
      expect(level.boss.hp).toBeGreaterThan(0)
      expect(level.sceneIntro).toBeDefined()
      expect(level.sceneOutro).toBeDefined()
    }
  })

  it('every scene intro/outro has required fields', () => {
    for (const level of ALL_LEVELS) {
      for (const scene of [level.sceneIntro, level.sceneOutro]) {
        expect(scene.bgTop).toBeTruthy()
        expect(scene.bgBottom).toBeTruthy()
        expect(scene.groundColor).toBeTruthy()
        expect(scene.wallColor).toBeTruthy()
        expect(Array.isArray(scene.elements)).toBe(true)
        expect(Array.isArray(scene.script)).toBe(true)
      }
    }
  })

  it('has three arcs with correct level counts', () => {
    const arcs = new Map<string, number>()
    for (const level of ALL_LEVELS) {
      arcs.set(level.arc, (arcs.get(level.arc) || 0) + 1)
    }
    expect(arcs.get('ESCAPE')).toBe(3)
    expect(arcs.get('THE JOURNEY')).toBe(3)
    expect(arcs.get('THE CASTLE')).toBe(3)
  })
})

describe('ENDING_SCENE', () => {
  it('has required fields', () => {
    expect(ENDING_SCENE.bgTop).toBeTruthy()
    expect(ENDING_SCENE.bgBottom).toBeTruthy()
    expect(ENDING_SCENE.groundColor).toBeTruthy()
    expect(ENDING_SCENE.wallColor).toBeTruthy()
    expect(ENDING_SCENE.script.length).toBeGreaterThan(0)
  })
})

describe('getLevelProgress', () => {
  it('returns default progress when nothing is stored', () => {
    const progress = getLevelProgress()
    expect(progress).toEqual({ unlockedUpTo: 1, completed: [], stars: {} })
  })

  it('returns stored progress from localStorage', () => {
    const stored: LevelProgress = {
      unlockedUpTo: 5,
      completed: [1, 2, 3],
      stars: { '1': 3, '2': 2 },
    }
    localStorage.setItem('code_level_progress', JSON.stringify(stored))
    expect(getLevelProgress()).toEqual(stored)
  })

  it('returns default on corrupt data', () => {
    localStorage.setItem('code_level_progress', '{invalid}')
    expect(getLevelProgress()).toEqual({ unlockedUpTo: 1, completed: [], stars: {} })
  })
})

describe('saveLevelProgress', () => {
  it('saves progress to localStorage', () => {
    const progress: LevelProgress = { unlockedUpTo: 3, completed: [1], stars: { '1': 3 } }
    saveLevelProgress(progress)
    const raw = localStorage.getItem('code_level_progress')
    expect(JSON.parse(raw!)).toEqual(progress)
  })

  it('overwrites previous progress', () => {
    const old: LevelProgress = { unlockedUpTo: 1, completed: [], stars: {} }
    const updated: LevelProgress = { unlockedUpTo: 2, completed: [1], stars: { '1': 3 } }
    saveLevelProgress(old)
    saveLevelProgress(updated)
    expect(getLevelProgress()).toEqual(updated)
  })
})

describe('isLevelUnlocked', () => {
  it('unlocks level 1 by default', () => {
    const progress: LevelProgress = { unlockedUpTo: 1, completed: [], stars: {} }
    expect(isLevelUnlocked(1, progress)).toBe(true)
  })

  it('locks levels beyond progress', () => {
    const progress: LevelProgress = { unlockedUpTo: 3, completed: [], stars: {} }
    expect(isLevelUnlocked(4, progress)).toBe(false)
    expect(isLevelUnlocked(10, progress)).toBe(false)
  })

  it('unlocks all levels up to unlockedUpTo', () => {
    const progress: LevelProgress = { unlockedUpTo: 5, completed: [], stars: {} }
    for (let i = 1; i <= 5; i++) {
      expect(isLevelUnlocked(i, progress)).toBe(true)
    }
  })
})
