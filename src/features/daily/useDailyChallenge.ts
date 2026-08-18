import { useCallback, useEffect, useRef } from 'react'
import { Challenge } from '../../game/types'
import { markDailyCompleted } from '../../lib/store'

export function useDailyChallenge() {
  const isDailyRef = useRef(false)
  const dailyTimeoutRef = useRef<number>(0)

  useEffect(() => {
    return () => clearTimeout(dailyTimeoutRef.current)
  }, [])

  const start = useCallback(
    (challenge: Challenge, showChallenge: (c: Challenge, t: number) => void) => {
      isDailyRef.current = true
      clearTimeout(dailyTimeoutRef.current)
      dailyTimeoutRef.current = window.setTimeout(() => showChallenge(challenge, 8), 200)
    },
    [],
  )

  const complete = useCallback((score: number) => {
    if (isDailyRef.current && score > 0) markDailyCompleted()
  }, [])

  const reset = useCallback((isDaily: boolean) => {
    isDailyRef.current = isDaily
    clearTimeout(dailyTimeoutRef.current)
  }, [])

  return { isDailyRef, start, complete, reset }
}
