import { api } from './api'
import type { ServiceResult } from './serviceTypes'
import type {
  Agent,
  CreateAgentPayload,
  UpdateAgentStatusPayload,
} from '../models/interface/agent'

export const agentService = {
  async getAgents(): Promise<ServiceResult<Agent[]>> {
    const response = await api.get<Agent[]>('/api/v1/agents')

    return { data: response.data }
  },

  async createAgent(
    payload: CreateAgentPayload,
  ): Promise<ServiceResult<Agent>> {
    const response = await api.post<Agent>('/api/v1/agents', payload)

    return { data: response.data }
  },

  async updateAgentStatus(
    id: string,
    payload: UpdateAgentStatusPayload,
  ): Promise<ServiceResult<Agent>> {
    const response = await api.patch<Agent>(
      `/api/v1/agents/${id}/status`,
      payload,
    )

    return { data: response.data }
  },
}
