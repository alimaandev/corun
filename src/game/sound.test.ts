import { describe, it, expect } from 'vitest'
import {
  playSuccess,
  playError,
  playInteract,
  playLevelComplete,
  playBossAppear,
  playStep,
  playGameOver,
} from './sound'

describe('sound module', () => {
  it('exports all 7 play functions', () => {
    const fns = [
      playSuccess,
      playError,
      playInteract,
      playLevelComplete,
      playBossAppear,
      playStep,
      playGameOver,
    ]
    expect(fns).toHaveLength(7)
    for (const fn of fns) {
      expect(typeof fn).toBe('function')
    }
  })

  it('play functions do not throw when audio context is unavailable', () => {
    const fns = [
      playSuccess,
      playError,
      playInteract,
      playLevelComplete,
      playBossAppear,
      playStep,
      playGameOver,
    ]
    for (const fn of fns) {
      expect(() => fn()).not.toThrow()
    }
  })
})
