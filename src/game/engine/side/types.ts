export interface Vec2 {
  x: number
  y: number
}

export interface AABB {
  x: number
  y: number
  w: number
  h: number
}

export type SideInput = {
  left: boolean
  right: boolean
  down: boolean
  jumpJustPressed: boolean
  jumpJustReleased: boolean
}

export type SideEvent =
  | { type: 'land' }
  | { type: 'jump' }
  | { type: 'damage'; amount: number }
  | { type: 'die' }
  | { type: 'levelComplete' }
  | { type: 'coin'; value: number }
  | { type: 'bossHit' }
  | { type: 'bossDefeated' }

export type SidePhase = 'idle' | 'running' | 'paused' | 'gameover' | 'complete'

export interface SideWorld {
  bounds: { minX: number; maxX: number }
  groundY: number
  platforms: AABB[]
  hazards: AABB[]
  coins: { id: number; aabb: AABB; taken: boolean }[]
  spawn: Vec2
  exit: AABB
  enemies: SideEnemySpawn[]
  boss?: SideBossConfig
}

export interface SideBossConfig {
  x: number
  y: number
  w: number
  h: number
  maxHp: number
}

export type ProjectileKind = 'orb' | 'rain' | 'wave'

export interface SideProjectile {
  kind: ProjectileKind
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
  active: boolean
}

export interface SideBoss {
  active: boolean
  x: number
  y: number
  w: number
  h: number
  hp: number
  maxHp: number
  phase: number
  attackTimer: number
  pattern: number
  defeated: boolean
}

export interface SideEnemySpawn {
  id: number
  x: number
  y: number
  patrol: [number, number]
  speed: number
}

export interface SidePlayer {
  pos: Vec2
  vel: Vec2
  w: number
  h: number
  onGround: boolean
  facing: 1 | -1
  anim: 'idle' | 'run' | 'jump' | 'fall'
  frame: number
  coyoteTimer: number
  jumpBufferTimer: number
  hp: number
  invulnTimer: number
  score: number
  coins: number
}

export interface SideEnemy {
  id: number
  pos: Vec2
  vel: Vec2
  w: number
  h: number
  patrol: [number, number]
  speed: number
  alive: boolean
  frame: number
}

export type ParticleKind = 'glyph' | 'spark' | 'dust' | 'fire' | 'coin'

export interface SideParticle {
  kind: ParticleKind
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  active: boolean
}

export interface SideCombo {
  streak: number
  best: number
  multiplier: number
  fireUntil: number
  windowMs: number
}

export interface SideSimState {
  phase: SidePhase
  paused: boolean
  time: number
  world: SideWorld
  player: SidePlayer
  enemies: SideEnemy[]
  boss: SideBoss | null
  projectiles: SideProjectile[]
  camera: { x: number; y: number }
  trauma: number
  combo: SideCombo
  particles: SideParticle[]
  flashTimer: number
  flashGreen: boolean
  gameOverReason: 'hp' | 'fall' | null
}

export const BOSS = {
  strafeSpeed: 120,
  hoverAmp: 8,
  attackEvery: 2.4,
  orbSpeed: 300,
  rainSpeed: 160,
  waveSpeed: 420,
  projW: 10,
  projH: 10,
} as const

export const SIDE = {
  gravity: 2600,
  moveAccel: 2400,
  airAccel: 1600,
  friction: 2200,
  maxRun: 220,
  maxRunAir: 250,
  jumpVelocity: 720,
  jumpCut: 420,
  coyoteTime: 0.08,
  jumpBuffer: 0.12,
  maxFall: 900,
  hp: 3,
  invuln: 1,
  coinValue: 25,
  comboWindowMs: 4000,
  comboFireAt: 8,
  cameraLookAhead: 60,
  cameraY: 120,
} as const
