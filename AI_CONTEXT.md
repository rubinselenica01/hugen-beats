# Project Overview

**react-producer** (npm package name in `package.json`: **`hugen-music`**) is a **React 18 SPA** built with **Vite 5**, **React Router 6**, and **Tailwind CSS 3**. It is the storefront and admin UI for the Beat Producer ecosystem: it reads the public catalog from **`GET /catalog/beats`**, performs admin beat CRUD via **`/beats`** with **HttpOnly cookie JWTs**, and submits the contact form to **`POST /api/contact`**.

There is **no backend inside this package** — it assumes a **FastAPI Beat Producer API** (see sibling **`beat-producer`** in the monorepo). There is **no payment integration** in code: the cart **Checkout** control is presentational only (`CartDrawer.jsx`).

---

# Tech Stack

| Layer | Choice |
|--------|--------|
| UI | React 18.3, function components, hooks |
| Routing | `react-router-dom` 6 (`BrowserRouter`) |
| Build | Vite 5, `@vitejs/plugin-react` |
| Styling | Tailwind 3, `@tailwindcss/typography`, `darkMode: 'class'` on `<html class="dark">` |
| Audio UI | `wavesurfer.js` 7 (preview bar in `BeatPreviewPlayerBar.jsx`) |
| Icons | Google Material Symbols Outlined + wrapper `MaterialIcon.jsx` |
| HTTP | Native `fetch` (no axios) |

---

# Architecture Summary

**Pattern:** Client-only SPA with **two networking modes**:

1. **Local dev (default):** `VITE_API_URL` empty → `apiUrl()` returns **relative** paths → Vite dev server **proxies** `/catalog`, `/beats` (JSON API only), `/api`, `/admin` to `http://127.0.0.1:8000` so **cookies stay same-origin** with the Vite origin.
2. **Split deployment:** `VITE_API_URL=https://api.example.com` → absolute API URLs; backend must send cookies with **`SameSite=None; Secure`** and **`Access-Control-Allow-Credentials`** + explicit CORS origins.

**State:**

- **Server-backed:** Catalog beats, admin session (cookies), beats list for admin.
- **Client-only:** Shopping cart in **`localStorage`** key `hugen-music-cart`; pruned when catalog sync shows beats removed/hidden.

**Catalog mutation signaling:** After admin save/delete, `notifyCatalogBeatsChanged()` uses **`BroadcastChannel`** (with window event fallback). **`CartProvider`** subscribes and refetches catalog to prune cart. **`useCatalogBeats`** (home + catalog pages) **does not subscribe** — featured/catalog lists stay stale until navigation/full reload unless extended.

---

# Key Modules

| Area | Files |
|------|--------|
| API base | `src/utils/apiBase.js` — `apiUrl`, `jsonAcceptHeaders` |
| Admin HTTP | `src/utils/adminFetch.js` — `credentials: 'include'`, 401→`/admin/refresh` retry |
| Session probe | `src/utils/adminSession.js` — `GET /admin/me` + JSON guard |
| Public catalog | `src/utils/catalogBeatsApi.js` — fetch, display mapping, catalog sync channel |
| FastAPI errors | `src/utils/fastApiParse.js` — `detail` string/array |
| Routes | `src/constants/routes.js` |
| Auth gate | `src/components/auth/RequireAdminSession.jsx` |
| Admin CRUD UI | `src/pages/AdminBeatManagementPage.jsx`, `src/components/admin/AddBeatDialog.jsx` |
| Cart | `src/context/CartContext.jsx`, `src/components/layout/CartDrawer.jsx` |
| Preview playback | `src/utils/beatPreviewPlayback.js`, hooks, `BeatPreviewPlayerBar.jsx` |

---

# Folder Structure

```
react-producer/
  index.html
  vite.config.js          # dev proxy + SPA bypass rules
  tailwind.config.js
  postcss.config.js
  vercel.json             # SPA fallback rewrites
  package.json            # name: "hugen-music"
  src/
    main.jsx
    App.jsx
    index.css
    producerBrand.js      # VITE_PRODUCER_BRAND
    constants/
    context/
    components/
    hooks/
    pages/
    services/             # contactService.js
    utils/
    data/                 # static marketing copy (homeContent.js)
```

---

# Development Commands

```bash
npm install
npm run dev      # Vite dev server (default port 5173)
npm run build
npm run preview  # production build preview
```

Run **FastAPI** on port **8000** when using default proxy targets in `vite.config.js`.

---

# Environment Variables

Vite exposes only **`VITE_*`** to client code.

| Variable | Role |
|----------|------|
| `VITE_API_URL` | API origin **without** trailing slash; empty = relative URLs + dev proxy |
| `VITE_PRODUCER_BRAND` | Brand string (`producerBrand.js`, document title suffix) |
| `VITE_CONTACT_EMAIL` | Footer / marketing (via `homeContent` wiring) |
| `VITE_SOCIAL_*` | Social URLs for footer |

See `.env.example` for **localhost vs 127.0.0.1** cookie caveat.

---

# Coding Conventions

