import * as React from "react"
import { useReveal } from "../hooks/useReveal"

// Wrapper that fades and lifts its children in the first time they scroll into view
export default function Reveal({ as: Tag = `div`, delay = 0, className = ``, children, ...rest }) {
  const ref = useReveal(0.2)
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--delay": `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
