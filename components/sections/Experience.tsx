'use client';

// Layer 4. The career as a training run: each role is an epoch with impact metrics.
// The loss curve draws itself in the margin as the page scrolls, going down over time.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { education, experience, lossCurve } from '@/data/experience';
import { useStore } from '@/lib/store';
import Counter from '../ui/Counter';
import Reveal from '../ui/Reveal';
import SectionLabel from '../ui/SectionLabel';

const W = 120;
const H = 320;
const PAD = 16;

function curvePath() {
  const max = Math.max(...lossCurve);
  return lossCurve
    .map((v, i) => {
      const x = PAD + (i / (lossCurve.length - 1)) * (W - PAD * 2);
      const y = PAD + (1 - v / max) * (H - PAD * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function Experience() {
  const section = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const total = experience.length;
  const train = useStore((s) => s.mode) === 'train';

  useEffect(() => {
    const el = path.current;
    if (!el || !section.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const len = el.getTotalLength();
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      gsap.set(el, { strokeDashoffset: 0 });
      return;
    }

    const tween = gsap.to(el, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { trigger: section.current, start: 'top 60%', end: 'bottom 70%', scrub: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={section} id="experience" data-layer="4" className="relative px-4 py-28 md:px-8 md:py-40">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_140px]">
        <div>
          <Reveal>
            <SectionLabel n={4} wake="Experience" train="training log" />
            <h2 className="mega mt-6 text-[clamp(3.5rem,11vw,10rem)] text-ink">
              Path<span className="serif text-signal">.</span>
            </h2>
          </Reveal>

          <pre className={`mt-8 font-mono text-xs text-dim ${train ? '' : 'invisible'}`}>$ python train.py --career --epochs {total}</pre>

          <ol className="mt-6 divide-y divide-line/10 border-y border-line/10">
            {experience.map((e, i) => (
              <li key={e.role + e.org} className="py-10">
                <Reveal className="md:grid md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8">
                  <div>
                  <p className="font-mono text-[11px] text-dim">
                    <span className="text-signal">{String(i + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span> · {e.period}
                  </p>
                  <p className="mt-2 text-sm text-ink">{e.org}</p>
                  <p className="text-sm text-dim">{e.place}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                  <h3 className="text-[clamp(1.75rem,3.4vw,3rem)] font-medium leading-none tracking-[-0.04em] text-ink">{e.role}</h3>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink">
                    {e.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span className="font-mono text-signal">&gt;</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  {e.metrics.length > 0 && (
                    <dl className="mt-5 flex flex-wrap gap-4">
                      {e.metrics.map((m) => (
                        <div key={m.label} className="glass-chip px-4 py-2">
                          <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim">{m.label}</dt>
                          <dd className="font-mono text-xl text-output">
                            <Counter value={m.value} suffix={m.suffix} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal className="mt-12">
            <p className="font-mono text-[11px] text-dim">checkpoints</p>
            <ul className="mt-3 space-y-3">
              {education.map((ed) => (
                <li key={ed.degree} className="glass p-4 text-sm">
                  <p className="text-ink">{ed.degree}</p>
                  <p className="font-mono text-[11px] text-dim">
                    {ed.school} · {ed.period}
                  </p>
                  <p className="mt-1 text-dim">{ed.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* The loss curve is part of the Train story; Wake keeps the column but hides it. */}
        <aside className={`md:sticky md:top-28 md:self-start ${train ? '' : 'invisible'}`} aria-hidden>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" role="presentation">
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} className="text-dim" stroke="currentColor" strokeOpacity={0.4} />
            <path d={curvePath()} fill="none" className="text-loss" stroke="currentColor" strokeWidth={2} strokeLinecap="round" ref={path} />
          </svg>
          <p className="mt-2 font-mono text-[10px] text-dim">loss ↓ 2.341 → 0.012</p>
          <p className="font-mono text-[10px] text-dim">this is my career converging.</p>
        </aside>
      </div>
    </section>
  );
}
