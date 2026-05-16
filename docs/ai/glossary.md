# Glossary — react-producer

| Term | Meaning |
|------|---------|
| **`apiUrl(path)`** | Prefixes `VITE_API_URL` when set; otherwise returns relative path for proxy/same-origin. |
| **`adminFetch`** | Wrapper around `fetch` with JSON Accept defaults, **`credentials: 'include'`**, GET **`no-store`**, and 401 refresh retry. |
| **`licenseTrack`** | Object shape built by `apiBeatToLicenseTrack` for **`LicenseModal`** / cart — includes synthetic single plan “Full Lease”. |
| **`previewPlaybackId`** | Stable id for preview UI (numeric beat id from API); drives global preview bar + dedupe. |
| **`notifyCatalogBeatsChanged`** | Fire-and-forget signal after admin beat mutations so **`CartProvider`** refetches catalog. |
| **`RequireAdminSession`** | Route wrapper probing **`GET /admin/me`** before rendering children. |
| **`responseLooksLikeJson`** | Content-Type contains `application/json` — guards misconfigured hosts returning HTML for API paths. |
| **`routes.adminBeatManagement`** | `/admin/beat-management` — post-login default (`routes.js`). |
| **SPA proxy bypass** | Vite logic routing browser navigations to **`index.html`** where URL overlaps API paths (`/beats`, `/admin/...`). |
