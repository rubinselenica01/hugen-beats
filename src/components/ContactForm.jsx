import { useId, useState } from 'react'
import { validateContactForm, submitContact } from '../services/contactService.js'
import { MaterialIcon } from './ui/MaterialIcon.jsx'

const inputClass =
  'mt-1 block w-full rounded-lg border border-white/15 bg-background-dark/80 px-4 py-3 text-sm text-white shadow-inner placeholder:text-text-muted/80 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60'
const labelClass = 'text-xs font-semibold uppercase tracking-wide text-text-muted'

export function ContactForm() {
  const formId = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError(null)
    setSuccess(false)

    const values = { name, email, subject, message }
    const localErrors = validateContactForm(values)
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors)
      return
    }
    setFieldErrors({})

    setSubmitting(true)
    const result = await submitContact(values)
    setSubmitting(false)

    if (result.ok) {
      setSuccess(true)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      return
    }

    if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
      setFieldErrors(result.fieldErrors)
    }
    setFormError(result.error ?? 'Something went wrong.')
  }

  if (success) {
    return (
      <div
        className="rounded-xl border border-primary/35 bg-primary/10 px-6 py-8 text-center sm:px-8"
        role="status"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary">
          <MaterialIcon name="mark_email_read" className="text-[32px]" filled />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-white">Message sent</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          Thanks for reaching out — we will get back to you as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 rounded-full border border-white/20 bg-surface-hover/60 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-xl border border-white/10 bg-surface/40 p-6 shadow-xl backdrop-blur-sm sm:p-8"
      noValidate
    >
      {formError ? (
        <div
          className="rounded-lg border border-red-400/40 bg-red-950/40 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {formError}
        </div>
      ) : null}

      <div>
        <label htmlFor={`${formId}-name`} className={labelClass}>
          Name
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
          className={inputClass}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? `${formId}-name-err` : undefined}
        />
        {fieldErrors.name ? (
          <p id={`${formId}-name-err`} className="mt-1.5 text-xs text-red-300">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${formId}-email`} className={labelClass}>
          Email
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          className={inputClass}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? `${formId}-email-err` : undefined}
        />
        {fieldErrors.email ? (
          <p id={`${formId}-email-err`} className="mt-1.5 text-xs text-red-300">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${formId}-subject`} className={labelClass}>
          Subject
        </label>
        <input
          id={`${formId}-subject`}
          name="subject"
          type="text"
          autoComplete="off"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={submitting}
          className={inputClass}
          aria-invalid={!!fieldErrors.subject}
          aria-describedby={fieldErrors.subject ? `${formId}-subject-err` : undefined}
        />
        {fieldErrors.subject ? (
          <p id={`${formId}-subject-err`} className="mt-1.5 text-xs text-red-300">
            {fieldErrors.subject}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className={labelClass}>
          Message
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitting}
          className={`${inputClass} resize-y min-h-[140px]`}
          placeholder="Tell us about your project or question…"
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? `${formId}-message-err` : undefined}
        />
        {fieldErrors.message ? (
          <p id={`${formId}-message-err`} className="mt-1.5 text-xs text-red-300">
            {fieldErrors.message}
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-text-muted">Minimum 10 characters.</p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-8 text-sm font-bold uppercase tracking-wide text-background-dark transition-transform hover:scale-[1.02] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-background-dark/30 border-t-background-dark"
                aria-hidden
              />
              Sending…
            </span>
          ) : (
            'Send message'
          )}
        </button>
      </div>
    </form>
  )
}
