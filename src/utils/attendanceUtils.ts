import type { Attendance } from '../models/interface/attendance'

export const getAttendanceProtocol = (attendance: Attendance): string =>
  attendance.protocol ?? attendance.id.slice(0, 8).toUpperCase()
