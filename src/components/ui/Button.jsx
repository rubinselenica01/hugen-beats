/**
 * Reusable button styles — shared across pages (hero, CTAs, cards).
 */

const base =
  'inline-flex cursor-pointer items-center justify-center font-bold transition-all duration-300'

export function ButtonPrimary({
  children,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`${base} h-14 rounded-full bg-primary px-8 text-base uppercase tracking-wider text-background-dark shadow-glow hover:scale-105 hover:bg-primary-hover ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonPrimarySm({
  children,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`${base} h-10 min-w-[84px] max-w-[480px] rounded-full bg-primary px-6 text-sm leading-normal tracking-wide text-background-dark hover:scale-105 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonOutline({
  children,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`${base} h-14 rounded-full border-2 border-white/20 bg-transparent px-8 text-base uppercase tracking-wider text-white hover:border-white hover:bg-white/5 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function IconPlayButton({
  className = '',
  size = 'md',
  playing = false,
  ...props
}) {
  const sizeCls =
    size === 'lg'
      ? 'h-20 w-20'
      : size === 'sm'
        ? 'h-16 w-16'
        : 'h-16 w-16'
  return (
    <button
      type="button"
      className={`${base} ${sizeCls} rounded-full bg-primary text-background-dark shadow-xl hover:scale-110 ${className}`}
      {...props}
    >
      <span
        className={`material-symbols-outlined text-4xl ${playing ? '' : 'ml-1'}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {playing ? 'pause' : 'play_arrow'}
      </span>
    </button>
  )
}
