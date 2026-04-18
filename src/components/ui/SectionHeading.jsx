/** Section title row — reuse on listing pages */
export function SectionHeading({
  title,
  subtitle,
  action,
  centered = false,
  className = '',
}) {
  return (
    <div
      className={`border-b border-surface-hover pb-6 ${className} ${
        centered
          ? 'flex flex-col items-center text-center'
          : 'flex items-end justify-between'
      }`}
    >
      <div className={centered ? 'max-w-2xl' : ''}>
        <h2 className="mb-2 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-text-muted">{subtitle}</p>
        ) : null}
      </div>
      {!centered ? action : null}
    </div>
  )
}
