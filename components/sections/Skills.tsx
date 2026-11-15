'use client';

// (03) Skills. A ranked list in Wake mode; in Train mode it drives the Loss Landscape,
// where the ball rolls into whichever valley the reader is on.
import { useEffect, useRef } from 'react';
import { skillGroups, optimizers, type Optimizer } from '@/data/skills';
import { useStore } from '@/lib/store';
import Counter from '../ui/Counter';
import Reveal from '../ui/Reveal';
import SectionLabel from '../ui/SectionLabel';

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
  const groups = useRef<HTMLLIElement[]>([]);

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
  const train = useStore((s) => s.mode) === 'train';

  return (
    <section id="skills" data-layer="3" className="relative px-4 py-28 md:px-8 md:py-40">
      <SectionLabel n={3} wake="Skills" train="optimisation" />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <h2 className="mega text-[clamp(3.5rem,11vw,10rem)] text-ink">
            Toolkit<span className="serif text-signal">.</span>
          </h2>
        </Reveal>
        <p className="max-w-sm text-sm leading-relaxed text-dim">
          {train
            ? 'Each group is a valley in the loss landscape, and deeper means stronger. Scroll and the ball rolls into the next one.'
            : 'Nine groups, ranked by how deep I have gone. Bars show relative strength, not years.'}
        </p>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-[minmax(0,1fr)_320px]">
        <ol className="border-t border-line/10">
          {skillGroups.map((g, i) => (
            <li
              key={g.id}
              data-group={i}
              ref={(el) => {
                if (el) groups.current[i] = el;
              }}
              className={`grid gap-3 border-b border-line/10 py-6 transition-opacity duration-500 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-6 ${
                i === active ? 'opacity-100' : 'md:opacity-45'
              } ${train ? 'md:min-h-[24vh]' : ''}`}
            >
              <span className="label text-dim">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-none tracking-[-0.04em] text-ink">{g.name}</h3>
              <div>
                <div className="h-[3px] w-full bg-line/10">
                  <div
                    className="h-full bg-ink transition-[width] duration-700"
                    style={{ width: `${g.strength * 100}%` }}
                  />
                </div>
                <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-dim">
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <aside className="md:sticky md:top-28 md:self-start">
          <div className="glass p-5">
            <p className="label text-dim">{train ? 'current valley' : 'now reading'}</p>
            <p className="mt-1 text-2xl font-medium tracking-[-0.03em] text-ink">{current.name}</p>
            <p className="label mt-3 text-output">
              depth <Counter value={current.strength * 100} suffix="%" />
            </p>

            {train && (
              <div className="mt-6 border-t border-line/10 pt-5">
                <label className="label block text-dim">
                  optimizer
                  <select
                    value={optimizer}
                    onChange={(e) => setOptimizer(e.target.value as Optimizer)}
                    className="mt-2 w-full rounded bg-void px-3 py-2 font-mono text-sm normal-case tracking-normal text-ink outline-none ring-1 ring-line/15 focus:ring-signal"
                  >
                    {optimizers.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="mt-3 text-xs leading-relaxed text-dim">{OPTIMIZER_NOTE[optimizer]}</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
