import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js'
import { useCart } from '../../context/CartContext.jsx'
import { SpotlightLicenseCard } from './SpotlightLicenseCard.jsx'

export function LicenseModal({ open, onClose, track }) {
  const { addToCart } = useCart()
  const [selectedPlanName, setSelectedPlanName] = useState(null)

  useEffect(() => {
    if (open && track) {
      const one = track.plans?.length === 1
      setSelectedPlanName(one ? track.plans[0].name : null)
    }
  }, [open, track?.id, track?.plans])

  useBodyScrollLock(open && !!track)

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
        aria-label={
          plans.length > 1
            ? `License options for ${title}`
            : `License for ${title}`
        }
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
        <SpotlightLicenseCard
          title={title}
          description={description}
          tags={tags}
          image={image}
          alt={alt}
          plans={plans}
          eyebrow={licenseEyebrow ?? 'License'}
          selectedPlanName={selectedPlanName}
          onSelectPlan={
            plans.length > 1
              ? (plan) => setSelectedPlanName(plan.name)
              : undefined
          }
          onAddToCart={(plan) => {
            addToCart({ track, plan })
            onClose()
          }}
        />
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
