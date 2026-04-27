/** Spotlight-style license card (same layout as the former SpotlightSection). */
export function SpotlightLicenseCard({
  title,
  description,
  tags,
  image,
  alt,
  plans,
  eyebrow = 'License',
  selectedPlanName = null,
  onSelectPlan,
}) {
  const selectable = typeof onSelectPlan === 'function'
  const [singlePlan] = plans

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-lg border border-white/5 bg-surface shadow-2xl lg:flex-row">
      <div className="pointer-events-none absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
      <div className="group relative h-[280px] w-full flex-shrink-0 overflow-hidden sm:h-[360px] lg:h-[400px] lg:w-[400px]">
        <img
          src={image}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/40">
          <button
            type="button"
            className="flex h-20 w-20 scale-90 items-center justify-center rounded-full bg-primary/90 text-background-dark opacity-0 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
            aria-label="Preview track"
          >
            <span
              className="material-symbols-outlined ml-1 text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
          </button>
        </div>
      </div>
      <div className="relative z-10 flex flex-1 flex-col justify-center bg-gradient-to-r from-surface to-background-dark p-6 sm:p-8 lg:p-12">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-sm bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-text-muted">
            {eyebrow}
          </span>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="text-sm font-medium text-primary">
                {t}
              </span>
            ))}
          </div>
        </div>
        <h2 className="mb-2 font-display text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h2>
        <p className="mb-6 text-base text-text-muted sm:text-lg">{description}</p>
        {plans.length === 1 && !selectable && singlePlan ? (
          <div className="relative w-full overflow-hidden rounded-md border-2 border-primary/30 bg-primary/5 p-4 sm:p-5">
            <span className="mb-1 block text-sm font-bold uppercase tracking-wider text-primary">
              {singlePlan.name}
            </span>
            <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <span className="text-2xl font-bold text-white sm:text-3xl">
                {singlePlan.price}
              </span>
              <p className="text-sm text-text-muted sm:max-w-[60%] sm:text-right sm:text-base">
                {singlePlan.detail}
              </p>
            </div>
          </div>
        ) : (
        <div
          className="flex flex-col gap-4 sm:flex-row"
          role={selectable ? 'radiogroup' : undefined}
          aria-label={selectable ? 'License type' : undefined}
        >
          {plans.map((plan) => {
            const isSelected = selectable && selectedPlanName === plan.name
            const popular = plan.variant === 'popular'
            const popularBase =
              'group relative flex flex-1 flex-col overflow-hidden rounded-md border-2 p-4 text-left transition-all duration-300'
            const popularIdle =
              'border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10'
            const popularSelected =
              'border-primary bg-primary/15 shadow-[0_0_0_1px_rgba(27,187,131,0.5)] ring-2 ring-primary/40'
            const basicBase =
              'group flex flex-1 flex-col rounded-md border p-4 text-left transition-all duration-300'
            const basicIdle =
              'border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10'
            const basicSelected =
              'border-primary bg-primary/10 ring-2 ring-primary/30'

            if (popular) {
              return (
                <button
                  key={plan.name}
                  type="button"
                  onClick={() => selectable && onSelectPlan(plan)}
                  role={selectable ? 'radio' : undefined}
                  aria-checked={selectable ? isSelected : undefined}
                  className={`${popularBase} ${
                    isSelected ? popularSelected : popularIdle
                  } ${selectable ? 'cursor-pointer' : ''}`}
                >
                  <div className="absolute right-0 top-0 rounded-bl-sm bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background-dark">
                    {plan.badge}
                  </div>
                  <span className="mb-1 text-sm font-bold uppercase tracking-wider text-primary">
                    {plan.name}
                  </span>
                  <div className="flex w-full items-end justify-between">
                    <span className="text-2xl font-bold text-white">{plan.price}</span>
                    <span className="text-xs text-text-muted">{plan.detail}</span>
                  </div>
                </button>
              )
            }

            return (
              <button
                key={plan.name}
                type="button"
                onClick={() => selectable && onSelectPlan(plan)}
                role={selectable ? 'radio' : undefined}
                aria-checked={selectable ? isSelected : undefined}
                className={`${basicBase} ${
                  isSelected ? basicSelected : basicIdle
                } ${selectable ? 'cursor-pointer' : ''}`}
              >
                <span
                  className={`mb-1 text-sm font-bold uppercase tracking-wider transition-colors ${
                    isSelected ? 'text-primary' : 'text-text-muted group-hover:text-white'
                  }`}
                >
                  {plan.name}
                </span>
                <div className="flex w-full items-end justify-between">
                  <span className="text-2xl font-bold text-white">{plan.price}</span>
                  <span className="text-xs text-text-muted">{plan.detail}</span>
                </div>
              </button>
            )
          })}
        </div>
        )}
      </div>
    </div>
  )
}
