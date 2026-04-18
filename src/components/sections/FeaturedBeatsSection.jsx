import { Link } from 'react-router-dom'
import { BeatCard } from '../ui/BeatCard.jsx'
import { MaterialIcon } from '../ui/MaterialIcon.jsx'
import { SectionHeading } from '../ui/SectionHeading.jsx'

export function FeaturedBeatsSection({ beats, onSelectLicense }) {
  return (
    <section
      className="page-container flex w-full max-w-[1440px] scroll-mt-24 flex-col gap-12 py-24"
      id="beats"
    >
      <SectionHeading
        title="Featured Beats"
        subtitle="Latest drops and premium selections."
        action={
          <Link
            className="hidden items-center text-sm font-bold uppercase tracking-wider text-primary transition-colors duration-300 hover:text-white md:flex"
            to="/beats"
          >
            View All{' '}
            <MaterialIcon name="arrow_forward" className="ml-1 text-lg" />
          </Link>
        }
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {beats.map((beat) => (
          <BeatCard
            key={beat.id}
            title={beat.title}
            meta={beat.meta}
            price={beat.price}
            image={beat.image}
            alt={beat.alt}
            onSelectLicense={() => onSelectLicense?.(beat)}
          />
        ))}
      </div>
    </section>
  )
}
