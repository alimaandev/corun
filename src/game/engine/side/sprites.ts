export type SidePlayerAnim = 'idle' | 'run' | 'jump' | 'fall'

export function drawSidePlayerSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  frame: number,
  anim: SidePlayerAnim,
  facing: 1 | -1,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(facing, 1)
  const step = Math.sin(frame * 0.6) * 3 * s
  const legL = anim === 'run' ? step : anim === 'jump' ? -4 * s : anim === 'fall' ? 2 * s : 0
  const legR = anim === 'run' ? -step : anim === 'jump' ? -3 * s : anim === 'fall' ? 4 * s : 0
  const lean = anim === 'run' ? 1 : 0
  ctx.fillStyle = '#fc0000'
  ctx.fillRect(-2 * s + lean, -20 * s, 12 * s, 5 * s)
  ctx.fillStyle = '#fcb8a0'
  ctx.fillRect(0 * s + lean, -15 * s, 9 * s, 5 * s)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(3 * s + lean, -13 * s, 2 * s, 2 * s)
  ctx.fillStyle = '#000'
  ctx.fillRect(4 * s + lean, -12 * s, 1 * s, 1 * s)
  ctx.fillStyle = '#fcb8a0'
  ctx.fillRect(9 * s + lean, -16 * s, 2 * s, 3 * s)
  ctx.fillStyle = '#ff7a00'
  ctx.fillRect(4 * s + lean, -10 * s, 2 * s, 2 * s)
  ctx.fillStyle = '#fc0000'
  ctx.fillRect(0 * s + lean, -10 * s, 11 * s, 9 * s)
  ctx.fillStyle = '#0000b0'
  ctx.fillRect(2 * s + lean, -2 * s + legL, 4 * s, 10 * s)
  ctx.fillRect(7 * s + lean, -2 * s + legR, 4 * s, 10 * s)
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(1 * s + lean, 8 * s + legL, 6 * s, 3 * s)
  ctx.fillRect(6 * s + lean, 8 * s + legR, 6 * s, 3 * s)
  ctx.restore()
}

export function drawSideDroneSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  frame: number,
) {
  const bob = Math.sin(frame * 0.5) * 1.5 * s
  ctx.fillStyle = '#ff2d78'
  ctx.fillRect(x - 7 * s, y - 5 * s + bob, 14 * s, 4 * s)
  ctx.fillStyle = '#1c1030'
  ctx.fillRect(x - 4 * s, y - 8 * s + bob, 8 * s, 4 * s)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x - 2 * s, y - 7 * s + bob, 1.5 * s, 1.5 * s)
  ctx.fillRect(x + 1 * s, y - 7 * s + bob, 1.5 * s, 1.5 * s)
  ctx.fillStyle = '#ff2d78'
  ctx.fillRect(x - 9 * s, y - 1 * s + bob, 3 * s, 2 * s)
  ctx.fillRect(x + 6 * s, y - 1 * s + bob, 3 * s, 2 * s)
}

export function drawSideWardenSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  time: number,
) {
  const flick = time % 2 < 0.08 ? 0.55 : 1
  ctx.fillStyle = '#1a1030'
  ctx.fillRect(x - 9 * s, y - 30 * s, 18 * s, 26 * s)
  ctx.fillStyle = '#ff2d78'
  ctx.fillRect(x - 9 * s, y - 34 * s, 18 * s, 5 * s)
  ctx.fillRect(x - 11 * s, y - 34 * s, 2 * s, 8 * s)
  ctx.fillRect(x + 9 * s, y - 34 * s, 2 * s, 8 * s)
  ctx.fillStyle = '#2a1a4a'
  ctx.fillRect(x - 6 * s, y - 22 * s, 12 * s, 12 * s)
  ctx.fillStyle = `rgba(255,45,120,${0.5 + 0.5 * flick})`
  ctx.fillRect(x - 5 * s, y - 21 * s, 4 * s, 4 * s)
  ctx.fillRect(x + 1 * s, y - 21 * s, 4 * s, 4 * s)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x - 4 * s, y - 20 * s, 2 * s, 2 * s)
  ctx.fillRect(x + 2 * s, y - 20 * s, 2 * s, 2 * s)
  ctx.fillStyle = '#1a1030'
  ctx.fillRect(x - 4 * s, y - 10 * s, 8 * s, 4 * s)
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(x - 1 * s, y - 9 * s, 2 * s, 2 * s)
  ctx.fillStyle = '#1a1030'
  ctx.fillRect(x - 8 * s, y - 6 * s, 6 * s, 6 * s)
  ctx.fillRect(x + 2 * s, y - 6 * s, 6 * s, 6 * s)
  const glow = 0.3 + 0.3 * Math.sin(time * 5)
  ctx.fillStyle = `rgba(255,45,120,${glow})`
  ctx.fillRect(x - 8 * s, y - 6 * s, 2 * s, 6 * s)
  ctx.fillRect(x + 6 * s, y - 6 * s, 2 * s, 6 * s)
}
