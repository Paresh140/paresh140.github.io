import * as React from "react"
import { profile } from "../data/profile"
import { useMagnetic } from "../hooks/useMagnetic"
import Words from "./Words"
import Reveal from "./Reveal"

function Pill({ href, children, primary, download }) {
  const ref = useMagnetic(0.3)
  return (
    <a
      ref={ref}
      href={href}
      download={download}
      target={href.startsWith(`http`) ? `_blank` : undefined}
      rel={href.startsWith(`http`) ? `noreferrer noopener` : undefined}
      className={`inline-flex items-center gap-3 rounded-full px-7 py-4 text-[15px] font-semibold transition-colors duration-300 ${
        primary ? `bg-ember text-black hover:bg-white` : `glass text-white hover:bg-white/10`
      }`}
    >
      {children}
    </a>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-5 pb-10 pt-32 md:px-12 md:pt-48">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-ember/15 blur-[140px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-ember">06 — Contact</p>
        <Words
          text="Let's build something that thinks."
          className="mt-8 font-display text-[clamp(48px,7.4vw,110px)] font-extrabold leading-[0.9] tracking-[-0.05em] text-white"
          step={70}
        />

        <Reveal className="mt-16 flex flex-wrap gap-4">
          <Pill href={`mailto:${profile.email}`} primary>
            {profile.email} <span aria-hidden="true">→</span>
          </Pill>
          <Pill href={profile.phoneHref}>{profile.phone}</Pill>
          <Pill href={profile.resume} download>
            Resume (PDF) <span aria-hidden="true">↓</span>
          </Pill>
        </Reveal>

        <Reveal delay={150} className="mt-12 flex flex-wrap gap-8 text-[16px] text-white/60">
          <a href={profile.linkedin} target="_blank" rel="noreferrer noopener" className="transition hover:text-white">
            LinkedIn ↗
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer noopener" className="transition hover:text-white">
            GitHub ↗
          </a>
          <span className="text-white/35">{profile.location}</span>
        </Reveal>
      </div>

      <footer className="relative mx-auto mt-32 flex max-w-6xl flex-wrap justify-between gap-4 border-t border-white/10 pt-8 font-mono text-[12px] text-white/35">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Designed & built by hand</span>
      </footer>
    </section>
  )
}
