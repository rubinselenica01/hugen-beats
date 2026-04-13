import { Footer } from '../components/layout/Footer.jsx'
import { TopNav } from '../components/layout/TopNav.jsx'
import { CustomCompositionSection } from '../components/sections/CustomCompositionSection.jsx'
import { EditorialAboutSection } from '../components/sections/EditorialAboutSection.jsx'
import { FeaturedBeatsSection } from '../components/sections/FeaturedBeatsSection.jsx'
import { HeroSection } from '../components/sections/HeroSection.jsx'
import { SpotlightSection } from '../components/sections/SpotlightSection.jsx'
import {
  about,
  customComposition,
  featuredBeats,
  footer,
  hero,
  navLinks,
  spotlight,
} from '../data/homeContent.js'

export default function HomePage() {
  return (
    <div className="page-shell">
      <TopNav links={navLinks} cartCount={0} />
      <main className="flex w-full flex-1 flex-col items-center">
        <HeroSection
          title={hero.title}
          subtitle={hero.subtitle}
          backgroundImage={hero.backgroundImage}
        />
        <FeaturedBeatsSection beats={featuredBeats} />
        <div id="licenses">
          <SpotlightSection spotlight={spotlight} />
        </div>
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
    </div>
  )
}
