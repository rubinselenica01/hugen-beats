import { useState } from 'react'
import { Footer } from '../components/layout/Footer.jsx'
import { TopNav } from '../components/layout/TopNav.jsx'
import { LicenseModal } from '../components/ui/LicenseModal.jsx'
import { BeatCard } from '../components/ui/BeatCard.jsx'
import { SectionHeading } from '../components/ui/SectionHeading.jsx'
import { beatsCatalog, footer, navLinks } from '../data/homeContent.js'

export default function BeatsCatalogPage() {
  const [licenseTrack, setLicenseTrack] = useState(null)

  return (
    <div className="page-shell">
      <TopNav links={navLinks} cartCount={0} />
      <main className="relative flex w-full flex-1 flex-col items-center bg-gradient-to-b from-nav via-background-dark to-background-dark">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(27, 187, 131, 0.12), transparent 55%)',
          }}
        />
        <div className="page-container relative z-10 flex w-full max-w-[1440px] flex-col gap-12 py-24">
          <SectionHeading
            title="Beats catalog"
            subtitle="Browse every track—same leases, same quality."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {beatsCatalog.map((beat) => (
              <BeatCard
                key={beat.id}
                title={beat.title}
                meta={beat.meta}
                price={beat.price}
                image={beat.image}
                alt={beat.alt}
                onSelectLicense={() => setLicenseTrack(beat)}
              />
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
