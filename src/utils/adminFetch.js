import { apiUrl } from './apiBase.js'

/**
 * `fetch` to the Beat Producer API with `credentials` + JSON `Accept` by default.
 * Pass `headers: { 'Content-Type': ... }` for JSON bodies as needed.
 */
export function adminFetch(path, init = {}) {
  const { headers: incoming = {}, ...rest } = init
  return fetch(apiUrl(path), {
    credentials: 'include',
    ...rest,
    headers: {
      Accept: 'application/json',
      ...incoming,
    },
  })
}
