/**
 * Pure runner simulation — the heart of the endless/theme runner.
 *
 * No DOM, no timers, no randomness captured implicitly: `stepRunner` takes
 * `dt`, `nowMs` and an injected `rng`, and returns a NEW state plus events.
 * This makes physics, scoring and game-over logic fully unit-testable.
 *
 * Behavior mirrors the original PixelRunner loop exactly (including the quirk
 * that obstacles keep scrolling while paused); intentional game-feel changes
 * belong in later phases.
 */

import { clampLane, Lane } from './coordinates'

export const RUNNER = {
  gapStart: 60,
  gapMax: 100,
  gapMin: 5,
  gapDrainPerSec: 1.8,
  correctBoost: 25,
  wrongPenalty: 18,
  timeoutPenalty: 30,
  boostDurationMs: 3500,
  penaltyDurationMs: 2000,
  baseSpeed: 1,
  boostSpeed: 2.0,
  penaltySpeed: 0.5,
  /** world units per second per speed unit at 60fps (speed * 4 * 60) */
  scrollPxPerSecPerSpeed: 240,
  scoreBoostPerSec: 10,
  scorePenaltyPerSec: 3,
  scoreBasePerSec: 6,
  coinValue: 25,
  coinGap: 3,
  barrierGap: 12,
  boostBonusMs: 2000,
  spawnInitialMs: 1000,
  spawnMinMs: 600,
  spawnMaxMs: 1600,
  cullMargin: 30,
  /** distance from viewport bottom to the player's feet (world units) */
  playerBottomOffset: 100,
  /** collision window around playerY (world units) */
  collisionHalfHeight: 20,
} as const

export const OBSTACLE_TYPES = ['barrier', 'coin', 'boost'] as const
export type ObstacleType = (typeof OBSTACLE_TYPES)[number]

export interface RunnerObstacle {
  lane: Lane
  y: number
  type: ObstacleType
  hit: boolean
}

export interface RunnerState {
  phase: 'idle' | 'running' | 'gameover'
  paused: boolean
  score: number
  gap: number
  speed: number
  streak: number
  currentLane: Lane
  displayLane: number
  boostUntil: number
  penaltyUntil: number
  scrollY: number
  screenShake: number
  flashTimer: number
  flashGreen: boolean
  multiplier: number
  obstacles: RunnerObstacle[]
  spawnTimerMs: number
}

export type RunnerCommand =
  | { type: 'start' }
  | { type: 'moveLane'; dir: -1 | 1 }
  | { type: 'answer'; correct: boolean }
  | { type: 'timeout' }
  | { type: 'setMultiplier'; multiplier: number }
  | { type: 'setPaused'; paused: boolean }

export type RunnerEvent =
  | { type: 'barrierHit' }
  | { type: 'coinCollected'; value: number }
  | { type: 'boostCollected' }
  | { type: 'gameOver'; score: number }

export interface RunnerConfig {
  viewportHeight: number
  rng?: () => number
}

export function createRunnerState(): RunnerState {
  return {
    phase: 'idle',
    paused: false,
    score: 0,
    gap: RUNNER.gapStart,
    speed: RUNNER.baseSpeed,
    streak: 0,
    currentLane: 0,
    displayLane: 0,
    boostUntil: 0,
    penaltyUntil: 0,
    scrollY: 0,
    screenShake: 0,
    flashTimer: 0,
    flashGreen: false,
    multiplier: 1,
    obstacles: [],
    spawnTimerMs: RUNNER.spawnInitialMs,
  }
}

export function playerY(viewportHeight: number): number {
  return viewportHeight - RUNNER.playerBottomOffset
}

/** 0..1 — how close the monster is to catching the player. */
export function dangerLevel(gap: number): number {
  return Math.max(0, Math.min(1, (RUNNER.gapStart - gap) / RUNNER.gapStart))
}

function pickSpawnType(rng: () => number): ObstacleType {
  const roll = rng()
  // weighted: barrier, coin, barrier, coin, coin, boost
  if (roll < 1 / 6) return 'barrier'
  if (roll < 2 / 6) return 'coin'
  if (roll < 3 / 6) return 'barrier'
  if (roll < 4 / 6) return 'coin'
  if (roll < 5 / 6) return 'coin'
  return 'boost'
}

function applyAnswer(state: RunnerState, nowMs: number, correct: boolean): RunnerState {
  if (correct) {
    return {
      ...state,
      gap: Math.min(RUNNER.gapMax, state.gap + RUNNER.correctBoost),
      streak: state.streak + 1,
      boostUntil: nowMs + RUNNER.boostDurationMs,
      flashTimer: 0.3,
      flashGreen: true,
    }
  }
  return {
    ...state,
    gap: Math.max(RUNNER.gapMin, state.gap - RUNNER.wrongPenalty),
    streak: 0,
    penaltyUntil: nowMs + RUNNER.penaltyDurationMs,
    screenShake: 0.5,
    flashTimer: 0.3,
    flashGreen: false,
  }
}

