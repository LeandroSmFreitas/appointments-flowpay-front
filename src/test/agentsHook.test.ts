import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AgentStatus } from '../models/enum/agentStatus'
import { TeamName } from '../models/enum/teamName'
import { agentService } from '../services/agentService'
import { useAgents } from '../pages/Agents/hooks/agentsHook'

vi.mock('../context/useDashboardRealtime', () => ({
  useDashboardRealtime: () => ({
    eventRevision: 0,
    lastEvent: null,
    pollingRevision: 0,
  }),
}))

vi.mock('../services/agentService', () => ({
  agentService: {
    createAgent: vi.fn(),
    getAgents: vi.fn(),
    updateAgentStatus: vi.fn(),
  },
}))

const agent = {
  id: 'agent-1',
  name: 'Ana',
  email: 'ana@flowpay.com',
  team: TeamName.CARTOES,
  status: AgentStatus.ONLINE,
  activeCount: 1,
  createdAt: '2026-07-03T20:07:24.957875Z',
}

const emptyPage = {
  content: [],
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 1,
}

describe('useAgents', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads agents with remote pagination params', async () => {
    vi.mocked(agentService.getAgents).mockResolvedValue({
      data: {
        content: [agent],
        page: 0,
        size: 8,
        totalElements: 1,
        totalPages: 1,
      },
    })

    const { result } = renderHook(() => useAgents())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(agentService.getAgents).toHaveBeenCalledWith({
      page: 0,
      size: 8,
      sort: 'name,asc',
      status: undefined,
      team: undefined,
    })
    expect(result.current.visibleAgents).toEqual([agent])
  })

  it('updates agent status and refreshes the remote page', async () => {
    vi.mocked(agentService.getAgents).mockResolvedValue({
      data: emptyPage,
    })
    vi.mocked(agentService.updateAgentStatus).mockResolvedValue({
      data: {
        ...agent,
        status: AgentStatus.PAUSED,
      },
    })

    const { result } = renderHook(() => useAgents())

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.changeAgentStatus(agent.id, AgentStatus.PAUSED)
    })

    expect(agentService.updateAgentStatus).toHaveBeenCalledWith(agent.id, {
      status: AgentStatus.PAUSED,
    })
    expect(agentService.getAgents).toHaveBeenCalledTimes(2)
  })
})
