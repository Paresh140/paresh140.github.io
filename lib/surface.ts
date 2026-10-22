// The loss surface, in TypeScript. Mirrors shaders/terrain.vert.glsl exactly,
// so the ball rolls on the same function the shader draws.
import { skillGroups } from '@/data/skills';

export const SKILL_COUNT = skillGroups.length;

// Valley centres sit on a 3x3 grid across the terrain.
export const valleyCenters: [number, number][] = skillGroups.map((_, i) => [
  ((i % 3) - 1) * 4.2,
  (Math.floor(i / 3) - 1) * 4.2,
]);

export const strengths = skillGroups.map((g) => g.strength);

export function lossHeight(x: number, z: number): number {
  let h = 1.2 + 0.35 * Math.sin(x * 0.55) * Math.cos(z * 0.55);
  for (let i = 0; i < SKILL_COUNT; i++) {
    const [cx, cz] = valleyCenters[i];
    const dx = x - cx;
    const dz = z - cz;
    h -= strengths[i] * 2.2 * Math.exp(-(dx * dx + dz * dz) / (2 * 1.8 * 1.8));
  }
  return h;
}

// Numerical gradient. Good enough for a visual optimizer, and it keeps the
// maths honest: the ball really is descending this function.
export function lossGradient(x: number, z: number): [number, number] {
  const e = 0.001;
  const gx = (lossHeight(x + e, z) - lossHeight(x - e, z)) / (2 * e);
  const gz = (lossHeight(x, z + e) - lossHeight(x, z - e)) / (2 * e);
  return [gx, gz];
}
