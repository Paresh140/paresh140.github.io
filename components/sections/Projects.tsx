'use client';

// (02) Selected work. The cards start as a tilted wall seen from above and settle
// flat as the section scrolls into view. In Train mode the embedding galaxy sits
// behind them, and opening a card flies the camera into that project's cluster.
import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { projects, type Project } from '@/data/projects';
import { useStore } from '@/lib/store';
import { useCaps } from '@/lib/caps';
import Counter from '../ui/Counter';
import Reveal from '../ui/Reveal';
import SectionLabel from '../ui/SectionLabel';
import ProjectDetail from './ProjectDetail';

const CLUSTER_TAG = { signal: 'data', loss: 'learning', output: 'output' } as const;

export default function Projects() {
  const focused = useStore((s) => s.focusedProject);
  const caps = useCaps();
  const wall = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: wall, offset: ['start end', 'start 0.15'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const flat = caps.mobile || caps.reduced;
  const rotateX = useTransform(p, [0, 1], [flat ? 0 : 38, 0]);
  const rotateZ = useTransform(p, [0, 1], [flat ? 0 : -14, 0]);
  const scale = useTransform(p, [0, 1], [flat ? 1 : 0.82, 1]);
  const y = useTransform(p, [0, 1], [flat ? 0 : 120, 0]);

  return (
    <section id="projects" data-layer="2" className="relative px-4 py-28 md:px-8 md:py-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel n={2} wake="Selected work" train="embedding space" />
          <Reveal>
            <h2 className="mega mt-6 text-[clamp(3.5rem,11vw,10rem)] text-ink">
              Work<span className="serif text-signal">.</span>
            </h2>
          </Reveal>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-dim">
          {projects.length} projects across research, deep learning, agents and analytics. Open one for the problem, the approach
          and a live diagram.
        </p>
      </div>

      <div ref={wall} className="wall mt-16">
        <motion.ul
          aria-label="Projects"
          className="wall-plane grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          style={{ rotateX, rotateZ, scale, y, transformOrigin: '50% 0%' }}
        >
          {projects.map((proj, i) => (
            <li key={proj.id}>
              <Card project={proj} index={i} />
            </li>
          ))}
        </motion.ul>
      </div>

      {focused && <ProjectDetail id={focused} />}
    </section>
  );
}

function Card({ project, index }: { project: Project; index: number }) {
  const setFocused = useStore((s) => s.setFocusedProject);
  const focused = useStore((s) => s.focusedProject);

  return (
    <article className="wall-card glass group relative flex h-full min-h-[22rem] flex-col p-5">
      <div className="label flex justify-between text-dim">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>
          {CLUSTER_TAG[project.cluster]} · {project.year}
        </span>
      </div>

      <h3 className="mt-8 text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-ink">
        {/* The whole card is clickable through this button's ::after. */}
        <button
          type="button"
          onClick={() => setFocused(project.id)}
          aria-expanded={focused === project.id}
          className="text-left after:absolute after:inset-0 after:rounded-[14px] after:content-[''] focus-visible:outline-none"
        >
          {project.title}
        </button>
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-dim">{project.short}</p>

      <div className="mt-auto pt-8">
        {project.metric ? (
          <>
            <p className="text-5xl font-medium tracking-[-0.04em] text-ink">
              <Counter
                value={project.metric.value}
                decimals={project.metric.decimals ?? 0}
                suffix={project.metric.suffix}
                className="font-display"
              />
            </p>
            <p className="label mt-2 text-dim">{project.metric.label}</p>
          </>
        ) : (
          <p className="label flex items-center gap-2 text-dim">
            <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-output" />
            {project.status ?? 'In progress'}
          </p>
        )}

        <div className="label mt-6 flex items-center justify-between border-t border-line/10 pt-4">
          <span className="text-ink transition-colors group-hover:text-signal">Open case →</span>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="relative z-10 text-dim hover:text-signal"
              aria-label={`${project.title} on GitHub`}
            >
              GitHub ↗
            </a>
          )}
        </div>
      </div>
      {/* Visible focus ring for the card-wide button. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[14px] ring-signal group-focus-within:ring-2" />
    </article>
  );
}
