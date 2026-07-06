import { useCallback, useEffect, useState } from 'react'
import { useDashboardRealtime } from '../../../context/useDashboardRealtime'
import { AgentStatus } from '../../../models/enum/agentStatus'
import { TeamName } from '../../../models/enum/teamName'
import type { Agent, CreateAgentPayload } from '../../../models/interface/agent'
import { agentService, type AgentSortKey } from '../../../services/agentService'
import type { DashboardEventType } from '../../../services/dashboardEventService'
import {
  getNextSortState,
  pageSize,
  toApiSort,
  type SortState,
} from '../../../utils/tableUtils'

export type AgentStatusFilter = AgentStatus | 'ALL'
export type AgentTeamFilter = TeamName | 'ALL'

const agentSortKeys: readonly AgentSortKey[] = [
  'activeCount',
  'createdAt',
  'name',
  'status',
  'team',
]

const agentRealtimeEvents: readonly DashboardEventType[] = [
  'ATTENDANCE_ASSIGNED',
  'ATTENDANCE_FINISHED',
  'ATTENDANCE_CANCELLED',
  'AGENT_STATUS_CHANGED',
]

const isAgentSortKey = (key: string): key is AgentSortKey =>
  agentSortKeys.includes(key as AgentSortKey)

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [statusFilter, setStatusFilterState] =
    useState<AgentStatusFilter>('ALL')
  const [teamFilter, setTeamFilterState] = useState<AgentTeamFilter>('ALL')
  const [sort, setSort] = useState<SortState<AgentSortKey>>({
    key: 'name',
    direction: 'asc',
  })
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { eventRevision, lastEvent, pollingRevision } = useDashboardRealtime()

  const fetchAgents = useCallback(
    async (options?: { force?: boolean; silent?: boolean }) => {
      try {
        if (!options?.silent) {
          setLoading(true)
        }

        const result = await agentService.getAgents({
          page: page - 1,
          size: pageSize,
          sort: toApiSort(sort),
          force: options?.force,
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          team: teamFilter === 'ALL' ? undefined : teamFilter,
        })

        setAgents(result.data.content)
        setTotalItems(result.data.totalElements)
        setError(null)
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Não foi possível carregar os agentes.',
        )
      } finally {
        if (!options?.silent) {
          setLoading(false)
        }
      }
    },
    [page, sort, statusFilter, teamFilter],
  )

  const refreshAgentsFromEvents = useCallback(
    () => fetchAgents({ force: true, silent: true }),
    [fetchAgents],
  )

  useEffect(() => {
    void fetchAgents()
  }, [fetchAgents])

  useEffect(() => {
    if (eventRevision === 0 || !lastEvent) {
      return
    }

    if (agentRealtimeEvents.includes(lastEvent.type)) {
      void refreshAgentsFromEvents()
    }
  }, [eventRevision, lastEvent, refreshAgentsFromEvents])

  useEffect(() => {
    if (pollingRevision > 0) {
      void refreshAgentsFromEvents()
    }
  }, [pollingRevision, refreshAgentsFromEvents])

  const setStatusFilter = (nextStatusFilter: AgentStatusFilter): void => {
    setStatusFilterState(nextStatusFilter)
    setPage(1)
  }

  const setTeamFilter = (nextTeamFilter: AgentTeamFilter): void => {
    setTeamFilterState(nextTeamFilter)
    setPage(1)
  }

  const handleSort = (key: string): void => {
    if (!isAgentSortKey(key)) {
      return
    }

    setSort((currentSort) => getNextSortState(currentSort, key))
    setPage(1)
  }

  const createAgent = async (payload: CreateAgentPayload): Promise<void> => {
    try {
      setCreating(true)
      await agentService.createAgent(payload)
      setPage(1)
      if (page === 1) {
        await fetchAgents({ silent: true })
      }
      setError(null)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível criar o agente.',
      )
      throw caughtError
    } finally {
      setCreating(false)
    }
  }

  const changeAgentStatus = async (
    agentId: string,
    status: AgentStatus,
  ): Promise<void> => {
    try {
      setActionLoadingId(agentId)
      await agentService.updateAgentStatus(agentId, { status })
      await fetchAgents({ silent: true })
      setError(null)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível alterar o status do agente.',
      )
    } finally {
      setActionLoadingId(null)
    }
  }

  return {
    actionLoadingId,
    agents,
    changeAgentStatus,
    createAgent,
    creating,
    error,
    handleSort,
    loading,
    page,
    pageSize,
    refetch: fetchAgents,
    setPage,
    setStatusFilter,
    setTeamFilter,
    sort,
    statusFilter,
    teamFilter,
    totalItems,
    visibleAgents: agents,
  }
}
