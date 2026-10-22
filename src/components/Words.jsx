import * as React from "react"
import { useReveal } from "../hooks/useReveal"

// Splits a sentence into words that rise into place as the block scrolls in
export default function Words({ text, className = ``, step = 40 }) {
  const ref = useReveal(0.4)
  return (
    <p ref={ref} className={className}>
      {text.split(` `).map((w, i) => (
        <span key={`${w}-${i}`} className="word" style={{ "--delay": `${i * step}ms`, marginRight: `0.25em` }}>
          {w}
        </span>
      ))}
    </p>
  )
}
