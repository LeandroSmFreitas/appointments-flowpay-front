import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDashboardRealtime } from '../../../context/useDashboardRealtime'
import { TeamName } from '../../../models/enum/teamName'
import type {
  ActivityType,
  DashboardActivityEventType,
  DashboardActivityResponse,
  DashboardSummary,
  LiveActivity,
  QueueHistoryPoint,
  TeamSummary,
} from '../../../models/interface/dashboard'
import { dashboardService } from '../../../services/dashboardService'
import { formatShortTime } from '../../../utils/dateUtils'

const teamOrder = [TeamName.CARTOES, TeamName.EMPRESTIMOS, TeamName.OUTROS]

const emptyTeamSummary = (team: TeamName): TeamSummary => ({
  team,
  waiting: 0,
  inProgress: 0,
  finishedToday: 0,
  agentsOnline: 0,
  totalCapacity: 0,
  usedCapacity: 0,
  availableCapacity: 0,
})

const normalizeSummary = (summary: DashboardSummary): DashboardSummary => ({
  ...summary,
  teams: teamOrder.map(
    (team) =>
      summary.teams.find((item) => item.team === team) ?? emptyTeamSummary(team),
  ),
})

const activityTypeByBackendEvent: Record<DashboardActivityEventType, ActivityType> =
  {
    ATTENDANCE_CREATED: 'CREATED',
    ATTENDANCE_ASSIGNED: 'ASSIGNED',
    ATTENDANCE_FINISHED: 'FINISHED',
    ATTENDANCE_CANCELLED: 'CANCELLED',
    AGENT_STATUS_CHANGED: 'AGENT_STATUS',
  }

const activityTitleByType: Record<ActivityType, string> = {
  CREATED: 'Atendimento criado',
  ASSIGNED: 'Atendimento atribuido',
  FINISHED: 'Atendimento finalizado',
  CANCELLED: 'Atendimento cancelado',
  AGENT_STATUS: 'Status de agente alterado',
}

const activityDescriptionByType: Record<ActivityType, string> = {
  CREATED: 'Atendimento criado e colocado na fila',
  ASSIGNED: 'Atendimento atribuido a um colaborador',
  FINISHED: 'Atendimento finalizado por um colaborador',
  CANCELLED: 'Atendimento cancelado no fluxo operacional',
  AGENT_STATUS: 'Status de agente atualizado na operacao',
}

const isBackendEventType = (
  type: DashboardActivityResponse['type'],
): type is DashboardActivityEventType => type in activityTypeByBackendEvent

const normalizeActivityType = (
  type: DashboardActivityResponse['type'],
): ActivityType => (isBackendEventType(type) ? activityTypeByBackendEvent[type] : type)

const normalizeActivity = (
  activity: DashboardActivityResponse,
): LiveActivity => {
  const type = normalizeActivityType(activity.type)

  return {
    id: activity.id,
    type,
    title: activity.title ?? activityTitleByType[type],
    description: activity.description ?? activityDescriptionByType[type],
    timestamp: activity.timestamp ?? activity.createdAt ?? new Date().toISOString(),
  }
}

const buildCurrentHistoryPoint = (
  summary: DashboardSummary,
): QueueHistoryPoint => ({
  label: formatShortTime(new Date()),
  waiting: summary.totalWaiting,
  inProgress: summary.totalInProgress,
})

export function useDashboard() {
  const {
    activities,
    activitiesError,
    eventRevision,
    pollingRevision,
    realtimeError,
    setActivitiesError,
    setBackendActivities,
  } = useDashboardRealtime()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [queueHistory, setQueueHistory] = useState<QueueHistoryPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastHandledRevisionRef = useRef(0)

  const refreshActivities = useCallback(async () => {
    try {
      const result = await dashboardService.getRecentActivities()

      setBackendActivities(result.data.map(normalizeActivity))
      setActivitiesError(null)
    } catch (caughtError) {
      setActivitiesError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Nao foi possivel carregar as atividades recentes.',
      )
    }
  }, [setActivitiesError, setBackendActivities])

  const refresh = useCallback(
    async (options?: { syncActivities?: boolean }) => {
      try {
        const [summaryResult] = await Promise.all([
          dashboardService.getSummary(),
          options?.syncActivities ? refreshActivities() : Promise.resolve(),
        ])
        const normalizedSummary = normalizeSummary(summaryResult.data)

        setSummary(normalizedSummary)
        setError(null)
        setQueueHistory((currentHistory) =>
          currentHistory.length === 0
            ? [buildCurrentHistoryPoint(normalizedSummary)]
            : [
                ...currentHistory.slice(-7),
                buildCurrentHistoryPoint(normalizedSummary),
              ],
        )
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Nao foi possivel carregar o dashboard.',
        )
      } finally {
        setLoading(false)
      }
    },
    [refreshActivities],
  )

  useEffect(() => {
    void refresh({ syncActivities: true })
  }, [refresh])

  useEffect(() => {
    const currentRevision = eventRevision + pollingRevision

    if (
      currentRevision === 0 ||
      currentRevision === lastHandledRevisionRef.current
    ) {
      return
    }

    lastHandledRevisionRef.current = currentRevision
    void refresh({ syncActivities: false })
  }, [eventRevision, pollingRevision, refresh])

  const totals = useMemo(() => {
    const teams = summary?.teams ?? []

    return teams.reduce(
      (accumulator, team) => ({
        agentsOnline: accumulator.agentsOnline + team.agentsOnline,
        usedCapacity: accumulator.usedCapacity + team.usedCapacity,
        availableCapacity: accumulator.availableCapacity + team.availableCapacity,
        totalCapacity: accumulator.totalCapacity + team.totalCapacity,
      }),
      {
        agentsOnline: 0,
        usedCapacity: 0,
        availableCapacity: 0,
        totalCapacity: 0,
      },
    )
  }, [summary])

  return {
    activities,
    activitiesError,
    error: error ?? realtimeError,
    loading,
    queueHistory,
    refresh,
    summary,
    totals,
  }
}
