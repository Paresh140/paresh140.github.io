'use client';

import { useEffect } from 'react';
import { confusionLabels, confusionMatrix } from '@/data/metrics';
import { useStore } from '@/lib/store';

// Renders the confusion matrix from data/metrics.ts. Values are placeholders until replaced.
export default function ConfusionModal() {
  const open = useStore((s) => s.confusionOpen);
  const setOpen = useStore((s) => s.setConfusionOpen);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (!open) return null;

  const max = Math.max(...confusionMatrix.flat());

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-void/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div role="dialog" aria-modal="true" aria-label="Confusion matrix" className="glass w-full max-w-xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">confusion matrix · predicted vs actual</p>
          <button type="button" onClick={() => setOpen(false)} className="font-mono text-xs text-dim hover:text-signal">
            esc ✕
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="mx-auto border-separate border-spacing-1 font-mono text-[11px]">
            <thead>
              <tr>
                <th className="p-1 text-dim">actual ↓ / pred →</th>
                {confusionLabels.map((l) => (
                  <th key={l} className="p-1 font-normal text-dim">
                    {l}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {confusionMatrix.map((row, r) => (
                <tr key={confusionLabels[r]}>
                  <th className="p-1 pr-3 text-right font-normal text-dim">{confusionLabels[r]}</th>
                  {row.map((v, c) => {
                    const a = v / max;
                    return (
                      <td
                        key={c}
                        className="h-9 w-10 rounded text-center text-ink"
                        style={{
                          background: r === c ? `rgba(0,240,255,${0.12 + a * 0.6})` : `rgba(255,46,136,${a * 0.5})`,
                        }}
                        aria-label={`actual ${confusionLabels[r]}, predicted ${confusionLabels[c]}: ${v}`}
                      >
                        {v}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-[11px] text-output">PLACEHOLDER values. Replace data/metrics.ts with the real evaluation output.</p>
      </div>
    </div>
  );
}
