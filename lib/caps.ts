'use client';
// Device capability detection. Decides particle counts, DPR, post-processing
// and whether the galaxy falls back to a 2D grid. All checks run in the browser.
import { useEffect, useState } from 'react';

export type Caps = {
  ready: boolean;
  reduced: boolean; // prefers-reduced-motion
  mobile: boolean; // narrow or touch-first
  lowEnd: boolean; // few cores, little memory, or mobile
  particles: number;
  postprocessing: boolean;
};

const initial: Caps = {
  ready: false,
  reduced: false,
  mobile: false,
  lowEnd: false,
  particles: 20000,
  postprocessing: true,
};

export function useCaps(): Caps {
  const [caps, setCaps] = useState<Caps>(initial);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    const cores = navigator.hardwareConcurrency ?? 8;
    // deviceMemory is non-standard, so only read it when present.
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const lowEnd = mobile || cores <= 4 || memory <= 4;

    setCaps({
      ready: true,
      reduced,
      mobile,
      lowEnd,
      particles: lowEnd ? 6000 : 20000,
      postprocessing: !lowEnd && !reduced,
    });
  }, []);

  return caps;
}
