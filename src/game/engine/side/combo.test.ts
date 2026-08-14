import { describe, it, expect } from 'vitest'
import { createCombo, recordComboAnswer, updateCombo, comboOnFire } from './combo'
import { SIDE } from './types'

describe('combo', () => {
  it('starts empty', () => {
    const c = createCombo()
    expect(c.streak).toBe(0)
    expect(c.multiplier).toBe(1)
    expect(c.fireUntil).toBe(0)
  })

  it('increments streak on correct answers', () => {
    let c = createCombo()
    for (let i = 0; i < 3; i++) c = recordComboAnswer(c, true, 1000)
    expect(c.streak).toBe(3)
    expect(c.multiplier).toBe(1.5)
  })

  it('resets on wrong answer', () => {
    let c = createCombo()
    c = recordComboAnswer(c, true, 0)
    c = recordComboAnswer(c, true, 0)
    c = recordComboAnswer(c, false, 0)
    expect(c.streak).toBe(0)
    expect(c.multiplier).toBe(1)
    expect(c.fireUntil).toBe(0)
  })

  it('fires after SIDE.comboFireAt correct answers', () => {
    let c = createCombo()
    for (let i = 0; i < SIDE.comboFireAt; i++) c = recordComboAnswer(c, true, 1000)
    expect(c.fireUntil).toBeGreaterThan(0)
    expect(comboOnFire(c, 1000)).toBe(true)
    expect(comboOnFire(c, 1000 + c.windowMs + 1)).toBe(false)
  })

  it('expires fire window', () => {
    let c = createCombo(200)
    for (let i = 0; i < SIDE.comboFireAt; i++) c = recordComboAnswer(c, true, 0)
    expect(comboOnFire(c, 100)).toBe(true)
    c = updateCombo(c, 1000)
    expect(comboOnFire(c, 1000)).toBe(false)
  })

  it('tracks best streak', () => {
    let c = createCombo()
    for (let i = 0; i < 4; i++) c = recordComboAnswer(c, true, 0)
    c = recordComboAnswer(c, false, 0)
    c = recordComboAnswer(c, true, 0)
    c = recordComboAnswer(c, true, 0)
    expect(c.best).toBe(4)
  })
})
