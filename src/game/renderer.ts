import { GameState, Particle } from './types'

const STARS = Array.from({ length: 50 }, () => ({
  x: Math.random(),
  y: Math.random() * 0.55,
  size: 0.3 + Math.random() * 1.8,
  speed: 0.3 + Math.random() * 0.7,
  phase: Math.random() * Math.PI * 2,
}))

const MOUNTAIN_POINTS = Array.from({ length: 30 }, (_, i) => ({
  x: (i / 30) * 1.2 - 0.1,
  h: 80 + Math.sin(i * 0.7) * 40 + Math.sin(i * 1.3) * 20,
}))

const BUILDINGS = [
  { x: 0.00, w: 40, h: 80 },  { x: 0.08, w: 30, h: 120 },
  { x: 0.14, w: 50, h: 60 },  { x: 0.22, w: 35, h: 140 },
  { x: 0.28, w: 45, h: 90 },  { x: 0.36, w: 28, h: 110 },
  { x: 0.42, w: 55, h: 70 },  { x: 0.50, w: 32, h: 130 },
  { x: 0.56, w: 48, h: 85 },  { x: 0.64, w: 38, h: 100 },
  { x: 0.70, w: 42, h: 75 },  { x: 0.78, w: 52, h: 115 },
  { x: 0.84, w: 30, h: 95 },  { x: 0.92, w: 45, h: 65 },
]

const FOG_PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  x: Math.random(),
  y: 0.72 + Math.random() * 0.15,
  size: 20 + Math.random() * 40,
  speed: 0.1 + Math.random() * 0.2,
  phase: Math.random() * Math.PI * 2,
}))

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, danger: number) {
  const r = Math.min(255, 10 + danger * 30)
  const g = Math.min(50, 10 + danger * 10)
  const b = Math.min(78, 46 - danger * 15)
  const c1 = `rgb(${r>>0},${g>>0},${b>>0})`
  const grad = ctx.createLinearGradient(0, 0, 0, h * 0.7)
  grad.addColorStop(0, '#0a0a2e')
  grad.addColorStop(0.4, '#151545')
  grad.addColorStop(0.7, '#1a1a4e')
  grad.addColorStop(1, c1)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h * 0.7)
}

