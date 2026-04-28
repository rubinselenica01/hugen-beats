/**
 * Frontend route paths (single source — import here instead of string literals elsewhere).
 */
export const routes = Object.freeze({
  home: '/',
  beatsCatalog: '/beats',
  adminLogin: '/admin/login',
  /** Default post-login landing for admins */
  adminBeatManagement: '/admin/beat-management',
})

/**
 * @param {string} pathname - `location.pathname`
 * @param {string} [search=''] - `location.search`
 */
export function adminLoginHrefWithRedirect(pathname, search = '') {
  const redirect = encodeURIComponent(`${pathname}${search}`)
  return `${routes.adminLogin}?redirect=${redirect}`
}
