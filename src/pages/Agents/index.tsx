import { Plus, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { AgentWorkload } from '../../components/AgentWorkload'
import { EmptyState } from '../../components/EmptyState'
import { Header } from '../../components/Header'
import { LoadingState } from '../../components/LoadingState'
import { StatusBadge } from '../../components/StatusBadge'
import { Table, type TableColumn } from '../../components/Table'
import { AgentStatus } from '../../models/enum/agentStatus'
import { TeamName } from '../../models/enum/teamName'
import { formatDateTime } from '../../utils/dateUtils'
import { agentStatusMeta, teamLabels } from '../../utils/statusUtils'
import { CreateAgentModal } from './components/CreateAgentModal'
import { useAgents } from './hooks/agentsHook'
import * as S from './styles'

const columns: TableColumn[] = [
  { key: 'name', label: 'Agente', sortable: true },
  { key: 'team', label: 'Time', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'activeCount', label: 'Carga', sortable: true },
  { key: 'createdAt', label: 'Criado em', sortable: true },
  { key: 'actions', label: 'Alterar status', align: 'right' },
]

export function Agents() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const {
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
    setPage,
    setStatusFilter,
    setTeamFilter,
    sort,
    statusFilter,
    teamFilter,
    totalItems,
    visibleAgents,
  } = useAgents()

  return (
    <>
      <Header
        title="Agentes"
        subtitle="Gestao de disponibilidade e capacidade operacional"
        actions={
          <S.HeaderActions>
            <S.PrimaryAction
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={16} />
              Criar agente
            </S.PrimaryAction>
          </S.HeaderActions>
        }
      />

      <S.PageStack>
        {error && <S.Notice role="alert">{error}</S.Notice>}

        <S.Filters>
          <S.FilterGroup>
            <label htmlFor="agent-status">Status</label>
            <select
              id="agent-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as typeof statusFilter)
              }
            >
              <option value="ALL">Todos</option>
              {Object.values(AgentStatus).map((status) => (
                <option key={status} value={status}>
                  {agentStatusMeta[status].label}
                </option>
              ))}
            </select>
          </S.FilterGroup>

          <S.FilterGroup>
            <label htmlFor="agent-team">Time</label>
            <select
              id="agent-team"
              value={teamFilter}
              onChange={(event) =>
                setTeamFilter(event.target.value as typeof teamFilter)
              }
            >
              <option value="ALL">Todos</option>
              {Object.values(TeamName).map((team) => (
                <option key={team} value={team}>
                  {teamLabels[team]}
                </option>
              ))}
            </select>
          </S.FilterGroup>
        </S.Filters>

        {loading ? (
          <LoadingState label="Carregando agentes..." />
        ) : agents.length === 0 ? (
          <EmptyState
            icon={UsersRound}
            title="Nenhum agente cadastrado"
            description="Crie agentes para iniciar a distribuição de atendimentos."
          />
        ) : (
          <Table
            caption="Lista de agentes operacionais"
            columns={columns}
            onSort={handleSort}
            pagination={{
              page,
              pageSize,
              totalItems,
              onPageChange: setPage,
            }}
            sort={sort}
          >
            {visibleAgents.map((agent) => (
              <tr key={agent.id}>
                <td>
                  <S.AgentIdentity>
                    <S.Avatar>{agent.name.slice(0, 1).toUpperCase()}</S.Avatar>
                    <div>
                      <strong>{agent.name}</strong>
                    </div>
                  </S.AgentIdentity>
                </td>
                <td>{teamLabels[agent.team]}</td>
                <td>
                  <StatusBadge type="agent" status={agent.status} />
                </td>
                <td>
                  <AgentWorkload activeCount={agent.activeCount} />
                </td>
                <td>{formatDateTime(agent.createdAt)}</td>
                <td>
                  <S.StatusActions>
                    {Object.values(AgentStatus).map((status) => (
                      <S.StatusButton
                        key={status}
                        type="button"
                        $active={agent.status === status}
                        aria-pressed={agent.status === status}
                        aria-label={`Alterar ${agent.name} para ${agentStatusMeta[status].label}`}
                        disabled={actionLoadingId === agent.id}
                        onClick={() => void changeAgentStatus(agent.id, status)}
                      >
                        {agentStatusMeta[status].label}
                      </S.StatusButton>
                    ))}
                  </S.StatusActions>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </S.PageStack>

      <CreateAgentModal
        isOpen={isCreateModalOpen}
        isSubmitting={creating}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createAgent}
      />
    </>
  )
}
