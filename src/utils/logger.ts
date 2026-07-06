type LogLevel = 'error' | 'info' | 'warn'

export interface LogContext {
  [key: string]: unknown
}

interface LogPayload {
  context?: LogContext
  level: LogLevel
  message: string
  scope: string
  timestamp: string
}

const emitLog = (payload: LogPayload): void => {
  const logPayload = {
    ...payload,
    app: 'appointments-flowpay',
  }

  if (payload.level === 'error') {
    console.error(logPayload)
    return
  }

  if (payload.level === 'warn') {
    console.warn(logPayload)
    return
  }

  console.info(logPayload)
}

export const createLogger = (scope: string) => ({
  error(message: string, context?: LogContext): void {
    emitLog({
      context,
      level: 'error',
      message,
      scope,
      timestamp: new Date().toISOString(),
    })
  },
  info(message: string, context?: LogContext): void {
    emitLog({
      context,
      level: 'info',
      message,
      scope,
      timestamp: new Date().toISOString(),
    })
  },
  warn(message: string, context?: LogContext): void {
    emitLog({
      context,
      level: 'warn',
      message,
      scope,
      timestamp: new Date().toISOString(),
    })
  },
})
