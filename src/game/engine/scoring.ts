/** Pure scoring helpers shared across all game modes. */

export const COMBO_MULTIPLIERS = [1, 1, 1, 1.5, 1.5, 2, 2, 3, 3, 4]

export function getComboMultiplier(streak: number): number {
  if (streak >= 10) return 4
  return COMBO_MULTIPLIERS[streak] ?? 1
}
