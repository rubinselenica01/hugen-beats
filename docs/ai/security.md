# Security — react-producer

## Authentication mechanism

- **HttpOnly cookies** issued by API (`access_token`, `refresh_token` — names defined server-side).
- SPA sends them with **`fetch(..., { credentials: 'include' })`** via **`adminFetch`** only (public catalog/contact omit credentials).

## JWT handling

- Tokens are **not readable** from JS (HttpOnly) — correct for XSS token theft mitigation.
- Refresh orchestrated client-side by **`POST /admin/refresh`** on 401.

## Session probing hardening

`responseLooksLikeJson` rejects responses whose `Content-Type` lacks `application/json`, addressing accidental HTML 200 from static hosts/CDNs misrouting `/admin/me`.

```8:12:src/utils/fastApiParse.js
export function responseLooksLikeJson(res) {
  const raw = res.headers.get('content-type')
  return raw != null && raw.includes('application/json')
}
```

## Authorization / RBAC

- Client-side **`RequireAdminSession`** is UX-only — all enforcement must remain on API.

## CSRF

- Cookie-auth POST/PATCH from browser may be vulnerable to CSRF if API lacks protections — **not addressed in SPA**. Evaluate SameSite cookies + CSRF tokens if threat model requires.

## Secrets management

- **No runtime secrets** in SPA bundle except **`VITE_*`** marketing URLs — these are public by design after build.
- Never put API keys meant to stay private in `VITE_*`.

## CORS

- When UI and API differ by origin, backend must allow **`credentials`** and specific **`Origin`** values — documented in `.env.example`.

## Encryption

- HTTPS assumed production (`Secure` cookies); local dev often HTTP with `COOKIE_SECURE=false` on API side.

## Rate limiting

- Contact endpoint may return **429** — mapped to user-facing copy in `submitContact`.

## Boundaries

- **Contact form** sanitization primarily server-side; client trims and validates lengths/format.
- **File uploads** validated server-side (MIME allowlists) — client sets `accept` hints only.

## Known gaps

- Checkout button does nothing — no payment token handling.
- No Content Security Policy configuration in `index.html`.