function applyTimeout(state: RunnerState, nowMs: number): RunnerState {
  return {
    ...state,
    gap: Math.max(RUNNER.gapMin, state.gap - RUNNER.timeoutPenalty),
    streak: 0,
    penaltyUntil: nowMs + RUNNER.penaltyDurationMs,
    screenShake: 0.8,
    flashTimer: 0.3,
    flashGreen: false,
  }
}

export function applyCommand(
  state: RunnerState,
  command: RunnerCommand,
  nowMs: number,
): RunnerState {
  switch (command.type) {
    case 'start':
      return { ...createRunnerState(), phase: 'running' }
    case 'moveLane':
      if (state.phase !== 'running') return state
      return { ...state, currentLane: clampLane(state.currentLane + command.dir) }
    case 'answer':
      if (state.phase !== 'running') return state
      return applyAnswer(state, nowMs, command.correct)
    case 'timeout':
      if (state.phase !== 'running') return state
      return applyTimeout(state, nowMs)
    case 'setMultiplier':
      return { ...state, multiplier: command.multiplier }
    case 'setPaused':
      return { ...state, paused: command.paused }
  }
}

export function stepRunner(
  state: RunnerState,
  dt: number,
  nowMs: number,
  config: RunnerConfig,
): { state: RunnerState; events: RunnerEvent[] } {
  if (state.phase !== 'running') return { state, events: [] }

  const rng = config.rng ?? Math.random
  const events: RunnerEvent[] = []
  const h = config.viewportHeight
  const py = playerY(h)

  let s = state

  if (!s.paused) {
    s = { ...s, scrollY: s.scrollY + s.speed * (RUNNER.scrollPxPerSecPerSpeed / 60) * dt * 60 }

    if (nowMs < s.boostUntil) {
      s = {
        ...s,
        speed: RUNNER.boostSpeed,
        score: s.score + RUNNER.scoreBoostPerSec * dt * s.multiplier,
      }
    } else if (nowMs < s.penaltyUntil) {
      s = {
        ...s,
        speed: RUNNER.penaltySpeed,
        score: s.score + RUNNER.scorePenaltyPerSec * dt * s.multiplier,
      }
    } else {
      s = {
        ...s,
        speed: RUNNER.baseSpeed,
        score: s.score + RUNNER.scoreBasePerSec * dt * s.multiplier,
      }
    }

    s = { ...s, gap: s.gap - RUNNER.gapDrainPerSec * s.speed * dt }
  }

  s = { ...s, displayLane: s.displayLane + (s.currentLane - s.displayLane) * 0.15 }

  const obstacles: RunnerObstacle[] = []
  for (const obs of s.obstacles) {
    let o = { ...obs, y: obs.y + s.speed * (RUNNER.scrollPxPerSecPerSpeed / 60) * dt * 60 }
    if (o.y > h + RUNNER.cullMargin) continue
    if (
      !o.hit &&
      o.y > py - RUNNER.collisionHalfHeight &&
      o.y < py + RUNNER.collisionHalfHeight &&
      o.lane === Math.round(s.displayLane)
    ) {
      o = { ...o, hit: true }
      if (o.type === 'barrier') {
        s = {
          ...s,
          gap: Math.max(RUNNER.gapMin, s.gap - RUNNER.barrierGap),
          screenShake: 0.4,
          flashTimer: 0.2,
          flashGreen: false,
        }
        events.push({ type: 'barrierHit' })
      } else if (o.type === 'coin') {
        s = {
          ...s,
          score: s.score + RUNNER.coinValue * s.multiplier,
          gap: Math.min(RUNNER.gapMax, s.gap + RUNNER.coinGap),
          flashTimer: 0.15,
          flashGreen: true,
        }
        events.push({ type: 'coinCollected', value: RUNNER.coinValue * s.multiplier })
      } else {
        s = { ...s, boostUntil: nowMs + RUNNER.boostBonusMs, flashTimer: 0.2, flashGreen: true }
        events.push({ type: 'boostCollected' })
      }
    }
    obstacles.push(o)
  }
  s = { ...s, obstacles }

  let spawnTimerMs = s.spawnTimerMs - dt * 1000
  if (spawnTimerMs <= 0) {
    const lane = (Math.floor(rng() * 3) - 1) as Lane
    const blocked = s.obstacles.some((o) => o.lane === lane && !o.hit && o.y < 100)
    if (!blocked) {
      s = {
        ...s,
        obstacles: [...s.obstacles, { lane, y: -30, type: pickSpawnType(rng), hit: false }],
      }
    }
    spawnTimerMs = RUNNER.spawnMinMs + rng() * (RUNNER.spawnMaxMs - RUNNER.spawnMinMs)
  }
  s = { ...s, spawnTimerMs }

  if (s.screenShake > 0) {
    const shake = s.screenShake * 0.9
    s = { ...s, screenShake: shake < 0.01 ? 0 : shake }
  }
  if (s.flashTimer > 0) {
    s = { ...s, flashTimer: s.flashTimer - dt }
  }

  if (s.gap <= 0) {
    s = { ...s, gap: 0, phase: 'gameover' }
    events.push({ type: 'gameOver', score: Math.floor(s.score) })
  }

  return { state: s, events }
}
