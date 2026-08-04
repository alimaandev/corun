/**
 * Mode-agnostic game lifecycle state machine.
 * All game modes (endless, speedrun, survival, boss, bonus, daily, story)
 * share the same phase flow; per-mode logic reacts to the phase.
 */

export type GamePhase = 'idle' | 'countdown' | 'running' | 'paused' | 'gameover'

export type PhaseAction =
  | { type: 'start' }
  | { type: 'begin' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'fail' }
  | { type: 'restart' }

const TRANSITIONS: Record<GamePhase, Partial<Record<PhaseAction['type'], GamePhase>>> = {
  idle: { start: 'countdown' },
  countdown: { begin: 'running', start: 'countdown', fail: 'gameover' },
  running: { pause: 'paused', begin: 'running', fail: 'gameover' },
  paused: { resume: 'running', fail: 'gameover' },
  gameover: { restart: 'idle' },
}

export function transitionPhase(phase: GamePhase, action: PhaseAction): GamePhase {
  return TRANSITIONS[phase][action.type] ?? phase
}

export function canTransition(phase: GamePhase, action: PhaseAction): boolean {
  return TRANSITIONS[phase][action.type] !== undefined
}
