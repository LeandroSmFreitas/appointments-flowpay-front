import { useEffect, useRef, useState } from 'react'
import {
  dashboardConnectionEventType,
  dashboardEventService,
  dashboardEventTypes,
  type DashboardEventType,
  type DashboardRealtimeEvent,
} from '../services/dashboardEventService'
import { createLogger } from '../utils/logger'

const pollingIntervalInMs = 5000
const logger = createLogger('dashboard-events')

export type RealtimeMode = 'connecting' | 'sse' | 'polling'

interface UseDashboardEventsParams {
  enabled?: boolean
  onEvent: (event?: DashboardRealtimeEvent) => Promise<void> | void
  relevantEvents?: readonly DashboardEventType[]
}

interface UseDashboardEventsResult {
  lastEventType: DashboardEventType | null
  realtimeError: string | null
  realtimeMode: RealtimeMode
}

export function useDashboardEvents({
  enabled = true,
  onEvent,
  relevantEvents = dashboardEventTypes,
}: UseDashboardEventsParams): UseDashboardEventsResult {
  const onEventRef = useRef(onEvent)
  const relevantEventsRef = useRef(relevantEvents)
  const [realtimeMode, setRealtimeMode] = useState<RealtimeMode>('connecting')
  const [realtimeError, setRealtimeError] = useState<string | null>(null)
  const [lastEventType, setLastEventType] = useState<DashboardEventType | null>(
    null,
  )

  useEffect(() => {
    onEventRef.current = onEvent
  }, [onEvent])

  useEffect(() => {
    relevantEventsRef.current = relevantEvents
  }, [relevantEvents])

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    let eventSource: EventSource | null = null
    let pollingIntervalId: number | null = null
    let isDisposed = false

    const isRelevantEvent = (event: DashboardRealtimeEvent): boolean =>
      relevantEventsRef.current.includes(event.type)

    const notifyEvent = (event?: DashboardRealtimeEvent): void => {
      if (event && !isRelevantEvent(event)) {
        return
      }

      if (event) {
        setLastEventType(event.type)
      }

      void onEventRef.current(event)
    }

    const stopPolling = (): void => {
      if (pollingIntervalId !== null) {
        window.clearInterval(pollingIntervalId)
        pollingIntervalId = null
      }
    }

    const startPollingFallback = (): void => {
      if (isDisposed || pollingIntervalId !== null) {
        return
      }

      setRealtimeMode('polling')
      setRealtimeError('Tempo real indisponível. Usando polling a cada 5 segundos.')
      logger.warn('SSE unavailable; polling fallback started')
      pollingIntervalId = window.setInterval(() => notifyEvent(), pollingIntervalInMs)
    }

    const closeEventSource = (): void => {
      if (eventSource) {
        eventSource.close()
        eventSource = null
      }
    }

    const markSseConnected = (): void => {
      if (isDisposed) {
        return
      }

      stopPolling()
      setRealtimeMode('sse')
      setRealtimeError(null)
    }

    const handleNamedEvent = (
      eventType: DashboardEventType,
      event: Event,
    ): void => {
      notifyEvent(
        dashboardEventService.parseNamedEvent(
          eventType,
          event as MessageEvent<string>,
        ),
      )
    }

    const handleMessageEvent = (event: MessageEvent<string>): void => {
      if (dashboardEventService.isConnectionMessageEvent(event)) {
        markSseConnected()

        return
      }

      const parsedEvent = dashboardEventService.parseMessageEvent(event)

      if (parsedEvent) {
        notifyEvent(parsedEvent)
      }
    }

    try {
      if (!dashboardEventService.isEventSourceSupported()) {
        startPollingFallback()

        return () => {
          isDisposed = true
          stopPolling()
        }
      }

      setRealtimeMode('connecting')
      setRealtimeError(null)
      eventSource = dashboardEventService.createEventSource()
      eventSource.onopen = markSseConnected
      eventSource.onerror = () => {
        if (isDisposed) {
          return
        }

        logger.warn('SSE connection error')
        closeEventSource()
        startPollingFallback()
      }

      eventSource.onmessage = handleMessageEvent
      eventSource.addEventListener(dashboardConnectionEventType, markSseConnected)
      dashboardEventTypes.forEach((eventType) => {
        eventSource?.addEventListener(eventType, (event) =>
          handleNamedEvent(eventType, event),
        )
      })
    } catch (caughtError) {
      logger.error('Failed to initialize dashboard events', {
        error:
          caughtError instanceof Error ? caughtError.message : String(caughtError),
      })
      closeEventSource()
      startPollingFallback()
    }

    return () => {
      isDisposed = true
      stopPolling()
      closeEventSource()
    }
  }, [enabled])

  return {
    lastEventType,
    realtimeError,
    realtimeMode,
  }
}
