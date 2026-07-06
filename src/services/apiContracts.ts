import { AgentStatus } from '../models/enum/agentStatus'
import { AttendanceStatus } from '../models/enum/attendanceStatus'
import { TeamName } from '../models/enum/teamName'
import type { Agent } from '../models/interface/agent'
import type { Attendance } from '../models/interface/attendance'
import type { DashboardSummary } from '../models/interface/dashboard'
import type { PageResponse } from './serviceTypes'

type ValidationIssue = string
type ContractValidator = (value: unknown, path?: string) => ValidationIssue[]

export type ContractGuard<TData> = {
  (value: unknown): value is TData
  getIssues: ContractValidator
}

export class ApiContractError extends Error {
  readonly issues: ValidationIssue[]

  constructor(resourceName: string, issues: ValidationIssue[] = []) {
    const details =
      issues.length > 0 ? ` Campos invalidos: ${issues.slice(0, 4).join('; ')}.` : ''

    super(`Resposta invalida da API para ${resourceName}.${details}`)
    this.name = 'ApiContractError'
    this.issues = issues
  }
}

const attendancePriorities = ['LOW', 'MEDIUM', 'HIGH'] as const
const maxAgentCapacity = 3

const createContractGuard = <TData>(
  validator: ContractValidator,
): ContractGuard<TData> =>
  Object.assign(
    (value: unknown): value is TData => validator(value).length === 0,
    { getIssues: validator },
  )

const describeValue = (value: unknown): string => {
  if (value === null) {
    return 'null'
  }

  if (Array.isArray(value)) {
    return 'array'
  }

  return typeof value
}

const invalidType = (
  path: string,
  expected: string,
  value: unknown,
): ValidationIssue => `${path} esperado ${expected}, recebido ${describeValue(value)}`

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isNonNegativeInteger = (value: unknown): value is number =>
  Number.isInteger(value) && Number(value) >= 0

const isPositiveInteger = (value: unknown): value is number =>
  Number.isInteger(value) && Number(value) > 0

const isEmail = (value: unknown): value is string =>
  isString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const isEnumValue = <TValue extends string>(
  values: readonly TValue[],
  value: unknown,
): value is TValue => isString(value) && values.includes(value as TValue)

const validateRecord = (value: unknown): value is Record<string, unknown> =>
  isRecord(value)

