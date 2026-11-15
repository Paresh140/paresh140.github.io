'use client';

// Wake mode's 3D layer: one faceted glass "neural crystal" with a cloud of latent
// points inside it, and a few white shards drifting at different depths. The crystal
// moves to a new resting place for each section as the page scrolls.
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { live } from '@/lib/live';
import { SECTION_COUNT } from '@/lib/curve';

// Where the crystal rests in each section, in viewport units (-1..1), plus its scale.
// Order: hero, about, projects, skills, experience, contact.
const ANCHORS_DESKTOP: [number, number, number][] = [
  [0.02, 0.12, 1],
  [-0.66, 0.05, 0.62],
  [0.74, 0.62, 0.38],
  [0.74, -0.15, 0.52],
  [-0.74, 0.3, 0.46],
  [0.6, -0.05, 0.85],
];
const ANCHORS_MOBILE: [number, number, number][] = [
  [0.38, 0.06, 0.9],
  [0.62, 0.62, 0.38],
  [0.7, 0.72, 0.3],
  [0.7, 0.7, 0.3],
  [0.7, 0.7, 0.3],
  [0.45, 0.55, 0.45],
];

// A deterministic hash, so vertices shared between faces move together.
function hash(x: number, y: number, z: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

function crystalGeometry() {
  const g = new THREE.IcosahedronGeometry(1.25, 1);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = hash(Math.round(v.x * 100), Math.round(v.y * 100), Math.round(v.z * 100));
    v.multiplyScalar(0.82 + n * 0.32);
    v.y *= 1.18; // a little taller than wide
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function corePoints(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Points cluster toward the centre: a latent space with a dense core.
    const r = Math.pow(Math.random(), 1.8) * 0.72;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 1.15;
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return g;
}

type Layer = { top: number; height: number };

export default function Wake3D({ mobile, lowEnd, reduced }: { mobile: boolean; lowEnd: boolean; reduced: boolean }) {
  const { viewport, camera } = useThree();
  const crystal = useRef<THREE.Group>(null);
  const core = useRef<THREE.Points>(null);
  const shards = useRef<THREE.Group>(null);
  const layers = useRef<Layer[]>([]);
  const frame = useRef(0);
  const target = useRef(new THREE.Vector3());
  const spin = useRef(0);
  const lastScroll = useRef(0);

  const geometry = useMemo(crystalGeometry, []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 1), [geometry]);
  const points = useMemo(() => corePoints(lowEnd ? 260 : 520), [lowEnd]);
  const shardData = useMemo(
    () =>
      Array.from({ length: mobile ? 6 : 12 }, (_, i) => ({
        x: (hash(i, 1, 3) * 2 - 1) * 8,
        y: (hash(i, 7, 2) * 2 - 1) * 5,
        z: -1 - hash(i, 4, 9) * 4,
        s: 0.08 + hash(i, 5, 5) * 0.18,
        r: hash(i, 2, 8) * Math.PI,
      })),
    [mobile],
  );
  const anchors = mobile ? ANCHORS_MOBILE : ANCHORS_DESKTOP;

  useFrame((_, dt) => {
    if (frame.current++ % 30 === 0) {
      layers.current = Array.from(document.querySelectorAll<HTMLElement>('[data-layer]')).map((el) => ({
        top: el.offsetTop,
        height: el.offsetHeight,
      }));
    }
    if (dt > 0) live.fps += (1 / dt - live.fps) * 0.05;

    // Which section are we in, and how far through its last stretch?
    const scrollY = window.scrollY;
    const probe = scrollY + window.innerHeight * 0.5;
    const sections = layers.current;
    let i = 0;
    let t = 0;
    if (sections.length === SECTION_COUNT) {
      while (i < SECTION_COUNT - 1 && probe >= sections[i + 1].top) i++;
      const s = sections[i];
      const k = (probe - s.top) / Math.max(1, s.height);
      // Hold for most of the section, then travel to the next anchor near its end.
      t = i < SECTION_COUNT - 1 ? THREE.MathUtils.smoothstep(k, 0.62, 1) : 0;
    }
    live.activeSection = i;
    const a = anchors[i];
    const b = anchors[Math.min(i + 1, SECTION_COUNT - 1)];
    const nx = THREE.MathUtils.lerp(a[0], b[0], t);
    const ny = THREE.MathUtils.lerp(a[1], b[1], t);
    const sc = THREE.MathUtils.lerp(a[2], b[2], t);

    // Size the crystal against the shorter side, so phones and wide screens both look right.
    const unit = Math.min(viewport.width, viewport.height) / 5.2;
    target.current.set((nx * viewport.width) / 2, (ny * viewport.height) / 2, 0);

    const g = crystal.current;
    if (g) {
      const ease = reduced ? 1 : 1 - Math.exp(-dt * 3);
      g.position.lerp(target.current, ease);
      const s = THREE.MathUtils.lerp(g.scale.x, sc * unit, ease);
      g.scale.setScalar(s);

      // Spin speeds up with scroll velocity, then settles.
      const v = Math.min(4, Math.abs(scrollY - lastScroll.current) * 0.02);
      lastScroll.current = scrollY;
      if (!reduced) spin.current += dt * (0.18 + v);
      g.rotation.y = spin.current;
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, live.ndc.y * 0.35 + 0.2, 0.05);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -live.ndc.x * 0.25, 0.05);
    }
    if (core.current && !reduced) core.current.rotation.y -= dt * 0.35;

    // Shards drift with a depth-based parallax.
    if (shards.current) {
      shards.current.children.forEach((m, j) => {
        const d = shardData[j];
        // Deeper shards move less. Positions wrap so the field never runs out.
        const y = d.y + scrollY * 0.0016 * (1 - d.z * 0.25);
        m.position.y = ((((y + 6) % 12) + 12) % 12) - 6;
        if (!reduced) {
          m.rotation.x += dt * 0.2;
          m.rotation.y += dt * 0.15;
        }
      });
    }

    // A light camera parallax on the pointer.
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, live.ndc.x * 0.25, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, live.ndc.y * 0.15, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#d9d7d2']} />
        <Lightformer form="rect" intensity={3} position={[0, 4, -6]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#cfd8ff" />
        <Lightformer form="ring" intensity={3} position={[0, 0, 6]} scale={3} color="#ffe6c7" />
      </Environment>

      <group ref={crystal}>
        {/* Faceted glass: reflective, slightly iridescent and see-through, so the
            latent points inside show. Real transmission blows out on many GPUs, so it is not used. */}
        <mesh geometry={geometry} renderOrder={2}>
          <meshPhysicalMaterial
            color="#eef1ff"
            roughness={0.04}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            iridescence={0.9}
            iridescenceIOR={1.3}
            iridescenceThicknessRange={[200, 700]}
            envMapIntensity={1.6}
            transparent
            opacity={0.62}
            depthWrite={false}
            flatShading
          />
        </mesh>
        <lineSegments geometry={edges} renderOrder={3}>
          <lineBasicMaterial color="#111114" transparent opacity={0.18} />
        </lineSegments>
        <points ref={core} geometry={points}>
          <pointsMaterial size={0.045} color="#184ED6" sizeAttenuation transparent opacity={0.9} depthWrite={false} />
        </points>
      </group>

      <group ref={shards}>
        {shardData.map((d, j) => (
          <mesh key={j} position={[d.x, d.y, d.z]} rotation={[d.r, d.r * 0.6, 0]} scale={d.s}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#f7f7f8" roughness={0.18} metalness={0.05} flatShading envMapIntensity={1.2} />
          </mesh>
        ))}
      </group>
    </>
  );
}
