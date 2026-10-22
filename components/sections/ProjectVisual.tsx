'use client';

// The four 2D diagrams for the project detail panel. Each one is illustrative,
// and each caption says so. Randomness is seeded so server and client render the same markup.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Project } from '@/data/projects';

type Kind = Project['visual'];

export default function ProjectVisual({ kind, satellites }: { kind: Kind; satellites: string[] }) {
  return (
    <figure className="glass-chip p-4">
      <figcaption className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-dim">
        <span>{CAPTION[kind]}</span>
        <span className="text-signal">illustrative</span>
      </figcaption>
      {kind === 'sparsity' && <Sparsity />}
      {kind === 'spectrogram' && <Spectrogram />}
      {kind === 'embedding' && <Embedding />}
      {kind === 'graph' && <Graph />}
      {satellites.length > 0 && (
        <p className="mt-3 font-mono text-[10px] text-dim">related: {satellites.join(' · ')}</p>
      )}
    </figure>
  );
}

const CAPTION: Record<Kind, string> = {
  sparsity: 'architecture · sparsity',
  spectrogram: 'input · spectrogram',
  embedding: 'embedding space',
  graph: 'knowledge graph',
};

// Small seeded PRNG (mulberry32), so the diagrams look the same on every render.
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 1. Sparsity: units switch off as the slider moves. Output stays on.
function Sparsity() {
  const [sparsity, setSparsity] = useState(0.4);
  const layers = [6, 8, 8, 4];
  const W = 320;
  const H = 180;

  const nodes = useMemo(
    () =>
      layers.map((n, li) =>
        Array.from({ length: n }, (_, ni) => ({
          x: 24 + (li * (W - 48)) / (layers.length - 1),
          y: 16 + ((ni + 0.5) * (H - 32)) / n,
          // Fixed threshold per unit. Units with a low threshold switch off first.
          t: ((ni * 0.618 + li * 0.37) % 1) * 0.9,
        })),
      ),
    [],
  );

  const isOn = (li: number, ni: number) => li === layers.length - 1 || nodes[li][ni].t >= sparsity;
  const active = nodes.reduce((sum, layer, li) => sum + layer.filter((_, ni) => isOn(li, ni)).length, 0);
  const total = layers.reduce((a, b) => a + b, 0);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Network with ${Math.round(sparsity * 100)}% sparsity`}>
        {nodes.slice(0, -1).map((layer, li) =>
          layer.flatMap((a, ai) =>
            nodes[li + 1].map((b, bi) => {
              const on = isOn(li, ai) && isOn(li + 1, bi);
              return (
                <line
                  key={`${li}-${ai}-${bi}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={on ? '#00F0FF' : '#6B7689'}
                  strokeOpacity={on ? 0.35 : 0.06}
                  strokeWidth={0.6}
                />
              );
            }),
          ),
        )}
        {nodes.map((layer, li) =>
          layer.map((n, ni) => {
            const on = isOn(li, ni);
            const last = li === layers.length - 1;
            return (
              <circle
                key={`${li}-${ni}`}
                cx={n.x}
                cy={n.y}
                r={5}
                fill={on ? (last ? '#FFB800' : '#00F0FF') : 'none'}
                stroke={on ? 'none' : '#6B7689'}
                strokeOpacity={0.5}
                style={{ transition: 'fill 200ms, opacity 200ms', filter: on ? 'drop-shadow(0 0 4px currentColor)' : 'none' }}
              />
            );
          }),
        )}
      </svg>

      <label className="mt-4 block font-mono text-[11px] text-dim">
        sparsity <span className="text-loss">{Math.round(sparsity * 100)}%</span>
        <input
          type="range"
          min={0}
          max={90}
          value={Math.round(sparsity * 100)}
          onChange={(e) => setSparsity(Number(e.target.value) / 100)}
          className="mt-2 w-full accent-[#FF2E88]"
        />
      </label>
      <p className="font-mono text-[11px] text-dim">
        units active: <span className="text-signal">{active}</span> / {total}
      </p>
    </div>
  );
}

// 2. Spectrogram: a waterfall. It runs on the microphone when allowed, or on a demo signal.
function Spectrogram() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [source, setSource] = useState<'demo' | 'mic'>('demo');
  const [note, setNote] = useState('demo signal');

  useEffect(() => {
    const cvs = canvas.current;
    const ctx = cvs?.getContext('2d');
    if (!cvs || !ctx) return;

    let raf = 0;
    let stream: MediaStream | null = null;
    let audio: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let cancelled = false;

    if (source === 'mic') {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((st) => {
          if (cancelled) {
            st.getTracks().forEach((t) => t.stop());
            return;
          }
          stream = st;
          audio = new AudioContext();
          analyser = audio.createAnalyser();
          analyser.fftSize = 256;
          audio.createMediaStreamSource(st).connect(analyser);
          setNote('live microphone');
        })
        .catch(() => {
          setNote('mic unavailable, demo signal');
          setSource('demo');
        });
    }

    const bins = 64;
    const buf = new Uint8Array(128);
    const draw = (time: number) => {
      const w = cvs.width;
      const h = cvs.height;
      ctx.drawImage(cvs, -2, 0); // scroll the waterfall left by 2px
      for (let b = 0; b < bins; b++) {
        let v: number;
        if (analyser) {
          analyser.getByteFrequencyData(buf);
          v = buf[Math.floor((b / bins) * buf.length)] / 255;
        } else {
          const centre = 30 + 14 * Math.sin(time * 0.6);
          v = Math.max(0, 0.9 * Math.exp(-((b - centre) ** 2) / 40) + 0.12 * Math.random());
        }
        ctx.fillStyle = colour(v);
        ctx.fillRect(w - 2, h - ((b + 1) * h) / bins, 2, h / bins + 1);
      }
      raf = requestAnimationFrame(draw);
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      ctx.fillStyle = '#05060A';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      audio?.close();
    };
  }, [source]);

  return (
    <div>
      <canvas ref={canvas} width={320} height={120} className="h-auto w-full rounded bg-void" aria-label="Live spectrogram" role="img" />
      <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[11px] text-dim">
        <span>{note}</span>
        {source === 'demo' && (
          <button type="button" onClick={() => setSource('mic')} className="text-signal hover:underline">
            use microphone
          </button>
        )}
      </div>
    </div>
  );
}

