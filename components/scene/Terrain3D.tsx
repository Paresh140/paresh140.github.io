'use client';

// The Loss Landscape. A GLSL-displaced terrain where each skill group is a valley
// (deeper = stronger). A ball rolls down it with the chosen optimizer as the
// reader scrolls from group to group.
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { lossGradient, lossHeight, strengths, valleyCenters } from '@/lib/surface';
import { LAYER, sectionY } from '@/lib/curve';
import { useStore } from '@/lib/store';
import type { Optimizer } from '@/data/skills';
import vert from '@/shaders/terrain.vert.glsl';
import frag from '@/shaders/terrain.frag.glsl';

const TERRAIN_POS: [number, number, number] = [0, sectionY(LAYER.skills) - 3.2, -2];
const TRAIL = 120;
// Learning rates per optimizer. Tuned so each one rolls at a visibly different pace.
const LR = { SGD: 0.05, Momentum: 0.02, Adam: 0.06 } as const;
// Pulls the ball toward the active valley so it settles where the page points.
const PULL = 0.35;
const START = { x: -5.5, z: 5.5 };

type BallState = {
  x: number;
  z: number;
  vx: number;
  vz: number;
  mx: number;
  mz: number;
  sx: number;
  sz: number;
  t: number;
};

const freshState = (): BallState => ({ x: START.x, z: START.z, vx: 0, vz: 0, mx: 0, mz: 0, sx: 0, sz: 0, t: 0 });

function step(s: BallState, opt: Optimizer, cx: number, cz: number) {
  const [gx, gz] = lossGradient(s.x, s.z);
  const ax = gx + PULL * (s.x - cx);
  const az = gz + PULL * (s.z - cz);

  if (opt === 'SGD') {
    s.x -= LR.SGD * ax;
    s.z -= LR.SGD * az;
  } else if (opt === 'Momentum') {
    s.vx = 0.85 * s.vx + ax;
    s.vz = 0.85 * s.vz + az;
    s.x -= LR.Momentum * s.vx;
    s.z -= LR.Momentum * s.vz;
  } else {
    const b1 = 0.9;
    const b2 = 0.999;
    const eps = 1e-8;
    s.t += 1;
    s.mx = b1 * s.mx + (1 - b1) * ax;
    s.mz = b1 * s.mz + (1 - b1) * az;
    s.sx = b2 * s.sx + (1 - b2) * ax * ax;
    s.sz = b2 * s.sz + (1 - b2) * az * az;
    const mhx = s.mx / (1 - b1 ** s.t);
    const mhz = s.mz / (1 - b1 ** s.t);
    const shx = s.sx / (1 - b2 ** s.t);
    const shz = s.sz / (1 - b2 ** s.t);
    s.x -= LR.Adam * mhx / (Math.sqrt(shx) + eps);
    s.z -= LR.Adam * mhz / (Math.sqrt(shz) + eps);
  }
}

export default function Terrain3D({ reduced }: { reduced: boolean }) {
  const optimizer = useStore((s) => s.optimizer);
  const ball = useRef<THREE.Mesh>(null);
  const state = useRef<BallState>(freshState());

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(14, 14, 160, 160);
    g.rotateX(-Math.PI / 2); // lay the plane flat so position.xz is the surface domain
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uStrength: { value: strengths },
      uCenter: { value: valleyCenters.map(([x, z]) => new THREE.Vector2(x, z)) },
      uCyan: { value: new THREE.Color('#00F0FF') },
      uMagenta: { value: new THREE.Color('#FF2E88') },
      uVoid: { value: new THREE.Color('#05060A') },
      uTime: { value: 0 },
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
        side: THREE.DoubleSide,
      }),
    [uniforms],
  );

  const trail = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3));
    const mat = new THREE.LineBasicMaterial({ color: '#FFB800', transparent: true, opacity: 0.6 });
    return new THREE.Line(geo, mat);
  }, []);

  // A new optimizer starts fresh from where the ball is now.
  useEffect(() => {
    state.current = { ...state.current, vx: 0, vz: 0, mx: 0, mz: 0, sx: 0, sz: 0, t: 0 };
  }, [optimizer]);

  useFrame((_, dt) => {
    uniforms.uTime.value += reduced ? 0 : dt;

    const { activeGroup, optimizer: opt } = useStore.getState();
    const [cx, cz] = valleyCenters[activeGroup];
    const s = state.current;

    if (reduced) {
      s.x = cx;
      s.z = cz;
    } else {
      step(s, opt, cx, cz);
      step(s, opt, cx, cz);
    }

    const h = lossHeight(s.x, s.z) + 0.25;
    ball.current?.position.set(s.x, h, s.z);

    // Shift the trail and push the newest point to the front.
    const pos = (trail.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    pos.copyWithin(3, 0, (TRAIL - 1) * 3);
    pos[0] = s.x;
    pos[1] = h;
    pos[2] = s.z;
    (trail.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <group position={TERRAIN_POS}>
      <mesh geometry={geometry} material={material} />
      <primitive object={trail} frustumCulled={false} />
      <mesh ref={ball}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshBasicMaterial color="#FFB800" />
      </mesh>
    </group>
  );
}
