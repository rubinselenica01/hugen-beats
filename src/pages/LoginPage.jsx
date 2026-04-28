import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MaterialIcon } from '../components/ui/MaterialIcon.jsx'
import { apiUrl } from '../utils/apiBase.js'

const LOGIN_FETCH_TIMEOUT_MS = 25_000

function parseDetail(detail) {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail.map((x) => x.msg).join(' ')
  return null
}

/** Fetch was cancelled because it took longer than LOGIN_FETCH_TIMEOUT_MS. */
function isAbortError(error) {
  return Boolean(error?.name === 'AbortError')
}

/** Fetch failed before HTTP response (offline, refused connection, DNS, CORS aborted, …). */
function isNetworkFailure(error) {
  if (!error || typeof error !== 'object') return false
  if (error instanceof TypeError) return true
  if (error.name === 'NetworkError') return true
  return String(error.message ?? '').toLowerCase().includes('failed to fetch')
}

function isUnreachableHttpStatus(status) {
  return status >= 500 && status < 600
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = useMemo(() => {
    const raw = searchParams.get('redirect')
    if (!raw || !raw.startsWith('/')) return '/admin/beat-management'
    return raw
  }, [searchParams])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      let res
      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), LOGIN_FETCH_TIMEOUT_MS)
      try {
        res = await fetch(apiUrl('/admin/login'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          signal: controller.signal,
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        })
      } catch (err) {
        if (isAbortError(err)) {
          setError({
            kind: 'unavailable',
            message: 'This is taking too long. Try again.',
          })
          return
        }
        if (isNetworkFailure(err)) {
          setError({
            kind: 'unavailable',
            message: 'Connection failed. Try again.',
          })
          return
        }
        throw err
      } finally {
        window.clearTimeout(timeoutId)
      }

      if (res.ok) {
        navigate(redirectTo, { replace: true })
        return
      }

      if (isUnreachableHttpStatus(res.status)) {
        setError({
          kind: 'unavailable',
          message: 'Something went wrong. Try again later.',
        })
        return
      }

      let message = `Could not sign in (${res.status})`
      try {
        const data = await res.json()
        const parsed = parseDetail(data?.detail)
        if (parsed) message = parsed
      } catch {
        /* ignore */
      }
      setError({ kind: 'auth', message })
    } catch (err) {
      if (isAbortError(err)) {
        setError({
          kind: 'unavailable',
          message: 'This is taking too long. Try again.',
        })
      } else {
        setError({
          kind: 'unavailable',
          message: 'Something went wrong. Try again.',
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <main className="relative flex min-h-[100dvh] w-full flex-1 flex-col items-center justify-center bg-gradient-to-b from-nav via-background-dark to-background-dark px-8 py-10 md:px-16">
        <div
          className="hero-blur-bg opacity-70"
          aria-hidden
          style={{
            maskImage:
              'radial-gradient(ellipse 70% 50% at 50% 30%, black 25%, transparent 70%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 50% at 50% 30%, black 25%, transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-[10vh] mx-auto max-w-4xl opacity-35"
          aria-hidden
          style={{
            height: 'min(50vh, 28rem)',
            background:
              'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(27, 187, 131, 0.2), transparent 65%)',
            filter: 'blur(72px)',
          }}
        />

        <div className="relative z-10 w-full max-w-lg">
          <div className="rounded-lg border border-nav-border bg-surface/90 p-8 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.65)] backdrop-blur-md md:p-10">
            <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              Producer access
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Sign in with the admin email configured for the Beat Producer API.
            </p>

            <form className="mt-8 flex flex-col gap-5" onSubmit={onSubmit} noValidate>
              <div className="flex flex-col gap-2">
                <label htmlFor="auth-email" className="text-sm font-medium text-text-muted">
                  Email
                </label>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md border border-nav-border bg-background-dark px-4 py-3 text-sm text-text-main outline-none ring-primary/0 transition-[box-shadow,border-color] placeholder:text-text-muted/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/25"
                  placeholder="you@example.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="auth-password" className="text-sm font-medium text-text-muted">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-nav-border bg-background-dark py-3 pl-4 pr-12 text-sm text-text-main outline-none transition-[box-shadow,border-color] placeholder:text-text-muted/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/25"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/5 hover:text-text-main focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    <MaterialIcon
                      name={showPassword ? 'visibility_off' : 'visibility'}
                      className="text-[22px]"
                    />
                  </button>
                </div>
              </div>

              {error ? (
                <div role="alert">
                  {error.kind === 'unavailable' ? (
                    <div className="rounded-md border border-amber-900/70 bg-amber-950/35 px-3 py-3 text-left">
                      <div className="flex gap-3">
                        <MaterialIcon
                          name="cloud_off"
                          className="shrink-0 text-[22px] text-amber-300/95"
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <p className="text-sm leading-relaxed text-amber-200/95">
                            {error.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="rounded-md border border-red-900/80 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                      {error.message}
                    </p>
                  )}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-primary py-3 text-sm font-bold text-background-dark transition-[transform,opacity,background-color] hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
