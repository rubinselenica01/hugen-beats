import { IconPlayButton } from './Button.jsx'

export function BeatCard({ title, meta, price, image, alt, onSelectLicense }) {
  return (
    <div className="group relative flex cursor-pointer flex-col rounded-md border border-transparent bg-surface p-4 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-white/10 hover:bg-surface-hover">
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded bg-black">
        <img
          src={image}
          alt={alt}
          className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <IconPlayButton className="translate-y-4 group-hover:translate-y-0" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="truncate text-lg font-bold text-white transition-colors group-hover:text-primary">
          {title}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-medium text-text-muted">{meta}</span>
          <span className="rounded bg-white/10 px-2 py-1 text-sm font-bold text-white">
            {price}
          </span>
        </div>
        <div className="mt-3 w-full">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSelectLicense?.()
            }}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-text-muted transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
          >
            Select License
          </button>
        </div>
      </div>
    </div>
  )
}
