'use client';

// Ambient latent dust across the whole stack, so the space between sections never reads as empty.
import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import vert from '@/shaders/field.vert.glsl';
import frag from '@/shaders/field.frag.glsl';
import { SECTION_SPACING, SECTION_COUNT } from '@/lib/curve';

const COUNT = 1600;

export default function Field({ reduced }: { reduced: boolean }) {
  const geometry = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    const depth = (SECTION_COUNT - 1) * SECTION_SPACING + 30;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = 10 - Math.random() * depth;
      pos[i * 3 + 2] = -12 + Math.random() * 18;
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uColor: { value: new THREE.Color('#00F0FF') },
          uOpacity: { value: 0.45 },
        },
      }),
    [],
  );

  useFrame((state, dt) => {
    material.uniforms.uTime.value += reduced ? 0 : dt;
    material.uniforms.uPixelRatio.value = state.viewport.dpr;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
