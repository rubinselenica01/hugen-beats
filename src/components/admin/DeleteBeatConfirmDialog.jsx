import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js'
import { MaterialIcon } from '../ui/MaterialIcon.jsx'

export function DeleteBeatConfirmDialog({ beat, isDeleting = false, onClose, onConfirm }) {
  const titleId = useId()
  const descId = useId()

  const open = beat != null
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open || isDeleting) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, isDeleting, onClose])

  if (!open) return null

  const label =
    typeof beat.title === 'string' && beat.title.trim() ? beat.title.trim() : 'this beat'

  async function handleDelete() {
    await onConfirm(beat)
  }

  const backdropClick = () => {
    if (!isDeleting) onClose()
  }

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={backdropClick}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-md rounded-lg border border-nav-border bg-surface/95 p-6 shadow-xl"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-400/35">
            <MaterialIcon name="warning" className="text-[26px] text-red-300" filled />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="font-display text-lg font-bold text-white">
              Delete this beat permanently?
            </h2>
            <p id={descId} className="mt-3 text-sm leading-relaxed text-text-muted">
              <span className="font-semibold text-text-main">{label}</span> will be removed from your catalog
              and its files deleted from storage (preview, cover, premium ZIP). This cannot be undone.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                className="rounded-md border border-nav-border px-4 py-2 text-sm font-semibold text-text-main transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => void handleDelete()}
              >
                {isDeleting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <MaterialIcon name="delete" className="text-[18px]" filled />
                    Delete permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
