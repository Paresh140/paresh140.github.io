'use client';

import { useStore } from '@/lib/store';

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const setPaletteOpen = useStore((s) => s.setPaletteOpen);
  const ready = useStore((s) => s.ready);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
      <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <a href="#top" className="font-mono text-xs tracking-[0.2em] text-ink hover:text-signal">
          PARESH<span className="text-signal">.</span>SUBEDI
        </a>
        <ul className="hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-dim md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className="transition-colors hover:text-signal">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="glass-chip font-mono text-[11px] text-dim hover:text-signal"
          aria-label="Open command palette"
        >
          ⌘K
        </button>
      </nav>
    </header>
  );
}
