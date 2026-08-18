export type Difficulty = 'easy' | 'medium' | 'hard'
export type Topic =
  'javascript' | 'python' | 'typescript' | 'web' | 'databases' | 'general' | 'algorithms'
export type QuestionType = 'multiple' | 'fill-blank' | 'output' | 'spot-bug'

export interface Challenge {
  id: number
  type: QuestionType
  question: string
  options: string[]
  correct: number
  explanation: string
  difficulty: Difficulty
  topic: Topic
  code?: string
}

export interface TopicOption {
  id: Topic
  label: string
  description: string
}

export interface HUDData {
  score: number
  streak: number
  multiplier: number
}

export interface CodePuzzle {
  id: string
  levelId: number
  title: string
  description: string
  template: string
  test: string
  hint: string
  successMessage: string
  failureMessage?: string
}
