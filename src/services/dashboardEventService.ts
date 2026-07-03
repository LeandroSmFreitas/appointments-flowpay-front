import { apiBaseUrl } from './api'

export const dashboardEventTypes = [
  'ATTENDANCE_CREATED',
  'ATTENDANCE_ASSIGNED',
  'ATTENDANCE_FINISHED',
  'ATTENDANCE_CANCELLED',
  'AGENT_STATUS_CHANGED',
] as const

export const dashboardConnectionEventType = 'CONNECTED'

export type DashboardEventType = (typeof dashboardEventTypes)[number]
export type DashboardConnectionEventType = typeof dashboardConnectionEventType

interface DashboardEventPayload {
  id?: unknown
  activityId?: unknown
  eventId?: unknown
  type?: unknown
  event?: unknown
  eventType?: unknown
  title?: unknown
  description?: unknown
  message?: unknown
  createdAt?: unknown
  timestamp?: unknown
  occurredAt?: unknown
}

export interface DashboardRealtimeEvent {
  id?: string
  type: DashboardEventType
  title?: string
  description?: string
  timestamp?: string
  payload?: Record<string, unknown>
}

const dashboardEventTypeSet = new Set<string>(dashboardEventTypes)

const isDashboardEventType = (value: unknown): value is DashboardEventType =>
  typeof value === 'string' && dashboardEventTypeSet.has(value)

const isDashboardConnectionEventType = (
  value: unknown,
): value is DashboardConnectionEventType => value === dashboardConnectionEventType

const parseJsonPayload = (data: string): DashboardEventPayload | null => {
  try {
    const parsedPayload: unknown = JSON.parse(data)

    if (parsedPayload && typeof parsedPayload === 'object') {
      return parsedPayload as DashboardEventPayload
    }

    return null
  } catch {
    return null
  }
}

const getPayloadType = (payload: DashboardEventPayload): unknown =>
  payload.type ?? payload.eventType ?? payload.event

const getStringValue = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined

const getDashboardEventsUrl = (): string =>
  new URL('/api/v1/dashboard/events', apiBaseUrl).toString()

const parsePayloadEvent = (
  payload: DashboardEventPayload,
  namedEventType?: DashboardEventType,
): DashboardRealtimeEvent | null => {
  const payloadType = getPayloadType(payload) ?? namedEventType

  if (!isDashboardEventType(payloadType)) {
    return null
  }

  return {
    id: getStringValue(payload.id) ??
      getStringValue(payload.activityId) ??
      getStringValue(payload.eventId),
    type: payloadType,
    title: getStringValue(payload.title),
    description:
      getStringValue(payload.description) ?? getStringValue(payload.message),
    timestamp:
      getStringValue(payload.timestamp) ??
      getStringValue(payload.createdAt) ??
      getStringValue(payload.occurredAt),
    payload: payload as Record<string, unknown>,
  }
}

export const dashboardEventService = {
  createEventSource(): EventSource {
    return new EventSource(getDashboardEventsUrl())
  },

  isEventSourceSupported(): boolean {
    return typeof EventSource !== 'undefined'
  },

  isConnectionMessageEvent(event: MessageEvent<string>): boolean {
    if (isDashboardConnectionEventType(event.data)) {
      return true
    }

    const payload = parseJsonPayload(event.data)

    return payload ? isDashboardConnectionEventType(getPayloadType(payload)) : false
  },

  parseMessageEvent(event: MessageEvent<string>): DashboardRealtimeEvent | null {
    if (isDashboardEventType(event.data)) {
      return { type: event.data }
    }

    const payload = parseJsonPayload(event.data)

    return payload ? parsePayloadEvent(payload) : null
  },

  parseNamedEvent(
    eventType: DashboardEventType,
    event: MessageEvent<string>,
  ): DashboardRealtimeEvent {
    const payload = parseJsonPayload(event.data)

    return payload
      ? (parsePayloadEvent(payload, eventType) ?? { type: eventType })
      : { type: eventType }
  },
}
