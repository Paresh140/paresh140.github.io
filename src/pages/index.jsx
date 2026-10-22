import * as React from "react"
import Cursor from "../components/Cursor"
import Nav from "../components/Nav"
import Hero from "../components/Hero"
import Marquee from "../components/Marquee"
import About from "../components/About"
import Experience from "../components/Experience"
import Projects from "../components/Projects"
import Skills from "../components/Skills"
import Education from "../components/Education"
import Contact from "../components/Contact"
import { profile } from "../data/profile"

// WebGL only exists in the browser, so the 3D layer is loaded after the page mounts
const IndexPage = () => {
  const [Scene, setScene] = React.useState(null)

  React.useEffect(() => {
    let alive = true
    import("../components/Scene").then((m) => {
      if (alive) setScene(() => m.default)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <>
      {Scene && <Scene />}
      <Cursor />
      <Nav />
      <main id="top" className="relative z-10">
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
    </>
  )
}

export const Head = () => (
  <>
    <html lang="en" />
    <title>Paresh Subedi · Data Scientist</title>
    <meta name="description" content={profile.headline + ` ` + `M.S. Data Science candidate at Fordham University, applied ML, data engineering and analytics.`} />
    <meta name="theme-color" content="#05060a" />
    <meta property="og:title" content="Paresh Subedi · Data Scientist" />
    <meta property="og:description" content="Efficient ML research, applied AI and analytics." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
  </>
)

export default IndexPage
