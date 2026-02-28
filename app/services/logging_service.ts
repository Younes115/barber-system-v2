import logger from '@adonisjs/core/services/logger'

/**
 * Lightweight structured-logging helper.
 *
 * Wraps the AdonisJS logger with a consistent shape so every log entry
 * includes at least `action`, and optionally `userId`, `bookingId`,
 * `route`, `ip`, and a free-form `extra` bag.
 */
interface LogPayload {
  action: string
  userId?: number
  bookingId?: number
  route?: string
  ip?: string
  extra?: Record<string, unknown>
}

function formatPayload(payload: LogPayload): Record<string, unknown> {
  const obj: Record<string, unknown> = { action: payload.action }
  if (payload.userId !== undefined) obj.userId = payload.userId
  if (payload.bookingId !== undefined) obj.bookingId = payload.bookingId
  if (payload.route) obj.route = payload.route
  if (payload.ip) obj.ip = payload.ip
  if (payload.extra) Object.assign(obj, payload.extra)
  return obj
}

export const appLogger = {
  info(payload: LogPayload) {
    logger.info(formatPayload(payload), payload.action)
  },

  warn(payload: LogPayload) {
    logger.warn(formatPayload(payload), payload.action)
  },

  error(payload: LogPayload & { error?: unknown }) {
    const obj = formatPayload(payload)
    if (payload.error instanceof Error) {
      obj.errorMessage = payload.error.message
      obj.errorStack = payload.error.stack
    }
    logger.error(obj, payload.action)
  },
}
