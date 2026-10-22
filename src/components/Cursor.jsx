import * as React from "react"

// A small dot with a trailing ring. Fine pointers only, so touch screens are untouched.
export default function Cursor() {
  const dot = React.useRef(null)
  const ring = React.useRef(null)

  React.useEffect(() => {
    if (!window.matchMedia(`(pointer: fine)`).matches) return
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf
    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (dot.current) dot.current.style.opacity = `1`
      if (ring.current) ring.current.style.opacity = `1`
    }
    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener(`pointermove`, onMove, { passive: true })
    loop()
    return () => {
      window.removeEventListener(`pointermove`, onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 opacity-0 transition-[opacity] duration-300 [@media(pointer:fine)]:block"
        style={{ mixBlendMode: `difference` }}
      />
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[71] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 [@media(pointer:fine)]:block"
      />
    </>
  )
}
