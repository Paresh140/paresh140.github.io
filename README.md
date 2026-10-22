# Latent Space

A portfolio that is shaped like a neural network's latent space. The visitor is a data point, scrolling is a forward pass, and every section is a layer that transforms what they see. One persistent WebGL canvas sits behind all the content, and the camera flies a CatmullRom spline as you scroll.

Built with Next.js 14 (App Router), TypeScript, Tailwind, React Three Fiber, drei, postprocessing, GSAP + ScrollTrigger, Lenis and Framer Motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Customise the content

Everything you'd edit lives in `data/`. No component needs touching for copy changes.

| File | What it controls |
| --- | --- |
| `data/profile.ts` | Name, headline, status line, links, bio, model-card rows, headline stats |
| `data/experience.ts` | Training-log epochs (roles, bullets, impact metrics), education checkpoints, the loss curve values |
| `data/projects.ts` | The Embedding Galaxy: one entry per project. Cluster colour, problem/approach, metric, stack, links, diagram type, satellite skills |
| `data/skills.ts` | The Loss Landscape: valley groups, their depth (`strength`, 0 to 1) and items; optimizer list |
| `data/metrics.ts` | Confusion matrix for the command palette's "show confusion matrix" |

### Placeholders to replace before you deploy

These are marked in the source and shown in the UI as written, so they can't pass for real claims:

- **Project metrics** (`data/projects.ts`): every `metric.value` is `0` and labelled `PLACEHOLDER`. Replace with real numbers.
- **Project links**: the GitHub links point at your profile. Point each one at its repo, and add `demo` where one exists.
- **Confusion matrix** (`data/metrics.ts`): illustrative values. Paste in your evaluation output.
- **Skill depths** (`data/skills.ts`): these are tuning values, not measurements. Set them to whatever feels honest.
- **Site URL**: `metadataBase` in `app/layout.tsx` and `profile.site` in `data/profile.ts` are set to `pareshsubedi.com.np`.

## Adding a project

Add an entry to `data/projects.ts`. Pick a `cluster` (`signal` for data, `loss` for learning, `output` for results) and a `position` for its cluster in the galaxy. Keep clusters apart from each other, or they will sit on top of one another in the galaxy. The `visual` field picks the detail diagram: `sparsity`, `spectrogram`, `embedding` or `graph`.

## Contact form

The site is a static export, so there is no server. Submitting the form opens the visitor's mail app with the message pre-filled, addressed to `profile.email`. To change the recipient, edit `data/profile.ts`.

## Shaders

All GLSL lives in `shaders/` as `.glsl` files, imported as raw strings (see `next.config.mjs`):

| File | Used by |
| --- | --- |
| `hero.vert.glsl`, `hero.frag.glsl` | Diffusion denoising particles (the "PARESH" word, attention, dissolve) |
| `terrain.vert.glsl`, `terrain.frag.glsl` | The loss surface. `terrain.vert.glsl` must match `lib/surface.ts` |
| `galaxy.vert.glsl`, `galaxy.frag.glsl` | Embedding galaxy clusters (hover expansion, focus dimming) |
| `field.vert.glsl`, `field.frag.glsl` | Ambient latent dust across the whole stack |

## Layout of the code

```
app/                 layout, page, global CSS, OG image
components/
  Stage.tsx          client boundary: lazy-loads the 3D scene, mounts the HUD
  scene/             the one persistent <Canvas>: camera rig, hero, galaxy, terrain, net, dust
  sections/          Hero, About, Projects, Skills, Experience, Contact (+ project detail and visuals)
  ui/                loader, nav, command palette, HUD, counters, easter eggs, smooth scroll
public/              static files; CNAME sets the custom domain
data/                all content (see above)
lib/                 stores, device capabilities, spline, loss surface maths, sampling
shaders/             GLSL
```

## How it stays fast

- **Adaptive quality.** Particle count drops from 20k to 6k on low-end devices and phones. Post-processing (bloom, chromatic aberration, grain) is off there too. `PerformanceMonitor` lowers the device pixel ratio when frames drop.
- **Mobile.** The galaxy falls back to a 2D grid of the same projects.
- **Hidden tabs.** Rendering stops when the tab is hidden.
- **Lazy loading.** The 3D scene, and each heavy piece inside it, loads on demand. Project diagrams load when a case study opens, behind a `loading tensor...` fallback.
- **Per-frame state stays out of React.** Scroll, FPS and the denoising timestep live in a mutable object (`lib/live.ts`) that the HUD reads straight from `requestAnimationFrame`. The render loop never triggers a React render.
- **Reduced motion.** Respects `prefers-reduced-motion`: the word resolves immediately, the ball and net hold still, the camera snaps, and the ambient CSS animations stop. Everything that carries information is still there.

## Accessibility

- Semantic HTML sits under the canvas. The 3D layer is `aria-hidden`, and every project and skill is reachable as plain text and buttons.
- Keyboard: `⌘K` / `Ctrl+K` opens the command palette. Escape closes panels.
- Charts and diagrams carry labels and captions. Diagrams say they are illustrative.
- Skip-to-content link and keyboard-reachable controls. Contrast has not been audited yet; run Lighthouse or axe before you ship.

## Deploy (GitHub Pages)

`.github/workflows/pages.yml` builds the static export (`out/`) and deploys it to GitHub Pages on every push to `main`. The custom domain comes from `public/CNAME`, which is copied into `out/` at build time. In the repo's Settings → Pages, set the source to **GitHub Actions**.

## Easter eggs

- `⌘K` / `Ctrl+K`: command palette (goto sections, download resume, toggle matrix mode, show confusion matrix, switch galaxy/grid)
- Konami code (↑ ↑ ↓ ↓ ← → ← → B A): overfitting mode
- Open DevTools: console message
