// UI state that React components render from. Per-frame values live in
// `lib/live.ts` instead, so the 60fps loop never triggers a React render.
import { create } from 'zustand';
import type { Optimizer } from '@/data/skills';

type Store = {
  ready: boolean;
  setReady: (ready: boolean) => void;

  galaxyView: 'galaxy' | 'grid';
  setGalaxyView: (view: 'galaxy' | 'grid') => void;

  focusedProject: string | null;
  setFocusedProject: (id: string | null) => void;

  optimizer: Optimizer;
  setOptimizer: (o: Optimizer) => void;

  activeGroup: number;
  setActiveGroup: (i: number) => void;

  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;

  confusionOpen: boolean;
  setConfusionOpen: (open: boolean) => void;

  matrix: boolean;
  toggleMatrix: () => void;

  overfit: boolean;
  toggleOverfit: () => void;
};

export const useStore = create<Store>((set) => ({
  ready: false,
  setReady: (ready) => set({ ready }),

  galaxyView: 'galaxy',
  setGalaxyView: (galaxyView) => set({ galaxyView }),

  focusedProject: null,
  setFocusedProject: (focusedProject) => set({ focusedProject }),

  optimizer: 'Adam',
  setOptimizer: (optimizer) => set({ optimizer }),

  activeGroup: 0,
  setActiveGroup: (activeGroup) => set({ activeGroup }),

  paletteOpen: false,
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),

  confusionOpen: false,
  setConfusionOpen: (confusionOpen) => set({ confusionOpen }),

  matrix: false,
  toggleMatrix: () => set((s) => ({ matrix: !s.matrix })),

  overfit: false,
  toggleOverfit: () => set((s) => ({ overfit: !s.overfit })),
}));
