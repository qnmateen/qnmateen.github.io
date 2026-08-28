'use client';

import { useEffect } from 'react';
import { SECTIONS } from '@/lib/content';
import { useActiveSection } from '@/lib/activeSection';

/**
 * Scrollspy: marks the section crossing the viewport's middle band as active.
 * One observer for the whole page; writes to the shared activeSection store so
 * both the nav and the PhaseLabel stay in sync with a single vocabulary.
 */
export function SectionObserver() {
  const setActive = useActiveSection((s) => s.setActive);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        // topmost section currently crossing the middle band wins
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        const id = top.target.id;
        const index = SECTIONS.findIndex((s) => s.id === id);
        setActive(id, index);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [setActive]);

  return null;
}
