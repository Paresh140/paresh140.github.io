// The Embedding Galaxy. Each project becomes one glowing cluster.
//
// PLACEHOLDERS: `metric` values and `links` are stand-ins. Replace them with
// real numbers and URLs before deploying. Anything marked PLACEHOLDER is
// shown in the UI exactly as written, so it cannot be mistaken for a real claim.

export type Cluster = 'signal' | 'loss' | 'output';

export type Project = {
  id: string;
  title: string;
  short: string;
  cluster: Cluster; // colour meaning: signal = data, loss = learning, output = result
  problem: string;
  approach: string;
  metric: { label: string; value: number; suffix?: string; decimals?: number };
  stack: string[];
  github: string;
  demo?: string;
  // Which 2D diagram the detail panel draws. See components/sections/ProjectVisual.tsx
  visual: 'sparsity' | 'spectrogram' | 'embedding' | 'graph';
  // Position inside the galaxy (world units, relative to the cluster origin).
  position: [number, number, number];
  // Related skills drawn as small satellite points.
  satellites: string[];
};

export const projects: Project[] = [
  {
    id: 'llm-inference',
    title: 'Efficient LLM Inference Research',
    short: 'Neuroscience-inspired sparsity for Transformers',
    cluster: 'loss',
    problem:
      'Transformer inference spends most of its compute on activations that barely matter for the output. Every token pays for neurons that stay silent.',
    approach:
      'Borrow inhibitory mechanisms from neuroscience and enforce sparse activation so that most units switch off per token. Measure accuracy, latency and energy as sparsity increases.',
    metric: { label: 'PLACEHOLDER: computations saved per token', value: 0, suffix: '%' },
    stack: ['PyTorch', 'Transformers', 'CUDA profiling', 'Research'],
    github: 'https://github.com/Paresh140',
    visual: 'sparsity',
    position: [-3.2, 1.6, 0.4],
    satellites: ['PyTorch', 'Transformers'],
  },
  {
    id: 'voice-distress',
    title: 'Voice Distress Detection + Counselor Agent',
    short: 'Deep learning on audio, with an agent that responds',
    cluster: 'signal',
    problem:
      'Distress often shows in how someone speaks before it shows in what they say. Most text-only tools miss it.',
    approach:
      'Train a deep model on audio spectrograms to flag distress signals, then route flagged conversations to a counselor agent that asks grounded follow-up questions.',
    metric: { label: 'PLACEHOLDER: detection F1', value: 0, decimals: 2 },
    stack: ['Audio DL', 'Spectrograms', 'LLM agents', 'Python'],
    github: 'https://github.com/Paresh140',
    visual: 'spectrogram',
    position: [3.0, 2.2, -0.6],
    satellites: ['Deep Learning', 'LLMs & Agents'],
  },
  {
    id: 'moral-nlp',
    title: 'Moral Reasoning NLP',
    short: 'Embeddings that cluster by moral foundation',
    cluster: 'output',
    problem:
      'Moral language is subtle and split across competing frameworks. Simple sentiment labels flatten it.',
    approach:
      'Run sentence embeddings over the Moral Integrity Corpus and analyse how they cluster by moral foundation, comparing the geometry against the annotated labels.',
    metric: { label: 'PLACEHOLDER: clustering agreement', value: 0, suffix: '%' },
    stack: ['NLP', 'Embeddings', 'Moral Integrity Corpus', 'scikit-learn'],
    github: 'https://github.com/Paresh140',
    visual: 'embedding',
    position: [-0.4, -3.2, 0.9],
    satellites: ['NLP', 'Data Viz'],
  },
  {
    id: 'child-mentor',
    title: 'Child Mentor AI',
    short: 'Grounded tutoring over a knowledge graph',
    cluster: 'signal',
    problem:
      'A tutor model that improvises facts is worse than no tutor. Answers for children need to be traceable.',
    approach:
      'Ground every response in a knowledge graph of curriculum concepts, so the agent can only explain what it can link back to a node and its prerequisites.',
    metric: { label: 'PLACEHOLDER: grounded answer rate', value: 0, suffix: '%' },
    stack: ['Knowledge graphs', 'RAG', 'LLM agents', 'Python'],
    github: 'https://github.com/Paresh140',
    visual: 'graph',
    position: [3.6, -2.6, -1.2],
    satellites: ['LLMs & Agents', 'Systems Architecture'],
  },
];
