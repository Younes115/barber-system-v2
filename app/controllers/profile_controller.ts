import AuthService from '#services/auth_service'
import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  private authService = new AuthService()

  async show(ctx: HttpContext) {
    const user = await this.authService.getProfile(ctx)
    return ctx.inertia.render('profile' as any, {
      user: UserTransformer.transform(user),
    })
  }
}
