import { ButtonOutline, ButtonPrimary } from '../ui/Button.jsx'
import { MaterialIcon } from '../ui/MaterialIcon.jsx'

export function HeroSection({ title, subtitle, backgroundImage }) {
  return (
    <section className="relative flex min-h-[calc(100dvh-5rem)] w-full flex-col items-center justify-center overflow-hidden bg-background-dark px-6">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/50 to-transparent" />
        <div className="hero-blur-bg" />
      </div>
      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-8 py-8 text-center">
        <h1 className="font-display text-6xl font-black uppercase leading-none tracking-tighter text-white text-glow md:text-8xl lg:text-[120px]">
          {title}
        </h1>
        <p className="max-w-2xl text-lg font-medium text-text-muted md:text-2xl">
          {subtitle[0]}{' '}
          <br className="hidden md:block" />
          {subtitle[1]}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <ButtonPrimary type="button">
            <MaterialIcon name="play_arrow" className="mr-2" filled />
            Listen to Beats
          </ButtonPrimary>
          <ButtonOutline type="button">Buy License</ButtonOutline>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-50 animate-bounce">
        <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Scroll
        </span>
        <MaterialIcon name="expand_more" className="text-text-muted" />
      </div>
    </section>
  )
}
