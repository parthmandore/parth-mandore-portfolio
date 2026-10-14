/**
 * Central portfolio data — personalized for Parth Mandore.
 * Every fact on the site comes from this file. Update it here and the whole site follows.
 * Source of truth: verified personal resume, original portfolio, and project repositories.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

export const profile = {
  fullName: 'Parth Mandore',
  displayName: 'Parth Mandore',
  firstName: 'PARTH',
  seriesTag: 'PORTFOLIO',
  /** Fictional studio card shown at the very start of the opening sequence. */
  originalLabel: 'A MANDORE ORIGINAL',
  role: 'Software Engineering · Backend Development · Applied AI',
  tagline: ['Software Engineering', 'Backend Development', 'Applied AI'],
  intro:
    "I'm a Computer Engineering student at G. H. Raisoni College of Engineering & Management, Pune, focused on backend development and applied AI. I build software projects using Java, Spring Boot, Python, and modern web technologies, with an emphasis on practical problem-solving and reliable application design.",
  location: 'Pune, Maharashtra',
  email: 'mandoreparth14@gmail.com',
  links: {
    linkedin: 'https://linkedin.com/in/parthmandore',
    github: 'https://github.com/parthmandore',
  },
  resumePdf: '/assets/Parth_Mandore_Resume.pdf',
  portrait: {
    src: '/assets/portrait-720.webp',
    srcSet: '/assets/portrait-420.webp 420w, /assets/portrait-720.webp 720w, /assets/portrait-1100.webp 1100w',
    alt: 'Portrait of Parth Mandore',
  },
  interests: ['Backend Systems', 'Applied AI', 'Database Architecture'],
};

export const education = [
  {
    school: 'G. H. Raisoni College of Engineering and Management',
    place: 'Pune',
    degree: 'Bachelor of Technology — Computer Engineering',
    period: '2023 – Present',
    score: 'CGPA 7.68 / 10 (through Sem VI)',
  },
  {
    school: 'Pratap College',
    place: 'Amalner',
    degree: 'Higher Secondary Certificate (HSC)',
    period: '2021 – 2023',
    score: '89.00%',
  },
  {
    school: 'Shri N. T. Mundada Global View School',
    place: 'Amalner',
    degree: 'Secondary School Certificate (SSC)',
    period: '2019 – 2021',
    score: '85.20%',
  },
];

export const experience = [
  {
    company: 'Independent Technical Projects',
    role: 'Software Project Development',
    place: 'Pune, MH',
    period: '2023 – Present',
    points: [
      'Architected and implemented full-stack and backend software projects using Java, Spring Boot, Python, Next.js, and relational databases.',
      'Engineered real-time computer vision exercise tracking pipelines with Google MediaPipe and state machine logic for motion analysis.',
      'Developed RESTful API services following the Controller-Service-Repository pattern with structured data persistence and Swagger documentation.',
    ],
  },
];

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  label?: string;
  /** Omit when the repository isn't public — the GitHub button is hidden instead of linking to a 404. */
  github?: string;
  demo?: string;
  palette: Palette;
  motif: 'shield' | 'flow' | 'tenants';
};

