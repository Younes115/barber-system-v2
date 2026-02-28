import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export class UserSchema extends BaseModel {
  static $columns = [
    'id',
    'fullName',
    'phone',
    'email',
    'password',
    'role',
    'createdAt',
    'updatedAt',
  ] as const
  $columns = UserSchema.$columns

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare phone: string

  @column()
  declare email: string | null

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'user' | 'admin'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
