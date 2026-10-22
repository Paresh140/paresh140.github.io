'use client';

// ⌘K / Ctrl+K command palette. Also opens the confusion-matrix view and the matrix mode toggle.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '@/lib/store';

type Command = { id: string; label: string; run: () => void };

export default function CommandPalette() {
  const open = useStore((s) => s.paletteOpen);
  const setOpen = useStore((s) => s.setPaletteOpen);
  const setGalaxyView = useStore((s) => s.setGalaxyView);
  const setConfusionOpen = useStore((s) => s.setConfusionOpen);
  const toggleMatrix = useStore((s) => s.toggleMatrix);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      { id: 'goto-projects', label: 'goto projects', run: () => go('projects') },
      { id: 'goto-about', label: 'goto about', run: () => go('about') },
      { id: 'goto-skills', label: 'goto skills', run: () => go('skills') },
      { id: 'goto-experience', label: 'goto experience', run: () => go('experience') },
      { id: 'goto-contact', label: 'goto contact', run: () => go('contact') },
      { id: 'resume', label: 'download resume', run: downloadResume },
      { id: 'matrix', label: 'toggle matrix mode', run: toggleMatrix },
      { id: 'confusion', label: 'show confusion matrix', run: () => setConfusionOpen(true) },
      { id: 'grid', label: 'view projects as grid', run: () => setGalaxyView('grid') },
      { id: 'galaxy', label: 'view projects as galaxy', run: () => setGalaxyView('galaxy') },
    ],
    [toggleMatrix, setConfusionOpen, setGalaxyView],
  );

  const results = commands.filter((c) => c.label.includes(query.trim().toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!useStore.getState().paletteOpen);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setIndex(0);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [open]);

  if (!open) return null;

  const run = (c: Command | undefined) => {
    if (!c) return;
    setOpen(false);
    c.run();
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center bg-void/70 px-4 pt-[18vh] backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="glass w-full max-w-lg p-2">
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setIndex((i) => Math.min(results.length - 1, i + 1));
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              setIndex((i) => Math.max(0, i - 1));
            }
            if (e.key === 'Enter') run(results[index]);
          }}
          placeholder="> type a command"
          aria-label="Search commands"
          className="w-full bg-transparent px-3 py-2 font-mono text-sm text-ink outline-none placeholder:text-dim"
        />
        <ul role="listbox" className="mt-1 max-h-72 overflow-auto">
          {results.map((c, i) => (
            <li key={c.id} role="option" aria-selected={i === index}>
              <button
                type="button"
                onMouseEnter={() => setIndex(i)}
                onClick={() => run(c)}
                className={`flex w-full items-center justify-between rounded px-3 py-2 text-left font-mono text-sm ${
                  i === index ? 'bg-signal/10 text-signal' : 'text-ink'
                }`}
              >
                <span>{c.label}</span>
                {i === index && <span className="text-[10px] text-dim">enter</span>}
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="px-3 py-2 font-mono text-sm text-dim">no matching command</li>}
        </ul>
      </div>
    </div>
  );
}

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function downloadResume() {
  const a = document.createElement('a');
  a.href = '/Paresh-Subedi-Resume.pdf';
  a.download = 'Paresh-Subedi-Resume.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
