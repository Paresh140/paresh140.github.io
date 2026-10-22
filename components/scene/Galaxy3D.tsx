'use client';

// The Embedding Galaxy: one glowing cluster per project, with satellite points
// for related skills. Hover expands a cluster and shows a holographic label.
// Clicks are read from the DOM layer in Projects.tsx, not from the canvas.
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { projects, type Cluster } from '@/data/projects';
import { gaussian } from '@/lib/sample';
import { live } from '@/lib/live';
import { useStore } from '@/lib/store';
import { LAYER, sectionY } from '@/lib/curve';
import vert from '@/shaders/galaxy.vert.glsl';
import frag from '@/shaders/galaxy.frag.glsl';

const COLOR: Record<Cluster, string> = { signal: '#00F0FF', loss: '#FF2E88', output: '#FFB800' };
const CORE = 1400;
const SATELLITES = 60;
const GALAXY_Y = sectionY(LAYER.projects);

function buildGeometry() {
  const total = projects.length * (CORE + SATELLITES);
  const offsets = new Float32Array(total * 3);
  const cluster = new Float32Array(total);
  const seed = new Float32Array(total);
  const sat = new Float32Array(total);

  let n = 0;
  projects.forEach((_, ci) => {
    for (let i = 0; i < CORE; i++, n++) {
      offsets[n * 3] = gaussian() * 0.75;
      offsets[n * 3 + 1] = gaussian() * 0.7;
      offsets[n * 3 + 2] = gaussian() * 0.45;
      cluster[n] = ci;
      seed[n] = Math.random();
    }
    for (let i = 0; i < SATELLITES; i++, n++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.4 + Math.random() * 0.6;
      offsets[n * 3] = Math.cos(a) * r;
      offsets[n * 3 + 1] = Math.sin(a) * r;
      offsets[n * 3 + 2] = gaussian() * 0.35;
      cluster[n] = ci;
      seed[n] = Math.random();
      sat[n] = 1;
    }
  });

  const g = new THREE.BufferGeometry();
  // `position` sets the draw count. The shader places each point from aOffset.
  g.setAttribute('position', new THREE.BufferAttribute(offsets, 3));
  g.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3));
  g.setAttribute('aCluster', new THREE.BufferAttribute(cluster, 1));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  g.setAttribute('aSat', new THREE.BufferAttribute(sat, 1));
  return g;
}

export default function Galaxy3D({ reduced }: { reduced: boolean }) {
  const [hovered, setHovered] = useState(-1);
  const geometry = useMemo(buildGeometry, []);

  const uniforms = useMemo(
    () => ({
      uCenters: { value: projects.map((p) => new THREE.Vector3(...p.position)) },
      uColors: { value: projects.map((p) => new THREE.Color(COLOR[p.cluster])) },
      uExpand: { value: projects.map(() => 0) },
      uDim: { value: projects.map(() => 1) },
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms],
  );

  // Hit targets for hover. Invisible, but they still raycast.
  const hits = useRef<THREE.Mesh[]>([]);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);

  useFrame((state, dt) => {
    const u = uniforms;
    u.uTime.value += reduced ? 0 : dt;
    u.uPixelRatio.value = state.viewport.dpr;

    const focused = useStore.getState().focusedProject;
    const inView = useStore.getState().galaxyView === 'galaxy' && live.activeSection === LAYER.projects;

    // Hover only counts while the galaxy is on screen.
    pointer.set(live.ndc.x, live.ndc.y);
    raycaster.setFromCamera(pointer, state.camera);
    const hit = inView && !focused ? raycaster.intersectObjects(hits.current, false)[0] : undefined;
    const idx = hit ? (hit.object.userData.index as number) : -1;
    if (idx !== live.hoverCluster) {
      live.hoverCluster = idx;
      setHovered(idx);
    }

    const k = 1 - Math.exp(-dt * 6);
    projects.forEach((p, i) => {
      const expandTarget = !reduced && (live.hoverCluster === i || focused === p.id) ? 1 : 0;
      const dimTarget = !focused || focused === p.id ? 1 : 0.12;
      u.uExpand.value[i] += (expandTarget - u.uExpand.value[i]) * k;
      u.uDim.value[i] += (dimTarget - u.uDim.value[i]) * k;
    });
  });

  return (
    <group position={[0, GALAXY_Y, 0]}>
      <points geometry={geometry} material={material} frustumCulled={false} />

      {projects.map((p, i) => (
        <mesh
          key={p.id}
          position={p.position}
          userData={{ index: i }}
          ref={(el) => {
            if (el) hits.current[i] = el;
          }}
        >
          <sphereGeometry args={[1.7, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}

      {hovered >= 0 && (
        <Html position={projects[hovered].position} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <div className="holo">
            <span className="holo-tag">{projects[hovered].cluster}</span>
            <span className="holo-title">{projects[hovered].title}</span>
          </div>
        </Html>
      )}
    </group>
  );
}
