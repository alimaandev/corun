export type Difficulty = 'easy' | 'medium' | 'hard'
export type Topic = 'javascript' | 'python' | 'web' | 'databases' | 'general' | 'algorithms'
export type QuestionType = 'multiple' | 'fill-blank' | 'output' | 'spot-bug'

export type SceneAction =
  | ['dialogue', speaker: string, text: string]
  | ['addNpc', npcId: string, x: number, dir: 'left' | 'right']
  | ['moveNpc', npcId: string, toX: number]
  | ['movePlayer', toX: number]
  | ['playerAnim', anim: 'idle' | 'stand' | 'walk']
  | ['effect', kind: 'shake' | 'flash' | 'fadeOut' | 'fadeIn']
  | ['wait', ms: number]
  | ['transition']

export interface SceneElement {
  type: 'bars' | 'torch' | 'window' | 'bed' | 'chain' | 'pipe' | 'table' | 'pillar' | 'throne' | 'banner' | 'door' | 'windowHigh'
  x: number
  y: number
  w?: number
  h?: number
  color?: string
}

export interface SceneConfig {
  bgTop: string
  bgBottom: string
  groundColor: string
  wallColor: string
  elements: SceneElement[]
  script: SceneAction[]
}

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

export interface LevelBoss {
  name: string
  hp: number
  difficulty: Difficulty
}

export interface LevelConfig {
  id: number
  name: string
  chapter: string
  arc: string
  storyIntro: string
  storyOutro: string
  sceneIntro: SceneConfig
  sceneOutro: SceneConfig
  scoreTarget: number
  boss: LevelBoss
  enemyType: string
  topicFilter?: Topic[]
  difficultyCap?: Difficulty
}

export interface LevelProgress {
  unlockedUpTo: number
  completed: number[]
  stars: Record<string, number>
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

export interface TriggerZone {
  x: number
  y: number
  w: number
  h: number
  puzzleId: string
  promptText: string
}

export interface GroundSegment {
  x: number
  y: number
  w: number
  h: number
}

export interface SceneNpc {
  npcId: string
  x: number
  y: number
  dir: 'left' | 'right'
  patrol?: [number, number]
}

export interface LevelSceneData {
  levelId: number
  worldWidth: number
  playerStart: { x: number; y: number }
  ground: GroundSegment[]
  blockers: GroundSegment[]
  triggers: TriggerZone[]
  npcs: SceneNpc[]
  exitZone?: { x: number; y: number; w: number; h: number }
}

export interface SceneEngineHandle {
  startLevel: (levelId: number) => void
}
