import * as React from "react"
import Words from "./Words"
import Counter from "./Counter"
import Reveal from "./Reveal"
import { profile, stats } from "../data/profile"

export default function About() {
  return (
    <section id="about" className="relative px-5 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-ember">01 — About</p>
        <Words
          text="I work where research meets production: making large models efficient, and making data trustworthy enough to act on."
          className="mt-8 max-w-5xl font-display text-[clamp(28px,3.4vw,52px)] font-bold leading-[1.04] tracking-[-0.03em] text-white"
          step={55}
        />

        <div className="mt-20 grid gap-12 md:grid-cols-[1fr_1.2fr]">
          <Reveal as="p" className="max-w-md text-[17px] leading-relaxed text-white/60">{profile.bio}</Reveal>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="bg-ink p-8">
                <Counter
                  value={s.value}
                  suffix={s.suffix}
                  decimals={s.value % 1 ? 1 : 0}
                  className="block font-display text-[clamp(40px,4.4vw,64px)] font-extrabold leading-none tracking-tight grad-text"
                />
                <p className="mt-5 text-[14px] font-semibold text-white">{s.label}</p>
                <p className="mt-1 text-[13px] text-white/45">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
