import { useCallback, useEffect, useState } from 'react'
import { useDashboardRealtime } from '../../../context/useDashboardRealtime'
import { AttendanceStatus } from '../../../models/enum/attendanceStatus'
import { TeamName } from '../../../models/enum/teamName'
import type {
  Attendance,
  CreateAttendancePayload,
} from '../../../models/interface/attendance'
import {
  attendanceService,
  type AttendanceSortKey,
} from '../../../services/attendanceService'
import type { DashboardEventType } from '../../../services/dashboardEventService'
import {
  getNextSortState,
  pageSize,
  toApiSort,
  type SortState,
} from '../../../utils/tableUtils'

export type AttendanceStatusFilter = AttendanceStatus | 'ALL'
export type AttendanceTeamFilter = TeamName | 'ALL'

const attendanceSortKeys: readonly AttendanceSortKey[] = [
  'assignedAgentName',
  'createdAt',
  'customerName',
  'status',
  'team',
]

const attendanceRealtimeEvents: readonly DashboardEventType[] = [
  'ATTENDANCE_CREATED',
  'ATTENDANCE_ASSIGNED',
  'ATTENDANCE_FINISHED',
  'ATTENDANCE_CANCELLED',
]

const isAttendanceSortKey = (key: string): key is AttendanceSortKey =>
  attendanceSortKeys.includes(key as AttendanceSortKey)

export function useAttendances() {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [statusFilter, setStatusFilterState] =
    useState<AttendanceStatusFilter>('ALL')
  const [teamFilter, setTeamFilterState] = useState<AttendanceTeamFilter>('ALL')
  const [sort, setSort] = useState<SortState<AttendanceSortKey>>({
    key: 'createdAt',
    direction: 'desc',
  })
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { eventRevision, lastEvent, pollingRevision } = useDashboardRealtime()

  const fetchAttendances = useCallback(
    async (options?: { force?: boolean; silent?: boolean }) => {
      try {
        if (!options?.silent) {
          setLoading(true)
        }

        const result = await attendanceService.getAttendances({
          page: page - 1,
          size: pageSize,
          sort: toApiSort(sort),
          force: options?.force,
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          team: teamFilter === 'ALL' ? undefined : teamFilter,
        })

        setAttendances(result.data.content)
        setTotalItems(result.data.totalElements)
        setError(null)
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Não foi possível carregar os atendimentos.',
        )
      } finally {
        if (!options?.silent) {
          setLoading(false)
        }
      }
    },
    [page, sort, statusFilter, teamFilter],
  )

  const refreshAttendancesFromEvents = useCallback(
    () => fetchAttendances({ force: true, silent: true }),
    [fetchAttendances],
  )

  useEffect(() => {
    void fetchAttendances()
  }, [fetchAttendances])

  useEffect(() => {
    if (eventRevision === 0 || !lastEvent) {
      return
    }

    if (attendanceRealtimeEvents.includes(lastEvent.type)) {
      void refreshAttendancesFromEvents()
    }
  }, [eventRevision, lastEvent, refreshAttendancesFromEvents])

  useEffect(() => {
    if (pollingRevision > 0) {
      void refreshAttendancesFromEvents()
    }
  }, [pollingRevision, refreshAttendancesFromEvents])

  const setStatusFilter = (nextStatusFilter: AttendanceStatusFilter): void => {
    setStatusFilterState(nextStatusFilter)
    setPage(1)
  }

  const setTeamFilter = (nextTeamFilter: AttendanceTeamFilter): void => {
    setTeamFilterState(nextTeamFilter)
    setPage(1)
  }

  const handleSort = (key: string): void => {
    if (!isAttendanceSortKey(key)) {
      return
    }

    setSort((currentSort) => getNextSortState(currentSort, key))
    setPage(1)
  }

  const createAttendance = async (
    payload: CreateAttendancePayload,
  ): Promise<void> => {
    try {
      setCreating(true)
      await attendanceService.createAttendance(payload)
      setPage(1)
      if (page === 1) {
        await fetchAttendances({ silent: true })
      }
      setError(null)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível criar o atendimento.',
      )
      throw caughtError
    } finally {
      setCreating(false)
    }
  }

  const finishAttendance = async (id: string): Promise<void> => {
    try {
      setActionLoadingId(id)
      await attendanceService.finishAttendance(id)
      await fetchAttendances({ silent: true })
      setError(null)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível finalizar o atendimento.',
      )
    } finally {
      setActionLoadingId(null)
    }
  }

  const cancelAttendance = async (id: string): Promise<void> => {
    try {
      setActionLoadingId(id)
      await attendanceService.cancelAttendance(id)
      await fetchAttendances({ silent: true })
      setError(null)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível cancelar o atendimento.',
      )
    } finally {
      setActionLoadingId(null)
    }
  }

  const canFinishAttendance = (attendance: Attendance): boolean =>
    attendance.status === AttendanceStatus.IN_PROGRESS

  const canCancelAttendance = (attendance: Attendance): boolean =>
    attendance.status === AttendanceStatus.WAITING ||
    attendance.status === AttendanceStatus.IN_PROGRESS

  return {
    actionLoadingId,
    canCancelAttendance,
    canFinishAttendance,
    cancelAttendance,
    createAttendance,
    creating,
    error,
    filteredAttendances: attendances,
    finishAttendance,
    handleSort,
    loading,
    page,
    pageSize,
    refetch: fetchAttendances,
    setPage,
    setStatusFilter,
    setTeamFilter,
    sort,
    statusFilter,
    teamFilter,
    totalItems,
    visibleAttendances: attendances,
  }
}
