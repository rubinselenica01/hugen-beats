import { useMemo, useState } from 'react'
import { Footer } from '../components/layout/Footer.jsx'
import { TopNav } from '../components/layout/TopNav.jsx'
import { LicenseModal } from '../components/ui/LicenseModal.jsx'
import { BeatCard } from '../components/ui/BeatCard.jsx'
import { SectionHeading } from '../components/ui/SectionHeading.jsx'
import {
  BEAT_CARD_MOBILE_CHUNK_SLOT_CLASS,
  BEAT_CARD_SHELL_CLASS,
  BEATS_DESKTOP_GRID_CLASS,
  BEATS_MOBILE_SCROLL_ROW_CLASS,
  BEATS_MOBILE_SCROLL_ROW_STYLE,
  CARDS_PER_MOBILE_ROW,
} from '../constants/beatsGrid.js'
import { defaultBeatPreviewAudioUrl, footer, navLinksCatalog } from '../data/homeContent.js'
import { useCatalogBeats } from '../hooks/useCatalogBeats.js'
import { chunkEvery } from '../utils/chunk.js'

export default function BeatsCatalogPage() {
  const [licenseTrack, setLicenseTrack] = useState(null)
  const { beats, loadError, loading } = useCatalogBeats()

  const mobileCatalogRows = useMemo(
    () => (beats && beats.length > 0 ? chunkEvery(beats, CARDS_PER_MOBILE_ROW) : []),
    [beats],
  )

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
          {loadError ? (
            <p className="text-sm text-red-300" role="alert">
              Could not load beats. Try again later.
            </p>
          ) : loading ? (
            <p className="text-sm text-text-muted">Loading beats…</p>
          ) : !beats.length ? (
            <p className="text-sm text-text-muted">No beats in the catalog yet.</p>
          ) : (
            <>
              <div className="flex flex-col gap-8 sm:hidden">
                {mobileCatalogRows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={BEATS_MOBILE_SCROLL_ROW_CLASS}
                    style={BEATS_MOBILE_SCROLL_ROW_STYLE}
                  >
                    {row.map((beat) => (
                      <div
                        key={beat.id}
                        className={BEAT_CARD_MOBILE_CHUNK_SLOT_CLASS}
                      >
                        <div className={BEAT_CARD_SHELL_CLASS}>
                          <BeatCard
                            compact
                            title={beat.title}
                            description={beat.description}
                            meta={beat.meta}
                            price={beat.price}
                            image={beat.image}
                            alt={beat.alt}
                            previewAudioUrl={
                              beat.previewAudioUrl ?? defaultBeatPreviewAudioUrl
                            }
                            previewPlaybackId={beat.id}
                            onSelectLicense={() =>
                              setLicenseTrack(beat.licenseTrack ?? beat)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className={BEATS_DESKTOP_GRID_CLASS}>
                {beats.map((beat) => (
                  <div key={beat.id} className={BEAT_CARD_SHELL_CLASS}>
                    <BeatCard
                      compact
                      title={beat.title}
                      description={beat.description}
                      meta={beat.meta}
                      price={beat.price}
                      image={beat.image}
                      alt={beat.alt}
                      previewAudioUrl={
                        beat.previewAudioUrl ?? defaultBeatPreviewAudioUrl
                      }
                      previewPlaybackId={beat.id}
                      onSelectLicense={() =>
                        setLicenseTrack(beat.licenseTrack ?? beat)
                      }
                    />
                  </div>
                ))}
              </div>
            </>
          )}
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
