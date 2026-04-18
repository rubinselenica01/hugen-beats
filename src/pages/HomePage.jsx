import { useState } from 'react'
import { Footer } from '../components/layout/Footer.jsx'
import { TopNav } from '../components/layout/TopNav.jsx'
import { CustomCompositionSection } from '../components/sections/CustomCompositionSection.jsx'
import { EditorialAboutSection } from '../components/sections/EditorialAboutSection.jsx'
import { FeaturedBeatsSection } from '../components/sections/FeaturedBeatsSection.jsx'
import { HeroSection } from '../components/sections/HeroSection.jsx'
import { LicenseModal } from '../components/ui/LicenseModal.jsx'
import {
  about,
  customComposition,
  featuredBeats,
  footer,
  hero,
  navLinks,
} from '../data/homeContent.js'

export default function HomePage() {
  const [licenseTrack, setLicenseTrack] = useState(null)

  return (
    <div className="page-shell">
      <TopNav links={navLinks} />
      <main className="flex w-full flex-1 flex-col items-center">
        <HeroSection
          title={hero.title}
          subtitle={hero.subtitle}
          backgroundImage={hero.backgroundImage}
        />
        <FeaturedBeatsSection
          beats={featuredBeats}
          onSelectLicense={setLicenseTrack}
        />
        <CustomCompositionSection content={customComposition} />
        <EditorialAboutSection about={about} />
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
