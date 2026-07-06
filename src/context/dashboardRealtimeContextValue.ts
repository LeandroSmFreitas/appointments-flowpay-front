import { createContext } from 'react'
import type { RealtimeMode } from '../hooks/useDashboardEvents'
import type { DashboardRealtimeEvent } from '../services/dashboardEventService'
import type { LiveActivity } from '../models/interface/dashboard'

export interface DashboardRealtimeContextValue {
  activities: LiveActivity[]
  eventRevision: number
  lastEvent: DashboardRealtimeEvent | null
  lastEventType: DashboardRealtimeEvent['type'] | null
  pollingRevision: number
  realtimeError: string | null
  realtimeMode: RealtimeMode
}

export const DashboardRealtimeContext =
  createContext<DashboardRealtimeContextValue | null>(null)
