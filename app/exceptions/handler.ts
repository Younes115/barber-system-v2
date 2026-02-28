import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'
import { BookingDomainError } from '#services/booking_service'
import { appLogger } from '#services/logging_service'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * Status pages are used to display a custom HTML pages for certain error
   * codes. You might want to enable them in production only, but feel
   * free to enable them in development as well.
   */
  protected renderStatusPages = app.inProduction

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   */
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (_, { inertia }) => inertia.render('errors/not_found', {}),
    '500..599': (_, { inertia }) => inertia.render('errors/server_error', {}),
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    /**
     * Handle domain-level booking errors.
     * - Inertia / web requests: redirect back with a flash error.
     * - JSON / API requests: structured JSON response.
     */
    if (error instanceof BookingDomainError) {
      const wantsJson = ctx.request.accepts(['html', 'json']) === 'json'

      if (wantsJson) {
        return ctx.response.status(error.status).json({
          error: error.message,
        })
      }

      ctx.session.flash('error', error.message)
      return ctx.response.redirect().back()
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    /**
     * Log domain errors at warn level; everything else at error level.
     * BookingDomainError is expected flow — warn, not error.
     */
    if (error instanceof BookingDomainError) {
      appLogger.warn({
        action: 'domain_error',
        route: ctx.request.url(),
        ip: ctx.request.ip(),
        userId: ctx.auth?.user?.id,
        extra: { message: error.message, status: error.status },
      })
      return
    }

    if (error instanceof Error) {
      appLogger.error({
        action: 'unhandled_error',
        route: ctx.request.url(),
        ip: ctx.request.ip(),
        userId: ctx.auth?.user?.id,
        error,
      })
      return
    }

    return super.report(error, ctx)
  }
}
