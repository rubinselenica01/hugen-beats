import { useEffect, useState } from 'react'
import { apiBeatToDisplayBeat, fetchCatalogBeats } from '../utils/catalogBeatsApi.js'

/**
 * Load public catalog beats once; maps API rows to display shape.
 *
 * @returns {{ beats: Array | null, loadError: boolean, loading: boolean }}
 */
export function useCatalogBeats() {
  const [beats, setBeats] = useState(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchCatalogBeats()
      .then((raw) => {
        if (cancelled) return
        const list = Array.isArray(raw) ? raw.map(apiBeatToDisplayBeat) : []
        setBeats(list)
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true)
          setBeats([])
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const loading = beats === null && !loadError
  return { beats, loadError, loading }
}
