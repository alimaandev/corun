import { useCallback, useRef, useState } from 'react'

export const SURVIVAL_LIVES = 3

export interface SurvivalCtx {
  onGameOver: () => void
}

export function useSurvival(ctx: SurvivalCtx) {
  const [lives, setLives] = useState(SURVIVAL_LIVES)
  const livesRef = useRef(SURVIVAL_LIVES)

  const loseLife = useCallback((): boolean => {
    livesRef.current--
    setLives(livesRef.current)
    if (livesRef.current <= 0) {
      ctx.onGameOver()
      return true
    }
    return false
  }, [ctx])

  const reset = useCallback(() => {
    livesRef.current = SURVIVAL_LIVES
    setLives(SURVIVAL_LIVES)
  }, [])

  const dispose = useCallback(() => {
    livesRef.current = SURVIVAL_LIVES
  }, [])

  return { lives, loseLife, reset, dispose }
}
