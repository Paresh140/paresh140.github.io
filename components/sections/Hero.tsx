'use client';

// (00) Hero. Oversized name split across the width, with the glass crystal from
// the 3D layer sitting between the two words. In Train mode the name becomes an
// outline and the particle head from the latent-space scene shows through.
import { motion } from 'framer-motion';
import { profile } from '@/data/profile';
import { useStore } from '@/lib/store';
import CycleWord from '../ui/CycleWord';

const [first, last] = profile.name.split(' ');

const rise = (delay: number) => ({
  initial: { y: '110%' },
  animate: { y: '0%' },
  transition: { duration: 1.1, delay, ease: [0.7, 0, 0.2, 1] },
});

export default function Hero() {
  const ready = useStore((s) => s.ready);
  const mode = useStore((s) => s.mode);
  const train = mode === 'train';

  return (
    <section id="top" data-layer="0" className="relative flex min-h-[100svh] flex-col justify-between px-4 pb-8 pt-24 md:px-8 md:pb-10">
      <h1 className="sr-only">
        {profile.name}, {profile.role}. {profile.headline}
      </h1>

      <div className="label flex justify-between text-dim">
        <span>(00) {profile.role}</span>
        <span className="hidden sm:block">{profile.location}</span>
      </div>

      {/* The name. In Train mode it turns to an outline, so the particle head shows through. */}
      <div
        aria-hidden
        className={`mega select-none transition-colors duration-700 ${
          train ? 'text-transparent [-webkit-text-stroke:1px_rgb(var(--ink)/0.4)]' : 'text-ink'
        }`}
      >
        <div className="overflow-hidden pb-[0.06em]">
          {ready && (
            <motion.div {...rise(0.1)} className="text-[min(23vw,20rem)] md:text-[min(19vw,20rem)]">
              {first}
            </motion.div>
          )}
        </div>
        <div className="overflow-hidden pb-[0.06em] text-right">
          {ready && (
            <motion.div {...rise(0.22)} className="text-[min(23vw,20rem)] md:text-[min(19vw,20rem)]">
              {last}
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
        <p aria-hidden className="text-[clamp(1.6rem,3.6vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink">
          {profile.headlineLead} <CycleWord words={profile.headlineWords} />
        </p>
        <div className="space-y-5 md:justify-self-end md:text-right">
          <p className="max-w-sm text-sm leading-relaxed text-dim md:ml-auto">{profile.status}.</p>
          <div className="label flex flex-wrap gap-2 md:justify-end">
            <a href="#projects" className="glass-chip px-4 py-2.5 text-ink hover:text-signal">
              See the work ↓
            </a>
            <a href={profile.resume} download className="glass-chip px-4 py-2.5 text-ink hover:text-signal">
              Resume ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
