export function EditorialAboutSection({ about }) {
  const { eyebrow, title, portrait, paragraphs, paragraph2, credits } = about
  return (
    <section className="mt-12 w-full scroll-mt-24 bg-black py-24" id="about">
      <div className="page-container flex max-w-[1440px] flex-col items-center gap-16 lg:flex-row">
        <div className="relative w-full lg:w-1/2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-lg grayscale transition-all duration-700 hover:grayscale-0">
            <img src={portrait} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          </div>
        </div>
        <div className="flex w-full flex-col lg:w-1/2">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </h2>
          <h3 className="mb-8 font-display text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
            {title}
          </h3>
          <div className="prose prose-lg prose-invert mb-10 max-w-none space-y-6 text-text-muted">
            <p>{paragraphs[0]}</p>
            <p>
              {paragraph2.before}
              <span className="font-medium text-white">{paragraph2.emphasis}</span>
              {paragraph2.after}
            </p>
          </div>
          <div className="flex flex-col gap-4 border-t border-surface pt-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Selected Credits
            </h4>
            <div className="flex flex-wrap gap-3">
              {credits.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/5 bg-surface px-4 py-2 text-sm font-medium text-white"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
