'use client';

// About: a slowly turning wireframe network behind the model card. Each node
// pulses as a wave runs from input to output.
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LAYER, sectionY } from '@/lib/curve';

const LAYERS = [4, 7, 7, 5, 3];
const GAP_X = 2.4;
const GAP_Y = 0.85;
const Y = sectionY(LAYER.about);

type Node = { pos: THREE.Vector3; layer: number; index: number };

export default function Neural3D({ reduced }: { reduced: boolean }) {
  const nodes = useMemo<Node[]>(() => {
    const out: Node[] = [];
    LAYERS.forEach((n, li) => {
      for (let ni = 0; ni < n; ni++) {
        out.push({
          layer: li,
          index: ni,
          pos: new THREE.Vector3((li - (LAYERS.length - 1) / 2) * GAP_X, (ni - (n - 1) / 2) * GAP_Y, 0),
        });
      }
    });
    return out;
  }, []);

  const edges = useMemo(() => {
    const pts: number[] = [];
    nodes.forEach((a) => {
      nodes.forEach((b) => {
        if (b.layer === a.layer + 1) pts.push(a.pos.x, a.pos.y, a.pos.z, b.pos.x, b.pos.y, b.pos.z);
      });
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const mat = new THREE.LineBasicMaterial({ color: '#00F0FF', transparent: true, opacity: 0.12 });
    return new THREE.LineSegments(geo, mat);
  }, [nodes]);

  const group = useRef<THREE.Group>(null);
  const meshes = useRef<THREE.Mesh[]>([]);
  const cyan = useMemo(() => new THREE.Color('#00F0FF'), []);
  const amber = useMemo(() => new THREE.Color('#FFB800'), []);
  const tmp = useMemo(() => new THREE.Color(), []);
  const clock = useRef(0);

  useFrame((_, dt) => {
    if (!reduced) clock.current += dt;
    const t = clock.current;

    if (group.current) group.current.rotation.y = reduced ? 0.35 : 0.35 + Math.sin(t * 0.15) * 0.3;

    nodes.forEach((n, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      // A wave runs from input to output, so the net looks like it is thinking.
      const wave = reduced ? 0.4 : 0.5 + 0.5 * Math.sin(t * 2.2 - n.layer * 0.9 + n.index * 0.3);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.color.copy(tmp.copy(cyan).lerp(amber, wave * 0.8));
      mesh.scale.setScalar(1 + wave * 0.6);
    });
  });

  return (
    <group ref={group} position={[0, Y, -4]} scale={1.1}>
      <primitive object={edges} />
      {nodes.map((n, i) => (
        <mesh
          key={`${n.layer}-${n.index}`}
          position={n.pos}
          ref={(el) => {
            if (el) meshes.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
      ))}
    </group>
  );
}