- **JS + JSX** with `.js` / `.jsx` extensions; JSDoc on some utilities.
- **Paths:** import `routes` from `constants/routes.js` instead of string literals.
- **Admin API:** prefer `adminFetch` over raw `fetch` for cookie + refresh behavior.
- **Public catalog:** `fetchCatalogBeats` / `fetch` without credentials (no cookies required).
- **Forms:** Admin login JSON to `/admin/login`; beat create uses `FormData(form)`; beat edit builds `FormData` manually for optional files + `isHidden` boolean.

---

# API Conventions

- JSON **`Accept`** header on API-oriented requests (`jsonAcceptHeaders`).
- FastAPI error body: `{ detail: string | ValidationError[] }` parsed by `parseFastApiErrorDetail`.
- **`GET /beats`** uses **`cache: 'no-store'`** in `adminFetch` to avoid stale admin list after PATCH.

---

# Database Conventions

**No database in this app.** Persistent browser state: cart JSON in `localStorage`. Authoritative beat data lives in the API’s PostgreSQL.

---

# Security Rules

- Admin auth relies on **HttpOnly cookies** — mitigate XSS; note **CSRF** for cookie-auth mutations if third-party sites can trigger requests (typically low risk for same-site admin).
- **`checkAdminSession`** / **`RequireAdminSession`** require **`Content-Type: application/json`** responses (`responseLooksLikeJson`) to detect SPA/CDN misrouting (HTML 200).
- Contact form: client-side validation + server rate limit (**429**) messaging in `contactService.js`.

---

# Testing Strategy

**No test runner** in `package.json` (`dev`, `build`, `preview` only). See `docs/ai/testing.md`.

---

# Deployment Overview

- **`vercel.json`:** rewrite all paths to `/index.html` for SPA routing.
- API must allow frontend origin in CORS when using **`VITE_API_URL`** cross-origin.

---

# Business Rules

1. **Catalog vs admin listing:** Storefront uses **`/catalog/beats`** (hidden beats omitted). Admin uses **`GET /beats`** (all beats, `isHidden`, `premiumFilesKey`).
2. **Hidden beats:** Not shown on public routes; cart lines for removed/hidden IDs pruned after catalog refetch (triggered by admin mutations **via cart subscription**, not via homepage hook).
3. **Prices:** Displayed as whole USD from API integer; cart totals parse `$`-style strings via regex in `CartDrawer`.
4. **Checkout:** Not implemented — button has no handler.

---

# Common Workflows

- **Local full stack:** Docker/API on `:8000`, `npm run dev`, open **`http://localhost:5173`** (match `.env.example` guidance for cookie Site alignment).
- **Admin:** Navigate `/admin/login` → on success, `/admin/beat-management` (guarded by `RequireAdminSession`).
- **Add/edit beat:** Multipart to API through `adminFetch`; files uploaded **through the API** to object storage (comment in `AddBeatDialog.jsx`).

---

# DO NOT

- Point some tabs at `localhost` and others at `127.0.0.1` — cookies may not apply across both.
- Use raw `fetch('/beats')` for admin without `adminFetch` (misses credentials default + refresh).
- Assume **`GET /beats`** from browser path `/beats` — Vite **bypass** serves **`index.html`** for **GET HTML** navigation to `/beats` (catalog page); JSON API uses Accept negotiation per proxy rules.
- Ship relying on **homepage `useCatalogBeats`** reflecting admin changes without a reload or subscription — currently inconsistent with cart sync.

---

# AI Agent Guidance

1. Read **`vite.config.js` proxy `bypass`** before changing routes — collisions between SPA paths (`/beats`, `/admin/*`) and API paths are deliberate.
2. Extend **`adminFetch`** / **`apiUrl`** for new authenticated endpoints; keep **`credentials: 'include'`** where cookies matter.
3. For real-time catalog UX after admin edits, either subscribe pages to `subscribeCatalogSyncMessages` or lift catalog state to a provider (align with `CartContext` pattern).
4. **`package.json` `name`** is `hugen-music` — do not rename folder assumptions without checking deploy configs.
5. Integrating Stripe/checkout: wire **`CartDrawer`** and add env + API calls in new modules; none exist today.

---

# Doc map

| Doc | Focus |
|-----|--------|
| `docs/ai/architecture.md` | Diagrams, flows, proxy behavior |
| `docs/ai/conventions.md` | Naming, hooks, errors |
| `docs/ai/workflows.md` | Setup, deploy |
| `docs/ai/glossary.md` | Terms |
| `docs/ai/api-patterns.md` | Endpoints from SPA perspective |
| `docs/ai/infrastructure.md` | Vercel, Vite, fonts CDN |
| `docs/ai/testing.md` | Gap + Vitest suggestions |
| `docs/ai/security.md` | Cookies, CORS, guards |
| `docs/ai/database.md` | localStorage cart schema |
| `docs/ai/frontend.md` | UI composition |
| `docs/ai/backend.md` | External API dependency |
| `docs/ai/deployment.md` | Build & hosting |
| `docs/ai/integrations.md` | Backend, email, audio |
| `docs/ai/troubleshooting.md` | Common failures |
