import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiUrl } from '../../utils/apiBase.js'

/**
 * Guards admin-only routes; redirects unauthenticated visitors to `/admin/login`
 * with a `redirect` back to this location.
 */
export function RequireAdminSession({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const res = await fetch(apiUrl('/admin/me'), {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        })
        if (cancelled) return
        if (res.ok) {
          setReady(true)
          return
        }
      } catch {
        /* handled below */
      }
      if (cancelled) return
      const redirect = encodeURIComponent(
        `${location.pathname}${location.search}`,
      )
      navigate(`/admin/login?redirect=${redirect}`, { replace: true })
    })()

    return () => {
      cancelled = true
    }
  }, [navigate, location.pathname, location.search])

  if (!ready) {
    return (
      <div className="flex min-h-[100dvh] w-full items-center justify-center bg-background-dark">
        <p className="text-sm text-text-muted">Checking session…</p>
      </div>
    )
  }

  return children
}
