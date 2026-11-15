'use client';

// The Wake / Train switch. Wake is the quick, light read; Train opens the
// latent-space version of the site with the full 3D scenes.
import { useEffect, type MouseEvent } from 'react';
import { useStore, type Mode } from '@/lib/store';
import { readStoredMode, switchMode } from '@/lib/mode';

const OPTIONS: { mode: Mode; label: string; hint: string }[] = [
  { mode: 'wake', label: 'Wake', hint: 'Light, quick read' },
  { mode: 'train', label: 'Train', hint: 'Dark, full 3D latent space' },
];

export default function ModeSwitch({ className = '' }: { className?: string }) {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);

  // Pick up the stored choice (or ?mode=train) once the page is interactive.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('mode');
    const initial: Mode = param === 'train' || param === 'wake' ? param : readStoredMode();
    document.documentElement.dataset.mode = initial;
    setMode(initial);
  }, [setMode]);

  const choose = (next: Mode) => (e: MouseEvent<HTMLButtonElement>) => {
    if (next === mode) return;
    const r = e.currentTarget.getBoundingClientRect();
    switchMode(next, r.left + r.width / 2, r.top + r.height / 2);
  };

  return (
    <div role="group" aria-label="Site mode" className={`glass-chip relative flex items-center p-1 ${className}`}>
      <span
        aria-hidden
        className="absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)]"
        style={{ transform: `translateX(${mode === 'wake' ? '0%' : '100%'})` }}
      />
      {OPTIONS.map((o) => (
        <button
          key={o.mode}
          type="button"
          aria-pressed={mode === o.mode}
          title={o.hint}
          onClick={choose(o.mode)}
          className={`label relative z-10 flex w-16 items-center justify-center gap-1.5 rounded-full py-1.5 transition-colors duration-500 ${
            mode === o.mode ? 'text-void' : 'text-dim hover:text-ink'
          }`}
        >
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${o.mode === 'wake' ? 'bg-output' : 'bg-signal'}`} />
          {o.label}
        </button>
      ))}
    </div>
  );
}
