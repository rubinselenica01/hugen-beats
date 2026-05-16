# Backend — react-producer

This repository **does not contain a backend**. It is a **static React SPA** that calls an external **Beat Producer FastAPI** service.

## Expected API capabilities

Derived from client usage:

- Cookie-based **`/admin/login`**, **`/admin/logout`**, **`/admin/refresh`**, **`/admin/me`**.
- **`GET /catalog/beats`** — public JSON array (camelCase fields such as `coverImageFile`).
- **`GET/POST/PATCH/DELETE /beats`** — authenticated; multipart for create/update.
- **`POST /api/contact`** — JSON contact submission.

## Canonical implementation

In this monorepo, **`beat-producer/`** implements the FastAPI app described in its own `AI_CONTEXT.md`. Keep client/server docs aligned when changing routes or field names.

## Local coupling

`vite.config.js` proxies to **`http://127.0.0.1:8000`** — start API there or adjust proxy targets.

## When adding a backend here

Not planned — if splitting, introduce a dedicated package rather than mixing Express into this Vite app without explicit architectural decision.
