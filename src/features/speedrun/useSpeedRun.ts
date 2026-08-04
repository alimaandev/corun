import { useCallback, useRef, useState } from 'react'

export const SPEEDRUN_DURATION = 60

export interface SpeedRunCtx {
  onTimeUp: () => void
}

export function useSpeedRun(ctx: SpeedRunCtx) {
  const [timeLeft, setTimeLeft] = useState(SPEEDRUN_DURATION)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    setTimeLeft(SPEEDRUN_DURATION)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          timerRef.current = null
          ctx.onTimeUp()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [ctx])

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    setTimeLeft(SPEEDRUN_DURATION)
  }, [])

  const dispose = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  return { timeLeft, start, reset, dispose }
}
