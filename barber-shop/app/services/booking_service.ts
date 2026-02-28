import Booking from '#models/booking'
import type User from '#models/user'
import bookingConfig from '#config/booking'
import { DateTime } from 'luxon'
import { domainMessages, t } from '#i18n/messages'
import { appLogger } from '#services/logging_service'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

export interface ServiceItem {
  name: string
  price: number
  packageId?: number
}

export interface CreateBookingPayload {
  user: User
  date: DateTime
  time: string
  services: ServiceItem[]
}

export interface UpdateBookingPayload {
  date?: DateTime
  time?: string
  services?: ServiceItem[]
}

// ─── Errors ─────────────────────────────────────────────────────────────────────

export class BookingDomainError extends Error {
  public status: number

  constructor(message: string, status = 422) {
    super(message)
    this.name = 'BookingDomainError'
    this.status = status
  }
}

// ─── Service ────────────────────────────────────────────────────────────────────

/**
 * BookingService — all booking business logic lives here.
 * Controllers only validate HTTP input and delegate to this service.
 */
export default class BookingService {
  // ─── User-side ──────────────────────────────────────────────────────────────

  /**
   * Create a booking for an authenticated user.
   * Validates future date/time and enforces slot capacity.
   */
  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const { user, date, time, services } = payload
    const appointmentDt = this.getAppointmentDateTime(date, time)
    const now = DateTime.now().setZone(bookingConfig.businessTimezone)

    if (appointmentDt <= now) {
      throw new BookingDomainError(domainMessages['booking.past_slot'])
    }

    await this.assertCapacity(date, time)

    const booking = await Booking.create({
      userId: user.id,
      name: user.fullName ?? user.phone,
      phone: user.phone,
      date: date,
      time,
      services: services as any,
      status: 'pending',
      overbooked: false,
    })

