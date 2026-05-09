import { apiUrl, jsonAcceptHeaders } from '../utils/apiBase.js'
import { parseFastApiErrorDetail, responseLooksLikeJson } from '../utils/fastApiParse.js'

/**
 * @param {{ name: string, email: string, subject: string, message: string }} values
 * @returns {Record<string, string>} field errors (empty if valid)
 */
export function validateContactForm(values) {
  const errors = {}
  const name = typeof values.name === 'string' ? values.name.trim() : ''
  const email = typeof values.email === 'string' ? values.email.trim() : ''
  const subject = typeof values.subject === 'string' ? values.subject.trim() : ''
  const message = typeof values.message === 'string' ? values.message.trim() : ''

  if (!name) errors.name = 'Name is required.'
  if (!email) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'
  if (!subject) errors.subject = 'Subject is required.'
  if (message.length < 10) errors.message = 'Message must be at least 10 characters.'

  return errors
}

/**
 * @param {{ name: string, email: string, subject: string, message: string }} payload
 * @returns {Promise<{ ok: true } | { ok: false, error: string, fieldErrors?: Record<string, string> }>}
 */
export async function submitContact(payload) {
  const errors = validateContactForm(payload)
  if (Object.keys(errors).length > 0) {
    return { ok: false, error: 'Please fix the errors below.', fieldErrors: errors }
  }

  const url = apiUrl('/api/contact')
  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { ...jsonAcceptHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim(),
        subject: payload.subject.trim(),
        message: payload.message.trim(),
      }),
    })
  } catch {
    return { ok: false, error: 'Could not reach the server. Check your connection and try again.' }
  }

  if (res.status === 429) {
    return { ok: false, error: 'Too many attempts. Please wait a few minutes and try again.' }
  }

  if (res.ok) {
    return { ok: true }
  }

  let detail = `Request failed (${res.status}).`
  if (responseLooksLikeJson(res)) {
    try {
      const data = await res.json()
      if (data?.detail) detail = parseFastApiErrorDetail(data.detail) ?? detail
    } catch {
      /* ignore */
    }
  }
  return { ok: false, error: detail }
}
