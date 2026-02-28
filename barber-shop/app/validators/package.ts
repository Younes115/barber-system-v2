import vine from '@vinejs/vine'

/**
 * Validator for creating a new service package.
 */
export const createPackageValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(150).trim(),
    description: vine.string().minLength(1).maxLength(1000).trim(),
    price: vine.number().positive(),
  })
)

/**
 * Validator for updating an existing service package.
 * All fields are optional to support partial updates.
 */
export const updatePackageValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(150).trim().optional(),
    description: vine.string().minLength(1).maxLength(1000).trim().optional(),
    price: vine.number().positive().optional(),
  })
)
