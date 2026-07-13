'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TIMELINE, KIND_LABEL } from '@/lib/content';
import { Reveal } from './Reveal';

const easeOut = [0.23, 1, 0.32, 1] as const;

export function Timeline() {
  const [active, setActive] = useState(TIMELINE.length - 1); // start at "now"
  const item = TIMELINE[active];

  const go = (d: number) => setActive((a) => Math.min(TIMELINE.length - 1, Math.max(0, a + d)));

  return (
    <section id="timeline" className="relative border-t border-hairline py-24 sm:py-32" style={{ scrollMarginTop: '5rem' }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--bg) 78%, transparent), transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-fg-mute">The Path</span>
          <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.025em] sm:text-5xl">
            One line, bench to machine.
          </h2>
        </Reveal>

        {/* ── Rail ─────────────────────────────────────────── */}
        <div
          className="mt-14 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Career timeline"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
          }}
        >
          <div className="relative flex min-w-[900px] items-start justify-between gap-2">
            {/* base line */}
            <div className="absolute left-0 right-0 top-[7px] h-px bg-hairline" />
            {/* progress line up to active */}
            <div
              className="absolute left-0 top-[7px] h-px transition-all duration-500"
              style={{
                width: `${(active / (TIMELINE.length - 1)) * 100}%`,
                background: `linear-gradient(90deg, ${TIMELINE[0].accent}, ${item.accent})`,
                transitionTimingFunction: 'var(--ease-out)',
              }}
            />

            {TIMELINE.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={i}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className="group relative flex flex-1 flex-col items-center gap-3 pt-0 text-center outline-none"
                >
                  <span
                    className="relative z-10 grid place-items-center rounded-full transition-all duration-300"
                    style={{
                      width: on ? 16 : 12,
                      height: on ? 16 : 12,
                      background: on ? t.accent : 'var(--bg-soft)',
                      border: `2px solid ${on ? t.accent : 'var(--hairline-strong)'}`,
                      boxShadow: on ? `0 0 18px ${t.accent}` : 'none',
                      transitionTimingFunction: 'var(--ease-out)',
                    }}
                  />
                  <span
                    className="font-mono text-xs transition-colors duration-200"
                    style={{ color: on ? t.accent : 'var(--fg-mute)' }}
                  >
                    {t.year}
                  </span>
                  <span className="max-w-[9ch] text-[11px] leading-tight text-fg-mute opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:max-w-[12ch]">
                    {t.org}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Detail card ──────────────────────────────────── */}
        <div className="mt-10 min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.article
              key={active}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: 0.4, ease: easeOut }}
              className="grid gap-6 rounded-3xl border border-hairline bg-panel/70 p-7 backdrop-blur sm:grid-cols-[auto_1fr] sm:p-9"
            >
              <div className="sm:border-r sm:border-hairline sm:pr-8">
                <div className="font-display text-5xl italic" style={{ color: item.accent }}>
                  {item.year}
                </div>
                <div className="mt-1 font-mono text-xs text-fg-mute">{item.dates}</div>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ background: `${item.accent}1f`, color: item.accent }}
                  >
                    {KIND_LABEL[item.kind]}
                  </span>
                  {item.current && (
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-fg-mute">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: item.accent }} />
                      Current
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{item.title}</h3>
                <p className="mt-1 text-fg-mute">
                  {item.org} · {item.place}
                </p>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg">{item.blurb}</p>
              </div>
            </motion.article>
          </AnimatePresence>

          {/* prev / next */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              disabled={active === 0}
              className="rounded-full border border-hairline p-2.5 transition-all duration-150 hover:bg-white/5 active:scale-90 disabled:opacity-30"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              disabled={active === TIMELINE.length - 1}
              className="rounded-full border border-hairline p-2.5 transition-all duration-150 hover:bg-white/5 active:scale-90 disabled:opacity-30"
              aria-label="Next"
            >
              →
            </button>
            <span className="ml-2 font-mono text-xs text-fg-mute">
              {String(active + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
