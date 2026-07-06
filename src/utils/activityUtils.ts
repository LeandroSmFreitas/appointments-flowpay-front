import type {
  ActivityType,
  DashboardActivityEventType,
  LiveActivity,
} from '../models/interface/dashboard'

interface RealtimeActivityEvent {
  id?: string
  type: DashboardActivityEventType
  title?: string
  description?: string
  timestamp?: string
}

export const activityTypeByBackendEvent: Record<
  DashboardActivityEventType,
  ActivityType
> = {
  ATTENDANCE_CREATED: 'CREATED',
  ATTENDANCE_ASSIGNED: 'ASSIGNED',
  ATTENDANCE_FINISHED: 'FINISHED',
  ATTENDANCE_CANCELLED: 'CANCELLED',
  AGENT_STATUS_CHANGED: 'AGENT_STATUS',
}

export const activityTitleByType: Record<ActivityType, string> = {
  CREATED: 'Atendimento criado',
  ASSIGNED: 'Atendimento atribuído',
  FINISHED: 'Atendimento finalizado',
  CANCELLED: 'Atendimento cancelado',
  AGENT_STATUS: 'Status de agente alterado',
}

export const activityDescriptionByType: Record<ActivityType, string> = {
  CREATED: 'Atendimento criado e colocado na fila',
  ASSIGNED: 'Atendimento atribuído a um colaborador',
  FINISHED: 'Atendimento finalizado por um colaborador',
  CANCELLED: 'Atendimento cancelado no fluxo operacional',
  AGENT_STATUS: 'Status de agente atualizado na operação',
}

export const normalizeRealtimeActivity = (
  event: RealtimeActivityEvent,
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

export const mergeRecentActivities = (
  currentActivities: LiveActivity[],
  nextActivity: LiveActivity,
  limit = 8,
): LiveActivity[] => {
  const withoutDuplicate = currentActivities.filter(
    (activity) => activity.id !== nextActivity.id,
  )

  return [nextActivity, ...withoutDuplicate].slice(0, limit)
}
