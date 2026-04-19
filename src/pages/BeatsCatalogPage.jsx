import { useState } from 'react'
import { Footer } from '../components/layout/Footer.jsx'
import { TopNav } from '../components/layout/TopNav.jsx'
import { LicenseModal } from '../components/ui/LicenseModal.jsx'
import { BeatCard } from '../components/ui/BeatCard.jsx'
import { SectionHeading } from '../components/ui/SectionHeading.jsx'
import { beatsCatalog, footer, navLinksCatalog } from '../data/homeContent.js'

const CARDS_PER_MOBILE_ROW = 4

/** Same max width as home featured beats — keeps cards one consistent size */
const beatCardShellClass = 'w-full min-w-0 max-w-[18.5rem]'

function chunkEvery(items, size) {
  const chunks = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

const mobileCatalogRows = chunkEvery(beatsCatalog, CARDS_PER_MOBILE_ROW)

export default function BeatsCatalogPage() {
  const [licenseTrack, setLicenseTrack] = useState(null)

  return (
    <div className="page-shell">
      <TopNav links={navLinksCatalog} />
      <main className="relative flex w-full flex-1 flex-col items-center bg-gradient-to-b from-nav via-background-dark to-background-dark">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(27, 187, 131, 0.12), transparent 55%)',
          }}
        />
        <div className="page-container relative z-10 flex w-full max-w-[1440px] flex-col gap-12 pt-8 pb-20 md:pt-10 md:pb-24">
          <SectionHeading
            title="Beats catalog"
            subtitle="Browse every track—same leases, same quality."
          />
          {/* Mobile: each row = up to 4 cards in a horizontal scroller */}
          <div className="flex flex-col gap-8 sm:hidden">
            {mobileCatalogRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="-mx-8 flex flex-nowrap gap-4 overflow-x-auto px-8 pb-2 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {row.map((beat) => (
                  <div
                    key={beat.id}
                    className="w-[min(85vw,18.5rem)] shrink-0 snap-start"
                  >
                    <div className={beatCardShellClass}>
                      <BeatCard
                        compact
                        title={beat.title}
                        meta={beat.meta}
                        price={beat.price}
                        image={beat.image}
                        alt={beat.alt}
                        onSelectLicense={() => setLicenseTrack(beat)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* sm+: grid — card width capped & centered like mobile / home */}
          <div className="hidden sm:grid sm:grid-cols-2 sm:justify-items-center sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {beatsCatalog.map((beat) => (
              <div key={beat.id} className={beatCardShellClass}>
                <BeatCard
                  compact
                  title={beat.title}
                  meta={beat.meta}
                  price={beat.price}
                  image={beat.image}
                  alt={beat.alt}
                  onSelectLicense={() => setLicenseTrack(beat)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer
        email={footer.email}
        location={footer.location}
        legal={footer.legal}
        developerCredit={footer.developerCredit}
        socialLinks={footer.socialLinks}
      />
      <LicenseModal
        open={licenseTrack != null}
        track={licenseTrack}
        onClose={() => setLicenseTrack(null)}
      />
    </div>
  )
}
