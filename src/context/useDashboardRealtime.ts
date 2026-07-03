import { useContext } from 'react'
import { DashboardRealtimeContext } from './dashboardRealtimeContextValue'
import type { DashboardRealtimeContextValue } from './dashboardRealtimeContextValue'

export const useDashboardRealtime = (): DashboardRealtimeContextValue => {
  const context = useContext(DashboardRealtimeContext)

  if (!context) {
    throw new Error(
      'useDashboardRealtime deve ser usado dentro de DashboardRealtimeProvider.',
    )
  }

  return context
}
