# Deployment — react-producer

## Artifact

- **`npm run build`** produces static assets under **`dist/`** (Vite default).

## Static hosting

`vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Ensures deep links (`/beats`, `/admin/beat-management`) serve SPA shell.

## Docker / Kubernetes / Terraform

**None** in this package — containerization would be consumer-provided (e.g. nginx serving `dist/`).

## CI/CD

No `.github/workflows` or similar detected under `react-producer/` — assume manual or platform-native (Vercel Git integration).

## Cloud providers

- **Vercel** implied by `vercel.json`; not exclusive.

## Environment promotion

Build-time env vars (`VITE_*`) differ per environment — rebuild per stage.

## Runtime configuration

There is **no server runtime** — only static files + browser APIs.

## API coupling

Production SPA must reach API:

- Either **same origin** via reverse proxy not defined here, or
- **`VITE_API_URL`** pointing at API + correct CORS/cookies.

## CDN / caching

- **`adminFetch` GET** uses **`no-store`** to reduce stale admin lists.
- Catalog fetch in `useCatalogBeats` uses default fetch cache — CDN hosting of `index.html` should avoid caching HTML aggressively if problems arise.
