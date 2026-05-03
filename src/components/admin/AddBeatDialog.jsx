import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js'
import { MaterialIcon } from '../ui/MaterialIcon.jsx'
import { adminFetch } from '../../utils/adminFetch.js'
import { parseFastApiErrorDetail } from '../../utils/fastApiParse.js'
import { isServerErrorHttpStatus } from '../../utils/netErrors.js'

/** Multipart POST — files are stored in R2 by the API; no browser upload to R2. */
export function AddBeatDialog({ open, onClose, onSaved }) {
  const formId = useId()
  const formRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    setError(null)
    formRef.current?.reset()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  async function onSubmit(e) {
    e.preventDefault()
    const form = formRef.current
    if (!form) return
    setError(null)

    const previewFile = form.elements.preview?.files?.[0]
    const premiumFile = form.elements.premium_files?.files?.[0]
    const coverFile = form.elements.cover_image?.files?.[0]
    if (!previewFile || !premiumFile || !coverFile) {
      setError('Please choose preview, ZIP, and cover image.')
      return
    }

    const fd = new FormData(form)

    setSubmitting(true)
    try {
      const res = await adminFetch('/beats', {
        method: 'POST',
        body: fd,
      })
      if (res.ok) {
        onSaved?.()
        onClose()
        return
      }
      let message = null
      try {
        const errBody = await res.json()
        message = parseFastApiErrorDetail(errBody?.detail)
      } catch {
        /* ignore */
      }
      if (!message) {
        message = isServerErrorHttpStatus(res.status)
          ? 'Something went wrong. Try again later.'
          : `Could not save (${res.status})`
      }
      setError(message)
    } catch {
      setError('Could not reach the server.')
    } finally {
      setSubmitting(false)
    }
  }

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-nav-border bg-surface/95 p-6 shadow-xl"
        onClick={(ev) => ev.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md border border-nav-border text-text-muted transition-colors hover:bg-white/5 hover:text-text-main disabled:opacity-50"
          aria-label="Close"
        >
          <MaterialIcon name="close" className="text-[22px]" />
        </button>
        <h2 id={`${formId}-title`} className="font-display pr-10 text-xl font-bold text-white">
          Add beat
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Preview (MP3 or WAV), premium bundle (ZIP), and cover image (JPEG or PNG) are required. Files are
          uploaded through the server to storage.
        </p>

        <form
          ref={formRef}
          id={`${formId}-form`}
          className="mt-6 flex flex-col gap-4"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-title`} className="text-sm font-medium text-text-muted">
              Title
            </label>
            <input
              id={`${formId}-title`}
              name="title"
              type="text"
              required
              maxLength={500}
              className="rounded-md border border-nav-border bg-background-dark px-3 py-2 text-sm text-text-main outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${formId}-bpm`} className="text-sm font-medium text-text-muted">
                BPM
              </label>
              <input
                id={`${formId}-bpm`}
                name="bpm"
                type="number"
                required
                min={1}
                step={1}
                className="rounded-md border border-nav-border bg-background-dark px-3 py-2 text-sm text-text-main outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${formId}-duration`} className="text-sm font-medium text-text-muted">
                Duration (seconds)
              </label>
              <input
                id={`${formId}-duration`}
                name="duration"
                type="number"
                required
                min={0.0001}
                step="any"
                className="rounded-md border border-nav-border bg-background-dark px-3 py-2 text-sm text-text-main outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-price`} className="text-sm font-medium text-text-muted">
              Price (USD, whole dollars)
            </label>
            <input
              id={`${formId}-price`}
              name="price"
              type="number"
              required
              min={0}
              step={1}
              defaultValue={0}
              className="rounded-md border border-nav-border bg-background-dark px-3 py-2 text-sm text-text-main outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-preview`} className="text-sm font-medium text-text-muted">
              Preview (MP3 or WAV)
            </label>
            <input
              id={`${formId}-preview`}
              name="preview"
              type="file"
              required
              accept=".mp3,.wav,audio/mpeg,audio/mp3,audio/wav"
              className="text-sm text-text-muted file:mr-3 file:rounded-md file:border-0 file:bg-primary/20 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-premium`} className="text-sm font-medium text-text-muted">
              Premium files (ZIP)
            </label>
            <input
              id={`${formId}-premium`}
              name="premium_files"
              type="file"
              required
              accept=".zip,application/zip"
              className="text-sm text-text-muted file:mr-3 file:rounded-md file:border-0 file:bg-primary/20 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-cover`} className="text-sm font-medium text-text-muted">
              Cover image
            </label>
            <input
              id={`${formId}-cover`}
              name="cover_image"
              type="file"
              required
              accept="image/jpeg,image/png,.jpg,.jpeg,.png"
              className="text-sm text-text-muted file:mr-3 file:rounded-md file:border-0 file:bg-primary/20 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-md border border-nav-border px-4 py-2 text-sm font-semibold text-text-main hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-background-dark hover:bg-primary-hover disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
