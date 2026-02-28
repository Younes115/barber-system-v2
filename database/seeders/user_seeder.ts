import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('phone', [
      // ── Admin ─────────────────────────────────────────────────────────────
      {
        fullName: 'يونس أحمد',
        phone: '01012345678',
        email: 'admin@barber.test',
        password: 'password123',
        role: 'admin',
      },

      // ── Regular users ─────────────────────────────────────────────────────
      {
        fullName: 'أحمد محمد',
        phone: '01112345678',
        email: null,
        password: 'password123',
        role: 'user',
      },
      {
        fullName: 'محمد علي',
        phone: '01212345678',
        email: null,
        password: 'password123',
        role: 'user',
      },
      {
        fullName: 'عمر حسن',
        phone: '01512345678',
        email: null,
        password: 'password123',
        role: 'user',
      },
      {
        fullName: 'خالد إبراهيم',
        phone: '01098765432',
        email: null,
        password: 'password123',
        role: 'user',
      },
      {
        fullName: 'ياسر سعيد',
        phone: '01198765432',
        email: null,
        password: 'password123',
        role: 'user',
      },
      {
        fullName: 'كريم طارق',
        phone: '01298765432',
        email: null,
        password: 'password123',
        role: 'user',
      },
      {
        fullName: 'مصطفى حسين',
        phone: '01598765432',
        email: null,
        password: 'password123',
        role: 'user',
      },
    ])
  }
}