import { Challenge } from './types'

const POOL: Challenge[] = []

const FALLBACKS: Challenge[] = [
  { id: -1, type: 'multiple', difficulty: 'medium', topic: 'general',
    question: 'What is the output of typeof null in JavaScript?',
    options: ['"null"', '"object"', '"undefined"', '"boolean"'],
    correct: 1, explanation: 'typeof null returns "object" — a classic JS quirk.' },

  { id: -2, type: 'multiple', difficulty: 'easy', topic: 'javascript',
    question: 'Which method adds an element to the end of an array?',
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    correct: 0, explanation: 'push() adds one or more elements to the end of an array.' },

  { id: -3, type: 'multiple', difficulty: 'easy', topic: 'python',
    question: 'What keyword is used to define a function in Python?',
    options: ['func', 'define', 'def', 'function'],
    correct: 2, explanation: 'Functions in Python are defined using the def keyword.' },

  { id: -4, type: 'multiple', difficulty: 'medium', topic: 'web',
    question: 'Which HTML tag is used to link a JavaScript file?',
    options: ['<js>', '<link>', '<script>', '<style>'],
    correct: 2, explanation: 'The <script> tag is used to embed or reference JavaScript in HTML.' },

  { id: -5, type: 'multiple', difficulty: 'medium', topic: 'databases',
    question: 'Which SQL clause filters rows based on a condition?',
    options: ['WHERE', 'HAVING', 'FILTER', 'MATCH'],
    correct: 0, explanation: 'WHERE is used to filter records in SQL queries.' },

  { id: -6, type: 'multiple', difficulty: 'hard', topic: 'algorithms',
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(n log n)'],
    correct: 1, explanation: 'Binary search divides the search space in half each step, giving O(log n) complexity.' },

  { id: -7, type: 'multiple', difficulty: 'easy', topic: 'general',
    question: 'What does CPU stand for?',
    options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'],
    correct: 0, explanation: 'CPU stands for Central Processing Unit.' },

  { id: -8, type: 'multiple', difficulty: 'hard', topic: 'javascript',
    question: 'What will "2" + 2 evaluate to in JavaScript?',
    options: ['4', '"22"', '22', 'Error'], correct: 1,
    explanation: 'When adding a string and a number, JS coerces the number to a string, resulting in "22".' },

  { id: -9, type: 'multiple', difficulty: 'easy', topic: 'python',
    question: 'Which of these is a valid Python list?',
    options: ['[1, 2, 3]', '{1, 2, 3}', '(1, 2, 3)', '<1, 2, 3>'],
    correct: 0, explanation: 'Lists in Python use square brackets.' },

  { id: -10, type: 'multiple', difficulty: 'medium', topic: 'web',
    question: 'What does CSS selector ".class" target?',
    options: ['An ID', 'A class', 'A tag', 'An attribute'],
    correct: 1, explanation: 'The dot prefix targets elements by their class attribute.' },

  { id: -11, type: 'multiple', difficulty: 'hard', topic: 'algorithms',
    question: 'Which data structure operates on LIFO principle?',
    options: ['Queue', 'Stack', 'Tree', 'Graph'],
    correct: 1, explanation: 'A Stack follows Last-In-First-Out (LIFO) ordering.' },

  { id: -12, type: 'multiple', difficulty: 'medium', topic: 'databases',
    question: 'Which SQL keyword is used to sort results?',
    options: ['SORT BY', 'ORDER BY', 'GROUP BY', 'ARRANGE'], correct: 1,
    explanation: 'ORDER BY sorts query results in ascending or descending order.' },

  { id: -13, type: 'multiple', difficulty: 'easy', topic: 'general',
    question: 'What is a bit?',
    options: ['A byte', 'A binary digit', 'A nibble', 'A word'],
    correct: 1, explanation: 'A bit (binary digit) is the smallest unit of data in computing.' },

  { id: -14, type: 'multiple', difficulty: 'hard', topic: 'javascript',
    question: 'What does the "===" operator check?',
    options: ['Value only', 'Type only', 'Value and type', 'Reference'],
    correct: 2, explanation: '=== checks both value AND type equality without type coercion.' },

  { id: -15, type: 'multiple', difficulty: 'easy', topic: 'python',
    question: 'What function reads user input in Python?',
    options: ['read()', 'scan()', 'input()', 'get()'], correct: 2,
    explanation: 'The input() function reads a line from user input in Python.' },

  { id: -16, type: 'multiple', difficulty: 'medium', topic: 'web',
    question: 'What protocol does HTTPS use for security?',
    options: ['SSL/TLS', 'FTP', 'SMTP', 'HTTP/2'], correct: 0,
    explanation: 'HTTPS uses SSL/TLS encryption to secure data in transit.' },

  { id: -17, type: 'multiple', difficulty: 'hard', topic: 'general',
    question: 'What is the time complexity of accessing an array element by index?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct: 0,
    explanation: 'Array access by index is O(1) — constant time.' },
]

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

export function clearAIPool() {
  POOL.length = 0
}

export function getChallengeById(id: number): Challenge | undefined {
  return POOL.find(c => c.id === id) || FALLBACKS.find(c => c.id === id)
}

export async function getRandomChallenge(usedIds: Set<number>, topic?: string, preferDifficulty?: string): Promise<Challenge> {
  const candidates = FALLBACKS.filter(c =>
    !usedIds.has(c.id) &&
    (!topic || c.topic === topic) &&
    (!preferDifficulty || c.difficulty === preferDifficulty)
  )

  if (candidates.length > 0) return pick(candidates)

  const anyTopic = FALLBACKS.filter(c =>
    !usedIds.has(c.id) &&
    (!preferDifficulty || c.difficulty === preferDifficulty)
  )
  if (anyTopic.length > 0) return pick(anyTopic)

  const any = FALLBACKS.filter(c => !usedIds.has(c.id))
  if (any.length > 0) return pick(any)

  usedIds.clear()
  return pick(FALLBACKS)
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
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const idx = dayOfYear % FALLBACKS.length
  return { ...FALLBACKS[idx], id: -1 }
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
