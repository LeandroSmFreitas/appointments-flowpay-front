import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDashboardRealtime } from '../../../context/useDashboardRealtime'
import { AttendanceStatus } from '../../../models/enum/attendanceStatus'
import { TeamName } from '../../../models/enum/teamName'
import type {
  Attendance,
  CreateAttendancePayload,
} from '../../../models/interface/attendance'
import { attendanceService } from '../../../services/attendanceService'
import type { DashboardEventType } from '../../../services/dashboardEventService'

export type AttendanceStatusFilter = AttendanceStatus | 'ALL'
export type AttendanceTeamFilter = TeamName | 'ALL'

const replaceAttendance = (
  attendances: Attendance[],
  nextAttendance: Attendance,
): Attendance[] =>
  attendances.map((attendance) =>
    attendance.id === nextAttendance.id ? nextAttendance : attendance,
  )

const attendanceRealtimeEvents: readonly DashboardEventType[] = [
  'ATTENDANCE_CREATED',
  'ATTENDANCE_ASSIGNED',
  'ATTENDANCE_FINISHED',
  'ATTENDANCE_CANCELLED',
]

export function useAttendances() {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [statusFilter, setStatusFilter] =
    useState<AttendanceStatusFilter>('ALL')
  const [teamFilter, setTeamFilter] = useState<AttendanceTeamFilter>('ALL')
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { eventRevision, lastEvent, pollingRevision } = useDashboardRealtime()

  const fetchAttendances = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        setLoading(true)
      }

      const result = await attendanceService.getAttendances()

      setAttendances(result.data)
      setError(null)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Nao foi possivel carregar os atendimentos.',
      )
    } finally {
      if (!options?.silent) {
        setLoading(false)
      }
    }
  }, [])

  const refreshAttendancesFromEvents = useCallback(
    () => fetchAttendances({ silent: true }),
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

  const filteredAttendances = useMemo(
    () =>
      attendances.filter((attendance) => {
        const matchesStatus =
          statusFilter === 'ALL' || attendance.status === statusFilter
        const matchesTeam = teamFilter === 'ALL' || attendance.team === teamFilter

        return matchesStatus && matchesTeam
      }),
    [attendances, statusFilter, teamFilter],
  )

  const createAttendance = async (
    payload: CreateAttendancePayload,
  ): Promise<void> => {
    try {
      setCreating(true)
      const result = await attendanceService.createAttendance(payload)

      setAttendances((currentAttendances) => [
        result.data,
        ...currentAttendances,
      ])
      setError(null)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Nao foi possivel criar o atendimento.',
      )
      throw caughtError
    } finally {
      setCreating(false)
    }
  }

  const finishAttendance = async (id: string): Promise<void> => {
    try {
      setActionLoadingId(id)
      const result = await attendanceService.finishAttendance(id)

      setAttendances((currentAttendances) =>
        replaceAttendance(currentAttendances, result.data),
      )
      setError(null)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Nao foi possivel finalizar o atendimento.',
      )
    } finally {
      setActionLoadingId(null)
    }
  }

  const cancelAttendance = async (id: string): Promise<void> => {
    try {
      setActionLoadingId(id)
      const result = await attendanceService.cancelAttendance(id)

      setAttendances((currentAttendances) =>
        replaceAttendance(currentAttendances, result.data),
      )
      setError(null)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Nao foi possivel cancelar o atendimento.',
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
    filteredAttendances,
    finishAttendance,
    loading,
    refetch: fetchAttendances,
    setStatusFilter,
    setTeamFilter,
    statusFilter,
    teamFilter,
  }
}
