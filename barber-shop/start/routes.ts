/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'

router.on('/').renderInertia('home', {}).as('home')

// ─── Health check (public) ──────────────────────────────────────────────────
router
  .get('health', async ({ response }) => {
    let dbOk = false
    try {
      await db.rawQuery('SELECT 1')
      dbOk = true
    } catch {}
    return response.ok({
      status: dbOk ? 'ok' : 'degraded',
      db: dbOk,
      timestamp: new Date().toISOString(),
    })
  })
  .as('health')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create']).as('new_account.create')
    router.post('signup', [controllers.NewAccount, 'store']).as('new_account.store')

    router.get('login', [controllers.Session, 'create']).as('session.create')
    router.post('login', [controllers.Session, 'store']).as('session.store')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy']).as('session.destroy')
    router.get('profile', [controllers.Profile, 'show']).as('profile.show')

    // Bookings — authenticated user
    router.post('bookings', [controllers.Bookings, 'store']).as('bookings.store')
    router.get('bookings', [controllers.Bookings, 'index']).as('bookings.index')
    router.get('bookings/:id', [controllers.Bookings, 'show']).as('bookings.show')
    router.get('bookings/:id/edit', [controllers.Bookings, 'edit']).as('bookings.edit')
    router.put('bookings/:id', [controllers.Bookings, 'update']).as('bookings.update')
    router.delete('bookings/:id', [controllers.Bookings, 'destroy']).as('bookings.destroy')
  })
  .use(middleware.auth())

// Public packages listing — no auth required
router.get('packages', [controllers.Packages, 'index']).as('packages.index')

// Admin-only routes — requires both auth and admin middleware
router
  .group(() => {
    router.get('packages', [controllers.Packages, 'adminIndex']).as('packages.index')
    router.get('packages/create', [controllers.Packages, 'create']).as('packages.create')
    router.post('packages', [controllers.Packages, 'store']).as('packages.store')
    router.get('packages/:id/edit', [controllers.Packages, 'edit']).as('packages.edit')
    router.put('packages/:id', [controllers.Packages, 'update']).as('packages.update')
    router.delete('packages/:id', [controllers.Packages, 'destroy']).as('packages.destroy')

    // Dashboard
    router.get('dashboard', [controllers.Admin, 'dashboard']).as('dashboard')

    // Bookings — admin
    router.get('bookings', [controllers.Bookings, 'adminIndex']).as('bookings.index')
    router.get('bookings/today', [controllers.Bookings, 'adminToday']).as('bookings.today')
    router.get('bookings/:id', [controllers.Bookings, 'adminShow']).as('bookings.show')
    router
      .put('bookings/:id/status', [controllers.Bookings, 'updateStatus'])
      .as('bookings.update_status')
    router
      .post('bookings/force-create', [controllers.Bookings, 'forceCreate'])
      .as('bookings.force_create')
  })
  .prefix('admin')
  .as('admin')
  .use(middleware.auth())
  .use(middleware.admin())
