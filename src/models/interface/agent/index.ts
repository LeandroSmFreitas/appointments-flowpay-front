import type { AgentStatus } from '../../enum/agentStatus'
import type { TeamName } from '../../enum/teamName'

export interface Agent {
  id: string
  name: string
  email: string
  team: TeamName
  status: AgentStatus
  activeCount: number
  createdAt: string
}

export interface CreateAgentPayload {
  name: string
  email: string
  team: TeamName
}

export interface UpdateAgentStatusPayload {
  status: AgentStatus
}
