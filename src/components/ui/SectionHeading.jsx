/** Section title row — reuse on listing pages */
export function SectionHeading({
  title,
  subtitle,
  action,
  className = '',
}) {
  return (
    <div
      className={`flex items-end justify-between border-b border-surface-hover pb-6 ${className}`}
    >
      <div>
        <h2 className="mb-2 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-text-muted">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
