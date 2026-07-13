'use client';

import { useEffect, useState } from 'react';
import { PROFILE, CHAPTERS } from '@/lib/content';

const SECTIONS = [
  { id: 'wetlab', label: 'Wet Lab' },
  { id: 'genomics', label: 'Genomics' },
  { id: 'ai', label: 'AI' },
  { id: 'founder', label: 'Founder' },
  { id: 'timeline', label: 'Path' },
  { id: 'study', label: 'Study' },
];

export function Nav({ onFastLane, onDownloadCv }: { onFastLane: () => void; onDownloadCv: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        background: scrolled ? 'color-mix(in srgb, var(--bg) 72%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--hairline)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-hairline text-[11px] font-semibold tracking-tight text-accent">
            QNM
          </span>
          <span className="text-base font-semibold tracking-tight sm:text-lg">{PROFILE.name}</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-sm text-fg-mute transition-colors duration-150 hover:text-fg"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onDownloadCv}
            className="rounded-full border border-hairline px-4 py-2 text-xs font-medium backdrop-blur transition-transform duration-150 hover:bg-white/5 active:scale-[0.97]"
            style={{ transitionTimingFunction: 'var(--ease-out)' }}
          >
            Download CV
          </button>
          <button
            onClick={onFastLane}
            className="rounded-full bg-white/5 px-4 py-2 text-xs font-medium backdrop-blur transition-transform duration-150 ease-out hover:bg-white/10 active:scale-[0.97]"
            style={{ transitionTimingFunction: 'var(--ease-out)', border: '1px solid var(--accent)', color: 'var(--accent)' }}
          >
            In a hurry? →
          </button>
        </div>
      </div>
      <span className="sr-only">{CHAPTERS.length} chapters</span>
    </header>
  );
}
