import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useDashboardEvents } from '../hooks/useDashboardEvents'
import type { LiveActivity } from '../models/interface/dashboard'
import type { DashboardRealtimeEvent } from '../services/dashboardEventService'
import {
  mergeRecentActivities,
  normalizeRealtimeActivity,
} from '../utils/activityUtils'
import { DashboardRealtimeContext } from './dashboardRealtimeContextValue'
import type { DashboardRealtimeContextValue } from './dashboardRealtimeContextValue'

interface DashboardRealtimeProviderProps {
  children: ReactNode
}

export function DashboardRealtimeProvider({
  children,
}: DashboardRealtimeProviderProps) {
  const [activities, setActivities] = useState<LiveActivity[]>([])
  const [lastEvent, setLastEvent] = useState<DashboardRealtimeEvent | null>(null)
  const [eventRevision, setEventRevision] = useState(0)
  const [pollingRevision, setPollingRevision] = useState(0)

  const handleRealtimeEvent = useCallback((event?: DashboardRealtimeEvent) => {
    if (!event) {
      setPollingRevision((currentRevision) => currentRevision + 1)

      return
    }

    setLastEvent(event)
    setEventRevision((currentRevision) => currentRevision + 1)
    setActivities((currentActivities) =>
      mergeRecentActivities(currentActivities, normalizeRealtimeActivity(event)),
    )
  }, [])

  const { realtimeError, realtimeMode } = useDashboardEvents({
    onEvent: handleRealtimeEvent,
  })

  const value = useMemo<DashboardRealtimeContextValue>(
    () => ({
      activities,
      eventRevision,
      lastEvent,
      lastEventType: lastEvent?.type ?? null,
      pollingRevision,
      realtimeError,
      realtimeMode,
    }),
    [
      activities,
      eventRevision,
      lastEvent,
      pollingRevision,
      realtimeError,
      realtimeMode,
    ],
  )

  return (
    <DashboardRealtimeContext.Provider value={value}>
      {children}
    </DashboardRealtimeContext.Provider>
  )
}
