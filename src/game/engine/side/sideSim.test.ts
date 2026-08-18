import { describe, it, expect } from 'vitest'
import { applySideAnswer, createSideSim, stepSideSim } from './sideSim'
import { SIDE, SideInput } from './types'
import { CELL_LEVEL } from './world'
import { buildTestWorld } from './testUtils'
import { createSidePlayer } from './testUtils'

function input(over: Partial<SideInput> = {}): SideInput {
  return {
    left: false,
    right: false,
    down: false,
    jumpJustPressed: false,
    jumpJustReleased: false,
    ...over,
  }
}

function idleInput(): SideInput {
  return input()
}

describe('createSideSim', () => {
  it('starts idle with full hp and empty combo', () => {
    const s = createSideSim()
    expect(s.phase).toBe('idle')
    expect(s.player.hp).toBe(SIDE.hp)
    expect(s.player.score).toBe(0)
    expect(s.combo.streak).toBe(0)
    expect(s.world.platforms.length).toBeGreaterThan(0)
    expect(s.enemies.length).toBe(3)
  })

  it('uses provided world and spawns player there', () => {
    const s = createSideSim(CELL_LEVEL)
    expect(s.player.pos.x).toBe(CELL_LEVEL.spawn.x)
    expect(s.player.pos.y).toBe(CELL_LEVEL.spawn.y)
  })
})

describe('stepSideSim', () => {
  it('starts running from idle', () => {
    let s = createSideSim()
    s = stepSideSim(s, 1 / 120, idleInput()).state
    expect(s.phase).toBe('running')
  })

  it('applies gravity and lands player on ground', () => {
    let s = createSideSim()
    s = { ...s, player: { ...s.player, pos: { x: 100, y: 60 } } }
    const startY = s.player.pos.y
    let steps = 0
    while (steps < 400 && !s.player.onGround) {
      s = stepSideSim(s, 1 / 120, idleInput()).state
      steps++
    }
    expect(s.player.onGround).toBe(true)
    expect(s.player.pos.y).toBeGreaterThan(startY)
    expect(s.player.pos.y + s.player.h).toBe(CELL_LEVEL.groundY)
  })

  it('jump launches player upward when grounded', () => {
    let s = createSideSim()
    for (let i = 0; i < 400 && !s.player.onGround; i++) {
      s = stepSideSim(s, 1 / 120, idleInput()).state
    }
    const before = s.player.pos.y
    const { events } = stepSideSim(s, 1 / 120, input({ jumpJustPressed: true }))
    expect(events.some((e) => e.type === 'jump')).toBe(true)
    expect(
      stepSideSim(s, 1 / 120, input({ jumpJustPressed: true })).state.player.pos.y,
    ).toBeLessThan(before)
  })

  it('emits land event on first contact', () => {
    const s = createSideSim()
    let landed = false
    for (let i = 0; i < 500; i++) {
      const { events } = stepSideSim(s, 1 / 120, idleInput())
      if (events.some((e) => e.type === 'land')) {
        landed = true
        break
      }
    }
    expect(landed).toBe(true)
  })

  it('damage reduces hp and triggers invulnerability', () => {
    let s = createSideSim()
    for (let i = 0; i < 400; i++) {
      s = stepSideSim(s, 1 / 120, idleInput()).state
    }
    s = { ...s, player: { ...s.player, pos: { x: 565, y: CELL_LEVEL.groundY - s.player.h } } }
    const { events } = stepSideSim(s, 1 / 120, idleInput())
    expect(events.some((e) => e.type === 'damage')).toBe(true)
    expect(s.player.hp).toBe(SIDE.hp - 1)
    expect(s.player.invulnTimer).toBeGreaterThan(0)
  })

  it('invulnerability prevents consecutive damage', () => {
    let s = createSideSim()
    for (let i = 0; i < 400; i++) {
      s = stepSideSim(s, 1 / 120, idleInput()).state
    }
    s = { ...s, player: { ...s.player, pos: { x: 565, y: CELL_LEVEL.groundY - s.player.h } } }
    stepSideSim(s, 1 / 120, idleInput())
    s = { ...s, player: { ...s.player, invulnTimer: 0.5 } }
    const { events } = stepSideSim(s, 1 / 120, idleInput())
    expect(events.some((e) => e.type === 'damage')).toBe(false)
  })

  it('falling into a pit below ground ends the game', () => {
    const pit = buildTestWorld(
      { minX: 0, maxX: 800 },
      CELL_LEVEL.groundY,
      [
        { x: 0, y: CELL_LEVEL.groundY, w: 300, h: 64 },
        { x: 500, y: CELL_LEVEL.groundY, w: 300, h: 64 },
      ],
      [],
      [],
      { x: 700, y: CELL_LEVEL.groundY - 60, w: 48, h: 40 },
      { x: 100, y: CELL_LEVEL.groundY - 24 },
      [],
    )
    let s = createSideSim(pit)
    s = { ...s, player: { ...s.player, pos: { x: 380, y: 100 } } }
    let died = false
    for (let i = 0; i < 500; i++) {
      const { events } = stepSideSim(s, 1 / 120, idleInput())
      if (events.some((e) => e.type === 'die')) {
        died = true
        break
      }
    }
    expect(died).toBe(true)
    expect(s.phase).toBe('gameover')
    expect(s.gameOverReason).toBe('hp')
  })

  it('collects coins on overlap and adds score', () => {
    let s = createSideSim()
    for (let i = 0; i < 400; i++) {
      s = stepSideSim(s, 1 / 120, idleInput()).state
    }
    const coin = s.world.coins.find((c) => c.id === 1)
    expect(coin).toBeDefined()
    if (!coin) return
    s = { ...s, player: { ...s.player, pos: { x: coin.aabb.x, y: coin.aabb.y } } }
    const { events } = stepSideSim(s, 1 / 120, idleInput())
    expect(events.some((e) => e.type === 'coin')).toBe(true)
    expect(s.player.coins).toBe(1)
    expect(s.player.score).toBe(SIDE.coinValue)
    expect(coin.taken).toBe(true)
  })

  it('reaching the exit completes the level', () => {
    let s = createSideSim()
    s = { ...s, player: { ...s.player, pos: { x: CELL_LEVEL.exit.x, y: CELL_LEVEL.exit.y } } }
    const { events } = stepSideSim(s, 1 / 120, idleInput())
    expect(events.some((e) => e.type === 'levelComplete')).toBe(true)
    expect(s.phase).toBe('complete')
  })

  it('paused sim does not advance', () => {
    let s = createSideSim()
    s = { ...s, paused: true }
    const t0 = s.time
    const posX0 = s.player.pos.x
    s = stepSideSim(s, 1 / 120, idleInput()).state
    expect(s.time).toBe(t0)
    expect(s.player.pos.x).toBe(posX0)
  })

  it('camera follows player and clamps to world bounds', () => {
    let s = createSideSim()
    s = { ...s, player: { ...s.player, pos: { x: 100, y: CELL_LEVEL.groundY - 20 } } }
    for (let i = 0; i < 300; i++) {
      s = stepSideSim(s, 1 / 120, input({ right: true })).state
    }
    expect(s.camera.x).toBeGreaterThan(0)
    s = { ...s, player: { ...s.player, pos: { x: 10000, y: CELL_LEVEL.groundY - 20 } } }
    for (let i = 0; i < 60; i++) {
      s = stepSideSim(s, 1 / 120, idleInput()).state
    }
    expect(s.camera.x).toBeLessThanOrEqual(CELL_LEVEL.bounds.maxX - 480)
  })
})

