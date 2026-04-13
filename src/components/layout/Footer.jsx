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
          <div className="flex flex-col gap-4 md:justify-self-start">
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

          <nav
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 justify-self-center text-center"
            aria-label="Social links"
          >
            {socialLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold uppercase tracking-wider text-text-muted transition-colors hover:text-primary"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-4 md:items-end md:justify-self-end">
            <div className="flex items-center gap-3 text-white">
              <LogoMark className="size-5 text-primary" />
              <span className="font-display text-lg font-bold uppercase tracking-tight">
                HUGEN BEATS
              </span>
            </div>
            <div className="text-sm text-text-muted">{legal}</div>
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
