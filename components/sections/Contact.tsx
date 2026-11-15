'use client';

// Layer 5. A contact form for a static site. There is no server, so submitting opens
// the visitor's mail app with the message already written.
import { useState, type FormEvent } from 'react';
import { profile } from '@/data/profile';
import SectionLabel from '../ui/SectionLabel';

const NODES = [
  { label: 'email', href: `mailto:${profile.email}`, external: false },
  { label: 'linkedin', href: profile.linkedin, external: true },
  { label: 'github', href: profile.github, external: true },
  { label: 'resume', href: profile.resume, external: false },
];

export default function Contact() {
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(`Hiring: ${role || 'opportunity'}`)}&body=${encodeURIComponent(message)}`;

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.location.href = mailto;
    setSent(true);
  }

  return (
    <section id="contact" data-layer="5" className="relative flex min-h-screen items-center px-4 py-28 md:px-8">
      <div className="w-full max-w-4xl">
        <SectionLabel n={5} wake="Contact" train="inference endpoint" />
        <h2 className="mega mt-6 text-[clamp(3.5rem,12vw,11rem)] text-ink">
          Let&apos;s <span className="serif text-signal">talk</span>.
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-dim">{profile.status}. Tell me what you are building.</p>

        <div className="glass mt-8 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line/10 px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-loss/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-output/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-signal/70" />
            <span className="ml-3 font-mono text-[11px] text-dim">zsh · paresh</span>
          </div>

          <form onSubmit={submit} className="space-y-5 p-5 font-mono text-sm">
            <pre className="whitespace-pre-wrap text-dim">{`$ mail -s "hiring" ${profile.email} \\
    < message.txt`}</pre>

            <label className="block">
              <span className="text-dim">role:</span>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                maxLength={200}
                placeholder="ML engineer, analytics lead…"
                className="mt-1 w-full rounded bg-void px-3 py-2 text-ink outline-none ring-1 ring-line/15 focus:ring-signal"
              />
            </label>

            <label className="block">
              <span className="text-dim">message:</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={4000}
                rows={4}
                placeholder="What are you building?"
                className="mt-1 w-full rounded bg-void px-3 py-2 text-ink outline-none ring-1 ring-line/15 focus:ring-signal"
              />
            </label>

            <button
              type="submit"
              className="glass-chip px-5 py-2.5 text-signal hover:bg-signal/10 disabled:opacity-50"
            >
              OPEN MAIL
            </button>

            <p aria-live="polite" className="min-h-[1.5rem] text-xs text-dim">
              {sent && (
                <>
                  Your mail app should open with the message filled in. If it didn&apos;t, email{' '}
                  <a href={`mailto:${profile.email}`} className="text-signal hover:underline">
                    {profile.email}
                  </a>{' '}
                  directly.
                </>
              )}
            </p>
          </form>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {NODES.map((n) => (
            <li key={n.label}>
              <a
                href={n.href}
                {...(n.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                {...(n.label === 'resume' ? { download: true } : {})}
                className="glass-chip flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink hover:text-signal"
              >
                <span className="node-dot" aria-hidden />
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
