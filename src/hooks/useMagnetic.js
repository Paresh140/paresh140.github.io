import * as React from "react"

// Pulls an element toward the pointer while it hovers, then springs back
export function useMagnetic(strength = 0.3) {
  const ref = React.useRef(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia(`(hover: none)`).matches) return
    const move = (e) => {
      const r = node.getBoundingClientRect()
      const x = e.clientX - (r.left + r.width / 2)
      const y = e.clientY - (r.top + r.height / 2)
      node.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`
    }
    const leave = () => {
      node.style.transform = `translate3d(0,0,0)`
    }
    node.addEventListener(`pointermove`, move)
    node.addEventListener(`pointerleave`, leave)
    return () => {
      node.removeEventListener(`pointermove`, move)
      node.removeEventListener(`pointerleave`, leave)
    }
  }, [strength])

  return ref
}
