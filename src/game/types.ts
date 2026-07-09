export type Difficulty = 'easy' | 'medium' | 'hard'
export type Topic = 'javascript' | 'python' | 'web' | 'databases' | 'general' | 'algorithms'
export type QuestionType = 'multiple' | 'fill-blank' | 'output' | 'spot-bug'

export interface Challenge {
  id: number;
  type: QuestionType;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: Difficulty;
  topic: Topic;
  code?: string;
}

export interface TopicOption {
  id: Topic;
  label: string;
  description: string;
}

export interface HUDData {
  score: number;
  gap: number;
  speed: number;
  streak: number;
}
