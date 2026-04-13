import { BeatCard } from '../ui/BeatCard.jsx'
import { MaterialIcon } from '../ui/MaterialIcon.jsx'
import { SectionHeading } from '../ui/SectionHeading.jsx'

export function FeaturedBeatsSection({ beats }) {
  return (
    <section className="page-container flex w-full max-w-[1440px] flex-col gap-12 py-24" id="beats">
      <SectionHeading
        title="Featured Beats"
        subtitle="Latest drops and premium selections."
        action={
          <a
            className="hidden items-center text-sm font-bold uppercase tracking-wider text-primary transition-colors duration-300 hover:text-white md:flex"
            href="#"
          >
            View All{' '}
            <MaterialIcon name="arrow_forward" className="ml-1 text-lg" />
          </a>
        }
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {beats.map((beat) => (
          <BeatCard key={beat.id} {...beat} />
        ))}
      </div>
    </section>
  )
}
