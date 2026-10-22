'use client';

// Diffusion denoising. ~20k particles start as Gaussian noise and resolve into
// the word "PARESH". The pointer acts as an attention query: nearby particles
// glow and lean toward it, with thin lines to their nearest neighbours.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gaussian, sampleText } from '@/lib/sample';
import { live } from '@/lib/live';
import vert from '@/shaders/hero.vert.glsl';
import frag from '@/shaders/hero.frag.glsl';

const WORD = 'PARESH';
const FONT = '700 260px "Space Grotesk", sans-serif';
const DENOISE_SECONDS = 4.5;
const NEIGHBOURS = 10;

type Particles = { target: Float32Array; start: Float32Array; seed: Float32Array };

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

export default function Hero3D({ count, width, reduced }: { count: number; width: number; reduced: boolean }) {
  const [data, setData] = useState<Particles | null>(null);

  // Wait for the font so the sampled word matches the real glyphs.
  useEffect(() => {
    let alive = true;
    document.fonts
      .load(FONT)
      .catch(() => undefined)
      .then(() => {
        if (!alive) return;
        const start = new Float32Array(count * 3);
        const seed = new Float32Array(count);
        for (let i = 0; i < count; i++) {
          start[i * 3] = gaussian() * 3.2;
          start[i * 3 + 1] = gaussian() * 3.2;
          start[i * 3 + 2] = gaussian() * 1.2;
          seed[i] = Math.random();
        }
        setData({ target: sampleText(WORD, count, width, FONT), start, seed });
      });
    return () => {
      alive = false;
    };
  }, [count, width]);

  const geometry = useMemo(() => {
    if (!data) return null;
    const g = new THREE.BufferGeometry();
    // `position` drives the draw count. The shader computes the real position.
    g.setAttribute('position', new THREE.BufferAttribute(data.target, 3));
    g.setAttribute('aTarget', new THREE.BufferAttribute(data.target, 3));
    g.setAttribute('aStart', new THREE.BufferAttribute(data.start, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(data.seed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30);
    return g;
  }, [data]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uT: { value: 0 },
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
          uDissolve: { value: 0 },
          uSize: { value: 55 },
          uPixelRatio: { value: 1 },
          uCyan: { value: new THREE.Color('#00F0FF') },
          uMagenta: { value: new THREE.Color('#FF2E88') },
          uAmber: { value: new THREE.Color('#FFB800') },
        },
      }),
    [],
  );

  // Attention lines: the query to its nearest particles, and each neighbour to the next.
  const lines = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const segments = NEIGHBOURS * 2 - 1;
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segments * 2 * 3), 3));
    const mat = new THREE.LineBasicMaterial({
      color: '#00F0FF',
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.LineSegments(geo, mat);
  }, []);

  const heroT = useRef(0);
  const mouse = useRef(new THREE.Vector3(9999, 9999, 0));
  const { camera, viewport } = useThree();

  useFrame((state, dt) => {
    if (!data) return;

    // Denoising timestep. Reduced motion jumps straight to the resolved word.
    heroT.current = reduced ? 1 : Math.min(1, heroT.current + dt / DENOISE_SECONDS);
    const uT = 1 - Math.pow(1 - heroT.current, 3);
    live.heroT = uT;

    // Scroll dissolves the word over the first screen of scrolling.
    const dissolve = reduced ? 0 : smooth(window.scrollY / window.innerHeight);
    live.heroDissolve = dissolve;

    // Pointer -> query point on the z = 0 plane.
    const far = new THREE.Vector3(live.ndc.x, live.ndc.y, 0.5).unproject(camera);
    const dir = far.sub(camera.position).normalize();
    if (!reduced && Math.abs(dir.z) > 1e-5) {
      const hit = camera.position.clone().addScaledVector(dir, -camera.position.z / dir.z);
      mouse.current.lerp(hit, 1 - Math.exp(-dt * 10));
    }

    const u = material.uniforms;
    u.uT.value = uT;
    u.uTime.value += reduced ? 0 : dt;
    u.uDissolve.value = dissolve;
    u.uPixelRatio.value = viewport.dpr;
    u.uMouse.value.copy(reduced ? new THREE.Vector3(9999, 9999, 0) : mouse.current);

    // CPU-side nearest neighbours to the query, for the attention lines.
    const t = data.target;
    const mx = mouse.current.x;
    const my = mouse.current.y;
    const bestI = new Int32Array(NEIGHBOURS).fill(-1);
    const bestD = new Float32Array(NEIGHBOURS).fill(Infinity);
    for (let i = 0; i < count; i++) {
      const dx = t[i * 3] - mx;
      const dy = t[i * 3 + 1] - my;
      const d = dx * dx + dy * dy;
      if (d < bestD[NEIGHBOURS - 1]) {
        let j = NEIGHBOURS - 1;
        while (j > 0 && bestD[j - 1] > d) {
          bestD[j] = bestD[j - 1];
          bestI[j] = bestI[j - 1];
          j--;
        }
        bestD[j] = d;
        bestI[j] = i;
      }
    }

    const pos = (lines.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const displayed = (i: number) => {
      // Same lean as the vertex shader, so lines meet the particles.
      const x = t[i * 3];
      const y = t[i * 3 + 1];
      const dd = (x - mx) * (x - mx) + (y - my) * (y - my);
      const attn = Math.exp(-dd * 0.35);
      return [x + (mx - x) * attn * 0.25, y + (my - y) * attn * 0.25];
    };
    let v = 0;
    const put = (x: number, y: number) => {
      pos[v++] = x;
      pos[v++] = y;
      pos[v++] = 0.01;
    };
    for (let k = 0; k < NEIGHBOURS; k++) {
      const i = bestI[k];
      if (i < 0) continue;
      put(mx, my);
      put(...(displayed(i) as [number, number]));
    }
    for (let k = 0; k < NEIGHBOURS - 1; k++) {
      const a = bestI[k];
      const b = bestI[k + 1];
      if (a < 0 || b < 0) continue;
      put(...(displayed(a) as [number, number]));
      put(...(displayed(b) as [number, number]));
    }
    for (; v < pos.length; ) pos[v++] = 0;
    (lines.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (lines.material as THREE.LineBasicMaterial).opacity = reduced ? 0 : 0.5 * uT * (1 - dissolve);
  });

  if (!geometry) return null;

  return (
    <group>
      <points geometry={geometry} material={material} frustumCulled={false} />
      <primitive object={lines} frustumCulled={false} />
    </group>
  );
}
