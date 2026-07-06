import { act, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DashboardRealtimeProvider } from '../context/DashboardRealtimeContext'
import { useDashboardRealtime } from '../context/useDashboardRealtime'

type Listener = EventListenerOrEventListenerObject

class FakeEventSource {
  static instances: FakeEventSource[] = []

  listeners = new Map<string, Listener[]>()
  onerror: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent<string>) => void) | null = null
  onopen: ((event: Event) => void) | null = null
  url: string

  constructor(url: string) {
    this.url = url
    FakeEventSource.instances.push(this)
  }

  addEventListener(type: string, listener: Listener): void {
    const listeners = this.listeners.get(type) ?? []
    this.listeners.set(type, [...listeners, listener])
  }

  close(): void {
    return undefined
  }

  emitNamed(type: string, data: string): void {
    const event = new MessageEvent(type, { data })

    this.listeners.get(type)?.forEach((listener) => {
      if (typeof listener === 'function') {
        listener(event)
        return
      }

      listener.handleEvent(event)
    })
  }
}

function RealtimeConsumer() {
  const { activities, lastEventType } = useDashboardRealtime()

  return (
    <div>
      <span>{lastEventType}</span>
      {activities.map((activity) => (
        <article key={activity.id}>
          <h2>{activity.title}</h2>
          <p>{activity.description}</p>
        </article>
      ))}
    </div>
  )
}

describe('DashboardRealtimeProvider', () => {
  afterEach(() => {
    FakeEventSource.instances = []
    vi.unstubAllGlobals()
  })

  it('stores SSE events as recent activities', async () => {
    vi.stubGlobal('EventSource', FakeEventSource)

    render(
      <DashboardRealtimeProvider>
        <RealtimeConsumer />
      </DashboardRealtimeProvider>,
    )

    await waitFor(() => expect(FakeEventSource.instances).toHaveLength(1))

    act(() => {
      FakeEventSource.instances[0].emitNamed(
        'ATTENDANCE_CREATED',
        JSON.stringify({
          id: 'event-1',
          type: 'ATTENDANCE_CREATED',
          timestamp: '2026-07-03T20:07:24.957875Z',
        }),
      )
    })

    expect(screen.getByText('ATTENDANCE_CREATED')).toBeInTheDocument()
    expect(screen.getByText('Atendimento criado')).toBeInTheDocument()
    expect(
      screen.getByText('Atendimento criado e colocado na fila'),
    ).toBeInTheDocument()
  })
})
