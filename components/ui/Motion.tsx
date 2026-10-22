'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

// Framer Motion follows the OS "reduce motion" setting on every animation.
export default function Motion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
