import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDashboardRealtime } from '../../../context/useDashboardRealtime'
import { TeamName } from '../../../models/enum/teamName'
import type {
  DashboardSummary,
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
    eventRevision,
    pollingRevision,
    realtimeError,
  } = useDashboardRealtime()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [queueHistory, setQueueHistory] = useState<QueueHistoryPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastHandledRevisionRef = useRef(0)

  const refresh = useCallback(async (options?: { force?: boolean }) => {
    try {
      const summaryResult = await dashboardService.getSummary({
        force: options?.force,
      })
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
          : 'Não foi possível carregar o dashboard.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
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
    void refresh({ force: true })
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
    error: error ?? realtimeError,
    loading,
    queueHistory,
    refresh,
    summary,
    totals,
  }
}
