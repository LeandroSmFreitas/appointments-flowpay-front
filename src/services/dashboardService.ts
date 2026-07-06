import { api } from './api'
import { apiContracts, validateApiResponse } from './apiContracts'
import { createCacheKey, getCachedData, setCachedData } from './cacheStore'
import type { ServiceReadOptions, ServiceResult } from './serviceTypes'
import type { DashboardSummary } from '../models/interface/dashboard'

export const dashboardService = {
  async getSummary(
    options?: ServiceReadOptions,
  ): Promise<ServiceResult<DashboardSummary>> {
    const cacheKey = createCacheKey('dashboard-summary')
    const cached = getCachedData<DashboardSummary>(cacheKey, options)

    if (cached) {
      return { data: cached }
    }

    const response = await api.get<unknown>('/api/v1/dashboard/summary')
    const data = validateApiResponse(
      response.data,
      apiContracts.dashboardSummary,
      'resumo do dashboard',
    )

    setCachedData(cacheKey, data)

    return { data }
  },
}