    appLogger.info({ action: 'booking.created', userId: user.id, bookingId: booking.id })
    return booking
  }

  /**
   * List bookings belonging to a user.
   * @param onlyUpcoming – if true, only future bookings are returned.
   */
  async listUserBookings(
    userId: number,
    opts: { onlyUpcoming?: boolean } = {}
  ): Promise<Booking[]> {
    const query = Booking.query().where('user_id', userId)

    if (opts.onlyUpcoming) {
      const today = DateTime.now().setZone(bookingConfig.businessTimezone).toFormat('yyyy-MM-dd')
      query.where('date', '>=', today)
    }

    return query.orderBy('date', 'asc').orderBy('time', 'asc')
  }

  /**
   * Fetch a single booking owned by the user, or throw 404.
   */
  async getUserBookingOrFail(userId: number, id: number): Promise<Booking> {
    return Booking.query().where('user_id', userId).where('id', id).firstOrFail()
  }

  /**
   * Update a booking on behalf of the user.
   * Enforces: ownership, status, modification-enabled flag, cutoff window, capacity.
   */
  async updateBookingForUser(
    userId: number,
    id: number,
    payload: UpdateBookingPayload
  ): Promise<Booking> {
    const booking = await this.getUserBookingOrFail(userId, id)
    const now = DateTime.now().setZone(bookingConfig.businessTimezone)

    this.assertModifiable(booking, now)

    // If date or time changed, re-check capacity for the new slot
    const newDate = payload.date ?? booking.date
    const newTime = payload.time ?? booking.time
    if (payload.date || payload.time) {
      const newAppointment = this.getAppointmentDateTime(newDate as DateTime, newTime)
      if (newAppointment <= now) {
        throw new BookingDomainError(domainMessages['booking.move_to_past'])
      }
      await this.assertCapacity(newDate as DateTime, newTime, booking.id)
    }

    if (payload.date) booking.date = payload.date
    if (payload.time) booking.time = payload.time
    if (payload.services) booking.services = payload.services as any
    await booking.save()

    appLogger.info({ action: 'booking.updated', userId: booking.userId, bookingId: booking.id })
    return booking
  }

  /**
   * Cancel a booking on behalf of the user.
   */
  async cancelBookingForUser(userId: number, id: number): Promise<Booking> {
    const booking = await this.getUserBookingOrFail(userId, id)
    const now = DateTime.now().setZone(bookingConfig.businessTimezone)

    this.assertModifiable(booking, now)

    booking.status = 'cancelled'
    await booking.save()

    appLogger.info({ action: 'booking.cancelled', userId: booking.userId, bookingId: booking.id })
    return booking
  }

  // ─── Admin ──────────────────────────────────────────────────────────────────

  /**
   * List bookings for a specific date (admin).
   */
  async listAdminBookingsForDate(
    date: DateTime,
    opts: { status?: BookingStatus } = {}
  ): Promise<Booking[]> {
    const dateStr = date.toFormat('yyyy-MM-dd')
    const query = Booking.query().where('date', dateStr).preload('user')

    if (opts.status) {
      query.where('status', opts.status)
    }

    return query.orderBy('time', 'asc')
  }

  /**
   * Convenience: today's bookings in business timezone.
   */
  async listAdminTodayBookings(): Promise<Booking[]> {
    const today = DateTime.now().setZone(bookingConfig.businessTimezone)
    return this.listAdminBookingsForDate(today)
  }

  /**
   * List all bookings with optional filters (admin).
   */
  async listAdminBookings(
    opts: { status?: BookingStatus; page?: number; limit?: number } = {}
  ): Promise<Booking[]> {
    const query = Booking.query().preload('user')

    if (opts.status) {
      query.where('status', opts.status)
    }

    return query.orderBy('date', 'desc').orderBy('time', 'desc')
  }

  /**
   * Fetch any booking by id (admin, no ownership check).
   */
  async getBookingOrFail(id: number): Promise<Booking> {
    return Booking.query().where('id', id).preload('user').firstOrFail()
  }

  /**
   * Update booking status (admin).
   * Enforces valid status transitions.
   */
  async updateBookingStatus(id: number, status: BookingStatus): Promise<Booking> {
    const booking = await this.getBookingOrFail(id)

    // Disallow re-opening completed or no-show bookings
    if (['completed', 'no_show'].includes(booking.status) && status === 'pending') {
      throw new BookingDomainError(domainMessages['booking.invalid_status_transition'])
    }

    booking.status = status
    await booking.save()

    appLogger.info({
      action: 'booking.status_updated',
      bookingId: booking.id,
      extra: { from: booking.status, to: status },
    })
    return booking
  }

  /**
   * Admin force-create a booking, optionally exceeding capacity.
   */
  async forceCreateBooking(payload: CreateBookingPayload): Promise<Booking> {
    const { user, date, time, services } = payload

    let overbooked = false
    if (bookingConfig.allowCapacityOverride) {
      // Check if slot is at capacity — if so, mark as overbooked but allow
      const count = await this.countBookingsForSlot(date, time)
      overbooked = count >= bookingConfig.defaultSlotCapacity
    } else {
      // Even admin respects capacity when override not allowed
      await this.assertCapacity(date, time)
    }

    const booking = await Booking.create({
      userId: user.id,
      name: user.fullName ?? user.phone,
      phone: user.phone,
      date: date,
      time,
      services: services as any,
      status: 'confirmed',
      overbooked,
    })

    appLogger.warn({
      action: 'booking.force_created',
      userId: user.id,
      bookingId: booking.id,
      extra: { overbooked },
    })
    return booking
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  /**
   * Count non-cancelled bookings for a specific date + time slot.
   */
  private async countBookingsForSlot(
    date: DateTime,
    time: string,
    excludeId?: number
  ): Promise<number> {
    const dateStr =
      date instanceof DateTime ? date.toFormat('yyyy-MM-dd') : String(date).slice(0, 10)

    const query = Booking.query()
      .where('date', dateStr)
      .where('time', time)
      .whereNotIn('status', ['cancelled'])

    if (excludeId) {
      query.whereNot('id', excludeId)
    }

    const result = await query.count('* as total')
    return Number(result[0].$extras.total)
  }

  /**
   * Throw if the slot is already at capacity.
   */
  private async assertCapacity(date: DateTime, time: string, excludeId?: number): Promise<void> {
    const count = await this.countBookingsForSlot(date, time, excludeId)
    if (count >= bookingConfig.defaultSlotCapacity) {
      throw new BookingDomainError(domainMessages['booking.slot_full'])
    }
  }

  /**
   * Combine date + time into a DateTime in the business timezone.
   */
  private getAppointmentDateTime(date: DateTime, time: string): DateTime {
    const dateStr =
      date instanceof DateTime ? date.toFormat('yyyy-MM-dd') : String(date).slice(0, 10)

    return DateTime.fromISO(`${dateStr}T${time}`, {
      zone: bookingConfig.businessTimezone,
    })
  }

  /**
   * Check that a booking can be modified: right status, within cutoff, modifications enabled.
   */
  private assertModifiable(booking: Booking, now: DateTime): void {
    if (!bookingConfig.modificationEnabled) {
      throw new BookingDomainError(domainMessages['booking.modifications_disabled'], 403)
    }

    if (['cancelled', 'completed', 'no_show'].includes(booking.status)) {
      throw new BookingDomainError(domainMessages['booking.not_modifiable'])
    }

    const hoursUntil = booking.appointmentDateTime.diff(now, 'hours').hours
    if (hoursUntil < bookingConfig.modificationCutoffHours) {
      throw new BookingDomainError(
        t(domainMessages['booking.cutoff_passed'], {
          hours: bookingConfig.modificationCutoffHours,
        })
      )
    }
  }
}
