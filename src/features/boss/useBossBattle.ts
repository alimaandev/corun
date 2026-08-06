import { useCallback, useRef, useState } from 'react'
import { Challenge, Difficulty, Topic } from '../../game/types'
import { getRandomChallenge } from '../../game/engine/data/challenges'
import { playBossAppear } from '../../game/sound'
import { PixelRunnerHandle } from '../../game/PixelRunner'
import { BOSS_NAMES, BossState, getTimeLimit, pick, Mode } from '../modes'

export interface BossBattleCtx {
  gameRef: React.RefObject<PixelRunnerHandle | null>
  modeRef: React.MutableRefObject<Mode>
  setMode: (mode: Mode) => void
  topic: Topic | null
  showChallenge: (challenge: Challenge, timeLimit: number) => void
}

export function useBossBattle(ctx: BossBattleCtx) {
  const [boss, setBoss] = useState<BossState | null>(null)
  const bossRef = useRef<BossState | null>(null)

  const beginBoss = useCallback(
    (bs: BossState) => {
      bossRef.current = bs
      setBoss(bs)
      ctx.modeRef.current = 'boss'
      ctx.setMode('boss')
      ctx.gameRef.current?.setPaused(true)
      playBossAppear()
    },
    [ctx],
  )

  const finishBossBattle = useCallback(
    (bs: BossState) => {
      if (bossRef.current === bs) bossRef.current = null
      setBoss(null)
      ctx.modeRef.current = 'normal'
      ctx.setMode('normal')
      ctx.gameRef.current?.setPaused(false)
      ctx.gameRef.current?.setMultiplier(1)

      for (let i = 0; i < bs.correctCount; i++) {
        ctx.gameRef.current?.handleAnswer(true)
      }
    },
    [ctx],
  )

  const scheduleBossQuestion = useCallback(
    async (bs: BossState) => {
      if (bs.questionsLeft <= 0) {
        finishBossBattle(bs)
        return
      }
      const diff: Difficulty = 'hard'
      const q = await getRandomChallenge(new Set(), ctx.topic ?? undefined, diff)
      ctx.showChallenge(q, getTimeLimit(diff))
    },
    [ctx, finishBossBattle],
  )

  const triggerBossBattle = useCallback(() => {
    const b = pick(BOSS_NAMES)
    const bs: BossState = {
      hp: b.hp,
      maxHp: b.hp,
      name: b.name,
      questionsLeft: b.hp,
      correctCount: 0,
    }
    beginBoss(bs)
    void scheduleBossQuestion(bs)
  }, [beginBoss, scheduleBossQuestion])

  const handleBossAnswer = useCallback(
    async (correct: boolean) => {
      const bs = bossRef.current
      if (!bs) return
      if (correct) {
        bs.hp--
        bs.correctCount++
      }
      bs.questionsLeft--
      if (bs.questionsLeft <= 0) {
        finishBossBattle(bs)
        return
      }
      setBoss({ ...bs })
      const diff: Difficulty = 'hard'
      const q = await getRandomChallenge(new Set(), ctx.topic ?? undefined, diff)
      ctx.showChallenge(q, getTimeLimit(diff))
    },
    [ctx, finishBossBattle],
  )

  const reset = useCallback(() => {
    bossRef.current = null
    setBoss(null)
  }, [])

  return { boss, triggerBossBattle, handleBossAnswer, reset }
}
