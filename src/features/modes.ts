import { Difficulty, Topic } from '../game/types'

export type Mode = 'normal' | 'boss' | 'bonus' | 'speedrun' | 'survival'

export interface BossState {
  hp: number
  maxHp: number
  name: string
  questionsLeft: number
  correctCount: number
}

export const BOSS_THRESHOLD = 150
export const BONUS_THRESHOLD = 80
export const BONUS_DURATION = 5

export const BOSS_NAMES = [
  { name: 'SYNTAX ERROR', hp: 3 },
  { name: 'NULL POINTER', hp: 3 },
  { name: 'INFINITE LOOP', hp: 4 },
  { name: 'MEMORY LEAK', hp: 3 },
  { name: 'DEADLOCK', hp: 4 },
  { name: 'RUNTIME ERROR', hp: 3 },
]

export function getTimeLimit(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 4
    case 'medium':
      return 6
    case 'hard':
      return 8
    default:
      return 5
  }
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
