import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { routes } from '../constants/routes.js'
import { createCryptoCheckout, fetchCheckoutOptions } from '../services/paymentsService.js'
import { ButtonPrimary } from '../components/ui/Button.jsx'

function parseUsdToNumber(value) {
  if (value == null) return 0
  const s = String(value).replace(/[^0-9.]/g, '')
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : 0
}

function formatUsd(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)
}

const FULL_LEASE = 'Full Lease'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, closeCart } = useCart()
  const [payCurrency, setPayCurrency] = useState('btc')
  const [payOptions, setPayOptions] = useState(null)
  const [paymentsTestMode, setPaymentsTestMode] = useState(false)
  const [optionsError, setOptionsError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    closeCart()
  }, [closeCart])

  useEffect(() => {
    let cancelled = false
    fetchCheckoutOptions().then(
      (data) => {
        if (cancelled) return
        const list = Array.isArray(data?.pay_currencies) ? data.pay_currencies : []
        setPayOptions(list)
        setPaymentsTestMode(data?.payments_test_mode === true)
        setOptionsError(null)
        const values = new Set(list.map((o) => o?.value).filter(Boolean))
        setPayCurrency((cur) => (values.has(cur) ? cur : list[0]?.value ?? 'btc'))
      },
      (e) => {
        if (cancelled) return
        setOptionsError(e?.message ?? 'Could not load checkout options.')
        setPayOptions([])
      },
    )
    return () => {
      cancelled = true
    }
  }, [])

  const totalUsd = useMemo(
    () =>
      items.reduce((sum, { track, plan }) => {
        const raw = plan?.price ?? track?.price
        return sum + parseUsdToNumber(raw)
      }, 0),
    [items],
  )

  const checkoutBlurb = useMemo(() => {
    const base =
      'Pay with Bitcoin (BTC) or USDT (TRC-20) via NOWPayments. You will leave this site to complete payment on their hosted checkout.'
    if (paymentsTestMode) {
      return `${base} USDT (ERC-20) is available while payments test mode is enabled on the API.`
    }
    return base
  }, [paymentsTestMode])

  async function onPay() {
    setError(null)
    if (items.length === 0) {
      navigate(routes.beatsCatalog, { replace: true })
      return
    }
    const payload = {
      items: items.map(({ track, plan }) => ({
        beat_id: Number.parseInt(String(track.id), 10),
        plan_name: plan?.name ?? FULL_LEASE,
      })),
      pay_currency: payCurrency,
    }
    if (payload.items.some((x) => Number.isNaN(x.beat_id))) {
      setError('Invalid cart line — refresh the catalog and try again.')
      return
    }
    setBusy(true)
    try {
      const res = await createCryptoCheckout(payload)
      if (!res?.checkout_url || !res?.payment_id) {
        setError('Checkout response was incomplete.')
        return
      }
      window.location.assign(res.checkout_url)
    } catch (e) {
      setError(e?.message ?? 'Could not start checkout.')
    } finally {
      setBusy(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background-dark px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-white">Your cart is empty</h1>
        <p className="mt-2 max-w-md text-sm text-text-muted">
          Add beats from the catalog, then return here to pay with crypto.
        </p>
        <ButtonPrimary type="button" className="mt-6" onClick={() => navigate(routes.beatsCatalog)}>
          Browse beats
        </ButtonPrimary>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-background-dark px-4 py-10 sm:px-10">
      <div className="mx-auto max-w-lg">
        <h1 className="font-display text-3xl font-bold text-white">Checkout</h1>
        <p className="mt-2 text-sm text-text-muted">{checkoutBlurb}</p>

        <div className="mt-8 space-y-3 rounded-lg border border-white/10 bg-surface p-4">
          {items.map(({ lineId, track, plan }) => (
            <div
              key={lineId}
              className="flex gap-3 border-b border-white/5 py-3 last:border-b-0 last:pb-0 first:pt-0"
            >
              <img
                src={track.image}
                alt={track.alt ?? ''}
                className="h-14 w-14 shrink-0 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-white">{track.title}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{plan?.name}</p>
                <p className="text-sm text-text-muted">{plan?.detail}</p>
              </div>
              <p className="shrink-0 text-sm font-bold text-white">
                {formatUsd(parseUsdToNumber(plan?.price ?? track?.price))}
              </p>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Total (USD)</span>
            <span className="font-display text-2xl font-bold text-white">{formatUsd(totalUsd)}</span>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted" htmlFor="pay-cur-v2">
            Pay with
          </label>
          {optionsError ? (
            <p className="mt-2 text-sm text-amber-200/90">{optionsError}</p>
          ) : null}
          <select
            id="pay-cur-v2"
            value={payCurrency}
            onChange={(e) => setPayCurrency(e.target.value)}
            disabled={!payOptions?.length}
            className="mt-2 w-full rounded-md border border-white/10 bg-background-dark/90 px-3 py-2 text-sm text-white disabled:opacity-50"
          >
            {(payOptions ?? [{ value: 'btc', label: 'Bitcoin (BTC)' }]).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonPrimary
            type="button"
            className="sm:flex-1"
            disabled={busy || !payOptions?.length}
            onClick={onPay}
          >
            {busy ? 'Starting checkout…' : 'Continue Checkout'}
          </ButtonPrimary>
          <button
            type="button"
            className="rounded-md border border-white/10 px-4 py-3 text-sm font-bold text-text-muted transition-colors hover:text-white"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}
