import { api } from './api'
import type { ServiceResult } from './serviceTypes'
import type {
  DashboardActivityResponse,
  DashboardSummary,
} from '../models/interface/dashboard'

export const dashboardService = {
  async getSummary(): Promise<ServiceResult<DashboardSummary>> {
    const response = await api.get<DashboardSummary>('/api/v1/dashboard/summary')

    return { data: response.data }
  },

  async getRecentActivities(): Promise<ServiceResult<DashboardActivityResponse[]>> {
    const response = await api.get<DashboardActivityResponse[]>(
      '/api/v1/dashboard/activities',
    )

    return { data: response.data }
  },
}
