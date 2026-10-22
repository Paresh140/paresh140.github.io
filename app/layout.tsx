import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Motion from '@/components/ui/Motion';
import Loader from '@/components/ui/Loader';
import Nav from '@/components/ui/Nav';
import CommandPalette from '@/components/ui/CommandPalette';
import ConfusionModal from '@/components/ui/ConfusionModal';
import Easter from '@/components/ui/Easter';
import SmoothScroll from '@/components/ui/SmoothScroll';
import { profile } from '@/data/profile';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const description =
  'Data scientist and AI/ML engineer. Efficient LLM inference research, deep learning on audio, NLP and knowledge-graph agents.';

export const metadata: Metadata = {
  metadataBase: new URL('https://pareshsubedi.com.np'),
  title: `${profile.name}: Data Scientist & AI/ML Engineer`,
  description,
  openGraph: {
    title: `${profile.name}: Data Scientist & AI/ML Engineer`,
    description,
    url: 'https://pareshsubedi.com.np',
    siteName: profile.name,
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: profile.name, description },
};

export const viewport: Viewport = {
  themeColor: '#05060A',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="bg-void font-display text-ink antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Motion>
          <Loader />
          <div aria-hidden className="noise-field" />
          <div aria-hidden className="scanlines" />
          <Nav />
          <CommandPalette />
          <ConfusionModal />
          <Easter />
          <SmoothScroll />
          {children}
        </Motion>
      </body>
    </html>
  );
}
