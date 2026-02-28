# Barber Shop Booking System - System Requirements Document

**Project Version:** 2.2  
**Last Updated:** February 28, 2026  
**Project Type:** Full-Stack Web Application

---

## 1. Executive Summary

The Barber Shop Booking System is a comprehensive web application designed to streamline appointment management and service operations for a barber shop. It provides customers with an online platform to browse services, book appointments, and receive confirmations, while offering administrators tools to manage bookings, services, and operational scheduling.

---

## 2. System Overview

### 2.1 Purpose
This system addresses the need for a modern, digital appointment booking solution for barber shops, eliminating manual scheduling, reducing no-shows, and improving customer experience while providing administrative control over services and daily operations.

### 2.2 Scope
The system encompasses:
- User authentication and profile management
- Service catalog browsing and management
- Appointment booking and scheduling
- Admin dashboard for operational oversight
- Service package management (CRUD operations)
- Role-based access control

### 2.3 Architecture
- **Frontend:** TypeScript/JavaScript with Inertia.js (React, Vue, or Svelte)
- **Backend:** AdonisJS v7 (TypeScript-first full-stack framework)
- **Database:** PostgreSQL with Lucid ORM
- **Authentication:** Phone/password login and signup with AdonisJS auth module
- **Authentication Method:** Session-based with secure password hashing, phone as unique identifier
- **File Uploads:** AdonisJS Drive integration for file management
- **Security:** CSRF protection, Middleware-based authorization, timing-safe password verification
- **Database Migrations:** Version-controlled schema management with Lucid
- **Language:** Arabic interface (no multi-language support)

---

## 3. Functional Requirements

### 3.1 User Authentication & Authorization

#### 3.1.1 Phone/Password Authentication
- **Requirement:** System must support phone/password login and signup
- **Details:**
  - Users register with phone number, password, and name
  - Phone number serves as unique identifier for authentication
  - Passwords are hashed using AdonisJS `withAuthFinder` mixin with timing-safe hashing
  - AdonisJS auth module handles credential verification and session creation
  - Auth configuration in `config/auth.ts` sets up session guard and user provider
  - Failed authentication returns error message without redirecting unnecessarily
  - Session automatically created upon successful login
  - No phone number OTP or verification required (cost optimization for small-scale operation)

#### 3.1.2 User Registration (Signup)
- **Requirement:** New users can create accounts via signup form
- **Details:**
  - Users provide: phone number, password, and name
  - System validates phone number format and password strength
  - Phone number must be unique across system (database constraint)
  - Password is hashed automatically by AdonisJS ORM before storage
  - User model uses Lucid ORM with database persistence
  - Users are assigned default role: `user` via database column
  - Special case: User with `ADMIN_PHONE` environment variable is assigned `admin` role at application startup
  - Each user record includes unique `phone` with database-level unique constraint
  - User profiles managed through Lucid models with automatic timestamps (`createdAt`, `updatedAt`)

#### 3.1.3 Session Management
- **Requirement:** AdonisJS session management for user authentication state
- **Details:**
  - Primary authentication: Server-side session management via HTTP cookies
  - Session contains: user ID and role information
  - Session storage: Configurable (database, redis, or file-based)
  - Session expiration: 1 hour (configurable in `config/auth.ts`)
  - Remember-me tokens: Optional persistent login with 30-day expiration
  - CSRF protection: Automatic CSRF token validation on state-changing requests
  - Session security: Secure, HttpOnly cookies prevent client-side JS access
  - Password verification: Timing-safe comparison prevents credential leakage

#### 3.1.4 Login Endpoint
- **Requirement:** Authenticated users can login with phone number and password
- **Details:**
  - Endpoint: `POST /login` with form validation
  - Controller: `app/controllers/auth_controller.ts` - `login()` method
  - Validates phone number and password via AdonisJS validator
  - Uses `User.verifyCredentials(phone, password)` for timing-safe verification
  - Creates session via `auth.use('web').login(user)` on success
  - Returns validation errors if credentials invalid
  - Redirects to dashboard on successful login
  - Password mismatch or invalid phone returns generic error message (security best practice)

#### 3.1.5 User Profile Endpoint
- **Requirement:** Authenticated users can retrieve their profile information
- **Details:**
  - Endpoint: `GET /profile` or served via Inertia component
  - Requires authenticated session
  - Controller: `app/controllers/auth_controller.ts` - `profile()` method
  - Returns via Inertia: name, phone, and role as component props
  - Returns user data from `auth.user` in Inertia props
  - Redirects to login if not authenticated via AdonisJS `auth` middleware

