import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { SpotlightLicenseCard } from './SpotlightLicenseCard.jsx'

export function LicenseModal({ open, onClose, track, onAddToCart }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !track) return null

  const {
    title,
    description,
    tags,
    image,
    alt,
    plans,
    licenseEyebrow,
  } = track

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`License options for ${title}`}
        className="relative max-h-[min(90vh,900px)] w-full max-w-4xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-[110] flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-background-dark/90 text-text-muted transition-colors hover:border-primary/50 hover:text-white"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart?.(track)
          }}
          className="absolute bottom-4 right-4 z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-primary text-background-dark shadow-glow transition-all hover:scale-105 hover:bg-primary-hover"
          aria-label="Add to cart"
          title="Add to cart"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            add_shopping_cart
          </span>
        </button>
        <SpotlightLicenseCard
          title={title}
          description={description}
          tags={tags}
          image={image}
          alt={alt}
          plans={plans}
          eyebrow={licenseEyebrow ?? 'License'}
        />
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
