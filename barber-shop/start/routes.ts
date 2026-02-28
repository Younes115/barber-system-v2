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

router.on('/').renderInertia('home', {}).as('home')

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
  })
  .prefix('admin')
  .as('admin')
  .use(middleware.auth())
  .use(middleware.admin())
