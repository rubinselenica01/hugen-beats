import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminLoginHrefWithRedirect } from '../../constants/routes.js'
import { ADMIN_ME_GUARD_TIMEOUT_MS } from '../../constants/timing.js'
import { checkAdminSession } from '../../utils/adminSession.js'

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

    async function redirectToLogin() {
      if (cancelled) return
      navigate(
        adminLoginHrefWithRedirect(location.pathname, location.search),
        { replace: true },
      )
    }

    ;(async () => {
      const controller = new AbortController()
      const tid = window.setTimeout(() => controller.abort(), ADMIN_ME_GUARD_TIMEOUT_MS)
      try {
        const result = await checkAdminSession(controller.signal)
        if (cancelled) return

        if (!result.ok) {
          await redirectToLogin()
          return
        }

        setReady(true)
      } catch {
        if (cancelled) return
        await redirectToLogin()
      } finally {
        window.clearTimeout(tid)
      }
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
