import { CheckCircle2, Inbox, Plus, XCircle } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '../../components/EmptyState'
import { Header } from '../../components/Header'
import { LoadingState } from '../../components/LoadingState'
import { StatusBadge } from '../../components/StatusBadge'
import { Table, type TableColumn } from '../../components/Table'
import { AttendanceStatus } from '../../models/enum/attendanceStatus'
import { TeamName } from '../../models/enum/teamName'
import { formatDateTime } from '../../utils/dateUtils'
import { attendanceStatusMeta, teamLabels } from '../../utils/statusUtils'
import { CreateAttendanceModal } from './components/CreateAttendanceModal'
import { useAttendances } from './hooks/attendancesHook'
import * as S from './styles'

const columns: TableColumn[] = [
  { key: 'protocol', label: 'Protocolo' },
  { key: 'customer', label: 'Cliente' },
  { key: 'team', label: 'Time' },
  { key: 'status', label: 'Status' },
  { key: 'agent', label: 'Agente' },
  { key: 'createdAt', label: 'Criado em' },
  { key: 'actions', label: 'Acoes', align: 'right' },
]

export function Attendances() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const {
    actionLoadingId,
    canCancelAttendance,
    canFinishAttendance,
    cancelAttendance,
    createAttendance,
    creating,
    error,
    filteredAttendances,
    finishAttendance,
    loading,
    setStatusFilter,
    setTeamFilter,
    statusFilter,
    teamFilter,
  } = useAttendances()

  return (
    <>
      <Header
        title="Atendimentos"
        subtitle="Controle de fila, distribuicao e encerramento"
        actions={
          <S.HeaderActions>
            <S.PrimaryAction
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={16} />
              Criar atendimento
            </S.PrimaryAction>
          </S.HeaderActions>
        }
      />

      <S.PageStack>
        {error && <S.Notice>{error}</S.Notice>}

        <S.Filters>
          <S.FilterGroup>
            <label htmlFor="attendance-status">Status</label>
            <select
              id="attendance-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as typeof statusFilter)
              }
            >
              <option value="ALL">Todos</option>
              {Object.values(AttendanceStatus).map((status) => (
                <option key={status} value={status}>
                  {attendanceStatusMeta[status].label}
                </option>
              ))}
            </select>
          </S.FilterGroup>

          <S.FilterGroup>
            <label htmlFor="attendance-team">Time</label>
            <select
              id="attendance-team"
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
          <LoadingState label="Carregando atendimentos..." />
        ) : filteredAttendances.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Nenhum atendimento encontrado"
            description="Ajuste os filtros para visualizar outros atendimentos."
          />
        ) : (
          <Table columns={columns}>
            {filteredAttendances.map((attendance) => (
              <tr key={attendance.id}>
                <td>
                  <S.PrimaryCell>
                    <strong>{attendance.protocol}</strong>
                    <span>{attendance.subject}</span>
                  </S.PrimaryCell>
                </td>
                <td>{attendance.customerName}</td>
                <td>{teamLabels[attendance.team]}</td>
                <td>
                  <StatusBadge type="attendance" status={attendance.status} />
                </td>
                <td>{attendance.assignedAgentName ?? 'Sem agente'}</td>
                <td>{formatDateTime(attendance.createdAt)}</td>
                <td>
                  <S.TableActions>
                    <S.ActionButton
                      type="button"
                      disabled={
                        !canFinishAttendance(attendance) ||
                        actionLoadingId === attendance.id
                      }
                      onClick={() => void finishAttendance(attendance.id)}
                      aria-label="Finalizar atendimento"
                    >
                      <CheckCircle2 size={16} />
                    </S.ActionButton>
                    <S.ActionButton
                      type="button"
                      disabled={
                        !canCancelAttendance(attendance) ||
                        actionLoadingId === attendance.id
                      }
                      onClick={() => void cancelAttendance(attendance.id)}
                      aria-label="Cancelar atendimento"
                    >
                      <XCircle size={16} />
                    </S.ActionButton>
                  </S.TableActions>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </S.PageStack>

      <CreateAttendanceModal
        isOpen={isCreateModalOpen}
        isSubmitting={creating}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createAttendance}
      />
    </>
  )
}
