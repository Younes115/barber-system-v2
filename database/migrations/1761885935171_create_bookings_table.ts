import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('name', 100).notNullable()
      table.string('phone', 20).notNullable()
      table.date('date').notNullable()
      table.string('time', 5).notNullable()
      table.jsonb('services_json').notNullable()
      table.string('status', 20).notNullable().defaultTo('pending')
      table.boolean('overbooked').notNullable().defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Indexes for performance
      table.index(['user_id', 'created_at'], 'idx_bookings_user_created')
      table.index(['date', 'time'], 'idx_bookings_date_time')
      table.index(['status', 'date'], 'idx_bookings_status_date')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
