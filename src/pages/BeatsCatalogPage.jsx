import { useEffect, useMemo, useState } from 'react'
import { Footer } from '../components/layout/Footer.jsx'
import { TopNav } from '../components/layout/TopNav.jsx'
import { LicenseModal } from '../components/ui/LicenseModal.jsx'
import { BeatCard } from '../components/ui/BeatCard.jsx'
import { SectionHeading } from '../components/ui/SectionHeading.jsx'
import { defaultBeatPreviewAudioUrl, footer, navLinksCatalog } from '../data/homeContent.js'
import { apiBeatToDisplayBeat, fetchCatalogBeats } from '../utils/catalogBeatsApi.js'

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

export default function BeatsCatalogPage() {
  const [licenseTrack, setLicenseTrack] = useState(null)
  const [beats, setBeats] = useState(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchCatalogBeats()
      .then((raw) => {
        if (cancelled) return
        const list = Array.isArray(raw) ? raw.map(apiBeatToDisplayBeat) : []
        setBeats(list)
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true)
          setBeats([])
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const mobileCatalogRows = useMemo(
    () => (beats && beats.length > 0 ? chunkEvery(beats, CARDS_PER_MOBILE_ROW) : []),
    [beats],
  )

  const loading = beats === null && !loadError

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

              <div className="hidden sm:grid sm:grid-cols-2 sm:justify-items-center sm:gap-6 lg:grid-cols-4 lg:gap-8">
                {beats.map((beat) => (
                  <div key={beat.id} className={beatCardShellClass}>
                    <BeatCard
                      compact
                      title={beat.title}
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
