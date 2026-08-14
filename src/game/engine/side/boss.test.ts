import { describe, expect, it } from 'vitest'
import { createSideSim, stepSideSim, applySideBossDamage } from './sideSim'
import { WARDEN_ARENA } from './world'
import { createSideBoss, spawnBossProjectiles, updateBossProjectiles } from './boss'
import { SideInput } from './types'

const deps = { rng: () => 0.5, nowMs: () => 0 }

function idleInput(): SideInput {
  return {
    left: false,
    right: false,
    down: false,
    jumpJustPressed: false,
    jumpJustReleased: false,
  }
}

describe('boss', () => {
  it('spawns from arena config', () => {
    const s = createSideSim(WARDEN_ARENA, deps)
    expect(s.boss).not.toBeNull()
    expect(s.boss?.hp).toBe(12)
    expect(s.boss?.maxHp).toBe(12)
    expect(s.boss?.active).toBe(true)
  })

  it('createSideBoss returns null without config', () => {
    expect(createSideBoss(undefined)).toBeNull()
  })

  it('applySideBossDamage decrements hp and emits bossHit', () => {
    const s = createSideSim(WARDEN_ARENA, deps)
    stepSideSim(s, 1 / 120, idleInput(), deps, 480)
    const events = applySideBossDamage(s, 3)
    expect(s.boss?.hp).toBe(9)
    expect(events.some((e) => e.type === 'bossHit')).toBe(true)
    expect(s.phase).toBe('running')
  })

  it('bossDefeated completes the phase', () => {
    const s = createSideSim(WARDEN_ARENA, deps)
    const events = applySideBossDamage(s, 12)
    expect(s.boss?.defeated).toBe(true)
    expect(events.some((e) => e.type === 'bossDefeated')).toBe(true)
    expect(s.phase).toBe('complete')
  })

  it('spawns aimed orbs in pattern 0', () => {
    const s = createSideSim(WARDEN_ARENA, deps)
    const boss = s.boss!
    s.player.pos = { x: 200, y: 180 }
    spawnBossProjectiles(boss, { x: 200, y: 180 }, s.projectiles, deps.rng)
    expect(s.projectiles.length).toBeGreaterThan(0)
    for (const p of s.projectiles) {
      expect(p.kind).toBe('orb')
      expect(Math.hypot(p.vx, p.vy)).toBeGreaterThan(0)
    }
  })

  it('rain pattern drops projectiles downward', () => {
    const s = createSideSim(WARDEN_ARENA, deps)
    s.boss!.pattern = 1
    spawnBossProjectiles(s.boss!, { x: 200, y: 180 }, s.projectiles, deps.rng)
    expect(s.projectiles.length).toBeGreaterThan(0)
    for (const p of s.projectiles) {
      expect(p.kind).toBe('rain')
      expect(p.vy).toBeGreaterThan(0)
    }
  })

  it('wave pattern sweeps toward the player', () => {
    const s = createSideSim(WARDEN_ARENA, deps)
    s.boss!.pattern = 2
    spawnBossProjectiles(s.boss!, { x: 1200, y: 180 }, s.projectiles, deps.rng)
    expect(s.projectiles.length).toBeGreaterThan(0)
    for (const p of s.projectiles) {
      expect(p.kind).toBe('wave')
      expect(p.vx).toBeGreaterThan(0)
    }
  })

  it('boss attacks periodically while active', () => {
    const s = createSideSim(WARDEN_ARENA, deps)
    expect(s.projectiles.length).toBe(0)
    for (let i = 0; i < 300; i++) {
      stepSideSim(s, 1 / 120, idleInput(), deps, 480)
    }
    expect(s.projectiles.length).toBeGreaterThan(0)
  })

  it('projectiles damage the player', () => {
    const s = createSideSim(WARDEN_ARENA, deps)
    s.projectiles.push({
      kind: 'orb',
      x: s.player.pos.x + s.player.w / 2,
      y: s.player.pos.y + s.player.h / 2,
      vx: 0,
      vy: 0,
      w: 10,
      h: 10,
      active: true,
    })
    const { events } = stepSideSim(s, 1 / 120, idleInput(), deps, 480)
    expect(events.some((e) => e.type === 'damage')).toBe(true)
    expect(s.player.hp).toBe(2)
    expect(s.projectiles[0].active).toBe(false)
  })

  it('rain projectiles dissolve at ground level', () => {
    const s = createSideSim(WARDEN_ARENA, deps)
    s.projectiles.push({
      kind: 'rain',
      x: 300,
      y: s.world.groundY - 2,
      vx: 0,
      vy: 200,
      w: 10,
      h: 10,
      active: true,
    })
    updateBossProjectiles(s, 1 / 60, { rng: deps.rng })
    expect(s.projectiles[0].active).toBe(false)
  })
})
