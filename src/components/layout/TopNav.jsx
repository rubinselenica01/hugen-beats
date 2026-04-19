import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { licensesOverlayContent } from '../../data/homeContent.js'
import { scrollElementBelowNav } from '../../utils/scrollToAnchor.js'
import { useCart } from '../../context/CartContext.jsx'
import { LogoMark, LogoWordmark } from '../brand/Logo.jsx'
import { MaterialIcon } from '../ui/MaterialIcon.jsx'
import { LicensesOverlay } from './LicensesOverlay.jsx'

/** e.g. "/#beats" -> "beats" */
function hashIdFromHomeHashLink(to) {
  if (typeof to !== 'string') return null
  const m = to.match(/^\/#(.+)$/)
  return m ? m[1] : null
}

const navLinkClassName =
  'text-sm font-medium leading-normal text-white transition-colors duration-300 hover:text-primary'

export function TopNav({ links }) {
  const { openCart, cartCount } = useCart()
  const location = useLocation()
  const [licensesOpen, setLicensesOpen] = useState(false)

  return (
    <div
      className="group/design-root fixed inset-x-0 top-0 z-50 flex min-h-[var(--top-nav-height)] w-full flex-col bg-nav"
      style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-0">
          <div className="layout-content-container flex w-full flex-1 flex-col">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-nav-border bg-background-dark/80 px-10 py-4 backdrop-blur-md">
              <Link
                to="/"
                className="flex cursor-pointer items-center gap-4 text-white transition-opacity hover:opacity-80"
              >
                <LogoMark />
                <LogoWordmark />
              </Link>
              <div className="flex flex-1 justify-end gap-8">
                <nav className="hidden items-center gap-9 sm:flex">
                  {links.map(({ to, label, licensesOverlay }) =>
                    licensesOverlay ? (
                      <button
                        key={label}
                        type="button"
                        className={navLinkClassName}
                        onClick={() => setLicensesOpen(true)}
                      >
                        {label}
                      </button>
                    ) : (
                      <Link
                        key={label}
                        to={to}
                        className={navLinkClassName}
                        onClick={(e) => {
                          const id = hashIdFromHomeHashLink(to)
                          if (!id) return
                          if (
                            location.pathname === '/' &&
                            location.hash === `#${id}`
                          ) {
                            e.preventDefault()
                            const target = document.getElementById(id)
                            if (target) {
                              scrollElementBelowNav(target, { behavior: 'smooth' })
                            }
                          }
                        }}
                      >
                        {label}
                      </Link>
                    ),
                  )}
                </nav>
                <button
                  type="button"
                  onClick={openCart}
                  className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-background-dark transition-transform hover:scale-105"
                  aria-label={
                    cartCount > 0
                      ? `Open shopping cart, ${cartCount} items`
                      : 'Open shopping cart'
                  }
                >
                  <MaterialIcon name="shopping_cart" className="text-[22px]" filled />
                  {cartCount > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-background-dark px-0.5 text-[10px] font-bold leading-none text-primary ring-2 ring-primary">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  ) : null}
                </button>
              </div>
            </header>
          </div>
        </div>
      </div>
      <LicensesOverlay
        open={licensesOpen}
        onClose={() => setLicensesOpen(false)}
        title={licensesOverlayContent.title}
        paragraphs={licensesOverlayContent.paragraphs}
      />
    </div>
  )
}
