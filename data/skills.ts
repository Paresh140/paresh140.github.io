// The Loss Landscape. Each group is a valley. `strength` (0 to 1) sets its depth:
// deeper valley = stronger skill. Strengths are placeholders: tune them to taste.

export type SkillGroup = {
  id: string;
  name: string;
  strength: number;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  { id: 'python', name: 'Python', strength: 0.95, items: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn'] },
  { id: 'sql', name: 'SQL', strength: 0.85, items: ['SQL', 'NoSQL', 'Tableau', 'Power BI'] },
  { id: 'ml', name: 'ML', strength: 0.85, items: ['Scikit-learn', 'XGBoost', 'Feature engineering'] },
  { id: 'deep-learning', name: 'Deep Learning', strength: 0.8, items: ['PyTorch', 'TensorFlow', 'Keras', 'CNN ensembles'] },
  { id: 'nlp', name: 'NLP', strength: 0.7, items: ['Hugging Face', 'Embeddings', 'Moral Integrity Corpus'] },
  { id: 'llms', name: 'LLMs & Agents', strength: 0.75, items: ['CrewAI', 'Multi-agent systems', 'RAG', 'Transformers'] },
  { id: 'cloud-mlops', name: 'Cloud & MLOps', strength: 0.55, items: ['Git', 'Streamlit', 'PySpark', 'HDFS', 'MapReduce'] },
  { id: 'data-viz', name: 'Data Viz', strength: 0.9, items: ['Tableau', 'Power BI', 'Matplotlib', 'Seaborn'] },
  { id: 'systems', name: 'Systems Architecture', strength: 0.65, items: ['SAP', 'Salesforce', 'Pega', 'Bash'] },
];

// Optimizer options for the dropdown. Each one changes how the ball rolls.
export const optimizers = ['SGD', 'Momentum', 'Adam'] as const;
export type Optimizer = (typeof optimizers)[number];
