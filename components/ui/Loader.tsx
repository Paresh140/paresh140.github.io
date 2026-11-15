'use client';

// Opening sequence: a training log that converges, then the screen clears.
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';

const EPOCHS = [
  { epoch: 1, loss: 2.341 },
  { epoch: 2, loss: 1.204 },
  { epoch: 3, loss: 0.733 },
  { epoch: 4, loss: 0.19 },
  { epoch: 5, loss: 0.012 },
];

export default function Loader() {
  const ready = useStore((s) => s.ready);
  const setReady = useStore((s) => s.setReady);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const per = reduce ? 40 : 480;
    const timers: number[] = [];

    timers.push(window.setTimeout(() => setLines(['Initializing weights...']), 0));
    EPOCHS.forEach((e, i) => {
      timers.push(
        window.setTimeout(() => {
          setLines((prev) => [...prev, `epoch ${e.epoch}/5  loss: ${e.loss.toFixed(3)}`]);
          setProgress(((i + 1) / EPOCHS.length) * 100);
        }, per * (i + 1)),
      );
    });
    const done = per * (EPOCHS.length + 1);
    timers.push(window.setTimeout(() => setLines((p) => [...p, 'converged.']), done));
    timers.push(window.setTimeout(() => setLeaving(true), done + (reduce ? 80 : 600)));
    timers.push(
      window.setTimeout(() => {
        setHidden(true);
        setReady(true);
      }, done + (reduce ? 200 : 1100)),
    );

    const skip = () => {
      timers.forEach(window.clearTimeout);
      setLines(['Initializing weights...', ...EPOCHS.map((e) => `epoch ${e.epoch}/5  loss: ${e.loss.toFixed(3)}`), 'converged.']);
      setProgress(100);
      setLeaving(true);
      window.setTimeout(() => {
        setHidden(true);
        setReady(true);
      }, 500);
    };
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [setReady]);

  if (hidden || ready) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-void p-4 transition-all duration-700 md:p-8 ${
        leaving ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.7, 0, 0.2, 1)' }}
    >
      <div className="label flex justify-between text-dim">
        <span>Paresh Subedi</span>
        <span>press any key to skip</span>
      </div>

      <div className="grid items-end gap-6 md:grid-cols-[1fr_min(440px,40vw)]">
        <p className="mega text-[clamp(6rem,26vw,24rem)] tabular-nums text-ink" aria-label={`${Math.round(progress)} percent`}>
          {String(Math.round(progress)).padStart(3, '0')}
        </p>
        <div className="pb-[2vw] font-mono text-xs">
          <div className="min-h-[8.5rem] space-y-1 text-dim">
            {lines.map((l, i) => (
              <p key={i} className={l === 'converged.' ? 'text-signal' : ''}>
                <span className="opacity-60">&gt; </span>
                {l}
              </p>
            ))}
          </div>
          <div className="mt-4 h-px w-full bg-line/15">
            <div className="h-full bg-ink transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
