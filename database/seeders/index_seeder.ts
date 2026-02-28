import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'

/**
 * Main seeder — orchestrates all seeders in dependency order.
 *
 * Usage:
 *   node ace db:seed                    # runs all seeders in database/seeders/
 *   node ace db:seed --files=database/seeders/index_seeder.ts   # runs this orchestrator only
 */
export default class extends BaseSeeder {
    async run() {
        await new (await import('#database/seeders/user_seeder')).default(app).run()
        await new (await import('#database/seeders/package_seeder')).default(app).run()
        await new (await import('#database/seeders/booking_seeder')).default(app).run()

        console.log('\n🎉 All seeders completed successfully!\n')
    }
}
