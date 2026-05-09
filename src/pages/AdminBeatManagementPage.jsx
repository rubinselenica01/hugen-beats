import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AddBeatDialog } from '../components/admin/AddBeatDialog.jsx'
import { DeleteBeatConfirmDialog } from '../components/admin/DeleteBeatConfirmDialog.jsx'
import { LogoMark, LogoWordmark } from '../components/brand/Logo.jsx'
import { BeatCard } from '../components/ui/BeatCard.jsx'
import { MaterialIcon } from '../components/ui/MaterialIcon.jsx'
import { routes } from '../constants/routes.js'
import { adminFetch } from '../utils/adminFetch.js'
import { notifyCatalogBeatsChanged } from '../utils/catalogBeatsApi.js'
import { stopBeatPreviewPlaybackForPlaybackId } from '../utils/beatPreviewPlayback.js'

const CARDS_PER_MOBILE_ROW = 4

/** Same max width as BeatsCatalogPage — keeps cards one consistent size */
const beatCardShellClass = 'w-full min-w-0 max-w-[18.5rem]'

function chunkEvery(items, size) {
  const chunks = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

export default function AdminBeatManagementPage() {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState(null)
  const [beats, setBeats] = useState(null)
  const [beatsError, setBeatsError] = useState(null)
  const [beatsLoading, setBeatsLoading] = useState(true)
  const [beatsListVersion, setBeatsListVersion] = useState(0)
  const [addBeatOpen, setAddBeatOpen] = useState(false)
  const [editingBeat, setEditingBeat] = useState(null)
  const [deletingBeatId, setDeletingBeatId] = useState(null)
  const [deleteDialogBeat, setDeleteDialogBeat] = useState(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setBeatsLoading(true)
      setBeatsError(null)
      try {
        const res = await adminFetch('/beats')
        if (cancelled) return
        if (res.status === 401) {
          navigate(routes.adminLogin, { replace: true })
          return
        }
        if (!res.ok) {
          setBeatsError(`Could not load beats (${res.status})`)
          setBeats(null)
          return
        }
        const data = await res.json()
        setBeats(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setBeatsError('Could not reach the server.')
      } finally {
        if (!cancelled) setBeatsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [navigate, beatsListVersion])

  /** Admin mutations change catalog visibility; storefront cart listens and prunes hidden/deleted beats. */
  function bumpBeatsListAndNotifyCatalog() {
    setBeatsListVersion((v) => v + 1)
    notifyCatalogBeatsChanged()
  }

  async function handleLogout() {
    setLogoutError(null)
    setLoggingOut(true)
    try {
      const res = await adminFetch('/admin/logout', {
        method: 'POST',
      })

      if (res.ok) {
        navigate(routes.adminLogin, { replace: true })
        return
      }
      setLogoutError('Could not sign out. Try again.')
    } catch {
      setLogoutError('Could not reach the server.')
    } finally {
      setLoggingOut(false)
    }
  }

  const beatCount = beats?.length ?? 0

  const mobileCatalogRows = useMemo(
    () => (Array.isArray(beats) && beats.length > 0 ? chunkEvery(beats, CARDS_PER_MOBILE_ROW) : []),
    [beats],
  )

  async function performDeleteBeat(beat) {
    setDeletingBeatId(beat.id)
    setBeatsError(null)
    try {
      const res = await adminFetch(`/beats/${beat.id}`, { method: 'DELETE' })
      if (res.status === 401) {
        navigate(routes.adminLogin, { replace: true })
        return
      }
      if (!res.ok) {
        setBeatsError(`Could not delete beat (${res.status}).`)
        return
      }
      setDeleteDialogBeat(null)
      setEditingBeat((e) => (e?.id === beat.id ? null : e))
      stopBeatPreviewPlaybackForPlaybackId(beat.id)
      bumpBeatsListAndNotifyCatalog()
    } catch {
      setBeatsError('Could not reach the server.')
    } finally {
      setDeletingBeatId(null)
    }
  }

  function adminBeatCard(beat) {
    const deleting = deletingBeatId === beat.id
    return (
      <BeatCard
        compact
        hideSelectLicense
        title={beat.title}
        meta={`${beat.bpm} BPM · ${beat.duration}s`}
        description={typeof beat.description === 'string' ? beat.description : ''}
        price={typeof beat.price === 'number' ? `$${beat.price}` : '—'}
        image={beat.coverImageFile}
        alt={beat.title ? `Cover: ${beat.title}` : 'Cover'}
        previewAudioUrl={beat.previewAudioFile}
        previewPlaybackId={beat.id}
        hiddenFromCatalog={!!beat.isHidden}
        topRightSlot={
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={deleting}
              onClick={(e) => {
                e.stopPropagation()
                setAddBeatOpen(false)
                setEditingBeat(beat)
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-background-dark/90 text-white shadow-lg backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-surface-hover hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Edit ${beat.title || 'beat'}`}
            >
              <MaterialIcon name="edit" className="text-[22px]" filled />
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={(e) => {
                e.stopPropagation()
                setDeleteDialogBeat(beat)
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-red-400/35 bg-background-dark/90 text-red-300 shadow-lg backdrop-blur-sm transition-colors hover:border-red-400/60 hover:bg-red-950/50 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Delete ${beat.title || 'beat'} permanently`}
            >
              <MaterialIcon name="delete" className="text-[22px]" filled />
            </button>
          </div>
        }
      />
    )
  }

  return (
    <div
      className="flex min-h-[100dvh] w-full flex-col bg-background-dark"
      aria-label="Admin beat management"
    >
      <DeleteBeatConfirmDialog
        beat={deleteDialogBeat}
        isDeleting={
          deleteDialogBeat != null && deletingBeatId != null && deletingBeatId === deleteDialogBeat.id
        }
        onClose={() => {
          if (
            deleteDialogBeat != null &&
            deletingBeatId != null &&
            deletingBeatId === deleteDialogBeat.id
          )
            return
          setDeleteDialogBeat(null)
        }}
        onConfirm={performDeleteBeat}
      />
      <AddBeatDialog
        open={addBeatOpen || editingBeat != null}
        beatToEdit={editingBeat}
        onClose={() => {
          setAddBeatOpen(false)
          setEditingBeat(null)
        }}
        onSaved={() => bumpBeatsListAndNotifyCatalog()}
      />
      <header className="shrink-0 border-b border-solid border-nav-border bg-background-dark/80 px-4 py-3 backdrop-blur-md sm:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex min-w-0 cursor-pointer items-center gap-2 self-center text-white transition-opacity hover:opacity-80 sm:gap-3"
          >
            <LogoMark />
            <LogoWordmark className="m-0 min-w-0 truncate text-lg sm:text-xl" />
          </Link>
          <div className="flex flex-col items-end gap-1">
            {logoutError ? (
              <p className="max-w-[16rem] text-right text-sm text-red-300" role="alert">
                {logoutError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded-full border border-nav-border bg-surface px-4 py-2 text-sm font-semibold text-text-main transition-colors hover:border-primary/40 hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MaterialIcon name="logout" className="text-[20px]" />
              {loggingOut ? 'Signing out…' : 'Log out'}
            </button>
          </div>
        </div>
      </header>

      <main className="page-container flex flex-1 flex-col gap-6 px-6 pb-12 pt-8 md:px-10 md:pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              Beat management
            </h1>
            <p className="mt-1 text-sm text-text-muted">Uploads and publishing will appear here.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingBeat(null)
              setAddBeatOpen(true)
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-background-dark transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <MaterialIcon name="add" className="text-[20px]" />
            Add Beat
          </button>
        </div>

        {beatsError ? (
          <p className="text-sm text-red-300" role="alert">
            {beatsError}
          </p>
        ) : beatsLoading ? (
          <p className="text-sm text-text-muted">Loading beats…</p>
        ) : (
          <section aria-live="polite" className="flex flex-col gap-6">
            <p className="text-sm text-text-muted">
              {beatCount === 0
                ? 'No beats in the catalog yet.'
                : `${beatCount} beat${beatCount === 1 ? '' : 's'} loaded.`}
            </p>
            {beatCount > 0 ? (
              <>
                <div className="flex flex-col gap-8 sm:hidden">
                  {mobileCatalogRows.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="-mx-8 flex flex-nowrap gap-4 overflow-x-auto px-8 pb-2 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      {row.map((beat) => (
                        <div
                          key={beat.id}
                          className="w-[min(85vw,18.5rem)] shrink-0 snap-start"
                        >
                          <div className={beatCardShellClass}>{adminBeatCard(beat)}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="hidden sm:grid sm:grid-cols-2 sm:justify-items-center sm:gap-6 lg:grid-cols-4 lg:gap-8">
                  {beats.map((beat) => (
                    <div key={beat.id} className={beatCardShellClass}>
                      {adminBeatCard(beat)}
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </section>
        )}
      </main>
    </div>
  )
}
