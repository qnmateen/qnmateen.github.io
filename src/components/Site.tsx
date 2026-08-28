'use client';

import { useEffect, useState } from 'react';
import { CHAPTERS } from '@/lib/content';
import { Metamorphosis } from './Metamorphosis';
import { ScrollSync } from './ScrollSync';
import { SectionObserver } from './SectionObserver';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { Marquee } from './Marquee';
import { ChapterSection } from './ChapterSection';
import { Timeline } from './Timeline';
import { CodeSection } from './CodeSection';
import { StudySection } from './StudySection';
import { FastLane } from './FastLane';
import { PhaseLabel } from './PhaseLabel';

export function Site() {
  const [fastLane, setFastLane] = useState(false);

  // Always open at the top, don't let the browser restore a prior scroll spot.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* fixed morphing particle field behind everything */}
      <Metamorphosis />
      <ScrollSync />
      <SectionObserver />
      <PhaseLabel />

      <Nav onFastLane={() => setFastLane(true)} />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        {CHAPTERS.map((c) => (
          <ChapterSection key={c.id} chapter={c} />
        ))}
        <CodeSection />
        <Timeline />
        <StudySection />
      </main>
      <FastLane open={fastLane} onClose={() => setFastLane(false)} />
    </>
  );
}
