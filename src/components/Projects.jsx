import * as React from "react"
import { projects } from "../data/profile"
import Reveal from "./Reveal"

// Tilts toward the pointer in 3D and lights up under it. Writes to CSS variables, so it never re-renders.
function Card({ project }) {
  const ref = React.useRef(null)

  const onMove = (e) => {
    const node = ref.current
    if (!node) return
    const r = node.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    node.style.setProperty(`--rx`, `${((0.5 - y) * 12).toFixed(2)}deg`)
    node.style.setProperty(`--ry`, `${((x - 0.5) * 14).toFixed(2)}deg`)
    node.style.setProperty(`--mx`, `${(x * 100).toFixed(1)}%`)
    node.style.setProperty(`--my`, `${(y * 100).toFixed(1)}%`)
  }
  const onLeave = () => {
    const node = ref.current
    if (!node) return
    node.style.setProperty(`--rx`, `0deg`)
    node.style.setProperty(`--ry`, `0deg`)
  }

  return (
    <a
      ref={ref}
      href={project.href}
      target="_blank"
      rel="noreferrer noopener"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`spotlight glass group relative flex h-full flex-col overflow-hidden rounded-[28px] p-8 transition-transform duration-500 md:p-10 ${
        project.featured ? `md:col-span-2` : ``
      }`}
      style={{
        "--rx": `0deg`,
        "--ry": `0deg`,
        transform: `perspective(1100px) rotateX(var(--rx)) rotateY(var(--ry))`,
        transformStyle: `preserve-3d`,
      }}
    >
      <div className="flex items-start justify-between gap-6">
        <span className="font-display text-[clamp(44px,4.8vw,68px)] font-extrabold leading-none text-white/10 transition group-hover:text-white/20">
          {project.num}
        </span>
        <span className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-cyan">
          {project.metric}
        </span>
      </div>

      <h3
        className={`mt-auto pt-16 font-display font-bold leading-[1.1] tracking-tight text-white ${
          project.featured ? `text-[clamp(26px,2.6vw,36px)]` : `text-[clamp(20px,1.9vw,26px)]`
        }`}
      >
        {project.title}
      </h3>
      <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/55">{project.summary}</p>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <li key={t} className="rounded-full bg-white/[0.06] px-3 py-1 text-[12px] text-white/70">
              {t}
            </li>
          ))}
        </ul>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition group-hover:rotate-45 group-hover:bg-ember" aria-hidden="true">
          ↗
        </span>
      </div>
    </a>
  )
}

export default function Projects() {
  return (
    <section id="work" className="relative px-5 py-32 md:px-12 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-ember">03 — Selected work</p>
          <h2 className="mt-6 font-display text-[clamp(32px,3.9vw,58px)] font-bold leading-[0.95] tracking-[-0.035em] text-white">
            Things I've <span className="grad-text">shipped</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-5 md:grid-cols-2" style={{ perspective: `1200px` }}>
          {projects.map((p, i) => (
            <Reveal key={p.num} delay={i * 100} className={`h-full ${p.featured ? `md:col-span-2` : ``}`}>
              <Card project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
