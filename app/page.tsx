import Stage from '@/components/Stage';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Contact from '@/components/sections/Contact';
import { profile } from '@/data/profile';

// Each section is a layer. The camera flies through them in this order.
export default function Page() {
  return (
    <>
      <Stage />
      <main id="main" className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <footer className="relative z-10 px-4 pb-8 pt-4 text-center font-mono text-[11px] text-dim">
        © {new Date().getFullYear()} {profile.name} · a model you can scroll through
      </footer>
    </>
  );
}
