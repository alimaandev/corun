import { db, StoryProgressEntry, StoryProgressRow } from '../../../lib/db'
import { STORY_NODES, StoryLevelNode } from './levels'

export const STORY_ROW_ID = 'main'

export interface StoryProgress {
  unlockedUpTo: number
  completed: Record<string, StoryProgressEntry>
}

export function emptyProgress(): StoryProgress {
  return { unlockedUpTo: 0, completed: {} }
}

function toRow(p: StoryProgress, now: string): StoryProgressRow {
  return {
    id: STORY_ROW_ID,
    unlocked_up_to: p.unlockedUpTo,
    completed: p.completed,
    updated_at: now,
  }
}

function fromRow(row: StoryProgressRow | undefined): StoryProgress {
  if (!row) return emptyProgress()
  return { unlockedUpTo: row.unlocked_up_to, completed: row.completed }
}

export async function getStoryProgress(): Promise<StoryProgress> {
  const row = await db.storyProgress.get(STORY_ROW_ID)
  return fromRow(row)
}

export async function saveStoryProgress(p: StoryProgress): Promise<void> {
  await db.storyProgress.put(toRow(p, new Date().toISOString()))
}

export function isStoryLevelUnlocked(node: StoryLevelNode, p: StoryProgress): boolean {
  return node.index <= p.unlockedUpTo
}

export async function completeStoryLevel(
  node: StoryLevelNode,
  stars: number,
  score: number,
): Promise<StoryProgress> {
  const p = await getStoryProgress()
  const prev = p.completed[node.id]
  const entry: StoryProgressEntry = {
    stars: Math.max(prev?.stars ?? 0, stars),
    best_score: Math.max(prev?.best_score ?? 0, score),
    completed_at: new Date().toISOString(),
  }
  const next = {
    ...p,
    completed: { ...p.completed, [node.id]: entry },
    unlockedUpTo: Math.max(
      p.unlockedUpTo,
      node.boss ? p.unlockedUpTo : Math.min(STORY_NODES.length - 1, node.index + 1),
    ),
  }
  await saveStoryProgress(next)
  return next
}

export function starsForNode(node: StoryLevelNode, p: StoryProgress): number {
  return p.completed[node.id]?.stars ?? 0
}

export function storyStarsTotal(p: StoryProgress): number {
  return Object.values(p.completed).reduce((sum, e) => sum + e.stars, 0)
}

export function storyNodeBestScore(node: StoryLevelNode, p: StoryProgress): number {
  return p.completed[node.id]?.best_score ?? 0
}
