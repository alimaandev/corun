import { useCallback, useEffect, useRef, useState } from 'react'
import { Challenge, Topic } from '../../game/types'
import { getRandomChallenge } from '../../game/engine/data/challenges'
import { PixelRunnerHandle } from '../../game/PixelRunner'
import { BONUS_DURATION, Mode } from '../modes'

export interface BonusRoundCtx {
  gameRef: React.RefObject<PixelRunnerHandle | null>
  modeRef: React.MutableRefObject<Mode>
  setMode: (mode: Mode) => void
  topic: Topic | null
  showChallenge: (challenge: Challenge, timeLimit: number) => void
  active: boolean
}

const BONUS_QUESTION_CAP = 6

export function useBonusRound(ctx: BonusRoundCtx) {
  const [bonusTimeLeft, setBonusTimeLeft] = useState(0)
  const bonusTimerRef = useRef<number>(0)
  const bonusQuestionsRef = useRef(0)
  const bonusTimeLeftRef = useRef(0)

  const finishBonusRound = useCallback(() => {
    if (bonusTimerRef.current) {
      clearInterval(bonusTimerRef.current)
      bonusTimerRef.current = 0
    }
    ctx.modeRef.current = 'normal'
    ctx.setMode('normal')
    bonusTimeLeftRef.current = 0
    setBonusTimeLeft(0)
    ctx.gameRef.current?.setMultiplier(1)
    ctx.gameRef.current?.setPaused(false)
  }, [ctx])

  const scheduleBonusQuestion = useCallback(async () => {
    const q = await getRandomChallenge(new Set(), ctx.topic ?? undefined, 'easy')
    ctx.showChallenge(q, Math.max(2, BONUS_DURATION - bonusQuestionsRef.current * 0.3))
  }, [ctx])

  const handleBonusAnswer = useCallback(
    async (correct: boolean) => {
      if (correct) bonusQuestionsRef.current++
      if (bonusTimeLeftRef.current <= 0 || bonusQuestionsRef.current >= BONUS_QUESTION_CAP) {
        finishBonusRound()
        return
      }
      const q = await getRandomChallenge(new Set(), ctx.topic ?? undefined, 'easy')
      ctx.showChallenge(q, Math.max(2, bonusTimeLeftRef.current - 0.5))
    },
    [ctx, finishBonusRound],
  )

  const triggerBonusRound = useCallback(() => {
    ctx.modeRef.current = 'bonus'
    ctx.setMode('bonus')
    bonusTimeLeftRef.current = BONUS_DURATION
    setBonusTimeLeft(BONUS_DURATION)
    bonusQuestionsRef.current = 0
    ctx.gameRef.current?.setPaused(true)
    ctx.gameRef.current?.setMultiplier(2)
    void scheduleBonusQuestion()
  }, [ctx, scheduleBonusQuestion])

  useEffect(() => {
    if (!ctx.active) return
    bonusTimeLeftRef.current = BONUS_DURATION
    const id = window.setInterval(() => {
      bonusTimeLeftRef.current = Math.max(0, bonusTimeLeftRef.current - 0.3)
      setBonusTimeLeft(bonusTimeLeftRef.current)
      if (bonusTimeLeftRef.current <= 0) finishBonusRound()
    }, 300)
    bonusTimerRef.current = id
    return () => clearInterval(id)
  }, [ctx.active, finishBonusRound])

  const reset = useCallback(() => {
    if (bonusTimerRef.current) {
      clearInterval(bonusTimerRef.current)
      bonusTimerRef.current = 0
    }
    bonusQuestionsRef.current = 0
    bonusTimeLeftRef.current = 0
    setBonusTimeLeft(0)
  }, [])

  return { bonusTimeLeft, triggerBonusRound, handleBonusAnswer, finishBonusRound, reset }
}