#### 3.1.6 Authentication Middleware
- **Requirement:** All protected routes must verify user authentication before processing
- **Details:**
  - Middleware: `auth` guard applied to protected routes in `routes/index.ts`
  - Middleware location: `app/middleware/auth.ts`
  - Validates session validity and expiration
  - Extracts user data and attaches to context (`ctx.auth.user`)
  - Redirects to login for unauthenticated requests (web routes)
  - Returns 401 for unauthenticated API requests
  - Uses AdonisJS built-in authentication context via HTTP context

---

### 3.2 Service Package Management

#### 3.2.1 Service Package Data Model
- **Requirement:** System must maintain a service package catalog
- **Details:**
  - Lucid Model: `app/models/package.ts`
  - Package fields: `id` (primary key), `name`, `description`, `price`, `createdAt`, `updatedAt`
  - All fields are required with database-level constraints
  - Price is stored as decimal/numeric type in PostgreSQL
  - Primary key: Auto-incrementing integer (PostgreSQL serial)
  - Packages are persistent in PostgreSQL with ACID guarantees
  - Migration: `database/migrations/xxxxx_create_packages_table.ts`

#### 3.2.2 View All Packages
- **Requirement:** Customers and admins can browse available service packages
- **Details:**
  - Route: Web route `GET /packages` served via Inertia
  - Controller: `app/controllers/packages_controller.ts` - `index()` method
  - No authentication required
  - Query: Retrieves all packages using Lucid query builder: `Package.all()`
  - Response: Inertia renders component with packages as props
  - Returns empty array if no packages exist
  - Database errors caught by AdonisJS exception handling

#### 3.2.3 Create New Package (Admin Only)
- **Requirement:** Only administrators can add new service packages
- **Details:**
  - Route: `POST /admin/packages` with `auth` and `admin` middleware
  - Controller: `app/controllers/packages_controller.ts` - `store()` method
  - Middleware: `app/middleware/admin.ts` checks `user.role === 'admin'`
  - Validation: AdonisJS validator in action: `request.validate(createPackageValidator)`
  - Required fields: `name`, `description`, `price` with type/constraint validation
  - Database: Lucid create: `Package.create({...})`
  - Returns 400 with validation errors if validation fails
  - Returns 303/redirect on success to packages list
  - Returns 401 if not authenticated
  - Returns 403 if user lacks admin role (enforced by middleware)

#### 3.2.4 Update Package (Admin Only)
- **Requirement:** Administrators can modify existing service packages
- **Details:**
  - Route: `PUT /admin/packages/:id` with `auth` and `admin` middleware
  - Controller: `app/controllers/packages_controller.ts` - `update()` method
  - Middleware: `auth` and `admin` guards verify authentication and role
  - Validation: AdonisJS validator applies update rules
  - Accepts: Partial updates to `name`, `description`, `price`
  - Database: Lucid: `await package.merge({...}).save()`
  - Returns 404 if package ID not found (via Lucid `findOrFail` or manual check)
  - Returns 303 redirect on success
  - Validator: AdonisJS string, decimal validators ensure data integrity

#### 3.2.5 Delete Package (Admin Only)
- **Requirement:** Administrators can remove service packages from the catalog
- **Details:**
  - Route: `DELETE /admin/packages/:id` with `auth` and `admin` middleware
  - Controller: `app/controllers/packages_controller.ts` - `destroy()` method
  - Middleware: `auth` and `admin` guards verify authentication and role
  - Database: Lucid: `await package.delete()` marks deletion
  - Returns 404 if package not found (via `findOrFail` error handling)
  - Returns 303 redirect on success
  - Deleted packages are permanently removed from PostgreSQL
  - Cascading: Related bookings may be handled via foreign key constraints

---

### 3.3 Booking & Appointment Management

