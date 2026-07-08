import { Challenge } from './types'

const API_BASE = import.meta.env.VITE_API_URL || ''

const AI_POOL: Challenge[] = []
let aiFetching = false

export function clearAIPool() {
  AI_POOL.length = 0
  aiFetching = false
}

export function getChallengeById(id: number): Challenge | undefined {
  return AI_POOL.find(c => c.id === id)
}

export async function getRandomChallenge(usedIds: Set<number>, topic?: string, preferDifficulty?: string): Promise<Challenge> {
  const avail = AI_POOL.filter(c =>
    !usedIds.has(c.id) &&
    (!topic || c.topic === topic) &&
    (!preferDifficulty || c.difficulty === preferDifficulty)
  )
  if (avail.length > 0) {
    if (avail.length < 3) prefetchAIChallenge(topic, preferDifficulty, usedIds)
    return avail[Math.floor(Math.random() * avail.length)]
  }

  const c = await fetchAIChallenge(topic, preferDifficulty, usedIds)
  if (c) return c

  usedIds.clear()
  const retry = await fetchAIChallenge(topic, preferDifficulty)
  if (retry) return retry

  return FALLBACK_CHALLENGE
}

export async function prefetchAIChallenge(topic?: string, difficulty?: string, usedIds?: Set<number>) {
  if (aiFetching) return
  aiFetching = true
  try {
    const res = await fetch(`${API_BASE}/api/challenges/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty, usedIds: [...(usedIds || [])] }),
    })
    if (!res.ok) return
    const data = await res.json()
    if (data.challenge?.id && data.challenge?.question) {
      AI_POOL.push(data.challenge as Challenge)
    }
  } catch {
    // ignore
  } finally {
    aiFetching = false
  }
}

async function fetchAIChallenge(topic?: string, difficulty?: string, usedIds?: Set<number>): Promise<Challenge | null> {
  try {
    const res = await fetch(`${API_BASE}/api/challenges/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty, usedIds: [...(usedIds || [])] }),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data.challenge?.id && data.challenge?.question) {
      return data.challenge as Challenge
    }
  } catch {
    // ignore
  }
  return null
}

const FALLBACK_CHALLENGE: Challenge = {
  id: 0, type: 'multiple', difficulty: 'medium', topic: 'general',
  question: 'What is the output of typeof null in JavaScript?',
  options: ['"null"', '"object"', '"undefined"', '"boolean"'],
  correct: 1,
  explanation: 'typeof null returns "object" — a classic JS quirk.',
}

export const TOPICS = [
  { id: 'general', label: 'General CS', description: 'Computer science fundamentals' },
  { id: 'javascript', label: 'JavaScript', description: 'JS, Node.js & frontend' },
  { id: 'python', label: 'Python', description: 'Python programming' },
  { id: 'web', label: 'Web Dev', description: 'HTML, CSS & HTTP' },
  { id: 'databases', label: 'Databases', description: 'SQL & data storage' },
  { id: 'algorithms', label: 'Algorithms', description: 'Data structures & complexity' },
] as const

export function getDailyChallenge(): Challenge {
  return { ...FALLBACK_CHALLENGE, id: -1 }
}

export function isDailyCompleted(): boolean {
  const today = new Date().toISOString().slice(0, 10)
  try {
    return localStorage.getItem('code_daily_' + today) === 'done'
  } catch { return false }
}

export function markDailyCompleted() {
  const today = new Date().toISOString().slice(0, 10)
  try { localStorage.setItem('code_daily_' + today, 'done') } catch {}
}

const LB_KEY = 'code_leaderboard'
export function getLeaderboard(): { score: number; date: string }[] {
  try {
    return JSON.parse(localStorage.getItem(LB_KEY) || '[]')
  } catch { return [] }
}

export function addToLeaderboard(score: number) {
  const lb = getLeaderboard()
  lb.push({ score, date: new Date().toISOString().slice(0, 10) })
  lb.sort((a, b) => b.score - a.score)
  const top = lb.slice(0, 10)
  try { localStorage.setItem(LB_KEY, JSON.stringify(top)) } catch {}
}