// Void → cyan → amber, the palette the site uses for signal and output.
function colour(v: number) {
  const x = Math.min(1, Math.max(0, v));
  const mix = (a: number[], b: number[], t: number) => a.map((c, i) => Math.round(c + (b[i] - c) * t));
  const [r, g, b] = x < 0.6 ? mix([5, 6, 10], [0, 240, 255], x / 0.6) : mix([0, 240, 255], [255, 184, 0], (x - 0.6) / 0.4);
  return `rgb(${r},${g},${b})`;
}

// 3. Embedding space: sentences cluster by moral foundation. Points are synthetic.
const FOUNDATIONS = [
  { name: 'care', color: '#00F0FF' },
  { name: 'fairness', color: '#FFB800' },
  { name: 'loyalty', color: '#FF2E88' },
  { name: 'authority', color: '#C9D3E0' },
  { name: 'purity', color: '#6B7689' },
];

function Embedding() {
  const points = useMemo(() => {
    const r = rng(7);
    const centres = FOUNDATIONS.map((_, i) => ({
      x: 60 + (i % 3) * 100 + (i > 2 ? 50 : 0),
      y: 50 + Math.floor(i / 3) * 90 + (i % 2) * 20,
    }));
    return FOUNDATIONS.flatMap((f, ci) =>
      Array.from({ length: 22 }, () => {
        const a = r() * Math.PI * 2;
        const d = r() * 24;
        return { x: centres[ci].x + Math.cos(a) * d, y: centres[ci].y + Math.sin(a) * d, c: f.color };
      }),
    );
  }, []);

  return (
    <div>
      <svg viewBox="0 0 320 180" className="w-full" role="img" aria-label="Sentence embeddings clustered by moral foundation">
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.4} fill={p.c} fillOpacity={0.85} />
        ))}
      </svg>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px]">
        {FOUNDATIONS.map((f) => (
          <span key={f.name} style={{ color: f.color }}>
            ● {f.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// 4. Knowledge graph: concepts linked by prerequisite. The layout is computed once, deterministically.
const NODES = ['Number sense', 'Fractions', 'Ratios', 'Reading', 'Vocabulary', 'Writing', 'Science', 'Curiosity', 'Feedback', 'Reflection'];
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 6], [3, 4], [4, 5], [5, 9], [6, 7], [7, 8], [8, 9], [0, 6], [3, 6]];

function Graph() {
  const pos = useMemo(() => {
    const p = NODES.map((_, i) => ({ x: 160 + Math.cos(i * 2.4) * 90, y: 90 + Math.sin(i * 2.4) * 60 }));
    for (let it = 0; it < 220; it++) {
      const f = NODES.map(() => ({ x: 0, y: 0 }));
      for (let a = 0; a < NODES.length; a++)
        for (let b = a + 1; b < NODES.length; b++) {
          const dx = p[a].x - p[b].x;
          const dy = p[a].y - p[b].y;
          const d2 = Math.max(25, dx * dx + dy * dy);
          const k = 900 / d2;
          f[a].x += dx * k;
          f[a].y += dy * k;
          f[b].x -= dx * k;
          f[b].y -= dy * k;
        }
      for (const [a, b] of EDGES) {
        const dx = p[b].x - p[a].x;
        const dy = p[b].y - p[a].y;
        f[a].x += dx * 0.02;
        f[a].y += dy * 0.02;
        f[b].x -= dx * 0.02;
        f[b].y -= dy * 0.02;
      }
      p.forEach((n, i) => {
        n.x = Math.min(300, Math.max(20, n.x + f[i].x * 0.5 + (160 - n.x) * 0.01));
        n.y = Math.min(160, Math.max(20, n.y + f[i].y * 0.5 + (90 - n.y) * 0.01));
      });
    }
    return p;
  }, []);

  return (
    <svg viewBox="0 0 320 180" className="w-full" role="img" aria-label="Knowledge graph of curriculum concepts">
      {EDGES.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} stroke="#00F0FF" strokeOpacity={0.35} />
      ))}
      {pos.map((n, i) => (
        <g key={NODES[i]}>
          <circle cx={n.x} cy={n.y} r={5} fill="#FFB800" style={{ filter: 'drop-shadow(0 0 4px #FFB800)' }} />
          <text x={n.x + 8} y={n.y + 3} fontSize={8} fill="#C9D3E0" fontFamily="monospace">
            {NODES[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
