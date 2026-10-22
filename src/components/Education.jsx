import * as React from "react"
import { education, awards } from "../data/profile"
import Reveal from "./Reveal"

export default function Education() {
  return (
    <section id="education" className="relative px-5 py-32 md:px-12 md:py-40">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
        <div>
          <Reveal>
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-ember">05 — Education</p>
            <h2 className="mt-6 font-display text-[clamp(28px,3vw,42px)] font-bold leading-[1] tracking-[-0.03em] text-white">
              Study & <span className="text-white/30">training</span>
            </h2>
          </Reveal>
          <div className="mt-12 space-y-5">
            {education.map((e, i) => (
              <Reveal key={e.school} delay={i * 120} className="glass rounded-3xl p-7">
                <p className="font-mono text-[12px] text-cyan">{e.period}</p>
                <h3 className="mt-3 font-display text-[22px] font-bold leading-snug text-white">{e.degree}</h3>
                <p className="mt-1 text-[16px] text-white/60">{e.school}</p>
                <p className="mt-4 text-[15px] text-white/45">{e.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <Reveal>
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-ember">Recognition</p>
            <h2 className="mt-6 font-display text-[clamp(28px,3vw,42px)] font-bold leading-[1] tracking-[-0.03em] text-white">
              Awards & <span className="text-white/30">honours</span>
            </h2>
          </Reveal>
          <ul className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {awards.map((a, i) => (
              <Reveal as="li" key={a.title} delay={i * 120} className="grid grid-cols-[1fr_auto] gap-6 py-7">
                <div>
                  <h3 className="font-display text-[22px] font-bold text-white">{a.title}</h3>
                  <p className="mt-1 text-[15px] text-ember">{a.org}</p>
                  <p className="mt-2 text-[15px] text-white/50">{a.detail}</p>
                </div>
                <span className="font-mono text-[12px] text-white/40">{a.year}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
