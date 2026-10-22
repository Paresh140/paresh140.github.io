import * as React from "react"
import gsap from "gsap"
import { useReveal } from "../hooks/useReveal"

// Counts up from zero when it scrolls into view
export default function Counter({ value, suffix = ``, decimals = 0, className = `` }) {
  const ref = useReveal(0.5)
  const [display, setDisplay] = React.useState(`0${suffix}`)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const obj = { v: 0 }
    let tween
    const start = () => {
      tween = gsap.to(obj, {
        v: value,
        duration: 2,
        ease: `power3.out`,
        onUpdate: () => setDisplay(`${obj.v.toFixed(decimals)}${suffix}`),
      })
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          start()
          io.disconnect()
        }
      },
      { threshold: 0.6 }
    )
    io.observe(node)
    return () => {
      io.disconnect()
      if (tween) tween.kill()
    }
  }, [value, suffix, decimals, ref])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  )
}
