'use client';

import { useStore } from '@/lib/store';
import ModeSwitch from './ModeSwitch';

const LINKS = [
  { id: 'about', label: 'About', n: '01' },
  { id: 'projects', label: 'Work', n: '02' },
  { id: 'skills', label: 'Skills', n: '03' },
  { id: 'experience', label: 'Experience', n: '04' },
  { id: 'contact', label: 'Contact', n: '05' },
];

export default function Nav() {
  const setPaletteOpen = useStore((s) => s.setPaletteOpen);
  const ready = useStore((s) => s.ready);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
      <nav aria-label="Primary" className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        <a href="#top" className="label text-ink hover:text-signal">
          Paresh Subedi
        </a>
        <ul className="label hidden items-center gap-6 text-dim lg:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className="transition-colors hover:text-ink">
                <span className="mr-1 text-dim/60">({l.n})</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ModeSwitch />
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="glass-chip label hidden px-3 py-2 text-dim hover:text-ink sm:block"
            aria-label="Open command palette"
          >
            ⌘K
          </button>
        </div>
      </nav>
    </header>
  );
}
