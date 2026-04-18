import { producerBrand } from '../../producerBrand.js'
import { LogoMark } from '../brand/Logo.jsx'

export function Footer({
  email,
  location,
  legal,
  developerCredit,
  socialLinks = [],
}) {
  return (
    <footer
      className={`mt-auto w-full border-t border-surface-hover bg-surface px-8 pt-12 md:px-16 ${developerCredit ? 'pb-4' : 'pb-12'}`}
    >
      <div className="page-container max-w-[1440px]">
        <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-3 md:gap-8">
          <nav
            className="order-1 flex flex-nowrap items-center justify-center gap-x-2 gap-y-0 justify-self-center text-center sm:gap-x-4 md:order-2 md:gap-x-8 md:justify-self-center"
            aria-label="Social links"
          >
            {socialLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-text-muted transition-colors hover:text-primary sm:text-sm sm:tracking-wider"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="order-2 flex flex-col items-center gap-4 text-center md:order-1 md:items-start md:justify-self-start md:text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact Information
            </h3>
            <div className="flex flex-col gap-1">
              <div className="cursor-pointer text-sm font-medium text-text-muted transition-colors hover:text-primary">
                Email: {email}
              </div>
              <div className="text-xs text-text-muted">Location: {location}</div>
            </div>
          </div>

          <div className="order-3 flex flex-col items-center gap-4 md:items-end md:justify-self-end">
            <div className="flex items-center gap-3 text-white">
              <LogoMark className="size-5 text-primary" />
              <span className="font-display text-lg font-bold uppercase tracking-tight">
                {producerBrand}
              </span>
            </div>
            <div className="text-center text-sm text-text-muted md:text-right">
              {legal}
            </div>
          </div>
        </div>

        {developerCredit ? (
          <p className="mt-3 text-center text-xs leading-tight text-text-muted">
            {developerCredit}
          </p>
        ) : null}
      </div>
    </footer>
  )
}
