'use client';

// Layer 1. A Hugging Face–style model card. The wireframe net behind it pulses as you read.
import { profile, stats } from '@/data/profile';
import { education } from '@/data/experience';
import Counter from '../ui/Counter';
import GlassPanel from '../ui/GlassPanel';
import Reveal from '../ui/Reveal';

const ROWS: [string, string][] = [
  ['Model', 'Paresh-v2026'],
  ['Architecture', 'Data Scientist + Systems Thinker'],
  ['Training data', profile.trainingData],
  ['Intended use', profile.intendedUse],
  ['Known limitations', profile.limitations],
];

export default function About() {
  return (
    <section id="about" data-layer="1" className="relative flex min-h-screen items-center px-4 py-24 md:px-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <GlassPanel className="p-6 md:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">model card</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Paresh-v2026</h2>

            <dl className="mt-6 divide-y divide-white/10 text-sm">
              {ROWS.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3 md:grid-cols-[10rem_1fr] md:gap-4">
                  <dt className="font-mono text-xs uppercase tracking-[0.12em] text-dim">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-sm leading-relaxed text-dim">{profile.bio}</p>
          </GlassPanel>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col gap-4">
          {stats.map((s) => (
            <GlassPanel key={s.label} className="p-5">
              <p className="font-mono text-4xl font-semibold text-output md:text-5xl">
                <Counter value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-ink">{s.label}</p>
              <p className="font-mono text-[11px] text-dim">{s.note}</p>
            </GlassPanel>
          ))}
          <GlassPanel className="p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim">education</p>
            <ul className="mt-2 space-y-2 text-sm text-ink">
              {education.map((e) => (
                <li key={e.degree}>
                  {e.degree} <span className="text-dim">· {e.school}</span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}
