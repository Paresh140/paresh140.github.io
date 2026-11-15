'use client';

// "(02) Selected work" in Wake mode, "layer 02 · embedding space" in Train mode.
import { useStore } from '@/lib/store';

export default function SectionLabel({ n, wake, train, className = '' }: { n: number; wake: string; train: string; className?: string }) {
  const mode = useStore((s) => s.mode);
  const num = String(n).padStart(2, '0');
  return (
    <p className={`label flex items-center gap-3 ${mode === 'train' ? 'text-signal' : 'text-dim'} ${className}`}>
      <span>{mode === 'train' ? `layer ${num}` : `(${num})`}</span>
      <span aria-hidden className="h-px w-8 bg-current opacity-40" />
      <span>{mode === 'train' ? train : wake}</span>
    </p>
  );
}
