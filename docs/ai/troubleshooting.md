# Troubleshooting — react-producer

## Login succeeds but immediate redirect to login / “Checking session…” forever

**Checks:**

- **`GET /admin/me`** returning HTML? Session guard treats as logged-out (`responseLooksLikeJson`).
- Dev: verify **Vite bypass** — only **`GET /admin/me`** proxies; wrong pathname breaks probe.
- **`ADMIN_ME_GUARD_TIMEOUT_MS`** (20s) abort — slow API surfaces as login page stuck until timeout handling kicks in.

## 401 loops or endless refresh

Rare if API refresh endpoint broken — `adminFetch` retries once. Inspect Network tab for **`/admin/refresh`** failures.

## Cookies not sent cross-origin

**Symptoms:** Works on localhost proxy; fails on Vercel + Render split.

**Fix:** Align **`VITE_API_URL`** hostname with how users open the site; API **`CORS_ORIGINS`**, **`SameSite=None`**, **`Secure`**, HTTPS — see `.env.example`.

## `/beats` shows JSON in browser instead of catalog page (dev)

Usually wrong **`Accept`** header on navigation — HTML navigations must send `text/html`. Direct API testing from browser address bar may hit FastAPI depending on server — use routed SPA links inside React.

If occurred inside dev tools fetch — expected.

## Catalog empty after API has data

- Network errors → `useCatalogBeats` sets `loadError`.
- Wrong API base (`VITE_API_URL` typo).
- CORS blocking **`GET /catalog/beats`** when cross-origin.

## Admin saved beat but homepage still shows old featured list

**Known behavior:** `useCatalogBeats` loads once — does not subscribe to **`notifyCatalogBeatsChanged`**. Refresh page or enhance hook. Cart **does** resync.

## Multipart save fails with 415

Server MIME validation — ensure files match allowed types (MP3/WAV, ZIP, PNG/JPEG) per backend.

## Contact always fails

- Backend returns **503** if Resend unset — UI shows parsed `detail`.
- **429** rate limit — UI maps friendly string.

## Waveform / preview audio silent

- CDN CORS / mixed content (HTTP page + HTTPS audio).
- Invalid/expired media URL in JSON.

## Build fails

- Node version too old for Vite 5 — upgrade Node.
- Missing env not usually fatal unless code references `import.meta.env` unsafely — brand defaults exist (`producerBrand.js`).

## Dependency install issues

- Delete `node_modules` + lockfile conflicts — `npm ci` vs `npm install` per team policy.