#### 3.3.1 Booking Data Model
- **Requirement:** System must store comprehensive booking information
- **Details:**
  - Lucid Model: `app/models/booking.ts`
  - Fields: `id`, `userId`, `name`, `date`, `time`, `phone`, `servicesJson`, `createdAt`, `updatedAt`
  - `userId`: Foreign key reference to `users` table (required)
  - `name`: Text field (required, 2-100 characters validated, pulled from user profile)
  - `date`: Date column (required, future dates only)
  - `time`: Column (required, string format HH:MM)
  - `phone`: String column (required, phone format validation)
  - `servicesJson`: JSON column storing array of service objects with `name` and `price`
  - Primary key: Auto-incrementing integer with PostgreSQL serial type
  - Timestamps: `createdAt` and `updatedAt` automatically managed
  - Relationship: Belongs to `User` model via `@belongsTo` decorator

#### 3.3.2 Create Booking
- **Requirement:** Authenticated users can create appointments
- **Details:**
  - Route: `POST /bookings` with `auth` middleware
  - Controller: `app/controllers/bookings_controller.ts` - `store()` method
  - Authentication: Requires authenticated session via `auth` middleware
  - Validation: AdonisJS validator applies rules in `app/validators/create_booking_validator.ts`
  - Input validation:
    - Date: Date format, cannot be in the past (custom validation rule)
    - Time: Required, HH:MM format (custom validation)
    - Services: Array of objects with name and price
    - Name and phone automatically populated from authenticated user profile
  - Overbooking prevention: Query checks: `Booking.query().where('date', today).where('time', selectedTime).count()`
  - Returns 400 with validation errors if validation fails
  - Returns "Time slot fully booked" error if capacity (2) exceeded
  - Returns redirect with flash success on booking creation
  - Database: Lucid `Booking.create({...})` saves to PostgreSQL

#### 3.3.3 Booking Validation Rules
- **Requirement:** All booking inputs must be validated before processing
- **Details:**
  - Validator file: `app/validators/create_booking_validator.ts`
  - Uses AdonisJS built-in vine validator
  - Validates all required fields present and properly formatted
  - Date validation: `vine.date()` with custom rule checking future dates only
  - Time: `vine.string().required()` with HH:MM format validation
  - Services: `vine.array().of(vine.object({...}))` validates array structure
  - Custom validation: Async rule checks overbooking before record creation
  - Error messages: Arabic messages displayed for each validation rule
  - Returns validation errors with specific field messages on failure

#### 3.3.4 Booking Modification
- **Requirement:** Users can modify their own bookings with admin-controlled restrictions
- **Details:**
  - Route: `GET /bookings/:id/edit` and `PUT /bookings/:id` with `auth` middleware
  - Controller: `BookingsController.edit()` and `update()` methods
  - Modification allowed only if booking meets admin-defined conditions:
    - Can modify before a configurable hours-before cutoff (e.g., 24 hours before)
    - Can only modify fields: date, time, services (not name/phone)
    - Cannot modify bookings that are complete or cancelled
  - Admin settings stored in `settings` table or config:
    - `booking_modification_cutoff_hours`: Hours before booking user can still modify (default: 24)
    - `booking_modification_enabled`: Boolean to enable/disable feature globally
  - Validation: Same as creation plus overbooking prevention
  - Returns 403 Forbidden if modification not allowed (cutoff passed)
  - Returns 400 if validation fails
  - Confirms modification via success message and email notification (optional)

#### 3.3.5 Capacity Management
- **Requirement:** System manages booking slot capacity with admin override capability
- **Details:**
  - Default capacity: Configurable per time slot (default: 2 concurrent bookings)
  - Admin can view and override capacity on admin dashboard
  - Admin settings table stores:
    - `default_slot_capacity`: Number of bookings allowed per time slot
    - `allow_capacity_override`: Boolean to allow admin overrides
  - Capacity check before booking creation:
    - Query: `await Booking.query().where('date', dateValue).where('time', timeValue).count()`
    - If count >= configured capacity, reject booking
  - Admin override endpoint: `POST /admin/bookings/force-create` (bypasses capacity check)
  - When override used, flag booking as `overbooked: true` for tracking
  - Returns validation error with capacity details if full
  - Can be configured per day if needed

---

### 3.4 Admin Dashboard

#### 3.4.1 Today's Bookings View
- **Requirement:** Administrators can view all bookings for current day
- **Details:**
  - Route: `GET /admin/bookings/today` with `auth` and `admin` middleware
  - Controller: `app/controllers/bookings_controller.ts` - `todayBookings()` method
  - Middleware: `auth` and `admin` guards verify admin access
  - Query: Lucid query builder with date filtering and eager loading
  - Implementation: `Booking.query().where('date', today).preload('user')`
  - Includes: All booking details with associated user information (name, phone)
  - Date scope: Current day from midnight to midnight (timezone-aware)
  - Response: Inertia component `DailyBookings` with bookings array as props
  - Returns empty array if no bookings exist
  - Database: PostgreSQL query executed via Lucid
  - Used for daily operational management and scheduling via admin dashboard

