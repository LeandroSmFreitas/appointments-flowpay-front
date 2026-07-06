import type { TeamName } from '../../enum/teamName'

export interface TeamSummary {
  team: TeamName
  waiting: number
  inProgress: number
  finishedToday: number
  agentsOnline: number
  totalCapacity: number
  usedCapacity: number
  availableCapacity: number
}

export interface DashboardSummary {
  totalWaiting: number
  totalInProgress: number
  totalFinishedToday: number
  teams: TeamSummary[]
}

export interface QueueHistoryPoint {
  label: string
  waiting: number
  inProgress: number
}

export type ActivityType =
  | 'CREATED'
  | 'ASSIGNED'
  | 'FINISHED'
  | 'CANCELLED'
  | 'AGENT_STATUS'

export interface LiveActivity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
}

export type DashboardActivityEventType =
  | 'ATTENDANCE_CREATED'
  | 'ATTENDANCE_ASSIGNED'
  | 'ATTENDANCE_FINISHED'
  | 'ATTENDANCE_CANCELLED'
  | 'AGENT_STATUS_CHANGED'
