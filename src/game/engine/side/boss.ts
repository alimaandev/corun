import { BOSS, SideBoss, SideEvent, SideProjectile, SideSimState, Vec2 } from './types'
import { overlaps } from './physics'

export function spawnBossProjectiles(
  boss: SideBoss,
  target: Vec2,
  projectiles: SideProjectile[],
  rng: () => number,
): void {
  const cx = boss.x + boss.w / 2
  const cy = boss.y + boss.h / 2
  const pattern = boss.pattern % 3

  if (pattern === 0) {
    const dx = target.x - cx
    const dy = target.y - cy
    const n = 2 + boss.phase
    for (let i = 0; i < n; i++) {
      const spread = (i - (n - 1) / 2) * 0.22
      const a = Math.atan2(dy, dx) + spread
      projectiles.push({
        kind: 'orb',
        x: cx,
        y: cy,
        vx: Math.cos(a) * BOSS.orbSpeed,
        vy: Math.sin(a) * BOSS.orbSpeed,
        w: BOSS.projW,
        h: BOSS.projH,
        active: true,
      })
    }
  } else if (pattern === 1) {
    const n = 4 + boss.phase * 2
    for (let i = 0; i < n; i++) {
      const startX = boss.x + rng() * boss.w
      projectiles.push({
        kind: 'rain',
        x: startX,
        y: cy,
        vx: (rng() - 0.5) * 40,
        vy: BOSS.rainSpeed,
        w: BOSS.projW,
        h: BOSS.projH,
        active: true,
      })
    }
  } else {
    const dir = target.x > cx ? 1 : -1
    projectiles.push({
      kind: 'wave',
      x: cx,
      y: boss.y + boss.h * 0.85,
      vx: dir * BOSS.waveSpeed,
      vy: 0,
      w: 14,
      h: 10,
      active: true,
    })
  }
}

export function updateBossProjectiles(
  s: SideSimState,
  dt: number,
  _deps: { rng: () => number },
): SideEvent[] {
  const events: SideEvent[] = []
  const box = {
    x: s.player.pos.x,
    y: s.player.pos.y,
    w: s.player.w,
    h: s.player.h,
  }
  const yMin = s.world.groundY - 24
  for (const p of s.projectiles) {
    if (!p.active) continue
    p.x += p.vx * dt
    p.y += p.vy * dt
    if (p.kind === 'rain' && p.vy > 0 && p.y > yMin) {
      p.active = false
      continue
    }
    if (p.kind === 'orb' || p.kind === 'wave') {
      if (p.y > s.world.groundY - 4) p.active = false
    }
    if (p.x < s.world.bounds.minX - 60 || p.x > s.world.bounds.maxX + 60) p.active = false
    if (p.active && overlaps(box, { x: p.x, y: p.y, w: p.w, h: p.h })) {
      p.active = false
      events.push({ type: 'damage', amount: 1 })
    }
  }
  return events
}

export function updateBoss(s: SideSimState, dt: number, _deps: { rng: () => number }): SideEvent[] {
  const boss = s.boss
  const events: SideEvent[] = []
  if (!boss || boss.defeated || !boss.active) return events

  const box = {
    x: s.player.pos.x,
    y: s.player.pos.y,
    w: s.player.w,
    h: s.player.h,
  }
  if (s.player.invulnTimer <= 0 && overlaps(box, { x: boss.x, y: boss.y, w: boss.w, h: boss.h })) {
    events.push({ type: 'damage', amount: 1 })
  }

  boss.attackTimer -= dt
  if (boss.attackTimer <= 0) {
    boss.attackTimer = BOSS.attackEvery / (1 + boss.phase * 0.5)
    spawnBossProjectiles(
      boss,
      { x: box.x + box.w / 2, y: box.y + box.h / 2 },
      s.projectiles,
      _deps.rng,
    )
    boss.pattern += 1
  }

  return events
}

export function applyBossDamage(s: SideSimState, amount: number): SideEvent[] {
  const boss = s.boss
  if (!boss || boss.defeated) return []
  boss.hp = Math.max(0, boss.hp - amount)
  boss.phase = Math.min(2, 3 - Math.ceil((boss.hp / boss.maxHp) * 3))
  const events: SideEvent[] = [{ type: 'bossHit' }]
  if (boss.hp <= 0) {
    boss.defeated = true
    boss.active = false
    events.push({ type: 'bossDefeated' })
  }
  return events
}

export function createSideBoss(config: SideSimState['world']['boss']): SideBoss | null {
  if (!config) return null
  return {
    active: true,
    x: config.x,
    y: config.y,
    w: config.w,
    h: config.h,
    hp: config.maxHp,
    maxHp: config.maxHp,
    phase: 0,
    attackTimer: 2,
    pattern: 0,
    defeated: false,
  }
}
