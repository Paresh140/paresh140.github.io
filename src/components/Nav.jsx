import * as React from "react"
import { profile } from "../data/profile"

const links = [
  [`#about`, `About`],
  [`#experience`, `Experience`],
  [`#work`, `Work`],
  [`#skills`, `Skills`],
  [`#contact`, `Contact`],
]

export default function Nav() {
  const [scrolled, setScrolled] = React.useState(false)
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener(`scroll`, onScroll, { passive: true })
    return () => window.removeEventListener(`scroll`, onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`glass flex w-full max-w-5xl items-center justify-between gap-6 rounded-full py-2.5 pl-5 pr-2.5 transition-all duration-500 ${
          scrolled ? `bg-black/60 shadow-2xl shadow-black/50` : `bg-transparent`
        }`}
        aria-label="Primary"
      >
        <a href="#top" className="font-display text-[15px] font-bold tracking-tight text-white">
          {profile.first}
          <span className="text-ember">.</span>
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={href} className="text-[13px] text-white/60 transition hover:text-white">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={profile.resume}
          download
          className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black transition hover:bg-ember"
        >
          Resume ↓
        </a>
      </nav>
    </header>
  )
}
