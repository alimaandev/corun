import { AABB, SIDE, SideInput, SidePlayer, SideEvent } from './types'

export function overlaps(a: AABB, b: AABB): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

function moveAxis(
  p: SidePlayer,
  axis: 'x' | 'y',
  amount: number,
  platforms: AABB[],
): { collided: boolean } {
  if (amount === 0) return { collided: false }
  if (axis === 'x') p.pos.x += amount
  else p.pos.y += amount

  const box: AABB = { x: p.pos.x, y: p.pos.y, w: p.w, h: p.h }
  let collided = false
  for (const plat of platforms) {
    if (!overlaps(box, plat)) continue
    collided = true
    if (axis === 'x') {
      if (amount > 0) p.pos.x = plat.x - p.w
      else p.pos.x = plat.x + plat.w
    } else {
      if (amount > 0) p.pos.y = plat.y - p.h
      else p.pos.y = plat.y + plat.h
    }
  }
  return { collided }
}

export function integratePlayer(
  p: SidePlayer,
  dt: number,
  input: SideInput,
  platforms: AABB[],
): SideEvent[] {
  const events: SideEvent[] = []
  const wasOnGround = p.onGround

  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0)
  if (dir !== 0) p.facing = dir as 1 | -1

  const accel = p.onGround ? SIDE.moveAccel : SIDE.airAccel
  const maxSpeed = p.onGround ? SIDE.maxRun : SIDE.maxRunAir
  if (dir !== 0) {
    p.vel.x += dir * accel * dt
    p.vel.x = Math.max(-maxSpeed, Math.min(maxSpeed, p.vel.x))
  } else {
    const friction = p.onGround ? SIDE.friction : SIDE.friction * 0.35
    const sign = Math.sign(p.vel.x)
    p.vel.x -= sign * friction * dt
    if (Math.sign(p.vel.x) !== sign) p.vel.x = 0
  }

  p.vel.y += SIDE.gravity * dt
  p.vel.y = Math.min(p.vel.y, SIDE.maxFall)

  p.coyoteTimer = p.onGround ? SIDE.coyoteTime : Math.max(0, p.coyoteTimer - dt)
  p.jumpBufferTimer = input.jumpJustPressed ? SIDE.jumpBuffer : Math.max(0, p.jumpBufferTimer - dt)

  const canJump = p.coyoteTimer > 0 && p.jumpBufferTimer > 0
  if (canJump) {
    p.vel.y = -SIDE.jumpVelocity
    p.onGround = false
    p.coyoteTimer = 0
    p.jumpBufferTimer = 0
    events.push({ type: 'jump' })
  } else if (input.jumpJustReleased && p.vel.y < 0) {
    p.vel.y = Math.max(p.vel.y, -SIDE.jumpCut)
  }

  const dx = p.vel.x * dt
  const dy = p.vel.y * dt

  moveAxis(p, 'x', dx, platforms)
  const v = moveAxis(p, 'y', dy, platforms)
  p.onGround = false
  if (v.collided && dy >= 0) {
    p.onGround = true
    if (!wasOnGround) events.push({ type: 'land' })
  }

  p.frame += dt * (p.onGround && Math.abs(p.vel.x) > 8 ? Math.abs(p.vel.x) / 18 : 4)

  p.anim = !p.onGround ? (p.vel.y < 0 ? 'jump' : 'fall') : dir !== 0 ? 'run' : 'idle'
  p.invulnTimer = Math.max(0, p.invulnTimer - dt)

  return events
}

export function resolveHazards(p: SidePlayer, hazards: AABB[], groundY: number): SideEvent[] {
  const events: SideEvent[] = []
  const box: AABB = { x: p.pos.x, y: p.pos.y, w: p.w, h: p.h }
  if (p.invulnTimer > 0) return events
  if (p.pos.y > groundY + 60) {
    events.push({ type: 'damage', amount: 999 })
    return events
  }
  for (const h of hazards) {
    if (!overlaps(box, h)) continue
    events.push({ type: 'damage', amount: 1 })
    break
  }
  return events
}
