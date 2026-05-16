import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { routes } from '../constants/routes.js'
import { fetchPaymentDownloads, fetchPaymentStatus } from '../services/paymentsService.js'
import { ButtonPrimary } from '../components/ui/Button.jsx'

const POLL_MS = 3500

function StatusBadge({ status }) {
  const s = String(status ?? '').toUpperCase()
  const cls =
    s === 'CONFIRMED'
      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200'
      : s === 'FAILED'
        ? 'border-red-500/50 bg-red-500/10 text-red-200'
        : 'border-amber-500/40 bg-amber-500/10 text-amber-100'
  const label = s === 'CONFIRMED' ? 'Success' : s === 'FAILED' ? 'Failed' : 'Pending'
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  )
}

export default function PaymentStatusPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const id = params.get('id')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [downloads, setDownloads] = useState(null)
  const [downloadError, setDownloadError] = useState(null)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const pollRef = useRef(null)

  const stopPolling = useMemo(
    () => () => {
      if (pollRef.current != null) {
        window.clearInterval(pollRef.current)
        pollRef.current = null
      }
    },
    [],
  )

  useEffect(() => {
    stopPolling()
    if (!id) {
      setError('Missing payment id.')
      return undefined
    }

    let cancelled = false

    async function load(refresh = false) {
      try {
        const row = await fetchPaymentStatus(id, { refresh })
        if (cancelled) return
        setData(row)
        setError(null)
        const st = String(row?.status ?? '').toUpperCase()
        if (st === 'CONFIRMED' || st === 'FAILED') {
          stopPolling()
        }
      } catch (e) {
        if (cancelled) return
        setError(e?.message ?? 'Could not load payment status.')
      }
    }

    load(true)

    pollRef.current = window.setInterval(() => {
      if (!id) return
      fetchPaymentStatus(id, { refresh: true })
        .then((row) => {
          if (cancelled) return
          setData(row)
          const st = String(row?.status ?? '').toUpperCase()
          if (st === 'CONFIRMED' || st === 'FAILED') stopPolling()
        })
        .catch(() => {
          /* keep last good payload; transient errors happen while deploying */
        })
    }, POLL_MS)

    return () => {
      cancelled = true
      stopPolling()
    }
  }, [id, stopPolling])

  const statusUpper = String(data?.status ?? '').toUpperCase()

  const loadDownloads = useCallback(async () => {
    if (!id || statusUpper !== 'CONFIRMED') return
    setDownloadLoading(true)
    setDownloadError(null)
    try {
      const payload = await fetchPaymentDownloads(id)
      setDownloads(payload)
    } catch (e) {
      setDownloads(null)
      setDownloadError(e?.message ?? 'Could not load download links.')
    } finally {
      setDownloadLoading(false)
    }
  }, [id, statusUpper])

  useEffect(() => {
    if (!id || statusUpper !== 'CONFIRMED') {
      setDownloads(null)
      setDownloadError(null)
      setDownloadLoading(false)
      return undefined
    }
    void loadDownloads()
    return undefined
  }, [id, statusUpper, loadDownloads])

  if (!id) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background-dark px-6 text-center">
        <p className="text-sm text-text-muted">No payment id in URL.</p>
        <Link className="mt-4 text-sm font-bold text-primary hover:underline" to={routes.home}>
          Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-background-dark px-4 py-12 sm:px-10">
      <div className="mx-auto max-w-lg">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold text-white">Payment status</h1>
          {data ? <StatusBadge status={data.status} /> : null}
        </div>
        <p className="mt-2 text-sm text-text-muted">
          This page polls your order on our server. Confirmed payments are finalized when we receive a verified IPN from
          NOWPayments — do not rely on the browser alone.
        </p>

        {error ? (
          <p className="mt-6 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {data ? (
          <dl className="mt-8 space-y-3 rounded-lg border border-white/10 bg-surface p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Order id</dt>
              <dd className="max-w-[220px] truncate font-mono text-xs text-white">{String(data.payment_id)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Amount</dt>
              <dd className="text-white">
                ${data.amount_usd} {data.pay_currency ? `· pay ${String(data.pay_currency).toUpperCase()}` : ''}
              </dd>
            </div>
            {data.nowpayments_payment_id ? (
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">NOWPayments payment</dt>
                <dd className="max-w-[220px] truncate font-mono text-xs text-white">{data.nowpayments_payment_id}</dd>
              </div>
            ) : null}
            {data.provider_status ? (
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Provider status</dt>
                <dd className="text-white">{data.provider_status}</dd>
              </div>
            ) : null}
            {data.failure_reason ? (
              <div>
                <dt className="text-text-muted">Details</dt>
                <dd className="mt-1 break-words text-red-200/90">{data.failure_reason}</dd>
              </div>
            ) : null}
          </dl>
        ) : !error ? (
          <p className="mt-8 text-sm text-text-muted">Loading…</p>
        ) : null}

        {statusUpper === 'CONFIRMED' ? (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-emerald-200/90">Payment confirmed. Download your premium ZIP bundles below.</p>
            {downloadLoading ? <p className="text-sm text-text-muted">Preparing download links…</p> : null}
            {downloadError ? (
              <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {downloadError}
              </p>
            ) : null}
            {downloads?.items?.length ? (
              <ul className="space-y-2 rounded-lg border border-white/10 bg-surface p-4">
                {downloads.items.map((row) => (
                  <li
                    key={row.beat_id}
                    className="flex flex-col gap-2 border-t border-white/5 pt-3 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-bold text-white">{row.title}</p>
                      <p className="text-xs text-text-muted">Beat #{row.beat_id}</p>
                    </div>
                    <a
                      className="rounded-md border border-emerald-500/40 px-3 py-2 text-center text-sm font-bold text-emerald-200 transition-colors hover:bg-emerald-500/10"
                      href={row.download_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download ZIP
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {!downloadLoading && !downloadError && downloads && (!downloads.items || downloads.items.length === 0) ? (
              <p className="text-sm text-amber-200/90">
                No downloadable bundles were found for this order. Contact support with your order id.
              </p>
            ) : null}
            {downloads?.expires_in_seconds ? (
              <p className="text-xs text-text-muted">
                Links expire after about {Math.max(1, Math.round(downloads.expires_in_seconds / 60))} minutes — generate
                new links if they expire.
              </p>
            ) : null}
            <button
              type="button"
              className="text-left text-xs font-bold text-primary hover:underline disabled:opacity-50"
              onClick={() => void loadDownloads()}
              disabled={downloadLoading}
            >
              Refresh download links
            </button>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonPrimary type="button" className="sm:flex-1" onClick={() => navigate(routes.beatsCatalog)}>
            Back to catalog
          </ButtonPrimary>
          {data?.checkout_url && statusUpper === 'PENDING' ? (
            <a
              className="rounded-md border border-primary/40 px-4 py-3 text-center text-sm font-bold text-primary transition-colors hover:bg-primary/10"
              href={data.checkout_url}
            >
              Resume checkout
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
