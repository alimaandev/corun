export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Challenge {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: Difficulty;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export interface GameState {
  score: number;
  gap: number;
  speed: number;
  streak: number;
  runFrame: number;
  scrollOffset: number;
  boostUntil: number;
  penaltyUntil: number;
  particles: Particle[];
  screenShake: number;
  lastTime: number;
}

export interface HUDData {
  score: number;
  gap: number;
  speed: number;
  streak: number;
}
