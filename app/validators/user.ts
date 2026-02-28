import vine from '@vinejs/vine'

/**
 * Egyptian phone number: 01[0125] followed by 8 digits → total 11 digits.
 */
const phone = () => vine.string().regex(/^01[0125]\d{8}$/)

/**
 * Password: 8–32 chars.
 */
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator for self-signup (phone-based).
 */
export const signupValidator = vine.compile(
  vine.object({
    fullName: vine.string().nullable(),
    phone: phone().unique({ table: 'users', column: 'phone' }),
    password: password().confirmed({
      confirmationField: 'passwordConfirmation',
    }),
  })
)

/**
 * Validator for login.
 */
export const loginValidator = vine.compile(
  vine.object({
    phone: phone(),
    password: vine.string(),
    rememberMe: vine.boolean().optional(),
  })
)
