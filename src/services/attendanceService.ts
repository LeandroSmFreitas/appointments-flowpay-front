import { api } from './api'
import {
  apiContracts,
  normalizeApiPageResponse,
  validateApiResponse,
} from './apiContracts'
import {
  createCacheKey,
  getCachedData,
  invalidateCacheNamespace,
  setCachedData,
} from './cacheStore'
import type { PageQuery, PageResponse, ServiceResult } from './serviceTypes'
import { strictPaginatedResponses } from '../config/api'
import type {
  Attendance,
  CreateAttendancePayload,
} from '../models/interface/attendance'
import { createPageResponse } from '../utils/paginationUtils'

export type AttendanceSortKey =
  | 'assignedAgentName'
  | 'createdAt'
  | 'customerName'
  | 'status'
  | 'team'

export type AttendancePageQuery = PageQuery<AttendanceSortKey>

const invalidateAttendanceSideEffects = (): void => {
  invalidateCacheNamespace('attendances', 'dashboard-summary')
}

const getAttendanceCacheParams = (query: AttendancePageQuery) => ({
  page: query.page,
  size: query.size,
  sort: query.sort,
  status: query.status,
  team: query.team,
})

const compareAttendanceValue = (
  firstAttendance: Attendance,
  secondAttendance: Attendance,
  sortKey: AttendanceSortKey,
): number => {
  const firstValue = firstAttendance[sortKey]
  const secondValue = secondAttendance[sortKey]

  return String(firstValue ?? '').localeCompare(String(secondValue ?? ''), 'pt-BR', {
    numeric: true,
    sensitivity: 'base',
  })
}

const applyLegacyAttendanceQuery = (
  attendances: Attendance[],
  query: AttendancePageQuery,
): Attendance[] => {
  const [sortKey, sortDirection] = query.sort.split(',') as [
    AttendanceSortKey,
    'asc' | 'desc',
  ]

  return attendances
    .filter((attendance) => !query.status || attendance.status === query.status)
    .filter((attendance) => !query.team || attendance.team === query.team)
    .sort((firstAttendance, secondAttendance) => {
      const comparison = compareAttendanceValue(
        firstAttendance,
        secondAttendance,
        sortKey,
      )

      return sortDirection === 'asc' ? comparison : -comparison
    })
}

const normalizeAttendancesPage = (
  responseData: unknown,
  query: AttendancePageQuery,
): PageResponse<Attendance> => {
  const page = normalizeApiPageResponse(
    responseData,
    apiContracts.attendance,
    'pagina de atendimentos',
  )

  if (page) {
    return page
  }

  if (strictPaginatedResponses) {
    return validateApiResponse(
      responseData,
      apiContracts.attendancesPage,
      'pagina de atendimentos',
    )
  }

  const attendances = validateApiResponse(
    responseData,
    apiContracts.attendances,
    'lista de atendimentos',
  )

  return createPageResponse(
    applyLegacyAttendanceQuery(attendances, query),
    query.page,
    query.size,
  )
}

export const attendanceService = {
  async getAttendances(
    query: AttendancePageQuery,
  ): Promise<ServiceResult<PageResponse<Attendance>>> {
    const cacheKey = createCacheKey('attendances', getAttendanceCacheParams(query))
    const cached = getCachedData<PageResponse<Attendance>>(cacheKey, query)

    if (cached) {
      return { data: cached }
    }

    const response = await api.get<unknown>('/api/v1/attendances', {
      params: {
        page: query.page,
        size: query.size,
        sort: query.sort,
        status: query.status,
        team: query.team,
      },
    })
    const data = normalizeAttendancesPage(response.data, query)

    setCachedData(cacheKey, data)

    return { data }
  },

  async createAttendance(
    payload: CreateAttendancePayload,
  ): Promise<ServiceResult<Attendance>> {
    const response = await api.post<unknown>('/api/v1/attendances', payload)
    const data = validateApiResponse(
      response.data,
      apiContracts.attendance,
      'atendimento criado',
    )

    invalidateAttendanceSideEffects()

    return { data }
  },

  async finishAttendance(id: string): Promise<ServiceResult<Attendance>> {
    const response = await api.patch<unknown>(
      `/api/v1/attendances/${id}/finish`,
    )
    const data = validateApiResponse(
      response.data,
      apiContracts.attendance,
      'atendimento finalizado',
    )

    invalidateAttendanceSideEffects()

    return { data }
  },

  async cancelAttendance(id: string): Promise<ServiceResult<Attendance>> {
    const response = await api.patch<unknown>(
      `/api/v1/attendances/${id}/cancel`,
    )
    const data = validateApiResponse(
      response.data,
      apiContracts.attendance,
      'atendimento cancelado',
    )

    invalidateAttendanceSideEffects()

    return { data }
  },
}