---

### 3.5 Role-Based Access Control (RBAC)

#### 3.5.1 Role Definition
- **Requirement:** System must implement two-tier user roles
- **Details:**
  - **User Role:** Default role for all new users
    - Database column: `users.role` with enum constraint ['user', 'admin']
    - Can: View packages, create bookings, view own profile
    - Cannot: Access admin endpoints, manage packages or bookings
  - **Admin Role:** Restricted role for system administrators
    - Can: All user permissions plus admin functions
    - Can: View daily bookings, manage packages (CRUD)
    - Database default: 'user' role assigned on creation
    - Assignment: Phone-based on `ADMIN_PHONE` environment variable during login
    - Persistence: Role persisted in PostgreSQL users table

#### 3.5.2 Admin Middleware
- **Requirement:** All admin endpoints must verify admin role
- **Details:**
  - Middleware file: `app/middleware/admin.ts`
  - Runs after `auth` middleware to verify authentication
  - Checks: `ctx.auth.user.role === 'admin'`
  - Returns 403 Forbidden if user lacks admin role
  - Returns 401 Unauthorized if user not authenticated (redirects or API response)
  - Applied to: All `/admin/*` routes via middleware stack in `routes/index.ts`
  - Execution order: Routes → Auth Middleware → Admin Middleware → Controller
  - Error handling: AdonisJS exception handling displays appropriate error page


### 3.6 Frontend Features

#### 3.6.1 Service Package Display
- **Requirement:** Customers can browse service catalog with details
- **UI Components:** Inertia component `resources/views/components/Packages.tsx` (or `.vue`)
- **Details:**
  - Route: `GET /packages` renders Inertia component
  - Controller passes packages as props: `inertia.render('Packages', { packages })`
  - Displays all packages with name, description, and price
  - Shows available services in card or list format with Inertia reactive state
  - Supports service selection for booking cart via client-side state management
  - TypeScript props interface ensures type safety
  - All labels and pricing displayed in Arabic

#### 3.6.2 Booking Interface
- **Requirement:** Customers can create new appointments
- **UI Components:** Inertia component `resources/views/pages/BookingForm.tsx` (or `.vue`)
- **Details:**
  - Route: `GET /bookings/create` renders booking form component
  - Route: `POST /bookings` processes form submission
  - Controller: `BookingsController.create()` and `store()` methods
  - Form captures: service selection, date, time (name and phone auto-populated from user profile)
  - Date/time picker with future-only date selection via HTML5 input constraints
  - Client-side validation via component state and Inertia form helpers
  - Server-side validation enforced via AdonisJS validators
  - Displays booking confirmation via redirect to confirmation page
  - Error handling: Flash messages and form error props via Inertia
  - All labels and messages in Arabic with RTL layout support

#### 3.6.3 Gallery View
- **Requirement:** Customers can browse barber shop gallery
- **UI Components:** Inertia component `resources/views/pages/Gallery.tsx` (or `.vue`)
- **Details:**
  - Route: `GET /gallery` renders gallery component
  - Showcases barber work/hairstyles with responsive layout
  - Images stored: `public/gallery/` directory
  - Optional backend: Images managed via Upload service for future admin uploads
  - Responsive image gallery using CSS Grid or framework component library
  - No functional backend interaction (static content)
  - Gallery title and descriptions in Arabic

#### 3.6.4 Contact Page
- **Requirement:** System provides contact information
- **UI Components:** Inertia component `resources/views/pages/Contact.tsx` (or `.vue`)
- **Details:**
  - Route: `GET /contact` renders contact component
  - Displays business contact information (phone, email, address)
  - Optional contact form: `POST /contact` route with validation
  - Optional: Sends email via AdonisJS Mail service
  - Static content rendered via Inertia props
  - Contact form labels and submission messages in Arabic

