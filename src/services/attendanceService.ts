import { api } from './api'
import type { ServiceResult } from './serviceTypes'
import type {
  Attendance,
  CreateAttendancePayload,
} from '../models/interface/attendance'

export const attendanceService = {
  async getAttendances(): Promise<ServiceResult<Attendance[]>> {
    const response = await api.get<Attendance[]>('/api/v1/attendances')

    return { data: response.data }
  },

  async createAttendance(
    payload: CreateAttendancePayload,
  ): Promise<ServiceResult<Attendance>> {
    const response = await api.post<Attendance>('/api/v1/attendances', payload)

    return { data: response.data }
  },

  async finishAttendance(id: string): Promise<ServiceResult<Attendance>> {
    const response = await api.patch<Attendance>(
      `/api/v1/attendances/${id}/finish`,
    )

    return { data: response.data }
  },

  async cancelAttendance(id: string): Promise<ServiceResult<Attendance>> {
    const response = await api.patch<Attendance>(
      `/api/v1/attendances/${id}/cancel`,
    )

    return { data: response.data }
  },
}
