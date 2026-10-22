'use client';

// Layer 4. The career as a training run: each role is an epoch with impact metrics.
// The loss curve draws itself in the margin as the page scrolls, going down over time.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { education, experience, lossCurve } from '@/data/experience';
import Counter from '../ui/Counter';
import Reveal from '../ui/Reveal';

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
    <section ref={section} id="experience" data-layer="4" className="relative px-4 py-24 md:px-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,1fr)_140px]">
        <div>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">layer 04 · training log</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-ink md:text-6xl">Experience</h2>
          </Reveal>

          <pre className="mt-8 font-mono text-xs text-dim">$ python train.py --career --epochs {total}</pre>

          <ol className="mt-6 space-y-10">
            {experience.map((e, i) => (
              <li key={e.role + e.org}>
                <Reveal>
                  <p className="font-mono text-[11px] text-dim">
                    epoch <span className="text-signal">{i + 1}/{total}</span> · {e.period}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-ink">{e.role}</h3>
                  <p className="text-sm text-dim">
                    {e.org} · {e.place}
                  </p>
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

        <aside className="md:sticky md:top-28 md:self-start" aria-hidden>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" role="presentation">
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#6B7689" strokeOpacity={0.4} />
            <path d={curvePath()} fill="none" stroke="#FF2E88" strokeWidth={2} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #FF2E88)' }} ref={path} />
          </svg>
          <p className="mt-2 font-mono text-[10px] text-dim">loss ↓ 2.341 → 0.012</p>
          <p className="font-mono text-[10px] text-dim">this is my career converging.</p>
        </aside>
      </div>
    </section>
  );
}