#### 3.6.5 Daily Bookings Dashboard
- **Requirement:** Administrators can view and manage daily schedule
- **UI Components:** Inertia component `resources/views/pages/admin/DailyBookings.tsx` (or `.vue`)
- **Details:**
  - Route: `GET /admin/bookings/today` with admin middleware
  - Controller: `BookingsController.todayBookings()`
  - Component renders paginated list of daily bookings
  - Displays customer details: name, phone (eager loaded via Lucid)
  - Shows booked services and times in formatted display
  - Real-time updates optional via Inertia short polling
  - Admin-only accessible via role-based route protection
  - Data passed as Inertia props: `{ bookings: [...] }`

#### 3.6.6 Authentication UI
- **Requirement:** Users can login and signup with phone number and password
- **UI Components:** Inertia components `resources/views/pages/Login.tsx` and `resources/views/pages/Signup.tsx` (or `.vue`)
- **Details:**
  - Login route: `GET /login` renders login form component
  - Signup route: `GET /signup` renders registration form component
  - Login submission: `POST /login` with phone number and password fields
  - Signup submission: `POST /signup` with phone number, password, and name fields
  - Form validation: Client-side hints with server-side validation
  - Error messages: Display phone not found or invalid credentials in Arabic
  - Session creation: Automatic after successful authentication
  - Session managed: Via HTTP cookies (HttpOnly, Secure flags)
  - Logout functionality: `POST /logout` route with session termination
  - All labels and validation messages in Arabic

#### 3.6.7 Responsive Design
- **Requirement:** Frontend must be functional on multiple device types
- **Details:**
  - Implemented via component library (Tailwind CSS, Material UI, or custom)
  - Responsive CSS utilities for tablet and mobile layouts
  - Flexbox and CSS Grid layouts in Inertia components
  - Touch-friendly interface elements with adequate spacing
  - Optimized viewport configuration in `app.tsx` or layout component
  - TypeScript component prop validation ensures type safety

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **Response Time:** API endpoints should respond within 500ms for normal operations
- **Database Queries:** Should use indexes on frequently queried fields (date, userId)
- **File Uploads:** When enabled, support reasonable file sizes (typically < 5MB for icons)

### 4.2 Security
- **Authentication:** Phone/password with AdonisJS auth module and timing-safe hashing
- **Authorization:** Session-based authorization via AdonisJS Guards
- **Data Validation:** Input validation on all user-submitted data via Vine validator
- **CSRF Protection:** Automatic CSRF token validation on state-changing requests
- **Session Security:** HttpOnly, Secure cookies prevent client-side access
- **Password Hashing:** Bcrypt with automatic hashing via `withAuthFinder` mixin

### 4.3 Reliability & Availability
- **Database Connectivity:** MongoDB connection with error handling
- **Error Handling:** Proper HTTP status codes and error messages
- **Data Persistence:** MongoDB ensures data durability
- **Graceful Degradation:** System handles missing environment variables with defaults

### 4.4 Scalability
- **Stateless Backend:** Enables horizontal scaling
- **Session Storage:** Configurable session store (file, redis, database)
- **Database Indexing:** Indexes on date, userId, time for efficient queries
- **Connection Pooling:** Lucid configures optimal PostgreSQL connection pool
- **Concurrency:** Basic request handling suitable for small-scale operation; advanced locking/transaction isolation available as future enhancement

### 4.5 Maintainability
- **Code Organization:** Separation of concerns (controllers, middleware, models, routers)
- **Error Logging:** Console logging for debugging (can be enhanced)
- **Environment Configuration:** Environment variables for sensitive data and configuration
- **Modular Structure:** Controllers, middleware, and models are independently testable

### 4.6 Usability
- **User Interface:** Intuitive navigation for booking and browsing
- **Language:** Arabic interface with RTL (right-to-left) support
- **Error Messages:** Clear, actionable error messages in Arabic for validation failures
- **Confirmation Feedback:** Booking confirmations and success messages in Arabic
- **Mobile Responsiveness:** Functional interface on mobile devices with touch-friendly controls
- **Timezone:** All dates/times use Egypt Timezone (UTC+2) for consistency

---

## 5. Data Models & Database Schema

### 5.1 User Model (PostgreSQL Table)
```typescript
// app/models/user.ts (Lucid Model)
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'

const AuthFinder = withAuthFinder(hash, {
  uids: ['phone'],
  passwordColumnName: 'password'
})

export default class User extends AuthFinder(BaseModel) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string  // not null

  @column()
  declare phone: string  // unique constraint, authentication identifier

  @column()
  declare password: string  // auto-hashed via withAuthFinder mixin

  @column()
  declare role: 'user' | 'admin' = 'user'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Booking)
  declare bookings: HasMany<typeof Booking>
}
```

