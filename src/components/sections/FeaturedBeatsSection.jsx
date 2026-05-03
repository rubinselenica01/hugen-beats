import { Link } from 'react-router-dom'
import { BeatCard } from '../ui/BeatCard.jsx'
import { MaterialIcon } from '../ui/MaterialIcon.jsx'
import { SectionHeading } from '../ui/SectionHeading.jsx'
import { defaultBeatPreviewAudioUrl } from '../../data/homeContent.js'

export function FeaturedBeatsSection({
  beats,
  loading = false,
  loadError = false,
  onSelectLicense,
}) {
  return (
    <section
      className="page-container flex w-full max-w-[1440px] flex-col gap-5 pt-10 pb-16 sm:gap-8 sm:pt-16 sm:pb-20 md:py-24"
      id="beats"
    >
      <SectionHeading
        title="Featured Beats"
        subtitle="Latest drops and premium selections."
        className="!pb-4 sm:!pb-6"
      />
      {loadError ? (
        <p className="text-sm text-red-300" role="alert">
          Could not load beats. Try again later.
        </p>
      ) : loading ? (
        <p className="text-sm text-text-muted">Loading beats…</p>
      ) : !beats.length ? (
        <p className="text-sm text-text-muted">New beats coming soon.</p>
      ) : (
        <div
          className="-mx-8 flex flex-nowrap gap-4 overflow-x-auto px-8 pb-2 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0 sm:snap-none lg:grid-cols-4 lg:gap-8 [&::-webkit-scrollbar]:hidden"
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
                previewAudioUrl={beat.previewAudioUrl ?? defaultBeatPreviewAudioUrl}
                previewPlaybackId={beat.id}
                onSelectLicense={() =>
                  onSelectLicense?.(beat.licenseTrack ?? beat)
                }
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center border-t border-surface-hover pt-4 sm:pt-6">
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
