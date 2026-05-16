# Conventions — react-producer

## Naming

| Kind | Style | Example |
|------|-------|---------|
| React components | `PascalCase.jsx` | `BeatCard.jsx`, `CartDrawer.jsx` |
| Hooks | `useCamelCase.js` | `useCatalogBeats.js` |
| Utilities / services | `camelCase.js` | `adminFetch.js`, `catalogBeatsApi.js` |
| Constants export | `routes` frozen object | `routes.adminLogin` |
| CSS classes | Tailwind utility strings | `page-container`, `bg-background-dark` |
| localStorage key | kebab project prefix | `hugen-music-cart` |
| BroadcastChannel / events | `hugen-music-*` prefix | `hugen-music-catalog-sync` |

**Package vs folder:** `package.json` **`name`** is `"hugen-music"`; repository folder is **`react-producer`**.

## File organization

- **`pages/`** — route components (`HomePage`, `BeatsCatalogPage`, `LoginPage`, etc.).
- **`components/ui/`** — reusable primitives (buttons, cards, modals).
- **`components/layout/`** — shell, nav, footer, cart drawer.
- **`components/sections/`** — marketing sections composed on home.
- **`components/admin/`** — admin-only dialogs.
- **`components/auth/`** — route guards.
- **`hooks/`** — reusable React hooks (scroll lock, preview playback, catalog load).
- **`utils/`** — pure/network helpers (no JSX).
- **`services/`** — feature-oriented client modules (`contactService.js`).
- **`data/`** — static content blobs (`homeContent.js`), not API data.

## API field naming

Backend JSON uses **camelCase** for several beat fields (`coverImageFile`, `previewAudioFile`, `isHidden`, `premiumFilesKey`). The SPA maps these in `catalogBeatsApi.js` into display beats (`meta`, `licenseTrack`, string `id` for cart).

## Error handling

- **adminFetch:** Does not throw on HTTP errors — callers check `res.ok` / `res.status`.
- **LoginPage:** Distinguishes abort (`LOGIN_SUBMIT_TIMEOUT_MS`), network (`isNetworkFailure`), 5xx (`isServerErrorHttpStatus`), and parses `detail` via `parseFastApiErrorDetail`.
- **contactService:** Returns discriminated `{ ok: true } | { ok: false, error, fieldErrors? }` instead of throwing.

## Logging

No centralized logger — UI surfaces errors as inline alerts.

## Validation

- **Contact:** `validateContactForm` mirrors backend-ish rules (message ≥ 10 chars); regex email check client-side.
- **Beat forms:** HTML5 `required` / `min` / `maxLength` + dialog checks that create flow has three files.

## Dependency injection style

None — hooks call module functions directly. Context only for cart (`CartContext`).

## Async patterns

- `useEffect` + async IIFE + `cancelled` flag for navigation safety (`AdminBeatManagementPage`, `LoginPage`).
- `adminFetch` refresh uses module-level promise deduplication (`refreshInFlight`).

## Typing

- **JavaScript** with JSDoc (`@param`, `@returns`) on selected utilities; `src/vite-env.d.ts` for Vite types.

## Formatting

- No ESLint/Prettier config committed — match existing 2-space indent and single quotes in new files.

## Anti-patterns to avoid

- Importing API URLs as string literals instead of `apiUrl()` / `routes`.
- Adding authenticated calls without `credentials: 'include'` when cookies are required.
- Assuming **`useCatalogBeats`** refetches when admin mutates catalog (it does not today).
