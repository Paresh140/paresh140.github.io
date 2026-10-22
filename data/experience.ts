// Each entry is one "epoch" in the training log.
// `metrics` are the impact numbers that tick up when the epoch comes into view.
// Mirrors the resume; keep these in sync when the resume changes.

export type Epoch = {
  role: string;
  org: string;
  place: string;
  period: string;
  points: string[];
  metrics: { value: number; suffix?: string; label: string }[];
};

export const experience: Epoch[] = [
  {
    role: 'Graduate Research Assistant',
    org: 'Fordham University',
    place: 'New York, USA',
    period: '2025 — Present',
    points: [
      'Researching neuroscience-inspired methods to improve the energy efficiency and inference speed of Transformer-based LLMs, under faculty supervision.',
      'Exploring inhibitory mechanisms and sparse activation to cut redundant computation in large-scale neural networks.',
    ],
    metrics: [],
  },
  {
    role: 'Senior Associate',
    org: 'Genpact',
    place: 'Bangalore, India',
    period: '2023 — 2025',
    points: [
      'Onboarded and maintained customer accounts in SAP ERP systems, keeping data entry accurate and timely.',
      'Resolved account discrepancies with cross-functional teams, reducing data errors and improving customer experience.',
      'Built Tableau reports on customer account metrics that surfaced patterns improving operational efficiency.',
    ],
    metrics: [
      { value: 2, suffix: ' yrs', label: 'in production operations' },
    ],
  },
];

export const education = [
  {
    degree: 'M.S. Data Science',
    school: 'Fordham University',
    period: '2025 — Present',
    detail: 'Graduate Research Assistant and Graduate Assistantship recipient.',
  },
  {
    degree: 'B.Tech (Honours), Computer Science, Data Science',
    school: 'Jain University',
    period: '2019 — 2023',
    detail: 'Coursework in Python, data analytics, machine learning, deep learning and NLP. Best Final-Year Project in deep learning for dermatology.',
  },
];

// Loss-curve values for the margin chart. One point per epoch, descending.
export const lossCurve = [2.341, 1.787, 1.204, 0.733, 0.412, 0.19, 0.012];
