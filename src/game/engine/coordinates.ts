/**
 * Canonical coordinate system for the runner.
 *
 * The simulation works in abstract "lane units":
 *   - X: lane index, -1 | 0 | 1 (integer target, float for smoothing)
 *   - Y: world units where 1 unit == 1 CSS pixel at scale 1; the renderer is
 *     responsible for mapping world units to screen pixels (DPR, zoom).
 *
 * All renderers (canvas, future WebGL) convert from canonical units only —
 * never the other way around.
 */

export const LANES = [-1, 0, 1] as const
export type Lane = -1 | 0 | 1

export const LANE_COUNT = 3

export function isLane(value: number): value is Lane {
  return value === -1 || value === 0 || value === 1
}

export function clampLane(value: number): Lane {
  if (value <= -1) return -1
  if (value >= 1) return 1
  return 0
}

/**
 * Convert a lane index to its centered x-position in world units.
 * Road spans lanes -1..1; `laneWidth` is the width of one lane.
 */
export function laneCenterX(lane: number, laneWidth: number): number {
  return (lane + 1) * laneWidth + laneWidth / 2
}

/** Road left edge given a total width and lane width (road is centered). */
export function roadLeftX(totalWidth: number, laneWidth: number): number {
  return (totalWidth - laneWidth * LANE_COUNT) / 2
}
