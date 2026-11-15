import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Every colour is a token from app/globals.css, so Wake and Train share one class list.
        void: 'rgb(var(--void) / <alpha-value>)',
        signal: 'rgb(var(--signal) / <alpha-value>)', // data
        loss: 'rgb(var(--loss) / <alpha-value>)', // error / learning
        output: 'rgb(var(--output) / <alpha-value>)', // results
        ink: 'rgb(var(--ink) / <alpha-value>)',
        dim: 'rgb(var(--dim) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
