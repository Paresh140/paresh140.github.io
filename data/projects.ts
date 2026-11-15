// The Embedding Galaxy. Each project becomes one glowing cluster.
//
// `metric` and `github` are optional. Leave them out until there is a real
// number or a public repo: the card then shows its `status` instead, so no
// placeholder value ever reaches the page.

export type Cluster = 'signal' | 'loss' | 'output';

export type Project = {
  id: string;
  title: string;
  short: string;
  cluster: Cluster; // colour meaning: signal = data, loss = learning, output = result
  problem: string;
  approach: string;
  metric?: { label: string; value: number; suffix?: string; decimals?: number };
  // Shown when there is no metric yet, e.g. "Research in progress".
  status?: string;
  year: string;
  stack: string[];
  github?: string;
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
    id: 'emotion-fusion',
    title: 'Multimodal Emotion Recognition',
    short: 'Fusing speech and text with Wav2Vec 2.0 and RoBERTa',
    cluster: 'signal',
    year: '2026',
    problem:
      'Neither words nor tone carry the whole emotion. Audio-only and text-only models each miss what the other one hears.',
    approach:
      'Late fusion of a fine-tuned wav2vec2-base audio encoder and a roberta-base text encoder into one 1,536-d vector, then a small MLP head over six CREMA-D emotions, evaluated with speaker-independent 5-fold cross-validation.',
    metric: { label: 'test accuracy, +9.7 pts over audio-only', value: 69.79, suffix: '%', decimals: 1 },
    stack: ['PyTorch', 'Wav2Vec 2.0', 'RoBERTa', 'CREMA-D'],
    github: 'https://github.com/Paresh140/Multi-Modal-Emotion-Detection',
    visual: 'spectrogram',
    position: [0.2, 3.6, -1.8],
    satellites: ['Deep Learning', 'NLP'],
  },
  {
    id: 'llm-inference',
    status: 'Research in progress',
    year: '2025 — now',
    title: 'Efficient LLM Inference Research',
    short: 'Neuroscience-inspired sparsity for Transformers',
    cluster: 'loss',
    problem:
      'Transformer inference spends most of its compute on activations that barely matter for the output. Every token pays for neurons that stay silent.',
    approach:
      'Borrow inhibitory mechanisms from neuroscience and enforce sparse activation so that most units switch off per token. Measure accuracy, latency and energy as sparsity increases.',
    stack: ['PyTorch', 'Transformers', 'CUDA profiling', 'Research'],
    visual: 'sparsity',
    position: [-3.2, 1.6, 0.4],
    satellites: ['PyTorch', 'Transformers'],
  },
  {
    id: 'skin-ensemble',
    title: 'Skin Disease Detection',
    short: 'A CNN ensemble on HAM10000, best final-year project',
    cluster: 'output',
    year: '2023',
    problem:
      'Dermatology images vary in lighting, skin tone and framing, and a single network overfits to whichever quirks dominate its training set.',
    approach:
      'Transfer learning with DenseNet201, VGG16 and two Inception variants, then an ensemble over their predictions across the seven HAM10000 lesion classes.',
    metric: { label: 'validation accuracy, CNN ensemble', value: 85, suffix: '%' },
    stack: ['TensorFlow', 'Keras', 'Transfer learning', 'HAM10000'],
    github: 'https://github.com/Paresh140/PCL-Code',
    visual: 'embedding',
    position: [-3.8, -0.6, -1.4],
    satellites: ['Deep Learning', 'Python'],
  },
  {
    id: 'ticket-triage',
    title: 'AI Agent for Ticket Triage',
    short: 'CrewAI agents that score and route engineering tickets',
    cluster: 'loss',
    year: '2025',
    status: 'Shipped as a prototype',
    problem:
      'Ticket queues get triaged by whoever is free, so severity is guessed and work lands on the wrong person.',
    approach:
      'CrewAI agents score each ticket for severity, priority and effort, then assign it using developer expertise, live workload and history, with Streamlit dashboards for sprint capacity.',
    stack: ['CrewAI', 'Multi-agent', 'Streamlit', 'Python'],
    visual: 'graph',
    position: [1.6, -0.2, 1.6],
    satellites: ['LLMs & Agents', 'Data Viz'],
  },
  {
    id: 'sp500',
    title: 'S&P 500 Market Analysis',
    short: 'A decade of prices, one interactive risk dashboard',
    cluster: 'output',
    year: '2025',
    problem:
      'Sector risk is hard to see in raw prices: volatility and drawdowns hide inside a decade of daily rows.',
    approach:
      'A Python ETL (yfinance, BeautifulSoup) that scrapes live sector mappings and daily prices, then a Tableau dashboard of annualised volatility and max drawdowns across market crashes.',
    metric: { label: 'rows engineered from daily prices', value: 1.3, suffix: 'M', decimals: 1 },
    stack: ['Python', 'ETL', 'Tableau', 'yfinance'],
    visual: 'sparsity',
    position: [-1.8, 3.0, 1.2],
    satellites: ['Data Viz', 'SQL'],
  },
  {
    id: 'voice-distress',
    status: 'In development',
    year: '2026',
    title: 'Voice Distress Detection + Counselor Agent',
    short: 'Deep learning on audio, with an agent that responds',
    cluster: 'signal',
    problem:
      'Distress often shows in how someone speaks before it shows in what they say. Most text-only tools miss it.',
    approach:
      'Train a deep model on audio spectrograms to flag distress signals, then route flagged conversations to a counselor agent that asks grounded follow-up questions.',
    stack: ['Audio DL', 'Spectrograms', 'LLM agents', 'Python'],
    visual: 'spectrogram',
    position: [3.0, 2.2, -0.6],
    satellites: ['Deep Learning', 'LLMs & Agents'],
  },
  {
    id: 'moral-nlp',
    status: 'Analysis in progress',
    year: '2026',
    title: 'Moral Reasoning NLP',
    short: 'Embeddings that cluster by moral foundation',
    cluster: 'output',
    problem:
      'Moral language is subtle and split across competing frameworks. Simple sentiment labels flatten it.',
    approach:
      'Run sentence embeddings over the Moral Integrity Corpus and analyse how they cluster by moral foundation, comparing the geometry against the annotated labels.',
    stack: ['NLP', 'Embeddings', 'Moral Integrity Corpus', 'scikit-learn'],
    visual: 'embedding',
    position: [-0.4, -3.2, 0.9],
    satellites: ['NLP', 'Data Viz'],
  },
  {
    id: 'child-mentor',
    status: 'Prototype',
    year: '2026',
    title: 'Child Mentor AI',
    short: 'Grounded tutoring over a knowledge graph',
    cluster: 'signal',
    problem:
      'A tutor model that improvises facts is worse than no tutor. Answers for children need to be traceable.',
    approach:
      'Ground every response in a knowledge graph of curriculum concepts, so the agent can only explain what it can link back to a node and its prerequisites.',
    stack: ['Knowledge graphs', 'RAG', 'LLM agents', 'Python'],
    visual: 'graph',
    position: [3.6, -2.6, -1.2],
    satellites: ['LLMs & Agents', 'Systems Architecture'],
  },
];
