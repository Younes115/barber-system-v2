import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { domainMessages } from '#i18n/messages'
import { appLogger } from '#services/logging_service'

/**
 * AdminMiddleware — coarse-grained RBAC guard.
 * Must be used *after* auth middleware so ctx.auth.user is already resolved.
 * Contains no business logic: it only reads the role and denies/allows.
 */
export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({ error: domainMessages['auth.unauthenticated'] })
    }

    if (!user.isAdmin) {
      appLogger.warn({
        action: 'admin.access_denied',
        userId: user.id,
        route: ctx.request.url(),
        ip: ctx.request.ip(),
      })
      /**
       * For Inertia (web) requests redirect to home so the user sees a friendly page.
       * API/JSON requests receive a 403 Forbidden response.
       */
      if (ctx.request.accepts(['html', 'json']) === 'json') {
        return ctx.response.forbidden({ error: domainMessages['auth.forbidden'] })
      }
      return ctx.response.redirect().toRoute('home')
    }

    return next()
  }
}
