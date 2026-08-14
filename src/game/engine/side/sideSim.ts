import { SIDE, SideCombo, SideEvent, SideInput, SideSimState, SideWorld } from './types'
import { integratePlayer, overlaps, resolveHazards } from './physics'
import { createCombo, recordComboAnswer, updateCombo } from './combo'
import { addTrauma, updateShake } from './shake'
import { burst, createParticles, stepParticles } from './particles'
import { CELL_LEVEL } from './world'
import { applyBossDamage, createSideBoss, updateBoss, updateBossProjectiles } from './boss'

export const GLYPH_COLORS = ['#8faf2f', '#7aa2ff', '#ff2d78', '#ffd700', '#4fe3c1']
export const SPARK_COLORS = ['#ffd700', '#ff9e2c', '#ffffff', '#ff2d78']
export const FIRE_COLORS = ['#ff2d00', '#ff9e00', '#ffd700']

export interface SideSimDeps {
  rng: () => number
  nowMs: () => number
}

export function createSideSim(
  world: SideWorld = CELL_LEVEL,
  _deps: SideSimDeps = { rng: Math.random, nowMs: () => Date.now() },
): SideSimState {
  const player = {
    pos: { ...world.spawn },
    vel: { x: 0, y: 0 },
    w: 12,
    h: 22,
    onGround: false,
    facing: 1 as 1 | -1,
    anim: 'idle' as SideSimState['player']['anim'],
    frame: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    hp: SIDE.hp,
    invulnTimer: 0,
    score: 0,
    coins: 0,
  }
  return {
    phase: 'idle',
    paused: false,
    time: 0,
    world,
    player,
    enemies: world.enemies.map((e) => ({
      id: e.id,
      pos: { x: e.x, y: e.y },
      vel: { x: e.speed, y: 0 },
      w: 14,
      h: 16,
      patrol: [...e.patrol],
      speed: e.speed,
      alive: true,
      frame: 0,
    })),
    camera: { x: 0, y: 0 },
    trauma: 0,
    combo: createCombo(),
    particles: createParticles(),
    flashTimer: 0,
    flashGreen: false,
    gameOverReason: null,
    boss: createSideBoss(world.boss),
    projectiles: [],
  }
}

function damagePlayer(s: SideSimState, amount: number, deps: SideSimDeps): SideEvent[] {
  const events: SideEvent[] = []
  if (s.player.invulnTimer > 0) return events
  s.player.hp -= amount
  s.player.invulnTimer = SIDE.invuln
  s.trauma = addTrauma({ trauma: s.trauma, time: 0 }, amount >= 999 ? 0.8 : 0.45).trauma
  burst(
    s.particles,
    'spark',
    s.player.pos.x + s.player.w / 2,
    s.player.pos.y + s.player.h / 2,
    14,
    220,
    60,
    3,
    SPARK_COLORS,
    deps.rng,
  )
  events.push({ type: 'damage', amount })
  if (s.player.hp <= 0) {
    s.phase = 'gameover'
    s.gameOverReason = 'hp'
    events.push({ type: 'die' })
  }
  return events
}

export function applySideDamage(
  s: SideSimState,
  amount: number,
  deps: SideSimDeps = { rng: Math.random, nowMs: () => Date.now() },
): SideEvent[] {
  return damagePlayer(s, amount, deps)
}

export function applySideBossDamage(s: SideSimState, amount: number): SideEvent[] {
  const events = applyBossDamage(s, amount)
  if (events.some((e) => e.type === 'bossDefeated')) {
    s.phase = 'complete'
  }
  return events
}

export function applySideAnswer(s: SideSimState, correct: boolean, deps: SideSimDeps): SideEvent[] {
  const now = deps.nowMs()
  s.combo = recordComboAnswer(s.combo, correct, now)
  if (correct) {
    s.flashTimer = 0.18
    s.flashGreen = true
    burst(
      s.particles,
      'glyph',
      s.player.pos.x + s.player.w / 2,
      s.player.pos.y - 6,
      22,
      260,
      120,
      3,
      GLYPH_COLORS,
      deps.rng,
    )
  }
  return []
}

