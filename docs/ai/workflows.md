# Workflows — react-producer

## First-time local setup

1. Install Node.js compatible with Vite 5.
2. From `react-producer/`: `npm install`.
3. Copy `.env.example` → `.env`; leave `VITE_API_URL` empty for proxy-based dev (or set explicit origin if hitting API directly).
4. Start backend API on **port 8000** (matches `vite.config.js` proxy target).
5. `npm run dev` — open **`http://localhost:5173`** (preferred over mixing `127.0.0.1` if using cookie auth — see `.env.example`).

## Running services

| Goal | Command |
|------|---------|
| Dev HMR | `npm run dev` |
| Production bundle | `npm run build` → outputs `dist/` |
| Preview bundle locally | `npm run preview` |

## Debugging

- **Network:** Browser DevTools → Application → Cookies; confirm `access_token` / `refresh_token` for admin origin.
- **Proxy:** If `/admin/me` returns HTML, JSON guard fails — check Vite bypass rules and path (`GET` vs `POST`).
- **Stale admin list:** `adminFetch` forces `cache: 'no-store'` on GET — if still stale, inspect intermediary caches/CDN on production.

## Migrations

Not applicable (no DB). Cart schema changes require careful `localStorage` migration if keys/shape change (`CartContext.jsx`).

## Deployment flow (typical)

1. `npm run build`.
2. Deploy **`dist/`** to static host (e.g. Vercel with `vercel.json` SPA rewrite).
3. Set **`VITE_*`** env vars in host dashboard **at build time** (Vite inlines them).

## Git workflow

Follow repository standards; ensure `.env` is not committed (check `.gitignore`).

## Release process

No automated versioning in repo — `package.json` version `0.0.0`.

## Feature lifecycle (suggested)

1. Add route in `constants/routes.js` + `App.jsx`.
2. Add API helper in `utils/` or `services/`.
3. For admin routes, use `RequireAdminSession` or explicit session checks.
4. If catalog-affecting, call **`notifyCatalogBeatsChanged()`** after successful mutations and decide whether storefront hooks should subscribe (today only cart does).
