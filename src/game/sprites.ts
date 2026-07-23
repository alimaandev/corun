export function drawPlayerSprite(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) {
  const legSwing = Math.sin(frame * 0.1) * 2
  ctx.fillStyle = '#fc0000'
  ctx.fillRect(x - 6 * s, y - 18 * s, 12 * s, 5 * s)
  ctx.fillStyle = '#fcb8a0'
  ctx.fillRect(x - 5 * s, y - 13 * s, 10 * s, 5 * s)
  ctx.fillRect(x - 3 * s, y - 8 * s, 6 * s, 2 * s)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x - 3 * s, y - 11 * s, 2 * s, 2 * s)
  ctx.fillRect(x + 1 * s, y - 11 * s, 2 * s, 2 * s)
  ctx.fillStyle = '#000'
  ctx.fillRect(x - 2 * s, y - 10 * s, 1 * s, 1 * s)
  ctx.fillRect(x + 1 * s, y - 10 * s, 1 * s, 1 * s)
  ctx.fillStyle = '#fc0000'
  ctx.fillRect(x - 6 * s, y - 6 * s, 12 * s, 12 * s)
  ctx.fillStyle = '#fcb8a0'
  ctx.fillRect(x - 8 * s, y - 4 * s, 3 * s, 7 * s)
  ctx.fillRect(x + 5 * s, y - 4 * s, 3 * s, 7 * s)
  ctx.fillStyle = '#0000b0'
  ctx.fillRect(x - 5 * s, y + 4 * s, 4 * s, 7 * s)
  ctx.fillRect(x + 1 * s, y + 4 * s, 4 * s, 7 * s)
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(x - 5 * s, y + 4 * s + legSwing, 4 * s, 3 * s)
  ctx.fillRect(x + 1 * s, y + 4 * s - legSwing, 4 * s, 3 * s)
}

export function drawGuardSprite(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) {
  const b = Math.sin(frame * 0.08) * 1
  ctx.fillStyle = '#888'
  ctx.fillRect(x - 6 * s, y - 20 * s + b, 12 * s, 6 * s)
  ctx.fillRect(x - 4 * s, y - 18 * s + b, 2 * s, 3 * s)
  ctx.fillRect(x + 2 * s, y - 18 * s + b, 2 * s, 3 * s)
  ctx.fillStyle = '#666'
  ctx.fillRect(x - 7 * s, y - 14 * s + b, 14 * s, 12 * s)
  ctx.fillStyle = '#555'
  ctx.fillRect(x - 6 * s, y - 14 * s + b, 12 * s, 2 * s)
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(x - 1 * s, y - 4 * s + b, 2 * s, 2 * s)
  ctx.fillStyle = '#888'
  ctx.fillRect(x - 6 * s, y - 2 * s + b, 4 * s, 6 * s)
  ctx.fillRect(x + 2 * s, y - 2 * s + b, 4 * s, 6 * s)
  ctx.fillStyle = '#444'
  ctx.fillRect(x - 6 * s, y + 4 * s + b, 4 * s, 4 * s)
  ctx.fillRect(x + 2 * s, y + 4 * s + b, 4 * s, 4 * s)
  ctx.fillStyle = '#aaa'
  ctx.fillRect(x + 10 * s, y - 16 * s + b, 3 * s, 22 * s)
  ctx.fillRect(x + 12 * s, y - 14 * s + b, 3 * s, 2 * s)
}

export function drawWardenSprite(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, _frame: number) {
  ctx.fillStyle = '#3a1a1a'
  ctx.fillRect(x - 8 * s, y - 20 * s, 16 * s, 8 * s)
  ctx.fillRect(x - 10 * s, y - 12 * s, 20 * s, 14 * s)
  ctx.fillStyle = '#ff0000'
  ctx.fillRect(x - 3 * s, y - 16 * s, 2 * s, 2 * s)
  ctx.fillRect(x + 1 * s, y - 16 * s, 2 * s, 2 * s)
  ctx.fillStyle = '#5a3a1a'
  ctx.fillRect(x - 8 * s, y - 2 * s, 16 * s, 4 * s)
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(x - 2 * s, y - 1 * s, 1 * s, 2 * s)
  ctx.fillRect(x + 1 * s, y - 1 * s, 1 * s, 2 * s)
  ctx.fillStyle = '#3a1a1a'
  ctx.fillRect(x - 7 * s, y + 2 * s, 6 * s, 6 * s)
  ctx.fillRect(x + 1 * s, y + 2 * s, 6 * s, 6 * s)
  ctx.fillStyle = '#2a0a0a'
  ctx.fillRect(x - 7 * s, y + 8 * s, 6 * s, 4 * s)
  ctx.fillRect(x + 1 * s, y + 8 * s, 6 * s, 4 * s)
}

