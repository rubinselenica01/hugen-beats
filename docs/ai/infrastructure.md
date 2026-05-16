# Infrastructure — react-producer

## What ships

- **Static SPA** (`dist/` after build) — no Node server required for serving (platform-dependent).

## Dev infrastructure

- **Vite dev server** — serves modules + **`server.proxy`** to FastAPI on **`127.0.0.1:8000`** for `/catalog`, `/beats`, `/api`, `/admin` with path-specific **`bypass`** rules (`vite.config.js`).

## Hosting (typical)

- **Vercel** — `vercel.json` SPA rewrite.
- Build pipeline injects **`VITE_*`** at compile time.

## External assets (browser egress)

From `index.html`:

- **Google Fonts** — Inter + Material Symbols stylesheets.
- Favicon **`/hugen-music-logo.png`** from app public assets.

## Edge / CDN for media

Preview/cover URLs come from **catalog JSON** (API-configured CDN/R2). SPA does not proxy audio/images through Vite in production — browsers fetch CDN URLs directly → **bucket CORS** must allow the SPA origin.

## Observability

No built-in analytics or error reporting SDKs in dependencies.

## Scaling

- Stateless static hosting scales horizontally trivially.
- Admin refresh dedupe (`refreshInFlight`) is **per tab** — not a cluster concern.

## Related systems

- **Beat Producer API** — auth, persistence, email relay, storage uploads.
