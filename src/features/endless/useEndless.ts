import { useCallback, useEffect, useRef, useState } from 'react'
import { Difficulty, Topic } from '../../game/types'
import { saveBadge } from '../../lib/storage'
import { getComboMultiplier } from '../../game/engine/scoring'

export interface Badge {
  topic: Topic
  label: string
  count: number
}

export interface EndlessAnswerResult {
  multiplier: number
  adaptDiff: Difficulty | undefined
}

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard']

const COMBO_TEXTS = [
  '',
  '',
  '',
  '🔥 COMBO x1.5',
  '',
  '🔥🔥 COMBO x2',
  '',
  '🔥🔥🔥 COMBO x3',
  '',
  '🔥🔥🔥🔥 COMBO x4',
]

function getAdaptiveDifficulty(base: Difficulty, recent: boolean[]): Difficulty | undefined {
  if (recent.length >= 3) {
    const last3 = recent.slice(-3)
    const allCorrect = last3.every((r) => r)
    const allWrong = last3.every((r) => !r)
    const baseIdx = DIFFICULTY_ORDER.indexOf(base)
    if (allCorrect && baseIdx < DIFFICULTY_ORDER.length - 1) return DIFFICULTY_ORDER[baseIdx + 1]
    if (allWrong && baseIdx > 0) return DIFFICULTY_ORDER[baseIdx - 1]
  }
  return undefined
}

export function useEndless() {
  const [showCombo, setShowCombo] = useState(false)
  const [comboText, setComboText] = useState('')
  const recentCorrect = useRef<boolean[]>([])
  const topicCounts = useRef<Record<string, number>>({})
  const earnedBadges = useRef<Set<string>>(new Set())
  const streakRef = useRef(0)
  const comboTimeoutRef = useRef<number>(0)

  useEffect(() => {
    return () => clearTimeout(comboTimeoutRef.current)
  }, [])

  const showComboNotification = useCallback((level: number) => {
    clearTimeout(comboTimeoutRef.current)
    setComboText(COMBO_TEXTS[level] || '')
    setShowCombo(true)
    comboTimeoutRef.current = window.setTimeout(() => setShowCombo(false), 1200)
  }, [])

  const registerAnswer = useCallback(
    (correct: boolean, topic: Topic, difficulty: Difficulty): EndlessAnswerResult => {
      recentCorrect.current.push(correct)
      if (recentCorrect.current.length > 6) recentCorrect.current.shift()
      const adaptDiff = getAdaptiveDifficulty(difficulty, recentCorrect.current)

      if (correct) {
        topicCounts.current[topic] = (topicCounts.current[topic] || 0) + 1
        if (topicCounts.current[topic] >= 5 && !earnedBadges.current.has(topic)) {
          earnedBadges.current.add(topic)
          saveBadge(topic)
        }
      }

      streakRef.current = correct ? streakRef.current + 1 : 0
      const multiplier = getComboMultiplier(streakRef.current)
      if (multiplier >= 1.5 && correct) showComboNotification(streakRef.current)
      return { multiplier, adaptDiff }
    },
    [showComboNotification],
  )

  const registerTimeout = useCallback((difficulty: Difficulty): Difficulty | undefined => {
    recentCorrect.current.push(false)
    if (recentCorrect.current.length > 6) recentCorrect.current.shift()
    return getAdaptiveDifficulty(difficulty, recentCorrect.current)
  }, [])

  const getBadges = useCallback((): Badge[] => {
    return Array.from(earnedBadges.current).map((t) => ({
      topic: t as Topic,
      label: t,
      count: topicCounts.current[t] || 0,
    }))
  }, [])

  const reset = useCallback(() => {
    recentCorrect.current = []
    topicCounts.current = {}
    earnedBadges.current = new Set()
    streakRef.current = 0
    setShowCombo(false)
    setComboText('')
    clearTimeout(comboTimeoutRef.current)
  }, [])

  return { showCombo, comboText, registerAnswer, registerTimeout, getBadges, reset }
}
