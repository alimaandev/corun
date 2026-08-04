import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db, resetDatabase } from './db'
import {
  enqueue,
  flushOutbox,
  purgeDelivered,
  outboxStats,
  registerOutboxHandler,
  unregisterOutboxHandler,
  MAX_OUTBOX_ATTEMPTS,
  OUTBOX_BASE_BACKOFF_MS,
} from './outbox'

const TEST_TYPE = 'test'

beforeEach(async () => {
  await resetDatabase()
})

afterEach(() => {
  unregisterOutboxHandler(TEST_TYPE)
})

async function setDue(id: number) {
  await db.outbox.update(id, { next_attempt_at: 0 })
}

describe('flushOutbox', () => {
  it('delivers pending entries and marks them delivered', async () => {
    registerOutboxHandler(TEST_TYPE, async () => {})
    const id = await enqueue(TEST_TYPE, { n: 1 })

    const result = await flushOutbox()

    expect(result).toEqual({ flushed: 1, pending: 0 })
    const row = await db.outbox.get(id)
    expect(row!.status).toBe('delivered')
  })

  it('leaves entries pending when no handler is registered', async () => {
    await enqueue(TEST_TYPE, { n: 1 })

    const result = await flushOutbox()

    expect(result).toEqual({ flushed: 0, pending: 1 })
    expect(await outboxStats()).toEqual({ pending: 1, delivered: 0, failed: 0 })
  })

  it('retries failed entries with exponential backoff and delivers on success', async () => {
    let failuresLeft = 2
    registerOutboxHandler(TEST_TYPE, async () => {
      if (failuresLeft > 0) {
        failuresLeft--
        throw new Error('boom')
      }
    })
    const id = await enqueue(TEST_TYPE, { n: 1 })

    await flushOutbox()
    let row = await db.outbox.get(id)
    expect(row!.status).toBe('failed')
    expect(row!.attempts).toBe(1)
    expect(row!.next_attempt_at).toBeGreaterThan(Date.now() + OUTBOX_BASE_BACKOFF_MS)

    // Not due yet — skipped, attempts unchanged
    await flushOutbox()
    row = await db.outbox.get(id)
    expect(row!.attempts).toBe(1)

    await setDue(id)
    await flushOutbox()
    row = await db.outbox.get(id)
    expect(row!.attempts).toBe(2)

    await setDue(id)
    await flushOutbox()
    row = await db.outbox.get(id)
    expect(row!.attempts).toBe(2)
    expect(row!.status).toBe('delivered')
    expect(await outboxStats()).toEqual({ pending: 0, delivered: 1, failed: 0 })
  })

  it('gives up after MAX_OUTBOX_ATTEMPTS failures', async () => {
    registerOutboxHandler(TEST_TYPE, async () => {
      throw new Error('always fails')
    })
    const id = await enqueue(TEST_TYPE, { n: 1 })

    for (let i = 0; i < MAX_OUTBOX_ATTEMPTS + 2; i++) {
      await setDue(id)
      await flushOutbox()
    }

    const row = await db.outbox.get(id)
    expect(row!.status).toBe('failed')
    expect(row!.attempts).toBe(MAX_OUTBOX_ATTEMPTS)
    expect(await outboxStats()).toEqual({ pending: 0, delivered: 0, failed: 1 })
  })
})

describe('purgeDelivered', () => {
  it('removes delivered entries', async () => {
    registerOutboxHandler(TEST_TYPE, async () => {})
    await enqueue(TEST_TYPE, { n: 1 })
    await enqueue(TEST_TYPE, { n: 2 })
    await flushOutbox()

    expect(await purgeDelivered()).toBe(2)
    expect(await db.outbox.toArray()).toHaveLength(0)
  })
})
