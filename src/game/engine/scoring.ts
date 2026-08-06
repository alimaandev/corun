/** Pure scoring helpers shared across all game modes. */

export const COMBO_MULTIPLIERS = [1, 1, 1, 1.5, 1.5, 2, 2, 3, 3, 4]

export function getComboMultiplier(streak: number): number {
  if (streak >= 10) return 4
  return COMBO_MULTIPLIERS[streak] ?? 1
}

export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.floor(Math.max(0, value))
}
