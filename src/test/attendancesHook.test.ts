import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AttendanceStatus } from '../models/enum/attendanceStatus'
import { TeamName } from '../models/enum/teamName'
import { attendanceService } from '../services/attendanceService'
import { useAttendances } from '../pages/Attendances/hooks/attendancesHook'

vi.mock('../context/useDashboardRealtime', () => ({
  useDashboardRealtime: () => ({
    eventRevision: 0,
    lastEvent: null,
    pollingRevision: 0,
  }),
}))

vi.mock('../services/attendanceService', () => ({
  attendanceService: {
    cancelAttendance: vi.fn(),
    createAttendance: vi.fn(),
    finishAttendance: vi.fn(),
    getAttendances: vi.fn(),
  },
}))

const attendance = {
  id: 'attendance-1',
  customerName: 'Bruno',
  subject: 'Problemas com cartao',
  team: TeamName.CARTOES,
  status: AttendanceStatus.WAITING,
  createdAt: '2026-07-03T20:07:24.957875Z',
  updatedAt: '2026-07-03T20:07:24.957875Z',
}

const emptyPage = {
  content: [],
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 1,
}

describe('useAttendances', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads attendances with remote pagination params', async () => {
    vi.mocked(attendanceService.getAttendances).mockResolvedValue({
      data: {
        content: [attendance],
        page: 0,
        size: 8,
        totalElements: 1,
        totalPages: 1,
      },
    })

    const { result } = renderHook(() => useAttendances())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(attendanceService.getAttendances).toHaveBeenCalledWith({
      page: 0,
      size: 8,
      sort: 'createdAt,desc',
      status: undefined,
      team: undefined,
    })
    expect(result.current.visibleAttendances).toEqual([attendance])
    expect(result.current.totalItems).toBe(1)
  })

  it('refetches from page one when filters change', async () => {
    vi.mocked(attendanceService.getAttendances).mockResolvedValue({
      data: emptyPage,
    })

    const { result } = renderHook(() => useAttendances())

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.setStatusFilter(AttendanceStatus.WAITING)
    })

    await waitFor(() =>
      expect(attendanceService.getAttendances).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 0,
          status: AttendanceStatus.WAITING,
        }),
      ),
    )
  })

  it('creates an attendance and refreshes the current remote page', async () => {
    vi.mocked(attendanceService.getAttendances).mockResolvedValue({
      data: emptyPage,
    })
    vi.mocked(attendanceService.createAttendance).mockResolvedValue({
      data: attendance,
    })

    const { result } = renderHook(() => useAttendances())

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.createAttendance({
        customerName: 'Bruno',
        subject: 'Problemas com cartao',
      })
    })

    expect(attendanceService.createAttendance).toHaveBeenCalledWith({
      customerName: 'Bruno',
      subject: 'Problemas com cartao',
    })
    expect(attendanceService.getAttendances).toHaveBeenCalledTimes(2)
  })
})
