## Plan: Backend Phased Implementation from Requirements

This plan turns SYSTEM_REQUIREMENTS.md into concrete backend-only phases for your current AdonisJS v7 app in barber-shop. It assumes you keep the existing Inertia setup and controllers where possible, and iteratively evolve from email-based auth + SQLite to phone-based auth + PostgreSQL + bookings/packages/admin as described.

Each phase is individually shippable and keeps the app working.

---

**Steps**

1. **Phase 1 – Switch to Phone-Based Auth & Basic Profile**

   - Align the `User` data model and auth flow with phone/password requirements.
   - Update DB schema:
     - Add `phone` (unique, non-null) and `role` (default `'user'`) via a new migration on barber-shop/database/migrations.
     - Update `UserSchema` in barber-shop/database/schema.ts to include `phone` and `role`.
   - Adjust `User` model in barber-shop/app/models/user.ts:
     - Add typed `phone` and `role` fields.
     - Keep `withAuthFinder(hash, …)` but configure it to use `phone` as UID.
   - Update signup flow in barber-shop/app/controllers/new_account_controller.ts:
     - Change `signupValidator` in barber-shop/app/validators/user.ts to validate `phone` (Egyptian format), `name/fullName`, and strong password.
     - Persist `phone`, `fullName`, and default `role: 'user'`.
   - Update login flow in barber-shop/app/controllers/session_controller.ts:
     - Accept `{ phone, password }` instead of `{ email, password }`.
     - Use `User.verifyCredentials(phone, password)` and return generic error on failure.
   - Add a `/profile` endpoint:
     - In barber-shop/start/routes.ts, add `GET /profile` guarded by `auth` middleware.
     - Implement `profile()` (either in a new `AuthController` or existing controller) to return `name`, `phone`, and `role` via Inertia.

2. **Phase 2 – Session Management, Remember-Me & Security Alignment**

   - Align session and auth config with the requirement (1h session, optional remember-me).
   - Update barber-shop/config/session.ts:
     - Set cookie/session `age` to 1 hour (e.g., `'1h'`) to match spec.
   - Ensure barber-shop/config/app.ts cookie defaults (maxAge) are coherent with session age.
   - Update barber-shop/config/auth.ts:
     - Enable `useRememberMeTokens: true` for the `web` guard.
     - Set remember-me token age to 30 days.
   - Extend login in barber-shop/app/controllers/session_controller.ts:
     - Accept an optional `remember_me` flag.
     - Call `auth.use('web').login(user, !!remember_me)` and regenerate session ID before login.
   - Confirm CSRF and security headers in barber-shop/config/shield.ts still match requirements.

3. **Phase 3 – RBAC & Admin Role (Including ADMIN_PHONE)**

   - Implement two-tier roles (`user`, `admin`) and admin-only protection for routes.
   - Ensure `role` column on `users` table is present and defaulted (from Phase 1 migration).
   - Implement `AdminMiddleware` in barber-shop/app/middleware:
     - Check `ctx.auth.user.role === 'admin'`, return 403 for non-admin, 401 if unauthenticated.
   - Register named middleware in barber-shop/start/kernel.ts (or equivalent):
     - Map `'auth'` to existing auth middleware and `'admin'` to new admin middleware.
   - Configure `ADMIN_PHONE` in barber-shop/start/env.ts and `.env.example`:
     - Validate it as optional string or phone.
   - In signup/login controllers (new account + session) in barber-shop/app/controllers:
     - If a user’s `phone` matches `ADMIN_PHONE`, ensure `role` is set to `'admin'` and saved.
   - Add an `/admin` route group in barber-shop/start/routes.ts using both `auth` and `admin` middleware to establish the admin namespace.

4. **Phase 4 – Service Package Catalog (Model, Migration, CRUD)**

   - Implement the package management backend.
   - Add `Package` model in barber-shop/app/models:
     - Fields: `id`, `name`, `description`, `price`, `createdAt`, `updatedAt`.
   - Create a `packages` migration in barber-shop/database/migrations:
     - `id` (PK), `name` (string, required), `description` (text), `price` (decimal/numeric), timestamps.
   - Add Vine validators in barber-shop/app/validators:
     - `createPackageValidator` for required fields and decimal price.
     - `updatePackageValidator` for partial updates.
   - Implement `PackagesController` in barber-shop/app/controllers:
     - `index()` → list all packages for public browsing.
     - `store()`, `update()`, `destroy()` → admin-only CRUD.
   - Wire routes in barber-shop/start/routes.ts:
     - Public `GET /packages` → `PackagesController.index`.
     - Under `/admin` group + `admin` middleware:
       - `POST /admin/packages`, `PUT /admin/packages/:id`, `DELETE /admin/packages/:id`.

