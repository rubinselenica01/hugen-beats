/** Single shared HTMLAudioElement; UI state keyed by `playbackId` (e.g. beat id). */

let activePlaybackId = null
const listeners = new Set()
const sessionListeners = new Set()

let player = {
  audio: null,
  url: null,
  onEnded: null,
  onPlay: null,
  onPause: null,
  playbackId: null,
  meta: null,
}

function notifyPlayback(playbackId) {
  activePlaybackId = playbackId
  listeners.forEach((fn) => fn(playbackId))
}

function getSessionSnapshot() {
  if (!player.audio || player.playbackId == null) return null
  return {
    playbackId: player.playbackId,
    url: player.url,
    audio: player.audio,
    meta: player.meta,
  }
}

function notifySession() {
  const snap = getSessionSnapshot()
  sessionListeners.forEach((fn) => fn(snap))
}

function teardownMediaListeners() {
  if (player.audio && player.onPlay) {
    player.audio.removeEventListener('play', player.onPlay)
    player.audio.removeEventListener('pause', player.onPause)
  }
}

/** Subscribe to the active preview card id (beat id), or null when not actively playing. */
export function subscribeBeatPreviewPlayback(listener) {
  listeners.add(listener)
  listener(activePlaybackId)
  return () => listeners.delete(listener)
}

/**
 * Active track session (bar stays visible while paused or after playback ends). Null when idle or stopped.
 */
export function subscribeBeatPreviewSession(listener) {
  sessionListeners.add(listener)
  listener(getSessionSnapshot())
  return () => sessionListeners.delete(listener)
}

/**
 * @param {string} url
 * @param {number|string} playbackId
 * @param {{ title?: string, image?: string, alt?: string } | null} [meta]
 */
export function toggleBeatPreviewPlayback(url, playbackId, meta = null) {
  if (!url || playbackId == null) return
  if (
    player.url === url &&
    player.audio &&
    player.playbackId === playbackId
  ) {
    if (player.audio.paused) {
      if (player.audio.ended) {
        player.audio.currentTime = 0
      }
      player.audio.play().catch(() => {})
      notifyPlayback(playbackId)
      notifySession()
    } else {
      player.audio.pause()
      notifyPlayback(null)
      notifySession()
    }
    return
  }

  teardownMediaListeners()

  if (player.audio && player.onEnded) {
    player.audio.pause()
    player.audio.removeEventListener('ended', player.onEnded)
  }

  const audio = new Audio(url)
  /* Required for waveform / Web Audio when preview URL is on a CDN (cross-origin). */
  audio.crossOrigin = 'anonymous'
  const onEnded = () => {
    notifyPlayback(null)
    notifySession()
  }
  const onPlay = () => notifySession()
  const onPause = () => notifySession()
  audio.addEventListener('ended', onEnded)
  audio.addEventListener('play', onPlay)
  audio.addEventListener('pause', onPause)

  player = {
    audio,
    url,
    onEnded,
    onPlay,
    onPause,
    playbackId,
    meta: meta ?? null,
  }

  notifyPlayback(playbackId)
  notifySession()
  audio.play().catch(() => {
    teardownMediaListeners()
    notifyPlayback(null)
    player = {
      audio: null,
      url: null,
      onEnded: null,
      onPlay: null,
      onPause: null,
      playbackId: null,
      meta: null,
    }
    notifySession()
  })
}

/** Stop playback and hide the bottom bar session. */
export function stopBeatPreviewPlayback() {
  teardownMediaListeners()
  if (player.audio && player.onEnded) {
    player.audio.pause()
    player.audio.removeEventListener('ended', player.onEnded)
  }
  player = {
    audio: null,
    url: null,
    onEnded: null,
    onPlay: null,
    onPause: null,
    playbackId: null,
    meta: null,
  }
  notifyPlayback(null)
  notifySession()
}
