/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
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
  }
}
