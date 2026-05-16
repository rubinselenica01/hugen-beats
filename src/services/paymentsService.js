import { apiUrl, jsonAcceptHeaders } from '../utils/apiBase.js'
import { parseFastApiErrorDetail, responseLooksLikeJson } from '../utils/fastApiParse.js'

/**
 * @returns {Promise<{ payments_test_mode: boolean, pay_currencies: Array<{ value: string, label: string }> }>}
 */
export async function fetchCheckoutOptions() {
  const res = await fetch(apiUrl('/api/payments/checkout-options'), {
    headers: { ...jsonAcceptHeaders },
    cache: 'no-store',
  })
  const text = await res.text()
  if (!res.ok) {
    let detail = `Checkout options failed (${res.status})`
    try {
      const data = JSON.parse(text)
      detail = parseFastApiErrorDetail(data.detail) ?? detail
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }
  if (!responseLooksLikeJson(res)) {
    throw new Error('Unexpected response from checkout options API.')
  }
  return JSON.parse(text)
}

/**
 * Create a NOWPayments hosted invoice and return the redirect URL (never touches API keys in the browser).
 * @param {{ items: Array<{ beat_id: number, plan_name: string }>, pay_currency: string }} body
 */
export async function createCryptoCheckout(body) {
  const res = await fetch(apiUrl('/api/payments/checkout'), {
    method: 'POST',
    headers: { ...jsonAcceptHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  if (!res.ok) {
    let detail = `Checkout failed (${res.status})`
    try {
      const data = JSON.parse(text)
      detail = parseFastApiErrorDetail(data.detail) ?? detail
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }
  if (!responseLooksLikeJson(res)) {
    throw new Error('Unexpected response from checkout API.')
  }
  return JSON.parse(text)
}

/**
 * Pollable order status — backend remains source of truth after IPN.
 * @param {string} paymentId - UUID string
 * @param {{ refresh?: boolean }} [opts]
 */
export async function fetchPaymentStatus(paymentId, opts = {}) {
  const refresh = opts.refresh === true
  const q = refresh ? '?refresh=true' : ''
  const res = await fetch(apiUrl(`/api/payments/${paymentId}${q}`), {
    headers: { ...jsonAcceptHeaders },
    cache: 'no-store',
  })
  const text = await res.text()
  if (!res.ok) {
    let detail = `Status request failed (${res.status})`
    try {
      const data = JSON.parse(text)
      detail = parseFastApiErrorDetail(data.detail) ?? detail
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }
  if (!responseLooksLikeJson(res)) {
    throw new Error('Unexpected response from payments API.')
  }
  return JSON.parse(text)
}

/**
 * Pre-signed GET URLs for premium ZIPs after treasury confirmation.
 * @param {string} paymentId - UUID
 * @returns {Promise<{ items: Array<{ beat_id: number, title: string, download_url: string }>, expires_in_seconds: number }>}
 */
export async function fetchPaymentDownloads(paymentId) {
  const res = await fetch(apiUrl(`/api/payments/${paymentId}/downloads`), {
    headers: { ...jsonAcceptHeaders },
    cache: 'no-store',
  })
  const text = await res.text()
  if (!res.ok) {
    let detail = `Download URLs request failed (${res.status})`
    try {
      const data = JSON.parse(text)
      detail = parseFastApiErrorDetail(data.detail) ?? detail
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }
  if (!responseLooksLikeJson(res)) {
    throw new Error('Unexpected response from payments downloads API.')
  }
  return JSON.parse(text)
}