const validateString = (
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void => {
  if (!isString(value)) {
    issues.push(invalidType(path, 'string nao vazia', value))
  }
}

const validateOptionalString = (
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void => {
  if (value !== undefined && !isString(value)) {
    issues.push(invalidType(path, 'string nao vazia opcional', value))
  }
}

const validateOptionalNullableString = (
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void => {
  if (value !== undefined && value !== null && !isString(value)) {
    issues.push(invalidType(path, 'string nao vazia, null ou undefined', value))
  }
}

const validateNonNegativeInteger = (
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void => {
  if (!isNonNegativeInteger(value)) {
    issues.push(invalidType(path, 'inteiro maior ou igual a zero', value))
  }
}

const validatePositiveInteger = (
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void => {
  if (!isPositiveInteger(value)) {
    issues.push(invalidType(path, 'inteiro maior que zero', value))
  }
}

const validateEnum = <TValue extends string>(
  values: readonly TValue[],
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void => {
  if (!isEnumValue(values, value)) {
    issues.push(invalidType(path, values.join(' | '), value))
  }
}

const validateOptionalEnum = <TValue extends string>(
  values: readonly TValue[],
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void => {
  if (value !== undefined) {
    validateEnum(values, value, path, issues)
  }
}

const validateTeamSummary: ContractValidator = (
  value,
  path = '$',
) => {
  const issues: ValidationIssue[] = []

  if (!validateRecord(value)) {
    return [invalidType(path, 'objeto TeamSummary', value)]
  }

  validateEnum(Object.values(TeamName), value.team, `${path}.team`, issues)
  validateNonNegativeInteger(value.waiting, `${path}.waiting`, issues)
  validateNonNegativeInteger(value.inProgress, `${path}.inProgress`, issues)
  validateNonNegativeInteger(
    value.finishedToday,
    `${path}.finishedToday`,
    issues,
  )
  validateNonNegativeInteger(value.agentsOnline, `${path}.agentsOnline`, issues)
  validateNonNegativeInteger(value.totalCapacity, `${path}.totalCapacity`, issues)
  validateNonNegativeInteger(value.usedCapacity, `${path}.usedCapacity`, issues)
  validateNonNegativeInteger(
    value.availableCapacity,
    `${path}.availableCapacity`,
    issues,
  )

  if (
    isNumber(value.totalCapacity) &&
    isNumber(value.usedCapacity) &&
    value.usedCapacity > value.totalCapacity
  ) {
    issues.push(`${path}.usedCapacity nao pode ser maior que totalCapacity`)
  }

  return issues
}

const validateDashboardSummary: ContractValidator = (
  value,
  path = '$',
) => {
  const issues: ValidationIssue[] = []

  if (!validateRecord(value)) {
    return [invalidType(path, 'objeto DashboardSummary', value)]
  }

  validateNonNegativeInteger(value.totalWaiting, `${path}.totalWaiting`, issues)
  validateNonNegativeInteger(
    value.totalInProgress,
    `${path}.totalInProgress`,
    issues,
  )
  validateNonNegativeInteger(
    value.totalFinishedToday,
    `${path}.totalFinishedToday`,
    issues,
  )

  if (!Array.isArray(value.teams)) {
    issues.push(invalidType(`${path}.teams`, 'array', value.teams))

    return issues
  }

  const seenTeams = new Set<TeamName>()

  value.teams.forEach((team, index) => {
    issues.push(...validateTeamSummary(team, `${path}.teams[${index}]`))

    if (isRecord(team) && isEnumValue(Object.values(TeamName), team.team)) {
      if (seenTeams.has(team.team)) {
        issues.push(`${path}.teams[${index}].team duplicado`)
      }

      seenTeams.add(team.team)
    }
  })

  return issues
}

const validateAttendance: ContractValidator = (value, path = '$') => {
  const issues: ValidationIssue[] = []

  if (!validateRecord(value)) {
    return [invalidType(path, 'objeto Attendance', value)]
  }

  validateString(value.id, `${path}.id`, issues)
  validateOptionalString(value.protocol, `${path}.protocol`, issues)
  validateString(value.customerName, `${path}.customerName`, issues)
  validateEnum(Object.values(TeamName), value.team, `${path}.team`, issues)
  validateEnum(
    Object.values(AttendanceStatus),
    value.status,
    `${path}.status`,
    issues,
  )
  validateString(value.subject, `${path}.subject`, issues)
  validateOptionalEnum(
    attendancePriorities,
    value.priority,
    `${path}.priority`,
    issues,
  )
  validateOptionalNullableString(
    value.assignedAgentId,
    `${path}.assignedAgentId`,
    issues,
  )
  validateOptionalNullableString(
    value.assignedAgentName,
    `${path}.assignedAgentName`,
    issues,
  )
  validateString(value.createdAt, `${path}.createdAt`, issues)
  validateOptionalNullableString(value.startedAt, `${path}.startedAt`, issues)
  validateOptionalNullableString(value.finishedAt, `${path}.finishedAt`, issues)
  validateString(value.updatedAt, `${path}.updatedAt`, issues)

  return issues
}

const validateAgent: ContractValidator = (value, path = '$') => {
  const issues: ValidationIssue[] = []

  if (!validateRecord(value)) {
    return [invalidType(path, 'objeto Agent', value)]
  }

  validateString(value.id, `${path}.id`, issues)
  validateString(value.name, `${path}.name`, issues)

  validateEnum(Object.values(TeamName), value.team, `${path}.team`, issues)
  validateEnum(Object.values(AgentStatus), value.status, `${path}.status`, issues)
  validateNonNegativeInteger(value.activeCount, `${path}.activeCount`, issues)

  if (isNumber(value.activeCount) && value.activeCount > maxAgentCapacity) {
    issues.push(`${path}.activeCount nao pode ser maior que ${maxAgentCapacity}`)
  }

  validateString(value.createdAt, `${path}.createdAt`, issues)

  return issues
}

const validateArrayOf =
  <TData>(itemGuard: ContractGuard<TData>): ContractValidator =>
  (value, path = '$') => {
    if (!Array.isArray(value)) {
      return [invalidType(path, 'array', value)]
    }

    return value.flatMap((item, index) =>
      itemGuard.getIssues(item, `${path}[${index}]`),
    )
  }

const normalizePageMetadataValue = (
  record: Record<string, unknown>,
  primaryKey: string,
  fallbackKey?: string,
): unknown => record[primaryKey] ?? (fallbackKey ? record[fallbackKey] : undefined)

const buildPageResponse = <TData>(
  value: Record<string, unknown>,
): PageResponse<TData> => ({
  content: value.content as TData[],
  page: normalizePageMetadataValue(value, 'page', 'number') as number,
  size: normalizePageMetadataValue(value, 'size', 'pageSize') as number,
  totalElements: value.totalElements as number,
  totalPages: value.totalPages as number,
  first: typeof value.first === 'boolean' ? value.first : undefined,
  last: typeof value.last === 'boolean' ? value.last : undefined,
})

const validatePageOf =
  <TData>(
    itemGuard: ContractGuard<TData>,
    options: { allowSpringAliases?: boolean } = {},
  ): ContractValidator =>
  (value, path = '$') => {
    const issues: ValidationIssue[] = []

    if (!validateRecord(value)) {
      return [invalidType(path, 'objeto paginado', value)]
    }

    if (!Array.isArray(value.content)) {
      issues.push(invalidType(`${path}.content`, 'array', value.content))
    } else {
      value.content.forEach((item, index) => {
        issues.push(...itemGuard.getIssues(item, `${path}.content[${index}]`))
      })
    }

    validateNonNegativeInteger(
      options.allowSpringAliases
        ? normalizePageMetadataValue(value, 'page', 'number')
        : value.page,
      `${path}.page`,
      issues,
    )
    validatePositiveInteger(
      options.allowSpringAliases
        ? normalizePageMetadataValue(value, 'size', 'pageSize')
        : value.size,
      `${path}.size`,
      issues,
    )
    validateNonNegativeInteger(
      value.totalElements,
      `${path}.totalElements`,
      issues,
    )
    validateNonNegativeInteger(value.totalPages, `${path}.totalPages`, issues)

    if (value.first !== undefined && typeof value.first !== 'boolean') {
      issues.push(invalidType(`${path}.first`, 'boolean opcional', value.first))
    }

    if (value.last !== undefined && typeof value.last !== 'boolean') {
      issues.push(invalidType(`${path}.last`, 'boolean opcional', value.last))
    }

    return issues
  }

export const validateApiResponse = <TData>(
  value: unknown,
  guard: ContractGuard<TData>,
  resourceName: string,
): TData => {
  const issues = guard.getIssues(value)

  if (issues.length > 0) {
    throw new ApiContractError(resourceName, issues)
  }

  return value as TData
}

export const normalizeApiPageResponse = <TData>(
  value: unknown,
  itemGuard: ContractGuard<TData>,
  resourceName: string,
): PageResponse<TData> | null => {
  if (!isRecord(value) || !('content' in value)) {
    return null
  }

  const pageGuard = createContractGuard(
    validatePageOf(itemGuard, { allowSpringAliases: true }),
  )
  const issues = pageGuard.getIssues(value)

  if (issues.length > 0) {
    throw new ApiContractError(resourceName, issues)
  }

  return buildPageResponse<TData>(value)
}

const agentGuard = createContractGuard<Agent>(validateAgent)
const attendanceGuard = createContractGuard<Attendance>(validateAttendance)

export const apiContracts = {
  agent: agentGuard,
  agents: createContractGuard<Agent[]>(validateArrayOf(agentGuard)),
  agentsPage: createContractGuard<PageResponse<Agent>>(validatePageOf(agentGuard)),
  attendance: attendanceGuard,
  attendances: createContractGuard<Attendance[]>(
    validateArrayOf(attendanceGuard),
  ),
  attendancesPage: createContractGuard<PageResponse<Attendance>>(
    validatePageOf(attendanceGuard),
  ),
  dashboardSummary: createContractGuard<DashboardSummary>(
    validateDashboardSummary,
  ),
}
