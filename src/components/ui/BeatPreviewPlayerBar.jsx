import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { MaterialIcon } from './MaterialIcon.jsx'
import { IconPlayButton } from './Button.jsx'
import {
  stopBeatPreviewPlayback,
  subscribeBeatPreviewSession,
  toggleBeatPreviewPlayback,
} from '../../utils/beatPreviewPlayback.js'

const BAR_HEIGHT = 36

function MiniEqualizer({ playing }) {
  const bars = [0, 1, 2, 3, 4, 5, 6]
  return (
    <div
      className="flex h-9 shrink-0 items-end justify-center gap-px sm:gap-0.5"
      aria-hidden
    >
      {bars.map((i) => (
        <span
          key={i}
          className={`w-1 origin-bottom rounded-sm bg-primary/90 motion-reduce:animate-none ${
            playing ? 'animate-eq-bar' : 'opacity-40 motion-reduce:opacity-40'
          }`}
          style={
            playing
              ? {
                  animationDelay: `${i * 0.09}s`,
                  animationDuration: `${0.38 + (i % 4) * 0.09}s`,
                }
              : { transform: 'scaleY(0.25)' }
          }
        />
      ))}
    </div>
  )
}

export function BeatPreviewPlayerBar() {
  const [session, setSession] = useState(null)
  const [playing, setPlaying] = useState(false)
  const waveformRef = useRef(null)
  const wavesurferRef = useRef(null)

  useEffect(() => {
    return subscribeBeatPreviewSession(setSession)
  }, [])

  useEffect(() => {
    const a = session?.audio
    if (!a) {
      setPlaying(false)
      return
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    setPlaying(!a.paused)
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)
    return () => {
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
    }
  }, [session?.audio])

  useEffect(() => {
    if (!session?.audio || !session?.url || !waveformRef.current) return

    const el = waveformRef.current
    const ws = WaveSurfer.create({
      container: el,
      media: session.audio,
      url: session.url,
      height: BAR_HEIGHT,
      waveColor: 'rgba(179, 179, 179, 0.25)',
      progressColor: '#1bbb83',
      cursorColor: 'rgba(27, 187, 131, 0.55)',
      cursorWidth: 2,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
      interact: true,
      dragToSeek: true,
      hideScrollbar: true,
    })
    wavesurferRef.current = ws

    return () => {
      ws.destroy()
      wavesurferRef.current = null
    }
  }, [session?.playbackId, session?.url])

  if (!session?.audio || !session?.url) return null

  const { title, image, alt } = session.meta ?? {}

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[92] flex justify-center px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-0 sm:px-4"
      role="region"
      aria-label="Preview player"
    >
      <div className="pointer-events-auto flex w-full max-w-4xl flex-col gap-2 rounded-t-lg border border-white/10 border-b-0 bg-surface/95 px-3 py-2.5 shadow-[0_-8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md sm:flex-row sm:items-center sm:gap-3 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {image ? (
            <img
              src={image}
              alt={alt || ''}
              className="h-12 w-12 shrink-0 rounded-md object-cover sm:h-14 sm:w-14"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-white/5 sm:h-14 sm:w-14">
              <MaterialIcon name="music_note" className="text-2xl text-text-muted" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {title || 'Preview'}
            </p>
            <div ref={waveformRef} className="mt-1 min-h-[36px] w-full" />
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:justify-center sm:gap-3">
          <MiniEqualizer playing={playing} />
          <IconPlayButton
            size="sm"
            playing={playing}
            aria-label={playing ? 'Pause preview' : 'Play preview'}
            className="!h-11 !w-11 [&_span]:!text-2xl"
            onClick={() =>
              toggleBeatPreviewPlayback(session.url, session.playbackId, session.meta)
            }
          />
          <button
            type="button"
            onClick={() => stopBeatPreviewPlayback()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-text-muted transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
            aria-label="Stop and close player"
          >
            <MaterialIcon name="close" className="text-[22px]" />
          </button>
        </div>
      </div>
    </div>
  )
}
