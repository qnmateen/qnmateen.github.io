'use client';

import { useEffect } from 'react';
import { PHASES, useProgress } from '@/lib/progress';

// accent per phase, warm/organic to cool/digital
const PHASE_ACCENT: Record<string, [number, number, number]> = {
  cells: [244, 114, 182], // pink
  device: [94, 234, 212], // teal (section 1)
  helix: [125, 211, 252], // sky (section 2, genomics)
  cloud: [34, 211, 238], // cyan
  network: [167, 139, 250], // violet
  code: [74, 222, 128], // green
  constellation: [251, 191, 36], // amber (the path / timeline)
  globe: [226, 232, 240], // white (horizon / study)
};

// one DOM anchor per phase, in PHASES order
const ANCHORS = ['top', 'wetlab', 'genomics', 'ai', 'founder', 'timeline', 'study'];

// hold each shape through most of its section, then morph as the next arrives
const HOLD = 0.6;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
// smootherstep: hold each shape while you're in its section, morph fast between
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/**
 * Maps scroll to a section-anchored phase position: each phase resolves when its
 * section reaches the viewport centre, so shapes line up with their sections.
 * Also lerps the global --accent CSS var to match.
 */
export function ScrollSync() {
  const set = useProgress((s) => s.set);

  useEffect(() => {
    let raf = 0;
    const keys = PHASES;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? clamp01(window.scrollY / max) : 0;

        // section-anchored phase position (viewport centre as the reference line)
        const ref = window.scrollY + window.innerHeight * 0.5;
        const tops = ANCHORS.map((id) => {
          const el = document.getElementById(id);
          return el ? el.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY;
        });

        let phasePos: number;
        if (ref <= tops[0]) {
          phasePos = 0;
        } else if (ref >= tops[tops.length - 1]) {
          phasePos = tops.length - 1;
        } else {
          phasePos = tops.length - 1;
          for (let i = 0; i < tops.length - 1; i++) {
            if (ref >= tops[i] && ref < tops[i + 1]) {
              const seg = tops[i + 1] - tops[i];
              const f = seg > 0 ? (ref - tops[i]) / seg : 0;
              // stay on shape i until HOLD through the gap, then morph to i+1
              const fr = f <= HOLD ? 0 : (f - HOLD) / (1 - HOLD);
              phasePos = i + smoother(fr);
              break;
            }
          }
        }

        set(progress, phasePos);

        // accent follows the same phase position
        const i0 = Math.min(Math.floor(phasePos), keys.length - 2);
        const f = phasePos - i0;
        const a = PHASE_ACCENT[keys[i0]];
        const b = PHASE_ACCENT[keys[i0 + 1]];
        const r = Math.round(lerp(a[0], b[0], f));
        const g = Math.round(lerp(a[1], b[1], f));
        const bl = Math.round(lerp(a[2], b[2], f));
        document.documentElement.style.setProperty('--accent', `rgb(${r} ${g} ${bl})`);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [set]);

  return null;
}
