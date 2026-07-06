import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearCache,
  createCacheKey,
  getCachedData,
  invalidateCacheNamespace,
  setCachedData,
} from '../services/cacheStore'

describe('cacheStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-03T12:00:00.000Z'))
    clearCache()
  })

  afterEach(() => {
    clearCache()
    vi.useRealTimers()
  })

  it('returns cached data before the stale window expires', () => {
    setCachedData('dashboard-summary', { totalWaiting: 1 })

    expect(getCachedData('dashboard-summary')).toEqual({ totalWaiting: 1 })
  })

  it('expires stale data', () => {
    setCachedData('dashboard-summary', { totalWaiting: 1 })
    vi.advanceTimersByTime(16000)

    expect(getCachedData('dashboard-summary')).toBeNull()
  })

  it('ignores cache when force is true', () => {
    setCachedData('dashboard-summary', { totalWaiting: 1 })

    expect(getCachedData('dashboard-summary', { force: true })).toBeNull()
  })

  it('builds stable query cache keys', () => {
    expect(
      createCacheKey('attendances', {
        sort: 'createdAt,desc',
        page: 0,
      }),
    ).toBe(
      createCacheKey('attendances', {
        page: 0,
        sort: 'createdAt,desc',
      }),
    )
  })

  it('invalidates a whole namespace', () => {
    const firstKey = createCacheKey('attendances', { page: 0 })
    const secondKey = createCacheKey('attendances', { page: 1 })
    const dashboardKey = createCacheKey('dashboard-summary')

    setCachedData(firstKey, { page: 0 })
    setCachedData(secondKey, { page: 1 })
    setCachedData(dashboardKey, { totalWaiting: 2 })

    invalidateCacheNamespace('attendances')

    expect(getCachedData(firstKey)).toBeNull()
    expect(getCachedData(secondKey)).toBeNull()
    expect(getCachedData(dashboardKey)).toEqual({ totalWaiting: 2 })
  })
})
