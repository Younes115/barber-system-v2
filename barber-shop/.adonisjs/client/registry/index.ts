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
