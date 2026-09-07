import { describe, it, expect, vi } from 'vitest'
import { CodeEvaluator, EvalWorkerLike } from './codeEvaluator'

function createFakeWorker(respond: (msg: { id: string }) => void): EvalWorkerLike & {
  posted: unknown[]
  terminated: number
} {
  return {
    posted: [],
    terminated: 0,
    onmessage: null,
    onerror: null,
    postMessage(message: unknown) {
      this.posted.push(message)
      respond(message as { id: string })
    },
    terminate() {
      this.terminated++
    },
  }
}

describe('CodeEvaluator', () => {
  it('creates a single worker for multiple evaluations', async () => {
    const workers: (EvalWorkerLike & { posted: unknown[]; terminated: number })[] = []
    const evaluator = new CodeEvaluator(() => {
      const w = createFakeWorker((msg) => {
        setTimeout(() => {
          if (w.onmessage) {
            ;(w.onmessage as (e: MessageEvent) => void)(
              new MessageEvent('message', { data: { id: msg.id, success: true, output: 'ok' } }),
            )
          }
        }, 0)
      })
      workers.push(w)
      return w
    })

    const results = await Promise.all([
      evaluator.evaluate('a', 't'),
      evaluator.evaluate('b', 't'),
      evaluator.evaluate('c', 't'),
    ])

    expect(workers.length).toBe(1)
    expect(results).toEqual([
      { success: true, output: 'ok' },
      { success: true, output: 'ok' },
      { success: true, output: 'ok' },
    ])
  })

  it('resolves failure results from the worker', async () => {
    let created: (EvalWorkerLike & { posted: unknown[]; terminated: number }) | null = null
    const evaluator = new CodeEvaluator(() => {
      created = createFakeWorker((msg) => {
        setTimeout(() => {
          created?.onmessage?.(
            new MessageEvent('message', { data: { id: msg.id, success: false, output: 'boom' } }),
          )
        }, 0)
      })
      return created
    })
    const r = await evaluator.evaluate('a', 't')
    expect(r).toEqual({ success: false, output: 'boom' })
  })

  it('times out a stuck request and recreates the worker', async () => {
    let created = 0
    const workers: (EvalWorkerLike & { terminated: number })[] = []
    const evaluator = new CodeEvaluator(() => {
      created++
      const w = createFakeWorker(() => {
        // never respond
      })
      workers.push(w)
      return w
    })

    const r = await evaluator.evaluate('a', 't', 30)
    expect(r.success).toBe(false)
    expect(created).toBe(1)

    // second request re-creates the worker after timeout
    const r2 = await evaluator.evaluate('b', 't', 30)
    expect(r2.success).toBe(false)
    expect(created).toBe(2)
  })

  it('rejects all pending requests on worker error', async () => {
    const evaluator = new CodeEvaluator(() => {
      const w = createFakeWorker(() => {
        // fire error instead of responding
        setTimeout(() => {
          w.onerror?.(new ErrorEvent('error'))
        }, 0)
      })
      return w
    })

    const r = await evaluator.evaluate('a', 't')
    expect(r).toEqual({ success: false, output: 'Worker error' })
    expect(evaluator.isActive).toBe(false)
  })

  it('ignores stale messages after timeout', async () => {
    const evaluator = new CodeEvaluator(() => {
      const w = createFakeWorker(() => {
        // respond very late
        setTimeout(() => {
          w.onmessage?.(
            new MessageEvent('message', { data: { id: 'stale', success: true, output: 'late' } }),
          )
        }, 100)
      })
      return w
    })

    const r = await evaluator.evaluate('a', 't', 20)
    expect(r.success).toBe(false)
  })

  it('reset rejects pending and disposes the worker', async () => {
    const evaluator = new CodeEvaluator(() => createFakeWorker(() => {}))
    const promise = evaluator.evaluate('a', 't', 1000)
    evaluator.reset()
    const r = await promise
    expect(r).toEqual({ success: false, output: 'Evaluation reset' })
    expect(evaluator.isActive).toBe(false)
    expect(vi).toBeDefined()
  })
})
