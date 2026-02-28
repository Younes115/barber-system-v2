export const controllers = {
  NewAccount: () => import('#controllers/new_account_controller'),
  Profile: () => import('#controllers/profile_controller'),
  Session: () => import('#controllers/session_controller'),
}
