import { CYBERPUNK_TOKYO, generateSkyline, ParallaxLayer, windowPositions } from './parallax'
import { SideEnemy, SideSimState } from './types'
import { shakeOffset } from './shake'
import { drawSideDroneSprite, drawSidePlayerSprite, drawSideWardenSprite } from './sprites'

export const VIEW_W = 480
export const VIEW_H = 270

export interface SideRenderOptions {
  showHitboxes?: boolean
  showCameraBox?: boolean
}

function drawSky(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, VIEW_H)
  g.addColorStop(0, CYBERPUNK_TOKYO.skyTop)
  g.addColorStop(0.65, CYBERPUNK_TOKYO.skyBottom)
  g.addColorStop(1, CYBERPUNK_TOKYO.horizon)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, VIEW_W, VIEW_H)
  ctx.fillStyle = '#ff2d78'
  ctx.fillRect(0, VIEW_H - 3, VIEW_W, 3)
}

function drawStars(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  for (let i = 0; i < 40; i++) {
    const x = (i * 53.7) % VIEW_W
    const y = ((i * 31.3) % 120) + 4
    ctx.fillRect(x, y, 1, 1)
  }
}

function drawLayer(ctx: CanvasRenderingContext2D, layer: ParallaxLayer, cameraX: number) {
  const rects = generateSkyline(layer, cameraX, VIEW_W, 64)
  for (const r of rects) {
    ctx.fillStyle = r.c
    ctx.fillRect(r.x, r.y, r.w, r.h)
    if (r.windows) {
      ctx.fillStyle = 'rgba(255,214,0,0.35)'
      for (const w of windowPositions(r, (i) => {
        const v = Math.sin(i * 12.9898) * 43758.5453
        return v - Math.floor(v)
      })) {
        ctx.fillRect(w.x, w.y, 2, 3)
      }
    }
  }
}

function drawPlatforms(ctx: CanvasRenderingContext2D, s: SideSimState, camX: number) {
  for (const p of s.world.platforms) {
    const px = Math.round(p.x - camX)
    ctx.fillStyle = '#14101f'
    ctx.fillRect(px, Math.round(p.y), p.w, p.h)
    ctx.fillStyle = '#2a2a3f'
    ctx.fillRect(px, Math.round(p.y), p.w, 3)
    ctx.fillStyle = '#4fe3c1'
    ctx.fillRect(px, Math.round(p.y), p.w, 1)
  }
}

function drawHazards(ctx: CanvasRenderingContext2D, s: SideSimState, camX: number) {
  for (const h of s.world.hazards) {
    const px = Math.round(h.x - camX)
    ctx.fillStyle = '#ff2d78'
    for (let i = 0; i < h.w; i += 8) {
      ctx.beginPath()
      ctx.moveTo(px + i, h.y + h.h)
      ctx.lineTo(px + i + 4, h.y + h.h)
      ctx.lineTo(px + i + 2, h.y)
      ctx.closePath()
      ctx.fill()
    }
  }
}

function drawExit(ctx: CanvasRenderingContext2D, s: SideSimState, camX: number, time: number) {
  const e = s.world.exit
  const px = Math.round(e.x - camX)
  const pulse = 0.6 + 0.4 * Math.sin(time * 4)
  ctx.fillStyle = `rgba(79,227,193,${0.25 * pulse})`
  ctx.fillRect(px, Math.round(e.y), e.w, e.h)
  ctx.fillStyle = '#4fe3c1'
  ctx.fillRect(px, Math.round(e.y) + 4, e.w, 2)
  ctx.fillRect(px + e.w - 6, Math.round(e.y) + 6, 2, e.h - 8)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(px + e.w - 5, Math.round(e.y) + 8 + ((time * 24) % 20), 2, 4)
}

function drawCoins(ctx: CanvasRenderingContext2D, s: SideSimState, camX: number) {
  for (const c of s.world.coins) {
    if (c.taken) continue
    const px = Math.round(c.aabb.x - camX)
    const py = Math.round(c.aabb.y + Math.sin(s.time * 3 + c.id) * 1.5)
    ctx.fillStyle = '#ffd700'
    ctx.fillRect(px, py, 12, 12)
    ctx.fillStyle = '#fff3a0'
    ctx.fillRect(px + 2, py + 2, 4, 4)
    ctx.fillStyle = '#8a6d00'
    ctx.fillRect(px + 8, py + 3, 2, 2)
  }
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: SideEnemy, camX: number, showHitbox: boolean) {
  const px = Math.round(e.pos.x - camX)
  const py = Math.round(e.pos.y)
  drawSideDroneSprite(ctx, px + e.w / 2, py + e.h / 2, 1, e.frame)
  if (showHitbox) {
    ctx.strokeStyle = '#ff2d78'
    ctx.strokeRect(px, py, e.w, e.h)
  }
}

