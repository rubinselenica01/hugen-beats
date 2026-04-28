export function isAbortError(error) {
  return error?.name === 'AbortError'
}

/** Fetch failed before a usable HTTP response (offline, connection refused, CORS/network). */
export function isNetworkFailure(error) {
  if (!error || typeof error !== 'object') return false
  if (error instanceof TypeError) return true
  if (error.name === 'NetworkError') return true
  return String(error.message ?? '')
    .toLowerCase()
    .includes('failed to fetch')
}

export function isServerErrorHttpStatus(status) {
  return status >= 500 && status < 600
}
