import { create } from 'zustand';

/** Phases the particle system morphs through, top → bottom.
 *  Maps to sections: hero=cells, wetlab=device, genomics=helix (DNA), ai=network, founder/study=code. */
export const PHASES = ['cells', 'device', 'helix', 'network', 'code', 'constellation', 'globe'] as const;
export type Phase = (typeof PHASES)[number];

type ProgressStore = {
  /** 0..1 through the whole page */
  progress: number;
  /** 0..(PHASES.length-1), fractional position across formations */
  phasePos: number;
  /** nearest phase index */
  phase: number;
  /** `phasePos` may be passed directly (section-anchored); else derived from progress */
  set: (progress: number, phasePos?: number) => void;
};

export const useProgress = create<ProgressStore>((set) => ({
  progress: 0,
  phasePos: 0,
  phase: 0,
  set: (progress, phasePos) => {
    const pp = phasePos ?? progress * (PHASES.length - 1);
    set({ progress, phasePos: pp, phase: Math.round(pp) });
  },
}));
