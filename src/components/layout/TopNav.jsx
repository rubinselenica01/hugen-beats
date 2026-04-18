import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import { LogoMark, LogoWordmark } from '../brand/Logo.jsx'
import { ButtonPrimarySm } from '../ui/Button.jsx'

/** e.g. "/#beats" -> "beats" */
function hashIdFromHomeHashLink(to) {
  if (typeof to !== 'string') return null
  const m = to.match(/^\/#(.+)$/)
  return m ? m[1] : null
}

export function TopNav({ links }) {
  const { openCart, cartCount } = useCart()
  const location = useLocation()

  return (
    <div
      className="group/design-root sticky top-0 z-50 flex h-auto w-full flex-col bg-nav"
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
                  {links.map(({ to, label }) => (
                    <Link
                      key={label}
                      to={to}
                      className="text-sm font-medium leading-normal text-white transition-colors duration-300 hover:text-primary"
                      onClick={(e) => {
                        const id = hashIdFromHomeHashLink(to)
                        if (!id) return
                        if (
                          location.pathname === '/' &&
                          location.hash === `#${id}`
                        ) {
                          e.preventDefault()
                          document
                            .getElementById(id)
                            ?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            })
                        }
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
                <ButtonPrimarySm type="button" onClick={openCart}>
                  <span className="truncate">Cart ({cartCount})</span>
                </ButtonPrimarySm>
              </div>
            </header>
          </div>
        </div>
      </div>
    </div>
  )
}
