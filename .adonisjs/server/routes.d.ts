import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'bookings.store': { paramsTuple?: []; params?: {} }
    'bookings.index': { paramsTuple?: []; params?: {} }
    'bookings.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookings.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookings.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookings.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'packages.index': { paramsTuple?: []; params?: {} }
    'admin.packages.index': { paramsTuple?: []; params?: {} }
    'admin.packages.create': { paramsTuple?: []; params?: {} }
    'admin.packages.store': { paramsTuple?: []; params?: {} }
    'admin.packages.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.packages.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.packages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.bookings.index': { paramsTuple?: []; params?: {} }
    'admin.bookings.today': { paramsTuple?: []; params?: {} }
    'admin.bookings.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.bookings.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.bookings.force_create': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'bookings.index': { paramsTuple?: []; params?: {} }
    'bookings.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookings.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'packages.index': { paramsTuple?: []; params?: {} }
    'admin.packages.index': { paramsTuple?: []; params?: {} }
    'admin.packages.create': { paramsTuple?: []; params?: {} }
    'admin.packages.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.bookings.index': { paramsTuple?: []; params?: {} }
    'admin.bookings.today': { paramsTuple?: []; params?: {} }
    'admin.bookings.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'bookings.index': { paramsTuple?: []; params?: {} }
    'bookings.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookings.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'packages.index': { paramsTuple?: []; params?: {} }
    'admin.packages.index': { paramsTuple?: []; params?: {} }
    'admin.packages.create': { paramsTuple?: []; params?: {} }
    'admin.packages.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.bookings.index': { paramsTuple?: []; params?: {} }
    'admin.bookings.today': { paramsTuple?: []; params?: {} }
    'admin.bookings.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'bookings.store': { paramsTuple?: []; params?: {} }
    'admin.packages.store': { paramsTuple?: []; params?: {} }
    'admin.bookings.force_create': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'bookings.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.packages.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.bookings.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'bookings.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.packages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}