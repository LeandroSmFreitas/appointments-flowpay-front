import { AgentStatus } from '../models/enum/agentStatus'
import { AttendanceStatus } from '../models/enum/attendanceStatus'
import { TeamName } from '../models/enum/teamName'

export type StatusTone = 'green' | 'yellow' | 'red' | 'neutral' | 'blue'

interface StatusMeta {
  label: string
  tone: StatusTone
}

export const attendanceStatusMeta: Record<AttendanceStatus, StatusMeta> = {
  [AttendanceStatus.WAITING]: { label: 'Na fila', tone: 'yellow' },
  [AttendanceStatus.IN_PROGRESS]: { label: 'Em atendimento', tone: 'green' },
  [AttendanceStatus.FINISHED]: { label: 'Finalizado', tone: 'neutral' },
  [AttendanceStatus.CANCELLED]: { label: 'Cancelado', tone: 'red' },
}

export const agentStatusMeta: Record<AgentStatus, StatusMeta> = {
  [AgentStatus.ONLINE]: { label: 'Online', tone: 'green' },
  [AgentStatus.PAUSED]: { label: 'Pausado', tone: 'yellow' },
  [AgentStatus.OFFLINE]: { label: 'Offline', tone: 'neutral' },
}

export const teamLabels: Record<TeamName, string> = {
  [TeamName.CARTOES]: 'Cartões',
  [TeamName.EMPRESTIMOS]: 'Empréstimos',
  [TeamName.OUTROS]: 'Outros Assuntos',
}

export const getCapacityTone = (usagePercent: number): StatusTone => {
  if (usagePercent >= 90) {
    return 'red'
  }

  if (usagePercent >= 70) {
    return 'yellow'
  }

  return 'green'
}
