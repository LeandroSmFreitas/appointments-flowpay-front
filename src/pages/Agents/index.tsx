import { Plus, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { AgentWorkload } from '../../components/AgentWorkload'
import { EmptyState } from '../../components/EmptyState'
import { Header } from '../../components/Header'
import { LoadingState } from '../../components/LoadingState'
import { StatusBadge } from '../../components/StatusBadge'
import { Table, type TableColumn } from '../../components/Table'
import { AgentStatus } from '../../models/enum/agentStatus'
import { formatDateTime } from '../../utils/dateUtils'
import { agentStatusMeta, teamLabels } from '../../utils/statusUtils'
import { CreateAgentModal } from './components/CreateAgentModal'
import { useAgents } from './hooks/agentsHook'
import * as S from './styles'

const columns: TableColumn[] = [
  { key: 'agent', label: 'Agente' },
  { key: 'team', label: 'Time' },
  { key: 'status', label: 'Status' },
  { key: 'workload', label: 'Carga' },
  { key: 'createdAt', label: 'Criado em' },
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
    loading,
  } = useAgents()

  return (
    <>
      <Header
        title="Agentes"
        subtitle="Gestão de disponibilidade e capacidade operacional"
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
        {error && <S.Notice>{error}</S.Notice>}

        {loading ? (
          <LoadingState label="Carregando agentes..." />
        ) : agents.length === 0 ? (
          <EmptyState
            icon={UsersRound}
            title="Nenhum agente cadastrado"
            description="Crie agentes para iniciar a distribuição de atendimentos."
          />
        ) : (
          <Table columns={columns}>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td>
                  <S.AgentIdentity>
                    <S.Avatar>{agent.name.slice(0, 1).toUpperCase()}</S.Avatar>
                    <div>
                      <strong>{agent.name}</strong>
                      <span>{agent.email}</span>
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
