import { useCallback, useEffect, useState } from 'react'
import {
  subscribeBeatPreviewPlayback,
  toggleBeatPreviewPlayback,
} from '../utils/beatPreviewPlayback.js'

/** Whether the global preview player is playing this track id. */
export function useBeatPreviewPlaying(previewPlaybackId) {
  const [activePlaybackId, setActivePlaybackId] = useState(null)
  useEffect(() => subscribeBeatPreviewPlayback(setActivePlaybackId), [])
  return (
    previewPlaybackId != null &&
    activePlaybackId != null &&
    String(activePlaybackId) === String(previewPlaybackId)
  )
}

/** Click handler for preview play/pause (stops propagation for nested clickable cards). */
export function useBeatPreviewToggle(previewAudioUrl, previewPlaybackId, title, image, alt) {
  return useCallback(
    (e) => {
      e?.stopPropagation?.()
      if (!previewAudioUrl || previewPlaybackId == null) return
      toggleBeatPreviewPlayback(previewAudioUrl, previewPlaybackId, {
        title,
        image,
        alt,
      })
    },
    [previewAudioUrl, previewPlaybackId, title, image, alt],
  )
}
