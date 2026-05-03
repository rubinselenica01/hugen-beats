import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AddBeatDialog } from '../components/admin/AddBeatDialog.jsx'
import { LogoMark, LogoWordmark } from '../components/brand/Logo.jsx'
import { BeatCard } from '../components/ui/BeatCard.jsx'
import { MaterialIcon } from '../components/ui/MaterialIcon.jsx'
import { routes } from '../constants/routes.js'
import { adminFetch } from '../utils/adminFetch.js'

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

  function adminBeatCard(beat) {
    return (
      <BeatCard
        compact
        hideSelectLicense
        title={beat.title}
        meta={`${beat.bpm} BPM · ${beat.duration}s`}
        price={typeof beat.price === 'number' ? `$${beat.price}` : '—'}
        image={beat.coverImageFile}
        alt={beat.title ? `Cover: ${beat.title}` : 'Cover'}
        previewAudioUrl={beat.previewAudioFile}
        previewPlaybackId={beat.id}
      />
    )
  }

  return (
    <div
      className="flex min-h-[100dvh] w-full flex-col bg-background-dark"
      aria-label="Admin beat management"
    >
      <AddBeatDialog
        open={addBeatOpen}
        onClose={() => setAddBeatOpen(false)}
        onSaved={() => setBeatsListVersion((v) => v + 1)}
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
            onClick={() => setAddBeatOpen(true)}
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
