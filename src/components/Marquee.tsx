'use client';

import { MARQUEE } from '@/lib/content';

/** Infinite credibility strip, institutions scroll horizontally. */
export function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="relative overflow-hidden border-y border-hairline py-5">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />
      <div className="marquee-track flex w-max items-center gap-12">
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-12 whitespace-nowrap text-sm font-medium text-fg-mute">
            {m}
            <span className="h-1 w-1 rounded-full" style={{ background: 'var(--accent)' }} />
          </span>
        ))}
      </div>
    </div>
  );
}
