'use client';

// Easter eggs: Konami code, matrix mode, and the console message for DevTools.
import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const NET = String.raw`
        o       o       o
    o   o   o   o   o   o   o
    o   o   o   o   o   o   o
        o       o       o
`;

export default function Easter() {
  const overfit = useStore((s) => s.overfit);
  const toggleOverfit = useStore((s) => s.toggleOverfit);
  const matrix = useStore((s) => s.matrix);
  const canvas = useRef<HTMLCanvasElement>(null);

  // Console message for anyone who opens DevTools.
  useEffect(() => {
    console.log(`%c${NET}`, 'color:#00F0FF;font-family:monospace;');
    console.log(
      '%cYou inspect elements. I inspect gradients. Let\'s talk.',
      'color:#FFB800;font-family:monospace;font-size:13px;',
    );
  }, []);

  // Konami code toggles overfitting mode.
  useEffect(() => {
    let seq: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      seq = [...seq, e.key].slice(-KONAMI.length);
      if (seq.join() === KONAMI.join()) {
        toggleOverfit();
        seq = [];
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleOverfit]);

  useEffect(() => {
    document.documentElement.classList.toggle('overfit', overfit);
  }, [overfit]);

  useEffect(() => {
    document.documentElement.classList.toggle('matrix', matrix);
  }, [matrix]);

  // Matrix rain, drawn only while matrix mode is on.
  useEffect(() => {
    if (!matrix || !canvas.current) return;
    const cvs = canvas.current;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const glyphs = 'アイウエオカキクケコサシスセソ01█▌▓'.split('');
    let cols = 0;
    let drops: number[] = [];
    const size = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
      cols = Math.ceil(cvs.width / 16);
      drops = Array.from({ length: cols }, () => Math.random() * -50);
    };
    size();
    window.addEventListener('resize', size);
    const id = window.setInterval(() => {
      ctx.fillStyle = 'rgba(5,6,10,0.12)';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      ctx.fillStyle = '#39FF88';
      ctx.font = '14px monospace';
      drops.forEach((y, i) => {
        ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * 16, y * 16);
        drops[i] = y * 16 > cvs.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    }, 60);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('resize', size);
    };
  }, [matrix]);

  return (
    <>
      {matrix && <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-[5] opacity-40" />}
    </>
  );
}
