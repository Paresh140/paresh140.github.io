// Everything about you that is not a project, role or skill lives here.
// Edit freely: every section reads from these files.

export const profile = {
  name: 'Paresh Subedi',
  headline: 'I turn noisy data into decisions.',
  status: 'Open to Data & Analytics, ML Engineering and AI Systems roles',
  location: 'Queens, NY',
  site: 'pareshsubedi.com.np', // shown in the contact curl example
  email: 'pareshsubediusa@gmail.com',
  linkedin: 'https://www.linkedin.com/in/paresh-subedi/',
  github: 'https://github.com/Paresh140',
  resume: '/Paresh-Subedi-Resume.pdf',
  // Shown in the About model card. Keep it short: it is the "training data" line.
  trainingData:
    'M.S. Data Science (Fordham), research in efficient Transformers, two years of ERP and analytics operations',
  intendedUse: 'Analytics, ML engineering, AI product',
  limitations: 'will over-engineer a dashboard if left unsupervised',
  bio:
    'Graduate Research Assistant at Fordham University, researching neuroscience-inspired ways to make Transformer-based LLMs faster and more energy-efficient through inhibitory mechanisms and sparse activation. Before that, two years at Genpact in Bangalore managing SAP ERP accounts and building the Tableau reporting behind them.',
};

// Headline numbers. Each one animates in as a live metric.
export const stats = [
  { value: 85, suffix: '%', label: 'Validation accuracy', note: 'CNN ensemble on HAM10000' },
  { value: 1.3, suffix: 'M', decimals: 1, label: 'Rows engineered', note: 'A decade of daily S&P 500 data' },
  { value: 10, suffix: '%', label: 'Top of cohort', note: 'Merit scholarship, Jain University' },
];
