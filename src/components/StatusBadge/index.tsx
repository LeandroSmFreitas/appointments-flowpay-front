import { AgentStatus } from '../../models/enum/agentStatus'
import { AttendanceStatus } from '../../models/enum/attendanceStatus'
import { agentStatusMeta, attendanceStatusMeta } from '../../utils/statusUtils'
import * as S from './styles'

type StatusBadgeProps =
  | {
      type: 'attendance'
      status: AttendanceStatus
    }
  | {
      type: 'agent'
      status: AgentStatus
    }

export function StatusBadge(props: StatusBadgeProps) {
  const meta =
    props.type === 'attendance'
      ? attendanceStatusMeta[props.status]
      : agentStatusMeta[props.status]

  return (
    <S.Badge $tone={meta.tone}>
      <span />
      {meta.label}
    </S.Badge>
  )
}
