import { apiUrl, jsonAcceptHeaders } from './apiBase.js'

/** Same-tab listener for {@link notifyCatalogBeatsChanged}. */
export const CATALOG_BEATS_CHANGED_EVENT = 'hugen-music-catalog-beats-changed'

const CATALOG_SYNC_BC = 'hugen-music-catalog-sync'

/**
 * Call after admin creates/updates/deletes beats so storefront clients resync GET /catalog/beats.
 * Uses BroadcastChannel when available (same tab + other tabs); falls back to a window event.
 */
export function notifyCatalogBeatsChanged() {
  if (typeof window === 'undefined') return
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel(CATALOG_SYNC_BC)
      bc.postMessage({ type: 'mutated' })
      bc.close()
      return
    } catch {
      /* fall through */
    }
  }
  window.dispatchEvent(new Event(CATALOG_BEATS_CHANGED_EVENT))
}

/**
 * One listener per channel: either BroadcastChannel (preferred) or window event — not both, to avoid duplicate fetches.
 * @returns unsubscribe
 */
export function subscribeCatalogSyncMessages(handler) {
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel(CATALOG_SYNC_BC)
      const fn = () => handler()
      bc.addEventListener('message', fn)
      return () => {
        bc.removeEventListener('message', fn)
        bc.close()
      }
    } catch {
      /* fall through */
    }
  }
  if (typeof window === 'undefined') return () => {}
  const fn = () => handler()
  window.addEventListener(CATALOG_BEATS_CHANGED_EVENT, fn)
  return () => window.removeEventListener(CATALOG_BEATS_CHANGED_EVENT, fn)
}

/**
 * Fetch storefront catalog beats (read-only catalog API).
 *
 * Authenticated admin listing remains GET /beats — do not call that from public pages.
 * Pass `fetch` options (e.g. `{ cache: 'no-store' }`) when you must bypass HTTP caches.
 */
export async function fetchCatalogBeats(fetchInit = {}) {
  const { headers: extraHeaders = {}, ...rest } = fetchInit
  const res = await fetch(apiUrl('/catalog/beats'), {
    headers: { ...jsonAcceptHeaders, ...extraHeaders },
    ...rest,
  })
  if (!res.ok) {
    throw new Error(`Catalog beats request failed (${res.status})`)
  }
  return res.json()
}

/** Format catalog API price (integer whole dollars) for BeatCard. */
function formatCatalogPrice(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—'
  return `$${value}`
}

/** Normalize API beat for BeatCard + FeaturedBeatsSection (includes `licenseTrack` for LicenseModal). */
export function apiBeatToDisplayBeat(api) {
  const id = api.id
  const priceLabel = formatCatalogPrice(api.price)
  return {
    id,
    title: api.title,
    description: typeof api.description === 'string' ? api.description : '',
    meta: `${api.bpm} BPM · ${api.duration}s`,
    price: priceLabel,
    image: api.coverImageFile,
    alt: api.title ? `Cover: ${api.title}` : 'Cover',
    previewAudioUrl: api.previewAudioFile,
    previewPlaybackId: id,
    licenseTrack: apiBeatToLicenseTrack(api),
  }
}

/** Shape expected by LicenseModal / cart (track.id must be string for CartContext validation). */
export function apiBeatToLicenseTrack(api) {
  const planPrice = formatCatalogPrice(api.price)
  const desc = typeof api.description === 'string' ? api.description.trim() : ''
  return {
    id: String(api.id),
    title: api.title,
    description: desc
      ? desc
      : `${api.bpm} BPM · ${api.duration}s. Non-exclusive lease — choose a plan below.`,
    tags: [],
    image: api.coverImageFile,
    alt: api.title ? `Cover: ${api.title}` : 'Cover',
    previewAudioUrl: api.previewAudioFile,
    previewPlaybackId: api.id,
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full Lease',
        price: planPrice,
        detail: 'MP3 + WAV + stems + lifetime non-exclusive license (final terms at checkout).',
      },
    ],
  }
}
