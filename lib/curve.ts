// The camera's scroll path. One waypoint per section, each one a layer in the
// stack. The camera moves through them as the page scrolls.
import * as THREE from 'three';

export const SECTION_SPACING = 14;
export const SECTION_COUNT = 6; // hero, about, projects, skills, experience, contact

export const cameraPath = new THREE.CatmullRomCurve3(
  Array.from({ length: SECTION_COUNT }, (_, i) => {
    const wobble = i % 2 === 0 ? 0 : 1.6;
    return new THREE.Vector3(wobble, -i * SECTION_SPACING, 10);
  }),
  false,
  'catmullrom',
  0.5,
);

export const lookPath = new THREE.CatmullRomCurve3(
  Array.from({ length: SECTION_COUNT }, (_, i) => new THREE.Vector3(0, -i * SECTION_SPACING, 0)),
  false,
  'catmullrom',
  0.5,
);

// World-space Y for a section's layer. Section 0 is the hero, and each one below it sits one spacing lower.
export const sectionY = (i: number) => -i * SECTION_SPACING;

// Section indices, matching the order of `data-layer` attributes in app/page.tsx.
export const LAYER = { hero: 0, about: 1, projects: 2, skills: 3, experience: 4, contact: 5 } as const;
