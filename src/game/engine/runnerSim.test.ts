import { describe, it, expect } from 'vitest'
import {
  applyCommand,
  createRunnerState,
  dangerLevel,
  playerY,
  RUNNER,
  stepRunner,
} from './runnerSim'

const VIEWPORT_H = 800

function seededRng(values: number[]) {
  let i = 0
  return () => values[i++ % values.length]
}

describe('createRunnerState', () => {
  it('starts in idle with default values', () => {
    const s = createRunnerState()
    expect(s.phase).toBe('idle')
    expect(s.score).toBe(0)
    expect(s.gap).toBe(RUNNER.gapStart)
    expect(s.speed).toBe(RUNNER.baseSpeed)
    expect(s.streak).toBe(0)
    expect(s.currentLane).toBe(0)
    expect(s.obstacles).toEqual([])
  })
})

describe('applyCommand', () => {
  it('start transitions to running and resets state', () => {
    let s = createRunnerState()
    s = applyCommand(s, { type: 'answer', correct: true }, 0)
    expect(s.phase).toBe('idle')
    s = applyCommand(s, { type: 'start' }, 0)
    expect(s.phase).toBe('running')
    expect(s.score).toBe(0)
    expect(s.gap).toBe(RUNNER.gapStart)
  })

  it('moveLane clamps to -1..1', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 0)
    s = applyCommand(s, { type: 'moveLane', dir: -1 }, 0)
    s = applyCommand(s, { type: 'moveLane', dir: -1 }, 0)
    expect(s.currentLane).toBe(-1)
    s = applyCommand(s, { type: 'moveLane', dir: 1 }, 0)
    s = applyCommand(s, { type: 'moveLane', dir: 1 }, 0)
    s = applyCommand(s, { type: 'moveLane', dir: 1 }, 0)
    expect(s.currentLane).toBe(1)
  })

  it('correct answer boosts gap, streak and speed window', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 1000)
    s = applyCommand(s, { type: 'answer', correct: true }, 1000)
    expect(s.gap).toBe(RUNNER.gapStart + RUNNER.correctBoost)
    expect(s.streak).toBe(1)
    expect(s.boostUntil).toBe(1000 + RUNNER.boostDurationMs)
    expect(s.flashGreen).toBe(true)
  })

  it('wrong answer penalizes gap and resets streak', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 1000)
    s = applyCommand(s, { type: 'answer', correct: true }, 1000)
    s = applyCommand(s, { type: 'answer', correct: false }, 1000)
    expect(s.gap).toBe(RUNNER.gapStart + RUNNER.correctBoost - RUNNER.wrongPenalty)
    expect(s.streak).toBe(0)
    expect(s.penaltyUntil).toBe(1000 + RUNNER.penaltyDurationMs)
  })

  it('timeout penalizes more than a wrong answer', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 1000)
    s = applyCommand(s, { type: 'timeout' }, 1000)
    expect(s.gap).toBe(RUNNER.gapStart - RUNNER.timeoutPenalty)
    expect(s.screenShake).toBe(0.8)
  })

  it('gap never drops below gapMin', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 1000)
    for (let i = 0; i < 10; i++) {
      s = applyCommand(s, { type: 'timeout' }, 1000)
    }
    expect(s.gap).toBe(RUNNER.gapMin)
  })

  it('commands are ignored unless running', () => {
    const s = createRunnerState()
    const moved = applyCommand(s, { type: 'moveLane', dir: 1 }, 0)
    expect(moved.currentLane).toBe(0)
  })
})

