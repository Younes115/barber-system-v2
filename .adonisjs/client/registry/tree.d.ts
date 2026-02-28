/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  contact: typeof routes['contact']
  health: typeof routes['health']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  profile: {
    show: typeof routes['profile.show']
  }
  bookings: {
    create: typeof routes['bookings.create']
    store: typeof routes['bookings.store']
    index: typeof routes['bookings.index']
    show: typeof routes['bookings.show']
    edit: typeof routes['bookings.edit']
    update: typeof routes['bookings.update']
    destroy: typeof routes['bookings.destroy']
  }
  packages: {
    index: typeof routes['packages.index']
  }
  admin: {
    packages: {
      index: typeof routes['admin.packages.index']
      create: typeof routes['admin.packages.create']
      store: typeof routes['admin.packages.store']
      edit: typeof routes['admin.packages.edit']
      update: typeof routes['admin.packages.update']
      destroy: typeof routes['admin.packages.destroy']
    }
    dashboard: typeof routes['admin.dashboard']
    bookings: {
      index: typeof routes['admin.bookings.index']
      today: typeof routes['admin.bookings.today']
      show: typeof routes['admin.bookings.show']
      updateStatus: typeof routes['admin.bookings.update_status']
      forceCreate: typeof routes['admin.bookings.force_create']
    }
  }
}