### 5.2 Package Model (PostgreSQL Table)
```typescript
// app/models/package.ts (Lucid Model)
export default class Package extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string  // not null

  @column()
  declare description: string  // not null

  @column()
  declare price: number  // decimal type

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

### 5.3 Booking Model (PostgreSQL Table)
```typescript
// app/models/booking.ts (Lucid Model)
export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number  // foreign key

  @column()
  declare name: string  // not null

  @column()
  declare date: DateTime  // not null

  @column()
  declare time: string  // not null, HH:MM format

  @column()
  declare phone: string  // not null

  @column()
  declare servicesJson: { name: string; price: number }[]  // JSON type

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
```

---

## 6. Endpoints Summary

### 6.1 Authentication Routes & Controllers
| Method | Route | Controller | Auth | Purpose |
|--------|-------|-----------|------|----------
| GET | `/login` | `AuthController.showLogin()` | No | Display login page |
| POST | `/login` | `AuthController.login()` | No | Process login with phone/password |
| GET | `/signup` | `AuthController.showSignup()` | No | Display signup form |
| POST | `/signup` | `AuthController.signup()` | No | Process new user registration |
| POST | `/logout` | `AuthController.logout()` | Yes | Logout user |
| GET | `/profile` | `AuthController.profile()` | Yes | View user profile |

### 6.2 Booking Routes & Controllers
| Method | Route | Controller | Auth | Purpose |
|--------|-------|-----------|------|----------
| GET | `/bookings/create` | `BookingsController.create()` | Yes | Show booking form |
| POST | `/bookings` | `BookingsController.store()` | Yes | Create new booking |
| GET | `/bookings` | `BookingsController.index()` | Yes | List user bookings |
| GET | `/bookings/:id` | `BookingsController.show()` | Yes | View booking details |

### 6.3 Package Routes & Controllers
| Method | Route | Controller | Auth | Role | Purpose |
|--------|-------|-----------|------|------|----------
| GET | `/packages` | `PackagesController.index()` | No | - | View all packages |
| GET | `/admin/packages/create` | `PackagesController.create()` | Yes | Admin | Create package form |
| POST | `/admin/packages` | `PackagesController.store()` | Yes | Admin | Store new package |
| GET | `/admin/packages/:id/edit` | `PackagesController.edit()` | Yes | Admin | Edit package form |
| PUT | `/admin/packages/:id` | `PackagesController.update()` | Yes | Admin | Update package |
| DELETE | `/admin/packages/:id` | `PackagesController.destroy()` | Yes | Admin | Delete package |

### 6.4 Admin Routes & Controllers
| Method | Route | Controller | Auth | Role | Purpose |
|--------|-------|-----------|------|------|----------
| GET | `/admin/bookings/today` | `BookingsController.todayBookings()` | Yes | Admin | View today's bookings |
| GET | `/admin/dashboard` | `AdminController.dashboard()` | Yes | Admin | Admin dashboard |

---

## 7. Environment Variables & Configuration

### 7.1 Required Environment Variables
| Variable | Type | Purpose | Example |
|----------|------|---------|----------
| `NODE_ENV` | String | Environment (development, production) | `development` |
| `APP_KEY` | String | Application encryption key (auto-generated) | `base64:xxxxx` |
| `DB_HOST` | String | PostgreSQL host | `localhost` |
| `DB_PORT` | Number | PostgreSQL port | `5432` |
| `DB_USER` | String | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | String | PostgreSQL password | `your_password` |
| `DB_DATABASE` | String | Database name | `barber_booking` |
| `ADMIN_PHONE` | String | Phone number assigned admin role | `+201001234567` |
| `SESSION_DRIVER` | String | Session store (file, cookie, redis) | `cookie` |
| `CACHE_DRIVER` | String | Cache driver (memory, redis) | `memory` |
| `QUEUE_DRIVER` | String | Queue driver (async, bull_redis) | `async` |

### 7.3 Configuration Files
- `config/app.ts` - Application settings (timezone)
- `config/auth.ts` - Authentication configuration and session management
- `config/database.ts` - Database connection settings
- `config/cors.ts` - CORS allowed origins and settings
- `config/session.ts` - Session management configuration
- `.env.example` - Template for environment variables

---

## 10. Current Limitations & Known Issues

### 10.1 Limitations
- **Manual Admin Assignment:** Currently assigned via `ADMIN_PHONE` environment variable (no admin management UI)
- **Timezone Fixed:** Only Egypt timezone (UTC+2) is supported; no user timezone selection
- **Booking Cancellation:** Users cannot cancel bookings, only modify them within cutoff
- **Real-time Updates:** Daily bookings dashboard uses polling (real-time via WebSockets is optional)
- **Email Notifications:** Booking confirmations and reminders not yet implemented
- **Barber Assignment:** No individual barber scheduling (all bookings treated equally)
- **Payment System:** No payment processing or deposit collection
- **Language:** Strictly Arabic only; no multi-language support or configuration
- **Concurrency Handling:** Not strictly necessary for initial release (small-scale barber shop); can be added as enhancement

### 10.2 Security Considerations
- **Session Duration:** Default 1-hour session may require re-authentication on extended inactivity
- **Password Strength:** Implement minimum password strength requirements in signup validator
- **CSRF Protection:** Automatic in AdonisJS; ensure Inertia forms include CSRF token
- **Input Sanitization:** Validate and sanitize all user inputs on backend
- **Brute Force:** Consider rate limiting on login endpoint for production deployments
- **Phone Verification:** Intentionally skipped for cost optimization (single-country, small-scale operation)

---

## 9. Deployment & Configuration

### 9.1 Production Deployment Domains
- Primary: `https://barberhaircut-production.up.railway.app`
- Secondary: `https://barbersystem1-qdz8war3.b4a.run`

