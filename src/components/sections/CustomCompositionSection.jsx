import { ButtonPrimary } from '../ui/Button.jsx'
import { MaterialIcon } from '../ui/MaterialIcon.jsx'
import { SectionHeading } from '../ui/SectionHeading.jsx'

export function CustomCompositionSection({ content }) {
  const {
    sectionTitle,
    sectionSubtitle,
    eyebrow,
    title,
    description,
    features,
    startingPrice,
    cta,
    sideImage,
  } = content
  return (
    <section
      id="custom"
      className="page-container flex w-full max-w-[1440px] flex-col gap-12 py-12"
    >
      {sectionTitle ? (
        <SectionHeading
          title={sectionTitle}
          subtitle={sectionSubtitle}
          centered
        />
      ) : null}
      <div className="relative flex w-full flex-col overflow-hidden rounded-lg border border-white/5 bg-surface shadow-2xl md:flex-row">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full bg-gradient-to-bl from-primary/5 to-transparent" />
        <div className="relative z-10 flex-1 p-8 lg:p-12">
          <div className="mb-6">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </span>
            <h2 className="mb-4 font-display text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
              {title}
            </h2>
            <p className="max-w-2xl text-lg text-text-muted">{description}</p>
          </div>
          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <MaterialIcon name={f.icon} className="text-primary" />
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-white">
                    {f.title}
                  </h4>
                  <p className="mt-1 text-xs text-text-muted">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-8 border-t border-white/5 pt-10 sm:flex-row">
            <div className="flex flex-col">
              <span className="mb-1 text-xs font-bold uppercase tracking-widest text-text-muted">
                Starting at
              </span>
              <span className="text-5xl font-black text-white">{startingPrice}</span>
            </div>
            <ButtonPrimary type="button" className="w-full px-10 sm:w-auto">
              {cta}
            </ButtonPrimary>
          </div>
        </div>
        <div className="hidden w-1/3 flex-shrink-0 items-center justify-center overflow-hidden border-l border-white/5 bg-background-dark/50 lg:flex">
          <div className="relative h-full w-full opacity-30 grayscale transition-all duration-700 hover:grayscale-0">
            <img
              src={sideImage}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
