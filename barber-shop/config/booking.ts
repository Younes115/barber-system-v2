/**
 * Booking configuration.
 *
 * Controls capacity limits, modification rules, and timezone for
 * the booking domain. Values can be overridden via environment
 * variables when needed.
 */

import env from '#start/env'

const bookingConfig = {
  /**
   * Maximum number of bookings allowed per date + time slot.
   * Admin can override this via forceCreate if allowCapacityOverride is true.
   */
  defaultSlotCapacity: Number(env.get('BOOKING_SLOT_CAPACITY', '2')),

  /**
   * Minimum hours before appointment time that a user can still modify/cancel.
   * E.g. 24 means users must modify at least 24 h before the appointment.
   */
  modificationCutoffHours: Number(env.get('BOOKING_MODIFICATION_CUTOFF_HOURS', '24')),

  /**
   * Master switch to enable/disable user-side booking modifications.
   */
  modificationEnabled: true,

  /**
   * Whether admin can create bookings that exceed slot capacity.
   */
  allowCapacityOverride: true,

  /**
   * IANA timezone used for all date/time comparisons (working hours,
   * "today", cutoff calculations).
   */
  businessTimezone: 'Africa/Cairo',
}

export default bookingConfig
