/** Parse FastAPI / Starlette `{ "detail": ... }` shapes for toast / inline messaging. */
export function parseFastApiErrorDetail(detail) {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail.map((x) => x.msg).join(' ')
  return null
}

/** Guards against CDN / SPA mistakenly returning `text/html` for API paths while still `200`. */
export function responseLooksLikeJson(res) {
  const raw = res.headers.get('content-type')
  return raw != null && raw.includes('application/json')
}

/** Body shape for `GET /admin/me` (FastAPI `MeResponse`). */
export function isMeResponseBody(data) {
  return (
    data != null &&
    typeof data === 'object' &&
    typeof data.email === 'string' &&
    data.email.trim() !== ''
  )
}
