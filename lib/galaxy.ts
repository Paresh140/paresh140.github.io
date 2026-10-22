// World-space centres of the Embedding Galaxy clusters.
import { projects } from '@/data/projects';
import { LAYER, sectionY } from './curve';

export const GALAXY_Y = sectionY(LAYER.projects);

export function galaxyCenter(id: string) {
  const p = projects.find((proj) => proj.id === id);
  if (!p) return null;
  const [x, y, z] = p.position;
  return { x, y: GALAXY_Y + y, z };
}