export const projects: Project[] = [
  {
    id: 'repomentor-ai',
    title: 'RepoMentor AI',
    year: '2025',
    genre: 'AI • Static Analysis • RAG',
    logline: 'An AI-powered codebase intelligence platform performing static analysis, architecture topology mapping, and RAG-based technical Q&A.',
    stack: ['FastAPI', 'Python', 'Next.js', 'PostgreSQL', 'pgvector', 'Docker'],
    build: [
      'Built an automated codebase analysis pipeline combining regex-based static scanning, cyclomatic complexity calculations, and AST security audits.',
      'Implemented semantic code retrieval using local ONNX embeddings (FastEmbed) and PostgreSQL pgvector cosine similarity search.',
      'Integrated an explainable AI Mentor providing grounded repository walkthroughs, dependency graphs with ReactFlow, and refactoring guidance.',
    ],
    features: [
      'Static code analysis & complexity scoring',
      'pgvector semantic vector similarity search',
      'Grounded RAG codebase technical Q&A',
      'ReactFlow visual architecture & dependency graph',
      'AST-based security vulnerability scanning',
    ],
    metrics: [
      { value: '100%', label: 'local & private inference' },
      { value: '<250ms', label: 'vector search lookup' },
      { value: '10k+', label: 'LOC parsed per project' },
      { value: '0', label: 'third-party data leakage' },
      { value: 'AST', label: 'structural security audits' },
    ],
    github: 'https://github.com/parthmandore/RepoMentor-AI',
    demo: 'https://repomentor.netlify.app',
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'tenants',
  },
  {
    id: 'gymbuddy-ai',
    title: 'GymBuddy AI Trainer',
    year: '2025',
    genre: 'Computer Vision • Pose Estimation • Full-Stack',
    logline: 'A real-time, browser-based AI workout assistant using MediaPipe pose tracking for 33 skeletal landmarks, exercise movement analysis, and live coaching cues.',
    stack: ['Next.js', 'TypeScript', 'MediaPipe', 'Supabase', 'Tailwind CSS'],
    build: [
      'Integrated Google MediaPipe Tasks Vision to track 33 full-body skeletal landmarks in real-time directly within the browser.',
      'Constructed modular movement trackers and finite state machine routines evaluating repetition transitions and exercise posture.',
      'Implemented interactive exercise calibration and audio-visual guidance cues leveraging the Web Audio API and Supabase data storage.',
    ],
    features: [
      '33-landmark real-time 3D pose estimation',
      'Modular biomechanical exercise tracking',
      'Adaptive user calibration & alignment',
      'Audio-visual voice and visual form cues',
      'Interactive developer exercise testing lab',
    ],
    metrics: [
      { value: '80+', label: 'exercises configured' },
      { value: '33', label: 'skeletal landmarks tracked' },
      { value: '30+ FPS', label: 'browser camera inference' },
      { value: '<30ms', label: 'motion frame processing' },
      { value: '100%', label: 'client-side privacy execution' },
    ],
    github: 'https://github.com/parthmandore/GymBuddy-AI-Trainer',
    palette: { from: '#2a0610', via: '#7a0f24', to: '#0b0710', accent: '#ff3d5a' },
    motif: 'shield',
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener Service',
    year: '2025',
    genre: 'Backend • Java • REST API',
    logline: 'A RESTful URL shortening service built with Java 17 and Spring Boot, utilizing Base62 encoding and a clean Controller-Service-Repository architecture.',
    stack: ['Java 17', 'Spring Boot', 'Spring Data JPA', 'H2 Database', 'REST APIs', 'Swagger'],
    build: [
      'Engineered a RESTful URL shortening API with Spring Boot converting long URLs into compact alphanumeric links via Base62 encoding.',
      'Structured the application using the Controller-Service-Repository pattern for clear separation of concerns and maintainability.',
      'Integrated Spring Data JPA with an in-memory H2 database for entity persistence, redirect routing, and click count telemetry.',
    ],
    features: [
      'Base62 alphanumeric short-code generation',
      'HTTP 302 URL redirection service',
      'URL click count analytics tracking',
      'Swagger UI interactive endpoint documentation',
      'Layered Controller-Service-Repository design',
    ],
    metrics: [
      { value: 'Base62', label: 'alphanumeric encoding' },
      { value: 'H2', label: 'in-memory entity persistence' },
      { value: '3-tier', label: 'layered architecture' },
      { value: 'CRUD', label: 'Spring Data JPA operations' },
      { value: 'Swagger', label: 'interactive API documentation' },
    ],
    github: 'https://github.com/parthmandore/url-shortener-api',
    palette: { from: '#1a0d02', via: '#8a4a07', to: '#0a0806', accent: '#ffb547' },
    motif: 'flow',
  },
  {
    id: 'gyan-app',
    title: 'Gyan Dyslexia Support App',
    year: '2025',
    genre: 'Mobile • EdTech • Accessibility • AI',
    logline: 'An assistive mobile learning application built with React Native and Expo, designed to empower children with dyslexia through multi-sensory phonics games, speech recognition, and accessible typography.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Zustand'],
    build: [
      'Developed an accessible mobile application utilizing Lexend typography, high-contrast visual cues, and multi-sensory feedback tailored for neurodivergent learners.',
      'Created interactive phonics and letter-tracing learning modules with audio-assisted pronunciation powered by speech synthesis and speech-to-text recognition.',
      'Built a scalable Node.js and Express backend with MongoDB for student learning progress tracking, assessment telemetry, and personalized study roadmaps.',
    ],
    features: [
      'Lexend dyslexia-friendly typeface & high-contrast themes',
      'Interactive phonics, letter tracing & reading games',
      'Audio pronunciation assistance & voice assessment',
      'Gamified progress tracking with streak & reward system',
      'Parent & educator analytics dashboard',
    ],
    metrics: [
      { value: 'Lexend', label: 'specialized dyslexia typography' },
      { value: 'Audio+UI', label: 'multi-sensory learning modes' },
      { value: 'Cross-Plat', label: 'React Native & Expo architecture' },
      { value: 'REST', label: 'Node.js & Express API' },
      { value: 'MongoDB', label: 'progress & telemetry store' },
    ],
    github: 'https://github.com/parthmandore/Gyan',
    palette: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
    motif: 'shield',
  },
];

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
  link?: string;
};

export const achievements: Achievement[] = [
  {
    id: 'ideathon-finalist',
    title: 'Top 25 Finalist',
    org: 'National Level Ideathon 2025',
    detail: 'Project selected among the top 25 teams nationwide out of hundreds of university teams, presenting technical architecture and software feasibility before industry judges.',
    laurel: 'National Finalist',
  },
  {
    id: 'competitive-coding',
    title: '150+ Problems Solved',
    org: 'LeetCode & Coding Platforms',
    detail: 'Consistent algorithmic practice across data structures and algorithms, focusing on arrays, strings, trees, graphs, and dynamic programming.',
    laurel: 'Technical Milestone',
  },
];

export type Certification = {
  name: string;
  issuer: string;
  issueDate?: string;
  credentialId?: string;
  link?: string;
  url?: string;
  image?: string;
};

