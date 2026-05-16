# API patterns — react-producer

This SPA does not define server routes; it **consumes** the Beat Producer FastAPI API. Below maps **what this repo calls** to **HTTP**.

## Endpoints used

| Consumer | Method | Path | Credentials | Notes |
|----------|--------|------|-------------|-------|
| `checkAdminSession`, guards | GET | `/admin/me` | Yes (`adminFetch`) | JSON-only accepted |
| `LoginPage` | POST | `/admin/login` | Yes | JSON body `{ email, password }` |
| `AdminBeatManagementPage` | POST | `/admin/logout` | Yes | |
| `adminFetch` refresh | POST | `/admin/refresh` | Yes | Cookie refresh token |
| Public catalog | GET | `/catalog/beats` | No | `fetch` + JSON Accept |
| Admin list / CRUD | GET/POST/PATCH/DELETE | `/beats`, `/beats/:id` | Yes | Multipart for POST/PATCH |
| Contact | POST | `/api/contact` | No | JSON body |

## Authentication flow (browser)

1. User posts credentials to **`/admin/login`** — API sets HttpOnly cookies.
2. Subsequent **`adminFetch`** calls send cookies via **`credentials: 'include'`**.
3. On **401**, client **`POST /admin/refresh`** once, then retries.

```34:57:src/utils/adminFetch.js
export async function adminFetch(path, init = {}) {
  const { headers: incoming = {}, ...rest } = init
  const url = apiUrl(path)
  const method = (rest.method ?? 'GET').toString().toUpperCase()
  const doFetch = () =>
    fetch(url, {
      credentials: 'include',
      ...rest,
      headers: {
        ...defaultHeaders(),
        ...incoming,
      },
      cache:
        rest.cache ??
        (method === 'GET' ? 'no-store' : undefined),
    })

  let res = await doFetch()
  if (res.status === 401 && shouldTryRefresh(path)) {
    const ok = await refreshAdminSession()
    if (ok) res = await doFetch()
  }
  return res
}
```

## Authorization / RBAC

- **Binary:** Either public endpoints or **single admin** identity enforced server-side.
- Client only gates routes with **`RequireAdminSession`** — not a substitute for server auth.

## Request validation

- Client validates contact fields before POST (`contactService.js`).
- Beat dialogs rely on HTML constraints + manual file presence checks on create.

## Response formatting

- Expect JSON arrays for **`GET /catalog/beats`** and **`GET /beats`**.
- Errors: FastAPI **`detail`** parsed by `parseFastApiErrorDetail` (string or Pydantic-style array).

## Pagination

Not used — full lists loaded.

## Versioning

None client-side; relies on deployed API compatibility.

## OpenAPI / Swagger

Not embedded in SPA — developers use backend `/docs` when API runs locally.

## Example: login request

```http
POST /admin/login HTTP/1.1
Accept: application/json
Content-Type: application/json

{"email":"admin@example.com","password":"secret"}
```

## Example: catalog fetch (relative URL in dev)

```http
GET /catalog/beats HTTP/1.1
Accept: application/json
```

## Example: beat PATCH (multipart)

Built in `AddBeatDialog.jsx`: fields `title`, `description`, `bpm`, `duration`, `price`, `isHidden` (`"true"`/`"false"` strings), optional file parts `preview`, `premium_files`, `cover_image` matching FastAPI `Form`/`File` names.

## Deployment caveat

When **`VITE_API_URL`** points to another host, browsers enforce **CORS** + **cross-site cookies** — backend must align `Access-Control-Allow-Origin` (non-`*`) and cookie `SameSite`/`Secure` with `.env.example` guidance.
