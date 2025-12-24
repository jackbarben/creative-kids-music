const isDev = process.env.NODE_ENV === 'development'

/**
 * Log an error with context
 * In development: logs to console
 * In production: could send to error tracking service (Sentry, etc.)
 */
export function logError(context: string, error: unknown) {
  if (isDev) {
    console.error(`[${context}]`, error)
  }
  // In production, you could send to Sentry, LogRocket, etc.
  // Example: Sentry.captureException(error, { extra: { context } })
}

/**
 * Log informational message
 * Only logs in development
 */
export function logInfo(context: string, message: string) {
  if (isDev) {
    console.log(`[${context}]`, message)
  }
}

/**
 * Log a warning
 * Only logs in development
 */
export function logWarn(context: string, message: string) {
  if (isDev) {
    console.warn(`[${context}]`, message)
  }
}