5. **Phase 5 – Booking Core: Model, Creation, Validation & Capacity (User Side)**

   - Implement main booking storage and creation flow.
   - Create `Booking` model in barber-shop/app/models:
     - Fields: `id`, `userId`, `name`, `date`, `time`, `phone`, `servicesJson`, timestamps.
     - Relationship: `belongsTo` `User`.
   - Add `bookings` migration in barber-shop/database/migrations:
     - `user_id` FK, `name`, `date`, `time`, `phone`, `services_json` (JSON), timestamps; indexes on `date`, `time`, `user_id`.
   - Define Vine `create_booking_validator` in barber-shop/app/validators:
     - Validate future `date`, `time` in `HH:MM`, `services` array (objects with `name` and `price`), and other constraints from SYSTEM_REQUIREMENTS.md.
   - Implement `BookingsController.store()` in barber-shop/app/controllers:
     - Require auth, validate input with `create_booking_validator`.
     - Auto-fill `name` and `phone` from `auth.user` where appropriate.
     - Enforce a default capacity per slot (e.g., count non-cancelled bookings for the same `date` + `time` and disallow when ≥ 2).
     - Create booking and redirect with appropriate flash messages.
   - Add routes in barber-shop/start/routes.ts:
     - Under `auth` group: `POST /bookings` → `BookingsController.store`.

6. **Phase 6 – Booking Listing, Details, Modification & Admin Booking Views**

   - Complete the rest of the booking endpoints and admin views.
   - Extend `Booking` model and migration in barber-shop/app/models, barber-shop/database/migrations:
     - Optionally add `status` (e.g., `'confirmed' | 'completed' | 'cancelled'`) and `overbooked` boolean if you want admin overrides per the requirements.
   - Add validators in barber-shop/app/validators:
     - `update_booking_validator` similar to create, but allowing partial updates.
   - Extend `BookingsController` in barber-shop/app/controllers:
     - `index()` → list bookings for the authenticated user (preload user if needed).
     - `show()` → show booking details, scoped to owning user.
     - `edit()` / `update()` → enforce modification cutoff hours and booking status rules; re-run capacity checks on changes.
     - `todayBookings()` → admin-only query for today’s bookings with necessary preloads (user, maybe services).
   - Introduce settings/config for capacity and modification rules:
     - Either a small `settings` table + model in barber-shop/app/models with migration, or a dedicated config module if persistence isn’t mandatory.
     - Fields like `default_slot_capacity`, `booking_modification_cutoff_hours`, `booking_modification_enabled`, `allow_capacity_override`.
   - Add routes in barber-shop/start/routes.ts:
     - Under `auth`: `GET /bookings/create`, `GET /bookings`, `GET /bookings/:id`, `GET /bookings/:id/edit`, `PUT /bookings/:id`.
     - Under `/admin` + `admin` middleware: `GET /admin/bookings/today` → `BookingsController.todayBookings()`.

7. **Phase 7 – Admin Package & Dashboard Endpoints**

   - Add any remaining admin-only endpoints mentioned in SYSTEM_REQUIREMENTS.md.
   - Create/extend `AdminController` in barber-shop/app/controllers:
     - `dashboard()` → high-level metrics endpoint for `/admin/dashboard`.
   - Ensure package and booking admin endpoints use the `admin` middleware and follow the HTTP and redirect patterns described.
   - Connect `todayBookings()` and package management actions to the admin dashboard Inertia pages with appropriate props.

8. **Phase 8 – Non-Functional Alignment (PostgreSQL, Logging, Validation, Arabic Messages)**

   - Align environment and non-functional behavior with the spec.
   - Update barber-shop/config/database.ts:
     - Add PostgreSQL connection and switch default connection to PG in non-test environments.
     - Ensure migrations and model types (decimal, JSON) are PG-friendly.
   - Confirm password hashing and auth in barber-shop/config/hash.ts match timing-safe requirements (the existing `withAuthFinder` + hash service already does this, just verify).
   - Improve logging and error handling in:
     - barber-shop/config/logger.ts and relevant controllers for capacity violations, admin overrides, and failed auth.
   - Standardize Vine error messages for Arabic:
     - Customize messages in validators in barber-shop/app/validators to Arabic as required.
   - Review barber-shop/start/env.ts and `.env.example` to ensure all required variables in SYSTEM_REQUIREMENTS.md are declared (`DB_*`, `ADMIN_PHONE`, `SESSION_DRIVER`, etc.).

---

**Verification**

- After **Phase 1–3**:
  - You can sign up and log in with phone/password, sessions work, `/profile` shows correct data, and admin routes are protected by role.
- After **Phase 4**:
  - `/packages` lists packages; admin can create/update/delete via backend routes and non-admins are blocked.
- After **Phase 5–6**:
  - Authenticated users can create, view, and (within cutoff rules) modify their bookings; overbooking beyond capacity is prevented; admin can see today’s bookings.
- After **Phase 7–8**:
  - PostgreSQL is used in non-test environments; admin dashboard endpoints return correct aggregates; logs and validation errors behave as described; all backend validation and error messages are localized as needed.

---

**Decisions**

- Use `phone` as the sole login UID while optionally keeping `email` for contact only.
- Store `role` as a string column with values `'user'`/`'admin'` (DB-enforced enum or check constraint is optional but recommended).
- Implement booking capacity as a simple fixed-per-slot rule initially (2 bookings per `date`+`time`), with an optional later extension via a `settings` model.
- Introduce PostgreSQL as the primary DB for production while keeping SQLite acceptable for local development/tests if desired.
