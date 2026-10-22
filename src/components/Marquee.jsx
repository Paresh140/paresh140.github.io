import * as React from "react"

const words = [`Machine learning`, `Deep learning`, `Transformers`, `Data engineering`, `Analytics`, `Research`, `Python`, `PyTorch`, `Spark`]

export default function Marquee() {
  const row = [...words, ...words]
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black/40 py-6" aria-hidden="true">
      <div className="marquee-track flex w-max items-center">
        {row.map((w, i) => (
          <span key={`${w}-${i}`} className="flex items-center font-display text-[clamp(24px,2.8vw,40px)] font-bold uppercase tracking-tight text-white/85">
            {w}
            <span className="mx-10 h-3 w-3 rotate-45 bg-ember" />
          </span>
        ))}
      </div>
    </div>
  )
}
