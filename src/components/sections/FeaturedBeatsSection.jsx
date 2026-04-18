import { Link } from 'react-router-dom'
import { BeatCard } from '../ui/BeatCard.jsx'
import { MaterialIcon } from '../ui/MaterialIcon.jsx'
import { SectionHeading } from '../ui/SectionHeading.jsx'

export function FeaturedBeatsSection({ beats, onSelectLicense }) {
  return (
    <section
      className="page-container flex w-full max-w-[1440px] flex-col gap-8 py-24"
      id="beats"
    >
      <SectionHeading
        title="Featured Beats"
        subtitle="Latest drops and premium selections."
      />
      <div
        className="-mx-8 flex flex-nowrap gap-4 overflow-x-auto overflow-y-visible px-8 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none lg:grid-cols-4 lg:gap-8 [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {beats.map((beat) => (
          <div
            key={beat.id}
            className="w-[min(85vw,18.5rem)] shrink-0 snap-start sm:w-auto sm:min-w-0 sm:shrink sm:snap-none"
          >
            <BeatCard
              compact
              title={beat.title}
              meta={beat.meta}
              price={beat.price}
              image={beat.image}
              alt={beat.alt}
              onSelectLicense={() => onSelectLicense?.(beat)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center border-t border-surface-hover pt-6">
        <Link
          className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-primary transition-colors duration-300 hover:text-white"
          to="/beats"
        >
          View All{' '}
          <MaterialIcon name="arrow_forward" className="ml-1 text-lg" />
        </Link>
      </div>
    </section>
  )
}
