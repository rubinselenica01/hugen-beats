export function SpotlightSection({ spotlight }) {
  const { title, description, tags, image, alt, plans } = spotlight
  return (
    <section className="page-container w-full max-w-[1440px] py-12">
      <div className="relative flex w-full flex-col overflow-hidden rounded-lg border border-white/5 bg-surface shadow-2xl lg:flex-row">
        <div className="pointer-events-none absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
        <div className="group relative h-[400px] w-full flex-shrink-0 cursor-pointer overflow-hidden lg:w-[400px]">
          <img
            src={image}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/40">
            <button
              type="button"
              className="flex h-20 w-20 scale-90 items-center justify-center rounded-full bg-primary/90 text-background-dark opacity-0 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
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
        <div className="relative z-10 flex flex-1 flex-col justify-center bg-gradient-to-r from-surface to-background-dark p-8 lg:p-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-sm bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-text-muted">
              Featured
            </span>
            <div className="flex gap-2">
              {tags.map((t) => (
                <span key={t} className="text-sm font-medium text-primary">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <h2 className="mb-2 font-display text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mb-8 text-lg text-text-muted">{description}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            {plans.map((plan) =>
              plan.variant === 'popular' ? (
                <button
                  key={plan.name}
                  type="button"
                  className="group relative flex flex-1 flex-col overflow-hidden rounded-md border-2 border-primary/30 bg-primary/5 p-4 text-left transition-all duration-300 hover:border-primary hover:bg-primary/10"
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
              ) : (
                <button
                  key={plan.name}
                  type="button"
                  className="group flex flex-1 flex-col rounded-md border border-white/10 bg-white/5 p-4 text-left transition-all duration-300 hover:border-primary/50 hover:bg-white/10"
                >
                  <span className="mb-1 text-sm font-bold uppercase tracking-wider text-text-muted transition-colors group-hover:text-white">
                    {plan.name}
                  </span>
                  <div className="flex w-full items-end justify-between">
                    <span className="text-2xl font-bold text-white">{plan.price}</span>
                    <span className="text-xs text-text-muted">{plan.detail}</span>
                  </div>
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
