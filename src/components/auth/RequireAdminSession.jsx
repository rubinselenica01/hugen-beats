import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminLoginHrefWithRedirect } from '../../constants/routes.js'
import { ADMIN_ME_GUARD_TIMEOUT_MS } from '../../constants/timing.js'
import { adminFetch } from '../../utils/adminFetch.js'
import { isMeResponseBody, responseLooksLikeJson } from '../../utils/fastApiParse.js'

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
        const res = await adminFetch('/admin/me', {
          signal: controller.signal,
        })
        if (cancelled) return

        // Static hosts often rewrite unknown paths to index.html → 200 + HTML — do not trust res.ok alone.
        if (
          !res.ok ||
          !responseLooksLikeJson(res)
        ) {
          await redirectToLogin()
          return
        }

        let data = null
        try {
          data = await res.json()
        } catch {
          await redirectToLogin()
          return
        }

        if (!isMeResponseBody(data)) {
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
