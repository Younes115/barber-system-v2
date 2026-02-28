import User from '#models/user'
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

    await ctx.auth.use('web').login(user)
    return user
  }

  /**
   * Verify credentials and log the user in.
   * Optionally create a remember-me token.
   */
  async login(ctx: HttpContext, payload: LoginPayload): Promise<User> {
    const user = await User.verifyCredentials(payload.phone, payload.password)

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
}
