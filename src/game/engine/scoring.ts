/** Pure scoring helpers shared across all game modes. */

export const COMBO_MULTIPLIERS = [1, 1, 1, 1.5, 1.5, 2, 2, 3, 3, 4]

export function getComboMultiplier(streak: number): number {
  if (streak >= 10) return 4
  return COMBO_MULTIPLIERS[streak] ?? 1
}

export type StarRating = 1 | 2 | 3

/**
 * Story level star rating from puzzle accuracy (0..1) and score ratio (0..1).
 * Matches Game.tsx: combined >= 0.8 → 3 stars, >= 0.5 → 2 stars, else 1.
 */
export function getLevelStars(accuracy: number, scoreRatio: number): StarRating {
  const combined = (Math.min(1, accuracy) + Math.min(1, scoreRatio)) / 2
  if (combined >= 0.8) return 3
  if (combined >= 0.5) return 2
  return 1
}

export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.floor(Math.max(0, value))
}