export function drawDeepOneSprite(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) {
  const w = Math.sin(frame * 0.05) * 2
  ctx.fillStyle = '#1a4a1a'
  ctx.fillRect(x - 10 * s, y - 14 * s + w, 20 * s, 12 * s)
  ctx.fillStyle = '#2a6a2a'
  ctx.fillRect(x - 8 * s, y - 16 * s + w, 16 * s, 6 * s)
  ctx.fillStyle = '#ff0000'
  ctx.fillRect(x - 4 * s, y - 14 * s + w, 3 * s, 3 * s)
  ctx.fillRect(x + 1 * s, y - 14 * s + w, 3 * s, 3 * s)
  ctx.fillStyle = '#0a3a0a'
  ctx.fillRect(x - 6 * s, y - 8 * s + w, 12 * s, 2 * s)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x - 5 * s, y - 8 * s + w, 2 * s, 1 * s)
  ctx.fillRect(x + 3 * s, y - 8 * s + w, 2 * s, 1 * s)
  ctx.fillStyle = '#1a4a1a'
  for (let i = -3; i <= 3; i++) {
    const tx = x + i * 3 * s + Math.sin(frame * 0.06 + i) * 2
    const ty = y + 2 * s + Math.sin(frame * 0.08 + i * 0.5) * 3
    ctx.fillRect(tx, ty, 2 * s, 6 * s)
  }
  ctx.fillStyle = '#0a3a0a'
  ctx.fillRect(x - 6 * s, y + 6 * s, 4 * s, 4 * s)
  ctx.fillRect(x + 2 * s, y + 6 * s, 4 * s, 4 * s)
}

export function drawBanditSprite(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) {
  const b = Math.sin(frame * 0.1) * 1
  ctx.fillStyle = '#5a3a1a'
  ctx.fillRect(x - 6 * s, y - 18 * s + b, 12 * s, 8 * s)
  ctx.fillStyle = '#fcb8a0'
  ctx.fillRect(x - 4 * s, y - 14 * s + b, 8 * s, 3 * s)
  ctx.fillStyle = '#000'
  ctx.fillRect(x - 3 * s, y - 12 * s + b, 2 * s, 1 * s)
  ctx.fillRect(x + 1 * s, y - 12 * s + b, 2 * s, 1 * s)
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(x - 4 * s, y - 11 * s + b, 1 * s, 4 * s)
  ctx.fillStyle = '#5a3a1a'
  ctx.fillRect(x - 6 * s, y - 12 * s + b, 12 * s, 12 * s)
  ctx.fillStyle = '#4a2a0a'
  ctx.fillRect(x - 5 * s, y - 4 * s + b, 4 * s, 6 * s)
  ctx.fillRect(x + 1 * s, y - 4 * s + b, 4 * s, 6 * s)
  ctx.fillStyle = '#555'
  ctx.fillRect(x - 5 * s, y + 2 * s + b, 4 * s, 4 * s)
  ctx.fillRect(x + 1 * s, y + 2 * s + b, 4 * s, 4 * s)
  ctx.fillStyle = '#aaa'
  ctx.fillRect(x - 8 * s, y - 10 * s + b, 2 * s, 4 * s)
}

export function drawVarkSprite(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) {
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(x - 7 * s, y - 18 * s, 14 * s, 8 * s)
  ctx.fillStyle = '#ff0000'
  ctx.fillRect(x - 3 * s, y - 14 * s, 2 * s, 2 * s)
  ctx.fillRect(x + 1 * s, y - 14 * s, 2 * s, 2 * s)
  ctx.fillStyle = '#2a2a2a'
  ctx.fillRect(x - 8 * s, y - 10 * s, 16 * s, 14 * s)
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(x - 7 * s, y - 4 * s, 14 * s, 4 * s)
  ctx.fillStyle = '#666'
  ctx.fillRect(x - 7 * s, y + 2 * s, 6 * s, 6 * s)
  ctx.fillRect(x + 1 * s, y + 2 * s, 6 * s, 6 * s)
  ctx.fillStyle = '#444'
  ctx.fillRect(x - 7 * s, y + 8 * s, 6 * s, 4 * s)
  ctx.fillRect(x + 1 * s, y + 8 * s, 6 * s, 4 * s)
  const wx = Math.sin(frame * 0.15) * 4
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(x + 9 * s, y - 14 * s + wx, 2 * s, 18 * s)
  ctx.fillRect(x + 7 * s, y - 16 * s + wx, 6 * s, 2 * s)
}

