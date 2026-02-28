/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'health': {
    methods: ["GET","HEAD"],
    pattern: '/health',
    tokens: [{"old":"/health","type":0,"val":"health","end":""}],
    types: placeholder as Registry['health']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.show']['types'],
  },
  'bookings.store': {
    methods: ["POST"],
    pattern: '/bookings',
    tokens: [{"old":"/bookings","type":0,"val":"bookings","end":""}],
    types: placeholder as Registry['bookings.store']['types'],
  },
  'bookings.index': {
    methods: ["GET","HEAD"],
    pattern: '/bookings',
    tokens: [{"old":"/bookings","type":0,"val":"bookings","end":""}],
    types: placeholder as Registry['bookings.index']['types'],
  },
  'bookings.show': {
    methods: ["GET","HEAD"],
    pattern: '/bookings/:id',
    tokens: [{"old":"/bookings/:id","type":0,"val":"bookings","end":""},{"old":"/bookings/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['bookings.show']['types'],
  },
  'bookings.edit': {
    methods: ["GET","HEAD"],
    pattern: '/bookings/:id/edit',
    tokens: [{"old":"/bookings/:id/edit","type":0,"val":"bookings","end":""},{"old":"/bookings/:id/edit","type":1,"val":"id","end":""},{"old":"/bookings/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['bookings.edit']['types'],
  },
  'bookings.update': {
    methods: ["PUT"],
    pattern: '/bookings/:id',
    tokens: [{"old":"/bookings/:id","type":0,"val":"bookings","end":""},{"old":"/bookings/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['bookings.update']['types'],
  },
  'bookings.destroy': {
    methods: ["DELETE"],
    pattern: '/bookings/:id',
    tokens: [{"old":"/bookings/:id","type":0,"val":"bookings","end":""},{"old":"/bookings/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['bookings.destroy']['types'],
  },
  'packages.index': {
    methods: ["GET","HEAD"],
    pattern: '/packages',
    tokens: [{"old":"/packages","type":0,"val":"packages","end":""}],
    types: placeholder as Registry['packages.index']['types'],
  },
  'admin.packages.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/packages',
    tokens: [{"old":"/admin/packages","type":0,"val":"admin","end":""},{"old":"/admin/packages","type":0,"val":"packages","end":""}],
    types: placeholder as Registry['admin.packages.index']['types'],
  },
  'admin.packages.create': {
    methods: ["GET","HEAD"],
    pattern: '/admin/packages/create',
    tokens: [{"old":"/admin/packages/create","type":0,"val":"admin","end":""},{"old":"/admin/packages/create","type":0,"val":"packages","end":""},{"old":"/admin/packages/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['admin.packages.create']['types'],
  },
  'admin.packages.store': {
    methods: ["POST"],
    pattern: '/admin/packages',
    tokens: [{"old":"/admin/packages","type":0,"val":"admin","end":""},{"old":"/admin/packages","type":0,"val":"packages","end":""}],
    types: placeholder as Registry['admin.packages.store']['types'],
  },
  'admin.packages.edit': {
    methods: ["GET","HEAD"],
    pattern: '/admin/packages/:id/edit',
    tokens: [{"old":"/admin/packages/:id/edit","type":0,"val":"admin","end":""},{"old":"/admin/packages/:id/edit","type":0,"val":"packages","end":""},{"old":"/admin/packages/:id/edit","type":1,"val":"id","end":""},{"old":"/admin/packages/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['admin.packages.edit']['types'],
  },
  'admin.packages.update': {
    methods: ["PUT"],
    pattern: '/admin/packages/:id',
    tokens: [{"old":"/admin/packages/:id","type":0,"val":"admin","end":""},{"old":"/admin/packages/:id","type":0,"val":"packages","end":""},{"old":"/admin/packages/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.packages.update']['types'],
  },
  'admin.packages.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/packages/:id',
    tokens: [{"old":"/admin/packages/:id","type":0,"val":"admin","end":""},{"old":"/admin/packages/:id","type":0,"val":"packages","end":""},{"old":"/admin/packages/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.packages.destroy']['types'],
  },
  'admin.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/admin/dashboard',
    tokens: [{"old":"/admin/dashboard","type":0,"val":"admin","end":""},{"old":"/admin/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['admin.dashboard']['types'],
  },
  'admin.bookings.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/bookings',
    tokens: [{"old":"/admin/bookings","type":0,"val":"admin","end":""},{"old":"/admin/bookings","type":0,"val":"bookings","end":""}],
    types: placeholder as Registry['admin.bookings.index']['types'],
  },
  'admin.bookings.today': {
    methods: ["GET","HEAD"],
    pattern: '/admin/bookings/today',
    tokens: [{"old":"/admin/bookings/today","type":0,"val":"admin","end":""},{"old":"/admin/bookings/today","type":0,"val":"bookings","end":""},{"old":"/admin/bookings/today","type":0,"val":"today","end":""}],
    types: placeholder as Registry['admin.bookings.today']['types'],
  },
  'admin.bookings.show': {
    methods: ["GET","HEAD"],
    pattern: '/admin/bookings/:id',
    tokens: [{"old":"/admin/bookings/:id","type":0,"val":"admin","end":""},{"old":"/admin/bookings/:id","type":0,"val":"bookings","end":""},{"old":"/admin/bookings/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.bookings.show']['types'],
  },
  'admin.bookings.update_status': {
    methods: ["PUT"],
    pattern: '/admin/bookings/:id/status',
    tokens: [{"old":"/admin/bookings/:id/status","type":0,"val":"admin","end":""},{"old":"/admin/bookings/:id/status","type":0,"val":"bookings","end":""},{"old":"/admin/bookings/:id/status","type":1,"val":"id","end":""},{"old":"/admin/bookings/:id/status","type":0,"val":"status","end":""}],
    types: placeholder as Registry['admin.bookings.update_status']['types'],
  },
  'admin.bookings.force_create': {
    methods: ["POST"],
    pattern: '/admin/bookings/force-create',
    tokens: [{"old":"/admin/bookings/force-create","type":0,"val":"admin","end":""},{"old":"/admin/bookings/force-create","type":0,"val":"bookings","end":""},{"old":"/admin/bookings/force-create","type":0,"val":"force-create","end":""}],
    types: placeholder as Registry['admin.bookings.force_create']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
