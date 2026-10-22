'use client';

// Detail panel for one cluster: problem, approach, a live diagram, a metric and links.
import { Suspense, lazy, useEffect } from 'react';
import { projects } from '@/data/projects';
import { useStore } from '@/lib/store';
import Counter from '../ui/Counter';
import GlassPanel from '../ui/GlassPanel';
import TensorFallback from '../ui/TensorFallback';

// The diagrams are heavy, so they load only when a case study opens.
const ProjectVisual = lazy(() => import('./ProjectVisual'));

export default function ProjectDetail({ id }: { id: string }) {
  const setFocused = useStore((s) => s.setFocusedProject);
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFocused(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setFocused]);

  if (!project) return null;
  const index = projects.indexOf(project) + 1;

  return (
    <div className="fixed inset-x-3 bottom-3 top-20 z-30 md:inset-x-auto md:right-8 md:top-24 md:bottom-8 md:w-[480px]">
      <GlassPanel className="flex h-full flex-col overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="font-mono text-[11px] text-dim">
              {String(index).padStart(2, '0')} · cluster · {project.cluster}
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-ink">{project.title}</h3>
          </div>
          <button
            type="button"
            onClick={() => setFocused(null)}
            className="glass-chip shrink-0 px-2 py-1 font-mono text-xs text-dim hover:text-signal"
            aria-label="Close project detail"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5 text-sm leading-relaxed">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-loss">problem</p>
            <p className="mt-1 text-ink">{project.problem}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-signal">approach</p>
            <p className="mt-1 text-ink">{project.approach}</p>
          </div>

          <Suspense fallback={<TensorFallback />}>
            <ProjectVisual kind={project.visual} satellites={project.satellites} />
          </Suspense>

          <div className="glass-chip flex items-center justify-between px-4 py-3">
            <span className="font-mono text-[11px] text-dim">{project.metric.label}</span>
            <span className="font-mono text-2xl text-output">
              <Counter value={project.metric.value} decimals={project.metric.decimals ?? 0} suffix={project.metric.suffix} />
            </span>
          </div>

          <ul className="flex flex-wrap gap-2" aria-label="Stack">
            {project.stack.map((s) => (
              <li key={s} className="glass-chip px-2.5 py-1 font-mono text-[11px] text-ink">
                {s}
              </li>
            ))}
          </ul>

          <div className="flex gap-3 font-mono text-xs uppercase tracking-[0.15em]">
            <a href={project.github} target="_blank" rel="noreferrer" className="glass-chip px-4 py-2 text-ink hover:text-signal">
              GitHub ↗
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className="glass-chip px-4 py-2 text-ink hover:text-output">
                Demo ↗
              </a>
            )}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
