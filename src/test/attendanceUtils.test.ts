import { describe, expect, it } from 'vitest'
import { AttendanceStatus } from '../models/enum/attendanceStatus'
import { TeamName } from '../models/enum/teamName'
import type { Attendance } from '../models/interface/attendance'
import { getAttendanceProtocol } from '../utils/attendanceUtils'

describe('attendanceUtils', () => {
  it('uses protocol when the backend provides it', () => {
    const attendance: Attendance = {
      id: 'ea14bc13-c336-48e2-a51f-e054af762071',
      protocol: 'FP-123',
      customerName: 'Mentor',
      subject: 'Problemas com cartao',
      team: TeamName.CARTOES,
      status: AttendanceStatus.WAITING,
      createdAt: '2026-07-03T20:19:48.916338Z',
      updatedAt: '2026-07-03T20:45:19.616533Z',
    }

    expect(getAttendanceProtocol(attendance)).toBe('FP-123')
  })

  it('falls back to a short id when protocol is missing', () => {
    const attendance: Attendance = {
      id: 'ea14bc13-c336-48e2-a51f-e054af762071',
      customerName: 'Mentor',
      subject: 'Problemas com cartao',
      team: TeamName.CARTOES,
      status: AttendanceStatus.WAITING,
      createdAt: '2026-07-03T20:19:48.916338Z',
      updatedAt: '2026-07-03T20:45:19.616533Z',
    }

    expect(getAttendanceProtocol(attendance)).toBe('EA14BC13')
  })
})