describe('applySideAnswer', () => {
  it('builds combo streak and multiplier', () => {
    const s = createSideSim()
    const deps = { rng: () => 0.5, nowMs: () => 0 }
    for (let i = 0; i < 5; i++) {
      applySideAnswer(s, true, deps)
    }
    expect(s.combo.streak).toBe(5)
    expect(s.combo.multiplier).toBe(2)
  })

  it('resets streak on wrong answer', () => {
    const s = createSideSim()
    const deps = { rng: () => 0.5, nowMs: () => 0 }
    applySideAnswer(s, true, deps)
    applySideAnswer(s, true, deps)
    applySideAnswer(s, false, deps)
    expect(s.combo.streak).toBe(0)
  })

  it('sets fire after 8 correct answers', () => {
    const s = createSideSim()
    const deps = { rng: () => 0.5, nowMs: () => 0 }
    for (let i = 0; i < 8; i++) {
      applySideAnswer(s, true, deps)
    }
    expect(s.combo.fireUntil).toBeGreaterThan(0)
    expect(s.player.score).toBe(0)
  })
})

describe('physics edge cases', () => {
  it('jump cut stops upward velocity on release', () => {
    let s = createSideSim()
    for (let i = 0; i < 400 && !s.player.onGround; i++) {
      s = stepSideSim(s, 1 / 120, idleInput()).state
    }
    s = stepSideSim(s, 1 / 120, input({ jumpJustPressed: true })).state
    const { state: s2 } = stepSideSim(s, 1 / 120, input({ jumpJustReleased: true }))
    expect(s2.player.vel.y).toBeGreaterThanOrEqual(-SIDE.jumpCut)
  })

  it('horizontal movement accelerates to max run speed', () => {
    const p = createSidePlayer()
    let s = createSideSim()
    s = { ...s, player: { ...p } }
    for (let i = 0; i < 240; i++) {
      s = stepSideSim(s, 1 / 120, input({ right: true })).state
    }
    expect(s.player.vel.x).toBeGreaterThan(100)
    expect(s.player.vel.x).toBeLessThanOrEqual(SIDE.maxRun + 1)
  })
})

describe('integratePlayer', () => {
  it('clamps vertical velocity to max fall', () => {
    const p = createSidePlayer()
    let s = createSideSim()
    s = { ...s, player: { ...p } }
    for (let i = 0; i < 240; i++) {
      s = stepSideSim(s, 1 / 120, idleInput()).state
    }
    expect(s.player.vel.y).toBeLessThanOrEqual(SIDE.maxFall + 1)
  })
})
