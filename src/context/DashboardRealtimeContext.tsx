import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useDashboardEvents } from '../hooks/useDashboardEvents'
import type { DashboardRealtimeEvent } from '../services/dashboardEventService'
import type {
  ActivityType,
  DashboardActivityEventType,
  LiveActivity,
} from '../models/interface/dashboard'
import { DashboardRealtimeContext } from './dashboardRealtimeContextValue'
import type { DashboardRealtimeContextValue } from './dashboardRealtimeContextValue'

const activityTypeByBackendEvent: Record<DashboardActivityEventType, ActivityType> =
  {
    ATTENDANCE_CREATED: 'CREATED',
    ATTENDANCE_ASSIGNED: 'ASSIGNED',
    ATTENDANCE_FINISHED: 'FINISHED',
    ATTENDANCE_CANCELLED: 'CANCELLED',
    AGENT_STATUS_CHANGED: 'AGENT_STATUS',
  }

const activityTitleByType: Record<ActivityType, string> = {
  CREATED: 'Atendimento criado',
  ASSIGNED: 'Atendimento atribuído',
  FINISHED: 'Atendimento finalizado',
  CANCELLED: 'Atendimento cancelado',
  AGENT_STATUS: 'Status de agente alterado',
}

const activityDescriptionByType: Record<ActivityType, string> = {
  CREATED: 'Atendimento criado e colocado na fila',
  ASSIGNED: 'Atendimento atribuido a um colaborador',
  FINISHED: 'Atendimento finalizado por um colaborador',
  CANCELLED: 'Atendimento cancelado no fluxo operacional',
  AGENT_STATUS: 'Status de agente atualizado na operacao',
}

const normalizeRealtimeActivity = (
  event: DashboardRealtimeEvent,
): LiveActivity => {
  const type = activityTypeByBackendEvent[event.type]
  const timestamp = event.timestamp ?? new Date().toISOString()

  return {
    id: event.id ?? `${event.type}-${timestamp}`,
    type,
    title: event.title ?? activityTitleByType[type],
    description: event.description ?? activityDescriptionByType[type],
    timestamp,
  }
}

const mergeRealtimeActivity = (
  currentActivities: LiveActivity[],
  nextActivity: LiveActivity,
): LiveActivity[] => {
  const withoutDuplicate = currentActivities.filter(
    (activity) => activity.id !== nextActivity.id,
  )

  return [nextActivity, ...withoutDuplicate].slice(0, 8)
}

interface DashboardRealtimeProviderProps {
  children: ReactNode
}

export function DashboardRealtimeProvider({
  children,
}: DashboardRealtimeProviderProps) {
  const [activities, setActivities] = useState<LiveActivity[]>([])
  const [activitiesError, setActivitiesError] = useState<string | null>(null)
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
      mergeRealtimeActivity(currentActivities, normalizeRealtimeActivity(event)),
    )
    setActivitiesError(null)
  }, [])

  const { realtimeError, realtimeMode } = useDashboardEvents({
    onEvent: handleRealtimeEvent,
  })

  const setBackendActivities = useCallback((nextActivities: LiveActivity[]) => {
    if (nextActivities.length === 0) {
      return
    }

    setActivities(nextActivities.slice(0, 8))
  }, [])

  const value = useMemo<DashboardRealtimeContextValue>(
    () => ({
      activities,
      activitiesError,
      eventRevision,
      lastEvent,
      lastEventType: lastEvent?.type ?? null,
      pollingRevision,
      realtimeError,
      realtimeMode,
      setActivitiesError,
      setBackendActivities,
    }),
    [
      activities,
      activitiesError,
      eventRevision,
      lastEvent,
      pollingRevision,
      realtimeError,
      realtimeMode,
      setBackendActivities,
    ],
  )

  return (
    <DashboardRealtimeContext.Provider value={value}>
      {children}
    </DashboardRealtimeContext.Provider>
  )
}
