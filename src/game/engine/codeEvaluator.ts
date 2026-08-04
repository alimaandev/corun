/**
 * Sandboxed code evaluation via a single long-lived worker.
 *
 * Replaces the worker-per-evaluation pattern: one worker is created lazily,
 * requests are queued, and a stuck worker (e.g. infinite loop in user code)
 * is terminated and recreated after a timeout. Fully injectable for tests.
 */

export interface EvalResult {
  success: boolean
  output: string
}

export interface EvalWorkerLike {
  postMessage(message: unknown): void
  terminate(): void
  onmessage: ((e: MessageEvent) => void) | null
  onerror: ((e: ErrorEvent) => void) | null
}

export type EvalWorkerFactory = () => EvalWorkerLike

interface PendingRequest {
  id: string
  resolve: (result: EvalResult) => void
  timer: ReturnType<typeof setTimeout>
}

const DEFAULT_TIMEOUT_MS = 2000
const MAX_TIMEOUTS_BEFORE_RECREATE = 3

function defaultWorkerFactory(): EvalWorkerLike {
  return new Worker(new URL('../sandbox.worker.ts', import.meta.url), { type: 'module' })
}

export class CodeEvaluator {
  private worker: EvalWorkerLike | null = null
  private pending = new Map<string, PendingRequest>()
  private timeoutsInARow = 0
  private factory: EvalWorkerFactory

  constructor(factory: EvalWorkerFactory = defaultWorkerFactory) {
    this.factory = factory
  }

  private ensureWorker(): EvalWorkerLike {
    if (this.worker) return this.worker
    const worker = this.factory()
    worker.onmessage = (e: MessageEvent<{ id: string; success: boolean; output: string }>) => {
      const req = this.pending.get(e.data.id)
      if (!req) return
      clearTimeout(req.timer)
      this.pending.delete(e.data.id)
      this.timeoutsInARow = 0
      req.resolve({ success: e.data.success, output: e.data.output })
    }
    worker.onerror = () => {
      this.rejectAll({ success: false, output: 'Worker error' })
    }
    this.worker = worker
    return worker
  }

  private rejectAll(result: EvalResult) {
    for (const [, req] of this.pending) {
      clearTimeout(req.timer)
      req.resolve(result)
    }
    this.pending.clear()
    this.dispose()
  }

  private dispose() {
    this.worker?.terminate()
    this.worker = null
  }

  evaluate(
    userCode: string,
    testCode: string,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  ): Promise<EvalResult> {
    return new Promise<EvalResult>((resolve) => {
      const id = crypto.randomUUID()
      const timer = setTimeout(() => {
        this.pending.delete(id)
        this.timeoutsInARow++
        if (this.timeoutsInARow >= MAX_TIMEOUTS_BEFORE_RECREATE) {
          this.rejectAll({ success: false, output: 'Execution timed out (2s limit)' })
          this.timeoutsInARow = 0
        } else {
          this.dispose()
        }
        resolve({ success: false, output: 'Execution timed out (2s limit)' })
      }, timeoutMs)

      this.pending.set(id, { id, resolve, timer })
      const worker = this.ensureWorker()
      worker.postMessage({ id, userCode, testCode })
    })
  }

  /** Terminate the worker and drop all pending requests. */
  reset() {
    this.rejectAll({ success: false, output: 'Evaluation reset' })
  }

  /** For tests: whether a worker currently exists. */
  get isActive(): boolean {
    return this.worker !== null
  }
}

export const codeEvaluator = new CodeEvaluator()

export function evaluateCode(
  userCode: string,
  testCode: string,
  timeoutMs?: number,
): Promise<EvalResult> {
  return codeEvaluator.evaluate(userCode, testCode, timeoutMs)
}