export function drawStoneheartSprite(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) {
  const b = Math.sin(frame * 0.06) * 2
  ctx.fillStyle = '#6a6a6a'
  ctx.fillRect(x - 12 * s, y - 24 * s + b, 24 * s, 12 * s)
  ctx.fillRect(x - 14 * s, y - 12 * s + b, 28 * s, 18 * s)
  ctx.fillStyle = '#ff4444'
  ctx.fillRect(x - 4 * s, y - 18 * s + b, 3 * s, 4 * s)
  ctx.fillRect(x + 1 * s, y - 18 * s + b, 3 * s, 4 * s)
  ctx.fillStyle = '#444'
  ctx.fillRect(x - 10 * s, y - 10 * s + b, 20 * s, 3 * s)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x - 8 * s, y - 10 * s + b, 2 * s, 2 * s)
  ctx.fillRect(x + 6 * s, y - 10 * s + b, 2 * s, 2 * s)
  ctx.fillStyle = '#555'
  ctx.fillRect(x - 12 * s, y + 6 * s + b, 8 * s, 8 * s)
  ctx.fillRect(x + 4 * s, y + 6 * s + b, 8 * s, 8 * s)
  ctx.fillStyle = '#444'
  ctx.fillRect(x - 12 * s, y + 14 * s + b, 8 * s, 4 * s)
  ctx.fillRect(x + 4 * s, y + 14 * s + b, 8 * s, 4 * s)
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(x - 16 * s, y - 20 * s + b, 4 * s, 28 * s)
  ctx.fillRect(x - 20 * s, y - 22 * s + b, 8 * s, 4 * s)
}

export function drawCommanderSprite(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) {
  const b = Math.sin(frame * 0.08) * 1
  ctx.fillStyle = '#aaa'
  ctx.fillRect(x - 7 * s, y - 22 * s + b, 14 * s, 8 * s)
  ctx.fillStyle = '#cc3333'
  ctx.fillRect(x - 2 * s, y - 26 * s + b, 4 * s, 6 * s)
  ctx.fillStyle = '#888'
  ctx.fillRect(x - 5 * s, y - 18 * s + b, 2 * s, 3 * s)
  ctx.fillRect(x + 3 * s, y - 18 * s + b, 2 * s, 3 * s)
  ctx.fillStyle = '#999'
  ctx.fillRect(x - 8 * s, y - 14 * s + b, 16 * s, 16 * s)
  ctx.fillStyle = '#888'
  ctx.fillRect(x - 7 * s, y - 4 * s + b, 14 * s, 3 * s)
  ctx.fillStyle = '#777'
  ctx.fillRect(x - 7 * s, y + 2 * s + b, 6 * s, 6 * s)
  ctx.fillRect(x + 1 * s, y + 2 * s + b, 6 * s, 6 * s)
  ctx.fillStyle = '#666'
  ctx.fillRect(x - 7 * s, y + 8 * s + b, 6 * s, 4 * s)
  ctx.fillRect(x + 1 * s, y + 8 * s + b, 6 * s, 4 * s)
  ctx.fillStyle = '#777'
  ctx.fillRect(x - 12 * s, y - 10 * s + b, 4 * s, 10 * s)
  ctx.fillStyle = '#aaa'
  ctx.fillRect(x - 11 * s, y - 12 * s + b, 2 * s, 4 * s)
}

export function drawDravenSprite(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) {
  const b = Math.sin(frame * 0.08) * 1
  ctx.fillStyle = '#1a1a2a'
  ctx.fillRect(x - 7 * s, y - 22 * s + b, 14 * s, 10 * s)
  ctx.fillStyle = '#ff0000'
  ctx.fillRect(x - 1 * s, y - 24 * s + b, 2 * s, 4 * s)
  ctx.fillRect(x - 1 * s, y - 26 * s + b, 2 * s, 4 * s)
  ctx.fillStyle = '#2a2a3a'
  ctx.fillRect(x - 8 * s, y - 12 * s + b, 16 * s, 14 * s)
  ctx.fillStyle = '#1a1a2a'
  ctx.fillRect(x - 7 * s, y - 4 * s + b, 14 * s, 3 * s)
  ctx.fillStyle = '#333'
  ctx.fillRect(x - 7 * s, y + 2 * s + b, 6 * s, 6 * s)
  ctx.fillRect(x + 1 * s, y + 2 * s + b, 6 * s, 6 * s)
  ctx.fillStyle = '#222'
  ctx.fillRect(x - 7 * s, y + 8 * s + b, 6 * s, 4 * s)
  ctx.fillRect(x + 1 * s, y + 8 * s + b, 6 * s, 4 * s)
  ctx.fillStyle = '#cc0000'
  ctx.fillRect(x - 10 * s, y - 10 * s + b, 2 * s, 18 * s)
  ctx.fillStyle = '#555'
  ctx.fillRect(x + 8 * s, y - 20 * s + b, 4 * s, 26 * s)
  ctx.fillRect(x + 10 * s, y - 22 * s + b, 4 * s, 3 * s)
  ctx.fillRect(x + 7 * s, y + 6 * s + b, 6 * s, 2 * s)
}