### 9.2 Development Configuration
- Supports localhost on any port
- 127.0.0.1 origins allowed
- CORS allows development testing

## 8. Project Structure & File Organization

This section has been removed. The project uses standard AdonisJS v7 structure with migrations, models, controllers, validators, and Inertia components organized in their respective directories.

---

## 9. Testing & Quality Assurance

### 9.1 Manual Testing Requirements
- [ ] User signup with phone number, password, and name
- [ ] Phone number validation and duplicate phone prevention
- [ ] Password strength enforcement on signup
- [ ] User login with phone and password - valid and invalid credentials
- [ ] Session creation and persistence across page reloads
- [ ] Booking creation with valid and invalid inputs
- [ ] Booking modification within allowed cutoff
- [ ] Booking modification denied when cutoff passed
- [ ] Capacity enforcement (max bookings per slot)
- [ ] Admin capacity override functionality
- [ ] Admin package management (CRUD operations)
- [ ] Daily bookings view populated correctly
- [ ] Unauthorized access to admin endpoints denied and redirected
- [ ] All dates/times correctly display in Egypt timezone
- [ ] All forms display in Arabic with proper RTL layout
- [ ] Responsive design on mobile, tablet, and desktop
- [ ] Form validation messages display in Arabic

### 9.2 Automated Testing Areas
- **Unit Tests:** Controller methods, model relationships, validators
- **Integration Tests:** Database migrations, user registration flow
- **Feature Tests:** Authentication flow, booking creation, modification with time limits
- **Timezone Tests:** Verify Egypt timezone (UTC+2) handling in all date operations
- **Capacity Tests:** Overbooking prevention and admin override logic
- **Browser Tests:** Inertia component rendering, form interactions
- **Test Framework:** AdonisJS test utilities with Jest or built-in test runner

---

## 11. Future Enhancement Recommendations

1. **Booking Cancellation:** Add ability for users to cancel bookings (separate from modification)
2. **Email Service:** Add AdonisJS Mail service for booking confirmations and reminders
3. **SMS Integration:** Send appointment reminders via SMS (Twilio/SendGrid)
4. **Multi-Admin Support:** Implement admin management interface for multiple administrators
5. **Barber Scheduling:** Assign bookings to specific barbers with availability tracking
6. **Payment Integration:** Stripe or PayPal integration for deposits/prepayment
7. **Analytics Dashboard:** Booking trends, revenue reports, customer insights
8. **Waitlist Feature:** Allow customers to join waitlist when slots are full
9. **Review System:** Customers can rate services and barbers
10. **Calendar View:** Visual calendar component showing available booking slots
11. **Concurrency Handling:** Advanced request locking, transaction isolation, and concurrent booking prevention (as system scales)
12. **Real-time Updates:** Implement WebSocket support for live booking updates
13. **API Documentation:** Generate OpenAPI/Swagger documentation
14. **Admin Audit Log:** Track all admin actions for compliance
15. **Marketing:** Email campaigns and promotional booking codes

