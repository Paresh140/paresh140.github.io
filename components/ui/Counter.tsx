'use client';

// A mono number that counts up once it scrolls into view, like a live metric.
import { useEffect, useRef } from 'react';

type Props = {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

export default function Counter({ value, decimals = 0, suffix = '', duration = 1.6, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (v: number) => `${v.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.textContent = format(value);
      return;
    }

    // Start from zero, then count up the first time the element is 60% visible.
    el.textContent = format(0);
    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / (duration * 1000));
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = format(value * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // format is derived from decimals and suffix, which are listed below.
  }, [value, decimals, suffix, duration]);

  return (
    <span ref={ref} className={`font-mono tabular-nums ${className ?? ''}`}>
      {format(value)}
    </span>
  );
}
