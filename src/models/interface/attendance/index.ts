import type { AttendanceStatus } from '../../enum/attendanceStatus'
import type { TeamName } from '../../enum/teamName'

export interface Attendance {
  id: string
  protocol: string
  customerName: string
  team: TeamName
  status: AttendanceStatus
  subject: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  assignedAgentId: string | null
  assignedAgentName: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateAttendancePayload {
  customerName: string
  subject: string
}