describe('stepRunner', () => {
  it('scores and scrolls while running', () => {
    const s = applyCommand(createRunnerState(), { type: 'start' }, 0)
    const { state, events } = stepRunner(s, 1, 1000, {
      viewportHeight: VIEWPORT_H,
      rng: seededRng([0]),
    })
    expect(state.score).toBeCloseTo(RUNNER.scoreBasePerSec)
    expect(state.scrollY).toBe(RUNNER.scrollPxPerSecPerSpeed)
    expect(events).toEqual([])
  })

  it('gap drains over time and game over fires at gap 0', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 0)
    // drain 1.8 * speed per second; 60 gap → ~33.4s
    for (let i = 0; i < 40; i++) {
      const { state } = stepRunner(s, 1, i * 1000, {
        viewportHeight: VIEWPORT_H,
        rng: seededRng([0]),
      })
      s = state
    }
    expect(s.phase).toBe('gameover')
    expect(s.gap).toBe(0)
  })

  it('emits gameOver event exactly once with the score', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 0)
    let gameOverEvents = 0
    let finalScore = 0
    for (let i = 0; i < 100; i++) {
      const { state, events } = stepRunner(s, 1, i * 1000, {
        viewportHeight: VIEWPORT_H,
        rng: seededRng([0]),
      })
      s = state
      for (const e of events) {
        if (e.type === 'gameOver') {
          gameOverEvents++
          finalScore = e.score
        }
      }
      if (s.phase === 'gameover') break
    }
    expect(gameOverEvents).toBe(1)
    expect(finalScore).toBeGreaterThan(0)
  })

  it('boost answer doubles speed and adds 10/s score', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 0)
    s = applyCommand(s, { type: 'answer', correct: true }, 0)
    const { state } = stepRunner(s, 1, 100, { viewportHeight: VIEWPORT_H, rng: seededRng([0]) })
    expect(state.speed).toBe(RUNNER.boostSpeed)
    expect(state.score).toBeCloseTo(RUNNER.scoreBoostPerSec)
  })

  it('spawns an obstacle when timer elapses', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 0)
    s = { ...s, spawnTimerMs: 0.5 }
    const { state } = stepRunner(s, 1, 1000, {
      viewportHeight: VIEWPORT_H,
      rng: seededRng([0, 0.1]),
    })
    expect(state.obstacles.length).toBe(1)
    expect(state.obstacles[0].y).toBe(-30)
    expect(state.spawnTimerMs).toBeGreaterThan(0)
  })

  it('collides with a barrier in the player lane', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 0)
    const py = playerY(VIEWPORT_H)
    // place it so a 1s step scrolls it exactly to the player's y
    s = {
      ...s,
      spawnTimerMs: 5000,
      obstacles: [{ lane: 0, y: py - RUNNER.scrollPxPerSecPerSpeed, type: 'barrier', hit: false }],
    }
    const { state, events } = stepRunner(s, 1, 1000, {
      viewportHeight: VIEWPORT_H,
      rng: seededRng([0]),
    })
    expect(events).toContainEqual({ type: 'barrierHit' })
    expect(state.gap).toBeCloseTo(
      RUNNER.gapStart - RUNNER.barrierGap - RUNNER.gapDrainPerSec * RUNNER.baseSpeed,
    )
    expect(state.obstacles[0].hit).toBe(true)
  })

  it('collects a coin and adds value * multiplier', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 0)
    s = applyCommand(s, { type: 'setMultiplier', multiplier: 2 }, 0)
    const py = playerY(VIEWPORT_H)
    s = {
      ...s,
      spawnTimerMs: 5000,
      obstacles: [{ lane: 0, y: py - RUNNER.scrollPxPerSecPerSpeed, type: 'coin', hit: false }],
    }
    const { state, events } = stepRunner(s, 1, 1000, {
      viewportHeight: VIEWPORT_H,
      rng: seededRng([0]),
    })
    expect(events).toContainEqual({ type: 'coinCollected', value: RUNNER.coinValue * 2 })
    expect(state.score).toBeGreaterThan(0)
  })

  it('does not collide with obstacles in other lanes', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 0)
    const py = playerY(VIEWPORT_H)
    s = {
      ...s,
      spawnTimerMs: 5000,
      obstacles: [{ lane: 1, y: py - RUNNER.scrollPxPerSecPerSpeed, type: 'barrier', hit: false }],
    }
    const { state, events } = stepRunner(s, 1, 1000, {
      viewportHeight: VIEWPORT_H,
      rng: seededRng([0]),
    })
    expect(events).not.toContainEqual({ type: 'barrierHit' })
    expect(state.obstacles[0].hit).toBe(false)
  })

  it('culls obstacles past the viewport', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 0)
    s = {
      ...s,
      spawnTimerMs: 5000,
      obstacles: [{ lane: 0, y: VIEWPORT_H + RUNNER.cullMargin + 1, type: 'barrier', hit: false }],
    }
    const { state } = stepRunner(s, 1, 1000, { viewportHeight: VIEWPORT_H, rng: seededRng([0]) })
    expect(state.obstacles.length).toBe(0)
  })

  it('does nothing when idle', () => {
    const s = createRunnerState()
    const { state, events } = stepRunner(s, 1, 1000, { viewportHeight: VIEWPORT_H })
    expect(state).toBe(s)
    expect(events).toEqual([])
  })

  it('freezes gap drain and score when paused but keeps obstacle scroll', () => {
    let s = applyCommand(createRunnerState(), { type: 'start' }, 0)
    s = applyCommand(s, { type: 'setPaused', paused: true }, 0)
    s = { ...s, obstacles: [{ lane: 0, y: 0, type: 'barrier', hit: false }] }
    const { state } = stepRunner(s, 1, 1000, { viewportHeight: VIEWPORT_H, rng: seededRng([0]) })
    expect(state.gap).toBe(RUNNER.gapStart)
    expect(state.score).toBe(0)
    expect(state.obstacles[0].y).toBeGreaterThan(0)
  })
})

describe('dangerLevel', () => {
  it('is 0 at full gap and 1 at gap 0', () => {
    expect(dangerLevel(RUNNER.gapStart)).toBe(0)
    expect(dangerLevel(0)).toBe(1)
    expect(dangerLevel(-10)).toBe(1)
    expect(dangerLevel(200)).toBe(0)
  })
})