function drawStars(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, danger: number) {
  for (const s of STARS) {
    const twinkle = 0.3 + Math.sin(time * s.speed * 0.001 + s.phase) * 0.3
    const alpha = Math.max(0.1, twinkle - danger * 0.3)
    ctx.fillStyle = `rgba(255,255,255,${alpha})`
    ctx.beginPath()
    ctx.arc(s.x * w, s.y * h, s.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawMountains(ctx: CanvasRenderingContext2D, w: number, h: number, offset: number) {
  ctx.fillStyle = '#151535'
  ctx.beginPath()
  ctx.moveTo(0, h * 0.65)
  for (let i = 0; i <= w; i += 8) {
    const sx = (i + offset * 0.15) % (w * 1.2)
    let mh = 0
    for (const mp of MOUNTAIN_POINTS) {
      const dx = sx / w - mp.x
      mh += mp.h * Math.max(0, 1 - Math.abs(dx) * 6)
    }
    ctx.lineTo(i, h * 0.65 - mh * 0.4)
  }
  ctx.lineTo(w, h * 0.65)
  ctx.closePath()
  ctx.fill()
}

function drawBuildings(ctx: CanvasRenderingContext2D, w: number, h: number, offset: number) {
  const groundY = h * 0.70
  for (const b of BUILDINGS) {
    const bx = ((b.x * w * 1.4) + offset * 0.4) % (w * 1.4) - 50
    ctx.fillStyle = '#0d0d2b'
    ctx.fillRect(bx, groundY - b.h, b.w, b.h)

    ctx.fillStyle = 'rgba(255,200,80,0.12)'
    for (let wy = groundY - b.h + 8; wy < groundY - 8; wy += 14) {
      for (let wx = bx + 4; wx < bx + b.w - 4; wx += 10) {
        if ((Math.floor(wx / 10) + Math.floor(wy / 14)) % 3 !== 0) {
          ctx.fillRect(wx, wy, 6, 6)
        }
      }
    }
  }
}

function drawGround(ctx: CanvasRenderingContext2D, w: number, h: number, offset: number, danger: number) {
  const groundY = h * 0.70

  const gr = Math.min(30, 26 + danger * 10)
  const gg = Math.min(30, 26)
  const gb = Math.min(46, 42 - danger * 10)
  const grad = ctx.createLinearGradient(0, groundY, 0, h)
  grad.addColorStop(0, `rgb(${gr},${gg},${gb})`)
  grad.addColorStop(0.3, `rgb(${Math.max(10,gr-5)},${Math.max(10,gg-5)},${Math.max(10,gb-10)})`)
  grad.addColorStop(1, '#0f0f1e')
  ctx.fillStyle = grad
  ctx.fillRect(0, groundY, w, h - groundY)

  ctx.strokeStyle = `rgba(42,42,${72 - danger * 20},0.6)`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, groundY)
  ctx.lineTo(w, groundY)
  ctx.stroke()

  ctx.strokeStyle = `rgba(42,42,${72 - danger * 20},0.4)`
  ctx.lineWidth = 3
  ctx.setLineDash([25, 35])
  for (let i = -40; i < w + 40; i += 60) {
    const lx = (i - offset * 1.5) % (w + 80)
    ctx.beginPath()
    ctx.moveTo(lx, groundY + (h - groundY) * 0.35)
    ctx.lineTo(lx + 20, groundY + (h - groundY) * 0.35)
    ctx.stroke()
  }
  ctx.setLineDash([])

  ctx.strokeStyle = `rgba(34,34,${64 - danger * 20},0.3)`
  ctx.lineWidth = 2
  for (let i = -20; i < w + 20; i += 80) {
    const lx = (i - offset * 1.5) % (w + 40)
    ctx.beginPath()
    ctx.moveTo(lx, groundY + (h - groundY) * 0.65)
    ctx.lineTo(lx + 30, groundY + (h - groundY) * 0.65)
    ctx.stroke()
  }

  if (danger > 0.3) {
    ctx.fillStyle = `rgba(100,0,0,${danger * 0.08})`
    ctx.fillRect(0, groundY, w, h - groundY)
  }
}

function drawFog(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, danger: number) {
  const baseAlpha = 0.06 + danger * 0.1
  for (const f of FOG_PARTICLES) {
    const fx = ((f.x * w) + time * f.speed * 0.02) % (w + f.size * 2) - f.size
    const alpha = baseAlpha * (0.5 + Math.sin(time * 0.001 * f.speed + f.phase) * 0.3)
    const fogGrad = ctx.createRadialGradient(fx, h * f.y, 0, fx, h * f.y, f.size)
    fogGrad.addColorStop(0, `rgba(150,100,180,${alpha})`)
    fogGrad.addColorStop(1, 'rgba(150,100,180,0)')
    ctx.fillStyle = fogGrad
    ctx.beginPath()
    ctx.arc(fx, h * f.y, f.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number, danger: number) {
  if (danger <= 0) return
  const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.9)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, `rgba(20,0,0,${danger * 0.5})`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
}

export function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, runFrame: number, speed: number) {
  ctx.save()
  const s = Math.min(ctx.canvas.width, ctx.canvas.height) / 500

  const legAngle = Math.sin(runFrame * 0.12) * 0.4
  const armAngle = Math.sin(runFrame * 0.12 + Math.PI) * 0.3
  const bounce = Math.abs(Math.sin(runFrame * 0.12)) * 3 * s

  const headY = y - 45 * s + bounce
  const bodyY = y - 35 * s + bounce

  ctx.strokeStyle = '#1565C0'
  ctx.lineWidth = 4 * s
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.moveTo(x - 5 * s, y + bounce)
  ctx.lineTo(x - 5 * s - legAngle * 18 * s, y + 28 * s)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x + 5 * s, y + bounce)
  ctx.lineTo(x + 5 * s + legAngle * 18 * s, y + 28 * s)
  ctx.stroke()

  ctx.fillStyle = '#4FC3F7'
  ctx.beginPath()
  ctx.roundRect(x - 11 * s, bodyY, 22 * s, 22 * s, 4 * s)
  ctx.fill()

  ctx.fillStyle = '#4FC3F7'
  ctx.shadowColor = '#4FC3F7'
  ctx.shadowBlur = 8 * s
  ctx.fill()
  ctx.shadowBlur = 0

  ctx.strokeStyle = '#FFCC80'
  ctx.lineWidth = 3.5 * s

  ctx.beginPath()
  ctx.moveTo(x - 11 * s, bodyY + 5 * s)
  ctx.lineTo(x - 11 * s - armAngle * 15 * s - 10 * s, bodyY + 8 * s + 16 * s)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x + 11 * s, bodyY + 5 * s)
  ctx.lineTo(x + 11 * s + armAngle * 15 * s + 10 * s, bodyY + 8 * s + 16 * s)
  ctx.stroke()

  ctx.fillStyle = '#FFCC80'
  ctx.beginPath()
  ctx.arc(x, headY - 12 * s, 12 * s, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#1565C0'
  ctx.beginPath()
  ctx.ellipse(x, headY - 14 * s, 10 * s, 4 * s, 0, Math.PI, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(x - 10 * s, headY - 14 * s, 20 * s, 3 * s)

  ctx.fillStyle = '#222'
  ctx.beginPath()
  ctx.arc(x - 4 * s, headY - 12 * s, 1.8 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + 4 * s, headY - 12 * s, 1.8 * s, 0, Math.PI * 2)
  ctx.fill()

  if (speed > 1.2) {
    for (let i = 0; i < 3; i++) {
      const alpha = (speed - 1) * 0.15 * (1 - i * 0.25)
      ctx.fillStyle = `rgba(79,195,247,${alpha})`
      const tx = x - (i + 1) * 14 * s * speed
      ctx.beginPath()
      ctx.arc(tx + (Math.random() - 0.5) * 6, y - 20 * s + (Math.random() - 0.5) * 12, 3 * s * (1 - i * 0.2), 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()
}

export function drawMonster(ctx: CanvasRenderingContext2D, x: number, y: number, gap: number, isClose: boolean, time: number) {
  ctx.save()
  const s = Math.min(ctx.canvas.width, ctx.canvas.height) / 500
  const proximityScale = 1 + (1 - gap / 100) * 0.7
  ctx.translate(x, y)
  ctx.scale(proximityScale, proximityScale)

  const pulse = Math.sin(time * 0.003) * 4 + 4
  const bodyBob = Math.sin(time * 0.004) * 2

  const auraGrad = ctx.createRadialGradient(0, -25 * s, 0, 0, -25 * s, 65 * s)
  const auraAlpha = isClose ? 0.35 : 0.08 + (1 - gap / 100) * 0.15
  auraGrad.addColorStop(0, `rgba(255,0,0,${auraAlpha})`)
  auraGrad.addColorStop(0.4, `rgba(180,0,0,${auraAlpha * 0.5})`)
  auraGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = auraGrad
  ctx.beginPath()
  ctx.arc(0, -25 * s, 65 * s, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#1a0010'
  ctx.beginPath()
  ctx.moveTo(-24 * s, -8 * s + bodyBob)
  ctx.quadraticCurveTo(-32 * s, -30 * s + pulse + bodyBob, -20 * s, -46 * s + pulse + bodyBob)
  ctx.quadraticCurveTo(-12 * s, -56 * s + pulse + bodyBob, 0, -60 * s + pulse + bodyBob)
  ctx.quadraticCurveTo(12 * s, -56 * s + pulse + bodyBob, 20 * s, -46 * s + pulse + bodyBob)
  ctx.quadraticCurveTo(32 * s, -30 * s + pulse + bodyBob, 24 * s, -8 * s + bodyBob)
  ctx.lineTo(30 * s, 4 * s + bodyBob)
  ctx.lineTo(-30 * s, 4 * s + bodyBob)
  ctx.closePath()
  ctx.fill()

  const hornH = 10 * s + pulse * 0.5
  ctx.fillStyle = '#0d0008'
  ctx.beginPath()
  ctx.moveTo(-14 * s, -50 * s + pulse + bodyBob)
  ctx.lineTo(-10 * s, -50 * s - hornH + pulse + bodyBob)
  ctx.lineTo(-6 * s, -48 * s + pulse + bodyBob)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(14 * s, -50 * s + pulse + bodyBob)
  ctx.lineTo(10 * s, -50 * s - hornH + pulse + bodyBob)
  ctx.lineTo(6 * s, -48 * s + pulse + bodyBob)
  ctx.closePath()
  ctx.fill()

  ctx.save()
  ctx.shadowColor = isClose ? '#ff2200' : '#ff0000'
  ctx.shadowBlur = isClose ? 30 * s : 15 * s

  const eyeJitter = isClose ? Math.sin(time * 0.005) * s : 0
  ctx.fillStyle = isClose ? '#ff2200' : '#ff1100'
  ctx.beginPath()
  ctx.ellipse(-10 * s + eyeJitter, -36 * s + pulse + bodyBob, 6 * s, 7.5 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(10 * s + eyeJitter, -36 * s + pulse + bodyBob, 6 * s, 7.5 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  const pupilTrackX = Math.sin(time * 0.001) * 2 * s
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(-10 * s + pupilTrackX, -37 * s + pulse + bodyBob, 2.5 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(10 * s + pupilTrackX, -37 * s + pulse + bodyBob, 2.5 * s, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#111'
  ctx.beginPath()
  ctx.arc(-10 * s + pupilTrackX + 1 * s, -37 * s + pulse + bodyBob, 1.2 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(10 * s + pupilTrackX + 1 * s, -37 * s + pulse + bodyBob, 1.2 * s, 0, Math.PI * 2)
  ctx.fill()

  if (isClose || gap < 40) {
    ctx.fillStyle = '#220005'
    ctx.beginPath()
    ctx.moveTo(-16 * s, -22 * s + pulse + bodyBob)
    for (let i = -12; i <= 12; i += 4) {
      ctx.lineTo(i * s, (-22 + (i % 8 === 0 ? -4 : -2)) * s + pulse + bodyBob)
    }
    ctx.lineTo(16 * s, -22 * s + pulse + bodyBob)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#fff'
    const teeth: [number, number][] = [
      [-14, -22], [-10, -24], [-6, -22], [-2, -24],
      [2, -22], [6, -24], [10, -22], [14, -24],
    ]
    for (const [tx, ty] of teeth) {
      ctx.beginPath()
      ctx.moveTo(tx * s - 1.5 * s, ty * s + pulse + bodyBob)
      ctx.lineTo(tx * s, (ty - 5) * s + pulse + bodyBob)
      ctx.lineTo(tx * s + 1.5 * s, ty * s + pulse + bodyBob)
      ctx.closePath()
      ctx.fill()
    }
  } else {
    ctx.strokeStyle = '#8b0000'
    ctx.lineWidth = 2.5 * s
    ctx.beginPath()
    ctx.moveTo(-10 * s, -20 * s + pulse + bodyBob)
    ctx.quadraticCurveTo(0, -14 * s + pulse + bodyBob, 10 * s, -20 * s + pulse + bodyBob)
    ctx.stroke()
  }

  if (isClose) {
    ctx.strokeStyle = 'rgba(150,0,0,0.4)'
    ctx.lineWidth = 1.5 * s
    ctx.setLineDash([3 * s, 5 * s])
    for (let side = -1; side <= 1; side += 2) {
      ctx.beginPath()
      ctx.moveTo(side * 7 * s, -15 * s + pulse + bodyBob)
      ctx.quadraticCurveTo(
        side * 10 * s, -8 * s + pulse + bodyBob + Math.sin(time * 0.005) * 4 * s,
        side * 8 * s, -4 * s + pulse + bodyBob,
      )
      ctx.stroke()
    }
    ctx.setLineDash([])
  }

  const armExtension = isClose
    ? 42 * s
    : 18 * s + (1 - gap / 100) * 24 * s

  const armSway = Math.sin(time * 0.003) * 3 * s

  ctx.strokeStyle = '#1a0010'
  ctx.lineWidth = 7 * s
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.moveTo(-28 * s, -24 * s + pulse + bodyBob)
  ctx.quadraticCurveTo(-46 * s, -34 * s + pulse + bodyBob + armSway, -42 * s, -armExtension)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(28 * s, -24 * s + pulse + bodyBob)
  ctx.quadraticCurveTo(46 * s, -34 * s + pulse + bodyBob - armSway, 42 * s, -armExtension)
  ctx.stroke()

  ctx.fillStyle = '#330000'
  for (const side of [-1, 1]) {
    for (let claw = -1; claw <= 1; claw++) {
      const cx = side * (42 + claw * 3) * s
      const cy = -armExtension + side * claw * 2 * s
      ctx.beginPath()
      ctx.moveTo(cx - 1.5 * s, cy)
      ctx.lineTo(cx + claw * s, cy + 10 * s)
      ctx.lineTo(cx + 1.5 * s, cy)
      ctx.closePath()
      ctx.fill()
    }
  }

  ctx.restore()
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], _w: number, _h: number) {
  for (const p of particles) {
    const alpha = p.life / p.maxLife
    ctx.globalAlpha = alpha
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * (0.5 + alpha * 0.5), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawPlayerIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const s = size
  ctx.strokeStyle = '#4FC3F7'
  ctx.lineWidth = 1.8
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(cx, cy - s * 0.3, s * 0.25, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, cy - s * 0.05)
  ctx.lineTo(cx, cy + s * 0.3)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, cy + s * 0.05)
  ctx.lineTo(cx - s * 0.35, cy + s * 0.5)
  ctx.moveTo(cx, cy + s * 0.05)
  ctx.lineTo(cx + s * 0.35, cy + s * 0.5)
  ctx.stroke()
}

function drawMonsterIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const s = size
  ctx.fillStyle = '#F44336'
  ctx.beginPath()
  ctx.arc(cx, cy, s * 0.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#B71C1C'
  ctx.beginPath()
  ctx.arc(cx - s * 0.15, cy - s * 0.05, s * 0.08, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + s * 0.15, cy - s * 0.05, s * 0.08, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#B71C1C'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.arc(cx, cy + s * 0.05, s * 0.1, 0, Math.PI)
  ctx.stroke()
}

function drawGapBar(ctx: CanvasRenderingContext2D, w: number, gap: number, streak: number) {
  const barW = Math.min(360, w * 0.45)
  const barH = 14
  const x = w / 2 - barW / 2
  const y = 18

  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.beginPath()
  ctx.roundRect(x, y, barW, barH, 7)
  ctx.fill()

  const fillW = Math.max(4, barW * (gap / 100))
  const color = gap > 50 ? '#4CAF50' : gap > 25 ? '#FFA000' : '#D32F2F'
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.roundRect(x, y, fillW, barH, 7)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = '9px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${Math.round(gap)}m`, w / 2, y + barH / 2 + 1)

  drawPlayerIcon(ctx, x - 12, y + barH / 2, 10)
  drawMonsterIcon(ctx, x + barW + 12, y + barH / 2, 10)

  ctx.textAlign = 'right'
  ctx.font = 'bold 11px system-ui, sans-serif'
  ctx.fillStyle = '#FFD700'
  if (streak > 0) {
    ctx.fillText(`x${streak}`, w - 14, y + barH / 2 + 1)
  }
}

export function drawSpeedLines(ctx: CanvasRenderingContext2D, w: number, h: number, speed: number, time: number) {
  if (speed <= 1.1) return
  const intensity = (speed - 1) * 0.35
  ctx.strokeStyle = `rgba(100,200,255,${intensity * 0.25})`
  ctx.lineWidth = 1.5

  for (let i = 0; i < 10; i++) {
    const lx = (time * speed * 0.1 + i * (w / 10)) % (w + 100) - 50
    const ly = 80 + (i * 67) % (h * 0.55)
    ctx.beginPath()
    ctx.moveTo(lx, ly)
    ctx.lineTo(lx - 80 * speed, ly + (i % 3 - 1) * 12)
    ctx.stroke()
  }
}

export function drawMessage(ctx: CanvasRenderingContext2D, w: number, h: number, message: string | null, messageTimer: number) {
  if (!message || messageTimer <= 0) return
  const alpha = Math.min(1, messageTimer / 0.5)
  const y = h * 0.22

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = message.startsWith('+') ? '#4CAF50' : '#F44336'
  ctx.font = `bold ${Math.min(30, w * 0.055)}px system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = message.startsWith('+') ? '#4CAF50' : '#F44336'
  ctx.shadowBlur = 25
  ctx.fillText(message, w / 2, y)
  ctx.restore()
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: GameState,
  time: number,
  message: string | null,
  messageTimer: number,
) {
  ctx.save()

  if (state.screenShake > 0) {
    const shakeIntensity = state.screenShake * 4
    ctx.translate(
      (Math.random() - 0.5) * shakeIntensity,
      (Math.random() - 0.5) * shakeIntensity,
    )
  }

  const danger = Math.max(0, Math.min(1, (70 - state.gap) / 70))
  const groundY = h * 0.70

  drawSky(ctx, w, h, danger)
  drawStars(ctx, w, h, time, danger)
  drawMountains(ctx, w, h, state.scrollOffset)
  drawBuildings(ctx, w, h, state.scrollOffset)
  drawGround(ctx, w, h, state.scrollOffset, danger)
  drawFog(ctx, w, h, time, danger)

  const playerX = w * 0.28
  const monsterX = Math.max(playerX + 30, playerX + ((state.gap / 100) * w * 0.55) + 20)
  const isClose = state.gap < 35

  drawSpeedLines(ctx, w, h, state.speed, time)
  drawPlayer(ctx, playerX, groundY, state.runFrame, state.speed)
  drawMonster(ctx, monsterX, groundY, state.gap, isClose, time)
  drawParticles(ctx, state.particles, w, h)
  drawVignette(ctx, w, h, danger)
  drawGapBar(ctx, w, state.gap, state.streak)
  drawMessage(ctx, w, h, message, messageTimer)

  ctx.restore()
}

export function spawnParticles(particles: Particle[], x: number, y: number, count: number, color: string): Particle[] {
  const newParticles = [...particles]
  for (let i = 0; i < count; i++) {
    newParticles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 3,
      vy: -Math.random() * 2 - 1,
      life: 1,
      maxLife: 20 + Math.random() * 20,
      size: 2 + Math.random() * 3,
      color,
    })
  }
  return newParticles
}

export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      life: p.life + 1,
      vy: p.vy + 0.05,
    }))
    .filter(p => p.life < p.maxLife)
}
