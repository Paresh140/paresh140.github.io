import type { ReactNode } from 'react';

// Glassmorphic panel: a 1px gradient border and a faint scanline overlay.
export default function GlassPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass relative ${className}`}>{children}</div>;
}
