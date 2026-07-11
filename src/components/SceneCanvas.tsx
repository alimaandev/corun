import { useEffect, useRef, useCallback, useState } from 'react'
import { SceneConfig, SceneAction } from '../game/types'
import { drawPlayerSprite, NPC_DRAWERS } from '../game/sprites'

interface Props {
  scene: SceneConfig
  onDone: () => void
}

interface NpcState {
  id: string
  x: number
  dir: 'left' | 'right'
}

interface AnimPos {
  current: number
  target: number
  speed: number
}

export default function SceneCanvas({ scene, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scriptIdx = useRef(0)
  const dialogueText = useRef('')
  const dialogueSpeaker = useRef('')
  const dialogueDone = useRef(false)
  const isWaiting = useRef(false)
  const npcs = useRef<NpcState[]>([])
  const playerX = useRef(0.5)
  const playerAnim = useRef<'idle' | 'stand' | 'walk'>('stand')
  const shakeIntensity = useRef(0)
  const flashAlpha = useRef(0)
  const fadeAlpha = useRef(0)
  const fadeDir = useRef<-1 | 0 | 1>(-1)
  const typingTimer = useRef<number>(0)
  const typingIdx = useRef(0)
  const frame = useRef(0)
  const doneRef = useRef(false)
  const userDoneRef = useRef(onDone)
  const timeoutIds = useRef<number[]>([])
  const disposedRef = useRef(false)
  userDoneRef.current = onDone

  function clearTimeouts() {
    for (const id of timeoutIds.current) clearTimeout(id)
    timeoutIds.current = []
  }

  const advance = useCallback(() => {
    if (doneRef.current) return
    dialogueDone.current = false
    dialogueText.current = ''
    dialogueSpeaker.current = ''
    isWaiting.current = false
    clearTimeout(typingTimer.current)

    const actions = scene.script
    while (scriptIdx.current < actions.length) {
      const action = actions[scriptIdx.current]
      scriptIdx.current++
      if (!action) break

      switch (action[0]) {
        case 'dialogue': {
          const [, speaker, text] = action
          dialogueSpeaker.current = speaker
          typingIdx.current = 0
          dialogueText.current = ''
          const fullText = text
          function typeChar() {
            if (disposedRef.current) return
            if (typingIdx.current < fullText.length) {
              dialogueText.current = fullText.slice(0, typingIdx.current + 1)
              typingIdx.current++
              typingTimer.current = window.setTimeout(typeChar, 25)
              timeoutIds.current.push(typingTimer.current)
            } else {
              dialogueDone.current = true
            }
          }
          typeChar()
          return
        }
        case 'addNpc': {
          const [, id, x, dir] = action
          npcs.current = npcs.current.filter(n => n.id !== id)
          npcs.current.push({ id, x, dir })
          break
        }
        case 'moveNpc': {
          const [, id, toX] = action
          const npc = npcs.current.find(n => n.id === id)
          if (npc) npc.x = toX
          break
        }
        case 'movePlayer': {
          const [, toX] = action
          playerX.current = toX
          break
        }
        case 'playerAnim': {
          const [, anim] = action
          playerAnim.current = anim
          break
        }
        case 'effect': {
          const [, kind] = action
          if (kind === 'shake') { shakeIntensity.current = 8 }
          else if (kind === 'flash') { flashAlpha.current = 1 }
          else if (kind === 'fadeOut') { fadeDir.current = 1; fadeAlpha.current = 0 }
          else if (kind === 'fadeIn') { fadeDir.current = -1; fadeAlpha.current = 1 }
          isWaiting.current = true
          const effectId = window.setTimeout(() => { if (!disposedRef.current) { isWaiting.current = false; advance() } }, kind === 'fadeOut' || kind === 'fadeIn' ? 600 : 300)
          timeoutIds.current.push(effectId)
          return
        }
        case 'wait': {
          const [, ms] = action
          isWaiting.current = true
          const waitId = window.setTimeout(() => { if (!disposedRef.current) { isWaiting.current = false; advance() } }, ms)
          timeoutIds.current.push(waitId)
          return
        }
        case 'transition': {
          doneRef.current = true
          const transId = window.setTimeout(() => { if (!disposedRef.current) userDoneRef.current() }, 200)
          timeoutIds.current.push(transId)
          return
        }
      }
    }
  }, [scene.script])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let disposed = false
    let anim = 0

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = window.innerWidth + 'px'
      canvas!.style.height = window.innerHeight + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    function drawElement(type: string, ex: number, ey: number, ew: number, eh: number, color: string | undefined) {
      const w = canvas!.width / (window.devicePixelRatio || 1)
      const h = canvas!.height / (window.devicePixelRatio || 1)
      const x = ex * w
      const y = ey * h
      const rw = (ew || 0.1) * w
      const rh = (eh || 0.1) * h
      const s = Math.max(1, Math.floor(w / 300))
      const fc = frame.current
      const flicker = Math.sin(fc * 0.1 + ex * 10) * 0.15 + 0.85

      switch (type) {
        case 'bars': {
          ctx!.fillStyle = color || '#555'
          const barW = Math.max(4, rw * 0.15)
          const count = Math.floor(rw / (barW * 2))
          for (let i = 0; i < count; i++) {
            ctx!.fillRect(x + i * barW * 2, y, Math.max(2, barW), rh)
          }
          break
        }
        case 'torch': {
          const glow = flicker * 60 + 40
          const grad = ctx!.createRadialGradient(x, y, 0, x, y, glow * s * 0.5)
          const tc = color || '#FFA000'
          grad.addColorStop(0, tc + '88')
          grad.addColorStop(0.3, tc + '22')
          grad.addColorStop(1, 'transparent')
          ctx!.fillStyle = grad
          ctx!.fillRect(x - glow * s, y - glow * s, glow * 2 * s, glow * 2 * s)
          ctx!.fillStyle = '#8B4513'
          ctx!.fillRect(x - 2 * s, y + 4 * s, 4 * s, 10 * s)
          ctx!.fillStyle = tc
          const th = 6 + flicker * 4
          ctx!.fillRect(x - 2 * s, y - th * s, 4 * s, th * s)
          ctx!.fillStyle = '#fff'
          ctx!.fillRect(x - 1 * s, y - (th - 2) * s, 2 * s, 3 * s)
          break
        }
        case 'window':
        case 'windowHigh': {
          ctx!.fillStyle = color || '#4FC3F7'
          ctx!.fillRect(x, y, rw, rh)
          ctx!.fillStyle = 'rgba(79,195,247,0.15)'
          ctx!.fillRect(x + rw * 0.1, y + rh * 0.1, rw * 0.8, rh * 0.8)
          ctx!.strokeStyle = '#333'
          ctx!.lineWidth = 2
          ctx!.strokeRect(x, y, rw, rh)
          ctx!.beginPath()
          ctx!.moveTo(x + rw / 2, y)
          ctx!.lineTo(x + rw / 2, y + rh)
          ctx!.moveTo(x, y + rh / 2)
          ctx!.lineTo(x + rw, y + rh / 2)
          ctx!.stroke()
          break
        }
        case 'bed': {
          ctx!.fillStyle = color || '#4a3a2a'
          ctx!.fillRect(x, y, rw, rh)
          ctx!.fillStyle = '#5a4a3a'
          ctx!.fillRect(x + 4, y + 4, rw - 8, rh - 8)
          break
        }
        case 'chain': {
          ctx!.strokeStyle = color || '#666'
          ctx!.lineWidth = 2
          for (let i = 0; i < rh; i += 8) {
            ctx!.beginPath()
            ctx!.ellipse(x + rw / 2, y + i, 4, 3, 0, 0, Math.PI * 2)
            ctx!.stroke()
          }
          break
        }
        case 'pipe': {
          ctx!.fillStyle = color || '#4a5a3a'
          ctx!.fillRect(x, y, rw, rh)
          ctx!.fillStyle = 'rgba(0,0,0,0.2)'
          ctx!.fillRect(x, y + rh * 0.2, rw, rh * 0.3)
          break
        }
        case 'pillar': {
          ctx!.fillStyle = color || '#555'
          ctx!.fillRect(x, y, rw, rh)
          ctx!.fillStyle = '#666'
          ctx!.fillRect(x + rw * 0.1, y, rw * 0.8, rh)
          ctx!.fillStyle = '#777'
          ctx!.fillRect(x + rw * 0.05, y, rw * 0.9, rh * 0.05)
          ctx!.fillRect(x + rw * 0.05, y + rh * 0.15, rw * 0.9, rh * 0.03)
          break
        }
        case 'throne': {
          ctx!.fillStyle = color || '#ffd700'
          ctx!.fillRect(x + rw * 0.2, y + rh * 0.2, rw * 0.6, rh * 0.8)
          ctx!.fillRect(x, y + rh * 0.4, rw, rh * 0.2)
          ctx!.fillRect(x + rw * 0.1, y, rw * 0.8, rh * 0.3)
          ctx!.fillStyle = '#cc8800'
          ctx!.fillRect(x + rw * 0.3, y + rh * 0.6, rw * 0.4, rh * 0.1)
          break
        }
        case 'banner': {
          ctx!.fillStyle = color || '#cc0000'
          ctx!.fillRect(x, y, rw, rh)
          ctx!.fillStyle = '#ffd700'
          ctx!.fillRect(x + rw * 0.1, y + rh * 0.1, rw * 0.8, rh * 0.15)
          ctx!.fillRect(x + rw * 0.1, y + rh * 0.5, rw * 0.8, rh * 0.15)
          ctx!.strokeStyle = '#333'
          ctx!.lineWidth = 1
          ctx!.strokeRect(x, y, rw, rh)
          break
        }
        case 'door': {
          ctx!.fillStyle = color || '#5a3a2a'
          ctx!.fillRect(x, y, rw, rh)
          ctx!.fillStyle = '#4a2a1a'
          ctx!.fillRect(x + rw * 0.05, y + rh * 0.05, rw * 0.9, rh * 0.9)
          ctx!.fillStyle = '#ffd700'
          ctx!.fillRect(x + rw * 0.75, y + rh * 0.45, rw * 0.1, rh * 0.1)
          ctx!.strokeStyle = '#333'
          ctx!.lineWidth = 2
          ctx!.strokeRect(x, y, rw, rh)
          break
        }
        case 'table': {
          ctx!.fillStyle = color || '#5a3a2a'
          ctx!.fillRect(x, y, rw, rh)
          ctx!.fillStyle = '#6a4a3a'
          ctx!.fillRect(x + 4, y + 2, rw - 8, rh - 4)
          ctx!.fillStyle = '#4a2a1a'
          ctx!.fillRect(x - 4, y + rh - 4, 6, 8)
          ctx!.fillRect(x + rw - 2, y + rh - 4, 6, 8)
          break
        }
      }
    }

    function loop() {
      if (disposed) return
      const dpr = window.devicePixelRatio || 1
      const w = canvas!.width / dpr
      const h = canvas!.height / dpr
      const scale = Math.max(2, Math.floor(w / 250))

      frame.current++

      ctx!.save()

      if (shakeIntensity.current > 0.5) {
        ctx!.translate(
          (Math.random() - 0.5) * shakeIntensity.current * 2,
          (Math.random() - 0.5) * shakeIntensity.current * 2,
        )
        shakeIntensity.current *= 0.85
      } else {
        shakeIntensity.current = 0
      }

      if (flashAlpha.current > 0.01) {
        ctx!.fillStyle = `rgba(255,255,255,${flashAlpha.current * 0.6})`
        ctx!.fillRect(0, 0, w, h)
        flashAlpha.current *= 0.85
      } else {
        flashAlpha.current = 0
      }

      // Background gradient
      const grad = ctx!.createLinearGradient(0, 0, 0, h * 0.5)
      grad.addColorStop(0, scene.bgTop)
      grad.addColorStop(1, scene.bgBottom)
      ctx!.fillStyle = grad
      ctx!.fillRect(0, 0, w, h)

      // Ground
      const groundY = h * 0.6
      ctx!.fillStyle = scene.groundColor
      ctx!.fillRect(0, groundY, w, h - groundY)

      // Wall color on upper portion
      const hexToRgba = (hex: string, a: number) => {
        const c = hex.replace('#', '')
        const r = parseInt(c.length === 3 ? c[0] + c[0] + c[1] + c[1] + c[2] + c[2] : c.slice(0, 2), 16)
        const g = parseInt(c.length === 3 ? c[1] + c[1] + c[2] + c[2] : c.slice(2, 4), 16)
        const b = parseInt(c.length === 3 ? c[2] + c[2] + c[0] + c[0] : c.slice(4, 6), 16)
        return `rgba(${r},${g},${b},${a})`
      }
      ctx!.fillStyle = hexToRgba(scene.wallColor, 0.27)
      ctx!.fillRect(0, 0, w, groundY)

      // Floor line
      ctx!.fillStyle = 'rgba(0,0,0,0.3)'
      ctx!.fillRect(0, groundY, w, 4)

      // Draw elements
      for (const el of scene.elements) {
        const ew = el.w || 0.1
        const eh = el.h || 0.1
        drawElement(el.type, el.x, el.y, ew, eh, el.color)
      }

      // Draw NPCs
      for (const npc of npcs.current) {
        const drawer = NPC_DRAWERS[npc.id as keyof typeof NPC_DRAWERS]
        if (drawer) {
          ctx!.save()
          if (npc.dir === 'right') {
            ctx!.translate(npc.x * w, 0)
            ctx!.scale(-1, 1)
            ctx!.translate(-npc.x * w, 0)
          }
          drawer(ctx!, npc.x * w, groundY - 4, scale, frame.current)
          ctx!.restore()
        }
      }

      // Draw player
      drawPlayerSprite(ctx!, playerX.current * w, groundY - 4, scale, frame.current)

      // Fade overlay
      if (fadeAlpha.current > 0.01) {
        ctx!.fillStyle = `rgba(0,0,0,${fadeAlpha.current})`
        ctx!.fillRect(0, 0, w, h)
        if (fadeDir.current === 1) fadeAlpha.current = Math.min(1, fadeAlpha.current + 0.03)
        else if (fadeDir.current === -1) fadeAlpha.current = Math.max(0, fadeAlpha.current - 0.03)
      }

      // Dialogue box
      if (dialogueSpeaker.current || dialogueText.current) {
        const boxH = h * 0.22
        const boxY = h - boxH
        ctx!.fillStyle = 'rgba(0,0,0,0.85)'
        ctx!.fillRect(0, boxY, w, boxH)
        ctx!.strokeStyle = 'rgba(79,195,247,0.15)'
        ctx!.lineWidth = 2
        ctx!.strokeRect(4, boxY, w - 8, boxH)

        if (dialogueSpeaker.current) {
          ctx!.fillStyle = '#4FC3F7'
          ctx!.font = `${Math.max(10, Math.floor(scale * 5))}px 'Press Start 2P', monospace`
          ctx!.fillText(dialogueSpeaker.current, 16, boxY + 22)
        }

        if (dialogueText.current) {
          ctx!.fillStyle = '#ddd'
          const fs = Math.max(10, Math.floor(scale * 4))
          ctx!.font = `${fs}px 'JetBrains Mono', monospace`
          const maxW = w - 40
          const lines: string[] = []
          let line = ''
          for (const char of dialogueText.current) {
            const test = line + char
            if (ctx!.measureText(test).width > maxW && line.length > 0) {
              lines.push(line)
              line = char
            } else line = test
          }
          if (line) lines.push(line)
          const lh = fs * 1.5
          const textStartY = dialogueSpeaker.current ? boxY + 38 : boxY + 28
          for (let i = 0; i < lines.length; i++) {
            ctx!.fillText(lines[i], 16, textStartY + i * lh)
          }

          if (dialogueDone.current && !isWaiting.current) {
            ctx!.fillStyle = '#4FC3F7'
            const blinky = Math.sin(frame.current * 0.1) > 0
            if (blinky) {
              ctx!.font = `${fs}px monospace`
              ctx!.fillText('▌', w - 30, textStartY + (lines.length - 1) * lh)
            }
          }
        }
      }

      ctx!.restore()

      anim = requestAnimationFrame(loop)
    }

    anim = requestAnimationFrame(loop)

    advance()

    function handleClick() {
      if (doneRef.current) return
      if (isWaiting.current) return
      if (dialogueDone.current) advance()
      else {
        const actions = scene.script
        if (scriptIdx.current > 0) {
          const prev = actions[scriptIdx.current - 1]
          if (prev && prev[0] === 'dialogue') {
            clearTimeout(typingTimer.current)
            const fullText = (prev as any)[2]
            dialogueText.current = fullText
            typingIdx.current = fullText.length
            dialogueDone.current = true
          }
        }
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter') handleClick()
    }

    window.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleKey)

    return () => {
      disposed = true
      disposedRef.current = true
      clearTimeouts()
      cancelAnimationFrame(anim)
      window.removeEventListener('resize', resize)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleKey)
      clearTimeout(typingTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block', position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        imageRendering: 'pixelated',
        cursor: 'pointer',
        zIndex: 300,
      }}
    />
  )
}