function drawBoss(
  ctx: CanvasRenderingContext2D,
  s: SideSimState,
  camX: number,
  showHitbox: boolean,
) {
  const b = s.boss
  if (!b || (!b.active && !b.defeated)) return
  const px = Math.round(b.x - camX)
  const py = Math.round(b.y)
  const pulse = 0.75 + 0.25 * Math.sin(s.time * 6)
  ctx.fillStyle = `rgba(255,45,120,${0.12 * pulse})`
  ctx.fillRect(px - 14, py - 12, b.w + 28, b.h + 20)
  drawSideWardenSprite(ctx, px + b.w / 2, py + b.h, 1, s.time)
  if (showHitbox) {
    ctx.strokeStyle = '#ffd700'
    ctx.strokeRect(px, py, b.w, b.h)
  }
}

function drawProjectiles(ctx: CanvasRenderingContext2D, s: SideSimState, camX: number) {
  for (const p of s.projectiles) {
    if (!p.active) continue
    const px = Math.round(p.x - camX)
    const py = Math.round(p.y)
    const color = p.kind === 'rain' ? '#7aa2ff' : p.kind === 'wave' ? '#ffd700' : '#ff2d78'
    ctx.fillStyle = color
    ctx.fillRect(px - p.w / 2, py - p.h / 2, p.w, p.h)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.fillRect(px - p.w / 4, py - p.h / 4, p.w / 2, p.h / 2)
  }
}

function drawBossBar(ctx: CanvasRenderingContext2D, s: SideSimState) {
  const b = s.boss
  if (!b) return
  const w = 220
  const x = (VIEW_W - w) / 2
  const y = 10
  ctx.fillStyle = 'rgba(5,3,15,0.6)'
  ctx.fillRect(x - 2, y - 2, w + 4, 10)
  ctx.fillStyle = '#2a2a3f'
  ctx.fillRect(x, y, w, 6)
  ctx.fillStyle = '#ff2d78'
  ctx.fillRect(x, y, (w * b.hp) / b.maxHp, 6)
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(x + (w * b.hp) / b.maxHp - 2, y, 2, 6)
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  s: SideSimState,
  camX: number,
  showHitbox: boolean,
) {
  const p = s.player
  const px = Math.round(p.pos.x - camX)
  const py = Math.round(p.pos.y)
  const blink = p.invulnTimer > 0 && Math.floor(s.time * 14) % 2 === 0
  if (!blink) {
    drawSidePlayerSprite(ctx, px + p.w / 2, py + p.h, 1, p.frame, p.anim, p.facing)
  }
  if (showHitbox) {
    ctx.strokeStyle = '#4fe3c1'
    ctx.strokeRect(px, py, p.w, p.h)
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, s: SideSimState, camX: number) {
  for (const p of s.particles) {
    if (!p.active) continue
    const alpha = Math.max(0, Math.min(1, p.life / p.maxLife))
    ctx.globalAlpha = alpha
    ctx.fillStyle = p.color
    const px = Math.round(p.x - camX)
    const py = Math.round(p.y)
    if (p.kind === 'glyph' || p.kind === 'coin') {
      ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size)
    } else if (p.kind === 'spark') {
      ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size)
    } else {
      ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size)
    }
  }
  ctx.globalAlpha = 1
}

function drawFlash(ctx: CanvasRenderingContext2D, s: SideSimState) {
  if (s.flashTimer <= 0) return
  const alpha = Math.min(1, s.flashTimer / 0.18)
  ctx.fillStyle = s.flashGreen
    ? `rgba(79,227,193,${alpha * 0.25})`
    : `rgba(255,45,120,${alpha * 0.3})`
  ctx.fillRect(0, 0, VIEW_W, VIEW_H)
}

export function renderSide(
  ctx: CanvasRenderingContext2D,
  s: SideSimState,
  options: SideRenderOptions = {},
) {
  const camX = s.camera.x
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, VIEW_W, VIEW_H)
  drawSky(ctx)
  drawStars(ctx)
  drawLayer(ctx, CYBERPUNK_TOKYO.back, camX)
  drawLayer(ctx, CYBERPUNK_TOKYO.mid, camX)
  drawLayer(ctx, CYBERPUNK_TOKYO.fg, camX)
  const shake = shakeOffset({ trauma: s.trauma, time: s.time }, 6)
  ctx.save()
  ctx.translate(Math.round(shake.x), Math.round(shake.y))
  drawPlatforms(ctx, s, camX)
  drawHazards(ctx, s, camX)
  drawExit(ctx, s, camX, s.time)
  drawCoins(ctx, s, camX)
  for (const e of s.enemies) {
    if (!e.alive) continue
    drawEnemy(ctx, e, camX, !!options.showHitboxes)
  }
  drawBoss(ctx, s, camX, !!options.showHitboxes)
  drawProjectiles(ctx, s, camX)
  drawPlayer(ctx, s, camX, !!options.showHitboxes)
  drawParticles(ctx, s, camX)
  ctx.restore()
  drawBossBar(ctx, s)
  drawFlash(ctx, s)
}