export function drawKingSprite(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, _frame: number) {
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(x - 6 * s, y - 26 * s, 12 * s, 5 * s)
  ctx.fillRect(x - 4 * s, y - 28 * s, 3 * s, 3 * s)
  ctx.fillRect(x + 1 * s, y - 28 * s, 3 * s, 3 * s)
  ctx.fillStyle = '#ff0000'
  ctx.fillRect(x - 7 * s, y - 20 * s, 14 * s, 20 * s)
  ctx.fillStyle = '#fcb8a0'
  ctx.fillRect(x - 5 * s, y - 21 * s, 10 * s, 5 * s)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x - 6 * s, y - 17 * s, 4 * s, 5 * s)
  ctx.fillRect(x + 2 * s, y - 17 * s, 4 * s, 5 * s)
  ctx.fillStyle = '#000'
  ctx.fillRect(x - 3 * s, y - 19 * s, 2 * s, 2 * s)
  ctx.fillRect(x + 1 * s, y - 19 * s, 2 * s, 2 * s)
  ctx.fillStyle = '#ddd'
  ctx.fillRect(x - 3 * s, y - 14 * s, 6 * s, 3 * s)
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(x - 1 * s, y - 2 * s, 2 * s, 2 * s)
  ctx.fillStyle = '#cc0000'
  ctx.fillRect(x - 8 * s, y + 2 * s, 6 * s, 6 * s)
  ctx.fillRect(x + 2 * s, y + 2 * s, 6 * s, 6 * s)
  ctx.fillStyle = '#aa0000'
  ctx.fillRect(x - 8 * s, y + 8 * s, 6 * s, 4 * s)
  ctx.fillRect(x + 2 * s, y + 8 * s, 6 * s, 4 * s)
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(x + 10 * s, y - 22 * s, 3 * s, 24 * s)
  ctx.fillRect(x + 8 * s, y - 24 * s, 7 * s, 3 * s)
  ctx.fillRect(x + 11 * s, y + 2 * s, 5 * s, 3 * s)
}

export function drawElenaSprite(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) {
  const b = Math.sin(frame * 0.06) * 1
  ctx.fillStyle = '#6a3a1a'
  ctx.fillRect(x - 4 * s, y - 18 * s + b, 8 * s, 4 * s)
  ctx.fillRect(x - 2 * s, y - 16 * s + b, 4 * s, 8 * s)
  ctx.fillStyle = '#fcb8a0'
  ctx.fillRect(x - 4 * s, y - 12 * s + b, 8 * s, 6 * s)
  ctx.fillStyle = '#000'
  ctx.fillRect(x - 2 * s, y - 9 * s + b, 1 * s, 1 * s)
  ctx.fillRect(x + 1 * s, y - 9 * s + b, 1 * s, 1 * s)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x - 6 * s, y - 6 * s + b, 12 * s, 14 * s)
  ctx.fillStyle = '#ddd'
  ctx.fillRect(x - 5 * s, y + 4 * s + b, 10 * s, 4 * s)
  ctx.fillStyle = '#fcb8a0'
  ctx.fillRect(x - 6 * s, y - 4 * s + b, 3 * s, 6 * s)
  ctx.fillRect(x + 3 * s, y - 4 * s + b, 3 * s, 6 * s)
  ctx.fillStyle = '#ccc'
  ctx.fillRect(x - 4 * s, y + 8 * s + b, 3 * s, 6 * s)
  ctx.fillRect(x + 1 * s, y + 8 * s + b, 3 * s, 6 * s)
  ctx.fillStyle = '#555'
  ctx.fillRect(x - 3 * s, y + 2 * s + b, 6 * s, 3 * s)
}

export type NpcId = 'guard' | 'warden' | 'deepOne' | 'bandit' | 'vark' | 'stoneheart' | 'commander' | 'draven' | 'king' | 'elena'

export const NPC_DRAWERS: Record<NpcId, (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number) => void> = {
  guard: drawGuardSprite,
  warden: drawWardenSprite,
  deepOne: drawDeepOneSprite,
  bandit: drawBanditSprite,
  vark: drawVarkSprite,
  stoneheart: drawStoneheartSprite,
  commander: drawCommanderSprite,
  draven: drawDravenSprite,
  king: drawKingSprite,
  elena: drawElenaSprite,
}

export const NPC_NAMES: Record<NpcId, string> = {
  guard: 'PRISON GUARD',
  warden: 'WARDEN GRIM',
  deepOne: 'THE DEEP ONE',
  bandit: 'BANDIT LEADER',
  vark: 'OVERSEER VARK',
  stoneheart: 'STONEHEART',
  commander: 'GATE COMMANDER',
  draven: 'CAPTAIN DRAVEN',
  king: 'THE KING',
  elena: 'ELENA',
}
