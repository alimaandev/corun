import { useEffect, useRef } from 'react'

export interface GameLoopOptions {
  maxDeltaSeconds?: number
}

export function useGameLoop(
  callback: (deltaSeconds: number, now: number) => void,
  enabled: boolean = true,
  options: GameLoopOptions = {},
) {
  const { maxDeltaSeconds = 0.05 } = options
  const callbackRef = useRef(callback)
  const runningRef = useRef(enabled)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    runningRef.current = enabled
    if (!enabled) return
    let anim = 0
    let last = 0

    function loop(ts: number) {
      if (!runningRef.current) return
      if (last === 0) last = ts
      let dt = (ts - last) / 1000
      last = ts
      if (document.hidden) dt = 0
      else dt = Math.min(dt, maxDeltaSeconds)
      callbackRef.current(dt, ts)
      anim = requestAnimationFrame(loop)
    }

    anim = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(anim)
  }, [enabled, maxDeltaSeconds])
}
