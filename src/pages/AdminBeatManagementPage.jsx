import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MaterialIcon } from '../components/ui/MaterialIcon.jsx'
import { routes } from '../constants/routes.js'
import { adminFetch } from '../utils/adminFetch.js'

export default function AdminBeatManagementPage() {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState(null)
  const [beats, setBeats] = useState(null)
  const [beatsError, setBeatsError] = useState(null)
  const [beatsLoading, setBeatsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setBeatsLoading(true)
      setBeatsError(null)
      try {
        const res = await adminFetch('/admin/beats')
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
  }, [navigate])

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

  return (
    <div
      className="flex min-h-[100dvh] w-full flex-col bg-background-dark"
      aria-label="Admin beat management"
    >
      <header className="flex shrink-0 items-start justify-end gap-3 px-6 py-5 md:px-10">
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
      </header>

      <main className="page-container flex flex-1 flex-col gap-6 px-6 pb-12 pt-4 md:px-10 md:pt-8">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            Beat management
          </h1>
          <p className="mt-1 text-sm text-text-muted">Uploads and publishing will appear here.</p>
        </div>

        {beatsError ? (
          <p className="text-sm text-red-300" role="alert">
            {beatsError}
          </p>
        ) : beatsLoading ? (
          <p className="text-sm text-text-muted">Loading beats…</p>
        ) : (
          <section aria-live="polite" className="rounded-lg border border-nav-border bg-surface/70 p-6">
            <p className="text-sm text-text-muted">
              {beatCount === 0
                ? 'No beats in the catalog yet.'
                : `${beatCount} beat${beatCount === 1 ? '' : 's'} loaded.`}
            </p>
            {beatCount > 0 ? (
              <pre className="mt-4 max-h-[min(60vh,24rem)] overflow-auto rounded-md bg-background-dark/80 p-4 text-xs text-text-muted">
                {JSON.stringify(beats, null, 2)}
              </pre>
            ) : null}
          </section>
        )}
      </main>
    </div>
  )
}
