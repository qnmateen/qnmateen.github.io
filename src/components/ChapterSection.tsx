import type { Chapter } from '@/lib/content';
import { Reveal } from './Reveal';
import { Counter } from './Counter';
import { DecodeText } from './DecodeText';
import { CapabilityRail } from './CapabilityRail';
import { MediaMosaic } from './MediaMosaic';

function StatBlock({ stat, accent }: { stat: Chapter['stats'][number]; accent: string }) {
  return (
    <div>
      <div className="font-display text-4xl leading-none tracking-tight sm:text-5xl" style={{ color: accent }}>
        {stat.n !== undefined ? (
          <Counter to={stat.n} suffix={stat.suffix ?? ''} />
        ) : (
          <span className="whitespace-pre-line">{stat.text}</span>
        )}
      </div>
      <div className="mt-2 text-xs uppercase tracking-wider text-fg-mute">{stat.label}</div>
    </div>
  );
}

export function ChapterSection({ chapter }: { chapter: Chapter }) {
  const { accent } = chapter;
  return (
    <section id={chapter.id} style={{ scrollMarginTop: '5rem' }}>
      {/* ── Cinematic title card ───────────────────────────── */}
      <div className="relative flex min-h-[70vh] items-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 60% at 50% 50%, color-mix(in srgb, var(--bg) 55%, transparent), color-mix(in srgb, var(--bg) 88%, transparent) 80%)`,
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-fg-mute">{chapter.index}</span>
              <span className="h-px w-12" style={{ background: accent }} />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-mute">{chapter.kicker}</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="mt-5 font-display text-[15vw] italic leading-[0.9] tracking-[-0.02em] sm:text-[9rem]"
              style={{ color: accent }}
            >
              {chapter.id === 'genomics' ? (
                <DecodeText text={chapter.phase} duration={1100} />
              ) : (
                chapter.phase
              )}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-fg sm:text-4xl">
              {chapter.title}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-4 max-w-xl text-lg text-fg-mute">{chapter.lede}</p>
          </Reveal>
        </div>
      </div>

      {/* ── Stats + highlights + media ─────────────────────── */}
      <div className="relative border-t border-hairline py-20 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--bg) 78%, transparent), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          {/* big stat row */}
          <div className="grid grid-cols-2 gap-8 border-b border-hairline pb-12 sm:grid-cols-3">
            {chapter.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <StatBlock stat={s} accent={accent} />
              </Reveal>
            ))}
          </div>

          {chapter.skills && <CapabilityRail groups={chapter.skills} accent={accent} />}

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            {/* condensed highlights as chips, not paragraphs */}
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <ul className="space-y-4">
                {chapter.highlights.map((h, i) => (
                  <Reveal as="li" key={h} delay={i * 60} className="flex gap-3 text-base leading-snug text-fg">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full" style={{ background: accent }} />
                    {h}
                  </Reveal>
                ))}
              </ul>
              {(chapter.links ?? (chapter.link ? [chapter.link] : [])).length > 0 && (
                <Reveal delay={240}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {(chapter.links ?? (chapter.link ? [chapter.link] : [])).map((l, i) => {
                      const external = l.href.startsWith('http');
                      const primary = i === 0;
                      return (
                        <a
                          key={l.href}
                          href={l.href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noreferrer' : undefined}
                          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform duration-150 active:scale-[0.97]"
                          style={
                            primary
                              ? { background: accent, color: '#04060b', transitionTimingFunction: 'var(--ease-out)' }
                              : { border: `1px solid ${accent}`, color: accent, transitionTimingFunction: 'var(--ease-out)' }
                          }
                        >
                          {l.label} →
                        </a>
                      );
                    })}
                  </div>
                </Reveal>
              )}
            </div>

            {/* mosaic gallery with lightbox */}
            <Reveal>
              <MediaMosaic media={chapter.media} accent={accent} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
