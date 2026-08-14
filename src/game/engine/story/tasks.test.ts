import { describe, it, expect } from 'vitest'
import { runTaskInJs, STORY_TASKS } from './tasks'
import { STORY_NODES } from './levels'

describe('story tasks', () => {
  it('has exactly the right number of tasks per node', () => {
    for (const node of STORY_NODES) {
      expect(STORY_TASKS[node.id]?.length, node.id).toBe(node.questions)
    }
  })

  it('every solution passes its hidden tests', () => {
    for (const node of STORY_NODES) {
      for (const t of STORY_TASKS[node.id]) {
        const result = runTaskInJs(t.solution, t.test)
        expect(result.success, `${t.id}: ${result.output}`).toBe(true)
      }
    }
  })

  it('every template fails without a solution', () => {
    for (const node of STORY_NODES) {
      for (const t of STORY_TASKS[node.id]) {
        const result = runTaskInJs(t.template, t.test)
        expect(result.success, t.id).toBe(false)
      }
    }
  })

  it('solutions do not compile into the templates shown to players', () => {
    for (const node of STORY_NODES) {
      for (const t of STORY_TASKS[node.id]) {
        expect(t.template).not.toContain(t.solution.trim().split('\n')[1])
      }
    }
  })

  it('tasks are uniquely identified', () => {
    const ids = Object.values(STORY_TASKS)
      .flat()
      .map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
