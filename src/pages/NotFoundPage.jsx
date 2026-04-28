import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-gradient-to-b from-nav via-background-dark to-background-dark px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 55% 35% at 50% 35%, rgba(27, 187, 131, 0.35), transparent 70%)',
        }}
      />
      <div className="relative z-[1] mx-auto max-w-md text-center">
        <p className="font-display text-5xl font-bold tracking-tight text-primary md:text-6xl">
          404
        </p>
        <h1 className="mt-6 text-2xl font-bold tracking-wide text-white md:text-3xl">
          PAGE NOT FOUND
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-muted md:text-base">
          Nothing lives at this address. It may have moved or the link could be wrong.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex rounded-full border border-nav-border bg-surface px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-primary/40 hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
