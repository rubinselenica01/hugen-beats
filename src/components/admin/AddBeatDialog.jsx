import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js'
import { MaterialIcon } from '../ui/MaterialIcon.jsx'
import { adminFetch } from '../../utils/adminFetch.js'
import { parseFastApiErrorDetail } from '../../utils/fastApiParse.js'
import { isServerErrorHttpStatus } from '../../utils/netErrors.js'

const NO_FILE = 'No file chosen'

function FilePickRow({
  id,
  name,
  accept,
  required,
  inputRef,
  pickedLabel,
  onPickedChange,
  chooseFileAriaLabel,
  removeFileAriaLabel = 'Remove selected file',
  className = '',
}) {
  const hasFile = pickedLabel !== NO_FILE

  function clearSelection() {
    const el = inputRef.current
    if (el) el.value = ''
    onPickedChange(NO_FILE)
  }

  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        required={required}
        accept={accept}
        tabIndex={-1}
        className="hidden"
        onChange={(e) => onPickedChange(e.target.files?.[0]?.name ?? NO_FILE)}
      />
      <button
        type="button"
        className="shrink-0 rounded-md border-0 bg-primary/20 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/30"
        aria-label={chooseFileAriaLabel}
        onClick={() => inputRef.current?.click()}
      >
        Choose File
      </button>
      <span className="min-w-0 flex-1 truncate text-sm text-text-muted">{pickedLabel}</span>
      {hasFile ? (
        <button
          type="button"
          className="shrink-0 rounded-md border border-nav-border px-2 py-1 text-xs font-semibold text-text-muted transition-colors hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-200"
          aria-label={removeFileAriaLabel}
          onClick={clearSelection}
        >
          Remove
        </button>
      ) : null}
    </div>
  )
}

