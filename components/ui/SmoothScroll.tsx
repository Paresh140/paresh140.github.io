'use client';

// Lenis for smooth scroll, driven by GSAP's ticker so the camera and the page move together.
// Skipped for reduced motion and touch devices, where native scrolling already feels right.
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || touch) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
