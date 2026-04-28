/**
 * API origin for authenticated requests (`credentials: 'include'`).
 * Dev: leave unset and use `vite.config.js` proxy (`/admin` → API) so cookies stay same-origin.
 * Prod: set `VITE_API_URL` when the SPA and API live on different hosts.
 */
export function apiUrl(path) {
  const base = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}
