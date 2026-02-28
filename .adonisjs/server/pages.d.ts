import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'admin/bookings/today': ExtractProps<(typeof import('../../inertia/pages/admin/bookings/today.tsx'))['default']>
    'admin/dashboard': ExtractProps<(typeof import('../../inertia/pages/admin/dashboard.tsx'))['default']>
    'admin/packages/index': ExtractProps<(typeof import('../../inertia/pages/admin/packages/index.tsx'))['default']>
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'bookings/create': ExtractProps<(typeof import('../../inertia/pages/bookings/create.tsx'))['default']>
    'bookings/edit': ExtractProps<(typeof import('../../inertia/pages/bookings/edit.tsx'))['default']>
    'bookings/index': ExtractProps<(typeof import('../../inertia/pages/bookings/index.tsx'))['default']>
    'bookings/show': ExtractProps<(typeof import('../../inertia/pages/bookings/show.tsx'))['default']>
    'contact': ExtractProps<(typeof import('../../inertia/pages/contact.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'packages/index': ExtractProps<(typeof import('../../inertia/pages/packages/index.tsx'))['default']>
    'profile': ExtractProps<(typeof import('../../inertia/pages/profile.tsx'))['default']>
  }
}
