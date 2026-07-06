import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  mergeRecentActivities,
  normalizeRealtimeActivity,
} from '../utils/activityUtils'

describe('activityUtils', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('uses event-specific descriptions for realtime events', () => {
    const activity = normalizeRealtimeActivity({
      type: 'ATTENDANCE_ASSIGNED',
      timestamp: '2026-07-03T12:00:00.000Z',
    })

    expect(activity).toMatchObject({
      type: 'ASSIGNED',
      title: 'Atendimento atribuído',
      description: 'Atendimento atribuído a um colaborador',
    })
  })

  it('deduplicates recent activities by id and keeps the newest first', () => {
    const activities = mergeRecentActivities(
      [
        {
          id: 'same-id',
          type: 'CREATED',
          title: 'Old',
          description: 'Old',
          timestamp: '2026-07-03T12:00:00.000Z',
        },
      ],
      {
        id: 'same-id',
        type: 'FINISHED',
        title: 'New',
        description: 'New',
        timestamp: '2026-07-03T12:01:00.000Z',
      },
    )

    expect(activities).toHaveLength(1)
    expect(activities[0].title).toBe('New')
  })
})
