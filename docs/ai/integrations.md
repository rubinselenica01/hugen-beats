# Integrations — react-producer

## Beat Producer FastAPI (primary)

| Capability | Client module |
|------------|----------------|
| Cookie login/logout/refresh | `LoginPage.jsx`, `adminFetch.js` |
| Session probe | `adminSession.js` |
| Catalog listing | `catalogBeatsApi.js`, `useCatalogBeats.js` |
| Admin beats CRUD | `AdminBeatManagementPage.jsx`, `AddBeatDialog.jsx` |
| Contact email relay | `contactService.js` → **`POST /api/contact`** |

Multipart field names for beats align with backend **`deps.py`** expectations (`premium_files`, `cover_image`, etc.).

## Media / CDN

- Preview MP3/WAV and cover image URLs are **absolute HTTPS strings** in JSON — loaded by `<img>`, `<audio>`, and **wavesurfer.js**.
- **No direct browser upload to R2** — files go API-first (`AddBeatDialog.jsx` comment).

## wavesurfer.js

- **`BeatPreviewPlayerBar.jsx`** constructs `WaveSurfer.create({ media: session.audio, url: session.url, ... })` bound to shared playback session (`beatPreviewPlayback.js`).

## Google Fonts & Material Symbols

- Loaded from **fonts.googleapis.com** in `index.html` — offline/air-gapped builds would need self-hosting.

## Payment providers

**Not integrated.** `CartDrawer.jsx` renders a **Checkout** button without `onClick` or Stripe/PayPal SDK.

## Email providers

None client-side — contact uses API → **Resend** on backend.

## Webhooks / queues / messaging

None.

## Analytics

None in `package.json` dependencies.

## Third-party summary

| Service | Role |
|---------|------|
| Backend API | Data + auth + email + uploads |
| CDN (from API URLs) | Serve preview/cover media |
| Google Fonts | Typography + icons |
