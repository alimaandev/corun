import { describe, it, expect } from 'vitest'
import { canTransition, transitionPhase } from './stateMachine'

describe('transitionPhase', () => {
  it('follows the happy path', () => {
    let phase = transitionPhase('idle', { type: 'start' })
    expect(phase).toBe('countdown')
    phase = transitionPhase(phase, { type: 'begin' })
    expect(phase).toBe('running')
    phase = transitionPhase(phase, { type: 'pause' })
    expect(phase).toBe('paused')
    phase = transitionPhase(phase, { type: 'resume' })
    expect(phase).toBe('running')
    phase = transitionPhase(phase, { type: 'fail' })
    expect(phase).toBe('gameover')
    phase = transitionPhase(phase, { type: 'restart' })
    expect(phase).toBe('idle')
  })

  it('ignores invalid transitions', () => {
    expect(transitionPhase('idle', { type: 'fail' })).toBe('idle')
    expect(transitionPhase('idle', { type: 'pause' })).toBe('idle')
    expect(transitionPhase('gameover', { type: 'resume' })).toBe('gameover')
  })

  it('canTransition reflects legality', () => {
    expect(canTransition('running', { type: 'fail' })).toBe(true)
    expect(canTransition('running', { type: 'restart' })).toBe(false)
  })
})
