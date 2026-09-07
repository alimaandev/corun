import { SIDE, SidePlayer, SideWorld } from './types'

export function createSidePlayer(): SidePlayer {
  return {
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    w: 12,
    h: 22,
    onGround: false,
    facing: 1,
    anim: 'idle',
    frame: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    hp: SIDE.hp,
    invulnTimer: 0,
    score: 0,
    coins: 0,
  }
}

export function buildTestWorld(
  bounds: { minX: number; maxX: number },
  groundY: number,
  platforms: { x: number; y: number; w: number; h: number }[],
  hazards: { x: number; y: number; w: number; h: number }[],
  coins: { x: number; y: number }[],
  exit: { x: number; y: number; w: number; h: number },
  spawn: { x: number; y: number },
  enemies: SideWorld['enemies'],
): SideWorld {
  return {
    bounds,
    groundY,
    platforms: platforms.map((p) => ({ ...p })),
    hazards: hazards.map((h) => ({ ...h })),
    coins: coins.map((c, i) => ({
      id: i + 1,
      aabb: { x: c.x, y: c.y, w: 12, h: 12 },
      taken: false,
    })),
    exit: { ...exit },
    spawn: { ...spawn },
    enemies: enemies.map((e) => ({ ...e })),
  }
}
