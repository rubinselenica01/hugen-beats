import { apiUrl } from './apiBase.js'

/**
 * Fetch beats for homepage / catalog (read-only catalog API).
 * Authenticated admin listing remains GET /beats — do not call that from public pages.
 */
export async function fetchCatalogBeats() {
  const res = await fetch(apiUrl('/catalog/beats'), {
    headers: { Accept: 'application/json' },
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
  return {
    id: String(api.id),
    title: api.title,
    description: `${api.bpm} BPM · ${api.duration}s. Non-exclusive lease — choose a plan below.`,
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
