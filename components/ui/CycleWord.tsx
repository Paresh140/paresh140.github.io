'use client';

// One word inside parentheses that rolls to the next every few seconds.
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CycleWord({ words, every = 2600 }: { words: string[]; every?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), every);
    return () => window.clearInterval(id);
  }, [words.length, every]);

  return (
    <span className="whitespace-nowrap">
      <span className="text-dim">(</span>
      <span className="relative inline-block overflow-hidden px-[0.06em] align-bottom">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[i]}
            className="serif inline-block text-signal"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="text-dim">)</span>
    </span>
  );
}
