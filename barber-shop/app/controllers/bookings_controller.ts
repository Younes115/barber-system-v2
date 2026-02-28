import BookingService from '#services/booking_service'
import {
  createBookingValidator,
  updateBookingValidator,
  updateBookingStatusValidator,
} from '#validators/booking'
import type { HttpContext } from '@adonisjs/core/http'
import { type DateTime } from 'luxon'

/**
 * BookingsController — thin HTTP/Inertia bridge.
 * No business logic here; all booking rules live in BookingService.
 */
export default class BookingsController {
  private bookingService = new BookingService()

  // ─── User Endpoints ─────────────────────────────────────────────────────────

  /**
   * POST /bookings — create a new booking for the authenticated user.
   */
  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createBookingValidator)
    const user = ctx.auth.getUserOrFail()

    await this.bookingService.createBooking({
      user,
      date: payload.date as DateTime,
      time: payload.time,
      services: payload.services,
    })

    ctx.session.flash('success', 'Booking created successfully')
    return ctx.response.redirect().toRoute('bookings.index')
  }

  /**
   * GET /bookings — list bookings for the authenticated user.
   */
  async index(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const bookings = await this.bookingService.listUserBookings(user.id)
    return ctx.inertia.render('bookings/index' as any, { bookings })
  }

  /**
   * GET /bookings/:id — show booking details for the authenticated user.
   */
  async show(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const booking = await this.bookingService.getUserBookingOrFail(user.id, Number(ctx.params.id))
    return ctx.inertia.render('bookings/show' as any, { booking: booking.toJSON() })
  }

  /**
   * GET /bookings/:id/edit — render edit form for the authenticated user.
   */
  async edit(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const booking = await this.bookingService.getUserBookingOrFail(user.id, Number(ctx.params.id))
    return ctx.inertia.render('bookings/edit' as any, { booking: booking.toJSON() })
  }

  /**
   * PUT /bookings/:id — update booking for the authenticated user.
   */
  async update(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const payload = await ctx.request.validateUsing(updateBookingValidator)

    await this.bookingService.updateBookingForUser(user.id, Number(ctx.params.id), {
      date: payload.date as DateTime | undefined,
      time: payload.time,
      services: payload.services,
    })

    ctx.session.flash('success', 'Booking updated successfully')
    return ctx.response.redirect().toRoute('bookings.show', [ctx.params.id])
  }

  /**
   * DELETE /bookings/:id — cancel booking for the authenticated user.
   */
  async destroy(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    await this.bookingService.cancelBookingForUser(user.id, Number(ctx.params.id))
    ctx.session.flash('success', 'Booking cancelled successfully')
    return ctx.response.redirect().toRoute('bookings.index')
  }

  // ─── Admin Endpoints ────────────────────────────────────────────────────────

  /**
   * GET /admin/bookings — list all bookings (admin).
   */
  async adminIndex(ctx: HttpContext) {
    const status = ctx.request.input('status')
    const bookings = await this.bookingService.listAdminBookings({ status })
    return ctx.inertia.render('admin/bookings/index' as any, { bookings })
  }

  /**
   * GET /admin/bookings/today — list today's bookings (admin).
   */
  async adminToday(ctx: HttpContext) {
    const bookings = await this.bookingService.listAdminTodayBookings()
    return ctx.inertia.render('admin/bookings/today' as any, { bookings })
  }

  /**
   * GET /admin/bookings/:id — show any booking details (admin).
   */
  async adminShow(ctx: HttpContext) {
    const booking = await this.bookingService.getBookingOrFail(Number(ctx.params.id))
    return ctx.inertia.render('admin/bookings/show' as any, { booking: booking.toJSON() })
  }

  /**
   * PUT /admin/bookings/:id/status — update booking status (admin).
   */
  async updateStatus(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(updateBookingStatusValidator)
    await this.bookingService.updateBookingStatus(Number(ctx.params.id), payload.status)
    ctx.session.flash('success', 'Booking status updated')
    return ctx.response.redirect().toRoute('admin.bookings.show', [ctx.params.id])
  }

  /**
   * POST /admin/bookings/force-create — create booking bypassing capacity (admin).
   */
  async forceCreate(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createBookingValidator)
    const user = ctx.auth.getUserOrFail()

    await this.bookingService.forceCreateBooking({
      user,
      date: payload.date as DateTime,
      time: payload.time,
      services: payload.services,
    })

    ctx.session.flash('success', 'Booking force-created successfully')
    return ctx.response.redirect().toRoute('admin.bookings.index')
  }
}
