/**
 * Single source of truth for all site copy + media slots, derived from the CV.
 * Media paths point at /public/media/*; drop real files there and they appear.
 * `media: null` renders a labelled placeholder so the layout is complete now.
 */

export const PROFILE = {
  name: 'Qazi Noorul Mateen',
  shortName: 'Noorul Mateen',
  tagline: 'AI at the edge of biology & medicine',
  location: 'Toronto, Ontario',
  email: 'qnmateen.iitd@gmail.com',
  phone: '+1 647 404 2596',
  pitch:
    'I started at the lab bench and ended up building AI. Functional-genomics research at IIT Delhi, point-of-care diagnostics at Harvard (published in Science Advances), and now leading healthcare AI automation and AI agents.',
  links: {
    github: 'https://github.com/qnmateen',
    linkedin: 'https://www.linkedin.com/in/qnmateen',
    scholar: 'https://scholar.google.com/citations?user=ACRY-TsAAAAJ&hl=en',
    paper: 'https://www.science.org/doi/10.1126/sciadv.adt3803',
    cv: '/media/cv-9c1f7b3e.pdf', // unguessable name; save your CV here. Gated by CvGate code.
  },
};

/** Canonical section list — one label per chapter, reused by nav + scrollspy + PhaseLabel. */
export const SECTIONS = [
  { id: 'wetlab', label: 'Diagnostics' },
  { id: 'genomics', label: 'Genomics' },
  { id: 'ai', label: 'AI Agents' },
  { id: 'founder', label: 'Advisory' },
  { id: 'code', label: 'Code' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'study', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;

export type Repo = { name: string; area: string; lang: string; desc: string; url: string };

/** Real public repositories — the code behind the research + tools. */
export const REPOS: Repo[] = [
  {
    name: 'ML & Deep-Learning Projects',
    area: 'AI / ML',
    lang: 'Jupyter',
    desc: 'GANs, CNNs, RNNs, and reinforcement learning across medical imaging, vision, and NLP.',
    url: 'https://github.com/qnmateen/IIITB-PG-Diploma-in-Machine-Learning-and-AI-Projects',
  },
  {
    name: 'Single-cell RNA-seq pipeline',
    area: 'Genomics',
    lang: 'Python',
    desc: 'Snakemake pipeline (Scanpy + Seurat) from raw counts to clusters and markers.',
    url: 'https://github.com/qnmateen/singlecell-pipeline',
  },
  {
    name: 'Bulk RNA-seq HPC pipeline',
    area: 'Genomics',
    lang: 'Shell',
    desc: 'Parallel end-to-end RNA-seq on a PBS/HPC job array: QC, trimming, STAR alignment, featureCounts.',
    url: 'https://github.com/qnmateen/Parallel-End-to-End-RNA-seq-Pipeline-for-Read-Generation',
  },
  {
    name: 'JobScout AI',
    area: 'AI / ML',
    lang: 'Python',
    desc: 'Multi-source AI-job discovery dashboard that ranks fresh roles to your profile. FastAPI + Next.js.',
    url: 'https://github.com/qnmateen/jobscout-ai',
  },
  {
    name: 'Strawberry Transcriber',
    area: 'Tooling',
    lang: 'Python',
    desc: 'Batch audio/video transcription with OpenAI Whisper — exports TXT, SRT, and VTT.',
    url: 'https://github.com/qnmateen/strawberry-transcriber',
  },
  {
    name: 'EGFR lung cancer × PM2.5',
    area: 'Research',
    lang: 'R',
    desc: 'Correlational analysis of EGFR-driven lung cancer against global PM2.5 exposure.',
    url: 'https://github.com/Bhelpoori/PM2.5_EGFR_LC',
  },
  {
    name: 'HPC job scheduler (SLURM)',
    area: 'Research',
    lang: 'Shell',
    desc: 'Documented best practices for scheduling and running jobs on HPC clusters.',
    url: 'https://github.com/Bhelpoori/HPC-job-scheduler-slurm',
  },
];

export type Credential = { value: string; label: string };

export const CREDENTIALS: Credential[] = [
  { value: 'Science Advances', label: 'Published (first-tier journal)' },
  { value: 'Harvard Medical', label: 'Researcher' },
  { value: 'IIT Delhi', label: 'MS (Research)' },
  { value: 'MindGaps', label: 'Tech contributor' },
  { value: 'Heyliaa', label: 'AI/ML Lead' },
  { value: 'Top 40 / 14,000', label: 'India Alliance Fellow' },
  { value: '4+ years', label: 'AI & data science' },
];

export type MediaSlot = {
  kind: 'image' | 'video' | 'chart';
  src: string | null;
  caption: string;
  /** logos etc.: contain (not cover) and skip the duotone treatment */
  contain?: boolean;
};

export type Stat = { n?: number; suffix?: string; text?: string; label: string };

export type Chapter = {
  id: string;
  index: string;
  phase: string; // the poetic phase word shown on the title card
  kicker: string;
  title: string;
  lede: string;
  accent: string; // hex accent for the chapter
  stats: Stat[];
  highlights: string[];
  media: MediaSlot[];
  skills?: { category: string; items: string[] }[];
  link?: { label: string; href: string };
  links?: { label: string; href: string }[];
};

export const CHAPTERS: Chapter[] = [
  {
    id: 'wetlab',
    index: '01',
    phase: 'Diagnostics',
    kicker: 'Harvard Medical School',
    title: 'Diagnostics you can hold in your hand.',
    lede: 'Deep-learning microfluidics that take a disease test from the bench to the field.',
    accent: '#5eead4',
    stats: [
      { n: 94, suffix: '%+', label: 'HCV diagnostic accuracy' },
      { text: 'Science\nAdvances', label: 'Peer-reviewed' },
      { text: 'BSL-2', label: 'Clinical HCV samples' },
    ],
    highlights: [
      'Smartphone microfluidics + deep learning for rapid HCV antigen detection',
      'Fentanyl bubbling-microchip, presented at MIT · MGH AI Cures',
      'In Prof. Hadi Shafiee’s lab, with Dr. Hui Chen',
    ],
    media: [
      { kind: 'video', src: '/media/s1-flow.mp4', caption: 'Programmed microfluidic flow' },
      { kind: 'image', src: '/media/s1-microfluidic-channels.jpg', caption: 'Microfluidic channels: bubble-tech antigen assay' },
      { kind: 'image', src: '/media/s1-poc-device.jpg', caption: 'Point-of-care device, built from scratch' },
      { kind: 'image', src: '/media/s1-channel-designs.jpg', caption: 'Prototyping channel designs' },
      { kind: 'image', src: '/media/s1-laser-cut.jpg', caption: 'Laser-cut PMMA device layers' },
      { kind: 'image', src: '/media/s1-soldering.jpg', caption: 'Soldering the device' },
      { kind: 'image', src: '/media/s1-arduino-flow.jpg', caption: 'Arduino flow-control rig' },
      { kind: 'image', src: '/media/s1-flow-closeup.jpg', caption: 'Flow-control close-up' },
      { kind: 'image', src: '/media/s1-microfluidic-cartridges.jpg', caption: 'Microfluidic cartridges' },
      { kind: 'image', src: '/media/s1-cell-culture.jpg', caption: 'Cell culture' },
      { kind: 'image', src: '/media/s1-western-blot.jpg', caption: 'Western blot, Harvard' },
      { kind: 'image', src: '/media/s1-centrifuge.jpg', caption: 'Spinning down samples' },
      { kind: 'image', src: '/media/s1-lab-bench.jpg', caption: 'The bench' },
      { kind: 'image', src: '/media/s1-notebook.jpg', caption: 'Lab notebook, results' },
      { kind: 'image', src: '/media/s1-fentanyl-poster.jpg', caption: 'Fentanyl detection poster' },
      { kind: 'image', src: '/media/s1-mit-aicures.jpg', caption: 'MIT · MGH AI Cures conference' },
      { kind: 'image', src: '/media/s1-lab-meeting.jpg', caption: 'Presenting results, Harvard lab meeting' },
      { kind: 'image', src: '/media/s1-harvard-statue.jpg', caption: 'Harvard' },
    ],
    skills: [
      {
        category: 'Fabrication',
        items: ['3D printing', 'Laser cutting', 'Microfluidic device fabrication', 'Microfluidic channel design'],
      },
      {
        category: 'Molecular biology',
        items: ['PCR', 'Western blotting', 'CRISPR-Cas9 & Cas12a', 'Platinum nanoparticle synthesis'],
      },
      {
        category: 'Biosafety & clinical',
        items: ['BSL-2 facility', 'Hepatitis C virus (human clinical samples)', 'Clinical sample handling & protocols'],
      },
    ],
    link: { label: 'Read the paper', href: 'https://www.science.org/doi/10.1126/sciadv.adt3803' },
  },
  {
    id: 'genomics',
    index: '02',
    phase: 'Genomics',
    kicker: 'IIT Delhi',
    title: 'Finding signal in the transcriptome.',
    lede: 'From raw reads to the trajectory of a disease: mapping how NAFLD unfolds gene by gene across 14 days, and teaching the next cohort to do the same.',
    accent: '#7dd3fc',
    stats: [
      { text: 'HCFC1', label: 'Knockout mouse thesis' },
      { n: 14, suffix: ' days', label: 'NAFLD progression window' },
      { text: 'scRNA + bulk', label: 'Custom trajectory pipeline' },
    ],
    highlights: [
      'RNA-seq and single-cell RNA-seq, full pipeline from raw reads to expression',
      'Custom trajectory pipeline: adapted Monocle single-cell pseudotime for bulk RNA-seq',
      'Thesis: HCFC1-knockout mouse tracing NAFLD progression across 14 days',
      'Nanopore long-read sequencing: validated results, taught students, ran on HPC clusters',
    ],
    media: [
      { kind: 'video', src: '/media/s1-working.mp4', caption: 'In the lab' },
      { kind: 'video', src: '/media/s2-nanopore.mp4', caption: 'Nanopore sequencing run' },
      { kind: 'image', src: '/media/s2-nanopore-device.jpg', caption: 'Nanopore (MinION) device' },
      { kind: 'image', src: '/media/s2-nanopore.jpg', caption: 'Nanopore sequencing' },
      { kind: 'image', src: '/media/s2-nanopore-setup.jpg', caption: 'Sequencing setup, from above' },
      { kind: 'image', src: '/media/s2-drylab.jpg', caption: 'Dry-lab setup, IIT Delhi' },
      { kind: 'chart', src: '/media/s2-deseq.jpg', caption: 'Differential expression in R (DESeq2)' },
      { kind: 'chart', src: '/media/s2-masigpro.jpg', caption: 'maSigPro cluster analysis' },
      { kind: 'image', src: '/media/s2-iit-library.jpg', caption: 'Analysis at IIT Delhi' },
    ],
    skills: [
      {
        category: 'Sequencing',
        items: ['RNA-seq', 'Single-cell RNA-seq', 'Nanopore long-read sequencing'],
      },
      {
        category: 'Analysis & pipelines',
        items: [
          'Alignment & QC (raw reads to counts)',
          'Differential expression (DESeq2, edgeR, maSigPro)',
          'WGCNA co-expression',
          'Trajectory & pseudotime (Monocle, custom bulk)',
        ],
      },
      {
        category: 'Compute & teaching',
        items: ['HPC cluster pipelines', 'Bash / R / Python', 'Taught nanopore methods (TA)'],
      },
    ],
  },
  {
    id: 'ai',
    index: '03',
    phase: 'AI Agents',
    kicker: 'Heyliaa',
    title: 'Agents that do real work.',
    lede: 'A team of AI agents running the clinic front desk: answering and placing calls, booking, verifying insurance, handling faxes and intake. Plus applied ML across voice, imaging, and reinforcement learning.',
    accent: '#a78bfa',
    stats: [
      { n: 8, label: 'AI agents built' },
      { n: 10, suffix: '+', label: 'ML projects' },
      { text: 'LLMs', label: 'Agents · RAG · GenAI' },
    ],
    highlights: [
      'Heyliaa: a team of 8 AI agents running the clinic front desk, 24/7',
      'Agents place and answer calls, book appointments, verify insurance, handle faxes and intake',
      'Applied ML: Parkinson’s from voice, CycleGAN MRI, melanoma detection, medical NER',
      'Reinforcement-learning agents and gesture recognition (CNN+RNN)',
    ],
    media: [
      { kind: 'image', src: '/media/heyliaa-dashboard.png', caption: 'Heyliaa agent dashboard' },
      { kind: 'image', src: '/media/cyclegan-mri.png', caption: 'CycleGAN MRI: T1 to T2' },
      { kind: 'image', src: '/media/heyliaa-logo.png', caption: 'Heyliaa', contain: true },
    ],
    skills: [
      {
        category: 'Agentic AI',
        items: ['LLMs', 'AI agents', 'LangChain & LangGraph', 'RAG', 'Voice / conversational AI', 'Workflow automation'],
      },
      {
        category: 'ML & deep learning',
        items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'CNN / RNN / GAN', 'Hugging Face'],
      },
      {
        category: 'Deployment & data',
        items: ['AWS', 'Google Cloud', 'APIs & integrations', 'Python'],
      },
    ],
    links: [
      { label: 'Visit Heyliaa', href: 'https://heyliaa.com' },
      { label: 'View projects', href: 'https://github.com/qnmateen' },
    ],
  },
  {
    id: 'founder',
    index: '04',
    phase: 'Advisory',
    kicker: 'MindGaps · Vgenomics',
    title: 'Advising the frontier of health AI.',
    lede: 'Advising and contributing across the frontier of health AI — mental-health technology at MindGaps, and rare-disease genomic diagnostics as AI Strategy Advisor to Vgenomics.',
    accent: '#4ade80',
    stats: [
      { text: 'MindGaps', label: 'Tech contributor' },
      { text: 'Vgenomics', label: 'AI Strategy Advisor' },
      { text: 'AI × Health', label: 'Where I contribute' },
    ],
    highlights: [
      'MindGaps: contributing technology to make mental-health and psychology support more accessible',
      'Vgenomics: AI Strategy Advisor for rare-disease genomic diagnostics (NIPT, WES, Rare Predict)',
      'Advising on AI roadmaps, technical architecture, and product strategy',
    ],
    media: [
      { kind: 'image', src: '/media/vgenomics.png', caption: 'Vgenomics: rare-disease platform' },
      { kind: 'image', src: '/media/mindgaps-logo.png', caption: 'MindGaps', contain: true },
    ],
    skills: [
      {
        category: 'Product & strategy',
        items: ['AI product management', 'Product roadmaps', 'Technical specs', '0 to 1 product', 'Market & feasibility analysis'],
      },
      {
        category: 'Technical leadership',
        items: ['System architecture', 'LLM & agent systems', 'MLOps', 'Hiring & mentoring'],
      },
      {
        category: 'Domain & GTM',
        items: ['Healthcare & genomics domain', 'Clinical alignment', 'Partnerships', 'HIPAA & compliance'],
      },
    ],
    links: [
      { label: 'Vgenomics', href: 'https://vgenomics.in' },
      { label: 'MindGaps', href: 'https://in.linkedin.com/company/mindgaps' },
    ],
  },
];

export type TimelineKind = 'education' | 'research' | 'work' | 'founder';

export type TimelineItem = {
  year: string;
  dates: string;
  title: string;
  org: string;
  place: string;
  kind: TimelineKind;
  blurb: string;
  accent: string;
  current?: boolean;
};

export const KIND_LABEL: Record<TimelineKind, string> = {
  education: 'Education',
  research: 'Research',
  work: 'Work',
  founder: 'Founder',
};

/** Chronological career, palette warming→cooling like the particle morph. */
export const TIMELINE: TimelineItem[] = [
  {
    year: '2018',
    dates: '2018 – 2019',
    title: 'Research Intern',
    org: 'IIT Kanpur · ICGEB',
    place: 'Kanpur / New Delhi',
    kind: 'research',
    blurb: 'First taste of the lab: tissue engineering at IIT Kanpur, then computational biology at ICGEB. The seed of the pivot.',
    accent: '#f9a8d4',
  },
  {
    year: '2018',
    dates: 'Jul 2018 – Apr 2020',
    title: 'Biology Teacher',
    org: 'Drishti Classes',
    place: 'Aligarh, India',
    kind: 'work',
    blurb: 'Taught NEET biology to 100+ students and lifted the pass rate by 15% over two years.',
    accent: '#fb7185',
  },
  {
    year: '2020',
    dates: 'Jul 2020 – Sep 2020',
    title: 'CSIR-DBT Research Fellow',
    org: 'NCBS',
    place: 'Bengaluru, India',
    kind: 'research',
    blurb: 'Research fellowship at the National Centre for Biological Sciences.',
    accent: '#f472b6',
  },
  {
    year: '2020',
    dates: 'Sep 2020 – May 2024',
    title: 'Graduate Researcher & Teaching Assistant',
    org: 'IIT Delhi',
    place: 'Delhi, India',
    kind: 'research',
    blurb: 'Functional-genomics research on NAFLD. RNA-seq pipelines (DESeq2, maSigPro, WGCNA) that validated 98 novel diagnostic transcripts. TA for Genomics & Proteomics.',
    accent: '#5eead4',
  },
  {
    year: '2022',
    dates: 'Apr 2022',
    title: 'PG Diploma, Machine Learning & AI',
    org: 'IIIT Bangalore',
    place: 'Remote',
    kind: 'education',
    blurb: 'The pivot: formal grounding in ML/AI while still at the bench.',
    accent: '#34d399',
  },
  {
    year: '2022',
    dates: 'Dec 2022 – Jul 2023',
    title: 'Researcher',
    org: 'Harvard Medical School',
    place: 'Boston, MA',
    kind: 'research',
    blurb: 'In Prof. Hadi Shafiee’s lab (with Dr. Hui Chen): deep-learning microfluidics for rapid HCV detection, published in Science Advances, plus fentanyl detection via bubbling-microchip.',
    accent: '#22d3ee',
  },
  {
    year: '2024',
    dates: 'May 2024',
    title: 'MS (Research), Functional Genomics',
    org: 'IIT Delhi',
    place: 'Delhi, India',
    kind: 'education',
    blurb: 'Research master’s bridging wet-lab biology and computation.',
    accent: '#38bdf8',
  },
  {
    year: '2024',
    dates: 'Jul 2024 – present',
    title: 'AI Strategy Advisor',
    org: 'Vgenomics',
    place: 'Remote',
    kind: 'work',
    blurb: 'Strategic direction for an AI platform in diagnostics and genomics, focused on biomarker discovery.',
    accent: '#60a5fa',
    current: true,
  },
  {
    year: '2025',
    dates: 'Jun 2025',
    title: 'MS, Data Science',
    org: 'Liverpool John Moores',
    place: 'Liverpool, UK',
    kind: 'education',
    blurb: 'Thesis: comparing ML models on speech data to predict Parkinson’s disease.',
    accent: '#818cf8',
  },
  {
    year: '2025',
    dates: '2025 – present',
    title: 'AI/ML Specialist',
    org: 'MarkiTech.AI',
    place: 'Toronto, ON',
    kind: 'work',
    blurb: 'Leading healthcare AI-agent development: Heyliaa, a team of AI agents running the clinic front desk (calls, scheduling, insurance, faxes, intake), plus AI automation across the business.',
    accent: '#a78bfa',
    current: true,
  },
];

/** Institutions / marks for the credibility marquee. */
export const MARQUEE = [
  'Harvard Medical School',
  'IIT Delhi',
  'Science Advances',
  'MIT · MGH AI Cures',
  'NCBS',
  'IIIT Bangalore',
  'Liverpool John Moores',
  'India Alliance Fellow',
];

export const EDUCATION = [
  { school: 'Liverpool John Moores University', detail: 'MS, Data Science', year: '2025' },
  { school: 'Indian Institute of Technology Delhi', detail: 'MS (Research), Functional Genomics, Biochemical Eng. & Biotechnology', year: '2024' },
  { school: 'IIIT Bangalore', detail: 'PG Diploma, Machine Learning & AI', year: '2022' },
  { school: 'Aligarh Muslim University', detail: 'MSc, Biotechnology', year: '2020' },
  { school: 'Jamia Millia Islamia', detail: 'BSc, Biosciences', year: '2018' },
];

export const AWARDS = [
  'Biotech Fellowship (All India Rank 3)',
  'India Alliance Research Fellow (Top 40 of 14,000)',
  'Google Cloud Essentials · Microsoft/LinkedIn Data Analysis',
];
