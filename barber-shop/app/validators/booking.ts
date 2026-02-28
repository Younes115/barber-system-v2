import vine from '@vinejs/vine'

/**
 * Validator for creating a new booking (user-facing).
 *
 * `name` and `phone` are NOT accepted from the client — they
 * are derived from the authenticated user in BookingService.
 */
export const createBookingValidator = vine.create({
  date: vine.date({ formats: ['YYYY-MM-DD'] }),
  time: vine
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .trim(),
  services: vine
    .array(
      vine.object({
        name: vine.string().trim().minLength(1).maxLength(150),
        price: vine.number().positive(),
        packageId: vine.number().positive().optional(),
      })
    )
    .minLength(1),
})

/**
 * Validator for updating an existing booking (user-facing).
 * All fields are optional to support partial updates.
 * `name` and `phone` cannot be changed by the user.
 */
export const updateBookingValidator = vine.create({
  date: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
  time: vine
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .trim()
    .optional(),
  services: vine
    .array(
      vine.object({
        name: vine.string().trim().minLength(1).maxLength(150),
        price: vine.number().positive(),
        packageId: vine.number().positive().optional(),
      })
    )
    .minLength(1)
    .optional(),
})

/**
 * Validator for admin status updates.
 */
export const updateBookingStatusValidator = vine.create({
  status: vine.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']),
})
