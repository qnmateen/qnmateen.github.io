'use client';

import { useEffect, useRef, useState } from 'react';
import { Reveal } from './Reveal';

type Group = { category: string; items: string[] };

/**
 * Threaded capability rail. Skill clusters sit collapsed by default (just the
 * category + count), so the section stays light; hovering (or tapping) a cluster
 * expands its items and collapses it again on leave. A connector line threads the
 * clusters and draws in on scroll. Reduced-motion friendly.
 */
export function CapabilityRail({ groups, accent }: { groups: Group[]; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-16 border-t border-hairline pt-12">
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-fg-mute">Bench capabilities</p>
          <p className="text-xs text-fg-mute">Hover or tap a group to expand</p>
        </div>
      </Reveal>

      <div className="relative mt-10">
        {/* mobile: vertical connector down the left */}
        <span
          aria-hidden
          className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px origin-top md:hidden"
          style={{
            background: `linear-gradient(${accent}, transparent)`,
            transform: drawn ? 'scaleY(1)' : 'scaleY(0)',
            transition: 'transform 0.9s var(--ease-out)',
          }}
        />
        {/* desktop: horizontal connector across the three nodes */}
        <span
          aria-hidden
          className="absolute left-0 top-[5px] hidden h-px w-full origin-left md:block"
          style={{
            background: `linear-gradient(90deg, ${accent}, ${accent}44 70%, transparent)`,
            transform: drawn ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1s var(--ease-out)',
          }}
        />

        <div className="grid gap-4 md:grid-cols-3 md:gap-8">
          {groups.map((g, gi) => {
            const open = active === gi;
            return (
              <div
                key={g.category}
                className="relative cursor-pointer select-none pl-6 md:pl-0 md:pt-6"
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') setActive(gi);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === 'mouse') setActive((a) => (a === gi ? null : a));
                }}
                onClick={() => setActive((a) => (a === gi ? null : gi))}
              >
                {/* node */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full md:top-0"
                  style={{
                    background: accent,
                    boxShadow: drawn ? `0 0 12px ${accent}` : 'none',
                    opacity: drawn ? 1 : 0,
                    transform: `scale(${drawn ? (open ? 1.25 : 1) : 0.4})`,
                    transition: `opacity 0.4s var(--ease-out) ${gi * 120}ms, transform 0.25s var(--ease-out), box-shadow 0.4s ease ${gi * 120}ms`,
                  }}
                />

                <Reveal delay={gi * 100}>
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-base font-semibold tracking-tight" style={{ color: accent }}>
                      {g.category}
                    </h4>
                    <span className="flex items-center gap-2 font-mono text-xs text-fg-mute">
                      {g.items.length}
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        className="transition-transform duration-300"
                        style={{ transform: open ? 'rotate(45deg)' : 'none', transitionTimingFunction: 'var(--ease-out)' }}
                        aria-hidden
                      >
                        <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </span>
                  </div>
                </Reveal>

                {/* collapsible items (grid-rows 0fr→1fr animates height cleanly) */}
                <div
                  className="grid"
                  style={{
                    gridTemplateRows: open ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.35s var(--ease-out)',
                  }}
                >
                  <div className="overflow-hidden">
                    <ul
                      className="space-y-2.5 pt-4"
                      style={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s var(--ease-out)' }}
                    >
                      {g.items.map((it) => (
                        <li key={it} className="flex items-start gap-2.5 text-sm text-fg">
                          <span className="mt-1.5 h-1 w-1 flex-none rounded-full" style={{ background: accent }} />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
