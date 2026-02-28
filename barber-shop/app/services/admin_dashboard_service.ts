import Booking from '#models/booking'
import Package from '#models/package'
import User from '#models/user'
import bookingConfig from '#config/booking'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface DashboardMetrics {
  /** Counts */
  todayBookingsCount: number
  upcomingBookingsCount: number
  completedBookingsCount: number
  cancelledBookingsCount: number
  totalUsersCount: number
  totalPackagesCount: number
  overbookedTodayCount: number

  /** Revenue (sum of service prices from bookings) */
  todayRevenue: number
  weekRevenue: number
  monthRevenue: number

  /** Config snapshot (read-only for admin view) */
  config: {
    slotCapacity: number
    modificationCutoffHours: number
    modificationEnabled: boolean
    allowCapacityOverride: boolean
    timezone: string
  }
}

// ─── Service ────────────────────────────────────────────────────────────────────

/**
 * AdminDashboardService — read-only metrics for the admin dashboard.
 * Keeps AdminController thin and centralises all aggregation queries.
 */
export default class AdminDashboardService {
  /**
   * Compute all dashboard metrics in a single method call.
   * Uses raw aggregate queries where possible for efficiency.
   */
  async getMetrics(): Promise<DashboardMetrics> {
    const tz = bookingConfig.businessTimezone
    const now = DateTime.now().setZone(tz)
    const todayStr = now.toFormat('yyyy-MM-dd')
    const weekAgoStr = now.minus({ days: 7 }).toFormat('yyyy-MM-dd')
    const monthStartStr = now.startOf('month').toFormat('yyyy-MM-dd')

    // ── Counts ──────────────────────────────────────────────────────────────
    const [
      todayBookingsCount,
      upcomingBookingsCount,
      completedBookingsCount,
      cancelledBookingsCount,
      overbookedTodayCount,
      totalUsersCount,
      totalPackagesCount,
    ] = await Promise.all([
      this.countBookings({ dateEqual: todayStr }),
      this.countBookings({ dateGte: todayStr, excludeStatuses: ['cancelled', 'no_show'] }),
      this.countBookings({ status: 'completed' }),
      this.countBookings({ status: 'cancelled' }),
      this.countBookings({ dateEqual: todayStr, overbooked: true }),
      User.query()
        .count('* as total')
        .first()
        .then((r) => Number(r?.$extras.total ?? 0)),
      Package.query()
        .count('* as total')
        .first()
        .then((r) => Number(r?.$extras.total ?? 0)),
    ])

    // ── Revenue ─────────────────────────────────────────────────────────────
    const [todayRevenue, weekRevenue, monthRevenue] = await Promise.all([
      this.sumRevenue({ dateEqual: todayStr }),
      this.sumRevenue({ dateGte: weekAgoStr }),
      this.sumRevenue({ dateGte: monthStartStr }),
    ])

    return {
      todayBookingsCount,
      upcomingBookingsCount,
      completedBookingsCount,
      cancelledBookingsCount,
      totalUsersCount,
      totalPackagesCount,
      overbookedTodayCount,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      config: {
        slotCapacity: bookingConfig.defaultSlotCapacity,
        modificationCutoffHours: bookingConfig.modificationCutoffHours,
        modificationEnabled: bookingConfig.modificationEnabled,
        allowCapacityOverride: bookingConfig.allowCapacityOverride,
        timezone: bookingConfig.businessTimezone,
      },
    }
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  /**
   * Generic booking count with flexible filters.
   */
  private async countBookings(
    opts: {
      dateEqual?: string
      dateGte?: string
      status?: string
      excludeStatuses?: string[]
      overbooked?: boolean
    } = {}
  ): Promise<number> {
    const query = Booking.query()
    if (opts.dateEqual) query.where('date', opts.dateEqual)
    if (opts.dateGte) query.where('date', '>=', opts.dateGte)
    if (opts.status) query.where('status', opts.status)
    if (opts.excludeStatuses?.length) query.whereNotIn('status', opts.excludeStatuses)
    if (opts.overbooked !== undefined) query.where('overbooked', opts.overbooked)

    const result = await query.count('* as total')
    return Number(result[0].$extras.total)
  }

  /**
   * Sum total price of services across bookings for a date range.
   * Uses a raw Postgres JSONB aggregate: extracts the 'price' key from
   * each element of services_json and sums them.
   *
   * Bookings with status='cancelled' are excluded from revenue.
   */
  private async sumRevenue(opts: { dateEqual?: string; dateGte?: string } = {}): Promise<number> {
    let query = db.from('bookings').whereNot('status', 'cancelled').whereNot('status', 'no_show')

    if (opts.dateEqual) query = query.where('date', opts.dateEqual)
    if (opts.dateGte) query = query.where('date', '>=', opts.dateGte)

    const result = await query
      .select(db.raw(`COALESCE(SUM((elem->>'price')::numeric), 0) as total`))
      .joinRaw(`, jsonb_array_elements(services_json) as elem`)

    return Number(result[0]?.total ?? 0)
  }
}
