/**
 * Offset for fixed top nav — matches `--top-nav-height` in `index.css`.
 * Used so #anchors land with the section title visible below the bar, not under it.
 */
export function getTopNavHeightPx() {
  const root = document.documentElement
  const raw = getComputedStyle(root).getPropertyValue('--top-nav-height').trim()
  if (raw.endsWith('rem')) {
    const rem = parseFloat(raw, 10)
    const fontPx = parseFloat(getComputedStyle(root).fontSize) || 16
    return rem * fontPx
  }
  return 72
}

export function scrollElementBelowNav(el, { behavior = 'smooth' } = {}) {
  if (!el) return
  const y =
    el.getBoundingClientRect().top + window.scrollY - getTopNavHeightPx()
  window.scrollTo({ top: Math.max(0, y), behavior })
}
