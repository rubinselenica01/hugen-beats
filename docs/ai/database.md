# Database — react-producer

## Server database

**None in this package.** Beat metadata and URLs are stored in the **Beat Producer API** (PostgreSQL). This SPA only reads/writes via HTTP.

## Client persistence: shopping cart

**Storage:** `window.localStorage` key **`hugen-music-cart`**.

**Shape:** JSON array of **cart lines**:

```js
{
  lineId: string,       // crypto.randomUUID() or fallback
  track: object,        // license track shape from apiBeatToLicenseTrack
  plan: object          // { name, price, detail }
}
```

Validation on load (`CartContext.jsx`):

- `lineId`, `track.id`, `plan.name` must be strings; nested objects required.

**Pruning:** On mount and when catalog mutations broadcast, `fetchCatalogBeats({ cache: 'no-store' })` builds a `Set` of visible **`String(id)`** from catalog payload; lines whose `track.id` is absent are removed.

**Quota / privacy:** `setItem` wrapped in try/catch — failures ignored (private mode / quota).

## ORM / migrations

Not applicable.

## Repository pattern

Not used — direct `fetch` utilities.

## Transaction handling

Not applicable client-side.

## Indexing

Not applicable.

## Naming note

Cart dedupe key: **`cartLineKey(track, plan)`** = `` `${track.id}|${plan.name}` `` — changing plan names duplicates lines.
