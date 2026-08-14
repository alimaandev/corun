import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { useGameLoop } from '../useGameLoop'
import {
  applySideAnswer,
  applySideDamage,
  createSideSim,
  pauseSideSim,
  resetSideSim,
  stepSideSim,
  SideSimDeps,
} from '../engine/side/sideSim'
import { SideEvent, SideInput, SideSimState, SideWorld } from '../engine/side/types'
import { renderSide, VIEW_H, VIEW_W } from '../engine/side/renderer'

export const SIM_STEP = 1 / 120

export interface SideViewCanvasHandle {
  restart: () => void
  pause: (paused: boolean) => void
  applyAnswer: (correct: boolean) => void
  applyDamage: (amount: number) => void
}

export interface SideHudSnapshot {
  score: number
  hp: number
  coins: number
  time: number
  streak: number
  multiplier: number
  fire: boolean
  phase: string
  x: number
}

export interface SideViewCanvasProps {
  world?: SideWorld
  paused?: boolean
  showHitboxes?: boolean
  onEvent?: (event: SideEvent, state: SideSimState) => void
  onHud?: (hud: SideHudSnapshot) => void
  hudIntervalMs?: number
  className?: string
}

function snapshot(state: SideSimState): SideHudSnapshot {
  return {
    score: state.player.score,
    hp: state.player.hp,
    coins: state.player.coins,
    time: state.time,
    streak: state.combo.streak,
    multiplier: state.combo.multiplier,
    fire: state.combo.fireUntil > 0,
    phase: state.phase,
    x: Math.round(state.player.pos.x),
  }
}

export const SideViewCanvas = forwardRef<SideViewCanvasHandle, SideViewCanvasProps>(
  function SideViewCanvas(
    { world, paused = false, showHitboxes = false, onEvent, onHud, hudIntervalMs = 100, className },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const simRef = useRef<SideSimState | null>(null)
    const pausedRef = useRef(paused)
    const propsRef = useRef({ world, onEvent, onHud, hudIntervalMs })
    const keysRef = useRef({ left: false, right: false, down: false })
    const jumpEdgeRef = useRef({ pressed: false, released: false })
    const touchRef = useRef({ left: false, right: false })
    const hudTimerRef = useRef(0)
    const stepAccumRef = useRef(0)

    useEffect(() => {
      propsRef.current = { world, onEvent, onHud, hudIntervalMs }
    }, [world, onEvent, onHud, hudIntervalMs])

    useEffect(() => {
      pausedRef.current = paused
    }, [paused])

    useEffect(() => {
      const deps: SideSimDeps = { rng: Math.random, nowMs: () => performance.now() }
      simRef.current = createSideSim(propsRef.current.world, deps)
    }, [world])

    const restart = useCallback(() => {
      const deps: SideSimDeps = { rng: Math.random, nowMs: () => performance.now() }
      if (simRef.current) {
        simRef.current = resetSideSim(simRef.current, deps)
      } else {
        simRef.current = createSideSim(propsRef.current.world, deps)
      }
    }, [])

    const setPaused = useCallback((p: boolean) => {
      pausedRef.current = p
      if (simRef.current) simRef.current = pauseSideSim(simRef.current, p)
    }, [])

    const applyAnswer = useCallback((correct: boolean) => {
      const sim = simRef.current
      if (!sim) return
      const deps: SideSimDeps = { rng: Math.random, nowMs: () => performance.now() }
      applySideAnswer(sim, correct, deps)
    }, [])

    const applyDamage = useCallback((amount: number) => {
      const sim = simRef.current
      if (!sim) return
      const deps: SideSimDeps = { rng: Math.random, nowMs: () => performance.now() }
      const result = applySideDamage(sim, amount, deps)
      for (const e of result) {
        propsRef.current.onEvent?.(e, sim)
      }
    }, [])

    useImperativeHandle(ref, () => ({ restart, pause: setPaused, applyAnswer, applyDamage }), [
      restart,
      setPaused,
      applyAnswer,
      applyDamage,
    ])

    useEffect(() => {
      function keyDown(e: KeyboardEvent) {
        if (e.repeat) return
        const code = e.code
        if (code === 'ArrowLeft' || code === 'KeyA') keysRef.current.left = true
        if (code === 'ArrowRight' || code === 'KeyD') keysRef.current.right = true
        if (code === 'ArrowDown' || code === 'KeyS') keysRef.current.down = true
        if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
          e.preventDefault()
          jumpEdgeRef.current.pressed = true
        }
      }
      function keyUp(e: KeyboardEvent) {
        const code = e.code
        if (code === 'ArrowLeft' || code === 'KeyA') keysRef.current.left = false
        if (code === 'ArrowRight' || code === 'KeyD') keysRef.current.right = false
        if (code === 'ArrowDown' || code === 'KeyS') keysRef.current.down = false
        if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
          jumpEdgeRef.current.released = true
        }
      }
      window.addEventListener('keydown', keyDown)
      window.addEventListener('keyup', keyUp)
      return () => {
        window.removeEventListener('keydown', keyDown)
        window.removeEventListener('keyup', keyUp)
      }
    }, [])

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      function pointerDown(e: PointerEvent) {
        const el = canvasRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        if (x < 0.5) touchRef.current.left = true
        else touchRef.current.right = true
        jumpEdgeRef.current.pressed = true
      }
      function pointerUp(e: PointerEvent) {
        const el = canvasRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        if (x < 0.5) touchRef.current.left = false
        else touchRef.current.right = false
        jumpEdgeRef.current.released = true
      }
      canvas.addEventListener('pointerdown', pointerDown)
      window.addEventListener('pointerup', pointerUp)
      return () => {
        canvas.removeEventListener('pointerdown', pointerDown)
        window.removeEventListener('pointerup', pointerUp)
      }
    }, [])

    useGameLoop(
      useCallback(
        (dt: number) => {
          const sim = simRef.current
          const canvas = canvasRef.current
          if (!sim || !canvas) return
          const ctx = canvas.getContext('2d')
          if (!ctx) return

          const input: SideInput = {
            left: keysRef.current.left || touchRef.current.left,
            right: keysRef.current.right || touchRef.current.right,
            down: keysRef.current.down,
            jumpJustPressed: jumpEdgeRef.current.pressed,
            jumpJustReleased: jumpEdgeRef.current.released,
          }
          jumpEdgeRef.current.pressed = false
          jumpEdgeRef.current.released = false

          stepAccumRef.current += dt
          while (stepAccumRef.current >= SIM_STEP) {
            const result = stepSideSim(
              sim,
              SIM_STEP,
              input,
              { rng: Math.random, nowMs: () => performance.now() },
              VIEW_W,
            )
            for (const e of result.events) {
              propsRef.current.onEvent?.(e, sim)
            }
            stepAccumRef.current -= SIM_STEP
          }

          renderSide(ctx, sim, { showHitboxes })

          hudTimerRef.current += dt * 1000
          if (hudTimerRef.current >= (propsRef.current.hudIntervalMs ?? 100)) {
            hudTimerRef.current = 0
            propsRef.current.onHud?.(snapshot(sim))
          }
        },
        [showHitboxes],
      ),
      true,
    )

    return (
      <canvas
        ref={canvasRef}
        width={VIEW_W}
        height={VIEW_H}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: 'pixelated',
          touchAction: 'none',
        }}
      />
    )
  },
)
