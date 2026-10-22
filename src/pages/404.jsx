import * as React from "react"

const NotFound = () => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
    <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-ember">404</p>
    <h1 className="font-display text-[clamp(56px,10vw,140px)] font-extrabold leading-none tracking-[-0.04em] text-white">Nothing here.</h1>
    <a href="/" className="rounded-full bg-white px-7 py-4 text-[15px] font-semibold text-black transition hover:bg-ember">
      Back home
    </a>
  </main>
)

export const Head = () => <title>Not found · Paresh Subedi</title>

export default NotFound
