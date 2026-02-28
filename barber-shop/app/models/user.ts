import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Booking from '#models/booking'

const AuthFinder = withAuthFinder(hash, {
  uids: ['phone'],
  passwordColumnName: 'password',
})

export default class User extends compose(UserSchema, AuthFinder) {
  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  @hasMany(() => Booking)
  declare bookings: HasMany<typeof Booking>

  get isAdmin() {
    return this.role === 'admin'
  }

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : [this.phone]
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
