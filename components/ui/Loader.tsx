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
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-void transition-all duration-700 ${
        leaving ? 'scale-[1.04] opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-[min(560px,88vw)] font-mono text-sm">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-dim">latent-space / train.log</p>
        <div className="min-h-[9rem] space-y-1 text-ink">
          {lines.map((l, i) => (
            <p key={i} className={l === 'converged.' ? 'text-output' : ''}>
              <span className="text-dim">&gt; </span>
              {l}
            </p>
          ))}
        </div>
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-gradient-to-r from-loss via-signal to-output transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-[11px] text-dim">press any key to skip</p>
      </div>
    </div>
  );
}
