import { IconPlayButton } from './Button.jsx'
import { useBeatPreviewPlaying, useBeatPreviewToggle } from '../../hooks/useBeatPreviewPlayback.js'

export function BeatCard({
  title,
  meta,
  price,
  image,
  alt,
  onSelectLicense,
  compact = false,
  hideSelectLicense = false,
  previewAudioUrl,
  previewPlaybackId,
}) {
  const playing = useBeatPreviewPlaying(previewPlaybackId)
  const handlePlayClick = useBeatPreviewToggle(
    previewAudioUrl,
    previewPlaybackId,
    title,
    image,
    alt,
  )

  return (
    <div
      className={`group relative flex cursor-pointer flex-col rounded-md border border-transparent bg-surface shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-white/10 hover:bg-surface-hover ${
        compact ? 'p-3.5' : 'p-4'
      }`}
    >
      <div
        className={`relative w-full overflow-hidden rounded bg-black ${
          compact
            ? 'mb-3 h-[220px] sm:h-[240px]'
            : 'mb-4 aspect-square'
        }`}
      >
        <img
          src={image}
          alt={alt}
          className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <IconPlayButton
            playing={playing}
            aria-label={playing ? 'Pause preview' : 'Play preview'}
            onClick={handlePlayClick}
            disabled={!previewAudioUrl || previewPlaybackId == null}
            className={`translate-y-4 group-hover:translate-y-0 disabled:pointer-events-none disabled:opacity-40 ${
              compact ? '!h-11 !w-11 [&_span]:!text-2xl' : ''
            }`}
          />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <h3
          className={`truncate font-bold text-white transition-colors group-hover:text-primary ${
            compact ? 'text-base' : 'text-lg'
          }`}
        >
          {title}
        </h3>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span
            className={`min-w-0 truncate font-medium text-text-muted ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            {meta}
          </span>
          <span
            className={`shrink-0 rounded bg-white/10 font-bold text-white ${
              compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'
            }`}
          >
            {price}
          </span>
        </div>
        {hideSelectLicense ? null : (
          <div className={compact ? 'mt-3 w-full' : 'mt-3 w-full'}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSelectLicense?.()
              }}
              className={`w-full rounded-md border border-white/10 bg-white/5 font-bold uppercase tracking-wider text-text-muted transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary ${
                compact
                  ? 'px-2 py-2 text-[11px]'
                  : 'px-3 py-2 text-xs'
              }`}
            >
              Select License
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
