import { SIDE, SidePlayer } from './types'

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
