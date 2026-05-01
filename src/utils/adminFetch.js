import { apiUrl } from './apiBase.js'

const defaultHeaders = () => ({ Accept: 'application/json' })

let refreshInFlight = null

async function refreshAdminSession() {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(apiUrl('/admin/refresh'), {
          method: 'POST',
          credentials: 'include',
          headers: defaultHeaders(),
        })
        return res.ok
      } finally {
        refreshInFlight = null
      }
    })()
  }
  return refreshInFlight
}

function shouldTryRefresh(path) {
  return path !== '/admin/refresh' && path !== '/admin/login'
}

/**
 * `fetch` to the Beat Producer API with `credentials` + JSON `Accept` by default.
 * On 401, attempts one cookie-based session refresh and retries the request.
 * Pass `headers: { 'Content-Type': ... }` for JSON bodies as needed.
 */
export async function adminFetch(path, init = {}) {
  const { headers: incoming = {}, ...rest } = init
  const url = apiUrl(path)
  const doFetch = () =>
    fetch(url, {
      credentials: 'include',
      ...rest,
      headers: {
        ...defaultHeaders(),
        ...incoming,
      },
    })

  let res = await doFetch()
  if (res.status === 401 && shouldTryRefresh(path)) {
    const ok = await refreshAdminSession()
    if (ok) res = await doFetch()
  }
  return res
}
