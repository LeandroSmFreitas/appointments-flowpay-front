import { describe, expect, it } from 'vitest'
import { AgentStatus } from '../models/enum/agentStatus'
import { AttendanceStatus } from '../models/enum/attendanceStatus'
import { TeamName } from '../models/enum/teamName'
import {
  apiContracts,
  normalizeApiPageResponse,
  validateApiResponse,
} from '../services/apiContracts'

describe('apiContracts', () => {
  it('accepts a valid agent payload', () => {
    const agent = {
      id: 'agent-1',
      name: 'Ana',
      email: 'ana@flowpay.com',
      team: TeamName.CARTOES,
      status: AgentStatus.ONLINE,
      activeCount: 2,
      createdAt: '2026-07-03T12:00:00.000Z',
    }

    expect(validateApiResponse(agent, apiContracts.agent, 'agente')).toEqual(agent)
  })

  it('rejects invalid API payloads with a domain message', () => {
    expect(() =>
      validateApiResponse(
        { id: 'agent-1', name: 'Ana' },
        apiContracts.agent,
        'agente',
      ),
    ).toThrow('Resposta invalida da API para agente.')
  })

  it('reports the invalid contract field in the error message', () => {
    expect(() =>
      validateApiResponse(
        {
          id: 'agent-1',
          name: 'Ana',
          email: 'ana@flowpay.com',
          team: TeamName.CARTOES,
          status: AgentStatus.ONLINE,
          activeCount: 4,
          createdAt: '2026-07-03T12:00:00.000Z',
        },
        apiContracts.agent,
        'agente',
      ),
    ).toThrow('$.activeCount nao pode ser maior que 3')
  })

  it('accepts attendances without optional protocol, priority or agent fields', () => {
    const attendances = [
      {
        id: 'e1bfe9ee-31be-4567-91c8-81f60eb8ed7e',
        customerName: 'bbbb',
        subject: 'macarrao',
        team: TeamName.OUTROS,
        status: AttendanceStatus.WAITING,
        createdAt: '2026-07-03T20:07:24.957875Z',
        updatedAt: '2026-07-03T20:07:24.957875Z',
      },
    ]

    expect(
      validateApiResponse(
        attendances,
        apiContracts.attendances,
        'lista de atendimentos',
      ),
    ).toEqual(attendances)
  })

  it('accepts paginated attendance responses', () => {
    const page = {
      content: [
        {
          id: 'e1bfe9ee-31be-4567-91c8-81f60eb8ed7e',
          customerName: 'bbbb',
          subject: 'macarrao',
          team: TeamName.OUTROS,
          status: AttendanceStatus.WAITING,
          createdAt: '2026-07-03T20:07:24.957875Z',
          updatedAt: '2026-07-03T20:07:24.957875Z',
        },
      ],
      page: 0,
      size: 8,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    }

    expect(
      validateApiResponse(
        page,
        apiContracts.attendancesPage,
        'pagina de atendimentos',
      ),
    ).toEqual(page)
  })

  it('normalizes Spring-style paginated attendance responses', () => {
    const springPage = {
      content: [
        {
          id: 'e1bfe9ee-31be-4567-91c8-81f60eb8ed7e',
          customerName: 'bbbb',
          subject: 'macarrao',
          team: TeamName.OUTROS,
          status: AttendanceStatus.WAITING,
          createdAt: '2026-07-03T20:07:24.957875Z',
          updatedAt: '2026-07-03T20:07:24.957875Z',
        },
      ],
      number: 0,
      size: 8,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    }

    expect(
      normalizeApiPageResponse(
        springPage,
        apiContracts.attendance,
        'pagina de atendimentos',
      ),
    ).toEqual({
      content: springPage.content,
      page: 0,
      size: 8,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    })
  })
})
