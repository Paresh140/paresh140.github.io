import * as React from "react"
import { experience } from "../data/profile"
import { useReveal } from "../hooks/useReveal"
import Reveal from "./Reveal"

function Role({ job, index }) {
  const ref = useReveal(0.25)
  return (
    <div ref={ref} className="reveal group grid gap-6 border-t border-white/10 py-12 md:grid-cols-[220px_1fr] md:gap-16" style={{ "--delay": `${index * 150}ms` }}>
      <div>
        <p className="font-mono text-[13px] text-white/40">{job.period}</p>
        <p className="mt-2 font-mono text-[12px] text-white/30">{job.place}</p>
      </div>
      <div>
        <h3 className="font-display text-[clamp(22px,2.2vw,30px)] font-bold tracking-tight text-white transition group-hover:text-ember">
          {job.role}
        </h3>
        <p className="mt-2 text-[17px] text-cyan">{job.org}</p>
        <ul className="mt-6 space-y-3 text-[16px] leading-relaxed text-white/60">
          {job.points.map((p) => (
            <li key={p} className="flex gap-4">
              <span className="mt-3 h-px w-5 shrink-0 bg-ember" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="relative px-5 py-32 md:px-12 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-ember">02 — Experience</p>
          <h2 className="mt-6 font-display text-[clamp(32px,3.9vw,58px)] font-bold leading-[0.95] tracking-[-0.035em] text-white">
            Where I've been <span className="text-white/30">building</span>
          </h2>
        </Reveal>
        <div className="mt-20">
          {experience.map((job, i) => (
            <Role key={job.org} job={job} index={i} />
          ))}
          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  )
}
