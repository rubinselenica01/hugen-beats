import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js'

export function LicensesOverlay({ open, onClose, title, paragraphs }) {
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const ui = (
    <>
      <div
        className="fixed inset-0 z-[85] animate-licenses-overlay-backdrop-in bg-background-dark/60 backdrop-blur-md"
        aria-hidden
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="licenses-overlay-title"
        className="fixed inset-0 z-[86] flex items-center justify-center p-6 sm:p-10"
        onClick={onClose}
      >
        <div
          className="relative max-h-[min(32rem,90vh)] w-full max-w-lg origin-center overflow-y-auto rounded-xl border border-white/10 bg-surface/95 p-6 shadow-2xl animate-licenses-overlay-panel-in sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-background-dark/90 text-text-muted transition-colors hover:border-primary/50 hover:text-white"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          <h2
            id="licenses-overlay-title"
            className="font-display pr-10 text-2xl font-bold tracking-tight text-white"
          >
            {title}
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-text-muted">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(ui, document.body)
}