/** Multipart POST/PATCH — files are stored in R2 by the API; no browser upload to R2. */
export function AddBeatDialog({ open, onClose, onSaved, beatToEdit = null }) {
  const formId = useId()
  const formRef = useRef(null)
  const previewAudioRef = useRef(null)
  const previewFileInputRef = useRef(null)
  const premiumFileInputRef = useRef(null)
  const coverFileInputRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [coverLightboxOpen, setCoverLightboxOpen] = useState(false)
  const [previewPlaying, setPreviewPlaying] = useState(false)
  const [pickedPreview, setPickedPreview] = useState(NO_FILE)
  const [pickedPremium, setPickedPremium] = useState(NO_FILE)
  const [pickedCover, setPickedCover] = useState(NO_FILE)
  const isEdit = beatToEdit != null
  const formKey = isEdit ? `edit-${beatToEdit.id}` : 'create'

  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) {
      setCoverLightboxOpen(false)
      previewAudioRef.current?.pause()
      setPreviewPlaying(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    setError(null)
    setPickedPreview(NO_FILE)
    setPickedPremium(NO_FILE)
    setPickedCover(NO_FILE)
    if (!isEdit) formRef.current?.reset()
  }, [open, isEdit, formKey])

  useEffect(() => {
    const el = previewAudioRef.current
    if (!el) return
    const sync = () => setPreviewPlaying(!el.paused)
    el.addEventListener('play', sync)
    el.addEventListener('pause', sync)
    el.addEventListener('ended', sync)
    return () => {
      el.removeEventListener('play', sync)
      el.removeEventListener('pause', sync)
      el.removeEventListener('ended', sync)
    }
  }, [open, isEdit, beatToEdit?.id, beatToEdit?.previewAudioFile])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (coverLightboxOpen) {
        setCoverLightboxOpen(false)
        return
      }
      onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, coverLightboxOpen])

  if (!open) return null

  async function onSubmit(e) {
    e.preventDefault()
    const form = formRef.current
    if (!form) return
    setError(null)

    const previewFile = previewFileInputRef.current?.files?.[0]
    const premiumFile = premiumFileInputRef.current?.files?.[0]
    const coverFile = coverFileInputRef.current?.files?.[0]

    if (!isEdit) {
      if (!previewFile || !premiumFile || !coverFile) {
        setError('Please choose preview, ZIP, and cover image.')
        return
      }
    }

    setSubmitting(true)
    try {
      let res
      if (isEdit) {
        const fd = new FormData()
        const fieldStr = (name) => {
          const el = form.elements.namedItem(name)
          return el && 'value' in el ? String(el.value) : ''
        }
        fd.append('title', fieldStr('title'))
        fd.append('description', fieldStr('description'))
        fd.append('bpm', fieldStr('bpm'))
        fd.append('duration', fieldStr('duration'))
        fd.append('price', fieldStr('price'))
        {
          const el = form.elements.namedItem('isHidden')
          const hidden = el && 'checked' in el ? el.checked : false
          fd.append('isHidden', hidden ? 'true' : 'false')
        }
        if (previewFile) fd.append('preview', previewFile)
        if (premiumFile) fd.append('premium_files', premiumFile)
        if (coverFile) fd.append('cover_image', coverFile)
        res = await adminFetch(`/beats/${beatToEdit.id}`, {
          method: 'PATCH',
          body: fd,
        })
      } else {
        const fd = new FormData(form)
        res = await adminFetch('/beats', {
          method: 'POST',
          body: fd,
        })
      }
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
        aria-labelledby={`${formId}-dialog-title`}
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
        <h2 id={`${formId}-dialog-title`} className="font-display pr-10 text-xl font-bold text-white">
          {isEdit ? 'Edit beat' : 'Add beat'}
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          {isEdit
            ? 'You can change metadata any time. Preview, ZIP, and cover are optional—only chosen files replace what is stored; leave a row unchanged to keep the current file.'
            : 'Preview (MP3 or WAV), premium bundle (ZIP), and cover image (JPEG or PNG) are required. Files are uploaded through the server to storage.'}
        </p>

        <form
          key={formKey}
          ref={formRef}
          id={`${formId}-form`}
          className="mt-6 flex flex-col gap-4"
          noValidate
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-beat-title`} className="text-sm font-medium text-text-muted">
              Title
            </label>
            <input
              id={`${formId}-beat-title`}
              name="title"
              type="text"
              required
              maxLength={500}
              defaultValue={isEdit ? beatToEdit.title : undefined}
              className="rounded-md border border-nav-border bg-background-dark px-3 py-2 text-sm text-text-main outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-description`} className="text-sm font-medium text-text-muted">
              Description
            </label>
            <textarea
              id={`${formId}-description`}
              name="description"
              rows={3}
              maxLength={2000}
              defaultValue={isEdit && typeof beatToEdit.description === 'string' ? beatToEdit.description : ''}
              placeholder="Short summary shown on beat cards (optional)"
              className="min-h-[4.5rem] resize-y rounded-md border border-nav-border bg-background-dark px-3 py-2 text-sm text-text-main outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
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
                defaultValue={isEdit ? String(beatToEdit.bpm) : undefined}
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
                defaultValue={isEdit ? String(beatToEdit.duration) : undefined}
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
              defaultValue={isEdit ? String(beatToEdit.price) : 0}
              className="rounded-md border border-nav-border bg-background-dark px-3 py-2 text-sm text-text-main outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-start gap-3 rounded-md border border-nav-border bg-background-dark/50 px-3 py-2.5">
            <input
              id={`${formId}-isHidden`}
              name="isHidden"
              type="checkbox"
              value="true"
              defaultChecked={isEdit && !!beatToEdit.isHidden}
              className="mt-1 h-4 w-4 shrink-0 rounded border-nav-border bg-background-dark text-primary focus:ring-primary/40"
            />
            <label htmlFor={`${formId}-isHidden`} className="cursor-pointer text-sm leading-snug text-text-muted">
              <span className="font-medium text-text-main">Hide from homepage & catalog</span>
              <span className="mt-0.5 block text-xs opacity-90">
                Visitors will not see this beat; it stays visible in admin below visible tracks.
              </span>
            </label>
          </div>
          <div className="flex flex-col gap-1.5">
            <div id={`${formId}-preview-field`} className="text-sm font-medium text-text-muted">
              Preview (MP3 or WAV)
            </div>
            {isEdit && beatToEdit?.previewAudioFile ? (
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                <audio
                  ref={previewAudioRef}
                  src={beatToEdit.previewAudioFile}
                  preload="none"
                  className="sr-only"
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={() => {
                    const el = previewAudioRef.current
                    if (!el) return
                    if (el.paused) {
                      void el.play().catch(() => {})
                    } else {
                      el.pause()
                    }
                  }}
                  disabled={!beatToEdit.previewAudioFile}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-nav-border bg-background-dark text-white transition-colors hover:border-primary/50 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={previewPlaying ? 'Pause preview' : 'Play preview'}
                >
                  <MaterialIcon
                    name={previewPlaying ? 'pause' : 'play_arrow'}
                    className="text-[26px]"
                    filled
                  />
                </button>
                <span className="shrink-0 text-xs text-text-muted">Current preview audio</span>
                <FilePickRow
                  id={`${formId}-preview`}
                  name="preview"
                  accept=".mp3,.wav,audio/mpeg,audio/mp3,audio/wav"
                  required={!isEdit}
                  inputRef={previewFileInputRef}
                  pickedLabel={pickedPreview}
                  onPickedChange={setPickedPreview}
                  chooseFileAriaLabel="Choose replacement preview audio file"
                  removeFileAriaLabel="Remove selected preview file"
                  className="min-w-0 flex-1"
                />
              </div>
            ) : (
              <FilePickRow
                id={`${formId}-preview`}
                name="preview"
                accept=".mp3,.wav,audio/mpeg,audio/mp3,audio/wav"
                required={!isEdit}
                inputRef={previewFileInputRef}
                pickedLabel={pickedPreview}
                onPickedChange={setPickedPreview}
                chooseFileAriaLabel="Choose preview audio file"
                removeFileAriaLabel="Remove selected preview file"
              />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <div id={`${formId}-premium-field`} className="text-sm font-medium text-text-muted">
              Premium files (ZIP)
            </div>
            {isEdit ? (
              <div className="mb-1 break-all rounded-md border border-nav-border bg-background-dark px-3 py-2 font-mono text-xs leading-snug text-text-muted">
                {beatToEdit?.premiumFilesKey?.trim()
                  ? beatToEdit.premiumFilesKey.trim()
                  : '—'}
              </div>
            ) : null}
            <FilePickRow
              id={`${formId}-premium`}
              name="premium_files"
              accept=".zip,application/zip"
              required={!isEdit}
              inputRef={premiumFileInputRef}
              pickedLabel={pickedPremium}
              onPickedChange={setPickedPremium}
              chooseFileAriaLabel="Choose premium ZIP file"
              removeFileAriaLabel="Remove selected ZIP file"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div id={`${formId}-cover-field`} className="text-sm font-medium text-text-muted">
              Cover image
            </div>
            {isEdit && beatToEdit?.coverImageFile ? (
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                  <button
                    type="button"
                    onClick={() => setCoverLightboxOpen(true)}
                    className="group/ov shrink-0 rounded-md ring-1 ring-white/15 transition hover:ring-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    aria-label="View cover full size"
                  >
                    <img
                      src={beatToEdit.coverImageFile}
                      alt=""
                      className="h-14 w-14 rounded object-cover"
                    />
                  </button>
                  <FilePickRow
                    id={`${formId}-cover`}
                    name="cover_image"
                    accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                    required={!isEdit}
                    inputRef={coverFileInputRef}
                    pickedLabel={pickedCover}
                    onPickedChange={setPickedCover}
                    chooseFileAriaLabel="Choose replacement cover image"
                    removeFileAriaLabel="Remove selected cover image"
                    className="min-w-0 flex-1"
                  />
                </div>
                <span className="text-xs text-text-muted">Click thumbnail to open full size</span>
              </div>
            ) : (
              <FilePickRow
                id={`${formId}-cover`}
                name="cover_image"
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                required={!isEdit}
                inputRef={coverFileInputRef}
                pickedLabel={pickedCover}
                onPickedChange={setPickedCover}
                chooseFileAriaLabel="Choose cover image"
                removeFileAriaLabel="Remove selected cover image"
              />
            )}
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
              {submitting ? 'Saving…' : isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const coverLightbox =
    coverLightboxOpen && isEdit && beatToEdit?.coverImageFile ? (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cover art full size"
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
        onClick={() => setCoverLightboxOpen(false)}
      >
        <button
          type="button"
          onClick={() => setCoverLightboxOpen(false)}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition-colors hover:bg-white/10"
          aria-label="Close"
        >
          <MaterialIcon name="close" className="text-[24px]" />
        </button>
        <img
          src={beatToEdit.coverImageFile}
          alt={beatToEdit.title ? `Cover: ${beatToEdit.title}` : 'Cover art'}
          className="max-h-[min(90dvh,900px)] max-w-[min(96vw,1200px)] object-contain shadow-2xl"
          onClick={(ev) => ev.stopPropagation()}
        />
      </div>
    ) : null

  return (
    <>
      {createPortal(modal, document.body)}
      {coverLightbox ? createPortal(coverLightbox, document.body) : null}
    </>
  )
}
