import AuthService from '#services/auth_service'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  private authService = new AuthService()

  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(signupValidator)
    await this.authService.signup(ctx, payload)
    ctx.response.redirect().toRoute('home')
  }
}
