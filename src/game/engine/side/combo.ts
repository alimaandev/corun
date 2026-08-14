import { SIDE, SideCombo } from './types'

export function createCombo(windowMs: number = SIDE.comboWindowMs): SideCombo {
  return { streak: 0, best: 0, multiplier: 1, fireUntil: 0, windowMs }
}

export function recordComboAnswer(c: SideCombo, correct: boolean, nowMs: number): SideCombo {
  if (!correct) {
    return { ...c, streak: 0, multiplier: 1, fireUntil: 0 }
  }
  const streak = c.streak + 1
  const multiplier = streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1
  const fire = streak >= SIDE.comboFireAt
  return {
    ...c,
    streak,
    best: Math.max(c.best, streak),
    multiplier,
    fireUntil: fire ? nowMs + c.windowMs : c.fireUntil,
  }
}

export function updateCombo(c: SideCombo, nowMs: number): SideCombo {
  if (c.fireUntil > 0 && nowMs > c.fireUntil) {
    return { ...c, fireUntil: 0 }
  }
  return c
}

export function comboOnFire(c: SideCombo, nowMs: number): boolean {
  return c.streak >= SIDE.comboFireAt && nowMs <= c.fireUntil
}
