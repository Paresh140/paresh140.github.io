// All copy for the site. Mirrors "Paresh Subedi Resume FINAL".

export const profile = {
  name: `Paresh Subedi`,
  first: `Paresh`,
  last: `Subedi`,
  location: `Queens, NY`,
  email: `pareshsubediusa@gmail.com`,
  phone: `+1 (929) 224-8329`,
  phoneHref: `tel:+19292248329`,
  linkedin: `https://www.linkedin.com/in/paresh-subedi/`,
  github: `https://github.com/Paresh140`,
  resume: `/Paresh-Subedi-Resume.pdf`,
  status: `Open to research & data roles`,
  headline: `I build machine learning systems that think efficiently.`,
  bio: `Graduate Research Assistant at Fordham University, researching neuroscience-inspired ways to make Transformer-based LLMs faster and more energy-efficient, through inhibitory mechanisms and sparse activation. Before that I spent two years at Genpact in Bangalore, managing SAP ERP accounts and building the Tableau reporting behind them.`,
}

export const stats = [
  { value: 85, suffix: `%`, label: `Validation accuracy`, note: `CNN ensemble on HAM10000` },
  { value: 1.3, suffix: `M`, label: `Rows engineered`, note: `A decade of daily S&P 500 data` },
  { value: 10, suffix: `%`, label: `Top of cohort`, note: `Merit scholarship, Jain University` },
]

export const experience = [
  {
    role: `Graduate Research Assistant`,
    org: `Fordham University`,
    place: `New York, USA`,
    period: `2025 — Present`,
    points: [
      `Researching neuroscience-inspired methods to improve the energy efficiency and inference speed of Transformer-based LLMs, under faculty supervision.`,
      `Exploring inhibitory mechanisms and sparse activation to cut redundant computation in large-scale neural networks.`,
    ],
  },
  {
    role: `Senior Associate`,
    org: `Genpact`,
    place: `Bangalore, India`,
    period: `2023 — 2025`,
    points: [
      `Onboarded and maintained customer accounts in SAP ERP systems, keeping data entry accurate and timely.`,
      `Resolved account discrepancies with cross-functional teams, reducing data errors and improving customer experience.`,
      `Built Tableau reports on customer account metrics that surfaced patterns improving operational efficiency.`,
    ],
  },
]

export const projects = [
  {
    num: `01`,
    title: `AI Agent for Ticket Triage & Auto-Assignment`,
    summary: `A CrewAI multi-agent system that scores tickets by severity, priority and effort, then assigns each one to the best-fit developer by expertise, workload and history.`,
    metric: `Auto-assignment`,
    tags: [`CrewAI`, `Multi-agent`, `Streamlit`],
    href: `https://github.com/Paresh140`,
    featured: true,
  },
  {
    num: `02`,
    title: `Skin Disease Detection: CNN Ensemble`,
    summary: `Transfer learning across DenseNet201, VGG16, InceptionV3 and InceptionV2 on HAM10000, combined through ensemble methods.`,
    metric: `85% val. accuracy`,
    tags: [`Transfer learning`, `Ensemble`, `CNN`],
    href: `https://github.com/Paresh140/PCL-Code`,
  },
  {
    num: `03`,
    title: `S&P 500 Market Analysis & Tableau Dashboard`,
    summary: `A Python ETL pipeline (yfinance, BeautifulSoup) that builds a 1.3M+ row dataset, visualised in an interactive Tableau dashboard of volatility and drawdowns.`,
    metric: `1.3M rows`,
    tags: [`Python ETL`, `yfinance`, `Tableau`],
    href: `https://github.com/Paresh140/Exploratory-Data-Analysis`,
  },
  {
    num: `04`,
    title: `Causal Factor Discovery in S&P 500 Returns`,
    summary: `Identifying the causal drivers of S&P 500 returns with Double Machine Learning, LSTM and Random Forest.`,
    metric: `Causal inference`,
    tags: [`Double ML`, `LSTM`, `Random Forest`],
    href: `https://github.com/Paresh140/ML-Projects`,
  },
]

export const skills = [
  { group: `Languages`, items: [`Python`, `SQL`, `R`, `NoSQL`, `Bash`] },
  { group: `Machine learning`, items: [`Scikit-learn`, `XGBoost`, `Pandas`, `NumPy`, `Matplotlib`, `Seaborn`] },
  { group: `Deep learning & AI`, items: [`PyTorch`, `TensorFlow`, `Keras`, `Hugging Face`] },
  { group: `Big data`, items: [`PySpark`, `HDFS`, `MapReduce`] },
  { group: `Tools`, items: [`Power BI`, `Tableau`, `Git`, `Salesforce`, `SAP`, `Pega`] },
]

export const education = [
  {
    degree: `M.S. in Data Science`,
    school: `Fordham University`,
    period: `2025 — Present`,
    detail: `Graduate Research Assistant and Graduate Assistantship recipient.`,
  },
  {
    degree: `B.Tech (Honours), Computer Science – Data Science`,
    school: `Jain University`,
    period: `2019 — 2023`,
    detail: `Coursework in Python, data analytics, machine learning, deep learning and NLP.`,
  },
]

export const awards = [
  { title: `Graduate Assistantship`, org: `Fordham University`, year: `2025 — Present`, detail: `Competitive assistantship supporting tuition and research.` },
  { title: `Best Final-Year Project`, org: `Jain University`, year: `2023`, detail: `Undergraduate research in deep learning for dermatology.` },
  { title: `Merit-Based Scholarship`, org: `Jain University`, year: `2019 — 2023`, detail: `Awarded for academic performance, Top 10% of cohort.` },
]
