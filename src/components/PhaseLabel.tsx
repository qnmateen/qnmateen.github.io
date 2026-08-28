'use client';

import { useEffect, useState } from 'react';
import { SECTIONS } from '@/lib/content';
import { useActiveSection } from '@/lib/activeSection';
import { useProgress } from '@/lib/progress';

/** Bottom-left "you are here": section index, its label (same words as the nav),
 *  and a page-progress bar. Uses the shared active-section vocabulary. */
export function PhaseLabel() {
  const activeIndex = useActiveSection((s) => s.activeIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => useProgress.subscribe((s) => setProgress(s.progress)), []);

  const label = activeIndex >= 0 ? SECTIONS[activeIndex].label : 'Overview';
  const num = activeIndex >= 0 ? activeIndex + 1 : 0;

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-40 sm:bottom-8 sm:left-8">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-mute">
          {String(num).padStart(2, '0')} / {String(SECTIONS.length).padStart(2, '0')}
        </span>
        <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
      </div>
      <div key={label} className="reveal is-visible mt-1 font-display text-3xl italic" style={{ color: 'var(--accent)' }}>
        {label}
      </div>
      <div className="mt-2 h-0.5 w-28 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: 'var(--accent)' }} />
      </div>
    </div>
  );
}
