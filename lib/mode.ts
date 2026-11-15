'use client';
// Switching between Wake and Train. The choice is remembered per browser, and
// the <html data-mode> attribute drives the colour tokens in globals.css.
import { useStore, type Mode } from './store';
import { MODE_KEY } from './mode-boot';

export function readStoredMode(): Mode {
  try {
    return localStorage.getItem(MODE_KEY) === 'train' ? 'train' : 'wake';
  } catch {
    return 'wake';
  }
}

function apply(mode: Mode) {
  document.documentElement.dataset.mode = mode;
  useStore.getState().setMode(mode);
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch {
    /* storage can be blocked; the switch still works for this visit */
  }
}

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void | Promise<void>) => { ready: Promise<void> } };

// Flip the mode with a circular wipe that grows from (x, y), where the toggle was pressed.
export function switchMode(next: Mode, x = window.innerWidth / 2, y = window.innerHeight / 2) {
  const doc = document as ViewTransitionDoc;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!doc.startViewTransition || reduce) {
    apply(next);
    return;
  }
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  // Give React and the canvas a few frames to draw the new scene before the snapshot.
  const t = doc.startViewTransition(() => {
    apply(next);
    return new Promise<void>((done) => window.setTimeout(done, 120));
  });
  t.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 900, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {});
}
