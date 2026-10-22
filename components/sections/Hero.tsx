'use client';

// Layer 0. The 3D word "PARESH" denoises behind this text. The text stays readable and
// the word is a visual, so the h1 for screen readers lives here.
import { useEffect, useRef } from 'react';
import { profile } from '@/data/profile';
import { live } from '@/lib/live';
import { useStore } from '@/lib/store';
import Typewriter from '../ui/Typewriter';

export default function Hero() {
  const ready = useStore((s) => s.ready);
  const t = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (t.current) t.current.textContent = String(Math.round((1 - live.heroT) * 1000));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="top" data-layer="0" className="relative flex min-h-screen flex-col justify-end px-4 pb-16 md:px-16 md:pb-24">
      <h1 className="sr-only">{profile.name}, data scientist and AI/ML engineer</h1>

      <p className="mb-4 font-mono text-xs tracking-[0.2em] text-signal">
        diffusion denoising · t = <span ref={t}>1000</span> → 0
      </p>

      <p className="max-w-3xl font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
        <Typewriter text={profile.headline} start={ready} />
      </p>

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-dim md:text-base">{profile.status}.</p>

      <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.15em]">
        <a href="#projects" className="glass-chip px-5 py-3 text-signal hover:bg-signal/10">
          Enter the galaxy
        </a>
        <a href={profile.resume} download className="glass-chip px-5 py-3 text-ink hover:text-output">
          Download resume
        </a>
        <a href="#contact" className="glass-chip px-5 py-3 text-ink hover:text-loss">
          Hire me
        </a>
      </div>
    </section>
  );
}
