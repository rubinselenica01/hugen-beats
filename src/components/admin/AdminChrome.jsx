import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogoMark, LogoWordmark } from '../brand/Logo.jsx'
import { MaterialIcon } from '../ui/MaterialIcon.jsx'
import { routes } from '../../constants/routes.js'
import { adminFetch } from '../../utils/adminFetch.js'

function navLinkClass({ isActive }) {
  const base = 'text-sm font-bold transition-colors'
  if (isActive) {
    return `${base} text-white underline decoration-primary decoration-2 underline-offset-4`
  }
  return `${base} text-primary hover:underline`
}

export default function AdminChrome({ children, ...rootProps }) {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState(null)

  async function handleLogout() {
    setLogoutError(null)
    setLoggingOut(true)
    try {
      const res = await adminFetch('/admin/logout', { method: 'POST' })
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

  return (
    <div
      className="flex min-h-[100dvh] w-full flex-col bg-background-dark"
      {...rootProps}
    >
      <header className="shrink-0 border-b border-solid border-nav-border bg-background-dark/80 px-4 py-3 backdrop-blur-md sm:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            to={routes.home}
            className="inline-flex min-w-0 cursor-pointer items-center gap-2 self-center text-white transition-opacity hover:opacity-80 sm:gap-3"
          >
            <LogoMark />
            <LogoWordmark className="m-0 min-w-0 truncate text-lg sm:text-xl" />
          </Link>
          <nav
            className="flex flex-1 flex-wrap items-center justify-end gap-x-6 gap-y-2"
            aria-label="Admin sections"
          >
            <NavLink to={routes.adminBeatManagement} className={navLinkClass} end>
              Beat management
            </NavLink>
            <NavLink to={routes.adminPayments} className={navLinkClass}>
              Crypto payments
            </NavLink>
          </nav>
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
      {children}
    </div>
  )
}
