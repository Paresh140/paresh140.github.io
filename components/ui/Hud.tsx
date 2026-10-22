'use client';

// Site metrics, in the corner. Values are read from `live` on each frame and
// written straight to the DOM, so the HUD never causes a React render.
import { useEffect, useRef } from 'react';
import { live } from '@/lib/live';

export default function Hud({ particles }: { particles: number }) {
  const fps = useRef<HTMLSpanElement>(null);
  const pass = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const denoise = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (fps.current) fps.current.textContent = String(Math.round(live.fps));
      const pct = Math.round(live.progress * 100);
      if (pass.current) pass.current.textContent = `${pct}%`;
      if (bar.current) bar.current.style.width = `${pct}%`;
      if (denoise.current) denoise.current.textContent = `${Math.round((1 - live.heroT) * 1000)}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden md:block">
      <aside aria-label="Site metrics" className="glass w-56 p-3 font-mono text-[11px] text-dim">
        <div className="flex justify-between">
          <span>FPS</span>
          <span className="text-signal" ref={fps}>--</span>
        </div>
        <div className="flex justify-between">
          <span>particles</span>
          <span className="text-signal">{particles.toLocaleString('en-US')}</span>
        </div>
        <div className="flex justify-between">
          <span>t</span>
          <span className="text-loss" ref={denoise}>1000</span>
        </div>
        <div className="mt-2">
          <div className="flex justify-between">
            <span>forward pass</span>
            <span className="text-output" ref={pass}>0%</span>
          </div>
          <div className="mt-1 h-[3px] w-full bg-white/10">
            <div ref={bar} className="h-full bg-gradient-to-r from-signal to-output" style={{ width: '0%' }} />
          </div>
        </div>
      </aside>
    </div>
  );
}
