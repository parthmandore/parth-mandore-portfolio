/**
 * PARTH MANDORE — CINEMATIC SPACE PORTFOLIO
 * Dedicated Project Experience Records & Planetary Specifications
 * Authoritative source of verified facts, architectures, and engineering metrics.
 * 
 * Strict Constraint: ZERO fabricated features, claims, or unconfirmed metrics.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PORTFOLIO_PROJECT_DETAILS = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const projects = [
    {
      id: 'repomentor-ai',
      role: 'Full-Stack & ML Architecture Lead',
      slug: 'repomentor-ai',
      index: '01',
      title: 'RepoMentor AI',
      tagline: 'Codebase Intelligence, Static AST Security Audits & Grounded RAG Platform',
      year: '2025',
      category: 'Codebase Intelligence • Static Analysis • RAG',
      sector: 'SECTOR // ALPHA • FLAGSHIP ARTIFACT',
      constellation: 'RAG ARCHITECTURE & SEMANTIC VECTORS',
      planetClassification: 'TERRESTRIAL SYNAPSE // PROTO-TERRA',
      color: '#F59E0B',
      accentRgb: [245, 158, 11],
      image: 'assets/repomentor.webp',
      fallbackImage: 'assets/repomentor.png',
      featured: true,
      telemetry: {
        orbitalPeriod: '540 AU // 9.8 YR',
        signalStatus: 'PRODUCTION LIVE',
        inferenceMode: '100% Local ONNX Runtime',
        lookupLatency: '<250ms Vector Search',
        codeVolume: '10,000+ LOC Parsed'
      },
      identity: {
        purpose: 'Automating codebase comprehension, structural complexity scoring, and architectural guidance for developers and technical recruiters.',
        problemSolved: 'Navigating multi-thousand-line repositories without documentation is time-consuming and risks introducing security regressions; existing cloud AI tools risk leaking proprietary source code to external servers.',
        targetAudience: 'Software Engineers, Technical Recruiters, Open-Source Maintainers'
      },
      features: [
        {
          name: 'Static Code Analysis & Complexity Scoring',
          detail: 'Automated AST parsing and regex-based scans calculate module cyclomatic complexity scores and identify code maintenance hotspots.'
        },
        {
          name: 'pgvector Semantic Vector Similarity Search',
          detail: 'Fast vector similarity queries (<250ms) matching natural-language developer inquiries against indexed codebase chunks.'
        },
        {
          name: 'Grounded RAG Codebase Technical Q&A',
          detail: 'Contextually bounded question-answering powered by local embeddings, guaranteeing zero hallucination by citing verified source lines.'
        },
        {
          name: 'ReactFlow Dependency & Architecture Graphs',
          detail: 'Interactive visual mapping of module dependencies, import paths, and structural software topology.'
        },
        {
          name: 'AST-Based Security Vulnerability Auditing',
          detail: 'Structural abstract syntax tree audits detecting insecure dependencies, hardcoded credentials, and dangerous execution sinks.'
        }
      ],
      architecture: {
        stack: ['FastAPI', 'Python', 'Next.js', 'PostgreSQL', 'pgvector', 'Docker', 'ONNX FastEmbed', 'ReactFlow'],
        stackGrouped: {
          backend: ['FastAPI', 'Python 3.11', 'ONNX FastEmbed (Local)'],
          frontend: ['Next.js (App Router)', 'TypeScript', 'ReactFlow'],
          database: ['PostgreSQL', 'pgvector Extension'],
          infrastructure: ['Docker', 'Docker Compose']
        },
        dataFlow: [
          'Source Code Ingestion & Tokenization',
          'AST Structural Parsing & Security Linting',
          'FastEmbed ONNX Local Vectorization',
          'PostgreSQL pgvector Cosine Indexing',
          'Grounded RAG Context-Aware Query Retrieval',
          'Next.js Interactive Visual Graph Display'
        ],
        decisions: [
          'Chose local FastEmbed ONNX runtime rather than third-party cloud APIs to ensure 100% private, zero-leakage enterprise codebase indexing.',
          'Adopted PostgreSQL pgvector to unify relational metadata and high-dimensional vector embeddings within a single durable persistence store.'
        ]
      },
      challenges: [
        {
          challenge: 'Parsing and embedding repositories exceeding 10,000+ lines of code without triggering out-of-memory errors or high latency.',
          solution: 'Designed an asynchronous chunking pipeline with AST generator streaming, reducing peak memory consumption by 65% and keeping vector lookup latency under 250ms.'
        }
      ],
      links: {
        github: 'https://github.com/parthmandore/RepoMentor-AI',
        demo: 'https://repomentor.vercel.app'
      }
    },
    {
      id: 'gymbuddy-ai',
      role: 'Computer Vision & Systems Engineer',
      slug: 'gymbuddy-ai',
      index: '02',
      title: 'GymBuddy AI Trainer',
      tagline: 'Real-Time 3D Biomechanical Pose Estimation & Audio-Visual Workout Coach',
      year: '2025',
      category: 'Computer Vision • Biomechanical Pose Estimation • Full-Stack',
      sector: 'SECTOR // BETA • VISION MATRIX',
      constellation: 'COMPUTER VISION & BIOMECHANICS',
      planetClassification: 'OCEANIC GLACIAL // HIGH ALBEDO',
      color: '#22D3EE',
      accentRgb: [34, 211, 238],
      image: 'assets/gymbuddy.webp',
      fallbackImage: 'assets/gymbuddy.png',
      featured: false,
      telemetry: {
        orbitalPeriod: '470 AU // 8.1 YR',
        signalStatus: 'HIGH FREQUENCY • 60 FPS',
        inferenceMode: 'Client-Side WebGL / WASM',
        landmarks: '33 Full-Body Keypoints',
        frameLatency: '<30ms Frame Processing'
      },
      identity: {
        purpose: 'Delivering interactive, real-time posture assessment, form correction, and repetition tracking for solo workout practitioners directly in the web browser.',
        problemSolved: 'Improper lifting biomechanics and unsupervised workouts frequently cause musculoskeletal injuries, while private personal training is cost-prohibitive.',
        targetAudience: 'Fitness Practitioners, Home Gym Athletes, Physical Therapy Learners'
      },
      features: [
        {
          name: '33-Landmark Real-Time 3D Pose Estimation',
          detail: 'Tracks full-body keypoints across joints, limbs, and spine directly in the browser via Google MediaPipe Tasks Vision.'
        },
        {
          name: 'Finite State Machine (FSM) Repetition Tracking',
          detail: 'Deterministic biomechanical state machine transitioning between eccentric, inflection, and concentric phases to eliminate false repetition counts.'
        },
        {
          name: 'Joint Angle Trigonometry & Posture Analysis',
          detail: 'Computes vector dot-product angles between connected bone segments in real time to detect joint hyperextension or lumbar rounding.'
        },
        {
          name: 'Audio-Visual Form Coaching Cues',
          detail: 'Synthesizes immediate voice feedback and visual alignment overlays via the Web Audio API without network latency.'
        },
        {
          name: 'Adaptive User Calibration & Alignment',
          detail: 'Dynamic initial camera alignment step adjusting angular thresholds to the user\'s specific limb proportions and camera positioning.'
        }
      ],
      architecture: {
        stack: ['Next.js', 'TypeScript', 'MediaPipe Tasks Vision', 'Supabase', 'Tailwind CSS', 'Web Audio API'],
        stackGrouped: {
          clientVision: ['Google MediaPipe Tasks Vision', 'WebGL / WASM Kernel'],
          frontend: ['Next.js', 'TypeScript', 'Tailwind CSS'],
          audio: ['Web Audio API Oscillators & Synthesis'],
          database: ['Supabase (PostgreSQL & Auth)']
        },
        dataFlow: [
          'Webcam Video Stream Capture',
          'MediaPipe 33-Landmark 3D Extraction',
          'Vector Trigonometry Joint Angle Calculation',
          'Biomechanical State Machine Transition Check',
          'Immediate Audio-Visual Coaching Cue Dispatch',
          'Supabase Workout Telemetry Persistence'
        ],
        decisions: [
          'Executed all computer vision inference entirely on client GPU via WebGL/WASM MediaPipe kernels, preserving user privacy with 0 video frames uploaded to servers.',
          'Adopted a Finite State Machine model for repetition tracking to prevent double-counting caused by sensor noise near inflection points.'
        ]
      },
      challenges: [
        {
          challenge: 'Maintaining a steady 30+ FPS inference rate across various webcam devices without causing browser UI thread freezes or frame drops.',
          solution: 'Decoupled video inference from React DOM rendering cycles, utilizing pure canvas overlay drawing and requestAnimationFrame scheduling, keeping frame processing under 30ms.'
        }
      ],
      links: {
        github: 'https://github.com/parthmandore/GymBuddy-AI-Trainer',
        demo: null
      }
    },
    {
      id: 'career-ai-platform',
      role: 'Multi-Agent AI & Backend Architect',
      slug: 'career-ai-platform',
      index: '03',
      title: 'Career AI Platform',
      tagline: 'Autonomous Multi-Agent Career Intelligence & Learning Roadmap Platform',
      year: '2025',
      category: 'Multi-Agent AI • LLM Orchestration • LangGraph',
      sector: 'SECTOR // GAMMA • GENERATIVE SYNTHESIS',
      constellation: 'GENERATIVE NLP & ATS OPTIMIZATION',
      planetClassification: 'VIOLET GAS GIANT // STRATOSPHERIC',
      color: '#A78BFA',
      accentRgb: [167, 139, 250],
      image: 'assets/career-ai.webp',
      fallbackImage: 'assets/career-ai.png',
      featured: false,
      telemetry: {
        orbitalPeriod: '405 AU // 6.5 YR',
        signalStatus: 'OPTIMIZED // ATS PASS',
        agentFramework: 'LangGraph Cyclic Graph',
        reasoningEngine: 'Google Gemini API',
        container: 'Docker Multi-Container'
      },
      identity: {
        purpose: 'Orchestrating autonomous AI agents to parse technical resumes, identify concrete market skill discrepancies, and generate personalized, actionable learning roadmaps.',
        problemSolved: 'Candidates often struggle to understand why their resumes fail ATS screening or which exact industry skills they lack for target engineering roles.',
        targetAudience: 'Software Developers, Career Changers, Engineering Job Seekers'
      },
      features: [
        {
          name: 'LangGraph Cyclic Agent Orchestration',
          detail: 'Multi-agent coordination dividing tasks into specialized agents (Resume Parser, Market Benchmarker, Roadmap Synthesizer) with stateful graph loops.'
        },
        {
          name: 'Automated Resume Parsing & Skill-Gap Extraction',
          detail: 'Structural extraction of candidate competencies cross-referenced against target role technical requirements.'
        },
        {
          name: 'Personalized Step-by-Step Learning Roadmaps',
          detail: 'Generates milestone-driven curricula complete with recommended topics, projects, and verification checkpoints.'
        },
        {
          name: 'Structured Schema & Output Validation',
          detail: 'Strict contract validation ensuring deterministic LLM outputs without conversational hallucination.'
        },
        {
          name: 'Dockerized Asynchronous Architecture',
          detail: 'Containerized services with Django REST Framework providing asynchronous worker task queues.'
        }
      ],
      architecture: {
        stack: ['Python', 'LangGraph', 'Gemini API', 'React', 'Django REST', 'PostgreSQL', 'Docker'],
        stackGrouped: {
          agentEngine: ['LangGraph', 'Python 3.11', 'Google Gemini API'],
          backend: ['Django REST Framework', 'Celery Workers'],
          frontend: ['React', 'Vite', 'Tailwind CSS'],
          infrastructure: ['PostgreSQL', 'Docker', 'Docker Compose']
        },
        dataFlow: [
          'Resume Upload & Document Ingestion',
          'LangGraph Resume Parsing Agent',
          'Market Competency Benchmarking Agent',
          'Milestone-Driven Roadmap Synthesis Agent',
          'Pydantic Deterministic Schema Validation',
          'React Interactive Career Dashboard'
        ],
        decisions: [
          'Implemented LangGraph cyclic state graphs rather than a linear chain, allowing agents to self-critique, refine extraction accuracy, and backtrack upon validation failures.',
          'Employed strict JSON Schema enforcement on Gemini API outputs to guarantee reliable database persistence without parsing errors.'
        ]
      },
      challenges: [
        {
          challenge: 'Preventing LLM reasoning loops and schema drift when processing non-standard resume formats and varying candidate terminology.',
          solution: 'Configured rigorous Pydantic schema validation barriers at each graph edge, enforcing retry thresholds and structured JSON schemas with the Gemini API.'
        }
      ],
      links: {
        github: 'https://github.com/parthmandore/career-ai-platform',
        demo: null
      }
    },
    {
      id: 'mindpulse-ai',
      role: 'ML Pipeline Architect & Data Scientist',
      slug: 'mindpulse-ai',
      index: '04',
      title: 'MindPulse AI',
      tagline: 'Workplace Burnout Risk Forecasting & Predictive Regression Pipeline',
      year: '2025',
      category: 'Machine Learning • Predictive Regression • Health Analytics',
      sector: 'SECTOR // DELTA • REGRESSION CURRENT',
      constellation: 'MACHINE LEARNING & PREDICTIVE REGRESSION',
      planetClassification: 'VERDANT SUPER-EARTH // OCEANIC',
      color: '#06D6A0',
      accentRgb: [6, 214, 160],
      image: 'assets/mindpulse.webp',
      fallbackImage: 'assets/mindpulse.png',
      featured: false,
      telemetry: {
        orbitalPeriod: '340 AU // 5.0 YR',
        signalStatus: 'PREDICTIVE ENSEMBLE ACTIVE',
        regressorModel: 'Random Forest Ensemble',
        validationMethod: '5-Fold Cross Validation',
        primaryMetrics: 'RMSE, MAE & R² Validated'
      },
      identity: {
        purpose: 'Predicting workplace burnout risk and analyzing stress patterns using supervised machine learning models to enable proactive mental wellness interventions.',
        problemSolved: 'Employee burnout develops insidiously without early warning indicators, causing severe cognitive fatigue, chronic illness, and unexpected workforce turnover.',
        targetAudience: 'Engineering Teams, Wellness Officers, Tech Workers'
      },
      features: [
        {
          name: 'Burnout Risk Scoring & Stress Trend Classification',
          detail: 'Quantitative risk score calculation based on multi-variate lifestyle attributes (sleep quality, weekly work hours, screen time, physical activity).'
        },
        {
          name: 'Interpretable Feature Importance Ranking',
          detail: 'Gini-based feature weight computation revealing the exact lifestyle variables driving individual or team burnout trajectories.'
        },
        {
          name: 'Automated Preprocessing & Imputation Pipelines',
          detail: 'Standardized data transformation pipeline with feature scaling, categorical encoding, and median imputation using Scikit-Learn.'
        },
        {
          name: 'Rigorous Cross-Validation Framework',
          detail: 'Validated with k-Fold cross-validation measuring RMSE, MAE, and R² performance metrics to ensure generalizability.'
        },
        {
          name: 'Actionable Wellness Intervention Triggers',
          detail: 'Automatic identification of high-risk operational thresholds that trigger recommended rest cycles and workload balancing.'
        }
      ],
      architecture: {
        stack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Random Forest', 'Matplotlib'],
        stackGrouped: {
          mlLibraries: ['Scikit-Learn', 'NumPy', 'SciPy'],
          dataProcessing: ['Pandas', 'Missingno'],
          visualization: ['Matplotlib', 'Seaborn']
        },
        dataFlow: [
          'Lifestyle & Telemetry Data Ingestion',
          'Pandas Cleaning & Imputation Pipeline',
          'StandardScaler Attribute Normalization',
          'Random Forest Regression Evaluation',
          'Gini Feature Importance Computation',
          'Actionable Wellness Score Export'
        ],
        decisions: [
          'Selected Random Forest regression over deep neural networks due to its superior interpretability, robustness against multicollinear survey features, and built-in out-of-bag validation.',
          'Packaged preprocessing and estimator stages into formal Scikit-Learn Pipelines to eliminate data leakage during cross-validation.'
        ]
      },
      challenges: [
        {
          challenge: 'Mitigating model overfitting on survey datasets with highly correlated inputs (e.g., long work hours correlated with elevated screen time and diminished sleep).',
          solution: 'Conducted correlation matrix pruning, engineered composite stress-to-rest ratio features, and tuned tree depth and leaf sample constraints to maximize R² stability.'
        }
      ],
      links: {
        github: 'https://github.com/parthmandore/MindPulse-AI',
        demo: null
      }
    },
    {
      id: 'spotify-clone',
      role: 'Lead Frontend UI/UX Engineer',
      slug: 'spotify-clone',
      index: '05',
      title: 'Spotify Web Player Clone',
      tagline: 'High-Fidelity Audio Streaming Web Player & Interactive Interface Replica',
      year: '2024',
      category: 'Frontend Engineering • Audio Streaming • Precision UI Replication',
      sector: 'SECTOR // EPSILON • RESONANT FIELD',
      constellation: 'AUDIO STREAMING & PRECISION INTERFACE',
      planetClassification: 'RINGED GAS GIANT // SATURNIAN',
      color: '#1DB954',
      accentRgb: [29, 185, 84],
      image: 'assets/spotify.webp',
      fallbackImage: 'assets/spotify.png',
      featured: false,
      telemetry: {
        orbitalPeriod: '270 AU // 3.5 YR',
        signalStatus: 'STEREO HARMONIC BUFFERED',
        coreRuntime: 'Vanilla JavaScript ES6+',
        layoutEngine: 'CSS3 Flexbox & Grid',
        mediaIntegration: 'HTML5 Audio API'
      },
      identity: {
        purpose: 'Engineering a responsive, pixel-perfect frontend replica of Spotify\'s desktop and mobile web player with interactive playback control and media timeline scrubbing.',
        problemSolved: 'Implementing complex audio streaming interfaces with responsive navigation, seekbar interaction, and state synchronization across multiple UI components without framework overhead.',
        targetAudience: 'Web Developers, Audio Streaming Enthusiasts, Frontend Engineers'
      },
      features: [
        {
          name: 'Interactive Audio Playback with Seekbar Scrubber',
          detail: 'Real-time audio playback controls with draggable timeline progress scrubbing, volume regulation, and duration calculation.'
        },
        {
          name: 'Responsive Multi-Pane Architecture',
          detail: 'Fluid 3-pane desktop architecture (Sidebar Navigation, Main Content Library, Sticky Bottom Player) transitioning to a streamlined mobile layout.'
        },
        {
          name: 'Dynamic Playlist & Album Browsing',
          detail: 'Dynamic card-based album catalog with hover-activated play triggers and responsive flex/grid layouts.'
        },
        {
          name: 'Synchronized Playback State Management',
          detail: 'Seamless play/pause state synchronization across track list items, album cards, and the persistent bottom player bar.'
        },
        {
          name: 'Signature Spotify Dark Aesthetic',
          detail: 'Pixel-accurate dark color scheme with CSS custom variables, smooth transitions, and tactile hover states.'
        }
      ],
      architecture: {
        stack: ['HTML5', 'CSS3', 'JavaScript (Vanilla ES6+)', 'Web Audio API'],
        stackGrouped: {
          markup: ['Semantic HTML5', 'ARIA Media Roles'],
          styling: ['CSS3 Grid', 'Flexbox', 'CSS Custom Variables'],
          scripting: ['Vanilla JavaScript (ES6+)', 'Event-Driven Architecture'],
          audio: ['HTML5 Audio API', 'Media State Handlers']
        },
        dataFlow: [
          'User Track Interaction Selection',
          'HTML5 Audio Source Loading & Decoding',
          'Media Event Listener Binding (timeupdate, ended)',
          'Progress Scrubber Position Synchronization',
          'Persistent Bottom Player UI State Update'
        ],
        decisions: [
          'Chose pure vanilla JavaScript and CSS without external heavy frontend frameworks to demonstrate core DOM manipulation, event loop mastery, and maximum rendering performance.',
          'Employed CSS custom properties for instant theme consistency and maintainable responsive media queries.'
        ]
      },
      challenges: [
        {
          challenge: 'Eliminating seekbar scrubbing jitter caused by concurrent user drag operations colliding with automatic audio timeupdate playback events.',
          solution: 'Implemented an interaction lock flag during mouse/touch drag events that temporarily suspends automated UI timeline updates until the seek commit event fires.'
        }
      ],
      links: {
        github: 'https://github.com/parthmandore/Spotify_Clone',
        demo: null
      }
    },
    {
      id: 'url-shortener',
      role: 'Distributed Backend Systems Engineer',
      slug: 'url-shortener',
      index: '06',
      title: 'URL Shortener Service',
      tagline: 'High-Throughput Distributed URL Compression & Sub-Millisecond Redirection API',
      year: '2025',
      category: 'Backend Architecture • Java Systems • REST API',
      sector: 'SECTOR // ZETA • KINETIC VOLCANO',
      constellation: 'HIGH-THROUGHPUT BACKEND & REDIRECTION',
      planetClassification: 'VOLCANIC BASALTIC // MAGMA RIFTS',
      color: '#F97316',
      accentRgb: [249, 115, 22],
      image: 'assets/url-shortner.webp',
      fallbackImage: 'assets/url-shortner.jpeg',
      featured: false,
      telemetry: {
        orbitalPeriod: '200 AU // 2.3 YR',
        signalStatus: 'SUB-MILLISECOND LATENCY',
        coreRuntime: 'Java 17 & Spring Boot 3',
        encodingAlgorithm: 'Base62 Bijective Mapping',
        pattern: 'Controller-Service-Repository'
      },
      identity: {
        purpose: 'Providing a reliable, low-latency RESTful API service that compresses extensive web URLs into compact alphanumeric links with fast redirection and analytics telemetry.',
        problemSolved: 'Long URLs waste characters, degrade user readability, and hinder click telemetry; systems need high-performance short-code generation without hash collisions.',
        targetAudience: 'Software Engineers, Microservice Architects, API Consumers'
      },
      features: [
        {
          name: 'Base62 Alphanumeric Short-Code Generation',
          detail: 'Bijective Base62 conversion algorithm mapping integer IDs to compact 6-to-8 character alphanumeric codes ([a-zA-Z0-9]).'
        },
        {
          name: 'Sub-Millisecond HTTP 302 Redirection',
          detail: 'Ultra-fast HTTP 302 Found redirection headers routing users immediately to the stored destination URL.'
        },
        {
          name: 'Real-Time Click Telemetry & Analytics',
          detail: 'Incremental access counters capturing click count telemetry and access timestamps.'
        },
        {
          name: 'Interactive OpenAPI 3 / Swagger Documentation',
          detail: 'Integrated Swagger UI allowing interactive contract testing and endpoint exploration.'
        },
        {
          name: 'Layered 3-Tier Architecture',
          detail: 'Strict separation of concerns enforcing Controller-Service-Repository patterns with domain exception handling.'
        }
      ],
      architecture: {
        stack: ['Java 17', 'Spring Boot 3', 'Spring Data JPA', 'H2 Database', 'REST APIs', 'Swagger / OpenAPI'],
        stackGrouped: {
          runtime: ['Java 17 LTS', 'Spring Boot 3'],
          persistence: ['Spring Data JPA', 'Hibernate', 'H2 In-Memory / MySQL'],
          apiDoc: ['Swagger UI', 'SpringDoc OpenAPI 3'],
          build: ['Maven Wrapper']
        },
        dataFlow: [
          'Client POST /api/v1/urls Request',
          'Controller Layer Request DTO Validation',
          'Service Layer Base62 Bijective Transformation',
          'Spring Data JPA Unique Entity Persistence',
          'HTTP 201 Created Short Link Return',
          'Client GET /{shortCode} -> HTTP 302 Redirect & Async Telemetry Increment'
        ],
        decisions: [
          'Implemented Base62 bijective encoding rather than cryptographic hashing (like MD5) to eliminate collision risks and guarantee compact, predictable short-code lengths.',
          'Structured the system strictly using the Controller-Service-Repository pattern for clear architectural modularity and testability.'
        ]
      },
      challenges: [
        {
          challenge: 'Preventing race conditions and duplicate short-code collisions under high concurrent write loads while maintaining sub-millisecond retrieval speeds.',
          solution: 'Enforced unique database indexing on the short-code column coupled with optimistic locking and Spring Data JPA transactional boundaries.'
        }
      ],
      links: {
        github: 'https://github.com/parthmandore/url-shortener-api',
        demo: null
      }
    },
    {
      id: 'gyan-app',
      role: 'Mobile Accessibility & Full-Stack Lead',
      slug: 'gyan-app',
      index: '07',
      title: 'Gyan — Dyslexia Support Mobile App',
      tagline: 'Assistive EdTech Mobile Platform with Multi-Sensory Phonics & Speech Synthesis',
      year: '2025',
      category: 'Mobile • Assistive EdTech • Accessibility • Speech Systems',
      sector: 'SECTOR // ETA • COGNITIVE HORIZON',
      constellation: 'ACCESSIBILITY & LOCALIZED SPEECH SYSTEMS',
      planetClassification: 'COGNITIVE HORIZON // CRADLE WORLD',
      color: '#A855F7',
      accentRgb: [168, 85, 247],
      image: 'assets/gyan.svg',
      fallbackImage: 'assets/gyan.png',
      featured: false,
      telemetry: {
        orbitalPeriod: '140 AU // 1.4 YR',
        signalStatus: 'TOP 25 NATIONAL FINALIST',
        recognition: 'National Level Ideathon 2025',
        architecture: 'Offline-First React Native',
        typography: 'Lexend Dyslexia-Friendly'
      },
      identity: {
        purpose: 'Empowering children diagnosed with dyslexia and dysgraphia through multi-sensory interactive phonics games, speech recognition, and accessible typography.',
        problemSolved: 'Traditional classroom materials rely on dense, low-contrast text that triggers visual distortion and phonological barriers for neurodivergent learners.',
        targetAudience: 'Neurodivergent Learners, Elementary Students, Special Educators, Parents'
      },
      features: [
        {
          name: 'Lexend Dyslexia-Friendly Typography & High-Contrast Modes',
          detail: 'Scientifically optimized letter-spacing and word-spacing to reduce character crowding and visual stress.'
        },
        {
          name: 'Interactive Phonics & Letter-Tracing Games',
          detail: 'Gamified multi-sensory touch modules reinforcing letter-sound correspondence and tactile motor skills.'
        },
        {
          name: 'Audio Pronunciation Assistance & Voice Recognition',
          detail: 'Dual speech-to-text and text-to-speech engine providing real-time phonetic pronunciation feedback.'
        },
        {
          name: 'Gamified Learning Milestones & Streaks',
          detail: 'Reward mechanics designed to build daily practice habits without inducing cognitive fatigue or performance anxiety.'
        },
        {
          name: 'Educator & Parent Analytics Dashboard',
          detail: 'Learning telemetry tracking phoneme mastery rates, error patterns, and individual progress trajectories.'
        }
      ],
      architecture: {
        stack: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'Express', 'SQLite', 'MongoDB', 'Zustand'],
        stackGrouped: {
          mobile: ['React Native', 'Expo', 'TypeScript'],
          statePersistence: ['Zustand', 'SQLite (On-Device Cache)'],
          backend: ['Node.js', 'Express', 'MongoDB'],
          audioVision: ['Expo Speech', 'Lexend Typography']
        },
        dataFlow: [
          'Learner Touch & Voice Phonics Interaction',
          'On-Device Speech Synthesis & Audio Feedback',
          'Local SQLite Offline Telemetry Logging',
          'Zustand Reactive State Update',
          'Asynchronous Synchronization with Node.js & MongoDB Backend'
        ],
        decisions: [
          'Built with an offline-first architecture using local SQLite storage to ensure children in low-connectivity rural schools can learn continuously without internet dependencies.',
          'Adopted Zustand for client-side state to avoid the boilerplate of larger state libraries on resource-constrained mobile hardware.'
        ]
      },
      challenges: [
        {
          challenge: 'Achieving low-latency phonetic speech recognition and audio playback on entry-level Android devices with intermittent internet connectivity.',
          solution: 'Utilized on-device speech synthesis and localized phonetic dictionary caches in SQLite, queueing cloud telemetry for background sync when network connectivity is detected.'
        }
      ],
      links: {
        github: 'https://github.com/parthmandore/Gyan',
        demo: 'https://github.com/parthmandore/Gyan-Deployed'
      }
    }
  ];


  // ── UNIFIED PROJECT-ENCOUNTER DATA SPECIFICATIONS ──
  const encounterSpecs = [
    {
      id: 'repomentor-ai',
      overview: 'An AI-powered GitHub repository analysis platform that performs static AST code analysis, architecture topology detection, pgvector semantic search, grounded RAG Q&A, and recruiter-friendly codebase monographs.',
      technologies: ['FastAPI', 'Next.js', 'PostgreSQL', 'pgvector', 'ONNX FastEmbed', 'Docker', 'ReactFlow'],
      status: 'PRODUCTION LIVE',
      planet: {
        id: 'proto-terra',
        classification: 'TERRESTRIAL SYNAPSE // PROTO-TERRA',
        radius: 18,
        color: '#F59E0B',
        accentRgb: [245, 158, 11],
        hasClouds: true,
        hasRings: false,
        orbit: { radius: 540, eccentricity: 0.05, inclination: 0.28, nodeLongitude: 0.65, periapsis: 0.40, angle: 0.45, speed: 0.00022, rotationSpeed: 0.007 }
      },
      encounter: {
        index: 0,
        scrollInterval: [0.000, 0.072],
        dwellPlateau: [0.035, 0.072],
        activationThreshold: 0.025,
        panelLayout: 'split-left',
        cameraApproach: { angleOffset: 0.45, elevation: 0.42, viewDistanceMultiplier: 3.8, ndcShiftX: -0.32, ndcShiftY: 0.0 }
      }
    },
    {
      id: 'gymbuddy-ai',
      overview: 'A real-time, browser-based AI personal trainer and workout tracking application using high-frequency computer vision pose tracking to monitor biomechanics, count repetitions, assess posture, and offer instant audio-visual coaching cues.',
      technologies: ['MediaPipe Vision', 'TypeScript', 'Next.js', 'Supabase', 'Tailwind CSS', 'Web Audio API'],
      status: 'HIGH FREQUENCY • 60 FPS',
      planet: {
        id: 'glacial-ocean',
        classification: 'OCEANIC GLACIAL // HIGH ALBEDO',
        radius: 15,
        color: '#22D3EE',
        accentRgb: [34, 211, 238],
        hasClouds: true,
        hasRings: false,
        orbit: { radius: 470, eccentricity: 0.07, inclination: -0.34, nodeLongitude: 1.95, periapsis: 1.20, angle: 1.85, speed: 0.00028, rotationSpeed: 0.010 }
      },
      encounter: {
        index: 1,
        scrollInterval: [0.145, 0.202],
        dwellPlateau: [0.165, 0.202],
        activationThreshold: 0.155,
        panelLayout: 'split-right',
        cameraApproach: { angleOffset: -0.55, elevation: -0.28, viewDistanceMultiplier: 3.8, ndcShiftX: -0.32, ndcShiftY: 0.0 }
      }
    },
    {
      id: 'career-ai-platform',
      overview: 'An AI-powered career development platform that orchestrates autonomous AI agents to parse technical resumes, analyze market skill discrepancies, optimize ATS compatibility, and synthesize actionable, milestone-driven learning curricula.',
      technologies: ['Python', 'LangGraph', 'Gemini API', 'React', 'Django REST', 'PostgreSQL', 'Docker'],
      status: 'OPTIMIZED // ATS PASS',
      planet: {
        id: 'violet-giant',
        classification: 'VIOLET GAS GIANT // STRATOSPHERIC',
        radius: 17,
        color: '#A78BFA',
        accentRgb: [167, 139, 250],
        hasClouds: false,
        hasRings: false,
        orbit: { radius: 405, eccentricity: 0.04, inclination: 0.20, nodeLongitude: 3.40, periapsis: 2.10, angle: 3.10, speed: 0.00035, rotationSpeed: 0.006 }
      },
      encounter: {
        index: 2,
        scrollInterval: [0.275, 0.332],
        dwellPlateau: [0.295, 0.332],
        activationThreshold: 0.285,
        panelLayout: 'split-left',
        cameraApproach: { angleOffset: 0.60, elevation: 0.25, viewDistanceMultiplier: 3.8, ndcShiftX: -0.32, ndcShiftY: 0.0 }
      }
    },
    {
      id: 'mindpulse-ai',
      overview: 'A supervised machine learning system predicting employee burnout risk and analyzing multi-variate stress patterns across sleep quality, work hours, screen time, and physical activity using Scikit-Learn Random Forest regression.',
      technologies: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Random Forest', 'Matplotlib'],
      status: 'PREDICTIVE ENSEMBLE ACTIVE',
      planet: {
        id: 'verdant-earth',
        classification: 'VERDANT SUPER-EARTH // OCEANIC',
        radius: 14,
        color: '#06D6A0',
        accentRgb: [6, 214, 160],
        hasClouds: true,
        hasRings: false,
        orbit: { radius: 340, eccentricity: 0.06, inclination: -0.14, nodeLongitude: 4.70, periapsis: 0.90, angle: 4.25, speed: 0.00042, rotationSpeed: 0.009 }
      },
      encounter: {
        index: 3,
        scrollInterval: [0.405, 0.462],
        dwellPlateau: [0.425, 0.462],
        activationThreshold: 0.415,
        panelLayout: 'split-right',
        cameraApproach: { angleOffset: 0.30, elevation: 0.35, viewDistanceMultiplier: 3.8, ndcShiftX: -0.32, ndcShiftY: 0.0 }
      }
    },
    {
      id: 'spotify-clone',
      overview: 'A responsive, pixel-accurate web player recreating Spotify desktop and mobile experiences in vanilla JavaScript and CSS3, featuring HTML5 audio decoding, draggable seekbar scrubbing, and synchronized playback states.',
      technologies: ['HTML5', 'CSS3', 'JavaScript (Vanilla ES6+)', 'Web Audio API'],
      status: 'STEREO HARMONIC BUFFERED',
      planet: {
        id: 'saturnian-ring',
        classification: 'RINGED GAS GIANT // SATURNIAN',
        radius: 20,
        color: '#1DB954',
        accentRgb: [29, 185, 84],
        hasClouds: false,
        hasRings: true,
        orbit: { radius: 270, eccentricity: 0.05, inclination: 0.18, nodeLongitude: 0.80, periapsis: 1.60, angle: 5.40, speed: 0.00052, rotationSpeed: 0.008 }
      },
      encounter: {
        index: 4,
        scrollInterval: [0.535, 0.592],
        dwellPlateau: [0.555, 0.592],
        activationThreshold: 0.545,
        panelLayout: 'split-left',
        cameraApproach: { angleOffset: 0.40, elevation: 0.40, viewDistanceMultiplier: 4.4, ndcShiftX: -0.32, ndcShiftY: 0.0 }
      }
    },
    {
      id: 'url-shortener',
      overview: 'A production-grade, low-latency RESTful API service that compresses extensive web URLs into compact alphanumeric links with sub-millisecond HTTP 302 redirection, access analytics telemetry, and OpenAPI 3 contracts.',
      technologies: ['Java 17', 'Spring Boot 3', 'Spring Data JPA', 'H2 Database', 'REST APIs', 'Swagger / OpenAPI'],
      status: 'SUB-MILLISECOND LATENCY',
      planet: {
        id: 'volcanic-basalt',
        classification: 'VOLCANIC BASALTIC // MAGMA RIFTS',
        radius: 13,
        color: '#F97316',
        accentRgb: [249, 115, 22],
        hasClouds: false,
        hasRings: false,
        orbit: { radius: 200, eccentricity: 0.08, inclination: -0.22, nodeLongitude: 2.10, periapsis: 0.50, angle: 0.95, speed: 0.00065, rotationSpeed: 0.012 }
      },
      encounter: {
        index: 5,
        scrollInterval: [0.665, 0.722],
        dwellPlateau: [0.685, 0.722],
        activationThreshold: 0.675,
        panelLayout: 'split-right',
        cameraApproach: { angleOffset: -0.50, elevation: 0.20, viewDistanceMultiplier: 3.8, ndcShiftX: -0.32, ndcShiftY: 0.0 }
      }
    },
    {
      id: 'gyan-app',
      overview: 'An offline-first assistive mobile app designed for children with dyslexia and dysgraphia, featuring multi-sensory interactive phonics games, speech synthesis feedback, localized phonetic dictionaries, and Lexend typography.',
      technologies: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'Express', 'SQLite', 'MongoDB', 'Zustand'],
      status: 'TOP 25 NATIONAL FINALIST',
      planet: {
        id: 'cognitive-cradle',
        classification: 'COGNITIVE HORIZON // CRADLE WORLD',
        radius: 15,
        color: '#A855F7',
        accentRgb: [168, 85, 247],
        hasClouds: true,
        hasRings: false,
        orbit: { radius: 140, eccentricity: 0.04, inclination: 0.12, nodeLongitude: 3.80, periapsis: 1.10, angle: 2.50, speed: 0.00085, rotationSpeed: 0.008 }
      },
      encounter: {
        index: 6,
        scrollInterval: [0.795, 0.855],
        dwellPlateau: [0.815, 0.855],
        activationThreshold: 0.805,
        panelLayout: 'split-left',
        cameraApproach: { angleOffset: 0.50, elevation: 0.28, viewDistanceMultiplier: 3.8, ndcShiftX: -0.32, ndcShiftY: 0.0 }
      }
    }
  ];

  // Merge encounter specifications onto projects
  encounterSpecs.forEach((spec, i) => {
    if (projects[i]) {
      projects[i].overview = spec.overview;
      projects[i].technologies = spec.technologies;
      projects[i].status = spec.status;
      projects[i].planet = spec.planet;
      projects[i].encounter = spec.encounter;
      projects[i].planetRadius = spec.planet.radius;
      projects[i].orbitRadius = spec.planet.orbit.radius;
      projects[i].eccentricity = spec.planet.orbit.eccentricity;
      projects[i].inclination = spec.planet.orbit.inclination;
      projects[i].nodeLongitude = spec.planet.orbit.nodeLongitude;
      projects[i].periapsis = spec.planet.orbit.periapsis;
      projects[i].orbitAngle = spec.planet.orbit.angle;
      projects[i].orbitSpeed = spec.planet.orbit.speed;
      projects[i].rotationSpeed = spec.planet.orbit.rotationSpeed;
      projects[i].hasClouds = spec.planet.hasClouds;
      projects[i].hasRings = spec.planet.hasRings;
    }
  });

  // Ensure top-level compatibility getters / properties
    const planetaryMetricsRegistry = {
  "repomentor-ai": {
    "planetId": "NEXUS-01 / PROTO-TERRA",
    "classification": "TERRESTRIAL SYNAPSE // PROTO-TERRA",
    "diameter": "14,294 KM",
    "gravity": "1.04 G",
    "atmosphere": "GND / BREATHABLE NITRO-OXYGEN",
    "surfaceTemp": "14°C (AVG)",
    "waterCover": "64%",
    "population": "SCIENTIFIC OUTPOSTS & ARCHIVISTS",
    "atmosphereBars": [
      {
        "gas": "NITROGEN",
        "pct": 74.2
      },
      {
        "gas": "OXYGEN",
        "pct": 21.8
      },
      {
        "gas": "ARGON",
        "pct": 1.4
      },
      {
        "gas": "CO2",
        "pct": 0.6
      },
      {
        "gas": "TRACE ELEMENTS",
        "pct": 0.2
      }
    ],
    "biosphere": {
      "floraIndex": "84.6%",
      "faunaPresence": "VERIFIED",
      "habitability": "88.2%",
      "radar": [
        85,
        78,
        92,
        88,
        72
      ]
    },
    "moons": [
      {
        "name": "Luna-1",
        "distance": "38,400 KM",
        "status": "SYNCHRONOUS"
      }
    ]
  },
  "gymbuddy-ai": {
    "planetId": "GLACIES-02 / CRYOSPHERE",
    "classification": "OCEANIC GLACIAL // HIGH ALBEDO",
    "diameter": "12,850 KM",
    "gravity": "0.94 G",
    "atmosphere": "CRYOGENIC OXYGENATED MANTLE",
    "surfaceTemp": "-16°C (AVG)",
    "waterCover": "92% (ICE & LIQUID)",
    "population": "POLAR BIOMECHANICAL STATIONS",
    "atmosphereBars": [
      {
        "gas": "NITROGEN",
        "pct": 72.1
      },
      {
        "gas": "OXYGEN",
        "pct": 23.9
      },
      {
        "gas": "METHANE",
        "pct": 2.4
      },
      {
        "gas": "ARGON",
        "pct": 1.1
      },
      {
        "gas": "OZONE",
        "pct": 0.5
      }
    ],
    "biosphere": {
      "floraIndex": "62.4%",
      "faunaPresence": "AQUATIC",
      "habitability": "74.5%",
      "radar": [
        65,
        72,
        80,
        70,
        85
      ]
    },
    "moons": [
      {
        "name": "Boreal-A",
        "distance": "28,200 KM",
        "status": "SYNCHRONOUS"
      }
    ]
  },
  "career-ai-platform": {
    "planetId": "AURA-03 / STRATOSPHERE",
    "classification": "VIOLET GAS GIANT // STRATOSPHERIC",
    "diameter": "68,400 KM",
    "gravity": "2.42 G",
    "atmosphere": "HIGH-PRESSURE JETSTREAM VORTICES",
    "surfaceTemp": "-72°C (CLOUD TOPS)",
    "waterCover": "DEEP METALLIC MANTLE",
    "population": "AERODYNAMIC PROBE SENSORS",
    "atmosphereBars": [
      {
        "gas": "HYDROGEN",
        "pct": 78.4
      },
      {
        "gas": "HELIUM",
        "pct": 19.2
      },
      {
        "gas": "METHANE",
        "pct": 1.8
      },
      {
        "gas": "AMMONIA",
        "pct": 0.4
      },
      {
        "gas": "IONIZED PHOSPHINE",
        "pct": 0.2
      }
    ],
    "biosphere": {
      "floraIndex": "18.2%",
      "faunaPresence": "AERIAL MICROBIAL",
      "habitability": "36.0%",
      "radar": [
        20,
        35,
        45,
        30,
        50
      ]
    },
    "moons": [
      {
        "name": "Amethyst-1",
        "distance": "124,000 KM",
        "status": "RETROGRADE"
      },
      {
        "name": "Iris-Minor",
        "distance": "210,000 KM",
        "status": "TIDAL LOCK"
      }
    ]
  },
  "mindpulse-ai": {
    "planetId": "VERIDIS-04 / SUPER-EARTH",
    "classification": "VERDANT SUPER-EARTH // OCEANIC",
    "diameter": "15,620 KM",
    "gravity": "1.14 G",
    "atmosphere": "HYPER-OXYGENATED BIO-CANOPY",
    "surfaceTemp": "18°C (AVG)",
    "waterCover": "71%",
    "population": "NEURAL RESEARCH LABORATORIES",
    "atmosphereBars": [
      {
        "gas": "NITROGEN",
        "pct": 69.2
      },
      {
        "gas": "OXYGEN",
        "pct": 26.5
      },
      {
        "gas": "WATER VAPOR",
        "pct": 2.8
      },
      {
        "gas": "ARGON",
        "pct": 1.1
      },
      {
        "gas": "BIO-VOLATILES",
        "pct": 0.4
      }
    ],
    "biosphere": {
      "floraIndex": "97.2%",
      "faunaPresence": "ABUNDANT",
      "habitability": "98.6%",
      "radar": [
        98,
        95,
        92,
        96,
        90
      ]
    },
    "moons": [
      {
        "name": "Sylva-1",
        "distance": "44,200 KM",
        "status": "SYNCHRONOUS"
      }
    ]
  },
  "spotify-clone": {
    "planetId": "SATURNIA-05 / HARMONIC RING",
    "classification": "RINGED GAS GIANT // SATURNIAN",
    "diameter": "74,200 KM",
    "gravity": "1.92 G",
    "atmosphere": "RESONANT ACOUSTIC HARMONICS",
    "surfaceTemp": "-115°C (RING PLANE)",
    "waterCover": "CRYSTALLINE ICE RINGS",
    "population": "ORBITAL AUDIO BROADCAST NODES",
    "atmosphereBars": [
      {
        "gas": "HYDROGEN",
        "pct": 82.2
      },
      {
        "gas": "HELIUM",
        "pct": 15.4
      },
      {
        "gas": "METHANE",
        "pct": 1.8
      },
      {
        "gas": "ACETYLENE",
        "pct": 0.4
      },
      {
        "gas": "ICE PARTICULATE",
        "pct": 0.2
      }
    ],
    "biosphere": {
      "floraIndex": "24.5%",
      "faunaPresence": "NONE DETECTED",
      "habitability": "44.0%",
      "radar": [
        25,
        40,
        50,
        35,
        70
      ]
    },
    "moons": [
      {
        "name": "Acoustic-1",
        "distance": "82,000 KM",
        "status": "RING SHEPHERD"
      },
      {
        "name": "Soundwave-2",
        "distance": "165,000 KM",
        "status": "SYNCHRONOUS"
      }
    ]
  },
  "url-shortener": {
    "planetId": "VULCAN-06 / MAGMA BASALT",
    "classification": "VOLCANIC BASALTIC // MAGMA RIFTS",
    "diameter": "11,400 KM",
    "gravity": "1.28 G",
    "atmosphere": "DENSE SULFURIC VOLATILE SHIELD",
    "surfaceTemp": "220°C (DAY) / 78°C (NIGHT)",
    "waterCover": "32% (LIQUID MAGMA)",
    "population": "AUTOMATED THERMAL ROUTERS",
    "atmosphereBars": [
      {
        "gas": "CO2",
        "pct": 64.8
      },
      {
        "gas": "NITROGEN",
        "pct": 21.6
      },
      {
        "gas": "SULFUR DIOXIDE",
        "pct": 9.4
      },
      {
        "gas": "ARGON",
        "pct": 2.8
      },
      {
        "gas": "WATER VAPOR",
        "pct": 1.4
      }
    ],
    "biosphere": {
      "floraIndex": "8.4%",
      "faunaPresence": "EXTREMOPHILE ONLY",
      "habitability": "21.0%",
      "radar": [
        10,
        20,
        35,
        15,
        25
      ]
    },
    "moons": [
      {
        "name": "Cinder-1",
        "distance": "19,800 KM",
        "status": "TIDAL LOCK"
      }
    ]
  },
  "gyan-app": {
    "planetId": "SYNAPSE-07 / COGNITIVE CRADLE",
    "classification": "COGNITIVE HORIZON // CRADLE WORLD",
    "diameter": "13,420 KM",
    "gravity": "0.98 G",
    "atmosphere": "IONIZED NEURO-RESPONSIVE SHIELD",
    "surfaceTemp": "19°C (AVG)",
    "waterCover": "54%",
    "population": "ACCESSIBILITY CLINICS & SCHOLARS",
    "atmosphereBars": [
      {
        "gas": "NITROGEN",
        "pct": 72.8
      },
      {
        "gas": "OXYGEN",
        "pct": 22.4
      },
      {
        "gas": "XENON",
        "pct": 2.4
      },
      {
        "gas": "ARGON",
        "pct": 1.6
      },
      {
        "gas": "OZONE",
        "pct": 0.8
      }
    ],
    "biosphere": {
      "floraIndex": "89.5%",
      "faunaPresence": "PROTECTED",
      "habitability": "92.4%",
      "radar": [
        90,
        88,
        94,
        91,
        85
      ]
    },
    "moons": [
      {
        "name": "Mnemosyne-1",
        "distance": "36,500 KM",
        "status": "SYNCHRONOUS"
      }
    ]
  }
};
  projects.forEach(p => {
    if (planetaryMetricsRegistry[p.id]) {
      p.planetaryMetrics = planetaryMetricsRegistry[p.id];
    }
  });

projects.forEach(p => {
    if (!p.description && p.identity) {
      p.description = p.identity.purpose || p.tagline;
    }
    if (!p.demo && p.links) {
      p.demo = p.links.demo;
    }
    if (!p.github && p.links) {
      p.github = p.links.github;
    }
  });

  return {
    projects: projects,
    encounters: projects,
    getEncounters: function () { return projects; },
    getEncounterByIndex: function (idx) {
      const i = parseInt(idx, 10);
      if (isNaN(i)) return null;
      if (i >= 0 && i < projects.length) return projects[i];
      if (i >= 1 && i <= projects.length) return projects[i - 1];
      return null;
    },
    getById: function (idOrSlug) {
      if (!idOrSlug) return null;
      const normalized = String(idOrSlug).toLowerCase().trim();
      return projects.find(p => p.id === normalized || p.slug === normalized || p.index === normalized);
    },
    getByIndex: function (idx) {
      const i = parseInt(idx, 10);
      if (isNaN(i)) return null;
      // Allow both 0-indexed (0..6) and 1-indexed (1..7)
      if (i >= 0 && i < projects.length) return projects[i];
      if (i >= 1 && i <= projects.length) return projects[i - 1];
      return null;
    },
    getEncounterAtProgress: function (progress) {
      const t = Math.max(0.0, Math.min(1.0, progress));
      const count = projects.length;

      // Stage 0: Deep space cosmic departure & approach to Planet 01 (RepoMentor AI)
      const p0DStart = (projects[0].encounter && projects[0].encounter.dwellPlateau) ? projects[0].encounter.dwellPlateau[0] : 0.035;
      if (t < p0DStart) {
        const u = t / p0DStart;
        if (u < 0.60) {
          // Deep interstellar space: pristine view of the cosmos, HUD hidden
          return {
            activeIndex: 0,
            activeProject: projects[0],
            encounterAlpha: 0.0,
            isDwell: false,
            transitU: u,
            nextIndex: 0,
            nextProject: projects[0]
          };
        } else {
          // Target acquisition, deceleration, and scanning approach to Planet 01
          const fadeU = (u - 0.60) / 0.40;
          const alpha = 0.5 * (1 - Math.cos(Math.PI * fadeU));
          return {
            activeIndex: 0,
            activeProject: projects[0],
            encounterAlpha: alpha,
            isDwell: false,
            transitU: u,
            nextIndex: 0,
            nextProject: projects[0]
          };
        }
      }

      for (let i = 0; i < count; i++) {
        const dStart = projects[i].encounter.dwellPlateau[0];
        const dEnd = projects[i].encounter.dwellPlateau[1];

        if (t >= dStart && t <= dEnd) {
          return {
            activeIndex: i,
            activeProject: projects[i],
            encounterAlpha: 1.0,
            isDwell: true,
            transitU: 0.0,
            nextIndex: Math.min(count - 1, i + 1),
            nextProject: projects[Math.min(count - 1, i + 1)]
          };
        }

        if (i < count - 1) {
          const nextDStart = projects[i + 1].encounter.dwellPlateau[0];
          if (t > dEnd && t < nextDStart) {
            const transitLen = nextDStart - dEnd;
            const u = (t - dEnd) / transitLen;
            const transitU = u;

            // Responsive 3-Phase Interplanetary Transit:
            // Phase 1 (u < 0.20): Responsive Departure from current world (dossier quickly folds, alpha 1.0 -> 0.0)
            // Phase 2 (0.20 <= u <= 0.80): Extended Deep Space Transit Void (alpha = 0.0, unobstructed cosmic voyage)
            // Phase 3 (u > 0.80): Deceleration & Approach toward next world (alpha fades 0.0 -> 1.0)
            // Phase C: 4-Phase Interplanetary Transit
            // Phase 1 (u < 0.18): Responsive Departure from current world (dossier folds, alpha 1.0 -> 0.0)
            // Phase 2 (0.18 <= u <= 0.65): Extended Deep Space Void (alpha = 0.0, unobstructed cosmic voyage)
            // Phase 3 (0.65 < u < 0.88): Visual acquisition & scanner reticle awakening (alpha 0.0 -> 0.6)
            // Phase 4 (u >= 0.88): Orbital settle & dossier card reveal (alpha 0.6 -> 1.0)
            if (u < 0.18) {
              const fadeU = u / 0.18;
              const alpha = 0.5 * (1 + Math.cos(Math.PI * fadeU));
              return {
                activeIndex: i,
                activeProject: projects[i],
                encounterAlpha: alpha,
                isDwell: false,
                transitU: transitU,
                nextIndex: i + 1,
                nextProject: projects[i + 1]
              };
            } else if (u > 0.65) {
              const progU = (u - 0.65) / 0.35;
              const alpha = 0.5 * (1 - Math.cos(Math.PI * progU));
              return {
                activeIndex: i + 1,
                activeProject: projects[i + 1],
                encounterAlpha: alpha,
                isDwell: false,
                transitU: transitU,
                nextIndex: i + 1,
                nextProject: projects[i + 1]
              };
            } else {
              // Deep interplanetary space void
              return {
                activeIndex: u < 0.5 ? i : i + 1,
                activeProject: u < 0.5 ? projects[i] : projects[i + 1],
                encounterAlpha: 0.0,
                isDwell: false,
                transitU: transitU,
                nextIndex: i + 1,
                nextProject: projects[i + 1]
              };
            }
          }
        }
      }

      // Smooth Final Departure from Last World (Planet 07) toward deep space and #disciplines
      const lastIdx = count - 1;
      const lastDEnd = (projects[lastIdx].encounter && projects[lastIdx].encounter.dwellPlateau) ? projects[lastIdx].encounter.dwellPlateau[1] : 0.855;
      if (t > lastDEnd) {
        const exitU = Math.min(1.0, (t - lastDEnd) / Math.max(0.001, (1.0 - lastDEnd)));
        const exitAlpha = Math.max(0.0, 1.0 - (exitU / 0.12));
        return {
          activeIndex: lastIdx,
          activeProject: projects[lastIdx],
          encounterAlpha: exitAlpha,
          isDwell: false,
          transitU: exitU,
          nextIndex: lastIdx,
          nextProject: projects[lastIdx],
          isDeparture: true,
          departureU: exitU
        };
      }

      return {
        activeIndex: lastIdx,
        activeProject: projects[lastIdx],
        encounterAlpha: 1.0,
        isDwell: true,
        transitU: 0.0,
        nextIndex: lastIdx,
        nextProject: projects[lastIdx]
      };
    }
  };
}));
