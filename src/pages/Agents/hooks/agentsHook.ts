import { useCallback, useEffect, useState } from 'react'
import { useDashboardRealtime } from '../../../context/useDashboardRealtime'
import { AgentStatus } from '../../../models/enum/agentStatus'
import type { Agent, CreateAgentPayload } from '../../../models/interface/agent'
import { agentService } from '../../../services/agentService'
import type { DashboardEventType } from '../../../services/dashboardEventService'

const replaceAgent = (agents: Agent[], nextAgent: Agent): Agent[] =>
  agents.map((agent) => (agent.id === nextAgent.id ? nextAgent : agent))

const agentRealtimeEvents: readonly DashboardEventType[] = [
  'ATTENDANCE_ASSIGNED',
  'ATTENDANCE_FINISHED',
  'ATTENDANCE_CANCELLED',
  'AGENT_STATUS_CHANGED',
]

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { eventRevision, lastEvent, pollingRevision } = useDashboardRealtime()

  const fetchAgents = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        setLoading(true)
      }

      const result = await agentService.getAgents()

      setAgents(result.data)
      setError(null)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Nao foi possivel carregar os agentes.',
      )
    } finally {
      if (!options?.silent) {
        setLoading(false)
      }
    }
  }, [])

  const refreshAgentsFromEvents = useCallback(
    () => fetchAgents({ silent: true }),
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

  const createAgent = async (payload: CreateAgentPayload): Promise<void> => {
    try {
      setCreating(true)
      const result = await agentService.createAgent(payload)

      setAgents((currentAgents) => [result.data, ...currentAgents])
      setError(null)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Nao foi possivel criar o agente.',
      )
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
      const result = await agentService.updateAgentStatus(agentId, { status })

      setAgents((currentAgents) => replaceAgent(currentAgents, result.data))
      setError(null)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Nao foi possivel alterar o status do agente.',
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
    loading,
    refetch: fetchAgents,
  }
}