export const certifications: Certification[] = [];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    subtitle: 'Core programming languages',
    skills: [
      { name: 'Java', mono: 'Jv', note: 'Core' },
      { name: 'Python', mono: 'Py' },
      { name: 'TypeScript', mono: 'Ts' },
      { name: 'JavaScript', mono: 'Js' },
      { name: 'SQL', mono: 'Sq' },
      { name: 'C / C++', mono: 'C+' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    subtitle: 'Server-side architectures',
    skills: [
      { name: 'Spring Boot', mono: 'Sb', note: 'Primary' },
      { name: 'Django REST', mono: 'Dj' },
      { name: 'FastAPI', mono: 'Fa' },
      { name: 'REST APIs', mono: 'Ap' },
      { name: 'Microservices', mono: 'Ms' },
      { name: 'JWT Auth', mono: 'Jw' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    subtitle: 'Modern web user interfaces',
    skills: [
      { name: 'React', mono: 'Re' },
      { name: 'Next.js', mono: 'Nx' },
      { name: 'Tailwind CSS', mono: 'Tw' },
      { name: 'HTML5 / CSS3', mono: 'W3' },
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    subtitle: 'Relational & document stores',
    skills: [
      { name: 'PostgreSQL', mono: 'Pg' },
      { name: 'MySQL', mono: 'My' },
      { name: 'H2 Database', mono: 'H2' },
      { name: 'MongoDB', mono: 'Mg' },
      { name: 'Supabase', mono: 'Sb' },
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI & Vision',
    subtitle: 'Applied intelligence & computer vision',
    skills: [
      { name: 'MediaPipe', mono: 'Mp' },
      { name: 'Computer Vision', mono: 'Cv' },
      { name: 'Scikit-Learn', mono: 'Sk' },
      { name: 'RAG & Vector Search', mono: 'Rg' },
      { name: 'Pandas / NumPy', mono: 'Pd' },
    ],
  },
  {
    id: 'fundamentals',
    title: 'CS Fundamentals',
    subtitle: 'Core engineering principles',
    skills: [
      { name: 'DSA', mono: 'Ds' },
      { name: 'OOP', mono: 'Oo' },
      { name: 'DBMS', mono: 'Db' },
      { name: 'Operating Systems', mono: 'Os' },
      { name: 'Computer Networks', mono: 'Cn' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & DevOps',
    subtitle: 'Workflows & environments',
    skills: [
      { name: 'Git / GitHub', mono: 'Gt' },
      { name: 'Docker', mono: 'Dk' },
      { name: 'Postman', mono: 'Pm' },
      { name: 'Swagger / OpenAPI', mono: 'Sw' },
      { name: 'Linux / CLI', mono: 'Lx' },
    ],
  },
];

/**
 * Factual cross-references shown when a skill card is hovered/tapped:
 * where the skill appears in the projects, coursework or achievements.
 */
export const skillEvidence: Record<string, string[]> = {
  Java: ['URL Shortener Service', 'Message Filtering Backend', 'OOP Fundamentals'],
  Python: ['RepoMentor AI', 'FastAPI Ingestion', 'Machine Learning Coursework'],
  TypeScript: ['GymBuddy AI Trainer', 'Full-Stack Next.js Applications'],
  JavaScript: ['Interactive Web Applications', 'DOM & Async Programming'],
  SQL: ['PostgreSQL & MySQL Schemas', 'Message Filtering Database', 'Supabase'],
  'C / C++': ['CS Fundamentals', 'Data Structures & Algorithms Implementation'],
  'Spring Boot': ['URL Shortener Service', 'Message Filtering Backend', 'Controller-Service-Repository Pattern'],
  'Django REST': ['Backend Web Frameworks', 'REST API Architecture'],
  FastAPI: ['RepoMentor AI Code Ingestion Service'],
  'REST APIs': ['URL Shortener Service', 'Message Filtering (15+ Endpoints)', 'GymBuddy AI', 'RepoMentor AI'],
  Microservices: ['URL Shortener Service', 'Message Filtering Service'],
  'JWT Auth': ['Secure Web Applications', 'Session Management'],
  React: ['Next.js App Router', 'GymBuddy AI Trainer', 'Client State Management'],
  'Next.js': ['GymBuddy AI Trainer', 'RepoMentor AI Frontend'],
  'Tailwind CSS': ['GymBuddy AI Trainer', 'Responsive Cinematic UI'],
  'HTML5 / CSS3': ['Web Standards', 'Responsive Layout Engineering'],
  PostgreSQL: ['RepoMentor AI Vector Store', 'Relational Schema Normalization'],
  MySQL: ['Message Filtering Backend System', 'JPA Persistence'],
  'H2 Database': ['URL Shortener Service In-Memory Storage'],
  MongoDB: ['Document Store Schemas', 'NoSQL Data Modeling'],
  Supabase: ['GymBuddy AI User Auth & Workout Telemetry'],
  MediaPipe: ['GymBuddy AI Trainer — 33 Keypoint Real-Time Pose Tracking'],
  'Computer Vision': ['GymBuddy AI Trainer — Biomechanical Angle Calculation'],
  'Scikit-Learn': ['Machine Learning Coursework & Experimentation'],
  'RAG & Vector Search': ['RepoMentor AI — pgvector Codebase Search'],
  'Pandas / NumPy': ['Data Processing & Computational Analysis'],
  DSA: ['150+ LeetCode Problems Solved', 'Algorithm Optimization'],
  OOP: ['Java Class Hierarchies', 'Spring Service Encapsulation'],
  DBMS: ['Relational Schema Design', 'Query Indexing & Normalization'],
  'Operating Systems': ['Process Concurrency', 'Memory & Thread Management'],
  'Computer Networks': ['HTTP/HTTPS Protocols', 'TCP/IP Fundamentals'],
  'Git / GitHub': ['Version Control', 'Open Source Collaboration'],
  Docker: ['RepoMentor AI Containerization', 'Docker Compose'],
  Postman: ['Message Filtering (15+ Endpoints Validated)', 'API Contract Testing'],
  'Swagger / OpenAPI': ['URL Shortener Interactive Endpoint Documentation'],
  'Linux / CLI': ['Development Environment', 'Shell Scripting'],
};

export type Episode = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};

export type Season = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  episodes: Episode[];
};

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' };

export const seasons: Season[] = [
  {
    number: 1,
    title: 'Academic Foundations',
    period: '2019 – 2023 · 2 Episodes',
    synopsis: 'Secondary school education at Shri N. T. Mundada Global View School followed by Higher Secondary studies at Pratap College, Amalner.',
    episodes: [
      {
        code: 'S01 E01',
        title: 'The School',
        description: 'Secondary School Certificate (SSC) at Shri N. T. Mundada Global View School — graduating with 85.20%.',
        tags: ['SSC', '85.20%', 'Shri N. T. Mundada School'],
        runtime: '2019 – 2021',
        palette: amber,
      },
      {
        code: 'S01 E02',
        title: 'Higher Secondary',
        description: 'Higher Secondary Certificate (HSC) at Pratap College, Amalner — graduating with 89.00%.',
        tags: ['HSC', '89.00%', 'Pratap College'],
        runtime: '2021 – 2023',
        palette: crimson,
      },
    ],
  },
  {
    number: 2,
    title: 'Computer Engineering',
    period: '2023 – Present · 3 Episodes',
    synopsis: 'Undergraduate degree in Computer Engineering at GHRCEM Pune, core computer science fundamentals, and disciplined algorithmic problem solving.',
    episodes: [
      {
        code: 'S02 E01',
        title: 'The Degree Program',
        description: 'B.Tech in Computer Engineering at G. H. Raisoni College of Engineering & Management, Pune — verified CGPA of 7.68/10 through Semester VI.',
        tags: ['B.Tech', 'Comp Eng', 'CGPA 7.68', 'GHRCEM Pune'],
        runtime: '2023 – Present',
        palette: violet,
      },
      {
        code: 'S02 E02',
        title: 'CS Fundamentals',
        description: 'Core computer science curriculum covering Operating Systems, Database Management Systems, Computer Networks, and Object-Oriented Programming.',
        tags: ['OS', 'DBMS', 'Networks', 'OOP'],
        runtime: 'Core Curriculum',
        palette: crimson,
      },
      {
        code: 'S02 E03',
        title: 'The Problem Solver',
        description: 'Active Data Structures & Algorithms practice on LeetCode with 150+ problems solved in Java, maintaining continuous problem-solving consistency.',
        tags: ['DSA', 'LeetCode 150+', 'Java', 'Problem Solving'],
        runtime: '150+ problems',
        palette: jade,
      },
    ],
  },
  {
    number: 3,
    title: 'Learning to Build',
    period: '2024 – 2025 · 3 Episodes',
    synopsis: 'Progressing from foundational programming concepts to building and deploying functional software projects.',
    episodes: [
      {
        code: 'S03 E01',
        title: 'The Learner',
        description: 'Ongoing technical development as a Computer Engineering student — studying programming languages, backend architecture, and core system design principles.',
        tags: ['Java', 'Python', 'Backend Dev', 'CS Principles'],
        runtime: 'Foundations',
        palette: ocean,
      },
      {
        code: 'S03 E02',
        title: 'The Builder',
        description: 'Engineering practical software systems — building RepoMentor AI for codebase intelligence, GymBuddy AI for pose estimation, and RESTful APIs with Spring Boot.',
        tags: ['RepoMentor AI', 'GymBuddy AI', 'Spring Boot', 'Next.js'],
        runtime: 'Projects',
        palette: violet,
      },
      {
        code: 'S03 E03',
        title: 'The Deployer',
        description: 'Managing code repositories with Git & GitHub, containerizing services with Docker, integrating PostgreSQL and Supabase, and validating REST APIs.',
        tags: ['Docker', 'Git / GitHub', 'Postman', 'Supabase'],
        runtime: 'Integration',
        palette: jade,
      },
    ],
  },
  {
    number: 4,
    title: 'Featured Projects',
    period: '2024 – 2025 · 3 Episodes',
    synopsis: 'Flagship engineering productions — codebase intelligence RAG, computer vision workout coaching, and RESTful backend microservices.',
    episodes: [
      {
        code: 'S04 E01',
        title: 'The AI Architect',
        description: 'RepoMentor AI — AI-powered GitHub repository analysis platform with architecture review, code quality assessment, and RAG Q&A.',
        tags: ['FastAPI', 'Python', 'pgvector', 'Docker'],
        runtime: '2024 – 2025',
        palette: crimson,
      },
      {
        code: 'S04 E02',
        title: 'The Vision Coach',
        description: 'GymBuddy AI Trainer — Real-time pose estimation workout assistant tracking exercise repetitions and movement form using MediaPipe.',
        tags: ['Next.js', 'MediaPipe', 'Supabase', 'Groq'],
        runtime: '2024 – 2025',
        palette: amber,
      },
      {
        code: 'S04 E03',
        title: 'The Backend Engineer',
        description: 'URL Shortener API & Message Filtering System — RESTful backend microservices built with Java 17, Spring Boot, Spring Data JPA, and H2/MySQL.',
        tags: ['Java 17', 'Spring Boot', 'Spring Data JPA', 'REST APIs'],
        runtime: '2024 – 2025',
        palette: ocean,
      },
    ],
  },
  {
    number: 5,
    title: 'Always Learning',
    period: 'Now streaming · 1 Episode',
    synopsis: 'Continuous technical learning and deliberate practice — sharpening problem-solving, building reliable backend services, and exploring applied AI systems.',
    episodes: [
      {
        code: 'S05 E01',
        title: 'The Next Horizon',
        description: 'Deepening knowledge in scalable backend design, Spring Boot architectures, advanced Data Structures & Algorithms, and applied AI systems for real-world software engineering.',
        tags: ['Backend Systems', 'Applied AI', 'DSA Practice', 'Spring Boot'],
        runtime: 'Continuous Growth',
        palette: violet,
      },
    ],
  },
];

export type ProjectItem = Project;

export const parthProjects: Project[] = [
  {
    id: 'repomentor-ai',
    label: 'Codebase Intelligence',
    title: 'RepoMentor AI',
    year: '2025',
    genre: 'AI • Static Analysis • RAG',
    logline: 'An AI-powered codebase intelligence platform performing static analysis, architecture topology mapping, and RAG-based technical Q&A.',
    stack: ['FastAPI', 'Python', 'Next.js', 'PostgreSQL', 'pgvector', 'Docker'],
    build: [
      'Built an automated codebase analysis pipeline combining regex-based static scanning, cyclomatic complexity calculations, and AST security audits.',
      'Implemented semantic code retrieval using local ONNX embeddings (FastEmbed) and PostgreSQL pgvector cosine similarity search.',
      'Integrated an explainable AI Mentor providing grounded repository walkthroughs, dependency graphs with ReactFlow, and refactoring guidance.',
    ],
    features: [
      'Static code analysis & complexity scoring',
      'pgvector semantic vector similarity search',
      'Grounded RAG codebase technical Q&A',
      'ReactFlow visual architecture & dependency graph',
      'AST-based security vulnerability scanning',
    ],
    metrics: [
      { value: '100%', label: 'local & private inference' },
      { value: '<250ms', label: 'vector search lookup' },
      { value: '10k+', label: 'LOC parsed per project' },
      { value: '0', label: 'third-party data leakage' },
      { value: 'AST', label: 'structural security audits' },
    ],
    github: 'https://github.com/parthmandore/RepoMentor-AI',
    demo: 'https://repomentor.netlify.app',
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'tenants',
  },
  {
    id: 'gymbuddy-ai',
    label: 'Computer Vision AI',
    title: 'GymBuddy AI Trainer',
    year: '2025',
    genre: 'Computer Vision • Pose Estimation • Full-Stack',
    logline: 'A real-time, browser-based AI workout assistant using MediaPipe pose tracking for 33 skeletal landmarks, exercise movement analysis, and live coaching cues.',
    stack: ['Next.js', 'TypeScript', 'MediaPipe', 'Supabase', 'Tailwind CSS'],
    build: [
      'Integrated Google MediaPipe Tasks Vision to track 33 full-body skeletal landmarks in real-time directly within the browser.',
      'Constructed modular movement trackers and finite state machine routines evaluating repetition transitions and exercise posture.',
      'Implemented interactive exercise calibration and audio-visual guidance cues leveraging the Web Audio API and Supabase data storage.',
    ],
    features: [
      '33-landmark real-time 3D pose estimation',
      'Modular biomechanical exercise tracking',
      'Adaptive user calibration & alignment',
      'Audio-visual voice and visual form cues',
      'Interactive developer exercise testing lab',
    ],
    metrics: [
      { value: '80+', label: 'exercises configured' },
      { value: '33', label: 'skeletal landmarks tracked' },
      { value: '30+ FPS', label: 'browser camera inference' },
      { value: '<30ms', label: 'motion frame processing' },
      { value: '100%', label: 'client-side privacy execution' },
    ],
    github: 'https://github.com/parthmandore/GymBuddy-AI-Trainer',
    palette: { from: '#2a0610', via: '#7a0f24', to: '#0b0710', accent: '#ff3d5a' },
    motif: 'shield',
  },
  {
    id: 'url-shortener',
    label: 'Java REST Service',
    title: 'URL Shortener Service',
    year: '2025',
    genre: 'Backend • Java • REST API',
    logline: 'A RESTful URL shortening service built with Java 17 and Spring Boot, utilizing Base62 encoding and a clean Controller-Service-Repository architecture.',
    stack: ['Java 17', 'Spring Boot', 'Spring Data JPA', 'H2 Database', 'REST APIs', 'Swagger'],
    build: [
      'Engineered a RESTful URL shortening API with Spring Boot converting long URLs into compact alphanumeric links via Base62 encoding.',
      'Structured the application using the Controller-Service-Repository pattern for clear separation of concerns and maintainability.',
      'Integrated Spring Data JPA with an in-memory H2 database for entity persistence, redirect routing, and click count telemetry.',
    ],
    features: [
      'Base62 alphanumeric short-code generation',
      'HTTP 302 URL redirection service',
      'URL click count analytics tracking',
      'Swagger UI interactive endpoint documentation',
      'Layered Controller-Service-Repository design',
    ],
    metrics: [
      { value: 'Base62', label: 'alphanumeric encoding' },
      { value: 'H2', label: 'in-memory entity persistence' },
      { value: '3-tier', label: 'layered architecture' },
      { value: 'CRUD', label: 'Spring Data JPA operations' },
      { value: 'Swagger', label: 'interactive API documentation' },
    ],
    github: 'https://github.com/parthmandore/url-shortener-api',
    palette: { from: '#1a0d02', via: '#8a4a07', to: '#0a0806', accent: '#ffb547' },
    motif: 'flow',
  },
  {
    id: 'career-ai-platform',
    label: 'Multi-Agent LLMs',
    title: 'Career AI Platform',
    year: '2025',
    genre: 'Multi-Agent AI • LLM • LangGraph',
    logline: 'An autonomous multi-agent career intelligence platform orchestrating resume analysis, skill-gap identification, and personalized learning roadmaps via LangGraph and Gemini.',
    stack: ['Python', 'LangGraph', 'Gemini API', 'React', 'Django REST', 'PostgreSQL', 'Docker'],
    build: [
      'Engineered a stateful multi-agent workflow using LangGraph to orchestrate collaborative LLM agents specialized in resume parsing, industry benchmarking, and roadmapping.',
      'Integrated Google Gemini API with structured output validation for deterministic resume assessment and skill-gap extraction.',
      'Developed RESTful endpoints with Django REST Framework and Docker containerization to deliver asynchronous career recommendations.',
    ],
    features: [
      'Multi-agent orchestration with LangGraph cyclic state graphs',
      'Automated resume parsing & industry skill-gap extraction',
      'Personalized step-by-step career learning roadmap generation',
      'LLM prompt caching & structured schema validation',
      'Containerized multi-service deployment with Docker',
    ],
    metrics: [
      { value: 'Multi-Agent', label: 'LangGraph graph coordination' },
      { value: 'Gemini', label: 'LLM reasoning engine' },
      { value: 'Async', label: 'background agent execution' },
      { value: 'REST', label: 'Django REST API endpoints' },
      { value: 'Docker', label: 'containerized services' },
    ],
    github: 'https://github.com/parthmandore/career-ai-platform',
    palette: { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' },
    motif: 'flow',
  },
  {
    id: 'mindpulse-ai',
    label: 'Machine Learning',
    title: 'MindPulse AI',
    year: '2025',
    genre: 'Machine Learning • Scikit-Learn • Analytics',
    logline: 'A machine learning system predicting employee burnout risk and workplace stress patterns using Random Forest regression and statistical health telemetry.',
    stack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Random Forest', 'Matplotlib'],
    build: [
      'Designed a predictive modeling pipeline using Scikit-Learn to evaluate workplace stress indicators and forecast burnout risk scores.',
      'Conducted exploratory data analysis, feature engineering, and cross-validation across lifestyle and workload attributes using Pandas and NumPy.',
      'Implemented Random Forest regression models with hyperparameter tuning to evaluate feature importances for early wellness intervention.',
    ],
    features: [
      'Burnout risk scoring & stress trend classification',
      'Feature importance analysis for workload factors',
      'Data preprocessing, scaling & imputation pipelines',
      'Model evaluation with RMSE, MAE & R² metrics',
      'Actionable wellness recommendations for high-risk flags',
    ],
    metrics: [
      { value: 'RandomForest', label: 'ensemble regression model' },
      { value: 'Scikit-Learn', label: 'ML pipeline & evaluation' },
      { value: 'Pandas', label: 'feature engineering & cleaning' },
      { value: 'k-Fold', label: 'cross-validation stability' },
      { value: 'Metrics', label: 'interpretable feature weights' },
    ],
    github: 'https://github.com/parthmandore/MindPulse-AI',
    palette: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
    motif: 'flow',
  },
  {
    id: 'message-filtering',
    label: 'Java Backend System',
    title: 'Message Filtering API',
    year: '2024',
    genre: 'Backend • Spring Boot • Data Security',
    logline: 'A backend application engineered to classify and filter suspicious messages using RESTful APIs, Spring Boot, and Spring Data JPA with MySQL persistence.',
    stack: ['Java', 'Spring Boot', 'Spring Data JPA', 'MySQL', 'RESTful APIs', 'Postman'],
    build: [
      'Built a backend application with Spring Boot and RESTful APIs to classify and filter suspicious message payloads based on content policies.',
      'Implemented the Controller-Service-Repository pattern to enforce clean, modular, and maintainable backend architecture.',
      'Integrated Spring Data JPA for database operations with MySQL and validated 15+ API endpoints using Postman with domain-driven exception handling.',
    ],
    features: [
      'Suspicious message classification & filtering rules',
      'Domain-driven service logic & exception handling',
      'Spring Data JPA entity & database management',
      '15+ REST API endpoints validated in Postman',
      'Controller-Service-Repository layered architecture',
    ],
    metrics: [
      { value: '15+', label: 'API endpoints validated' },
      { value: '3-tier', label: 'Controller-Service-Repository' },
      { value: 'JPA', label: 'MySQL entity management' },
      { value: 'REST', label: 'stateless API design' },
      { value: 'Postman', label: 'contract testing & debugging' },
    ],
    github: 'https://github.com/parthmandore',
    palette: { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' },
    motif: 'shield',
  },
  {
    id: 'mlops-rolling-pipeline',
    label: 'MLOps Pipeline',
    title: 'MLOps Batch Pipeline',
    year: '2024',
    genre: 'MLOps • Python • Docker • Data Engineering',
    logline: 'A containerized, reproducible batch processing pipeline computing rolling window statistical signals over financial market OHLCV data with automated logging.',
    stack: ['Python', 'Pandas', 'Docker', 'Logging', 'NumPy', 'Bash'],
    build: [
      'Developed an automated data engineering batch pipeline in Python computing rolling statistics and technical indicators over temporal time-series datasets.',
      'Containerized the processing job using Docker with isolated dependencies, volume mounts, and reproducible execution environments.',
      'Implemented robust structured logging, schema validation, and configurable rolling window parameters for production data reliability.',
    ],
    features: [
      'Rolling mean & statistical volatility computation',
      'Docker containerization for reproducible execution',
      'Configurable window sizes & parameters',
      'Structured logging & pipeline telemetry',
      'File system artifact export for downstream models',
    ],
    metrics: [
      { value: 'Docker', label: 'reproducible container' },
      { value: 'Pandas', label: 'vectorized window calculations' },
      { value: 'Batch', label: 'automated data pipeline' },
      { value: 'Logging', label: 'execution audit trail' },
      { value: 'Zero-Dep', label: 'portable environment' },
    ],
    github: 'https://github.com/parthmandore/mlops-rolling-mean-pipeline',
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'flow',
  },
  {
    id: 'gyan-app',
    label: 'Assistive EdTech',
    title: 'Gyan Learning App',
    year: '2025',
    genre: 'Mobile • EdTech • Accessibility • AI',
    logline: 'An assistive mobile learning application built with React Native and Expo, designed to empower children with dyslexia through multi-sensory phonics games, speech recognition, and accessible typography.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Zustand'],
    build: [
      'Developed an accessible mobile application utilizing Lexend typography, high-contrast visual cues, and multi-sensory feedback tailored for neurodivergent learners.',
      'Created interactive phonics and letter-tracing learning modules with audio-assisted pronunciation powered by speech synthesis and speech-to-text recognition.',
      'Built a scalable Node.js and Express backend with MongoDB for student learning progress tracking, assessment telemetry, and personalized study roadmaps.',
    ],
    features: [
      'Lexend dyslexia-friendly typeface & high-contrast themes',
      'Interactive phonics, letter tracing & reading games',
      'Audio pronunciation assistance & voice assessment',
      'Gamified progress tracking with streak & reward system',
      'Parent & educator analytics dashboard',
    ],
    metrics: [
      { value: 'Lexend', label: 'specialized dyslexia typography' },
      { value: 'Audio+UI', label: 'multi-sensory learning modes' },
      { value: 'Cross-Plat', label: 'React Native & Expo architecture' },
      { value: 'REST', label: 'Node.js & Express API' },
      { value: 'MongoDB', label: 'progress & telemetry store' },
    ],
    github: 'https://github.com/parthmandore/Gyan',
    palette: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
    motif: 'shield',
  },
  {
    id: 'spotify-clone',
    label: 'Frontend UI Clone',
    title: 'Spotify Player Clone',
    year: '2024',
    genre: 'Frontend • Web Audio • UI Engineering',
    logline: 'A responsive web application replicating Spotify\'s desktop player interface with playlist navigation, audio controls, seekbar manipulation, and CSS animations.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Web Audio API'],
    build: [
      'Engineered a responsive desktop and mobile clone of Spotify utilizing modern semantic HTML5 and modular CSS3 Flexbox/Grid layouts.',
      'Implemented JavaScript audio player controls including play/pause toggling, song selection, volume adjustment, and time-scrubbing progress bars.',
      'Replicated Spotify\'s signature dark theme aesthetic with smooth hover transitions, playlist cards, and sidebar navigation.',
    ],
    features: [
      'Interactive audio playback with seekbar scrubber',
      'Responsive desktop and mobile layout',
      'Playlist browsing and album card displays',
      'Dynamic play/pause state synchronization',
      'Spotify dark UI aesthetic with CSS custom styling',
    ],
    metrics: [
      { value: 'Vanilla', label: 'pure HTML5, CSS3 & JS' },
      { value: 'Audio API', label: 'browser media controls' },
      { value: 'Responsive', label: 'desktop & mobile layout' },
      { value: 'CSS3', label: 'modern flex & grid styling' },
      { value: 'Interactive', label: 'real-time progress scrubber' },
    ],
    github: 'https://github.com/parthmandore/Spotify_Clone',
    palette: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
    motif: 'tenants',
  },
  {
    id: 'portfolio-website',
    label: 'Portfolio Architecture',
    title: 'Personal Portfolio',
    year: '2024',
    genre: 'Frontend • Creative Development • Portfolio',
    logline: 'Parth\'s original interactive developer portfolio showcasing software engineering projects, verified technical skills, academic milestones, and downloadable resume.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    build: [
      'Created an interactive developer portfolio website to present personal background, engineering projects, and technical skills.',
      'Implemented custom responsive CSS styling, navigation menus, and clean modern card components optimized for recruiter evaluation.',
      'Integrated direct GitHub repository links, contact mechanisms, and downloadable resume assets.',
    ],
    features: [
      'Clean personal branding & developer profile',
      'Project showcase cards with direct GitHub links',
      'Interactive skill categorization & resume preview',
      'Responsive layouts across desktop, tablet, and mobile',
      'Lightweight vanilla architecture with fast load times',
    ],
    metrics: [
      { value: 'Vanilla', label: 'lightweight web foundation' },
      { value: '100%', label: 'responsive across devices' },
      { value: 'Fast', label: 'instant initial page load' },
      { value: 'Resume', label: 'integrated PDF preview' },
      { value: 'Clean', label: 'recruiter-friendly presentation' },
    ],
    github: 'https://github.com/parthmandore/parth-mandore-portfolio',
    palette: { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' },
    motif: 'shield',
  },
];

export type TopPick = Project;
export const topPicks = parthProjects;

/** Slides for the "▶ Play Intro" cinematic sequence. */
export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'Education',
    title: 'B.Tech · Comp Eng',
    lines: ['G. H. Raisoni College of Engineering & Management, Pune', '2023 – Present'],
    chips: ['CGPA 7.68', 'Graduation 2027'],
  },
  {
    kicker: 'Skills',
    title: 'Java & Backend first.',
    lines: ['Spring Boot, Python, TypeScript, React', 'PostgreSQL, MySQL, H2, Supabase, MediaPipe'],
    chips: ['Java', 'Spring Boot', 'Python', 'REST APIs', 'PostgreSQL'],
  },
  {
    kicker: 'Competition',
    title: 'Competitive Recognition',
    lines: ['Top 25 Finalist — National Level Ideathon 2025', 'Defended software architecture and practical implementation before senior industry juries'],
  },
  {
    kicker: 'Projects',
    title: 'Four Featured Projects',
    lines: ['RepoMentor AI — AST parsing, pgvector, local RAG', 'GymBuddy AI — 33 keypoints, MediaPipe pose tracking', 'URL Shortener — Base62 encoding, Spring Boot, JPA', 'Gyan App — assistive dyslexia learning & speech recognition'],
  },
  {
    kicker: 'Algorithms',
    title: 'Algorithmic Discipline',
    lines: ['150+ Problems Solved on LeetCode & Coding Platforms', 'Arrays, strings, trees, graphs, dynamic programming'],
  },
  {
    kicker: 'Vision',
    title: 'Engineering Philosophy',
    lines: ['"Building software with practical purpose and clean architecture."', 'Reliable application design, modular code, and thoughtful problem-solving'],
  },
  {
    kicker: 'Current mission',
    title: 'Now exploring',
    lines: ['Backend Systems · RESTful Services · Applied AI Systems'],
  },
];

export type ProfileId = 'parth' | 'recruiter' | 'developer' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'certifications' | 'story';

export const viewerProfiles: {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  order: SectionId[];
}[] = [
  {
    id: 'parth',
    name: 'Parth',
    blurb: 'The full series, in order',
    color: '#e5132b',
    order: ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'certifications', 'story'],
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    blurb: 'Resume, achievements & skills first',
    color: '#4cc9ff',
    order: ['story', 'moments', 'certifications', 'skills', 'originals', 'about', 'journey', 'picks'],
  },
  {
    id: 'developer',
    name: 'Developer',
    blurb: 'Projects, stack & GitHub first',
    color: '#46e3a8',
    order: ['originals', 'skills', 'journey', 'moments', 'certifications', 'about', 'picks', 'story'],
  },
  {
    id: 'creative',
    name: 'Creative',
    blurb: 'The story arc & highlights first',
    color: '#ffb547',
    order: ['journey', 'picks', 'originals', 'moments', 'certifications', 'about', 'skills', 'story'],
  },
];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'About', card: 'About Me', meta: 'The Pilot • Background & education', palette: violet },
  journey: { nav: 'Journey', card: 'My Journey', meta: `${seasons.length} Seasons • ${seasons.reduce((n, s) => n + s.episodes.length, 0)} Episodes`, palette: amber },
  originals: { nav: 'Featured', card: 'Featured Projects', meta: `${projects.length} Flagship Productions • 2024–2025`, palette: crimson },
  picks: { nav: 'Projects', card: "Parth's Projects", meta: `${parthProjects.length} Repositories · GitHub Showcase`, palette: jade },
  skills: { nav: 'Skills', card: 'My Skills', meta: `${skillCategories.length} Categories`, palette: ocean },
  moments: { nav: 'Milestones', card: 'Key Milestones', meta: `${achievements.length} Verified Milestones`, palette: crimson },
  certifications: { nav: 'Certificates', card: 'Certifications', meta: 'Industry Credentials', palette: ocean },
  story: { nav: 'Resume', card: 'The Full Story', meta: 'Resume • View & download', palette: violet },
};
