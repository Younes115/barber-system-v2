import { PackageSchema } from '#database/schema'

/**
 * Package model.
 * All business logic (create, update, delete, validation) lives
 * in PackageService — this model exposes only domain helpers.
 */
export default class Package extends PackageSchema {
  /**
   * Price formatted to 2 decimal places for display.
   * Note: PostgreSQL returns decimal columns as strings via the `pg` driver;
   * the getter coerces to a fixed-precision number string.
   */
  get formattedPrice() {
    return this.price.toFixed(2)
  }
}
