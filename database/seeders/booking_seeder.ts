import Booking from '#models/booking'
import User from '#models/user'
import Package from '#models/package'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  /**
   * Depends on UserSeeder and PackageSeeder running first.
   */
  static environment = ['development', 'testing']

  async run() {
    const users = await User.query().where('role', 'user')
    const packages = await Package.all()

    if (users.length === 0 || packages.length === 0) {
      console.log('⚠ Skipping BookingSeeder — run UserSeeder and PackageSeeder first')
      return
    }

    const tz = 'Africa/Cairo'
    const now = DateTime.now().setZone(tz)
    const today = now.toFormat('yyyy-MM-dd')

    const timeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '13:00', '13:30', '14:00', '15:00', '15:30',
      '16:00', '17:00', '17:30', '18:00', '19:00', '19:30',
    ]

    function pick<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)]
    }

    function pickServices(count: number) {
      const shuffled = [...packages].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, count).map((p) => ({
        name: p.name,
        price: Number(p.price),
        packageId: p.id,
      }))
    }

    const bookings: Array<{
      userId: number
      name: string
      phone: string
      date: DateTime
      time: string
      servicesJson: any
      status: string
      overbooked: boolean
    }> = []

    // ── Past bookings (completed / cancelled / no_show) ─────────────────
    for (let daysAgo = 1; daysAgo <= 14; daysAgo++) {
      const date = now.minus({ days: daysAgo })
      const numBookings = Math.floor(Math.random() * 3) + 1

      for (let b = 0; b < numBookings; b++) {
        const user = pick(users)
        const status = pick(['completed', 'completed', 'completed', 'cancelled', 'no_show'])
        bookings.push({
          userId: user.id,
          name: user.fullName ?? user.phone,
          phone: user.phone,
          date: date,
          time: pick(timeSlots),
          servicesJson: JSON.stringify(pickServices(Math.floor(Math.random() * 2) + 1)),
          status,
          overbooked: false,
        })
      }
    }

    // ── Today's bookings ────────────────────────────────────────────────
    const todayUsers = users.slice(0, Math.min(5, users.length))
    const todayTimes = ['09:30', '10:30', '12:00', '14:00', '16:30', '18:00']
    const todayStatuses = ['pending', 'confirmed', 'confirmed', 'pending', 'confirmed', 'pending']
    for (let i = 0; i < Math.min(todayUsers.length, todayTimes.length); i++) {
      const user = todayUsers[i]
      bookings.push({
        userId: user.id,
        name: user.fullName ?? user.phone,
        phone: user.phone,
        date: now,
        time: todayTimes[i],
        servicesJson: JSON.stringify(pickServices(Math.floor(Math.random() * 2) + 1)),
        status: todayStatuses[i],
        overbooked: i === 4, // one overbooked for admin visibility
      })
    }

    // ── Upcoming bookings (next 1–7 days) ───────────────────────────────
    for (let daysAhead = 1; daysAhead <= 7; daysAhead++) {
      const date = now.plus({ days: daysAhead })
      // Skip Fridays (day 5 in Luxon)
      if (date.weekday === 5) continue

      const numBookings = Math.floor(Math.random() * 3) + 1
      for (let b = 0; b < numBookings; b++) {
        const user = pick(users)
        bookings.push({
          userId: user.id,
          name: user.fullName ?? user.phone,
          phone: user.phone,
          date: date,
          time: pick(timeSlots),
          servicesJson: JSON.stringify(pickServices(Math.floor(Math.random() * 3) + 1)),
          status: pick(['pending', 'confirmed']),
          overbooked: false,
        })
      }
    }

    await Booking.createMany(bookings)

    console.log(`✓ Seeded ${bookings.length} bookings`)
  }
}