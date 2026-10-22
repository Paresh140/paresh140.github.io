import * as React from "react"

// Adds "is-in" to the element once it scrolls into view (or immediately if it already is)
export function useReveal(threshold = 0.2) {
  const ref = React.useRef(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      node.classList.add(`is-in`)
      return
    }
    if (!(`IntersectionObserver` in window)) {
      node.classList.add(`is-in`)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add(`is-in`)
          io.disconnect()
        }
      },
      { threshold }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [threshold])

  return ref
}
