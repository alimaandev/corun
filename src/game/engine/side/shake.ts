export const MAX_TRAUMA = 1

export interface ShakeState {
  trauma: number
  time: number
}

function shakeMagnitude(s: ShakeState): number {
  return s.trauma * s.trauma
}

export function addTrauma(s: ShakeState, amount: number): ShakeState {
  return { ...s, trauma: Math.min(MAX_TRAUMA, s.trauma + amount) }
}

export function updateShake(s: ShakeState, dt: number): ShakeState {
  const decay = Math.min(1, dt / 0.9)
  return { trauma: Math.max(0, s.trauma - decay * 1.4 * s.trauma), time: s.time + dt }
}

export function shakeOffset(s: ShakeState, amp: number): { x: number; y: number } {
  const m = shakeMagnitude(s)
  if (m <= 0) return { x: 0, y: 0 }
  const x = Math.sin(s.time * 97.3) * amp * m
  const y = Math.cos(s.time * 83.1) * amp * m * 0.7
  return { x, y }
}
