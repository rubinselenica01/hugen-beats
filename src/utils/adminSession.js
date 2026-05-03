import { adminFetch } from './adminFetch.js'
import { isMeResponseBody, responseLooksLikeJson } from './fastApiParse.js'

/**
 * Probe `/admin/me` for a valid cookie session (handles JSON vs HTML 200 from static hosts).
 *
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ ok: true, email: string } | { ok: false }>}
 */
export async function checkAdminSession(signal) {
  const res = await adminFetch('/admin/me', { signal })
  if (!res.ok || !responseLooksLikeJson(res)) {
    return { ok: false }
  }
  let data = null
  try {
    data = await res.json()
  } catch {
    return { ok: false }
  }
  if (!isMeResponseBody(data)) {
    return { ok: false }
  }
  return { ok: true, email: data.email }
}