export function stepSideSim(
  s: SideSimState,
  dt: number,
  input: SideInput,
  deps: SideSimDeps = { rng: Math.random, nowMs: () => Date.now() },
  viewW = 480,
): { state: SideSimState; events: SideEvent[] } {
  if (s.phase === 'gameover' || s.phase === 'complete') {
    return { state: s, events: [] }
  }
  if (s.paused) return { state: s, events: [] }

  const events: SideEvent[] = []
  s.time += dt

  if (s.phase === 'idle') s.phase = 'running'

  events.push(...integratePlayer(s.player, dt, input, s.world.platforms))
  events.push(...resolveHazards(s.player, s.world.hazards, s.world.groundY))

  const damageEvents = events.filter((e) => e.type === 'damage')
  for (const d of damageEvents) {
    if (d.type === 'damage') {
      events.push(...damagePlayer(s, d.amount, deps))
    }
  }

  for (const e of events) {
    if (e.type === 'jump') {
      burst(
        s.particles,
        'dust',
        s.player.pos.x + s.player.w / 2,
        s.player.pos.y + s.player.h,
        6,
        60,
        20,
        2,
        ['#3a3a52', '#2a2a40'],
        deps.rng,
      )
    }
    if (e.type === 'land') {
      burst(
        s.particles,
        'dust',
        s.player.pos.x + s.player.w / 2,
        s.player.pos.y + s.player.h,
        8,
        90,
        30,
        2,
        ['#3a3a52', '#2a2a40'],
        deps.rng,
      )
    }
  }

  const box = { x: s.player.pos.x, y: s.player.pos.y, w: s.player.w, h: s.player.h }

  for (const c of s.world.coins) {
    if (c.taken || !overlaps(box, c.aabb)) continue
    c.taken = true
    s.player.coins += 1
    s.player.score += SIDE.coinValue
    events.push({ type: 'coin', value: SIDE.coinValue })
    burst(
      s.particles,
      'coin',
      c.aabb.x + 6,
      c.aabb.y + 6,
      10,
      140,
      90,
      3,
      ['#ffd700', '#fff3a0'],
      deps.rng,
    )
  }

  for (const e of s.enemies) {
    if (!e.alive) continue
    e.frame += dt * 10
    e.pos.x += e.vel.x * dt
    if (e.pos.x <= e.patrol[0]) {
      e.pos.x = e.patrol[0]
      e.vel.x = Math.abs(e.speed)
    } else if (e.pos.x >= e.patrol[1]) {
      e.pos.x = e.patrol[1]
      e.vel.x = -Math.abs(e.speed)
    }
    if (s.player.invulnTimer <= 0 && overlaps(box, { x: e.pos.x, y: e.pos.y, w: e.w, h: e.h })) {
      events.push(...damagePlayer(s, 1, deps))
    }
  }

  if (s.boss && s.boss.active && !s.boss.defeated) {
    const targetX = Math.max(
      s.world.bounds.minX + 60,
      Math.min(
        s.world.bounds.maxX - 60 - s.boss.w,
        s.player.pos.x + s.player.w / 2 + s.player.facing * 90,
      ),
    )
    s.boss.x += (targetX - s.boss.x) * Math.min(1, dt * 2)
    s.boss.y = s.world.boss!.y + Math.sin(s.time * 2) * 8
    const bossEvents = updateBoss(s, dt, { rng: deps.rng })
    for (const b of bossEvents) {
      if (b.type === 'damage') {
        events.push(...damagePlayer(s, b.amount, deps))
      }
    }
  }
  const projEvents = updateBossProjectiles(s, dt, { rng: deps.rng })
  for (const p of projEvents) {
    if (p.type === 'damage') {
      events.push(...damagePlayer(s, p.amount, deps))
    }
  }

  if (overlaps(box, s.world.exit)) {
    s.phase = 'complete'
    events.push({ type: 'levelComplete' })
  }

  s.combo = updateCombo(s.combo, deps.nowMs())
  s.trauma = updateShake({ trauma: s.trauma, time: s.time }, dt).trauma
  stepParticles(s.particles, dt, SIDE.gravity)

  const look = s.player.facing * SIDE.cameraLookAhead
  s.camera.x += (s.player.pos.x + s.player.w / 2 + look - s.camera.x) * Math.min(1, dt * 8)
  s.camera.x = Math.max(s.world.bounds.minX, Math.min(s.world.bounds.maxX - viewW, s.camera.x))

  s.flashTimer = Math.max(0, s.flashTimer - dt)

  return { state: s, events }
}

export function pauseSideSim(s: SideSimState, paused: boolean): SideSimState {
  return { ...s, paused }
}

export function resetSideSim(
  s: SideSimState,
  deps: SideSimDeps = { rng: Math.random, nowMs: () => Date.now() },
): SideSimState {
  return createSideSim(s.world, deps)
}

export function comboState(s: SideSimState): SideCombo {
  return s.combo
}
