import * as React from "react"
import { skills } from "../data/profile"
import Reveal from "./Reveal"

// Every skill sits on a sphere. Drag or move the pointer to turn it; it also drifts on its own.
export default function Skills() {
  const items = React.useMemo(() => skills.flatMap((s) => s.items), [])
  const n = items.length
  const R = 210
  const wrap = React.useRef(null)
  const sphere = React.useRef(null)

  const positions = React.useMemo(
    () =>
      items.map((label, i) => {
        // Fibonacci sphere: evenly spaced points on a sphere
        const y = 1 - (2 * (i + 0.5)) / n
        const r = Math.sqrt(1 - y * y)
        const theta = Math.PI * (3 - Math.sqrt(5)) * i
        return { label, x: Math.cos(theta) * r * R, y: y * R, z: Math.sin(theta) * r * R }
      }),
    [items, n]
  )

  React.useEffect(() => {
    let raf
    let rotY = 0
    let rotX = -8
    let targetX = 0
    let targetY = 0
    const onMove = (e) => {
      const node = wrap.current
      if (!node) return
      const r = node.getBoundingClientRect()
      targetY = ((e.clientX - r.left) / r.width - 0.5) * 80
      targetX = -((e.clientY - r.top) / r.height - 0.5) * 60
    }
    const loop = () => {
      rotY += 0.12
      const ry = rotY + targetY * 0.3
      const rx = rotX + targetX * 0.5
      if (sphere.current) sphere.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener(`pointermove`, onMove, { passive: true })
    loop()
    return () => {
      window.removeEventListener(`pointermove`, onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="skills" className="relative overflow-hidden px-5 py-32 md:px-12 md:py-40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-ember">04 — Toolkit</p>
          <h2 className="mt-6 font-display text-[clamp(32px,3.7vw,54px)] font-bold leading-[0.95] tracking-[-0.035em] text-white">
            The stack, <span className="text-white/30">in orbit</span>
          </h2>
          <div className="mt-10 space-y-5">
            {skills.map((s) => (
              <div key={s.group}>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">{s.group}</p>
                <p className="mt-1 text-[15px] text-white/75">{s.items.join(` · `)}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div ref={wrap} className="relative h-[460px] md:h-[560px]" style={{ perspective: `900px` }} aria-label="Skills">
          <div ref={sphere} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: `preserve-3d` }}>
            {positions.map((p) => {
              const depth = (p.z + R) / (2 * R)
              return (
                <span
                  key={p.label}
                  className="absolute whitespace-nowrap rounded-full border border-white/10 bg-black/50 px-3 py-1 font-mono text-[12px] text-white backdrop-blur"
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${p.x}px, ${p.y}px, ${p.z}px)`,
                    opacity: 0.35 + depth * 0.65,
                    color: depth > 0.7 ? `#ff9c84` : `#e6e8ef`,
                    boxShadow: depth > 0.7 ? `0 0 24px rgba(255,107,74,0.35)` : `none`,
                  }}
                >
                  {p.label}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
