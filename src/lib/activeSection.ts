import { create } from 'zustand';

/** Which page section is currently in view (drives nav highlight + PhaseLabel). */
type ActiveSectionStore = {
  activeId: string;
  activeIndex: number; // index into SECTIONS, or -1 at the hero
  setActive: (activeId: string, activeIndex: number) => void;
};

export const useActiveSection = create<ActiveSectionStore>((set) => ({
  activeId: '',
  activeIndex: -1,
  setActive: (activeId, activeIndex) => set({ activeId, activeIndex }),
}));
