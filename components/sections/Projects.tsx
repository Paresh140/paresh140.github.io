'use client';

// Layer 2. The Embedding Galaxy. Clusters live in the 3D layer behind this section,
// and this DOM layer owns the clicks, the keyboard path and the grid view.
import { useRef } from 'react';
import { projects } from '@/data/projects';
import { live } from '@/lib/live';
import { useStore } from '@/lib/store';
import { useCaps } from '@/lib/caps';
import Counter from '../ui/Counter';
import Reveal from '../ui/Reveal';
import ProjectDetail from './ProjectDetail';

const CLUSTER_TAG = { signal: 'data', loss: 'learning', output: 'output' } as const;

export default function Projects() {
  const view = useStore((s) => s.galaxyView);
  const setView = useStore((s) => s.setGalaxyView);
  const setFocused = useStore((s) => s.setFocusedProject);
  const focused = useStore((s) => s.focusedProject);
  const caps = useCaps();
  const stage = useRef<HTMLDivElement>(null);

  // Phones and low-end devices get the 2D grid. It is the same content, with less GPU work.
  const effective = caps.mobile ? 'grid' : view;
  const galaxy = effective === 'galaxy';

  // Clicks on the galaxy stage open whichever cluster is under the pointer.
  const onStageClick = () => {
    const i = live.hoverCluster;
    if (i >= 0) setFocused(projects[i].id);
  };

  return (
    <section id="projects" data-layer="2" className="relative min-h-screen px-4 py-24 md:px-16">
      {galaxy && (
        <div ref={stage} onClick={onStageClick} className="pointer-events-auto absolute inset-0 z-0" aria-hidden />
      )}

      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">layer 02 · embedding space</p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-ink md:text-6xl">The Embedding Galaxy</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-dim md:text-base">
            Each cluster is a project. Hover to expand one, click to fly inside. Colour carries meaning:
            <span className="text-signal"> cyan = data</span>,<span className="text-loss"> magenta = learning</span>,
            <span className="text-output"> amber = output</span>.
          </p>
        </Reveal>

        {!caps.mobile && (
          <div className="mt-8 flex items-center gap-3 font-mono text-xs" role="group" aria-label="View as">
            <span className="text-dim">View as:</span>
            {(['galaxy', 'grid'] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`glass-chip px-3 py-1.5 uppercase tracking-[0.15em] ${view === v ? 'text-signal' : 'text-dim hover:text-ink'}`}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        {galaxy ? (
          <ul className="mt-10 grid gap-3 md:grid-cols-2" aria-label="Projects">
            {projects.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setFocused(p.id)}
                  className="glass-chip flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                  aria-expanded={focused === p.id}
                >
                  <span>
                    <span className="block font-mono text-[10px] text-dim">
                      {p.id.toUpperCase()} · {CLUSTER_TAG[p.cluster]}
                    </span>
                    <span className="text-ink">{p.title}</span>
                  </span>
                  <span className="font-mono text-xs text-signal">open →</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-10 grid gap-5 md:grid-cols-2" aria-label="Projects">
            {projects.map((p, i) => (
              <li key={p.id}>
                <Reveal delay={i * 0.06} className="glass h-full p-6">
                  <p className="font-mono text-[11px] text-dim">{String(i + 1).padStart(2, '0')} · {CLUSTER_TAG[p.cluster]}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm text-dim">{p.short}</p>
                  <p className="mt-4 font-mono text-2xl text-output">
                    <Counter value={p.metric.value} decimals={p.metric.decimals ?? 0} suffix={p.metric.suffix} />
                  </p>
                  <p className="font-mono text-[11px] text-dim">{p.metric.label}</p>
                  <button
                    type="button"
                    onClick={() => setFocused(p.id)}
                    className="mt-5 font-mono text-xs uppercase tracking-[0.15em] text-signal hover:underline"
                  >
                    open case study →
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>

      {focused && <ProjectDetail id={focused} />}
    </section>
  );
}
