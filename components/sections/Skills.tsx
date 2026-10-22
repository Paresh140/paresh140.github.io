'use client';

// Layer 3. The Loss Landscape. The ball rolls into whichever valley the reader is on.
import { useEffect, useRef } from 'react';
import { skillGroups, optimizers, type Optimizer } from '@/data/skills';
import { useStore } from '@/lib/store';
import Counter from '../ui/Counter';
import GlassPanel from '../ui/GlassPanel';
import Reveal from '../ui/Reveal';

const OPTIMIZER_NOTE: Record<Optimizer, string> = {
  SGD: 'Plain steps. Each move follows the local slope, so the ball takes the direct route and sometimes zigzags.',
  Momentum: 'Builds velocity. The ball carries speed through the shallow parts and overshoots a little.',
  Adam: 'Scales each step by its own history. The ball adapts per direction and settles smoothly.',
};

export default function Skills() {
  const active = useStore((s) => s.activeGroup);
  const setActive = useStore((s) => s.setActiveGroup);
  const optimizer = useStore((s) => s.optimizer);
  const setOptimizer = useStore((s) => s.setOptimizer);
  const groups = useRef<HTMLDivElement[]>([]);

  // The group nearest the middle of the screen is the one the ball rolls into.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.group));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    groups.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [setActive]);

  const current = skillGroups[active];

  return (
    <section id="skills" data-layer="3" className="relative px-4 py-24 md:px-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">layer 03 · optimisation</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-ink md:text-6xl">The Loss Landscape</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-dim md:text-base">
              Each skill group is a valley, and deeper means stronger. Scroll and the ball rolls down into the next one.
            </p>
          </Reveal>

          <div className="mt-16 space-y-[12vh]">
            {skillGroups.map((g, i) => (
              <div
                key={g.id}
                data-group={i}
                ref={(el) => {
                  if (el) groups.current[i] = el;
                }}
                className="min-h-[28vh]"
              >
                <Reveal>
                  <GlassPanel className="p-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-2xl font-semibold text-ink">
                        <span className="mr-3 font-mono text-xs text-dim">{String(i + 1).padStart(2, '0')}</span>
                        {g.name}
                      </h3>
                      <span className="font-mono text-sm text-output">
                        depth <Counter value={g.strength * 100} suffix="%" />
                      </span>
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {g.items.map((item) => (
                        <li key={item} className="glass-chip px-2.5 py-1 font-mono text-[11px] text-ink">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </GlassPanel>
                </Reveal>
              </div>
            ))}
          </div>
        </div>

        <aside className="md:sticky md:top-28 md:self-start">
          <GlassPanel className="p-5">
            <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-dim">
              optimizer
              <select
                value={optimizer}
                onChange={(e) => setOptimizer(e.target.value as Optimizer)}
                className="mt-2 w-full rounded bg-void px-3 py-2 font-mono text-sm text-ink outline-none ring-1 ring-white/15 focus:ring-signal"
              >
                {optimizers.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-3 text-xs leading-relaxed text-dim">{OPTIMIZER_NOTE[optimizer]}</p>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim">current valley</p>
              <p className="mt-1 font-display text-xl text-ink">{current.name}</p>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-gradient-to-r from-loss to-signal transition-[width] duration-500" style={{ width: `${current.strength * 100}%` }} />
              </div>
            </div>
          </GlassPanel>
        </aside>
      </div>
    </section>
  );
}
