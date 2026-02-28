import User from '#models/user'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'

interface SignupPayload {
  fullName: string | null
  phone: string
  password: string
}

interface LoginPayload {
  phone: string
  password: string
  rememberMe?: boolean
}

export default class AuthService {
  /**
   * Register a new user and log them in.
   */
  async signup(ctx: HttpContext, payload: SignupPayload): Promise<User> {
    const user = await User.create({
      fullName: payload.fullName,
      phone: payload.phone,
      password: payload.password,
      role: 'user',
    })

    await this.ensureAdminRole(user, payload.phone)
    await ctx.auth.use('web').login(user)
    return user
  }

  /**
   * Verify credentials and log the user in.
   * Optionally create a remember-me token.
   */
  async login(ctx: HttpContext, payload: LoginPayload): Promise<User> {
    const user = await User.verifyCredentials(payload.phone, payload.password)

    await this.ensureAdminRole(user, payload.phone)
    await ctx.auth.use('web').login(user, payload.rememberMe ?? false)
    return user
  }

  /**
   * Log the current user out.
   */
  async logout(ctx: HttpContext): Promise<void> {
    await ctx.auth.use('web').logout()
  }

  /**
   * Return the currently authenticated user's profile data.
   */
  async getProfile(ctx: HttpContext): Promise<User> {
    return ctx.auth.getUserOrFail()
  }

  /**
   * If ADMIN_PHONE is configured and matches `phone`, promote the user to admin.
   * Called on both signup and login, so:
   * - new users with that phone become admin immediately,
   * - existing users are upgraded on their next login (catch-up path).
   * Does nothing when ADMIN_PHONE is unset.
   */
  private async ensureAdminRole(user: User, phone: string): Promise<void> {
    const adminPhone = env.get('ADMIN_PHONE')
    if (!adminPhone || user.role === 'admin') return
    if (phone === adminPhone) {
      user.role = 'admin'
      await user.save()
    }
  }
}
