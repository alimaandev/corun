/**
 * Runtime validation for puzzle payloads — especially user-generated content
 * (community puzzles, URL imports) that must not be trusted at face value.
 * Hand-rolled validators keep the engine dependency-free.
 */

import { CodePuzzle } from '../types'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

const MAX_FIELD_LENGTH = 5000

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function validField(value: unknown, label: string, errors: string[]): boolean {
  if (!isNonEmptyString(value)) {
    errors.push(`${label} must be a non-empty string`)
    return false
  }
  if (value.length > MAX_FIELD_LENGTH) {
    errors.push(`${label} exceeds ${MAX_FIELD_LENGTH} characters`)
    return false
  }
  return true
}

export function validateCodePuzzle(input: unknown): ValidationResult {
  const errors: string[] = []
  if (input === null || typeof input !== 'object') {
    return { valid: false, errors: ['Puzzle must be an object'] }
  }
  const p = input as Record<string, unknown>

  if (typeof p.levelId !== 'number' || !Number.isInteger(p.levelId) || p.levelId < 0) {
    errors.push('levelId must be a non-negative integer')
  }
  validField(p.title, 'title', errors)
  validField(p.description, 'description', errors)
  validField(p.template, 'template', errors)
  validField(p.test, 'test', errors)
  if (isNonEmptyString(p.hint) && p.hint.length > MAX_FIELD_LENGTH) {
    errors.push('hint exceeds 5000 characters')
  }
  if (isNonEmptyString(p.successMessage) && p.successMessage.length > MAX_FIELD_LENGTH) {
    errors.push('successMessage exceeds 5000 characters')
  }

  return { valid: errors.length === 0, errors }
}

/** Coerce a validated object into a CodePuzzle (must pass validation first). */
export function toCodePuzzle(input: unknown): CodePuzzle | null {
  const result = validateCodePuzzle(input)
  if (!result.valid) return null
  const p = input as Record<string, unknown>
  return {
    id: typeof p.id === 'string' && p.id ? p.id : crypto.randomUUID(),
    levelId: p.levelId as number,
    title: (p.title as string).trim(),
    description: (p.description as string).trim(),
    template: (p.template as string).trim(),
    test: (p.test as string).trim(),
    hint: typeof p.hint === 'string' ? p.hint.trim() : '',
    successMessage: typeof p.successMessage === 'string' ? p.successMessage.trim() : 'Solved!',
  }
}
