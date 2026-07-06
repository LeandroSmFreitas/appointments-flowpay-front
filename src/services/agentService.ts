import { api } from './api'
import {
  apiContracts,
  normalizeApiPageResponse,
  validateApiResponse,
} from './apiContracts'
import {
  createCacheKey,
  getCachedData,
  invalidateCacheNamespace,
  setCachedData,
} from './cacheStore'
import type { PageQuery, PageResponse, ServiceResult } from './serviceTypes'
import { strictPaginatedResponses } from '../config/api'
import type {
  Agent,
  CreateAgentPayload,
  UpdateAgentStatusPayload,
} from '../models/interface/agent'
import { createPageResponse } from '../utils/paginationUtils'

export type AgentSortKey =
  | 'activeCount'
  | 'createdAt'
  | 'name'
  | 'status'
  | 'team'

export type AgentPageQuery = PageQuery<AgentSortKey>

const invalidateAgentSideEffects = (): void => {
  invalidateCacheNamespace('agents', 'dashboard-summary')
}

const getAgentCacheParams = (query: AgentPageQuery) => ({
  page: query.page,
  size: query.size,
  sort: query.sort,
  status: query.status,
  team: query.team,
})

const compareAgentValue = (
  firstAgent: Agent,
  secondAgent: Agent,
  sortKey: AgentSortKey,
): number =>
  String(firstAgent[sortKey] ?? '').localeCompare(
    String(secondAgent[sortKey] ?? ''),
    'pt-BR',
    {
      numeric: true,
      sensitivity: 'base',
    },
  )

const applyLegacyAgentQuery = (
  agents: Agent[],
  query: AgentPageQuery,
): Agent[] => {
  const [sortKey, sortDirection] = query.sort.split(',') as [
    AgentSortKey,
    'asc' | 'desc',
  ]

  return agents
    .filter((agent) => !query.status || agent.status === query.status)
    .filter((agent) => !query.team || agent.team === query.team)
    .sort((firstAgent, secondAgent) => {
      const comparison = compareAgentValue(firstAgent, secondAgent, sortKey)

      return sortDirection === 'asc' ? comparison : -comparison
    })
}

const normalizeAgentsPage = (
  responseData: unknown,
  query: AgentPageQuery,
): PageResponse<Agent> => {
  const page = normalizeApiPageResponse(
    responseData,
    apiContracts.agent,
    'pagina de agentes',
  )

  if (page) {
    return page
  }

  if (strictPaginatedResponses) {
    return validateApiResponse(responseData, apiContracts.agentsPage, 'pagina de agentes')
  }

  const agents = validateApiResponse(
    responseData,
    apiContracts.agents,
    'lista de agentes',
  )

  return createPageResponse(applyLegacyAgentQuery(agents, query), query.page, query.size)
}

export const agentService = {
  async getAgents(
    query: AgentPageQuery,
  ): Promise<ServiceResult<PageResponse<Agent>>> {
    const cacheKey = createCacheKey('agents', getAgentCacheParams(query))
    const cached = getCachedData<PageResponse<Agent>>(cacheKey, query)

    if (cached) {
      return { data: cached }
    }

    const response = await api.get<unknown>('/api/v1/agents', {
      params: {
        page: query.page,
        size: query.size,
        sort: query.sort,
        status: query.status,
        team: query.team,
      },
    })
    const data = normalizeAgentsPage(response.data, query)

    setCachedData(cacheKey, data)

    return { data }
  },

  async createAgent(
    payload: CreateAgentPayload,
  ): Promise<ServiceResult<Agent>> {
    const response = await api.post<unknown>('/api/v1/agents', payload)
    const data = validateApiResponse(
      response.data,
      apiContracts.agent,
      'agente criado',
    )

    invalidateAgentSideEffects()

    return { data }
  },

  async updateAgentStatus(
    id: string,
    payload: UpdateAgentStatusPayload,
  ): Promise<ServiceResult<Agent>> {
    const response = await api.patch<unknown>(
      `/api/v1/agents/${id}/status`,
      payload,
    )
    const data = validateApiResponse(
      response.data,
      apiContracts.agent,
      'status do agente',
    )

    invalidateAgentSideEffects()

    return { data }
  },
}
