import * as React from "react"
import { profile } from "../data/profile"
import { useMagnetic } from "../hooks/useMagnetic"

const Magnetic = ({ children, href, download, variant = `solid` }) => {
  const ref = useMagnetic(0.35)
  const base = `inline-flex items-center gap-3 rounded-full px-7 py-4 text-[15px] font-semibold transition-colors duration-300`
  const styles =
    variant === `solid`
      ? `bg-white text-black hover:bg-ember`
      : `glass text-white hover:bg-white/10`
  return (
    <a ref={ref} href={href} download={download} className={`${base} ${styles}`} style={{ willChange: `transform` }}>
      {children}
    </a>
  )
}

// Each letter lifts in turn, so the name arrives like it's being typed onto the screen
const Letters = ({ text, startDelay = 0 }) =>
  text.split(``).map((ch, i) => (
    <span
      key={i}
      className="inline-block"
      style={{
        animation: `rise 1.1s var(--ease) both`,
        animationDelay: `${startDelay + i * 45}ms`,
      }}
    >
      {ch === ` ` ? ` ` : ch}
    </span>
  ))

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-end overflow-hidden px-5 pb-16 pt-32 md:px-12 md:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-[46rem] w-[46rem] rounded-full bg-violet/20 blur-[120px]"
        style={{ animation: `drift 16s ease-in-out infinite` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-[40rem] w-[40rem] rounded-full bg-ember/20 blur-[120px]"
        style={{ animation: `drift 20s ease-in-out infinite reverse` }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <p className="mb-8 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-white/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
          </span>
          {profile.status} · {profile.location}
        </p>

        <h1 className="font-display text-[clamp(52px,8.6vw,124px)] font-extrabold leading-[0.86] tracking-[-0.045em] text-white">
          <span className="block">
            <Letters text={profile.first} />
          </span>
          <span className="grad-text block" style={{ animation: `rise 1.1s var(--ease) 260ms both` }}>
            {profile.last}
          </span>
        </h1>

        <div className="mt-12 grid items-end gap-10 md:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="max-w-xl font-display text-[clamp(19px,1.8vw,24px)] font-semibold leading-tight text-white">
              {profile.headline}
            </p>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/55">
              M.S. Data Science, Fordham University. Research in efficient Transformer models, and applied ML, data
              engineering and analytics.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Magnetic href="#work">
              See the work <span aria-hidden="true">→</span>
            </Magnetic>
            <Magnetic href={profile.resume} download variant="ghost">
              Resume <span aria-hidden="true">↓</span>
            </Magnetic>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 md:flex"
      >
        Scroll
        <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
      </a>

      <style>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(60%) rotate(6deg); filter: blur(8px); }
          to { opacity: 1; transform: none; filter: blur(0); }
        }
      `}</style>
    </section>
  )
}
