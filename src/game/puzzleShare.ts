import { CodePuzzle } from './types'

const STORAGE_KEY = 'corun_custom_puzzles'

export function encodePuzzle(puzzle: CodePuzzle): string {
  const data = {
    t: puzzle.title,
    d: puzzle.description,
    c: puzzle.template,
    s: puzzle.test,
    h: puzzle.hint,
    m: puzzle.successMessage,
    l: puzzle.levelId,
  }
  const json = JSON.stringify(data)
  return btoa(encodeURIComponent(json))
}

export function decodePuzzle(encoded: string): Omit<CodePuzzle, 'id'> | null {
  try {
    const json = decodeURIComponent(atob(encoded))
    const data = JSON.parse(json)
    return {
      title: data.t,
      description: data.d,
      template: data.c,
      test: data.s,
      hint: data.h,
      successMessage: data.m,
      levelId: data.l || 1,
    }
  } catch {
    return null
  }
}

export function saveCustomPuzzle(puzzle: CodePuzzle): void {
  try {
    const saved = getCustomPuzzles()
    saved[puzzle.id] = puzzle
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch {}
}

export function getCustomPuzzles(): Record<string, CodePuzzle> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function deleteCustomPuzzle(id: string): void {
  try {
    const saved = getCustomPuzzles()
    delete saved[id]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch {}
}

export function importPuzzleFromUrl(): Omit<CodePuzzle, 'id'> | null {
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('puzzle')
  if (!encoded) return null
  return decodePuzzle(encoded)
}

export function generatePuzzleId(): string {
  return 'custom_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function shareUrl(puzzle: CodePuzzle): string {
  const encoded = encodePuzzle(puzzle)
  const url = new URL(window.location.href.split('?')[0])
  url.searchParams.set('puzzle', encoded)
  return url.toString()
}
