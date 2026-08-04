import { db, OutboxRow, OutboxStatus } from './db'

export const MAX_OUTBOX_ATTEMPTS = 5
export const OUTBOX_BASE_BACKOFF_MS = 5000

type OutboxHandler = (payload: unknown) => Promise<void>

const handlers = new Map<string, OutboxHandler>()

export function registerOutboxHandler(type: string, handler: OutboxHandler): void {
  handlers.set(type, handler)
}

export function unregisterOutboxHandler(type: string): void {
  handlers.delete(type)
}

export async function enqueue(type: string, payload: unknown): Promise<number> {
  return db.outbox.add({
    type,
    payload,
    status: 'pending',
    attempts: 0,
    next_attempt_at: 0,
    created_at: new Date().toISOString(),
  })
}

function isDue(entry: OutboxRow, now: number): boolean {
  if (entry.status === 'pending') return true
  if (entry.status === 'failed') {
    return entry.attempts < MAX_OUTBOX_ATTEMPTS && entry.next_attempt_at <= now
  }
  return false
}

function backoffFor(attempts: number): number {
  return OUTBOX_BASE_BACKOFF_MS * 2 ** Math.max(0, attempts - 1)
}

export async function flushOutbox(): Promise<{ flushed: number; pending: number }> {
  const now = Date.now()
  const entries = await db.outbox.where('status').anyOf('pending', 'failed').toArray()
  let flushed = 0
  let pending = 0

  for (const entry of entries) {
    if (!isDue(entry, now)) {
      if (entry.status === 'pending' || entry.status === 'failed') pending++
      continue
    }
    const handler = handlers.get(entry.type)
    if (!handler) {
      pending++
      continue
    }
    try {
      await handler(entry.payload)
      await db.outbox.update(entry.id!, { status: 'delivered' })
      flushed++
    } catch {
      const attempts = entry.attempts + 1
      await db.outbox.update(entry.id!, {
        attempts,
        status: 'failed',
        next_attempt_at: Date.now() + backoffFor(attempts + 1),
      })
      pending++
    }
  }

  return { flushed, pending }
}

export async function purgeDelivered(olderThanMs = 0): Promise<number> {
  const cutoff = olderThanMs > 0 ? Date.now() - olderThanMs : 0
  const delivered = await db.outbox.where('status').equals('delivered').toArray()
  let removed = 0
  for (const entry of delivered) {
    if (cutoff === 0 || new Date(entry.created_at).getTime() <= cutoff) {
      await db.outbox.delete(entry.id!)
      removed++
    }
  }
  return removed
}

export async function outboxStats(): Promise<Record<OutboxStatus, number>> {
  const stats: Record<OutboxStatus, number> = { pending: 0, delivered: 0, failed: 0 }
  const rows = await db.outbox.toArray()
  for (const row of rows) stats[row.status]++
  return stats
}
