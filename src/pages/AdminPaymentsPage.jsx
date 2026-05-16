import { useEffect, useState } from 'react'
import AdminChrome from '../components/admin/AdminChrome.jsx'
import { adminFetch } from '../utils/adminFetch.js'
import { parseFastApiErrorDetail, responseLooksLikeJson } from '../utils/fastApiParse.js'

function formatWhen(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  return d.toLocaleString()
}

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetch('/api/admin/payments?limit=200')
      const text = await res.text()
      if (!res.ok) {
        let detail = `Request failed (${res.status})`
        try {
          const data = JSON.parse(text)
          detail = parseFastApiErrorDetail(data.detail) ?? detail
        } catch {
          /* ignore */
        }
        throw new Error(detail)
      }
      if (!responseLooksLikeJson(res)) {
        throw new Error('Expected JSON from API.')
      }
      const data = JSON.parse(text)
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.message ?? 'Could not load payments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <AdminChrome aria-label="Admin crypto payments">
      <div className="flex flex-1 flex-col px-4 py-8 sm:px-10">
        <div className="mx-auto max-w-6xl w-full">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Crypto payments</h1>
              <p className="mt-1 text-sm text-text-muted">
                NOWPayments invoices and coarse lifecycle (PENDING / CONFIRMED / FAILED).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="text-sm font-bold text-primary hover:underline disabled:opacity-50"
                onClick={() => void load()}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          </div>

        {error ? (
          <p className="mt-6 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}

          <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm text-white">
            <thead className="bg-surface text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Lines</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Fulfill</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Pay</th>
                <th className="px-3 py-2">NP payment</th>
                <th className="px-3 py-2">Provider</th>
                <th className="px-3 py-2">Customer</th>
              </tr>
            </thead>
            <tbody>
              {rows == null || loading ? (
                <tr>
                  <td colSpan={10} className="px-3 py-6 text-text-muted">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-6 text-text-muted">
                    No payments yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.payment_id} className="border-t border-white/5 bg-background-dark/40">
                    <td className="whitespace-nowrap px-3 py-2 text-text-muted">{formatWhen(r.created_at)}</td>
                    <td className="max-w-[120px] truncate px-3 py-2 font-mono text-[10px] text-text-muted" title={r.payment_id}>
                      {String(r.payment_id).slice(0, 8)}…
                    </td>
                    <td className="px-3 py-2 text-text-muted">{r.cart_line_count ?? '—'}</td>
                    <td className="px-3 py-2 font-bold">{r.status}</td>
                    <td className="px-3 py-2 text-text-muted">{r.fulfillment_ready ? 'Yes' : '—'}</td>
                    <td className="px-3 py-2">${r.amount_usd}</td>
                    <td className="px-3 py-2 uppercase text-text-muted">{r.pay_currency}</td>
                    <td className="max-w-[200px] truncate px-3 py-2 font-mono text-xs text-text-muted">
                      {r.nowpayments_payment_id ?? '—'}
                    </td>
                    <td className="max-w-[220px] truncate px-3 py-2 text-text-muted">{r.provider_status ?? '—'}</td>
                    <td className="px-3 py-2">
                      {r.customer_status_url ? (
                        <a
                          className="font-bold text-primary hover:underline"
                          href={r.customer_status_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Status
                        </a>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </AdminChrome>
  )
}
