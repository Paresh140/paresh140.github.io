'use client';

import { useEffect, useState } from 'react';

// Types `text` out one character at a time, then leaves a blinking cursor.
export default function Typewriter({ text, start, speed = 38 }: { text: string; start: boolean; speed?: number }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(text.length);
      return;
    }
    if (n >= text.length) return;
    const id = window.setTimeout(() => setN((v) => v + 1), speed);
    return () => window.clearTimeout(id);
  }, [start, n, text, speed]);

  return (
    <span aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      <span aria-hidden className="cursor" />
    </span>
  );
}
