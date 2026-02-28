import AuthService from '#services/auth_service'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  private authService = new AuthService()

  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(loginValidator)
    await this.authService.login(ctx, payload)
    ctx.response.redirect().toRoute('home')
  }

  async destroy(ctx: HttpContext) {
    await this.authService.logout(ctx)
    ctx.response.redirect().toRoute('session.create')
  }
}
