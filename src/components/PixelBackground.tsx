import { useRef, useEffect } from 'react'

interface Cloud { x: number; y: number; w: number; h: number; speed: number; seed: number }
interface Tree { x: number; y: number; trunkH: number; crownW: number }

const CLOUD_PATTERNS: number[][][] = [
  [[0,0,0,0,1,1,1,1,0,0,0],[0,0,1,1,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,0],[1,1,1,1,0,0,0,1,1,1,1]],
  [[0,0,0,0,0,1,1,1,0,0,0,0],[0,0,1,1,1,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,1,0],[1,1,1,1,0,0,0,0,1,1,1,1]],
  [[0,0,0,1,1,1,0,0,0],[0,1,1,1,1,1,1,0,0],[1,1,1,1,1,1,1,1,0],[1,1,1,0,0,0,1,1,1]],
  [[0,0,1,1,1,1,0,0,0,0],[0,1,1,1,1,1,1,1,0,0],[1,1,1,1,1,1,1,1,1,0],[1,1,1,0,0,0,0,1,1,1]],
]

export default function PixelBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = false
    let anim = 0
    let clouds: Cloud[] = []
    let trees: Tree[] = []

    function init(w: number, h: number) {
      clouds = Array.from({ length: 5 }, (_, i) => ({
        x: (i * 0.23 * w) % (w + 200) - 100,
        y: 30 + i * 38,
        w: 80 + (i % 4) * 24,
        h: 20 + (i % 3) * 8,
        speed: 0.12 + i * 0.04,
        seed: i,
      }))
      trees = Array.from({ length: 14 }, (_, i) => ({
        x: (i * 137 + 53) % w,
        y: h * 0.62 + (i * 17) % (h * 0.08),
        trunkH: 24 + (i % 5) * 6,
        crownW: 20 + (i % 4) * 4,
      }))
    }

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      init(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    function px(x: number, w?: number) { return Math.floor(x / (w ?? 1)) * (w ?? 1) }

    function loop(ts: number) {
      const w = canvas.width
      const h = canvas.height

      const grad = ctx.createLinearGradient(0, 0, 0, h * 0.55)
      grad.addColorStop(0, '#0b0b2e')
      grad.addColorStop(0.25, '#1e1e5a')
      grad.addColorStop(0.55, '#4a7acc')
      grad.addColorStop(1, '#6aacfc')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, Math.floor(h * 0.65))

      for (let i = 0; i < 35; i++) {
        const sx = (i * 137.9 + 41.3) % w
        const sy = (i * 97.7 + 17.3) % (h * 0.3)
        const bright = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(ts * 0.002 + i * 1.7))
        ctx.fillStyle = `rgba(255,255,255,${bright})`
        const sz = 1 + (i % 3)
        ctx.fillRect(px(sx), px(sy), sz, sz)
      }

      ctx.fillStyle = '#2a2a5a'
      ctx.beginPath()
      ctx.moveTo(0, h * 0.45)
      for (let x = 0; x <= w; x += 8) {
        ctx.lineTo(x, h * 0.45 + Math.sin(x * 0.003 + 1) * 60 + Math.sin(x * 0.008) * 25)
      }
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#3a3a6a'
      ctx.beginPath()
      ctx.moveTo(0, h * 0.52)
      for (let x = 0; x <= w; x += 8) {
        ctx.lineTo(x, h * 0.52 + Math.sin(x * 0.004 + 2) * 45 + Math.sin(x * 0.01) * 20)
      }
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#4a4a7a'
      ctx.beginPath()
      ctx.moveTo(0, h * 0.58)
      for (let x = 0; x <= w; x += 8) {
        ctx.lineTo(x, h * 0.58 + Math.sin(x * 0.005 + 3) * 30 + Math.sin(x * 0.012) * 15)
      }
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()

      for (const cloud of clouds) {
        cloud.x += cloud.speed
        if (cloud.x > w + 40) cloud.x = -cloud.w - 20
        const pattern = CLOUD_PATTERNS[cloud.seed % CLOUD_PATTERNS.length]
        const rows = pattern.length
        const cols = pattern[0].length
        const bw = Math.floor(cloud.w / cols)
        const bh = Math.floor(cloud.h / rows)
        ctx.fillStyle = `rgba(255,255,255,0.18)`
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (pattern[r][c]) {
              ctx.fillRect(px(cloud.x + c * bw), px(cloud.y + r * bh), bw, bh)
            }
          }
        }
      }

      ctx.fillStyle = '#3a7a3a'
      ctx.fillRect(0, px(h * 0.65), w, Math.floor(h * 0.35))

      ctx.fillStyle = '#4a8a4a'
      ctx.fillRect(0, px(h * 0.65), w, 8)

      ctx.fillStyle = '#5a9a5a'
      for (let i = 0; i < 25; i++) {
        const gx = (i * 97 + ts * 0.02) % w
        const gy = h * 0.66 + (i * 43) % (h * 0.2)
        ctx.fillRect(px(gx), px(gy), 4, 4)
      }

      for (const tree of trees) {
        ctx.fillStyle = '#4a2a0a'
        ctx.fillRect(px(tree.x + 3), px(tree.y + tree.trunkH * 0.4), 6, tree.trunkH * 0.6)
        ctx.fillStyle = '#2a6a2a'
        const cw = tree.crownW
        ctx.fillRect(px(tree.x + 6 - cw / 2), px(tree.y), cw, 8)
        ctx.fillRect(px(tree.x + 6 - (cw - 4) / 2), px(tree.y - 6), cw - 4, 6)
        ctx.fillStyle = '#3a8a3a'
        ctx.fillRect(px(tree.x + 6 - 2), px(tree.y - 10), 4, 4)
      }

      anim = requestAnimationFrame(loop)
    }
    anim = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(anim)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        display: 'block',
        imageRendering: 'pixelated',
      }}
    />
  )
}
