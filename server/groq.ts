const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_API_KEY = () => process.env.GROQ_API_KEY || ''

const SYSTEM_PROMPT = `You are a coding challenge generator for a game called "Code Run". Generate a single coding challenge question.

RULES:
- Return ONLY valid JSON. No markdown, no code fences, no explanation text outside the JSON.
- The answer must be objectively correct and unambiguous.
- Assign a unique ID between 10000 and 99999.

JSON FORMAT:
{
  "id": number (10000-99999),
  "topic": string (one of: general, javascript, python, web, databases, algorithms),
  "difficulty": string (easy, medium, hard),
  "type": string (multiple, fill-blank, output, spot-bug),
  "question": string,
  "options": [string, string, string, string],
  "correct": number (0-3),
  "explanation": string,
  "code": string | null
}

TYPE RULES:
- "multiple": 4 options, pick the correct one
- "fill-blank": provide code with a blank ___ and 4 fill options
- "output": provide a short code snippet, ask what it outputs
- "spot-bug": provide buggy code, ask to spot the bug

TOPIC RULES:
- javascript: modern JS, ES6+, Node.js concepts
- python: Python 3, common libraries, idioms
- web: HTML, CSS, HTTP, browser APIs
- databases: SQL queries, indexes, normalization
- algorithms: data structures, complexity, sorting, searching
- general: CS fundamentals, git, networking, OS`

interface GenerateParams {
  topic?: string
  difficulty?: string
  usedIds?: number[]
}

interface GroqChoice {
  message: { content: string }
}

interface GroqResponse {
  choices: GroqChoice[]
}

export async function generateChallenge({ topic, difficulty, usedIds }: GenerateParams): Promise<Record<string, unknown> | null> {
  const apiKey = GROQ_API_KEY()
  if (!apiKey) {
    console.warn('[groq] GROQ_API_KEY not set — skipping AI generation')
    return null
  }

  const userPrompt = buildPrompt(topic, difficulty, usedIds)

  try {
    const res = await fetch(GROQ_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    if (!res.ok) {
      console.warn('[groq] API error:', res.status, await res.text())
      return null
    }

    const data: GroqResponse = await res.json()
    const raw = data.choices?.[0]?.message?.content
    if (!raw) return null

    return parseJson(raw)
  } catch (err) {
    console.warn('[groq] fetch failed:', err)
    return null
  }
}

function buildPrompt(topic?: string, difficulty?: string, usedIds?: number[]): string {
  let prompt = `Generate a ${difficulty || 'medium'} challenge about ${topic || 'general programming'}.`
  if (usedIds && usedIds.length > 0) {
    prompt += `\nPreviously used IDs (do NOT reuse): ${usedIds.join(', ')}`
  }
  return prompt
}

function parseJson(raw: string): Record<string, unknown> | null {
  const cleaned = raw.replace(/```(?:json)?\s*/gi, '').replace(/\s*```/g, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      try { return JSON.parse(match[0]) } catch {}
    }
    return null
  }
}
