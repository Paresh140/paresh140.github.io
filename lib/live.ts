// Mutable per-frame state shared between the 3D scene, the HUD and the
// hero counter. Writing here costs nothing, and nothing re-renders.
export const live = {
  progress: 0, // page scroll, 0 to 1
  heroDissolve: 0, // 0 while the name is visible, 1 once it has streamed away
  heroT: 0, // diffusion timestep, 0 (noise) to 1 (resolved)
  fps: 0,
  particles: 0,
  ndc: { x: 0, y: 0 }, // pointer in normalised device coordinates
  hoverCluster: -1,
  activeSection: 0,
};
