'use client';

// (01) About. A large statement up top, then the model card and the headline numbers.
import { profile, stats } from '@/data/profile';
import { education } from '@/data/experience';
import Counter from '../ui/Counter';
import Reveal from '../ui/Reveal';
import SectionLabel from '../ui/SectionLabel';

const ROWS: [string, string][] = [
  ['Model', 'Paresh-v2026'],
  ['Architecture', 'Data scientist + systems thinker'],
  ['Training data', profile.trainingData],
  ['Intended use', profile.intendedUse],
  ['Known limitations', profile.limitations],
];

export default function About() {
  return (
    <section id="about" data-layer="1" className="relative px-4 py-28 md:px-8 md:py-40">
      <SectionLabel n={1} wake="About" train="model card" />

      <Reveal>
        <p className="mt-10 max-w-[18ch] text-[clamp(2.2rem,6vw,5.75rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink md:ml-[16vw]">
          I make language models <span className="serif text-signal">leaner</span>, and data{' '}
          <span className="serif text-signal">useful</span>.
        </p>
      </Reveal>

      <div className="mt-20 grid gap-10 md:ml-[16vw] md:grid-cols-[1.3fr_1fr] md:gap-16">
        <Reveal>
          <p className="max-w-xl text-base leading-relaxed text-ink md:text-lg">{profile.bio}</p>

          <dl className="mt-10 divide-y divide-line/10 border-y border-line/10 text-sm">
            {ROWS.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3 md:grid-cols-[11rem_1fr] md:gap-4">
                <dt className="label text-dim">{k}</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-line/10 py-5">
              <p className="text-6xl font-medium tracking-[-0.04em] text-ink md:text-7xl">
                <Counter value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} className="font-display" />
              </p>
              <p className="mt-2 text-sm text-ink">{s.label}</p>
              <p className="label mt-1 text-dim">{s.note}</p>
            </div>
          ))}
          <div className="border-t border-line/10 pt-5">
            <p className="label text-dim">Education</p>
            <ul className="mt-3 space-y-2 text-sm text-ink">
              {education.map((e) => (
                <li key={e.degree}>
                  {e.degree} <span className="text-dim">· {e.school}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
