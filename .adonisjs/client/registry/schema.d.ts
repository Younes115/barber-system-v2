/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
    }
  }
  'health': {
    methods: ["GET","HEAD"]
    pattern: '/health'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'bookings.store': {
    methods: ["POST"]
    pattern: '/bookings'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/booking').createBookingValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/booking').createBookingValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['store']>>>
    }
  }
  'bookings.index': {
    methods: ["GET","HEAD"]
    pattern: '/bookings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['index']>>>
    }
  }
  'bookings.show': {
    methods: ["GET","HEAD"]
    pattern: '/bookings/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['show']>>>
    }
  }
  'bookings.edit': {
    methods: ["GET","HEAD"]
    pattern: '/bookings/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['edit']>>>
    }
  }
  'bookings.update': {
    methods: ["PUT"]
    pattern: '/bookings/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/booking').updateBookingValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/booking').updateBookingValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['update']>>>
    }
  }
  'bookings.destroy': {
    methods: ["DELETE"]
    pattern: '/bookings/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['destroy']>>>
    }
  }
  'packages.index': {
    methods: ["GET","HEAD"]
    pattern: '/packages'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/packages_controller').default['index']>>>
    }
  }
  'admin.packages.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/packages'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/packages_controller').default['adminIndex']>>>
    }
  }
  'admin.packages.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/packages/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/packages_controller').default['create']>>>
    }
  }
  'admin.packages.store': {
    methods: ["POST"]
    pattern: '/admin/packages'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/package').createPackageValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/package').createPackageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/packages_controller').default['store']>>>
    }
  }
  'admin.packages.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/packages/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/packages_controller').default['edit']>>>
    }
  }
  'admin.packages.update': {
    methods: ["PUT"]
    pattern: '/admin/packages/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/package').updatePackageValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/package').updatePackageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/packages_controller').default['update']>>>
    }
  }
  'admin.packages.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/packages/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/packages_controller').default['destroy']>>>
    }
  }
  'admin.dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/admin/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['dashboard']>>>
    }
  }
  'admin.bookings.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/bookings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['adminIndex']>>>
    }
  }
  'admin.bookings.today': {
    methods: ["GET","HEAD"]
    pattern: '/admin/bookings/today'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['adminToday']>>>
    }
  }
  'admin.bookings.show': {
    methods: ["GET","HEAD"]
    pattern: '/admin/bookings/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['adminShow']>>>
    }
  }
  'admin.bookings.update_status': {
    methods: ["PUT"]
    pattern: '/admin/bookings/:id/status'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/booking').updateBookingStatusValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/booking').updateBookingStatusValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['updateStatus']>>>
    }
  }
  'admin.bookings.force_create': {
    methods: ["POST"]
    pattern: '/admin/bookings/force-create'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/booking').createBookingValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/booking').createBookingValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['forceCreate']>>>
    }
  }
}
