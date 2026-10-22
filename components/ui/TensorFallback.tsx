// Suspense fallback for lazy-loaded pieces. It reads as a training status line.
export default function TensorFallback({ label = 'loading tensor...' }: { label?: string }) {
  return (
    <div role="status" className="font-mono text-xs text-dim">
      <span className="text-signal">▌</span> {label}
    </div>
  );
}
