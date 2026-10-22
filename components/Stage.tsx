'use client';

// Client boundary for the 3D layer. The Canvas and its dependencies are loaded
// only in the browser, so the static HTML stays light and readable without JS.
import dynamic from 'next/dynamic';
import { useCaps } from '@/lib/caps';
import { useStore } from '@/lib/store';
import Hud from './ui/Hud';

const Scene = dynamic(() => import('./scene/Scene'), { ssr: false });

export default function Stage() {
  const caps = useCaps();
  const focused = useStore((s) => s.focusedProject);
  return (
    <>
      <Scene />
      {/* The HUD steps aside while a case study panel is open. */}
      {caps.ready && !focused && <Hud particles={caps.particles} />}
    </>
  );
}
