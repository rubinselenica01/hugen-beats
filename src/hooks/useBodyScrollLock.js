import { useEffect } from 'react'

const TOP_NAV_ID = 'site-top-nav'

let lockCount = 0
let snapshot = null

function scrollbarGapPx() {
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth)
}

function applyLock() {
  const gap = scrollbarGapPx()
  const navEl = document.getElementById(TOP_NAV_ID)
  snapshot = {
    bodyOverflow: document.body.style.overflow,
    bodyPaddingRight: document.body.style.paddingRight,
    navPaddingRight: navEl ? navEl.style.paddingRight : '',
    navEl,
  }
  document.body.style.overflow = 'hidden'
  if (gap > 0) {
    document.body.style.paddingRight = `${gap}px`
    if (navEl) navEl.style.paddingRight = `${gap}px`
  }
}

function releaseLock() {
  if (!snapshot) return
  document.body.style.overflow = snapshot.bodyOverflow
  document.body.style.paddingRight = snapshot.bodyPaddingRight
  if (snapshot.navEl) {
    snapshot.navEl.style.paddingRight = snapshot.navPaddingRight
  }
  snapshot = null
}

/**
 * Locks document scroll when `locked` is true and offsets fixed UI by the scrollbar width
 * so the layout does not shift when the scrollbar disappears.
 * Safe to nest (e.g. cart + modal) via reference counting.
 */
export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    lockCount += 1
    if (lockCount === 1) {
      applyLock()
    }
    return () => {
      lockCount -= 1
      if (lockCount === 0) {
        releaseLock()
      }
    }
  }, [locked])
}
