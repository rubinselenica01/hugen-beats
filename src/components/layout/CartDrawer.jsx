import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ButtonPrimary } from '../ui/Button.jsx'

export function CartDrawer({ open, onClose, items, onRemove }) {
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

  const drawer = (
    <>
      <div
        className={`fixed inset-0 z-[90] bg-black/55 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[91] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-surface shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center gap-4 border-b border-white/10 px-4 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-background-dark/90 text-text-muted transition-colors hover:border-primary/50 hover:text-white"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          <h2 className="font-display text-lg font-bold tracking-tight text-white">
            Cart
          </h2>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-text-muted">
              Your cart is empty. Add beats from the catalog to get started.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {items.map(({ lineId, track, plan }) => (
                <li
                  key={lineId}
                  className="flex gap-3 rounded-md border border-white/5 bg-background-dark/40 p-3"
                >
                  <img
                    src={track.image}
                    alt={track.alt ?? ''}
                    className="h-16 w-16 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-white">{track.title}</p>
                    <p className="text-sm text-text-muted">{track.meta}</p>
                    {plan ? (
                      <>
                        <p className="mt-1 text-xs font-bold uppercase tracking-wide text-primary">
                          {plan.name}
                        </p>
                        <p className="text-sm font-bold text-white">{plan.price}</p>
                        <p className="text-xs text-text-muted">{plan.detail}</p>
                      </>
                    ) : (
                      <p className="mt-1 text-sm font-bold text-primary">
                        {track.price}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(lineId)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-text-muted transition-colors hover:border-red-500/50 hover:text-red-400"
                    aria-label={`Remove ${track.title} from cart`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      delete
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="shrink-0 border-t border-white/10 bg-background-dark/40 p-4">
          <ButtonPrimary type="button" className="w-full">
            Checkout
          </ButtonPrimary>
        </div>
      </aside>
    </>
  )

  return createPortal(drawer, document.body)
}
