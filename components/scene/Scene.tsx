'use client';

// The one persistent <Canvas>. Everything 3D lives here, behind the content.
// The camera follows a CatmullRom spline keyed to the scroll position, or flies
// into a galaxy cluster when one is opened.
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useCaps } from '@/lib/caps';
import { live } from '@/lib/live';
import { useStore } from '@/lib/store';
import { SECTION_COUNT, cameraPath, lookPath } from '@/lib/curve';
import { galaxyCenter } from '@/lib/galaxy';
import Hero3D from './Hero3D';
import Field from './Field';

// Heavy 3D pieces load on demand, so the first paint stays light.
const Galaxy3D = lazy(() => import('./Galaxy3D'));
const Terrain3D = lazy(() => import('./Terrain3D'));
const Neural3D = lazy(() => import('./Neural3D'));

export default function Scene() {
  const caps = useCaps();
  const [dpr, setDpr] = useState(1.75);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Stop rendering while the tab is hidden.
    const onVisibility = () => setVisible(!document.hidden);
    const onPointer = (e: PointerEvent) => {
      live.ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
      live.ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  if (!caps.ready) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, caps.lowEnd ? 1 : dpr]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 200 }}
        gl={{ antialias: !caps.lowEnd, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor('#05060A', 1)}
      >
        <PerformanceMonitor onDecline={() => setDpr(0.9)} onIncline={() => setDpr(1.75)} />
        <CameraRig reduced={caps.reduced} />
        <Suspense fallback={null}>
          <Hero3D count={caps.particles} width={caps.mobile ? 3.2 : 9} reduced={caps.reduced} />
          <Field reduced={caps.reduced} />
          <Galaxy3D reduced={caps.reduced} />
          <Terrain3D reduced={caps.reduced} />
          <Neural3D reduced={caps.reduced} />
        </Suspense>
        {caps.postprocessing && <PostFX />}
      </Canvas>
    </div>
  );
}

// Maps the scroll position onto the camera spline. Each section holds its waypoint
// for the whole section. The move to the next waypoint happens as its top edge
// reaches the middle of the screen, so tall sections never leave the camera mid-flight.
function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const layers = useRef<{ top: number; height: number }[]>([]);
  const frame = useRef(0);
  const look = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    if (frame.current++ % 30 === 0) {
      layers.current = Array.from(document.querySelectorAll<HTMLElement>('[data-layer]')).map((el) => ({
        top: el.offsetTop,
        height: el.offsetHeight,
      }));
    }

    // Smoothed FPS for the HUD.
    if (dt > 0) live.fps += (1 / dt - live.fps) * 0.05;

    const scrollY = window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    live.progress = Math.min(1, scrollY / max);

    // u runs from 0 (hero) to 1 (contact). Waypoint i is at u = i / (N - 1).
    const probe = scrollY + window.innerHeight * 0.5;
    const sections = layers.current;
    let u = 0;
    if (sections.length === SECTION_COUNT) {
      let i = 0;
      while (i < SECTION_COUNT - 1 && probe >= sections[i + 1].top) i++;
      // Transition over the top of section i, then hold there until the next section.
      const span = Math.max(1, Math.min(sections[i].height * 0.3, window.innerHeight * 0.6));
      const k = Math.min(1, Math.max(0, (probe - sections[i].top) / span));
      const eased = k * k * (3 - 2 * k);
      u = Math.max(0, (i - (1 - eased)) / (SECTION_COUNT - 1));
    }
    live.activeSection = Math.round(u * (SECTION_COUNT - 1));

    const focusId = useStore.getState().focusedProject;
    const focus = focusId ? galaxyCenter(focusId) : null;

    if (focus) {
      target.current.set(focus.x, focus.y, focus.z + 1.8);
      lookTarget.current.copy(focus);
    } else {
      cameraPath.getPoint(u, target.current);
      lookPath.getPoint(u, lookTarget.current);
      // Mouse parallax, a light touch so the camera never feels loose.
      target.current.x += live.ndc.x * 0.4;
      target.current.y += live.ndc.y * 0.3;
    }

    // Snap in reduced motion. Otherwise ease toward the target, frame-rate independent.
    const k = reduced ? 1 : 1 - Math.exp(-dt * (focus ? 2.4 : 3.5));
    camera.position.lerp(target.current, k);
    look.current.lerp(lookTarget.current, k);
    camera.lookAt(look.current);
  });

  return null;
}

function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.3} mipmapBlur />
      <ChromaticAberration offset={new THREE.Vector2(0.0006, 0.0006)} radialModulation={false} modulationOffset={0} />
      <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.035} />
    </EffectComposer>
  );
}
