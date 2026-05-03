import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  footer,
  hero,
  navLinks,
} from '../data/homeContent.js'
import { useCatalogBeats } from '../hooks/useCatalogBeats.js'
import { scrollElementBelowNav } from '../utils/scrollToAnchor.js'

export default function HomePage() {
  const [licenseTrack, setLicenseTrack] = useState(null)
  const { beats: catalogBeats, loadError: catalogLoadError, loading: catalogLoading } =
    useCatalogBeats()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const id = location.hash?.replace(/^#/, '')
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    const frame = window.requestAnimationFrame(() => {
      scrollElementBelowNav(el, { behavior: 'smooth' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  // Drop #beats / #about from the URL when the hero is the main view again, so refresh matches
  // “I’m at the top” and shared links stay accurate.
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return

    const started = Date.now()
    const ignoreMs = 900

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (Date.now() - started < ignoreMs) return
        if (!entry?.isIntersecting) return
        if (entry.intersectionRatio < 0.5) return
        if (!window.location.hash) return
        navigate({ pathname: '/', hash: '' }, { replace: true })
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    obs.observe(hero)
    return () => obs.disconnect()
  }, [navigate])

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
          loading={catalogLoading}
          loadError={catalogLoadError}
          beats={(catalogBeats ?? []).slice(0, 4)}
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