---

## 12. Compliance & Standards

### 12.1 Standards Compliance
- **HTTP Standards:** RESTful API design with proper status codes
- **Data Format:** JSON for all API communication via Inertia
- **ISO 8601:** Date/time format compliance using Luxon library
- **HTML5:** Frontend markup validation with RTL (right-to-left) support for Arabic
- **Accessibility:** WCAG compliance recommendations for Inertia components
- **TypeScript:** Full type safety across backend and frontend
- **Arabic Only:** Interface strictly in Arabic, no multi-language configuration needed

### 12.2 Data Protection
- **GDPR Considerations:** Users can request profile data; implement data export
- **Data Retention:** Recommend archiving bookings older than 1 year
- **Encryption:** Use PostgreSQL SSL connections; encrypt sensitive fields if needed
- **PII Handling:** Email, name, phone stored in PostgreSQL with access controls

---

## 13. Support & Maintenance

### 13.1 Common Issues & Resolutions

**Issue:** "Invalid phone number or password"
- **Cause:** User entered incorrect phone number or password
- **Resolution:** Double-check credentials and try again; ensure phone format is correct

**Issue:** "This phone number is already registered"
- **Cause:** User attempted signup with existing phone number
- **Resolution:** User should login instead or use different phone number

**Issue:** "This time slot is fully booked"
- **Cause:** 2 or more bookings already exist for selected date/time
- **Resolution:** User must select different time slot

**Issue:** "Unauthorized" or redirected to login
- **Cause:** Session expired or user not authenticated
- **Resolution:** User logs in again; session persists for configured duration

**Issue:** Database connection errors
- **Cause:** PostgreSQL connection string or credentials incorrect
- **Resolution:** Verify `DATABASE_URL` or individual DB_* environment variables

**Issue:** Form validation errors
- **Cause:** Missing required fields or invalid format
- **Resolution:** Check error messages and provide valid data (phone format, strong password)

### 13.2 Maintenance Tasks
- **Database Backups:** Regular PostgreSQL backups (automated via hosting)
- **Logging:** Monitor AdonisJS logs in `storage/logs/` directory
- **Updates:** Keep AdonisJS, Inertia, and dependencies updated
- **Database Migrations:** Test migrations in staging before production
- **Session Cleanup:** Automatic cleanup of expired sessions

## 14. Technology Stack Details

### 14.1 Backend Framework (AdonisJS v7)
- **MVC Pattern:** Clear separation of models, views (Inertia), and controllers
- **TypeScript:** Full type safety for backend code
- **Routing:** Clean, fluent route definitions with middleware support
- **Middleware:** Built-in middleware for auth, CORS, error handling
- **ORM:** Lucid ORM with query builder for PostgreSQL interactions
- **Validation:** Vine validator with custom rules and error messages
- **Authentication:** Official authentication package with phone/password and `withAuthFinder` mixin
- **Password Hashing:** Automatic Bcrypt hashing with timing-safe verification
- **Session Management:** Flexible session storage (file, cookie, redis)
- **Timezone Support:** Luxon library for Egypt timezone (UTC+2) operations
- **CLI Commands:** Ace CLI for migrations, model generation, tinker shell

### 14.2 Frontend Framework (Inertia.js)
- **Approach:** Server-rendered pages with client-side interactivity
- **Component-Based:** Reusable components using React, Vue, or Svelte
- **Props Passing:** Strongly-typed props from controller to component
- **Form Handling:** Built-in form helpers for validation and submission
- **Deferred Props:** Lazy load data for better performance
- **Routing:** Server-side routing eliminates frontend routing complexity
- **No API Layer:** Direct server-to-UI communication via props

### 14.3 Database (PostgreSQL)
- **Relational:** ACID-compliant transactional database
- **JSON Support:** Native JSON column type for flexible data
- **Relationships:** Foreign keys with cascading constraints
- **Indexes:** Optimize queries on frequently accessed columns
- **Migrations:** Version-controlled schema management
- **Type Safety:** PostgreSQL data types ensure data integrity

### 14.4 Build Tools
- **Vite:** Fast build tool for development and production
- **TypeScript Compiler:** Compiles TS to JS for browser/Node
- **Asset Bundling:** CSS and JS minification and bundling
- **Hot Module Reload:** Live updates during development
