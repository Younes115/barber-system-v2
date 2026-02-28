import { BookingSchema } from '#database/schema'
import User from '#models/user'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import bookingConfig from '#config/booking'

/**
 * Booking model.
 * All business logic (capacity, cutoff, status transitions) lives
 * in BookingService — this model exposes only domain helpers.
 */
export default class Booking extends BookingSchema {
  @column({
    prepare: (value: any) => (typeof value === 'string' ? value : JSON.stringify(value)),
    consume: (value: any) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare servicesJson: any

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  /**
   * Combine date + time into a single DateTime in the business timezone.
   */
  get appointmentDateTime(): DateTime {
    const dateStr =
      this.date instanceof DateTime
        ? this.date.toFormat('yyyy-MM-dd')
        : String(this.date).slice(0, 10)

    return DateTime.fromISO(`${dateStr}T${this.time}`, {
      zone: bookingConfig.businessTimezone,
    })
  }

  /**
   * Whether the appointment time is in the past.
   */
  get isPast(): boolean {
    return this.appointmentDateTime < DateTime.now().setZone(bookingConfig.businessTimezone)
  }

  /**
   * Whether the booking can still be modified by the user
   * (not past, not cancelled/completed, within cutoff window).
   */
  get isEditable(): boolean {
    if (['cancelled', 'completed', 'no_show'].includes(this.status)) return false
    const now = DateTime.now().setZone(bookingConfig.businessTimezone)
    const hoursUntil = this.appointmentDateTime.diff(now, 'hours').hours
    return hoursUntil >= bookingConfig.modificationCutoffHours
  }
}
