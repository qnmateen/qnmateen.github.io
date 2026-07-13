'use client';

import { useEffect, useRef, useState } from 'react';
import { PHASES, useProgress } from '@/lib/progress';

// poetic name for each formation — the "state of matter" of the career
const PHASE_NAME: Record<string, string> = {
  cells: 'Organism',
  device: 'Diagnostics',
  helix: 'Sequence',
  cloud: 'Expression',
  network: 'Intelligence',
  code: 'Frontier',
  constellation: 'Path',
  globe: 'Horizon',
};

export function PhaseLabel() {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const last = useRef(0);

  useEffect(() => {
    return useProgress.subscribe((s) => {
      setProgress(s.progress);
      if (s.phase !== last.current) {
        last.current = s.phase;
        setPhase(s.phase);
      }
    });
  }, []);

  const name = PHASE_NAME[PHASES[phase]];

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-40 sm:bottom-8 sm:left-8">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-mute">
          {String(phase + 1).padStart(2, '0')} / {String(PHASES.length).padStart(2, '0')}
        </span>
        <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
      </div>
      <div key={name} className="reveal is-visible mt-1 font-display text-3xl italic" style={{ color: 'var(--accent)' }}>
        {name}
      </div>
      <div className="mt-2 h-0.5 w-28 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: 'var(--accent)' }} />
      </div>
    </div>
  );
}
