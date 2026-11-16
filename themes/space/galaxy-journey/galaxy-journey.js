/**
 * PARTH MANDORE — SPACE PORTFOLIO
 * Phase 2: Cinematic Solar-System Experience (GalaxyJourneyManager)
 * 
 * Features:
 * 1. Physically plausible Central Star with dynamic solar plasma granulation,
 *    convective boiling, realistic limb darkening, prominences, and multi-layer corona.
 * 2. Real central point light illumination creating natural day/night terminators on all planets.
 * 3. 7 Distinct 3D Project Planets with high-fidelity procedural surfaces, Rayleigh atmospheric
 *    scattering rims, independent swirling cloud decks, and authentic day/night shading.
 * 4. Camera vantage calibrated to the sunlit hemisphere (gibbous/crescent phase),
 *    preventing planets from being shrouded in dark silhouette.
 * 5. Authentic Saturnian ring system on Planet 05 (Spotify) with Cassini division,
 *    subtle Crepe ring transparency, and natural tilt. Zero artificial CAD wireframes.
 * 6. Realistic Main Asteroid Belt with circular particle sprite textures (no square blocks).
 * 7. Smooth scroll-controlled Catmull-Rom camera journey with 5 distinct phases:
 *    Distant Approach -> Interplanetary Travel -> Orbital Arrival & Framing ->
 *    Inspection & Project Reveal -> Smooth Departure.
 * 8. Integrated Futuristic Holographic Mission Telemetry HUD with progressive reveal,
 *    deep-space transit auto-fade, and full bidirectional scroll scrubbing.
 * 9. Zero console errors, fully responsive, independent from Hero black hole.
 */

(function (root, factory) {
  const instance = factory();
  if (typeof window !== 'undefined') {
    window.GalaxyJourneyManager = instance;
    window.GalaxyJourney = instance;
  }
  if (typeof define === 'function' && define.amd) {
    define([], function () { return instance; });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = instance;
  } else {
    root.GalaxyJourneyManager = instance;
    root.GalaxyJourney = instance;
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // ── 01. AUTHENTIC PROJECT RECORDS & PLANETARY SPECIFICATIONS ──
  const fallbackProjects = [
    {
      id: 'repomentor-ai',
      slug: 'repomentor-ai',
      index: '01',
      title: 'RepoMentor AI',
      sector: 'SECTOR // ALPHA • FLAGSHIP ARTIFACT',
      constellation: 'RAG ARCHITECTURE & SEMANTIC VECTORS',
      description: 'An AI-powered GitHub repository analysis platform that performs static code analysis, architecture topology detection, semantic repository search, RAG-based Q&A, security insights, and recruiter-friendly repository reports.',
      image: 'assets/repomentor.png',
      demo: 'https://repomentor.vercel.app',
      github: 'https://github.com/parthmandore/RepoMentor-AI',
      technologies: ['FastAPI', 'Next.js', 'PostgreSQL', 'pgvector', 'ONNX FastEmbed', 'Docker'],
      featured: true,
      color: '#F59E0B',
      accentRgb: [245, 158, 11],
      planetRadius: 18,
      orbitRadius: 540,
      eccentricity: 0.05,
      inclination: 0.28,
      nodeLongitude: 0.65,
      periapsis: 0.40,
      orbitAngle: 0.45,
      orbitSpeed: 0.00022,
      rotationSpeed: 0.007,
      hasClouds: true,
      telemetry: {
        classification: 'TERRESTRIAL SYNAPSE // PROTO-TERRA',
        coreArch: 'FASTAPI + PGVECTOR',
        orbitalPeriod: '540 AU // 9.8 YR',
        signalStatus: 'OPTIMAL • PRODUCTION LIVE'
      }
    },
    {
      id: 'gymbuddy-ai',
      slug: 'gymbuddy-ai',
      index: '02',
      title: 'GymBuddy AI Trainer',
      sector: 'SECTOR // BETA • VISION MATRIX',
      constellation: 'COMPUTER VISION & BIOMECHANICS',
      description: 'A real-time, browser-based AI personal trainer and workout tracking application using high-frequency computer vision pose tracking to monitor biomechanics, count repetitions, assess posture, and offer instant audio-visual coaching cues.',
      image: 'assets/gymbuddy.png',
      github: 'https://github.com/parthmandore/GymBuddy-AI-Trainer',
      technologies: ['MediaPipe Vision', 'TypeScript', 'Next.js', 'Supabase', 'Web Audio API'],
      color: '#22D3EE',
      accentRgb: [34, 211, 238],
      planetRadius: 15,
      orbitRadius: 470,
      eccentricity: 0.07,
      inclination: -0.34,
      nodeLongitude: 1.95,
      periapsis: 1.20,
      orbitAngle: 1.85,
      orbitSpeed: 0.00028,
      rotationSpeed: 0.010,
      hasClouds: true,
      telemetry: {
        classification: 'OCEANIC GLACIAL // HIGH ALBEDO',
        coreArch: 'MEDIAPIPE + NEXT.JS',
        orbitalPeriod: '470 AU // 8.1 YR',
        signalStatus: 'HIGH FREQUENCY • 60 FPS'
      }
    },
    {
      id: 'career-ai-platform',
      slug: 'career-ai-platform',
      index: '03',
      title: 'Career AI Platform',
      sector: 'SECTOR // GAMMA • GENERATIVE SYNTHESIS',
      constellation: 'GENERATIVE NLP & ATS OPTIMIZATION',
      description: 'An AI-powered career development platform that helps users analyze resumes, optimize ATS compatibility, and streamline professional workflows with automated generative insights.',
      image: 'assets/career-ai.png',
      github: 'https://github.com/parthmandore/career-ai-platform',
      technologies: ['LangGraph', 'Gemini API', 'Python', 'Django REST', 'React', 'Docker'],
      color: '#A78BFA',
      accentRgb: [167, 139, 250],
      planetRadius: 17,
      orbitRadius: 405,
      eccentricity: 0.04,
      inclination: 0.20,
      nodeLongitude: 3.40,
      periapsis: 2.10,
      orbitAngle: 3.10,
      orbitSpeed: 0.00035,
      rotationSpeed: 0.006,
      telemetry: {
        classification: 'VIOLET GAS GIANT // STRATOSPHERIC',
        coreArch: 'LANGGRAPH + GEMINI API',
        orbitalPeriod: '405 AU // 6.5 YR',
        signalStatus: 'OPTIMIZED // ATS PASS'
      }
    },
    {
      id: 'mindpulse-ai',
      slug: 'mindpulse-ai',
      index: '04',
      title: 'MindPulse AI',
      sector: 'SECTOR // DELTA • REGRESSION CURRENT',
      constellation: 'MACHINE LEARNING & PREDICTIVE REGRESSION',
      description: 'Machine Learning-based burnout risk prediction and proactive wellness advisory platform predicting risk from sleep, stress, exercise, screen time, and work hours using Random Forest regression models.',
      image: 'assets/mindpulse.png',
      github: 'https://github.com/parthmandore/MindPulse-AI',
      technologies: ['Python', 'Scikit-Learn', 'Random Forest', 'Pandas', 'NumPy'],
      color: '#06D6A0',
      accentRgb: [6, 214, 160],
      planetRadius: 14,
      orbitRadius: 340,
      eccentricity: 0.06,
      inclination: -0.14,
      nodeLongitude: 4.70,
      periapsis: 0.90,
      orbitAngle: 4.25,
      orbitSpeed: 0.00045,
      rotationSpeed: 0.008,
      hasClouds: true,
      telemetry: {
        classification: 'VERDANT SUPER-EARTH // OCEANIC',
        coreArch: 'SCIKIT-LEARN + PANDAS',
        orbitalPeriod: '340 AU // 5.0 YR',
        signalStatus: 'PREDICTIVE ENSEMBLE ACTIVE'
      }
    },
    {
      id: 'spotify-clone',
      slug: 'spotify-clone',
      index: '05',
      title: 'Spotify Web Player Clone',
      sector: 'SECTOR // EPSILON • RESONANT FIELD',
      constellation: 'AUDIO STREAMING & PRECISION INTERFACE',
      description: 'A responsive, pixel-perfect frontend replica of the Spotify web player interface engineered for intuitive music discovery, interactive playback controls, and playlist navigation.',
      image: 'assets/spotify.png',
      github: 'https://github.com/parthmandore/Spotify_Clone',
      technologies: ['JavaScript ES6+', 'HTML5 Audio', 'CSS3 Flexbox/Grid', 'Web Audio API'],
      color: '#1DB954',
      accentRgb: [29, 185, 84],
      planetRadius: 19,
      orbitRadius: 270,
      eccentricity: 0.05,
      inclination: 0.25,
      nodeLongitude: 0.25,
      periapsis: 3.00,
      orbitAngle: 5.40,
      orbitSpeed: 0.00055,
      rotationSpeed: 0.012,
      hasRings: true, // Majestic Saturnian Ring System with Cassini Division
      telemetry: {
        classification: 'RINGED GAS GIANT // SATURNIAN',
        coreArch: 'VANILLA JS + WEB AUDIO',
        orbitalPeriod: '270 AU // 3.5 YR',
        signalStatus: 'STEREO HARMONIC BUFFERED'
      }
    },
    {
      id: 'url-shortener',
      slug: 'url-shortener',
      index: '06',
      title: 'URL Shortener Service',
      sector: 'SECTOR // ZETA • KINETIC VOLCANO',
      constellation: 'HIGH-THROUGHPUT BACKEND & REDIRECTION',
      description: 'A high-throughput URL shortening service converting long URLs into unique short links with sub-millisecond redirection, optimized short-code generation, and clean layered architecture.',
      image: 'assets/url-shortner.jpeg',
      github: 'https://github.com/parthmandore/url-shortener-api',
      technologies: ['Java 17', 'Spring Boot 3', 'Spring Data JPA', 'REST APIs', 'Swagger / OpenAPI'],
      color: '#F97316',
      accentRgb: [249, 115, 22],
      planetRadius: 13,
      orbitRadius: 200,
      eccentricity: 0.08,
      inclination: -0.22,
      nodeLongitude: 1.55,
      periapsis: 1.70,
      orbitAngle: 0.95,
      orbitSpeed: 0.00070,
      rotationSpeed: 0.009,
      telemetry: {
        classification: 'VOLCANIC BASALTIC // MAGMA RIFTS',
        coreArch: 'JAVA 17 + SPRING BOOT 3',
        orbitalPeriod: '200 AU // 2.3 YR',
        signalStatus: 'SUB-MILLISECOND LATENCY'
      }
    },
    {
      id: 'gyan-app',
      slug: 'gyan-app',
      index: '07',
      title: 'Gyan — Dyslexia Support Mobile App',
      sector: 'SECTOR // ETA • COGNITIVE HORIZON',
      constellation: 'ACCESSIBILITY & LOCALIZED SPEECH SYSTEMS',
      description: 'An offline-first assistive mobile app designed for children with dyslexia and dysgraphia. Selected as a Top 25 National Finalist at Ideathon 2025 out of hundreds of entries across India.',
      image: 'assets/gyan.svg',
      demo: 'https://github.com/parthmandore/Gyan-Deployed',
      github: 'https://github.com/parthmandore/Gyan',
      technologies: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Zustand', 'Expo Speech'],
      color: '#A855F7',
      accentRgb: [168, 85, 247],
      planetRadius: 16,
      orbitRadius: 140,
      eccentricity: 0.03,
      inclination: 0.12,
      nodeLongitude: 2.85,
      periapsis: 0.50,
      orbitAngle: 2.20,
      orbitSpeed: 0.00095,
      rotationSpeed: 0.005,
      telemetry: {
        classification: 'AMETHYST SYNAPSE // NEURAL WORLD',
        coreArch: 'REACT NATIVE + EXPO + SQLITE',
        orbitalPeriod: '140 AU // 1.3 YR',
        signalStatus: 'NATIONAL TOP 25 FINALIST'
      }
    }
  ];

  // ── 01B. AUTHORITATIVE PROJECT RECORDS & PLANETARY SPECIFICATIONS (Single Source of Truth) ──
  const projects = (typeof PORTFOLIO_PROJECT_DETAILS !== 'undefined' && PORTFOLIO_PROJECT_DETAILS.projects)
    ? PORTFOLIO_PROJECT_DETAILS.projects
    : fallbackProjects;

  // Ensure encounter plateaus are safely populated across all project references
  if (typeof PORTFOLIO_PROJECT_DETAILS !== 'undefined' && PORTFOLIO_PROJECT_DETAILS.encounterSpecs) {
    PORTFOLIO_PROJECT_DETAILS.encounterSpecs.forEach((spec, i) => {
      if (projects[i] && !projects[i].encounter) {
        projects[i].encounter = spec.encounter;
      }
    });
  }

  // ── 02. ENGINE STATE & VARIABLES ──
  let scene, camera, renderer, clock;
  let canvasEl, containerEl, hudEl;
  let isInitialized = false;
  let isActive = true;
  let isReducedMotion = false;

  // 3D Scene Groups
  let centralStarGroup;
  let centralStarMesh;
  let starMaterial, starCoronaMat, starCoronaMesh;
  let coreLight, coreWarmLight;
  let deepSpaceStarsGroup;
  let foregroundStardustGroup;
  let asteroidBeltGroup;
  let planetsGroup;
  let orbitalRingsGroup;
  let cameraOverride = null;
  let ambientLight;
  let postScene, postCamera, postQuad, postMaterial, postRenderTarget;

  // Planet References & Dynamic Meshes
  const planetMeshes = [];
  const moonMeshes = [];
  const asteroidsList = [];
  let instancedAsteroidMesh = null;
  const asteroidInstanceData = [];
  const cloudMeshes = [];
  let saturnRingMesh = null;

  // Animation & Camera Progress
  let currentScrollProgress = 0; // 0.0 to 1.0
  let targetScrollProgress = 0;
  let currentWaypointIndex = 0;
  let currentEncounterAlpha = 1.0;
  let scrollTriggerInstance = null;
  let cameraRoll = 0.0;
  let targetCameraRoll = 0.0;

  // Performance Watchdog (Phase 6 Auto-Drop Quality if FPS < 45)
  let fpsWatchdogCount = 0;
  let fpsWatchdogLastMark = performance.now();
  let fpsLowStreakSeconds = 0;
  let hasAutoDroppedQuality = false;

  // Camera Spline Paths
  let cameraSpline;
  let cameraLookSpline;

  // ── 02B. KEPLERIAN MULTI-ORBIT MATHEMATICAL SOLVER ──
  function computeKeplerianPosition(a, e, inc, node, argP, theta) {
    // True anomaly Keplerian orbital radius with eccentricity
    const r = (a * (1.0 - e * e)) / (1.0 + e * Math.cos(theta - argP));
    // Coordinates in tilted orbital plane
    const xOrb = r * Math.cos(theta);
    const zOrb = r * Math.sin(theta);

    // Inclination tilt (rotation around line of nodes)
    const xInc = xOrb;
    const yInc = zOrb * Math.sin(inc);
    const zInc = zOrb * Math.cos(inc);

    // Rotation by Longitude of Ascending Node (Omega) around solar polar axis (Y)
    const cosN = Math.cos(node);
    const sinN = Math.sin(node);
    const x = xInc * cosN - zInc * sinN;
    const y = yInc;
    const z = xInc * sinN + zInc * cosN;

    return new THREE.Vector3(x, y, z);
  }

  // ── 03. PROCEDURAL TEXTURE GENERATORS & SPHERICAL NOISE ENGINE ──

  // High-performance 3D Simplex Noise for distortion-free spherical sampling
  function createNoise3D(seed = 1337) {
    const perm = new Uint8Array(512);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807 + 7) % 2147483647;
      const j = s % (i + 1);
      const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
    }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

    const grad3 = [
      [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
      [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
      [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
    ];

    return function(x, y, z) {
      const F3 = 1.0 / 3.0;
      const G3 = 1.0 / 6.0;
      const sVal = (x + y + z) * F3;
      const i = Math.floor(x + sVal);
      const j = Math.floor(y + sVal);
      const k = Math.floor(z + sVal);
      const t = (i + j + k) * G3;
      const x0 = x - (i - t);
      const y0 = y - (j - t);
      const z0 = z - (k - t);

      let i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) {
        if (y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
        else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
        else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
      } else {
        if (y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
        else if (x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
        else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
      }

      const x1 = x0 - i1 + G3;
      const y1 = y0 - j1 + G3;
      const z1 = z0 - k1 + G3;
      const x2 = x0 - i2 + 2.0 * G3;
      const y2 = y0 - j2 + 2.0 * G3;
      const z2 = z0 - k2 + 2.0 * G3;
      const x3 = x0 - 1.0 + 3.0 * G3;
      const y3 = y0 - 1.0 + 3.0 * G3;
      const z3 = z0 - 1.0 + 3.0 * G3;

      const ii = i & 255;
      const jj = j & 255;
      const kk = k & 255;

      const gi0 = perm[ii + perm[jj + perm[kk]]] % 12;
      const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12;
      const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12;
      const gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12;

      let n0 = 0.0, n1 = 0.0, n2 = 0.0, n3 = 0.0;
      let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
      if (t0 > 0) { t0 *= t0; n0 = t0 * t0 * (grad3[gi0][0]*x0 + grad3[gi0][1]*y0 + grad3[gi0][2]*z0); }

      let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
      if (t1 > 0) { t1 *= t1; n1 = t1 * t1 * (grad3[gi1][0]*x1 + grad3[gi1][1]*y1 + grad3[gi1][2]*z1); }

      let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
      if (t2 > 0) { t2 *= t2; n2 = t2 * t2 * (grad3[gi2][0]*x2 + grad3[gi2][1]*y2 + grad3[gi2][2]*z2); }

      let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
      if (t3 > 0) { t3 *= t3; n3 = t3 * t3 * (grad3[gi3][0]*x3 + grad3[gi3][1]*y3 + grad3[gi3][2]*z3); }

      return 32.0 * (n0 + n1 + n2 + n3);
    };
  }

  const globalNoise = createNoise3D(9412);
  const detailNoise = createNoise3D(5821);

  // Fractional Brownian Motion on 3D Cartesian coordinates
  function fbmSphere(noise, x, y, z, octaves = 5, lacunarity = 2.05, gain = 0.5) {
    let sum = 0.0;
    let freq = 1.0;
    let amp = 1.0;
    let maxAmp = 0.0;
    for (let o = 0; o < octaves; o++) {
      sum += noise(x * freq, y * freq, z * freq) * amp;
      maxAmp += amp;
      freq *= lacunarity;
      amp *= gain;
    }
    return sum / maxAmp;
  }

  // Ridged multifractal for mountain crests & tectonic rifts
  function ridgedSphere(noise, x, y, z, octaves = 4, lacunarity = 2.1, gain = 0.5) {
    let sum = 0.0;
    let freq = 1.0;
    let amp = 1.0;
    let maxAmp = 0.0;
    for (let o = 0; o < octaves; o++) {
      let n = 1.0 - Math.abs(noise(x * freq, y * freq, z * freq));
      n = n * n;
      sum += n * amp;
      maxAmp += amp;
      freq *= lacunarity;
      amp *= gain;
    }
    return sum / maxAmp;
  }

  // Soft Radial Star Sprite (Zero square block artifacts)
  function generateStarSprite() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0.00, 'rgba(255, 255, 255, 1.0)');
    g.addColorStop(0.18, 'rgba(255, 245, 220, 0.90)');
    g.addColorStop(0.42, 'rgba(245, 158, 11, 0.35)');
    g.addColorStop(0.70, 'rgba(245, 158, 11, 0.08)');
    g.addColorStop(1.00, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  // Helper: Hex color to RGB
  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  // Helper: Color linear interpolation
  function lerpColor(c1, c2, t) {
    const ct = Math.max(0, Math.min(1, t));
    return [
      Math.round(c1[0] + (c2[0] - c1[0]) * ct),
      Math.round(c1[1] + (c2[1] - c1[1]) * ct),
      Math.round(c1[2] + (c2[2] - c1[2]) * ct)
    ];
  }

  // Creates photorealistic astronomical planetary surfaces ($2048 \times 1024$)
  // Samples 3D unit-sphere Cartesian coordinates to completely eliminate polar pinching
  function generatePlanetTexture(proj, index) {
    const width = 2048;
    const height = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    // Optional bump and emissive maps
    let bumpCanvas = null;
    let bumpData = null;
    let emissiveCanvas = null;
    let emissiveData = null;

    if (index === 0 || index === 1 || index === 3 || index === 5 || index === 6) {
      bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = 1024;
      bumpCanvas.height = 512;
      const bCtx = bumpCanvas.getContext('2d');
      bumpData = bCtx.createImageData(1024, 512);
    }

    if (index === 0 || index === 5 || index === 6) {
      emissiveCanvas = document.createElement('canvas');
      emissiveCanvas.width = 1024;
      emissiveCanvas.height = 512;
      const eCtx = emissiveCanvas.getContext('2d');
      emissiveData = eCtx.createImageData(1024, 512);
    }

    // Precalculate longitude angles & latitude cosines
    const thetaTable = new Float32Array(width);
    for (let x = 0; x < width; x++) {
      thetaTable[x] = (x / width - 0.5) * Math.PI * 2.0;
    }

    for (let y = 0; y < height; y++) {
      const phi = (y / height - 0.5) * Math.PI;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      const by = Math.floor(y * 0.5);

      for (let x = 0; x < width; x++) {
        const theta = thetaTable[x];
        const nx = cosPhi * Math.cos(theta);
        const ny = sinPhi;
        const nz = cosPhi * Math.sin(theta);

        const pIdx = (y * width + x) * 4;
        let r = 0, g = 0, b = 0;
        let bumpVal = 128;
        let emR = 0, emG = 0, emB = 0;

        if (index === 0) {
          // ── PLANET 01: REPOMENTOR AI (Silicate / Basaltic Cratered Proto-Terra) ──
          // Impact-cratered rocky world with dark basaltic maria, anorthosite highlands, and amber rifts
          const h = fbmSphere(globalNoise, nx * 2.5, ny * 2.5, nz * 2.5, 6) * 0.5 + 0.5;
          // Impact crater synthesis via cellular distance math
          const c1 = Math.abs(detailNoise(nx * 5.8, ny * 5.8, nz * 5.8));
          const c2 = Math.abs(detailNoise(nx * 11.5, ny * 11.5, nz * 11.5));
          const craterBasin = Math.max(0.0, 1.0 - c1 * 3.8);
          const craterRim = Math.max(0.0, 1.0 - Math.abs(c1 - 0.26) * 12.0) * 0.28;
          const craterSmall = Math.max(0.0, 1.0 - c2 * 5.0) * 0.18;
          const rifts = ridgedSphere(detailNoise, nx * 6.2, ny * 6.2, nz * 6.2, 4);
          const isRift = Math.pow(rifts, 6.5);

          // Maria vs Highlands
          if (h < 0.46) {
            // Dark basaltic maria (impact melt lowlands)
            const t = h / 0.46;
            [r, g, b] = lerpColor([32, 28, 36], [58, 52, 64], t);
            bumpVal = Math.floor(40 + t * 40 - craterBasin * 35 + craterRim * 40);
          } else if (h < 0.75) {
            // Cratered anorthosite continental highlands
            const t = (h - 0.46) / (0.75 - 0.46);
            [r, g, b] = lerpColor([115, 95, 82], [165, 145, 128], t);
            bumpVal = Math.floor(95 + t * 65 - craterBasin * 40 + craterRim * 55 + craterSmall * 30);
          } else {
            // Rugged mountain crater crests
            const t = (h - 0.75) / 0.25;
            [r, g, b] = lerpColor([175, 155, 138], [215, 198, 180], t);
            bumpVal = Math.floor(165 + t * 80 + craterRim * 60);
          }

          // Golden-amber tectonic fracture faults
          if (isRift > 0.38) {
            const rt = (isRift - 0.38) / 0.62;
            const riftCol = lerpColor([217, 119, 6], [254, 240, 138], rt);
            r = Math.min(255, Math.floor(r * 0.3 + riftCol[0] * 0.85));
            g = Math.min(255, Math.floor(g * 0.3 + riftCol[1] * 0.85));
            b = Math.min(255, Math.floor(b * 0.3 + riftCol[2] * 0.85));
            emR = Math.floor(riftCol[0] * 0.9);
            emG = Math.floor(riftCol[1] * 0.7);
            emB = Math.floor(riftCol[2] * 0.3);
          }

        } else if (index === 1) {
          // ── PLANET 02: GYMBUDDY AI (Cryovolcanic Glacial Ocean / Europa Hybrid) ──
          // High-albedo porcelain ice sheets with intricate tidal lineae fractures and cyan rifts
          const h = fbmSphere(globalNoise, nx * 2.8, ny * 2.8, nz * 2.8, 6) * 0.5 + 0.5;
          const polarDist = Math.abs(ny);
          // Tidal fracture lineae
          const f1 = Math.abs(detailNoise(nx * 8.5, ny * 8.5, nz * 8.5));
          const f2 = Math.abs(detailNoise(nx * 16.0, ny * 16.0, nz * 16.0));
          const isFracture = f1 < 0.075 || (f2 < 0.05 && h > 0.45);

          if (isFracture) {
            // Deep tectonic fracture lineae (reddish-brown & azure salts)
            [r, g, b] = lerpColor([14, 116, 144], [180, 83, 9], Math.min(1.0, f1 * 12.0));
            bumpVal = 70;
          } else if (polarDist > 0.65 || (polarDist > 0.48 && h > 0.62)) {
            // Brilliant polar ice shelf
            const t = Math.min(1.0, (polarDist - 0.48) / 0.38);
            [r, g, b] = lerpColor([224, 242, 254], [255, 255, 255], t);
            bumpVal = 210;
          } else if (h < 0.45) {
            // Deep abyssal ocean rifts
            const t = h / 0.45;
            [r, g, b] = lerpColor([6, 50, 72], [14, 116, 144], t);
            bumpVal = 50;
          } else if (h < 0.58) {
            // Translucent glacial shelves
            const t = (h - 0.45) / 0.13;
            [r, g, b] = lerpColor([14, 116, 144], [56, 189, 248], t);
            bumpVal = 110;
          } else {
            // Porcelain crystalline continental plains
            const t = (h - 0.58) / 0.42;
            [r, g, b] = lerpColor([186, 230, 253], [240, 249, 255], t);
            bumpVal = Math.floor(140 + t * 90);
          }

        } else if (index === 2) {
          // ── PLANET 03: CAREER AI (Stratospheric Violet Gas Giant / Jovian Archetype) ──
          // 16 alternating counter-rotating zonal jet bands with Coriolis shear and Great Violet Vortex
          const shear = detailNoise(nx * 4.2, ny * 2.2, nz * 4.2) * 0.11;
          const bandHarmonic = Math.sin((ny + shear) * 28.0) * 0.5 + 0.5;
          const bandFine = Math.sin(ny * 56.0) * 0.5 + 0.5;
          const band = bandHarmonic * 0.72 + bandFine * 0.28;

          // Great Violet Vortex at latitude -28 deg
          const stormDx = nx - 0.62;
          const stormDy = (ny + 0.32) * 2.2;
          const stormDz = nz - 0.38;
          const stormDist = Math.sqrt(stormDx * stormDx + stormDy * stormDy + stormDz * stormDz);

          if (stormDist < 0.24) {
            const st = stormDist / 0.24;
            const stormSpiral = detailNoise(nx * 14.0, ny * 14.0, nz * 14.0) * 0.14;
            [r, g, b] = lerpColor([243, 232, 255], [76, 29, 149], Math.min(1.0, st + stormSpiral));
          } else {
            const col1 = [36, 12, 68];   // Midnight purple belt
            const col2 = [88, 28, 135];  // Royal amethyst zone
            const col3 = [168, 85, 247]; // Vibrant lavender jet
            const col4 = [238, 224, 255];// Ethereal white-lilac ammonia ribbon
            if (band < 0.38) {
              [r, g, b] = lerpColor(col1, col2, band / 0.38);
            } else if (band < 0.75) {
              [r, g, b] = lerpColor(col2, col3, (band - 0.38) / 0.37);
            } else {
              [r, g, b] = lerpColor(col3, col4, (band - 0.75) / 0.25);
            }
          }
          bumpVal = 128; // Zero bumpiness for smooth gaseous fluid

        } else if (index === 3) {
          // ── PLANET 04: MINDPULSE AI (Photorealistic Verdant Super-Earth) ──
          // Smooth continuous bathymetry, organic biomes, realistic continental shelves, natural coasts
          const h = fbmSphere(globalNoise, nx * 2.6, ny * 2.6, nz * 2.6, 6) * 0.5 + 0.5;
          const m = ridgedSphere(detailNoise, nx * 5.2, ny * 5.2, nz * 5.2, 4);
          const moisture = fbmSphere(detailNoise, nx * 2.0 + 12.4, ny * 2.0, nz * 2.0 + 7.8, 4) * 0.5 + 0.5;
          const polarDist = Math.abs(ny);

          // Sea level set to 0.49
          const seaLevel = 0.49;
          const isOcean = h < seaLevel;

          if (isOcean) {
            // Deep abyssal plain to coastal shelf: smooth, natural marine gradation
            const depth = (seaLevel - h) / seaLevel; // 1.0 (deepest trench) to 0.0 (coast)
            const abyssal = [4, 18, 44];      // Midnight deep blue
            const pelagic = [8, 38, 72];      // Mid-depth ocean
            const shelf   = [16, 72, 94];     // Natural coastal shelf (muted, believable)
            const shallows = [32, 98, 112];   // Very shallow estuary / near-shore bay
            
            if (depth > 0.35) {
              const dt = (depth - 0.35) / 0.65;
              [r, g, b] = lerpColor(pelagic, abyssal, Math.min(1.0, dt * 1.2));
              bumpVal = 32;
            } else if (depth > 0.08) {
              const dt = (depth - 0.08) / 0.27;
              [r, g, b] = lerpColor(shelf, pelagic, dt);
              bumpVal = Math.floor(32 + (1.0 - dt) * 20);
            } else {
              // Sub-coastal shallow water, transitioning organically toward land
              const dt = depth / 0.08;
              [r, g, b] = lerpColor(shallows, shelf, dt);
              bumpVal = Math.floor(52 + (1.0 - dt) * 20);
            }
          } else {
            // Landmasses: Elevation above sea level with climate/moisture gradation
            const elev = (h - seaLevel) / (1.0 - seaLevel); // 0.0 at coast to 1.0 at peak
            
            const beachSand    = [148, 138, 108]; // Sandy coastlines & sediment beaches
            const lushPlains   = [32, 78, 42];    // Temperate forest / fertile lowlands
            const deepJungle   = [20, 62, 32];    // Tropical rainforest
            const savannah     = [118, 108, 68];  // Arid steppe & plateau scrub
            const rockMountain = [86, 76, 68];    // Rugged granite cordillera
            const snowSummits  = [238, 244, 252]; // Glaciated peaks
            
            if (elev < 0.04) {
              // Coastal transition zone: natural sandy / estuarine fringe
              const et = elev / 0.04;
              const verge = lerpColor([32, 98, 112], beachSand, 0.7);
              [r, g, b] = lerpColor(verge, lushPlains, et);
              bumpVal = Math.floor(75 + et * 30);
            } else if (elev < 0.35) {
              // Lowland valleys & forested regions modulated by moisture
              const et = (elev - 0.04) / 0.31;
              const forestColor = lerpColor(lushPlains, deepJungle, moisture);
              const dryColor = lerpColor(beachSand, savannah, et);
              const biomeCol = lerpColor(dryColor, forestColor, moisture);
              [r, g, b] = biomeCol;
              bumpVal = Math.floor(105 + et * 35);
            } else if (elev < 0.65) {
              // Upland plateaus & temperate mountain foothills
              const et = (elev - 0.35) / 0.30;
              const uplandBase = lerpColor(lushPlains, savannah, 0.65);
              [r, g, b] = lerpColor(uplandBase, rockMountain, et);
              bumpVal = Math.floor(140 + et * 45);
            } else {
              // High mountain alpine crags & perpetual snowcaps
              const et = (elev - 0.65) / 0.35;
              const mountainWithNoise = Math.min(1.0, et * 0.85 + m * 0.55);
              [r, g, b] = lerpColor(rockMountain, snowSummits, mountainWithNoise);
              bumpVal = Math.floor(185 + et * 65);
            }

            // Subtle nocturnal terrestrial settlements (city lights on dark side)
            if (elev > 0.03 && elev < 0.40 && polarDist < 0.68) {
              const cityNoise = Math.abs(detailNoise(nx * 18.0, ny * 18.0, nz * 18.0));
              if (cityNoise < 0.055) {
                emR = 255;
                emG = 215;
                emB = 145;
              }
            }
          }

          // Organic Polar Ice Caps with natural glacial tongues and pack ice
          const iceNoise = detailNoise(nx * 5.5, ny * 5.5, nz * 5.5) * 0.06;
          const adjustedPolar = polarDist + iceNoise;
          if (adjustedPolar > 0.74) {
            const iceFactor = Math.min(1.0, (adjustedPolar - 0.74) / 0.12);
            const iceColor = lerpColor([200, 225, 245], [248, 252, 255], iceFactor);
            [r, g, b] = lerpColor([r, g, b], iceColor, Math.pow(iceFactor, 1.4));
            bumpVal = Math.floor(bumpVal * (1.0 - iceFactor) + 160 * iceFactor);
            emR = 0; emG = 0; emB = 0; // No city lights under ice
          }

        } else if (index === 4) {
          // ── PLANET 05: SPOTIFY (Ringed Saturnian Gas Giant) ──
          // Acoustic emerald, golden-ochre, sage, and ammonia cloud decks
          const shear = detailNoise(nx * 4.2, ny * 2.8, nz * 4.2) * 0.08;
          const band = Math.sin((ny + shear) * 34.0) * 0.5 + 0.5;
          const col1 = [16, 42, 26];    // Deep forest shadow
          const col2 = [22, 101, 52];   // Spotify emerald
          const col3 = [34, 197, 94];   // Acoustic green
          const col4 = [220, 250, 228]; // Ammonia cloud mist
          const col5 = [235, 198, 110]; // Golden-ochre solar equator
          if (band < 0.32) {
            [r, g, b] = lerpColor(col1, col2, band / 0.32);
          } else if (band < 0.62) {
            [r, g, b] = lerpColor(col2, col3, (band - 0.32) / 0.30);
          } else if (band < 0.86) {
            [r, g, b] = lerpColor(col3, col4, (band - 0.62) / 0.24);
          } else {
            [r, g, b] = lerpColor(col4, col5, (band - 0.86) / 0.14);
          }
          bumpVal = 128; // Zero bumpiness for gaseous fluid

        } else if (index === 5) {
          // ── PLANET 06: URL SHORTENER (Scorched Basalt / Hyper-Volcanic Magma World) ──
          // Black basalt plates with glowing incandescent orange/white-hot magma fissures
          const h = fbmSphere(globalNoise, nx * 3.2, ny * 3.2, nz * 3.2, 6) * 0.5 + 0.5;
          const cracks = ridgedSphere(detailNoise, nx * 6.8, ny * 6.8, nz * 6.8, 4);
          const isLava = Math.pow(cracks, 5.8);

          if (isLava > 0.32) {
            // Incandescent magma rift
            const lt = Math.min(1.0, (isLava - 0.32) / 0.68);
            [r, g, b] = lerpColor([255, 110, 15], [255, 250, 200], lt);
            emR = r; emG = Math.floor(g * 0.9); emB = Math.floor(b * 0.4);
            bumpVal = 60;
          } else {
            // Scorched volcanic crust & sulfur deposits
            const t = h;
            [r, g, b] = lerpColor([16, 14, 18], [55, 42, 32], t);
            bumpVal = Math.floor(90 + t * 130);
          }

        } else if (index === 6) {
          // ── PLANET 07: GYAN (Amethyst Cognitive Cradle World) ──
          // Royal amethyst mineral plateaus with bioluminescent cyan synaptic river networks
          const h = fbmSphere(globalNoise, nx * 2.8, ny * 2.8, nz * 2.8, 5) * 0.5 + 0.5;
          const syn1 = Math.abs(detailNoise(nx * 7.5, ny * 7.5, nz * 7.5));
          const syn2 = Math.abs(detailNoise(nx * 15.0, ny * 15.0, nz * 15.0));
          const isSynapse = syn1 < 0.052 || (syn2 < 0.038 && h > 0.50);

          if (isSynapse) {
            // Bioluminescent synaptic neural river
            [r, g, b] = [34, 211, 238]; // Radiant cyan
            emR = 25; emG = 185; emB = 240;
            bumpVal = 70;
          } else {
            // Amethyst crystalline mineral plateaus
            const t = h;
            [r, g, b] = lerpColor([28, 16, 48], [88, 28, 135], t);
            bumpVal = Math.floor(100 + t * 120);
          }
        }

        data[pIdx] = r;
        data[pIdx + 1] = g;
        data[pIdx + 2] = b;
        data[pIdx + 3] = 255;

        // Downsampled bump & emissive maps for performance
        if (bumpData && (x & 1) === 0 && (y & 1) === 0) {
          const bx = x >> 1;
          const bIdx = (by * 1024 + bx) * 4;
          bumpData.data[bIdx] = bumpVal;
          bumpData.data[bIdx + 1] = bumpVal;
          bumpData.data[bIdx + 2] = bumpVal;
          bumpData.data[bIdx + 3] = 255;
        }

        if (emissiveData && (x & 1) === 0 && (y & 1) === 0) {
          const bx = x >> 1;
          const eIdx = (by * 1024 + bx) * 4;
          emissiveData.data[eIdx] = emR;
          emissiveData.data[eIdx + 1] = emG;
          emissiveData.data[eIdx + 2] = emB;
          emissiveData.data[eIdx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    let bumpTexture = null;
    if (bumpCanvas) {
      const bCtx = bumpCanvas.getContext('2d');
      bCtx.putImageData(bumpData, 0, 0);
      bumpTexture = new THREE.CanvasTexture(bumpCanvas);
      bumpTexture.wrapS = THREE.RepeatWrapping;
      bumpTexture.wrapT = THREE.ClampToEdgeWrapping;
    }

    let emissiveTexture = null;
    if (emissiveCanvas) {
      const eCtx = emissiveCanvas.getContext('2d');
      eCtx.putImageData(emissiveData, 0, 0);
      emissiveTexture = new THREE.CanvasTexture(emissiveCanvas);
      emissiveTexture.wrapS = THREE.RepeatWrapping;
      emissiveTexture.wrapT = THREE.ClampToEdgeWrapping;
    }

    return {
      surfaceTexture: texture,
      bumpTexture: bumpTexture,
      emissiveTexture: emissiveTexture
    };
  }

  // Realistic Swirling Atmospheric Cloud Texture ($2048 \times 1024$)
  function generateCloudTexture(colorHex = '#ffffff') {
    const width = 2048;
    const height = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const baseRgb = hexToRgb(colorHex);
    const cloudNoise = createNoise3D(7721);

    for (let y = 0; y < height; y++) {
      const phi = (y / height - 0.5) * Math.PI;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      // Swirling zonal wind shear
      const shearAngle = Math.sin(phi * 4.0) * 0.8;

      for (let x = 0; x < width; x++) {
        const theta = (x / width - 0.5) * Math.PI * 2.0 + shearAngle;
        const nx = cosPhi * Math.cos(theta);
        const ny = sinPhi;
        const nz = cosPhi * Math.sin(theta);

        // Fractal cloud density with swirling vortices
        const cVal = fbmSphere(cloudNoise, nx * 3.8, ny * 3.8, nz * 3.8, 5) * 0.5 + 0.5;
        const density = Math.max(0.0, (cVal - 0.44) / 0.56);
        const alpha = Math.floor(Math.pow(density, 1.6) * 115); // Delicate, ethereal cloud deck

        const pIdx = (y * width + x) * 4;
        data[pIdx] = baseRgb[0];
        data[pIdx + 1] = baseRgb[1];
        data[pIdx + 2] = baseRgb[2];
        data[pIdx + 3] = alpha;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  // Photorealistic Saturnian Ring Texture with Cassini Division ($2048 \times 64$)
  function generateSaturnRingTexture() {
    const size = 2048;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, size, 0);
    // 1. Inner Crepe Ring (Translucent D/C ring boundary)
    grad.addColorStop(0.00, 'rgba(160, 145, 120, 0.00)');
    grad.addColorStop(0.06, 'rgba(175, 155, 130, 0.12)');
    grad.addColorStop(0.18, 'rgba(190, 170, 145, 0.32)');
    grad.addColorStop(0.30, 'rgba(215, 195, 165, 0.55)');

    // 2. Main B-Ring (Dense, high albedo, brilliant golden-cream ringlets)
    grad.addColorStop(0.32, 'rgba(240, 225, 195, 0.90)');
    grad.addColorStop(0.42, 'rgba(248, 235, 205, 0.96)');
    grad.addColorStop(0.50, 'rgba(235, 220, 190, 0.88)');
    grad.addColorStop(0.57, 'rgba(245, 230, 200, 0.92)');

    // 3. Cassini Division Gap (Razor-sharp, authentic celestial void)
    grad.addColorStop(0.58, 'rgba(8, 7, 11, 0.02)');
    grad.addColorStop(0.64, 'rgba(8, 7, 11, 0.02)');

    // 4. Outer A-Ring (Subtle Encke gap at 0.85)
    grad.addColorStop(0.65, 'rgba(225, 210, 180, 0.82)');
    grad.addColorStop(0.82, 'rgba(210, 195, 165, 0.76)');
    grad.addColorStop(0.84, 'rgba(15, 12, 18, 0.10)'); // Encke Division
    grad.addColorStop(0.86, 'rgba(205, 190, 160, 0.70)');
    grad.addColorStop(0.92, 'rgba(190, 175, 145, 0.55)');

    // 5. Outer Tapered Edge
    grad.addColorStop(0.96, 'rgba(160, 145, 120, 0.20)');
    grad.addColorStop(1.00, 'rgba(8, 7, 11, 0.00)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, 64);

    // Micro-ringlet striations for cinematic realism
    for (let i = 0; i < 180; i++) {
      const rx = 400 + Math.floor(Math.random() * 1500);
      if (rx >= Math.floor(size * 0.58) && rx <= Math.floor(size * 0.64)) continue; // Keep Cassini clean
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(rx, 0, 1 + (i % 3), 64);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  
  // ── 04B. POST-PROCESSING PIPELINE (CINEMATIC BLOOM, LENS VIGNETTE & FILM GRAIN) ──
  function initPostProcessing(width, height) {
    postRenderTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      encoding: THREE.sRGBEncoding
    });

    postScene = new THREE.Scene();
    postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    postMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: postRenderTarget.texture },
        uResolution: { value: new THREE.Vector2(width, height) },
        uTime: { value: 0.0 },
        uMotionBlur: { value: 0.0 }
      },
      vertexShader: [
        'varying vec2 vUv;',
        'void main() {',
        '  vUv = uv;',
        '  gl_Position = vec4(position.xy, 0.0, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D tDiffuse;',
        'uniform vec2 uResolution;',
        'uniform float uTime;',
        'uniform float uMotionBlur;',
        'varying vec2 vUv;',
        '',
        'void main() {',
        '  vec4 baseColor = texture2D(tDiffuse, vUv);',
        '  if (uMotionBlur > 0.005) {',
        '    vec2 toCenter = vec2(0.5, 0.5) - vUv;',
        '    float blurStr = uMotionBlur * 0.040;',
        '    vec4 b1 = texture2D(tDiffuse, vUv + toCenter * (blurStr * 0.25));',
        '    vec4 b2 = texture2D(tDiffuse, vUv + toCenter * (blurStr * 0.50));',
        '    vec4 b3 = texture2D(tDiffuse, vUv + toCenter * (blurStr * 0.75));',
        '    vec4 b4 = texture2D(tDiffuse, vUv + toCenter * blurStr);',
        '    baseColor = (baseColor + b1 + b2 + b3 + b4) * 0.20;',
        '  }',
        '  vec2 texel = 1.0 / uResolution;',
        '  vec3 bloom = vec3(0.0);',
        '',
        '  // 8-directional radial samples for subtle high-threshold bloom',
        '  vec2 dirs[8];',
        '  dirs[0] = vec2( 1.0,  0.0);',
        '  dirs[1] = vec2(-1.0,  0.0);',
        '  dirs[2] = vec2( 0.0,  1.0);',
        '  dirs[3] = vec2( 0.0, -1.0);',
        '  dirs[4] = vec2( 0.7071,  0.7071);',
        '  dirs[5] = vec2(-0.7071,  0.7071);',
        '  dirs[6] = vec2( 0.7071, -0.7071);',
        '  dirs[7] = vec2(-0.7071, -0.7071);',
        '',
        '  for (int i = 0; i < 8; i++) {',
        '    vec2 offset1 = dirs[i] * texel * 3.8;',
        '    vec2 offset2 = dirs[i] * texel * 9.5;',
        '    vec3 c1 = texture2D(tDiffuse, vUv + offset1).rgb;',
        '    vec3 c2 = texture2D(tDiffuse, vUv + offset2).rgb;',
        '    float l1 = dot(c1, vec3(0.2126, 0.7152, 0.0722));',
        '    float l2 = dot(c2, vec3(0.2126, 0.7152, 0.0722));',
        '    bloom += c1 * smoothstep(0.85, 1.30, l1) * 0.65;',
        '    bloom += c2 * smoothstep(0.85, 1.30, l2) * 0.35;',
        '  }',
        '  bloom *= (0.10 / 8.0); // Restrained bloom strictly for stellar emissive cores',
        '',
        '  // Cinematic Lens Vignette',
        '  vec2 coord = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);',
        '  float dist = length(coord);',
        '  float vignette = smoothstep(1.35, 0.35, dist);',
        '  vignette = clamp(mix(0.65, 1.0, vignette), 0.0, 1.0);',
        '',
        '  // Micro-fine film grain: strictly masked to lit surfaces so black space stays pure #000000',
        '  float grainNoise = fract(sin(dot(vUv * uResolution.xy + vec2(uTime * 41.3, uTime * 67.9), vec2(12.9898, 78.233))) * 43758.5453);',
        '  float lum = dot(baseColor.rgb, vec3(0.2126, 0.7152, 0.0722));',
        '  float grainMask = smoothstep(0.015, 0.25, lum);',
        '  float grain = (grainNoise - 0.5) * 0.008 * grainMask;',
        '',
        '  vec3 color = max(vec3(0.0), (baseColor.rgb + bloom) * vignette + vec3(grain));',
        '',
        '  gl_FragColor = vec4(color, baseColor.a);',
        '}'
      ].join('\n'),
      depthTest: false,
      depthWrite: false
    });

    postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
    postScene.add(postQuad);
  }

  // ── 03B. SECTOR 01 HERO VISUAL STAGING: ONE WORLD CONTINUOUS FLIGHT ──
  function updateSector01VisualStaging(progress) {
    const mProg = (window.MasterJourneyController && typeof window.MasterJourneyController.getProgress === 'function')
      ? window.MasterJourneyController.getProgress()
      : (typeof progress === 'number' ? progress : 0.0);
    const t = Math.max(0.0, Math.min(1.0, mProg));

    // Home flight progress p in [0.0, 1.0] across t in [0.00, 0.18]
    let p = 1.0;
    if (t < 0.18) {
      p = Math.max(0.0, Math.min(1.0, t / 0.18));
    } else if (typeof progress === 'number' && progress <= 1.0 && t === 0.0) {
      p = progress;
    }
    if (window.MasterJourneyController && typeof window.MasterJourneyController.getHomeProgress === 'function') {
      p = window.MasterJourneyController.getHomeProgress(t);
    }

    if (t <= 0.19) {
      // 1. Central Star (Sun) - Visible ONLY when Black Hole has fully left the screen (p > 0.52)
      // On the front page (Home, p=0.00 to p<=0.52), the Sun is completely hidden.
      // Once the camera has turned and the black hole has fully exited the screen (p > 0.52),
      // the Sun fades in and grows smoothly as we approach the Solar System.
      if (p <= 0.52) {
        if (centralStarGroup) centralStarGroup.visible = false;
        if (centralStarMesh) centralStarMesh.visible = false;
        if (starCoronaMesh) starCoronaMesh.visible = false;
        if (coreLight) coreLight.intensity = 0.0;
        if (coreWarmLight) coreWarmLight.intensity = 0.0;
        if (ambientLight) ambientLight.intensity = 0.015;
      } else {
        const sunP = Math.min(1.0, (p - 0.52) / 0.48);
        const sunScale = 0.08 + 0.92 * Math.pow(sunP, 1.75);
        if (centralStarGroup) {
          centralStarGroup.visible = true;
          centralStarGroup.scale.set(sunScale, sunScale, sunScale);
        }
        if (centralStarMesh) {
          centralStarMesh.visible = true;
        }
        if (starCoronaMesh) {
          starCoronaMesh.visible = true;
          const coronaOpacity = Math.min(1.0, sunP * 1.6) * (0.35 + 0.65 * sunP);
          if (starCoronaMesh.material) starCoronaMesh.material.opacity = coronaOpacity;
          const coronaScale = 0.10 + 0.90 * Math.pow(sunP, 1.6);
          starCoronaMesh.scale.set(coronaScale, coronaScale, coronaScale);
        }
        if (coreLight) coreLight.intensity = 0.3 + 2.5 * sunP;
        if (coreWarmLight) coreWarmLight.intensity = 0.15 + 1.25 * sunP;
        if (ambientLight) ambientLight.intensity = 0.015 + 0.035 * sunP;
      }

      // 2. Planets (0.75 - 0.92 Approach): resolve as small lit discs (crescents facing the Sun)
      if (planetsGroup) {
        if (p < 0.72) {
          planetsGroup.visible = false;
          planetsGroup.scale.set(0.001, 0.001, 0.001);
          planetMeshes.forEach(pm => {
            if (pm.group) pm.group.visible = false;
          });
        } else {
          planetsGroup.visible = true;
          const pAlpha = Math.min(1.0, (p - 0.72) / 0.18);
          planetsGroup.scale.set(1.0, 1.0, 1.0);
          planetMeshes.forEach(pm => {
            if (pm.group) pm.group.visible = true;
            if (pm.mesh && pm.mesh.material) {
              pm.mesh.material.opacity = pAlpha;
              pm.mesh.material.transparent = true;
            }
          });
        }
      }

      // 3. Orbit Lines (fade in last 0.85 - 0.96 and stay very faint)
      if (orbitalRingsGroup) {
        if (p < 0.84) {
          orbitalRingsGroup.visible = false;
        } else {
          orbitalRingsGroup.visible = true;
          const rAlpha = Math.min(1.0, (p - 0.84) / 0.12);
          orbitalRingsGroup.children.forEach(ring => {
            if (ring.material) {
              ring.material.opacity = 0.18 * rAlpha;
              ring.material.transparent = true;
            }
          });
        }
      }

      // 4. Asteroid Belt (fades in 0.88 - 0.98)
      if (asteroidBeltGroup) {
        if (p < 0.88) {
          asteroidBeltGroup.visible = false;
        } else {
          asteroidBeltGroup.visible = true;
          const aAlpha = Math.min(1.0, (p - 0.88) / 0.10);
          if (instancedAsteroidMesh && instancedAsteroidMesh.material) {
            instancedAsteroidMesh.material.opacity = aAlpha;
            instancedAsteroidMesh.material.transparent = true;
          }
        }
      }

      if (hudEl) {
        hudEl.style.display = 'none';
        hudEl.style.opacity = '0';
        hudEl.style.visibility = 'hidden';
        hudEl.style.pointerEvents = 'none';
      }
      const reticle = document.getElementById('galaxyPlanetReticle');
      if (reticle) {
        reticle.style.display = 'none';
        reticle.style.opacity = '0';
        reticle.classList.remove('is-sector02-active', 'is-scanning', 'is-locked');
      }
      const dossier = document.getElementById('galaxyDossierCard');
      if (dossier) {
        dossier.style.opacity = '0';
        dossier.style.pointerEvents = 'none';
      }
    } else if (t <= 0.572) {
      // Sector 02: Sol-7 Planetary Survey (Full solar system visibility up to Planet 07)
      if (scene && scene.fog) scene.fog.density = 0.00065;
      if (camera && Math.abs(camera.near - 1.0) > 0.05) {
        camera.near = 1.0;
        camera.updateProjectionMatrix();
      }
      if (centralStarGroup) {
        centralStarGroup.visible = true;
        centralStarGroup.scale.set(1, 1, 1);
      }
      if (centralStarMesh) {
        centralStarMesh.visible = true;
        if (centralStarMesh.material) { centralStarMesh.material.transparent = true; centralStarMesh.material.opacity = 1.0; }
      }
      if (starCoronaMesh) {
        starCoronaMesh.visible = true;
        if (starCoronaMesh.material) { starCoronaMesh.material.transparent = true; starCoronaMesh.material.opacity = 1.0; }
        starCoronaMesh.scale.set(1, 1, 1);
      }
      if (coreLight) coreLight.intensity = 2.8;
      if (coreWarmLight) coreWarmLight.intensity = 1.4;
      if (ambientLight) ambientLight.intensity = 0.28;
      if (planetsGroup) {
        planetsGroup.visible = true;
        planetsGroup.scale.set(1, 1, 1);
        planetMeshes.forEach(pm => {
          if (pm.group) pm.group.visible = true;
          if (pm.mesh && pm.mesh.material) { pm.mesh.material.transparent = true; pm.mesh.material.opacity = 1.0; }
        });
      }
      if (orbitalRingsGroup) {
        orbitalRingsGroup.visible = true;
        orbitalRingsGroup.children.forEach(ring => {
          if (ring.material) {
            if (!ring.userData.baseOpacity) ring.userData.baseOpacity = ring.material.opacity || 0.45;
            ring.material.opacity = ring.userData.baseOpacity;
          }
        });
      }
      if (asteroidBeltGroup) {
        asteroidBeltGroup.visible = true;
        if (instancedAsteroidMesh && instancedAsteroidMesh.material) instancedAsteroidMesh.material.opacity = 1.0;
      }

      if (hudEl) {
        hudEl.style.display = 'flex';
        hudEl.style.opacity = '1';
        hudEl.style.visibility = 'visible';
        hudEl.style.pointerEvents = 'auto';
      }
    } else {
      // Planet 07 -> Sky Map Continuous Transition (p in [0, 1]): NO POP-OUT!
      // Every visual element fades strictly as a continuous function of transitionProgress.
      const p = Math.max(0.0, Math.min(1.0, (t - 0.572) / (0.850 - 0.572)));
      const smooth = (a, b, x) => {
        const u = Math.max(0.0, Math.min(1.0, (x - a) / Math.max(0.0001, b - a)));
        return u * u * (3.0 - 2.0 * u);
      };

      const orbitAlpha = 1.0 - smooth(0.00, 0.24, p);
      const planetAlpha = 1.0 - smooth(0.18, 0.56, p);
      const sunAlpha = 1.0 - smooth(0.24, 0.64, p);
      const hudAlpha = 1.0 - smooth(0.00, 0.10, p);

      if (scene && scene.fog) {
        scene.fog.density = 0.00065 * (1.0 - smooth(0.0, 0.28, p));
      }
      if (camera) {
        const desiredNear = 1.0 + 7.0 * smooth(0.12, 0.40, p);
        if (Math.abs(camera.near - desiredNear) > 0.15) {
          camera.near = desiredNear;
          camera.updateProjectionMatrix();
        }
      }

      if (centralStarGroup) {
        const sunVis = sunAlpha > 0.003;
        centralStarGroup.visible = sunVis;
        centralStarGroup.scale.setScalar(Math.max(0.01, 1.0 - smooth(0.20, 0.65, p) * 0.72));
      }
      if (centralStarMesh) {
        centralStarMesh.visible = sunAlpha > 0.003;
        if (centralStarMesh.material) {
          centralStarMesh.material.transparent = true;
          centralStarMesh.material.opacity = sunAlpha;
        }
      }
      if (starCoronaMesh) {
        starCoronaMesh.visible = sunAlpha > 0.003;
        if (starCoronaMesh.material) {
          starCoronaMesh.material.transparent = true;
          starCoronaMesh.material.opacity = sunAlpha;
        }
        starCoronaMesh.scale.setScalar(Math.max(0.01, 1.0 - smooth(0.20, 0.65, p) * 0.65));
      }
      if (coreLight) coreLight.intensity = 2.8 * sunAlpha;
      if (coreWarmLight) coreWarmLight.intensity = 1.4 * sunAlpha;
      if (ambientLight) ambientLight.intensity = 0.015 + 0.265 * planetAlpha;

      if (planetsGroup) {
        const pVis = planetAlpha > 0.003;
        planetsGroup.visible = pVis;
        planetsGroup.scale.set(1, 1, 1); // Real 3D camera pullback provides true perspective shrinkage
        planetMeshes.forEach(pm => {
          if (pm.group) pm.group.visible = pVis;
          if (pm.mesh && pm.mesh.material) {
            pm.mesh.material.transparent = true;
            pm.mesh.material.opacity = planetAlpha;
          }
        });
      }
      if (orbitalRingsGroup) {
        const oVis = orbitAlpha > 0.003;
        orbitalRingsGroup.visible = oVis;
        orbitalRingsGroup.children.forEach(ring => {
          if (ring.material) {
            ring.material.transparent = true;
            if (!ring.userData.baseOpacity) ring.userData.baseOpacity = ring.material.opacity || 0.45;
            ring.material.opacity = ring.userData.baseOpacity * orbitAlpha;
          }
        });
      }
      if (asteroidBeltGroup) {
        asteroidBeltGroup.visible = planetAlpha > 0.003;
        if (instancedAsteroidMesh && instancedAsteroidMesh.material) {
          instancedAsteroidMesh.material.transparent = true;
          instancedAsteroidMesh.material.opacity = planetAlpha;
        }
      }

      if (hudEl) {
        if (hudAlpha > 0.005) {
          hudEl.style.display = 'flex';
          hudEl.style.opacity = hudAlpha.toFixed(3);
          hudEl.style.visibility = 'visible';
          hudEl.style.pointerEvents = hudAlpha > 0.4 ? 'auto' : 'none';
        } else {
          hudEl.style.display = 'none';
          hudEl.style.opacity = '0';
          hudEl.style.visibility = 'hidden';
          hudEl.style.pointerEvents = 'none';
        }
      }
      if (hudAlpha <= 0.005) {
        const reticle = document.getElementById('galaxyPlanetReticle');
        if (reticle) reticle.style.opacity = '0';
        const dossier = document.getElementById('galaxyDossierCard');
        if (dossier) {
          dossier.style.opacity = '0';
          dossier.style.pointerEvents = 'none';
        }
      }
    }
  }

  // ── 03C. SAME-SCENE 3D SKY MAP (PHASE 2: ONE CAMERA, TRUE 3D PARALLAX ALIGNMENT) ──
  const SKY_MAP_CONFIG = {
    // Camera alignment destination facing ~21° rotated sky patch away from Solar System
    camPos: { x: 640, y: 620, z: 3150 },
    forward: { x: 0.35, y: 0.17, z: -0.921 },
    depthRange: [880, 3650],        // Wide depth ratio (~4.15x) along each star's ray so parallax visibly slides stars!
    decoyStarCount: 80,             // Balanced count: no sudden star surge
    parallaxStarCount: 360,         // Gentle deep-space star density consistent with the rest of the site
    maxMouseParallaxPx: 4.5,        // Strictly <= 6 px at rest (transitionProgress = 1)
    yawDeg: 21,
    // Fully randomized, organic celestial distribution with generous spacing across all quadrants
    SKY_MAP: {
      languages: { x: -0.70, y:  0.22, scale: 0.135, rotation: -0.42 },
      backend:   { x: -0.06, y:  0.42, scale: 0.150, rotation:  0.38 },
      frontend:  { x:  0.62, y:  0.32, scale: 0.140, rotation: -0.65 },
      ai:        { x: -0.28, y: -0.02, scale: 0.150, rotation: -0.18 },
      databases: { x: -0.64, y: -0.38, scale: 0.130, rotation:  0.52 },
      cs:        { x:  0.18, y: -0.26, scale: 0.135, rotation: -0.35 },
      tools:     { x:  0.72, y: -0.14, scale: 0.130, rotation:  0.44 }
    }
  };

  let skyMapGroup = null;
  let skyMapMilkyWayMesh = null;
  let skyMapMilkyWayMat = null;
  let skyMapPoints = null;
  let skyMapPointsMat = null;
  let skyMapLines = null;
  let skyMapLinesMat = null;
  let skyMapLabelsOverlay = null;
  let skyMapHintEl = null;
  let skyMapBasePositions = null;
  let skyMapStarMeta = [];   // Constellation stars + helper stars metadata for line projection & labels
  let skyMapEdgeList = [];   // { secIdx, metaA, metaB }
  let skyMapSectorCenters = []; // { secIdx, key, title, count, worldCenter, labelEl, baseColorRGB }
  let contactBeaconMesh = null;
  let skyMapFpsThrottleRatio = 1.0;
  let skyMouseNormX = 0;
  let skyMouseNormY = 0;
  let smoothSkyMouseX = 0;
  let smoothSkyMouseY = 0;

  // Phase 3 & Phase 4: Interactive Sky Map + Open/Close Zoom + 0.4s 3D-to-2D Handoff
  const DETAIL_ZOOM_FRAC = 0.50;       // Swift, responsive zoom flight with seamless crossfade
  const DETAIL_OPEN_MS = 650;          // Fast, deliberate 0.65s zoom into constellation detail
  const DETAIL_CLOSE_MS = 550;         // Clean, immediate 0.55s return to wide sky map
  let hoveredSkySectorIdx = -1;
  let detailMode = 'skymap';           // 'skymap' | 'opening' | 'detail' | 'closing'
  let detailSectorIdx = 0;
  let detailProgress = 0.0;            // 0 = wide Sky Map, 1 = settled 2D Detail View
  let detailLastTickMs = 0;
  let detailSectorSwapOffset = { x: 0, y: 0 };
  let skyMapPanOffset = { x: 0, y: 0 };

  function getSkyMapBasis() {
    const cam = new THREE.Vector3(SKY_MAP_CONFIG.camPos.x, SKY_MAP_CONFIG.camPos.y, SKY_MAP_CONFIG.camPos.z);
    const fwd = new THREE.Vector3(SKY_MAP_CONFIG.forward.x, SKY_MAP_CONFIG.forward.y, SKY_MAP_CONFIG.forward.z).normalize();
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(right, fwd).normalize();
    return { cam, fwd, right, up };
  }

  function createMilkyWayCanvasTexture() {
    const w = 768;
    const h = 384;
    const cvs = document.createElement('canvas');
    cvs.width = w;
    cvs.height = h;
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    // Deterministic PRNG for organic cloud puffs & dust knots
    let seed = 42197;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.rotate(-0.32);

    // Broad soft atmospheric galactic glow (diffuse nebula gradient, zero hard line)
    const band = ctx.createLinearGradient(0, -165, 0, 165);
    band.addColorStop(0.0, 'rgba(18, 26, 46, 0)');
    band.addColorStop(0.28, 'rgba(30, 44, 72, 0.08)');
    band.addColorStop(0.50, 'rgba(54, 68, 102, 0.14)');
    band.addColorStop(0.72, 'rgba(30, 44, 72, 0.08)');
    band.addColorStop(1.0, 'rgba(18, 26, 46, 0)');
    ctx.fillStyle = band;
    ctx.fillRect(-w * 0.65, -165, w * 1.3, 330);

    // Soft cloudy star-cloud wisps scattered organically (no central stripe!)
    for (let i = 0; i < 84; i++) {
      const cx = (rand() - 0.5) * w * 0.88;
      const cy = (rand() - 0.5) * 95;
      const r = 38 + rand() * 68;
      const warm = rand() > 0.52;
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      rg.addColorStop(0, warm ? 'rgba(92, 86, 102, 0.036)' : 'rgba(54, 72, 112, 0.044)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gentle staggered dark dust knots scattered off-center so no straight rift appears
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 20; i++) {
      const dx = (rand() - 0.5) * w * 0.78;
      const dy = (rand() - 0.5) * 76;
      const rx = 50 + rand() * 80;
      const ry = 22 + rand() * 26;
      const rg = ctx.createRadialGradient(dx, dy, 4, dx, dy, rx);
      rg.addColorStop(0, 'rgba(0,0,0,0.16)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.save();
      ctx.scale(1, ry / rx);
      ctx.beginPath();
      ctx.arc(dx, dy * (rx / ry), rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // Elliptical border vignette mask so ALL 4 canvas edges reach exact alpha=0 (eliminates rectangle seam!)
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.translate(w * 0.5, h * 0.5);
    ctx.scale(1.0, h / w);
    const mask = ctx.createRadialGradient(0, 0, w * 0.14, 0, 0, w * 0.46);
    mask.addColorStop(0.0, 'rgba(0,0,0,1)');
    mask.addColorStop(0.62, 'rgba(0,0,0,0.75)');
    mask.addColorStop(1.0, 'rgba(0,0,0,0)');
    ctx.fillStyle = mask;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Fine non-repeating dither grain to prevent 8-bit quantization stipple on dark displays
    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 2) {
          const j = ((rand() - 0.5) * 4) | 0;
          d[i] = Math.max(0, Math.min(255, d[i] + j));
          d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + j));
          d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + j));
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch (_e) {}

    const tex = new THREE.CanvasTexture(cvs);
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }

  function tempToRgbArray(tempName) {
    const pal = {
      'blue-white': [0.78, 0.88, 1.00],
      'white':      [0.98, 0.98, 1.00],
      'yellow':     [1.00, 0.90, 0.66],
      'orange':     [1.00, 0.74, 0.48]
    };
    return pal[tempName] || pal['white'];
  }

  function ndcToSkyWorld(ndcX, ndcY, depth, basis, aspect) {
    const tanHalfFov = Math.tan((46.0 * Math.PI / 180.0) * 0.5);
    const hHalf = depth * tanHalfFov;
    const wHalf = hHalf * aspect;
    return basis.cam.clone()
      .addScaledVector(basis.fwd, depth)
      .addScaledVector(basis.right, ndcX * wHalf)
      .addScaledVector(basis.up, ndcY * hHalf);
  }

  function buildSkyMapStage() {
    if (!scene) return;
    if (skyMapGroup) {
      scene.remove(skyMapGroup);
    }

    skyMapGroup = new THREE.Group();
    skyMapGroup.visible = false;
    scene.add(skyMapGroup);

    const basis = getSkyMapBasis();
    const aspect = Math.max(0.55, Math.min(2.1, (containerEl?.clientWidth || window.innerWidth) / Math.max(1, containerEl?.clientHeight || window.innerHeight)));

    // 1. Procedural Milky Way Plane (disabled to ensure deep pure black cosmic sky with zero white fade)
    const mwTex = createMilkyWayCanvasTexture();
    const mwGeo = new THREE.PlaneGeometry(7800, 4200);
    skyMapMilkyWayMat = new THREE.MeshBasicMaterial({
      map: mwTex,
      transparent: true,
      opacity: 0.0,
      visible: false,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    skyMapMilkyWayMesh = new THREE.Mesh(mwGeo, skyMapMilkyWayMat);
    skyMapMilkyWayMesh.visible = false;
    const mwCenter = basis.cam.clone().addScaledVector(basis.fwd, 4400);
    skyMapMilkyWayMesh.position.copy(mwCenter);
    skyMapMilkyWayMesh.lookAt(basis.cam);
    skyMapMilkyWayMesh.renderOrder = -20;
    skyMapGroup.add(skyMapMilkyWayMesh);

    // 2. Harvest shared shapes & project brightness from TechnologyConstellation
    if (window.TechnologyConstellation && typeof window.TechnologyConstellation.init === 'function') {
      window.TechnologyConstellation.init();
    }
    const sectors = (window.TechnologyConstellation && typeof window.TechnologyConstellation.getSectorData === 'function')
      ? window.TechnologyConstellation.getSectorData()
      : [];

    // Seeded PRNG for deterministic star depths & decoy positions
    let seed = 73913;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const starRecords = [];
    skyMapStarMeta = [];
    skyMapEdgeList = [];
    skyMapSectorCenters = [];

    const [minD, maxD] = SKY_MAP_CONFIG.depthRange;

    // Build placeholder label overlay once
    if (!skyMapLabelsOverlay) {
      skyMapLabelsOverlay = document.createElement('div');
      skyMapLabelsOverlay.id = 'skyMapLabelsLayer';
      skyMapLabelsOverlay.setAttribute('aria-hidden', 'true');
      skyMapLabelsOverlay.style.cssText = [
        'position:fixed',
        'inset:0',
        'pointer-events:none',
        'z-index:12',
        'opacity:0',
        'visibility:hidden'
      ].join(';');
      const mountParent = document.getElementById('worksGalaxyStage') || document.body;
      mountParent.appendChild(skyMapLabelsOverlay);
    }
    skyMapLabelsOverlay.innerHTML = '';
    skyMapHintEl = null;

    // 2A. Constellation Stars (placed along SKY_CAM_POS -> SKY_MAP rays at varied depths)
    sectors.forEach((sec, secIdx) => {
      const slot = SKY_MAP_CONFIG.SKY_MAP[sec.key];
      if (!slot) return;

      const cosR = Math.cos(slot.rotation);
      const sinR = Math.sin(slot.rotation);
      const startRecordIdx = skyMapStarMeta.length;

      let minStarNdcY = Infinity;
      let sumStarNdcX = 0;
      const secStarMetas = [];

      const itemContainer = document.createElement('div');
      itemContainer.className = 'sky-map-item';
      itemContainer.setAttribute('data-sector-key', sec.key);
      itemContainer.setAttribute('data-sector-idx', String(secIdx));
      itemContainer.setAttribute('role', 'button');
      itemContainer.setAttribute('tabindex', '0');
      itemContainer.setAttribute('aria-label', `Open ${sec.title} constellation (${sec.techCount} technologies)`);
      itemContainer.style.background = 'transparent';
      itemContainer.style.backgroundColor = 'transparent';
      itemContainer.style.border = 'none';
      itemContainer.style.outline = 'none';
      itemContainer.style.boxShadow = 'none';
      itemContainer.style.padding = '0';
      itemContainer.style.margin = '0';
      itemContainer.style.color = 'inherit';
      itemContainer.style.cursor = 'pointer';
      itemContainer.style.pointerEvents = 'none';

      // Constellation structure interaction: clicking anywhere on constellation or hovering it focuses/opens it
      itemContainer.addEventListener('pointerenter', () => setHoveredSkySector(secIdx));
      itemContainer.addEventListener('pointerleave', () => {
        if (hoveredSkySectorIdx === secIdx) setHoveredSkySector(-1);
      });
      itemContainer.addEventListener('focus', () => setHoveredSkySector(secIdx));
      itemContainer.addEventListener('blur', () => {
        if (hoveredSkySectorIdx === secIdx) setHoveredSkySector(-1);
      });
      itemContainer.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openConstellation(secIdx);
      });
      itemContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          openConstellation(secIdx);
        }
      });

      sec.stars.forEach((st, localIdx) => {
        const rx = st.x * cosR - st.y * sinR;
        const ry = st.x * sinR + st.y * cosR;
        // Aspect-corrected figure scale so silhouettes keep identical proportions on sky map
        const ndcX = slot.x + (rx * slot.scale) / Math.max(1.0, aspect * 0.65);
        const ndcY = slot.y - ry * slot.scale;
        if (ndcY < minStarNdcY) minStarNdcY = ndcY;
        sumStarNdcX += ndcX;
        const depth = minD + rand() * (maxD - minD);
        const worldPos = ndcToSkyWorld(ndcX, ndcY, depth, basis, aspect);
        const rgb = tempToRgbArray(st.temp);
        // Match TechnologyConstellation.drawRealPointStar halo diameter (~2 * glowR) for 3D->2D handoff
        const glowR2d = st.isHelper ? 8.0 : (10.0 + Math.max(0.38, st.brightness || 0.72) * 12.0);

        // Individual technology labels removed from 7-constellation overview for a clean astronomical sky map.
        // Full data for all 39 technologies preserved in st.tech, star meta, and detailed view.
        const tagEl = null;

        const rec = {
          kind: 0, // 0 = constellation star
          recordIndex: starRecords.length,
          secIdx,
          localIdx,
          isHelper: !!st.isHelper,
          tech: st.tech || '',
          tagEl,
          ndcX,
          ndcY,
          depth,
          baseWorldPos: worldPos.clone(),
          detailWorldPos: worldPos.clone(),
          worldPos,
          rgb,
          size: st.isHelper ? 4.5 : (6.5 + (st.brightness || 0.6) * 5.0),
          detailSize: glowR2d * 1.45,
          brightness: st.isHelper ? (st.faint || 0.26) : Math.max(0.38, st.brightness || 0.72),
          hasSpikes: 0.0,
          phase: rand() * Math.PI * 2,
          revealOrder: secIdx * 0.03 + localIdx * 0.025
        };
        starRecords.push(rec);
        skyMapStarMeta.push(rec);
        secStarMetas.push(rec);
      });

      // Exact bounding-box bottom placement (~32px below lowest star of this constellation for clean separation)
      const labelNdcX = sec.stars.length > 0 ? (sumStarNdcX / sec.stars.length) : slot.x;
      const labelNdcY = (Number.isFinite(minStarNdcY) ? minStarNdcY : (slot.y - slot.scale)) - 0.076;
      const centerWorld = ndcToSkyWorld(labelNdcX, labelNdcY, 2200, basis, aspect);

      const pillBtn = document.createElement('div');
      pillBtn.className = 'sky-map-label-pill';
      pillBtn.setAttribute('aria-label', `${sec.title} constellation (${sec.techCount} technologies)`);
      pillBtn.style.setProperty('--sector-color', sec.color || '#F59E0B');
      pillBtn.style.setProperty('--sector-rgb', sec.rgb || '245, 158, 11');
      pillBtn.style.background = 'rgba(6, 10, 20, 0.88)';
      pillBtn.style.backgroundColor = 'rgba(6, 10, 20, 0.88)';
      pillBtn.style.color = 'rgba(241, 232, 208, 0.94)';
      pillBtn.style.border = `1px solid rgba(${sec.rgb || '245, 158, 11'}, 0.45)`;
      pillBtn.style.borderRadius = '20px';
      pillBtn.style.padding = '6px 14px';
      pillBtn.style.backdropFilter = 'blur(8px)';
      pillBtn.style.webkitBackdropFilter = 'blur(8px)';
      pillBtn.style.boxShadow = `0 4px 18px rgba(0, 0, 0, 0.85), 0 0 12px rgba(${sec.rgb || '245, 158, 11'}, 0.15)`;
      pillBtn.style.cursor = 'pointer';
      pillBtn.innerHTML = `
        <span class="sky-map-pill-dot" style="background:${sec.color || '#F59E0B'}"></span>
        <span class="sky-map-pill-title">${sec.title} &middot; ${sec.techCount}</span>
      `;

      const pillWrapper = document.createElement('div');
      pillWrapper.className = 'sky-map-pill-wrapper';
      pillWrapper.appendChild(pillBtn);

      itemContainer.appendChild(pillWrapper);

      pillBtn.addEventListener('pointerenter', () => setHoveredSkySector(secIdx));
      pillBtn.addEventListener('pointerleave', () => {
        if (hoveredSkySectorIdx === secIdx) setHoveredSkySector(-1);
      });
      pillBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openConstellation(secIdx);
      });

      skyMapLabelsOverlay.appendChild(itemContainer);

      skyMapSectorCenters.push({
        secIdx,
        key: sec.key,
        title: sec.title,
        count: sec.techCount,
        slot,
        worldCenter: centerWorld,
        stars: secStarMetas,
        labelEl: itemContainer,
        pillEl: pillBtn
      });

      sec.edges.forEach(([aLocal, bLocal]) => {
        const metaA = skyMapStarMeta[startRecordIdx + aLocal];
        const metaB = skyMapStarMeta[startRecordIdx + bLocal];
        if (metaA && metaB) {
          skyMapEdgeList.push({ secIdx, metaA, metaB });
        }
      });
    });

    // 2B. 3 Spatial Depth Layers for Genuine 3D Cosmic Depth
    // Spectral colors: authentic B-V temperatures (O/B blue-white, A/F pure white, G yellow-white, K warm amber)
    const temps = ['blue-white', 'white', 'white', 'yellow', 'orange'];

    // Layer 0: Immense Distance Field (480 tiny faint stars with near-zero parallax)
    // Includes 2 faint distant open star clusters (Messier-style natural celestial grouping)
    const cluster1Center = { x: 0.82, y: 0.55 };
    const cluster2Center = { x: -0.92, y: -0.68 };

    for (let i = 0; i < 480; i++) {
      let ndcX, ndcY;
      // 18% of distant stars form natural stellar clusters
      if (i < 45) {
        // Cluster 1 (Pleiades-like open cluster)
        ndcX = cluster1Center.x + (rand() - 0.5) * 0.28;
        ndcY = cluster1Center.y + (rand() - 0.5) * 0.22;
      } else if (i < 85) {
        // Cluster 2 (Hyades-like open cluster)
        ndcX = cluster2Center.x + (rand() - 0.5) * 0.32;
        ndcY = cluster2Center.y + (rand() - 0.5) * 0.26;
      } else {
        // Broad cosmic field
        ndcX = (rand() * 2 - 1) * 2.35;
        ndcY = (rand() * 2 - 1) * 1.95;
      }

      // Immense distance: 3600 to 5200 AU
      const depth = 3600 + rand() * 1600;
      const worldPos = ndcToSkyWorld(ndcX, ndcY, depth, basis, aspect);
      const rgb = tempToRgbArray(temps[Math.floor(rand() * temps.length)]);
      const lum = Math.pow(rand(), 4.2);

      starRecords.push({
        kind: 2,
        layer: 0,
        worldPos,
        rgb,
        size: 3.2 + lum * 2.8,
        brightness: 0.15 + lum * 0.28,
        hasSpikes: 0.0,
        phase: rand() * Math.PI * 2,
        revealOrder: 0
      });
    }

    // Layer 1: Intermediate Field (240 medium stars with gentle parallax)
    for (let i = 0; i < 240; i++) {
      const ndcX = (rand() * 2 - 1) * 1.85;
      const ndcY = (rand() * 2 - 1) * 1.55;
      // Mid distance: 1900 to 3400 AU
      const depth = 1900 + rand() * 1500;
      const worldPos = ndcToSkyWorld(ndcX, ndcY, depth, basis, aspect);
      const rgb = tempToRgbArray(temps[Math.floor(rand() * temps.length)]);
      const lum = Math.pow(rand(), 3.2);

      starRecords.push({
        kind: 2,
        layer: 1,
        worldPos,
        rgb,
        size: 5.5 + lum * 4.5,
        brightness: 0.32 + lum * 0.45,
        hasSpikes: 0.0,
        phase: rand() * Math.PI * 2,
        revealOrder: 0
      });
    }

    // Layer 2: Foreground Stardust & Near Stars (65 stars with noticeable parallax)
    for (let i = 0; i < 65; i++) {
      const ndcX = (rand() * 2 - 1) * 1.45;
      const ndcY = (rand() * 2 - 1) * 1.25;
      // Near distance: 850 to 1750 AU (close to camera)
      const depth = 850 + rand() * 900;
      const worldPos = ndcToSkyWorld(ndcX, ndcY, depth, basis, aspect);
      const rgb = tempToRgbArray(temps[Math.floor(rand() * temps.length)]);
      const lum = Math.pow(rand(), 2.8);

      starRecords.push({
        kind: 2,
        layer: 2,
        worldPos,
        rgb,
        size: 7.5 + lum * 3.5,
        brightness: 0.62 + lum * 0.35,
        hasSpikes: 0.0,
        phase: rand() * Math.PI * 2,
        revealOrder: 0
      });
    }

    // Pack ALL stars into ONE THREE.BufferGeometry (1 draw call!)
    const total = starRecords.length;
    const positions = new Float32Array(total * 3);
    const colors = new Float32Array(total * 3);
    const sizes = new Float32Array(total);
    const detailSizes = new Float32Array(total);
    const secIds = new Float32Array(total);
    const attrsMeta = new Float32Array(total * 4); // x: brightness, y: phase, z: hasSpikes, w: kind/reveal

    for (let i = 0; i < total; i++) {
      const r = starRecords[i];
      positions[i * 3 + 0] = r.worldPos.x;
      positions[i * 3 + 1] = r.worldPos.y;
      positions[i * 3 + 2] = r.worldPos.z;
      colors[i * 3 + 0] = r.rgb[0];
      colors[i * 3 + 1] = r.rgb[1];
      colors[i * 3 + 2] = r.rgb[2];
      sizes[i] = r.size;
      detailSizes[i] = r.detailSize || r.size;
      secIds[i] = r.kind === 0 ? r.secIdx : -1.0;
      attrsMeta[i * 4 + 0] = r.brightness;
      attrsMeta[i * 4 + 1] = r.phase;
      attrsMeta[i * 4 + 2] = r.hasSpikes;
      attrsMeta[i * 4 + 3] = r.kind === 0 ? (0.1 + r.revealOrder) : (r.kind === 1 ? -1.0 : -2.0);
    }

    skyMapBasePositions = new Float32Array(positions);

    const ptsGeo = new THREE.BufferGeometry();
    ptsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ptsGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    ptsGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    ptsGeo.setAttribute('aDetailSize', new THREE.BufferAttribute(detailSizes, 1));
    ptsGeo.setAttribute('aSecIdx', new THREE.BufferAttribute(secIds, 1));
    ptsGeo.setAttribute('aMeta', new THREE.BufferAttribute(attrsMeta, 4));
    ptsGeo.userData.totalCount = total;

    skyMapPointsMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uTransitionP: { value: 0.0 },
        uOpacity: { value: 0.0 },
        uReducedMotion: { value: isReducedMotion ? 1.0 : 0.0 },
        uHoveredSector: { value: -1.0 },
        uActiveDetailSec: { value: -1.0 },
        uDetailZoom: { value: 0.0 },
        uDetailFadeOut: { value: 1.0 },
        uGather: { value: 0.0 }
      },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aDetailSize;
        attribute float aSecIdx;
        attribute vec4 aMeta;
        uniform float uPixelRatio;
        uniform float uTransitionP;
        uniform float uTime;
        uniform float uReducedMotion;
        uniform float uHoveredSector;
        uniform float uActiveDetailSec;
        uniform float uDetailZoom;
        uniform float uDetailFadeOut;
        uniform float uGather;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vSpikes;

        float smoothstepLocal(float a, float b, float x) {
          float u = clamp((x - a) / max(0.0001, b - a), 0.0, 1.0);
          return u * u * (3.0 - 2.0 * u);
        }

        void main() {
          vColor = aColor;

          float baseBright = aMeta.x;
          float phase = aMeta.y;
          float kindTag = aMeta.w;

          // Star brightness curve across transitionProgress:
          float vis = smoothstepLocal(0.15, 0.45, uTransitionP);
          if (kindTag > 0.0) {
            float seqStart = 0.44 + (kindTag - 0.1) * 0.62;
            float baseAt55 = 0.36;
            vis = baseAt55 * smoothstepLocal(0.24, 0.50, uTransitionP) +
                  (1.0 - baseAt55) * smoothstepLocal(seqStart, seqStart + 0.18, uTransitionP);
          }

          float hoverBoost = 1.0;
          float detailVis = 1.0;
          float activeMatch = 0.0;
          if (aSecIdx >= 0.0) {
            if (uHoveredSector >= -0.5 && uDetailZoom <= 0.01) {
              float isHov = 1.0 - step(0.25, abs(aSecIdx - uHoveredSector));
              // Balanced contrast: hovered constellation is crisp and distinct (1.35x), other constellations gently dimmed (0.32x)
              hoverBoost = mix(0.32, 1.35, isHov);
            }
            if (uActiveDetailSec >= -0.5) {
              activeMatch = 1.0 - step(0.25, abs(aSecIdx - uActiveDetailSec));
              float otherFade = 1.0 - smoothstepLocal(0.0, 0.45, uDetailZoom);
              detailVis = mix(otherFade, uDetailFadeOut, activeMatch);
            }
          }

          vSpikes = 0.0; // Strictly realistic round point stars with zero artificial cross spikes

          // Scintillation / atmospheric twinkling with asynchronous frequencies per star:
          float freq = 1.1 + fract(phase * 4.3) * 2.5;
          float twinkle = uReducedMotion > 0.5 ? 1.0 : (1.0 + 0.07 * sin(uTime * freq + phase) + 0.03 * cos(uTime * (freq * 1.6) + phase * 2.1));
          vAlpha = baseBright * vis * twinkle * hoverBoost * detailVis;

          float ptSize = mix(aSize * (0.90 + 0.15 * vis), aDetailSize, activeMatch * uDetailZoom);
          if (hoverBoost > 1.15) {
            ptSize *= 1.12; // Subtle, elegant expansion - never an explosive blob
          } else if (hoverBoost < 0.45) {
            ptSize *= 0.88; // Subtle dim
          }

          vec3 displacedPos = position;
          if (uGather > 0.001) {
            float distToBeam = length(position.xy - vec2(280.0, -180.0));
            float influence = smoothstep(340.0, 40.0, distToBeam) * uGather;
            vec3 gatherOffset = vec3(
              sin(aMeta.y * 12.3) * 16.0,
              cos(aMeta.y * 8.7) * 18.0,
              0.0
            );
            displacedPos += gatherOffset * influence;
          }

          vec4 mvPos = modelViewMatrix * vec4(displacedPos, 1.0);
          gl_PointSize = ptSize * uPixelRatio;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vSpikes;

        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv) * 2.0;
          if (d > 1.0) discard;

          // High-fidelity astronomical point-source PSF (Airy disk pinpoint core + Moffat atmospheric halo):
          float core = exp(-d * d * 56.0);
          float halo = pow(1.0 + d * d * 18.0, -2.4) * 0.42;
          float intensity = clamp(core + halo, 0.0, 1.0);
          vec3 col = mix(vColor, vec3(1.0), core * 0.88);
          gl_FragColor = vec4(col, intensity * vAlpha * uOpacity);
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    skyMapPoints = new THREE.Points(ptsGeo, skyMapPointsMat);
    skyMapPoints.renderOrder = 5;
    skyMapGroup.add(skyMapPoints);

    // 3. Constellation Lines (LineSegments with per-vertex colors for hover highlight & gold->2D blend)
    const lineVerts = new Float32Array(skyMapEdgeList.length * 6);
    const lineCols = new Float32Array(skyMapEdgeList.length * 6);
    for (let i = 0; i < lineCols.length; i += 3) {
      lineCols[i + 0] = 0.902;
      lineCols[i + 1] = 0.745;
      lineCols[i + 2] = 0.416;
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(lineVerts, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCols, 3));
    skyMapLinesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    skyMapLines = new THREE.LineSegments(lineGeo, skyMapLinesMat);
    skyMapLines.renderOrder = 6;
    skyMapGroup.add(skyMapLines);

    // 4. Distant Contact Transmission Beacon (Leg 3 approach cruise, 0.88 <= t <= 0.94)
    const beaconCanvas = document.createElement('canvas');
    beaconCanvas.width = 64;
    beaconCanvas.height = 64;
    const bCtx = beaconCanvas.getContext('2d');
    const grad = bCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.25, 'rgba(0, 240, 255, 0.95)');
    grad.addColorStop(0.55, 'rgba(0, 180, 255, 0.40)');
    grad.addColorStop(1.0, 'rgba(0, 80, 200, 0.0)');
    bCtx.fillStyle = grad;
    bCtx.fillRect(0, 0, 64, 64);
    const beaconTex = new THREE.CanvasTexture(beaconCanvas);
    const beaconMat = new THREE.SpriteMaterial({
      map: beaconTex,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false
    });
    contactBeaconMesh = new THREE.Sprite(beaconMat);
    contactBeaconMesh.scale.set(40, 40, 1);
    const P_87 = basis.cam.clone()
      .addScaledVector(basis.fwd, 1100)
      .addScaledVector(basis.right, 820)
      .addScaledVector(basis.up, -480);
    contactBeaconMesh.position.copy(P_87);
    contactBeaconMesh.renderOrder = 8;
    skyMapGroup.add(contactBeaconMesh);
  }

  function dismissSkyMapHint() {
    if (skyMapHintEl) {
      skyMapHintEl.style.opacity = '0';
      skyMapHintEl.style.pointerEvents = 'none';
      setTimeout(() => {
        if (skyMapHintEl && skyMapHintEl.parentNode) {
          skyMapHintEl.parentNode.removeChild(skyMapHintEl);
        }
        skyMapHintEl = null;
      }, 360);
    }
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('agy_skymap_hint_dismissed', '1');
      }
    } catch (_e) {}
  }

  function setHoveredSkySector(secIdx) {
    if (detailMode !== 'skymap') secIdx = -1;
    hoveredSkySectorIdx = secIdx;
    if (secIdx >= 0) dismissSkyMapHint();
    if (skyMapPointsMat && skyMapPointsMat.uniforms.uHoveredSector) {
      skyMapPointsMat.uniforms.uHoveredSector.value = secIdx;
    }
    skyMapSectorCenters.forEach(item => {
      if (!item.labelEl) return;
      item.labelEl.classList.toggle('is-hovered', secIdx >= 0 && item.secIdx === secIdx);
      item.labelEl.classList.toggle('is-dimmed', secIdx >= 0 && item.secIdx !== secIdx);
    });
  }

  function getZoomCameraPose(secIdx, basis, aspect) {
    const item = skyMapSectorCenters[secIdx];
    const slot = item ? item.slot : { x: 0, y: 0, scale: 0.14, rotation: 0 };
    const rayPt = ndcToSkyWorld(slot.x, slot.y, 2200, basis, aspect);
    const dir = rayPt.clone().sub(basis.cam).normalize();
    const camZoom = basis.cam.clone().addScaledVector(dir, 640);
    const lookZoom = rayPt.clone().addScaledVector(dir, 1480);
    return { camZoom, lookZoom, dir, slot };
  }

  function computeDetailStarTargets(secIdx) {
    if (typeof THREE === 'undefined' || !containerEl) return;
    const w = window.innerWidth || containerEl.clientWidth || 1366;
    const h = window.innerHeight || containerEl.clientHeight || 768;
    const aspect = Math.max(0.45, Math.min(2.4, w / Math.max(1, h)));
    const basis = getSkyMapBasis();
    const { camZoom, lookZoom } = getZoomCameraPose(secIdx, basis, aspect);

    // Construct temporary exact camera matching settled zoomed pose (fov 42, zero roll)
    const refCam = new THREE.PerspectiveCamera(42.0, aspect, 1.0, 7500);
    refCam.position.copy(camZoom);
    refCam.up.set(0, 1, 0);
    refCam.lookAt(lookZoom);
    refCam.updateMatrixWorld();
    refCam.updateProjectionMatrix();

    // Read exact 2D Detail View pixel targets from TechnologyConstellation so last 3D frame matches within <1px
    const metrics = (window.TechnologyConstellation && typeof window.TechnologyConstellation.getLayoutMetrics === 'function')
      ? window.TechnologyConstellation.getLayoutMetrics()
      : null;
    if (!metrics || !metrics.stars) return;

    const starByLocal = new Map(metrics.stars.map(s => [s.idx, s]));
    skyMapStarMeta.forEach(m => {
      if (m.secIdx !== secIdx) return;
      const tStar = starByLocal.get(m.localIdx);
      if (!tStar) return;
      const ndcX = (tStar.sx / w) * 2.0 - 1.0;
      const ndcY = 1.0 - (tStar.sy / h) * 2.0;
      const p3 = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(refCam);
      const rayDir = p3.sub(camZoom).normalize();
      m.detailWorldPos.copy(camZoom).addScaledVector(rayDir, 2200.0);
    });
  }

  function openConstellation(keyOrIdx) {
    if (!skyMapSectorCenters.length) return;
    let idx = typeof keyOrIdx === 'number'
      ? keyOrIdx
      : skyMapSectorCenters.findIndex(s => s.key === keyOrIdx);
    if (idx < 0 || idx >= skyMapSectorCenters.length) return;

    const WAYPOINTS = [0.670, 0.710, 0.750, 0.790, 0.830, 0.870, 0.910];
    if (window.MasterJourneyController && typeof window.MasterJourneyController.setTargetProgress === 'function') {
      window.MasterJourneyController.setTargetProgress(WAYPOINTS[idx], true);
    }
  }

  function closeConstellationDetail(instant = false) {
    if (detailMode === 'skymap' && detailProgress <= 0.001) return;
    setHoveredSkySector(-1);
    if (instant || isReducedMotion) {
      detailProgress = 0.0;
      detailMode = 'skymap';
      if (window.TechnologyConstellation && typeof window.TechnologyConstellation.setSharedBackdropMode === 'function') {
        window.TechnologyConstellation.setSharedBackdropMode(false);
      }
      const discEl = document.getElementById('disciplines');
      if (discEl) {
        discEl.style.opacity = '0';
        discEl.style.visibility = 'hidden';
        discEl.style.pointerEvents = 'none';
        discEl.classList.remove('is-interactive');
      }
      return;
    }
    detailLastTickMs = performance.now();
    detailMode = 'closing';
  }

  function setActiveDetailSector(keyOrIdx) {
    const idx = typeof keyOrIdx === 'number'
      ? keyOrIdx
      : skyMapSectorCenters.findIndex(s => s.key === keyOrIdx);
    if (idx < 0 || idx >= skyMapSectorCenters.length || idx === detailSectorIdx) return;
    detailSectorIdx = idx;
    computeDetailStarTargets(idx);
  }

  function tickDetailTransition() {
    if (detailMode !== 'opening' && detailMode !== 'closing') return;
    const now = performance.now();
    const dtMs = Math.max(0, Math.min(50, now - (detailLastTickMs || now)));
    detailLastTickMs = now;
    if (detailMode === 'opening') {
      const dur = isReducedMotion ? 240 : DETAIL_OPEN_MS;
      detailProgress = Math.min(1.0, detailProgress + dtMs / dur);
      if (detailProgress >= 1.0) {
        detailProgress = 1.0;
        detailMode = 'detail';
      }
    } else {
      const dur = isReducedMotion ? 220 : DETAIL_CLOSE_MS;
      detailProgress = Math.max(0.0, detailProgress - dtMs / dur);
      if (detailProgress <= 0.0) {
        detailProgress = 0.0;
        detailMode = 'skymap';
        if (window.TechnologyConstellation && typeof window.TechnologyConstellation.setSharedBackdropMode === 'function') {
          window.TechnologyConstellation.setSharedBackdropMode(false);
        }
      }
    }
  }

  function updateSkyMapStage(p, elapsedSec, masterT) {
    if (!skyMapGroup || !camera) return;

    const smooth = (a, b, x) => {
      const u = Math.max(0.0, Math.min(1.0, (x - a) / Math.max(0.0001, b - a)));
      return u * u * (3.0 - 2.0 * u);
    };

    // Continuous Starfield across all sectors: Stars stay 100% visible across Leg 3 (0.85 -> 1.00)
    // ONLY constellation lines and interactive labels fade out over 0.85 -> 0.88
    const lineLeg3Fade = (typeof masterT === 'number' && masterT >= 0.85)
      ? (1.0 - smooth(0.85, 0.88, masterT))
      : 1.0;

    const disciplinesEl = document.getElementById('disciplines');
    const isDestroyed = (typeof BlackHoleLifecycle !== 'undefined' &&
      (BlackHoleLifecycle.isDestroyed() || BlackHoleLifecycle.isDestroying() || BlackHoleLifecycle.isReadyToDestroy()));

    // Hide sky map only when completely back in solar system (p <= 0.01)
    if (p <= 0.01) {
      skyMapGroup.visible = false;
      if (skyMapLabelsOverlay) {
        skyMapLabelsOverlay.style.opacity = '0';
        skyMapLabelsOverlay.style.visibility = 'hidden';
        skyMapLabelsOverlay.style.pointerEvents = 'none';
      }
      if (disciplinesEl && detailMode !== 'detail') {
        disciplinesEl.style.opacity = '0';
        disciplinesEl.style.visibility = 'hidden';
        disciplinesEl.style.pointerEvents = 'none';
        disciplinesEl.classList.remove('is-interactive');
      }
      return;
    }

    skyMapGroup.visible = true;

    const zoomU = Math.max(0.0, Math.min(1.0, detailProgress / DETAIL_ZOOM_FRAC));
    const handoffAlpha = smooth(DETAIL_ZOOM_FRAC, 1.0, detailProgress);
    const activeSecForShader = detailProgress > 0.001 ? detailSectorIdx : -1.0;

    // 1. Milky Way (kept completely dark to avoid white/gray sky haze)
    if (skyMapMilkyWayMat) {
      skyMapMilkyWayMat.opacity = 0.0;
      if (skyMapMilkyWayMesh) skyMapMilkyWayMesh.visible = false;
    }

    // 2. Interpolate selected constellation star 3D positions smoothly from Sky Map rays to exact 2D layout targets
    if (skyMapPoints && skyMapBasePositions) {
      const ptsPosAttr = skyMapPoints.geometry.getAttribute('position');
      const posBlend = smooth(0.22, 0.96, zoomU);
      let anyMoved = false;
      skyMapStarMeta.forEach(m => {
        const i3 = m.recordIndex * 3;
        if (detailProgress > 0.001 && m.secIdx === detailSectorIdx) {
          m.worldPos.copy(m.baseWorldPos).lerp(m.detailWorldPos, posBlend);
          anyMoved = true;
        } else {
          m.worldPos.copy(m.baseWorldPos);
        }
        ptsPosAttr.array[i3 + 0] = m.worldPos.x;
        ptsPosAttr.array[i3 + 1] = m.worldPos.y;
        ptsPosAttr.array[i3 + 2] = m.worldPos.z;
      });
      if (anyMoved || detailMode !== 'skymap') {
        ptsPosAttr.needsUpdate = true;
      }
    }

    // 3. Point Cloud Uniforms (identical 1,410 deep-sky stars stay opaque behind Detail View and during Contact)
    const WAYPOINTS = [0.670, 0.710, 0.750, 0.790, 0.830, 0.870, 0.910];
    let activeConstellationIdx = -1;
    if (typeof masterT === 'number' && masterT >= 0.650 && masterT <= 0.920) {
      let minD = Infinity;
      for (let i = 0; i < WAYPOINTS.length; i++) {
        const d = Math.abs(masterT - WAYPOINTS[i]);
        if (d < minD) {
          minD = d;
          activeConstellationIdx = i;
        }
      }
    }

    if (skyMapPointsMat) {
      skyMapPointsMat.uniforms.uTime.value = elapsedSec;
      skyMapPointsMat.uniforms.uTransitionP.value = p;
      skyMapPointsMat.uniforms.uOpacity.value = smooth(0.08, 0.35, p);
      skyMapPointsMat.uniforms.uHoveredSector.value = (hoveredSkySectorIdx >= 0) ? hoveredSkySectorIdx : activeConstellationIdx;
      skyMapPointsMat.uniforms.uActiveDetailSec.value = (activeConstellationIdx >= 0) ? activeConstellationIdx : (detailProgress > 0.001 ? detailSectorIdx : -1.0);
      skyMapPointsMat.uniforms.uDetailZoom.value = smooth(0.0, 1.0, zoomU);
      skyMapPointsMat.uniforms.uDetailFadeOut.value = 1.0 - handoffAlpha;
      if (skyMapPointsMat.uniforms.uGather) {
        skyMapPointsMat.uniforms.uGather.value = (typeof masterT === 'number' && masterT >= 0.93)
          ? smooth(0.93, 0.98, masterT)
          : 0.0;
      }
    }

    // 4. Delicate Constellation Lines Drawing (0.590 -> 0.635) and fade out at 0.915 -> 0.945
    let lineDraw = 1.0;
    if (typeof masterT === 'number') {
      lineDraw = smooth(0.590, 0.635, masterT);
    } else {
      lineDraw = smooth(0.68, 0.88, p);
    }

    if (skyMapLines && skyMapLinesMat) {
      const otherLinesFade = detailProgress > 0.001 ? (1.0 - smooth(0.0, 0.42, zoomU)) : 1.0;
      const activeLineFade = 1.0 - handoffAlpha;
      const baseLineAlpha = 0.28 * Math.pow(Math.max(0.0, lineDraw), 0.72) * lineLeg3Fade;
      skyMapLines.visible = lineDraw > 0.005 && lineLeg3Fade > 0.005 && activeLineFade > 0.005;
      skyMapLinesMat.opacity = baseLineAlpha;

      if (skyMapLines.visible) {
        const posAttr = skyMapLines.geometry.getAttribute('position');
        const colAttr = skyMapLines.geometry.getAttribute('color');
        const coolingBlend = smooth(0.35, 0.92, zoomU);
        for (let i = 0; i < skyMapEdgeList.length; i++) {
          const e = skyMapEdgeList[i];
          const a = e.metaA.worldPos;
          const b = e.metaB.worldPos;
          const dir = new THREE.Vector3().subVectors(b, a);
          const len = Math.max(0.001, dir.length());
          dir.divideScalar(len);

          // Gap smoothly converges to exact 12px-equivalent of 2D Detail View during zoom
          const isTargetSec = (activeConstellationIdx >= 0 && e.secIdx === activeConstellationIdx) ||
                              (detailProgress > 0.001 && e.secIdx === detailSectorIdx);
          const gapFrac = isTargetSec ? (0.012 + (0.0058 - 0.012) * coolingBlend) : 0.012;
          const gapA = a.distanceTo(camera.position) * gapFrac;
          const gapB = b.distanceTo(camera.position) * gapFrac;
          const usableLen = Math.max(1.0, len - gapA - gapB);
          const pA = a.clone().addScaledVector(dir, gapA);
          const pB = pA.clone().addScaledVector(dir, usableLen * lineDraw);

          posAttr.setXYZ(i * 2, pA.x, pA.y, pA.z);
          posAttr.setXYZ(i * 2 + 1, pB.x, pB.y, pB.z);

          let lum = 1.0;
          let rCol = 0.86, gCol = 0.80, bCol = 0.70; // Restrained celestial silver-gold
          const targetSec = (activeConstellationIdx >= 0) ? activeConstellationIdx : (detailProgress > 0.001 ? detailSectorIdx : hoveredSkySectorIdx);
          if (targetSec >= 0) {
            if (e.secIdx === targetSec) {
              rCol = 0.96; gCol = 0.76; bCol = 0.36; // Warm luminous gold highlight on active constellation
              lum = 1.40;
            } else {
              lum = 0.30; // Soft dim on unhovered constellations
            }
          }
          const cIdx = i * 6;
          colAttr.array[cIdx + 0] = rCol * lum;
          colAttr.array[cIdx + 1] = gCol * lum;
          colAttr.array[cIdx + 2] = bCol * lum;
          colAttr.array[cIdx + 3] = rCol * lum;
          colAttr.array[cIdx + 4] = gCol * lum;
          colAttr.array[cIdx + 5] = bCol * lum;
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
      }
    }

    // 4B. Contact Transmission Beacon (Leg 3 approach cruise, 0.92 <= masterT <= 0.96)
    if (contactBeaconMesh) {
      if (typeof masterT === 'number' && masterT >= 0.92 && masterT <= 0.96) {
        const bPhase = (masterT - 0.92) / 0.04;
        const bAlpha = Math.sin(bPhase * Math.PI) * 0.95;
        contactBeaconMesh.material.opacity = bAlpha;
        const bSize = 35 + 40 * bPhase;
        contactBeaconMesh.scale.set(bSize, bSize, 1);
        contactBeaconMesh.visible = true;
      } else {
        contactBeaconMesh.material.opacity = 0.0;
        contactBeaconMesh.visible = false;
      }
    }

    // 5. Interactive Sky Map Hitboxes & Labels (visible during overview discovery, hides during constellation dwell)
    const detailMask = 1.0 - smooth(0.0, 0.22, detailProgress);
    const labelAlpha = (typeof masterT === 'number')
      ? (smooth(0.615, 0.640, masterT) * (1.0 - smooth(0.665, 0.675, masterT)) * lineLeg3Fade * detailMask)
      : (smooth(0.80, 0.96, p) * lineLeg3Fade * detailMask);
    const canClickSky = (detailMode === 'skymap' && p >= 0.84 && lineLeg3Fade > 0.5 && !isDestroyed);
    if (skyMapLabelsOverlay) {
      if (labelAlpha > 0.01 && !isDestroyed) {
        skyMapLabelsOverlay.style.visibility = 'visible';
        skyMapLabelsOverlay.style.opacity = labelAlpha.toFixed(3);
        const w = window.innerWidth;
        const h = window.innerHeight;
        const isNarrow = w <= 768;

        skyMapSectorCenters.forEach(item => {
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          if (item.stars && item.stars.length) {
            item.stars.forEach(st => {
              const pr = st.worldPos.clone().project(camera);
              const px = (pr.x * 0.5 + 0.5) * w;
              const py = (-pr.y * 0.5 + 0.5) * h;
              if (px < minX) minX = px;
              if (px > maxX) maxX = px;
              if (py < minY) minY = py;
              if (py > maxY) maxY = py;
            });
          }
          const lblProj = item.worldCenter.clone().project(camera);
          const lblX = (lblProj.x * 0.5 + 0.5) * w;
          const lblY = (-lblProj.y * 0.5 + 0.5) * h;
          if (!Number.isFinite(minX)) {
            minX = lblX - 60; maxX = lblX + 60; minY = lblY - 70; maxY = lblY;
          }

          const boxW = Math.max(isNarrow ? 112 : 165, Math.min(isNarrow ? 140 : 280, (maxX - minX) + 52));
          const lblPadBottom = isNarrow ? 34 : 28;
          const boxH = Math.max(88, (Math.max(maxY, lblY) + lblPadBottom) - (minY - 22));
          const cxBox = Math.max(boxW * 0.5 + 6, Math.min(w - boxW * 0.5 - 6, lblX));
          const topBox = Math.max(58, Math.min(h - 64 - boxH, minY - 22));
          const originLeft = cxBox - boxW * 0.5;

          item.labelEl.style.background = 'transparent';
          item.labelEl.style.backgroundColor = 'transparent';
          item.labelEl.style.border = 'none';
          item.labelEl.style.outline = 'none';
          item.labelEl.style.boxShadow = 'none';
          item.labelEl.style.width = boxW.toFixed(0) + 'px';
          item.labelEl.style.height = boxH.toFixed(0) + 'px';
          item.labelEl.style.setProperty('pointer-events', canClickSky ? 'auto' : 'none', 'important');
          item.labelEl.style.setProperty('cursor', canClickSky ? 'pointer' : 'default', 'important');
          item.labelEl.tabIndex = canClickSky ? 0 : -1;
          item.labelEl.classList.toggle('is-hovered', hoveredSkySectorIdx === item.secIdx);
          item.labelEl.style.transform = `translate3d(${originLeft.toFixed(1)}px, ${topBox.toFixed(1)}px, 0)`;

          if (item.pillEl) {
            item.pillEl.style.setProperty('pointer-events', canClickSky ? 'auto' : 'none', 'important');
            item.pillEl.tabIndex = canClickSky ? 0 : -1;
          }

          // Position individual technology star tags within this constellation
          if (item.stars && item.stars.length) {
            item.stars.forEach(st => {
              if (st.tagEl) {
                const spr = st.worldPos.clone().project(camera);
                const spx = (spr.x * 0.5 + 0.5) * w;
                const spy = (-spr.y * 0.5 + 0.5) * h;
                const relX = spx - originLeft;
                const relY = spy - topBox;
                st.tagEl.style.left = relX.toFixed(1) + 'px';
                st.tagEl.style.top = relY.toFixed(1) + 'px';
                const isThisHovered = (hoveredSkySectorIdx === item.secIdx);
                const showTag = (hoveredSkySectorIdx >= 0) ? isThisHovered : (p >= 0.88);
                st.tagEl.style.opacity = showTag ? (isThisHovered ? '0.96' : '0.40') : '0.0';
              }
            });
          }
        });
      } else {
        skyMapLabelsOverlay.style.opacity = '0';
        skyMapLabelsOverlay.style.visibility = 'hidden';
        skyMapSectorCenters.forEach(item => {
          item.labelEl.style.setProperty('pointer-events', 'none', 'important');
          if (item.pillEl) item.pillEl.style.setProperty('pointer-events', 'none', 'important');
        });
      }
    }

    // 6. Seamless 0.40s Crossfade Handoff to 2D Constellation Detail View (#disciplines)
    if (disciplinesEl) {
      if (handoffAlpha > 0.005 && !isDestroyed && contactFade > 0.5) {
        if (window.TechnologyConstellation && typeof window.TechnologyConstellation.setSharedBackdropMode === 'function') {
          window.TechnologyConstellation.setSharedBackdropMode(true);
        }
        disciplinesEl.style.visibility = 'visible';
        disciplinesEl.style.opacity = handoffAlpha.toFixed(3);
        const interactive = handoffAlpha >= 0.85 && (detailMode === 'detail' || detailProgress >= 0.95);
        disciplinesEl.style.setProperty('pointer-events', interactive ? 'auto' : 'none', 'important');
        disciplinesEl.classList.toggle('is-interactive', interactive);
        if (window.TechnologyConstellation && typeof window.TechnologyConstellation.forceRenderNow === 'function') {
          window.TechnologyConstellation.forceRenderNow();
        }
      } else {
        disciplinesEl.style.opacity = '0';
        disciplinesEl.style.visibility = 'hidden';
        disciplinesEl.style.pointerEvents = 'none';
        disciplinesEl.classList.remove('is-interactive');
      }
    }
  }

  // ── 03C. CONTINUOUS CINEMATIC TECHNOLOGY CONSTELLATION JOURNEY (0.572 <= masterT <= 1.000) ──
  function evaluateConstellationJourneyCamera(masterT) {
    const lastIdx = projects.length - 1;
    const cur = arrivalPoses[lastIdx] || { camPos: new THREE.Vector3(-40, 95, 580), lookTarget: new THREE.Vector3(0, 0, 0) };
    const basis = getSkyMapBasis();
    const w = containerEl ? (containerEl.clientWidth || window.innerWidth) : window.innerWidth;
    const h = containerEl ? (containerEl.clientHeight || window.innerHeight) : window.innerHeight;
    const aspect = Math.max(0.45, Math.min(2.4, w / Math.max(1, h)));

    const smooth = (a, b, x) => {
      const u = Math.max(0.0, Math.min(1.0, (x - a) / Math.max(0.0001, b - a)));
      return u * u * (3.0 - 2.0 * u);
    };
    const quintic = (u) => u * u * u * (u * (u * 6.0 - 15.0) + 10.0);

    const P_SOLAR = cur.camPos.clone();
    const L_SOLAR = cur.lookTarget.clone();
    const P_FIELD = basis.cam.clone();
    const L_FIELD = basis.cam.clone().addScaledVector(basis.fwd, 4200);

    // Contact Terminal Target Pose
    const P_CONTACT = basis.cam.clone()
      .addScaledVector(basis.fwd, 1100)
      .addScaledVector(basis.right, 820)
      .addScaledVector(basis.up, -480);
    const L_CONTACT = P_CONTACT.clone()
      .addScaledVector(basis.fwd, 1200)
      .addScaledVector(basis.right, 260)
      .addScaledVector(basis.up, -120);

    // ── STAGE 1: SOLAR SYSTEM DEPARTURE -> DEEP SPACE VOID -> CONSTELLATION FIELD DISCOVERY (0.572 -> 0.635) ──
    if (masterT < 0.635) {
      const rawU = Math.max(0.0, Math.min(1.0, (masterT - 0.572) / (0.635 - 0.572)));
      const easedU = quintic(rawU);

      const P_MID = cur.camPos.clone().add(new THREE.Vector3(-20, 140, 520));
      const P_APPROACH = P_FIELD.clone().add(new THREE.Vector3(-140, -40, -380));
      const camPos = cubicBezier3(P_SOLAR, P_MID, P_APPROACH, P_FIELD, easedU);

      const L_SUN = new THREE.Vector3(0, 0, 0);
      let lookTarget;
      if (rawU < 0.28) {
        lookTarget = L_SOLAR.clone().lerp(L_SUN, rawU / 0.28);
      } else if (rawU < 0.65) {
        const u = quintic((rawU - 0.28) / 0.37);
        lookTarget = L_SUN.clone().lerp(L_FIELD, u);
      } else {
        lookTarget = L_FIELD.clone();
      }

      const roll = -0.022 * Math.sin(rawU * Math.PI);
      const fov = 44.0 + 3.0 * Math.sin(rawU * Math.PI);

      return {
        camPos,
        lookTarget,
        segIdx: lastIdx,
        rawU,
        easedU,
        isDwell: false,
        roll,
        fov,
        isDeparture: true,
        transitionProgress: rawU
      };
    }

    // ── STAGE 2: WIDE FIELD DISCOVERY -> APPROACH TO CONSTELLATION 0 (LANGUAGES) (0.635 -> 0.670) ──
    const pose0 = getZoomCameraPose(0, basis, aspect);
    if (masterT < 0.670) {
      const rawU = Math.max(0.0, Math.min(1.0, (masterT - 0.635) / (0.670 - 0.635)));
      const easedU = quintic(rawU);

      const P_MID0 = P_FIELD.clone().lerp(pose0.camZoom, 0.45).addScaledVector(basis.up, 25);
      const camPos = cubicBezier3(P_FIELD, P_MID0, pose0.camZoom.clone().addScaledVector(pose0.dir, -40), pose0.camZoom, easedU);
      const lookTarget = L_FIELD.clone().lerp(pose0.lookZoom, easedU);
      const fov = 46.0 + (42.0 - 46.0) * easedU;
      const roll = 0.0;

      return {
        camPos,
        lookTarget,
        segIdx: lastIdx,
        rawU,
        easedU,
        isDwell: rawU > 0.96,
        roll,
        fov,
        isDeparture: true,
        constellationIdx: 0,
        constellationProgress: easedU
      };
    }

    // ── STAGE 3: 7 CONTINUOUS CONSTELLATIONS EXPLORATION & INTER-CONSTELLATION FLIGHTS (0.670 -> 0.910) ──
    const WAYPOINTS = [0.670, 0.710, 0.750, 0.790, 0.830, 0.870, 0.910];
    const bankAngles = [-0.045, 0.050, -0.045, 0.055, -0.045, 0.050];

    for (let k = 0; k < 7; k++) {
      const wK = WAYPOINTS[k];
      const dwellHalf = 0.005;

      // Stable Dwell Plateau at Constellation k
      if (Math.abs(masterT - wK) <= dwellHalf) {
        const poseK = getZoomCameraPose(k, basis, aspect);
        return {
          camPos: poseK.camZoom.clone(),
          lookTarget: poseK.lookZoom.clone(),
          segIdx: lastIdx,
          rawU: 0.0,
          easedU: 0.0,
          isDwell: true,
          roll: 0.0,
          fov: 42.0,
          isDeparture: true,
          constellationIdx: k,
          constellationProgress: 1.0
        };
      }

      // Transit Segment from Constellation k to Constellation k+1
      if (k < 6) {
        const wNext = WAYPOINTS[k + 1];
        const tStart = wK + dwellHalf;
        const tEnd = wNext - dwellHalf;

        if (masterT > tStart && masterT < tEnd) {
          const rawU = Math.max(0.0, Math.min(1.0, (masterT - tStart) / (tEnd - tStart)));
          const easedU = quintic(rawU);

          const poseA = getZoomCameraPose(k, basis, aspect);
          const poseB = getZoomCameraPose(k + 1, basis, aspect);

          // Flight arc curving back from constellation A and into constellation B
          const chord = poseB.camZoom.clone().sub(poseA.camZoom);
          const arcSide = new THREE.Vector3().crossVectors(chord, basis.fwd).normalize();
          const arcSign = (k % 2 === 0) ? 1.0 : -1.0;
          const arcOffset = arcSide.multiplyScalar(Math.min(120.0, chord.length() * 0.22) * arcSign);

          const P0 = poseA.camZoom;
          const P1 = poseA.camZoom.clone().addScaledVector(poseA.dir, -160).add(arcOffset);
          const P2 = poseB.camZoom.clone().addScaledVector(poseB.dir, -160).add(arcOffset);
          const P3 = poseB.camZoom;

          const camPos = cubicBezier3(P0, P1, P2, P3, easedU);

          // Look target blending along flight trajectory
          const tangent = cubicBezierDerivative3(P0, P1, P2, P3, Math.max(0.001, Math.min(0.999, easedU))).normalize();
          const forwardLook = camPos.clone().addScaledVector(tangent, 300.0);

          let lookTarget;
          if (easedU < 0.22) {
            lookTarget = poseA.lookZoom.clone().lerp(forwardLook, easedU / 0.22);
          } else if (easedU <= 0.72) {
            lookTarget = forwardLook;
          } else {
            lookTarget = forwardLook.clone().lerp(poseB.lookZoom, (easedU - 0.72) / 0.28);
          }

          const roll = Math.sin(rawU * Math.PI) * (bankAngles[k] || 0.045);
          const fov = 42.0 + 3.5 * Math.sin(rawU * Math.PI);

          return {
            camPos,
            lookTarget,
            segIdx: lastIdx,
            rawU,
            easedU,
            isDwell: false,
            roll,
            fov,
            isDeparture: true,
            constellationIdx: easedU > 0.5 ? (k + 1) : k,
            constellationProgress: easedU
          };
        }
      }
    }

    // ── STAGE 4: CONSTELLATION 6 DEPARTURE -> CONTACT BEACON NEXUS / HOLOGRAM PROJECTOR (0.910 -> 1.000) ──
    const pose6 = getZoomCameraPose(6, basis, aspect);
    const rawU = Math.max(0.0, Math.min(1.0, (masterT - 0.915) / (1.000 - 0.915)));
    const easedU = quintic(rawU);

    const P0 = pose6.camZoom;
    const P1 = pose6.camZoom.clone().addScaledVector(pose6.dir, -180).addScaledVector(basis.right, 80);
    const P2 = P_CONTACT.clone().addScaledVector(basis.fwd, -240).addScaledVector(basis.up, 60);
    const P3 = P_CONTACT;

    const camPos = cubicBezier3(P0, P1, P2, P3, easedU);
    const lookTarget = pose6.lookZoom.clone().lerp(L_CONTACT, easedU);
    const fov = 42.0 + (46.0 - 42.0) * easedU;
    const roll = -0.018 * Math.sin(rawU * Math.PI);

    return {
      camPos,
      lookTarget,
      segIdx: lastIdx,
      rawU,
      easedU,
      isDwell: rawU >= 0.98,
      roll,
      fov,
      isDeparture: true,
      constellationIdx: 6,
      constellationProgress: 1.0 - easedU
    };
  }

  // Continuous 4-Phase Flight Camera (0..0.25 Pull Back -> 0.25..0.55 Deep Space -> 0.55..0.85 Alignment -> 0.85..1.00 Arrival)
  function evaluateSkillsTransitionCamera(p) {
    const lastIdx = projects.length - 1;
    const cur = arrivalPoses[lastIdx] || { camPos: new THREE.Vector3(-40, 95, 580), lookTarget: new THREE.Vector3(0, 0, 0) };
    const basis = getSkyMapBasis();

    const smooth = (a, b, x) => {
      const u = Math.max(0.0, Math.min(1.0, (x - a) / Math.max(0.0001, b - a)));
      return u * u * (3.0 - 2.0 * u);
    };
    const quintic = (u) => u * u * u * (u * (u * 6.0 - 15.0) + 10.0);

    const P_00 = cur.camPos.clone();
    const P_25 = new THREE.Vector3(-40, 260, 1280);
    // Offset at p=0.55 keeps ALL 7 constellations inside viewport while guaranteeing ~160-260px differential parallax!
    const P_55 = basis.cam.clone()
      .addScaledVector(basis.fwd, -590)
      .addScaledVector(basis.right, -445)
      .addScaledVector(basis.up, 205);
    const P_85 = basis.cam.clone()
      .addScaledVector(basis.fwd, -55)
      .addScaledVector(basis.right, -16)
      .addScaledVector(basis.up, 7);
    const P_100 = basis.cam.clone();

    let camPos;
    let fov = 46.0;
    let roll = 0.0;

    if (p <= 0.25) {
      // Phase 1: Pull Back from Planet 07
      const u = quintic(p / 0.25);
      camPos = P_00.clone().lerp(P_25, u);
      fov = 44.0 + 3.0 * u;
    } else if (p <= 0.55) {
      // Phase 2: Deep Space Cruise + ~21° Camera Turn + Light Sway + Wide FOV
      const raw = (p - 0.25) / 0.30;
      const u = quintic(raw);
      camPos = P_25.clone().lerp(P_55, u);
      fov = 47.0 + 5.0 * Math.sin(raw * Math.PI); // peaks ~52° at mid-speed
      roll = -0.032 * Math.sin(raw * Math.PI);
    } else if (p <= 0.85) {
      // Phase 3: Parallax Alignment Glide (steady glide across 0.55->0.65->0.75->0.85 so stars visibly slide in)
      const raw = (p - 0.55) / 0.30;
      const sm = raw * raw * (3.0 - 2.0 * raw);
      const u = 0.80 * raw + 0.20 * sm;
      camPos = P_55.clone().lerp(P_85, u);
      fov = 47.0 - 0.8 * u;
      roll = -0.014 * (1.0 - u);
    } else {
      // Phase 4: Long Smooth Slow-Down Arrival (0.85 -> 1.00)
      const raw = (p - 0.85) / 0.15;
      const u = 1.0 - Math.pow(1.0 - raw, 3.0);
      camPos = P_85.clone().lerp(P_100, u);
      fov = 46.2 - 0.2 * u;
      roll = 0.0;
    }

    // Mouse micro-parallax capped strictly <= 6 px at rest (fades to 0 during detail zoom so handoff < 1 px)
    const restParallaxWeight = smooth(0.85, 1.0, p) * (1.0 - smooth(0.0, 0.35, detailProgress));
    if (restParallaxWeight > 0.001) {
      camPos.addScaledVector(basis.right, smoothSkyMouseX * 2.4 * restParallaxWeight);
      camPos.addScaledVector(basis.up, -smoothSkyMouseY * 1.8 * restParallaxWeight);
    }

    // Look target transitions smoothly: Planet 07 -> Solar center (0..0.25) -> far Sky Map horizon target (0.25..0.55)
    const L_SOLAR = new THREE.Vector3(0, 0, 0);
    const L_SKY = basis.cam.clone().addScaledVector(basis.fwd, 4200);
    let lookTarget;
    if (p <= 0.25) {
      const u = smooth(0.0, 0.22, p);
      lookTarget = cur.lookTarget.clone().lerp(L_SOLAR, u);
    } else if (p <= 0.55) {
      const u = quintic((p - 0.25) / 0.30);
      lookTarget = L_SOLAR.clone().lerp(L_SKY, u);
    } else {
      lookTarget = L_SKY.clone();
    }

    // Phase 4: Open / Close Constellation Zoom Camera + 0.40s nearly-still crossfade drift
    if (detailProgress > 0.001 && skyMapSectorCenters.length) {
      const w = containerEl ? (containerEl.clientWidth || window.innerWidth) : window.innerWidth;
      const h = containerEl ? (containerEl.clientHeight || window.innerHeight) : window.innerHeight;
      const aspect = Math.max(0.45, Math.min(2.4, w / Math.max(1, h)));
      const { camZoom, lookZoom, dir } = getZoomCameraPose(detailSectorIdx, basis, aspect);
      const zoomU = Math.max(0.0, Math.min(1.0, detailProgress / DETAIL_ZOOM_FRAC));
      const zoomEase = zoomU * zoomU * zoomU * (zoomU * (zoomU * 6.0 - 15.0) + 10.0);
      const handoffU = Math.max(0.0, Math.min(1.0, (detailProgress - DETAIL_ZOOM_FRAC) / (1.0 - DETAIL_ZOOM_FRAC)));

      camPos.lerp(camZoom, zoomEase);
      lookTarget.lerp(lookZoom, zoomEase);
      fov = fov + (42.0 - fov) * zoomEase;
      roll = roll * (1.0 - zoomEase);

      // Camera stays nearly still (tiny +3 unit creep) across the 0.4s crossfade
      if (handoffU > 0.001) {
        camPos.addScaledVector(dir, 3.0 * handoffU);
      }
    }

    return {
      camPos,
      lookTarget,
      segIdx: lastIdx,
      rawU: p,
      easedU: p,
      isDwell: false,
      roll,
      fov,
      isDeparture: true,
      transitionProgress: p
    };
  }

  // ── 03D. LEG 3 CAMERA FLIGHT (SKILLS -> CONTACT TERMINAL, 0.85 <= t <= 1.00) ──
  function evaluateContactFlightCamera(t) {
    const basis = getSkyMapBasis();
    const clampedT = Math.max(0.85, Math.min(1.00, t));
    const u = (clampedT - 0.85) / 0.15; // 0.0 to 1.0 across Leg 3

    const quintic = (v) => v * v * v * (v * (v * 6.0 - 15.0) + 10.0);

    // Key Waypoints in Basis coordinates:
    // P_00: Exact resting position on Sky Map (camPos: 640, 620, 3150)
    const P_00 = basis.cam.clone();
    const L_00 = basis.cam.clone().addScaledVector(basis.fwd, 4200);

    // P_20: Pull back slightly and turn right-down (t = 0.85..0.88)
    const P_20 = basis.cam.clone()
      .addScaledVector(basis.fwd, -160)
      .addScaledVector(basis.right, 140)
      .addScaledVector(basis.up, -90);
    const L_20 = L_00.clone()
      .addScaledVector(basis.right, 320)
      .addScaledVector(basis.up, -220);

    // P_53: Accelerating approach cruise through starfield (t = 0.88..0.93)
    const P_53 = basis.cam.clone()
      .addScaledVector(basis.fwd, 580)
      .addScaledVector(basis.right, 520)
      .addScaledVector(basis.up, -310);
    const L_53 = L_00.clone()
      .addScaledVector(basis.right, 580)
      .addScaledVector(basis.up, -400);

    // P_87: Deceleration and settle into Contact terminal (t = 0.93..0.98)
    const P_87 = basis.cam.clone()
      .addScaledVector(basis.fwd, 1100)
      .addScaledVector(basis.right, 820)
      .addScaledVector(basis.up, -480);
    const L_87 = P_87.clone()
      .addScaledVector(basis.fwd, 1200)
      .addScaledVector(basis.right, 260)
      .addScaledVector(basis.up, -120);

    let camPos;
    let lookTarget;
    let fov = 46.0;
    let roll = 0.0;

    if (u <= 0.20) {
      // Phase 1 (0.85 -> 0.88): Pull back & turn right-down
      const raw = u / 0.20;
      const ease = quintic(raw);
      camPos = P_00.clone().lerp(P_20, ease);
      lookTarget = L_00.clone().lerp(L_20, ease);
      fov = 46.0 - 0.5 * ease;
      roll = -0.012 * ease;
    } else if (u <= 0.533) {
      // Phase 2 (0.88 -> 0.93): Approach cruise + star streaks
      const raw = (u - 0.20) / 0.333;
      const ease = quintic(raw);
      camPos = P_20.clone().lerp(P_53, ease);
      lookTarget = L_20.clone().lerp(L_53, ease);
      fov = 45.5 + 2.5 * Math.sin(raw * Math.PI);
      roll = -0.012 - 0.014 * Math.sin(raw * Math.PI);
    } else if (u <= 0.867) {
      // Phase 3 (0.93 -> 0.98): Landing deceleration & terminal alignment
      const raw = (u - 0.533) / 0.334;
      const ease = 1.0 - Math.pow(1.0 - raw, 3.0);
      camPos = P_53.clone().lerp(P_87, ease);
      lookTarget = L_53.clone().lerp(L_87, ease);
      fov = 48.0 - 2.0 * ease;
      roll = -0.012 * (1.0 - ease);
    } else {
      // Phase 4 (0.98 -> 1.00): Settle at terminal
      camPos = P_87.clone();
      lookTarget = L_87.clone();
      fov = 46.0;
      roll = 0.0;
    }

    return {
      camPos,
      lookTarget,
      segIdx: projects.length - 1,
      rawU: u,
      easedU: u,
      isDwell: false,
      roll,
      fov,
      isDeparture: true,
      transitionProgress: clampedT
    };
  }

  // ── 04. CORE THREE.JS INITIALIZATION ──
  function init(targetContainer) {
    if (isInitialized) return;

    containerEl = targetContainer || document.getElementById('worksGalaxyStage') || document.getElementById('works');
    if (!containerEl) {
      console.warn('[GalaxyJourney] Container not found.');
      return;
    }

    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof THREE === 'undefined') {
      console.error('[GalaxyJourney] Three.js is required but missing.');
      return;
    }

    clock = new THREE.Clock();

    // Canvas Element
    canvasEl = document.getElementById('galaxy3DCanvas');
    if (!canvasEl) {
      canvasEl = document.createElement('canvas');
      canvasEl.id = 'galaxy3DCanvas';
      canvasEl.className = 'galaxy-3d-canvas';
      containerEl.prepend(canvasEl);
    }

    // HUD Element
    hudEl = document.getElementById('galaxyHudOverlay');
    if (!hudEl) {
      buildHudStructure();
    }

    // Viewport Dimensions
    const width = containerEl.clientWidth || window.innerWidth;
    const height = containerEl.clientHeight || window.innerHeight;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08070b, 0.00065);

    camera = new THREE.PerspectiveCamera(46, width / height, 1.0, 7500);
    camera.position.set(0, 320, 640);

    // Scene is lit authentically from the Sun at (0, 0, 0)
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Build the Living Astronomical Solar System + Same-Scene 3D Sky Map
    buildGalacticCore();
    buildSpiralArms();
    buildPlanetarySystem();
    buildCameraFlightSpline();
    if (postRenderTarget) {
      postRenderTarget.setSize(width, height);
      if (postMaterial && postMaterial.uniforms && postMaterial.uniforms.uResolution) {
        postMaterial.uniforms.uResolution.value.set(width, height);
      }
    }
    buildAsteroidField();
    buildSkyMapStage();
    initPostProcessing(width, height);

    window.addEventListener('mousemove', (e) => {
      skyMouseNormX = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      skyMouseNormY = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
    }, { passive: true });

    // Sector 01 Initial Staging (ensure solar system is 100% hidden at t=0)
    updateSector01VisualStaging(0.0);

    // Master Journey Controller Spinal Authority Integration
    if (window.MasterJourneyController && typeof window.MasterJourneyController.on === 'function') {
      window.MasterJourneyController.on('update', onMasterJourneyUpdate);
      onMasterJourneyUpdate(window.MasterJourneyController.getProgress());
    }

    // GSAP ScrollTrigger Integration
    initScrollTrigger();

    // Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });

    // Start 60/120fps RAF Render Loop
    isInitialized = true;
    requestAnimationFrame(renderLoop);

    // Initial Waypoint Update & Preloader Dismissal
    updateDossier(0);
    const preloader = document.getElementById('galaxyPreloader');
    if (typeof window !== 'undefined' && window.location.search && window.location.search.includes('skipIntro=1')) {
      if (preloader) preloader.classList.add('is-hidden');
    } else {
      setTimeout(() => {
        if (preloader) preloader.classList.add('is-hidden');
      }, 1200);
    }
    console.info('[GalaxyJourney] Cinematic Solar-System Experience online.');
  }

  // ── 05. PHYSICALLY PLAUSIBLE CENTRAL STAR (SOLAR CONVECTION & ORGANIC RAY CORONA) ──
  function buildGalacticCore() {
    centralStarGroup = new THREE.Group();

    // 1. Procedural Solar Surface Shader with Dynamic Convective Granulation & Eddington Limb Darkening
    const starRadius = 38;
    const starGeo = new THREE.SphereGeometry(starRadius, 96, 96);

    const starVertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vWorldPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `;

    const starFragmentShader = `
      uniform float uTime;
      uniform sampler2D uSunTexture;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      float fbm(vec3 p) {
        float total = 0.0;
        total += 0.5000 * snoise(p); p *= 2.02;
        total += 0.2500 * snoise(p); p *= 2.03;
        total += 0.1250 * snoise(p); p *= 2.01;
        total += 0.0625 * snoise(p);
        return total;
      }

      void main() {
        vec3 coord = vPosition * 0.08;
        float rotTime = uTime * 0.09;
        vec3 flowCoord = vec3(
          coord.x * cos(rotTime) - coord.z * sin(rotTime),
          coord.y,
          coord.x * sin(rotTime) + coord.z * cos(rotTime)
        );

        // Convective granulation and boiling plasma
        float granuleNoise = snoise(flowCoord * 4.6 + vec3(0.0, uTime * 0.16, 0.0));
        float fineGranules = snoise(flowCoord * 10.2 + vec3(uTime * 0.22, 0.0, 0.0)) * 0.35;
        float macroPlasma  = fbm(flowCoord * 1.8 + vec3(0.0, 0.0, uTime * 0.07)) * 0.5;
        float heat = clamp(0.5 + 0.5 * (granuleNoise + fineGranules + macroPlasma), 0.0, 1.0);

        // Physical Eddington Solar Limb Darkening (darker, softer edges with minimum self-radiance)
        vec3 norm = normalize(vNormal);
        float mu = clamp(dot(norm, vec3(0.0, 0.0, 1.0)), 0.35, 1.0);
        float limbDarkening = pow(mu, 0.70);

        // Limb Prominences & Dynamic Spicules
        float prominenceEdge = pow(1.0 - mu, 4.0);
        float prominenceNoise = snoise(flowCoord * 8.5 + vec3(0.0, uTime * 0.45, 0.0));
        float prominence = prominenceEdge * smoothstep(0.40, 0.85, prominenceNoise) * 0.45;

        // Radiant Planck Solar Spectrum
        vec3 coreWhiteGold  = vec3(1.00, 0.98, 0.94);
        vec3 solarYellow    = vec3(1.00, 0.86, 0.36);
        vec3 plasmaAmber    = vec3(0.98, 0.56, 0.10);
        vec3 limbCrimson    = vec3(0.85, 0.38, 0.08);

        vec3 surfaceColor = mix(plasmaAmber, solarYellow, heat);
        surfaceColor = mix(surfaceColor, coreWhiteGold, pow(heat, 2.0) * 0.88);

        // Photorealistic NASA SDO Granulation Overlay (Zero hard black spots)
        vec4 sunTex = texture2D(uSunTexture, vUv);
        float texLum = dot(sunTex.rgb, vec3(0.299, 0.587, 0.114));
        if (texLum > 0.02) {
          surfaceColor = mix(surfaceColor, surfaceColor * sunTex.rgb * 1.45, 0.38);
        }

        vec3 finalColor = mix(limbCrimson, surfaceColor, limbDarkening);
        finalColor += vec3(1.0, 0.65, 0.25) * prominence;

        gl_FragColor = vec4(finalColor * (1.20 + 0.40 * limbDarkening), 1.0);
      }
    `;

    starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uSunTexture: { value: getOrLoadTexture('assets/textures/sun_color.jpg', true) }
      },
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader
    });

    centralStarMesh = new THREE.Mesh(starGeo, starMaterial);
    centralStarGroup.add(centralStarMesh);

    // 2. Organic Camera-Facing Solar Corona (Radial Streamers with Exponential Decay)
    const coronaGeo = new THREE.PlaneGeometry(240, 240);
    starCoronaMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color(0xf59e0b) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float r = length(p);
          if (r > 1.0) discard;

          float theta = atan(p.y, p.x);

          // 8 Harmonic dynamic solar streamer rays with equatorial dipole bias
          float dipole = 1.0 + 0.35 * pow(abs(cos(theta)), 1.5);
          float rays = 1.0
            + 0.28 * cos(3.0 * theta + uTime * 0.35)
            + 0.20 * sin(5.0 * theta - uTime * 0.45)
            + 0.15 * cos(9.0 * theta + uTime * 0.80)
            + 0.10 * sin(14.0 * theta - uTime * 0.25)
            + 0.06 * cos(22.0 * theta + uTime * 1.10);

          float innerMask = smoothstep(0.16, 0.30, r);
          // Inner intense K-corona + outer F-corona streamers
          float kCorona = exp(-r * 5.2) * 2.2;
          float fCorona = pow(max(0.0, 1.0 - r), 2.6) * rays * dipole;
          float falloff = (kCorona + fCorona * 0.75) * innerMask;
          float alpha = clamp(falloff * 0.90, 0.0, 1.0);

          vec3 coronaCol = mix(vec3(1.0, 0.97, 0.90), uColor, smoothstep(0.28, 0.85, r));
          gl_FragColor = vec4(coronaCol, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    starCoronaMesh = new THREE.Mesh(coronaGeo, starCoronaMat);
    starCoronaMesh.position.set(0, 0, 0);
    starCoronaMesh.visible = false;
    scene.add(starCoronaMesh);

    // 3. Central Radiant Point Light (Illuminates solar system authentically from (0,0,0))
    coreLight = new THREE.PointLight(0xfffaed, 0.0, 0, 0);
    coreLight.position.set(0, 0, 0);
    centralStarGroup.add(coreLight);

    coreWarmLight = new THREE.PointLight(0xffdfaa, 0.0, 0, 0);
    coreWarmLight.position.set(0, 0, 0);
    centralStarGroup.add(coreWarmLight);

    // Ambient space light (subtle secondary illumination for shadow readability)
    ambientLight = new THREE.AmbientLight(0x010204, 0.015);
    scene.add(ambientLight);

    centralStarGroup.visible = false;
    scene.add(centralStarGroup);
  }

  // ── 06. REAL MILKY WAY SKYBOX, LAYERED PARALLAX STARS & DUST PARTICLES ──
  function buildSpiralArms() {
    deepSpaceStarsGroup = new THREE.Group();

    // 1. High-Resolution NASA Milky Way Skybox Sphere
    const skyGeo = new THREE.SphereGeometry(1800, 64, 48);
    const milkyWayTex = getOrLoadTexture('assets/textures/milkyway.jpg', true);
    const skyMat = new THREE.MeshBasicMaterial({
      map: milkyWayTex,
      side: THREE.BackSide,
      depthWrite: false,
      transparent: true,
      opacity: 0.22,
      color: new THREE.Color(0x1a2233)
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    // Subtle axial orientation for cinematic perspective
    skyMesh.rotation.x = 0.35;
    skyMesh.rotation.z = -0.22;
    deepSpaceStarsGroup.add(skyMesh);

    // 2. Multi-Layer Natural Starfield with Realistic Stellar Spectra
    const particleCount = 2200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // True stellar color classes: O/B (blue-white), A/F (white), G (yellow-white), K (soft orange)
    const starPalette = [
      new THREE.Color(0xdbeafe), // Blue-white
      new THREE.Color(0xf8fafc), // Pure white
      new THREE.Color(0xfef9c3), // Pale yellow
      new THREE.Color(0xfdba74)  // Warm amber
    ];

    for (let i = 0; i < particleCount; i++) {
      // Natural spherical shell distribution between 500 AU and 1400 AU
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 500 + Math.random() * 900;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const starCol = starPalette[Math.floor(Math.random() * starPalette.length)];
      // Subtle random brightness variation
      const brightness = 0.65 + Math.random() * 0.55;
      colors[i * 3] = starCol.r * brightness;
      colors[i * 3 + 1] = starCol.g * brightness;
      colors[i * 3 + 2] = starCol.b * brightness;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starSprite = generateStarSprite();
    const mat = new THREE.PointsMaterial({
      size: 1.6,
      map: starSprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particlesMesh = new THREE.Points(geo, mat);
    deepSpaceStarsGroup.add(particlesMesh);
    scene.add(deepSpaceStarsGroup);

    // 3. Foreground Cosmic Dust & Speed Particles
    foregroundStardustGroup = new THREE.Group();
    const dustCount = 450;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const cDust = new THREE.Color(0xe2e8f0);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 850;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 220;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 850;
      dustColors[i * 3] = cDust.r;
      dustColors[i * 3 + 1] = cDust.g;
      dustColors[i * 3 + 2] = cDust.b;
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 1.3,
      map: starSprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.40,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const dustMesh = new THREE.Points(dustGeo, dustMat);
    foregroundStardustGroup.add(dustMesh);
    scene.add(foregroundStardustGroup);
  }

  // ── 07. SEVEN DISTINCT 3D PLANETS (REAL PHOTO TEXTURES & PBR MATERIALS) ──
  const texLoader = new THREE.TextureLoader();
  const textureCache = {};
  function getOrLoadTexture(path, isColor = true) {
    if (!textureCache[path]) {
      const tex = texLoader.load(path);
      if (isColor) {
        tex.encoding = THREE.sRGBEncoding;
      }
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      textureCache[path] = tex;
    }
    return textureCache[path];
  }

  function createAtmosphereMaterial(atmosColor, sunsetColor, power = 3.6, intensity = 1.0) {
    return new THREE.ShaderMaterial({
      uniforms: {
        uAtmosColor: { value: new THREE.Color(atmosColor) },
        uSunsetColor: { value: new THREE.Color(sunsetColor) },
        uPower: { value: power },
        uIntensity: { value: intensity }
      },
      vertexShader: `
        varying vec3 vAtmosNormal;
        varying vec3 vAtmosWorldPos;
        void main() {
          vAtmosNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vAtmosWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uAtmosColor;
        uniform vec3 uSunsetColor;
        uniform float uPower;
        uniform float uIntensity;

        varying vec3 vAtmosNormal;
        varying vec3 vAtmosWorldPos;

        void main() {
          // Sun is at (0, 0, 0)
          vec3 sunDir = normalize(-vAtmosWorldPos);
          vec3 norm = normalize(vAtmosNormal);
          vec3 viewDir = normalize(cameraPosition - vAtmosWorldPos);

          float sunFacing = dot(norm, sunDir);
          float vDotN = max(0.0, dot(norm, viewDir));

          // Fresnel rim glow
          float rim = pow(1.0 - vDotN, uPower);

          // Sunlit hemisphere factor (fades softly to 0 on dark side)
          float sunFactor = smoothstep(-0.15, 0.35, sunFacing);

          // Sunset blend at terminator
          float terminatorFactor = smoothstep(-0.10, 0.30, sunFacing);
          vec3 scatterColor = mix(uSunsetColor, uAtmosColor, terminatorFactor);

          float alpha = rim * sunFactor * uIntensity;
          if (alpha < 0.003) discard;

          gl_FragColor = vec4(scatterColor * 1.35, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      depthWrite: false
    });
  }

  const CELESTIAL_CONFIGS = [
    {
      body: 'earth',
      name: 'Earth',
      axialTilt: 0.409, // 23.44 deg
      rotationSpeed: 0.005,
      hasClouds: true,
      cloudSpeed: 0.007,
      hasAtmos: true
    },
    {
      body: 'moon',
      name: 'Moon',
      axialTilt: 0.027, // 1.54 deg
      rotationSpeed: 0.003,
      hasClouds: false,
      hasAtmos: false
    },
    {
      body: 'mars',
      name: 'Mars',
      axialTilt: 0.440, // 25.19 deg
      rotationSpeed: 0.005,
      hasClouds: false,
      hasAtmos: true
    },
    {
      body: 'jupiter',
      name: 'Jupiter',
      axialTilt: 0.055, // 3.13 deg
      rotationSpeed: 0.009,
      hasClouds: false,
      hasAtmos: true
    },
    {
      body: 'saturn',
      name: 'Saturn',
      axialTilt: 0.466, // 26.73 deg
      rotationSpeed: 0.008,
      hasClouds: false,
      hasRings: true,
      hasAtmos: true
    },
    {
      body: 'venus',
      name: 'Venus',
      axialTilt: 3.095, // Retrograde spin
      rotationSpeed: -0.003,
      hasClouds: false,
      hasAtmos: true
    },
    {
      body: 'neptune',
      name: 'Neptune',
      axialTilt: 0.494, // 28.32 deg
      rotationSpeed: 0.006,
      hasClouds: false,
      hasAtmos: true
    }
  ];

  function buildPlanetarySystem() {
    planetsGroup = new THREE.Group();
    orbitalRingsGroup = new THREE.Group();

    projects.forEach((proj, idx) => {
      const pGroup = new THREE.Group();
      const celestial = CELESTIAL_CONFIGS[idx] || CELESTIAL_CONFIGS[0];

      // Axial orientation group: isolates planetary axial tilt from orbit
      const axialGroup = new THREE.Group();
      axialGroup.rotation.z = celestial.axialTilt;

      // Perfectly spherical 96x96 geometry (aspect ratio 1:1:1, zero egg distortion)
      const planetGeo = new THREE.SphereGeometry(proj.planetRadius, 96, 96);
      let planetMat;
      let atmosMesh = null;

      if (idx === 0) {
        // ── PLANET 01 (RepoMentor AI): EARTH ──
        const earthDayTex = getOrLoadTexture('assets/textures/earth_day.jpg', true);
        const earthNormalTex = getOrLoadTexture('assets/textures/earth_normal.jpg', false);
        const earthSpecTex = getOrLoadTexture('assets/textures/earth_specular.jpg', false);
        const earthNightTex = getOrLoadTexture('assets/textures/earth_night.jpg', true);

        planetMat = new THREE.MeshStandardMaterial({
          map: earthDayTex,
          normalMap: earthNormalTex,
          normalScale: new THREE.Vector2(0.85, 0.85),
          roughnessMap: earthSpecTex,
          roughness: 0.90,
          metalness: 0.06
        });

        planetMat.onBeforeCompile = function (shader) {
          shader.uniforms.uNightTex = { value: earthNightTex };

          shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `#include <common>
             varying vec3 vEarthWorldPos;
             varying vec3 vEarthWorldNormal;`
          );
          shader.vertexShader = shader.vertexShader.replace(
            '#include <worldpos_vertex>',
            `#include <worldpos_vertex>
             vEarthWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
             vEarthWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);`
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            `#include <common>
             uniform sampler2D uNightTex;
             varying vec3 vEarthWorldPos;
             varying vec3 vEarthWorldNormal;`
          );

          // Specular map inversion: water gets low roughness (sharp specular glint), land remains matte
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <roughnessmap_fragment>',
            `float roughnessFactor = roughness;
             #ifdef USE_ROUGHNESSMAP
               float specVal = texture2D(roughnessMap, vUv).r;
               roughnessFactor = mix(0.92, 0.08, specVal);
             #endif`
          );

          // Night city lights on unlit hemisphere
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `#include <dithering_fragment>
             vec3 sunWorldDir = normalize(-vEarthWorldPos);
             float sunFacing = dot(vEarthWorldNormal, sunWorldDir);
             float nightFactor = 1.0 - smoothstep(-0.15, 0.10, sunFacing);
             vec3 nightLights = texture2D(uNightTex, vUv).rgb;
             gl_FragColor.rgb += nightLights * vec3(1.20, 1.10, 0.90) * (nightFactor * 2.2);`
          );
        };

        // Separate Cloud Shell rotating at independent speed
        const cloudGeo = new THREE.SphereGeometry(proj.planetRadius * 1.018, 64, 64);
        const cloudTex = getOrLoadTexture('assets/textures/earth_clouds.png', true);
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.85,
          roughness: 0.96,
          metalness: 0.0,
          depthWrite: false
        });
        const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        axialGroup.add(cloudMesh);
        cloudMeshes.push({
          mesh: cloudMesh,
          rotSpeed: celestial.cloudSpeed
        });

        // Atmospheric Scattering Rim
        const atmosGeo = new THREE.SphereGeometry(proj.planetRadius * 1.032, 64, 64);
        const atmosMat = createAtmosphereMaterial(0x38bdf8, 0xf97316, 3.4, 1.15);
        atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
        axialGroup.add(atmosMesh);

      } else if (idx === 1) {
        // ── PLANET 02 (GymBuddy AI): MOON ──
        // Perfect round sphere geometry with high-resolution crater topography & zero atmosphere
        const moonColorTex = getOrLoadTexture('assets/textures/moon_color.jpg', true);
        const moonBumpTex = getOrLoadTexture('assets/textures/moon_bump.jpg', false);

        planetMat = new THREE.MeshStandardMaterial({
          map: moonColorTex,
          bumpMap: moonBumpTex,
          bumpScale: 0.80,
          roughness: 0.94,
          metalness: 0.0
        });

      } else if (idx === 2) {
        // ── PLANET 03 (Career AI Platform): MARS ──
        const marsColorTex = getOrLoadTexture('assets/textures/mars_color.jpg', true);
        const marsBumpTex = getOrLoadTexture('assets/textures/mars_bump.jpg', false);

        planetMat = new THREE.MeshStandardMaterial({
          map: marsColorTex,
          bumpMap: marsBumpTex,
          bumpScale: 0.85,
          roughness: 0.84,
          metalness: 0.04
        });

        // Thin pale amber/rust atmospheric rim
        const atmosGeo = new THREE.SphereGeometry(proj.planetRadius * 1.025, 64, 64);
        const atmosMat = createAtmosphereMaterial(0xfb923c, 0xe11d48, 5.2, 0.85);
        atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
        axialGroup.add(atmosMesh);

      } else if (idx === 3) {
        // ── PLANET 04 (MindPulse AI): JUPITER ──
        const jupiterColorTex = getOrLoadTexture('assets/textures/jupiter_color.jpg', true);

        planetMat = new THREE.MeshStandardMaterial({
          map: jupiterColorTex,
          roughness: 0.85,
          metalness: 0.0
        });

        // Soft cream atmospheric haze
        const atmosGeo = new THREE.SphereGeometry(proj.planetRadius * 1.028, 64, 64);
        const atmosMat = createAtmosphereMaterial(0xfed7aa, 0xd97706, 4.0, 0.65);
        atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
        axialGroup.add(atmosMesh);

      } else if (idx === 4) {
        // ── PLANET 05 (Spotify Clone): SATURN (WITH CONCENTRIC RINGS & 2-WAY SHADOWS) ──
        const saturnColorTex = getOrLoadTexture('assets/textures/saturn_color.jpg', true);
        const innerR = proj.planetRadius * 1.30;
        const outerR = proj.planetRadius * 2.38;

        planetMat = new THREE.MeshStandardMaterial({
          map: saturnColorTex,
          roughness: 0.85,
          metalness: 0.0
        });

        // Ring shadow on Saturn surface
        planetMat.onBeforeCompile = function (shader) {
          shader.uniforms.uSunLocalDir = { value: new THREE.Vector3(0, 0, 1) };
          shader.uniforms.uRingAlphaMap = { value: getOrLoadTexture('assets/textures/saturn_ring_alpha.png', false) };
          shader.uniforms.uInnerRadius = { value: innerR };
          shader.uniforms.uOuterRadius = { value: outerR };
          planetMat.userData.shader = shader;

          shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `#include <common>
             varying vec3 vSaturnLocalPos;`
          );
          shader.vertexShader = shader.vertexShader.replace(
            '#include <worldpos_vertex>',
            `#include <worldpos_vertex>
             vSaturnLocalPos = position;`
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            `#include <common>
             uniform vec3 uSunLocalDir;
             uniform sampler2D uRingAlphaMap;
             uniform float uInnerRadius;
             uniform float uOuterRadius;
             varying vec3 vSaturnLocalPos;`
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `#include <dithering_fragment>
             if (abs(uSunLocalDir.y) > 0.001) {
               float t = -vSaturnLocalPos.y / uSunLocalDir.y;
               if (t > 0.0) {
                 vec3 ringHit = vSaturnLocalPos + t * uSunLocalDir;
                 float ringDist = length(ringHit.xz);
                 if (ringDist >= uInnerRadius && ringDist <= uOuterRadius) {
                   float ringU = (ringDist - uInnerRadius) / (uOuterRadius - uInnerRadius);
                   float ringDensity = texture2D(uRingAlphaMap, vec2(ringU, 0.5)).r;
                   gl_FragColor.rgb *= (1.0 - ringDensity * 0.75);
                 }
               }
             }`
          );
        };

        // Photorealistic Saturnian Ring with Cassini Division & Planet Shadow
        const ringGeo = new THREE.RingGeometry(innerR, outerR, 128, 8);
        const posAttr = ringGeo.attributes.position;
        const uvsAttr = ringGeo.attributes.uv;
        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i);
          const vy = posAttr.getY(i);
          const rDist = Math.sqrt(vx * vx + vy * vy);
          const u = (rDist - innerR) / (outerR - innerR);
          uvsAttr.setXY(i, u, 0.5);
        }
        ringGeo.attributes.uv.needsUpdate = true;

        const ringColorTex = getOrLoadTexture('assets/textures/saturn_ring_color.png', true);
        const ringAlphaTex = getOrLoadTexture('assets/textures/saturn_ring_alpha.png', false);

        const ringShaderMat = new THREE.ShaderMaterial({
          uniforms: {
            uRingColorMap: { value: ringColorTex },
            uRingAlphaMap: { value: ringAlphaTex },
            uSunLocalDir: { value: new THREE.Vector3(0, 0, 1) },
            uPlanetRadius: { value: proj.planetRadius }
          },
          vertexShader: `
            varying vec3 vRingLocalPos;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              vRingLocalPos = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D uRingColorMap;
            uniform sampler2D uRingAlphaMap;
            uniform vec3 uSunLocalDir;
            uniform float uPlanetRadius;

            varying vec3 vRingLocalPos;
            varying vec2 vUv;

            void main() {
              vec4 colorSample = texture2D(uRingColorMap, vUv);
              float alphaSample = texture2D(uRingAlphaMap, vUv).r;

              if (alphaSample < 0.015) discard;

              // Planet shadow on ring (eclipse cutout on night side)
              float shadow = 1.0;
              float projSun = dot(vRingLocalPos, uSunLocalDir);
              if (projSun < 0.0) {
                vec3 perp = vRingLocalPos - projSun * uSunLocalDir;
                float dist = length(perp);
                shadow = smoothstep(uPlanetRadius * 0.96, uPlanetRadius * 1.02, dist);
              }

              // Double-sided sun illumination
              float sunElevation = max(0.12, abs(uSunLocalDir.y));
              vec3 litColor = colorSample.rgb * sunElevation * shadow;

              gl_FragColor = vec4(litColor, alphaSample * 0.94);
            }
          `,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false
        });

        saturnRingMesh = new THREE.Mesh(ringGeo, ringShaderMat);
        saturnRingMesh.rotation.x = Math.PI * 0.5;
        axialGroup.add(saturnRingMesh);

        // Soft golden atmospheric rim
        const atmosGeo = new THREE.SphereGeometry(proj.planetRadius * 1.028, 64, 64);
        const atmosMat = createAtmosphereMaterial(0xfde68a, 0xb45309, 4.2, 0.70);
        atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
        axialGroup.add(atmosMesh);

      } else if (idx === 5) {
        // ── PLANET 06 (URL Shortener): VENUS ──
        const venusColorTex = getOrLoadTexture('assets/textures/venus_color.jpg', true);
        const venusBumpTex = getOrLoadTexture('assets/textures/venus_bump.jpg', false);

        planetMat = new THREE.MeshStandardMaterial({
          map: venusColorTex,
          bumpMap: venusBumpTex,
          bumpScale: 0.04,
          roughness: 0.88,
          metalness: 0.0
        });

        // Dense pale yellow-white atmospheric shroud
        const atmosGeo = new THREE.SphereGeometry(proj.planetRadius * 1.032, 64, 64);
        const atmosMat = createAtmosphereMaterial(0xfef08a, 0xeab308, 3.2, 1.05);
        atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
        axialGroup.add(atmosMesh);

      } else {
        // ── PLANET 07 (Gyan App): NEPTUNE ──
        const neptuneColorTex = getOrLoadTexture('assets/textures/neptune_color.jpg', true);

        planetMat = new THREE.MeshStandardMaterial({
          map: neptuneColorTex,
          roughness: 0.82,
          metalness: 0.0
        });

        // Deep azure ice-cyan atmospheric scattering rim
        const atmosGeo = new THREE.SphereGeometry(proj.planetRadius * 1.030, 64, 64);
        const atmosMat = createAtmosphereMaterial(0x38bdf8, 0x0284c7, 3.6, 1.10);
        atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
        axialGroup.add(atmosMesh);
      }

      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      axialGroup.add(planetMesh);
      pGroup.add(axialGroup);

      // Initial Orbital Position from Keplerian arrangement
      const pos = computeKeplerianPosition(
        proj.orbitRadius,
        proj.eccentricity,
        proj.inclination,
        proj.nodeLongitude,
        proj.periapsis,
        proj.orbitAngle
      );
      pGroup.position.copy(pos);

      planetsGroup.add(pGroup);

      // 3B. 3D Holographic Surface Scan Ring
      const scanRingGeo = new THREE.RingGeometry(proj.planetRadius * 1.015, proj.planetRadius * 1.045, 64);
      const scanRingMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(proj.color || 0xF59E0B),
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const scanRingMesh = new THREE.Mesh(scanRingGeo, scanRingMat);
      scanRingMesh.rotation.x = Math.PI * 0.5;
      scanRingMesh.visible = false;
      pGroup.add(scanRingMesh);

      // Save Planet Reference
      planetMeshes.push({
        group: pGroup,
        mesh: planetMesh,
        axialGroup: axialGroup,
        scanRingMesh: scanRingMesh,
        project: proj,
        baseAngle: proj.orbitAngle,
        basePos: pos.clone(),
        baseX: pos.x,
        baseY: pos.y,
        baseZ: pos.z,
        orbitRadius: proj.orbitRadius,
        eccentricity: proj.eccentricity,
        inclination: proj.inclination,
        nodeLongitude: proj.nodeLongitude,
        periapsis: proj.periapsis,
        orbitSpeed: proj.orbitSpeed,
        rotationSpeed: celestial.rotationSpeed
      });

      // 4B. Natural Companion Moons (Authentic cratered lunar rock, zero artificial tinting)
      if (proj.planetaryMetrics && proj.planetaryMetrics.moons && proj.planetaryMetrics.moons.length > 0) {
        const moonRadius = Math.max(1.8, proj.planetRadius * 0.18);
        const moonGeo = new THREE.SphereGeometry(moonRadius, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({
          map: getOrLoadTexture('assets/textures/moon_color.jpg', true),
          bumpMap: getOrLoadTexture('assets/textures/moon_bump.jpg', false),
          bumpScale: 0.60,
          roughness: 0.92,
          metalness: 0.02
        });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        const moonDist = proj.planetRadius * (proj.hasRings ? 3.4 : 2.25);
        const moonAngle = (idx * 1.85) % (Math.PI * 2);
        const moonElev = (idx % 2 === 0 ? 0.22 : -0.22);
        moonMesh.position.set(
          Math.cos(moonAngle) * moonDist,
          moonElev * moonDist,
          Math.sin(moonAngle) * moonDist
        );
        pGroup.add(moonMesh);
        moonMeshes.push({
          mesh: moonMesh,
          dist: moonDist,
          angle: moonAngle,
          elevation: moonElev,
          speed: 0.35 + (idx % 3) * 0.15
        });
      }

      // 5. Authentic Keplerian Orbital Trajectory Line
      const orbitRingGeo = new THREE.BufferGeometry();
      const ringPoints = [];
      const segments = 128;
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        const oPos = computeKeplerianPosition(
          proj.orbitRadius,
          proj.eccentricity,
          proj.inclination,
          proj.nodeLongitude,
          proj.periapsis,
          theta
        );
        ringPoints.push(oPos.x, oPos.y, oPos.z);
      }
      orbitRingGeo.setAttribute('position', new THREE.Float32BufferAttribute(ringPoints, 3));
      const orbitRingMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(proj.color),
        transparent: true,
        opacity: 0.16,
        depthWrite: false
      });
      const orbitLine = new THREE.Line(orbitRingGeo, orbitRingMat);
      orbitalRingsGroup.add(orbitLine);
    });

    orbitalRingsGroup.visible = false;
    planetsGroup.visible = false;
    scene.add(orbitalRingsGroup);
    scene.add(planetsGroup);
  }

  // ── 08. REALISTIC ASTEROID BELT (MAIN BELT WITH ZERO FLIGHT-CORRIDOR OBSTRUCTIONS) ──
  function buildAsteroidField() {
    asteroidBeltGroup = new THREE.Group();
    asteroidInstanceData.length = 0;

    // 1. Physically Displaced Rocky Asteroid Geometry with Authentic Smooth Normals
    const rockGeo = new THREE.DodecahedronGeometry(1.0, 2);
    const posAttr = rockGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const vz = posAttr.getZ(i);
      const len = Math.sqrt(vx * vx + vy * vy + vz * vz);
      const n1 = globalNoise(vx * 2.8 + 4.12, vy * 2.8, vz * 2.8);
      const n2 = detailNoise(vx * 5.6, vy * 5.6 + 8.3, vz * 5.6) * 0.35;
      const disp = 1.0 + (n1 * 0.22) + (n2 * 0.12);
      posAttr.setXYZ(i, (vx / len) * disp, (vy / len) * disp, (vz / len) * disp);
    }
    rockGeo.computeVertexNormals();

    // 2. NASA Asteroid PBR Material (Dark Gray Rock, Albedo ~0.16, No Pure Black/White Blobs)
    const asteroidTex = getOrLoadTexture('assets/textures/asteroid.jpg', true);
    const rockMat = new THREE.MeshStandardMaterial({
      map: asteroidTex,
      color: 0x827d76,
      roughness: 0.90,
      metalness: 0.04
    });

    const planetPositions = planetMeshes.map(p => p.group.position);
    const totalAsteroids = 135;
    instancedAsteroidMesh = new THREE.InstancedMesh(rockGeo, rockMat, totalAsteroids);
    instancedAsteroidMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const dummy = new THREE.Object3D();
    let instanceIndex = 0;

    // 3. Main Asteroid Belt (Authentic Keplerian Toroid between 250 AU and 325 AU, between Mars and Jupiter)
    for (let i = 0; i < totalAsteroids; i++) {
      const rad = 250 + Math.random() * 75;
      const theta = Math.random() * Math.PI * 2;
      let mx = Math.cos(theta) * rad;
      let mz = Math.sin(theta) * rad;
      let my = (Math.random() - 0.5) * 22;

      // Strict safety margin: ensure no asteroids spawn within 80 AU of any planet or 100 AU of the central star
      for (let p = 0; p < planetPositions.length; p++) {
        const pPos = planetPositions[p];
        const dist = Math.sqrt((mx - pPos.x)**2 + (my - pPos.y)**2 + (mz - pPos.z)**2);
        if (dist < 80) {
          mx += (mx > pPos.x ? 80 : -80);
          mz += (mz > pPos.z ? 80 : -80);
        }
      }

      const scale = 0.35 + Math.pow(Math.random(), 2.8) * 1.1;
      const rot = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005
      );

      dummy.position.set(mx, my, mz);
      dummy.rotation.copy(rot);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      instancedAsteroidMesh.setMatrixAt(instanceIndex, dummy.matrix);

      asteroidInstanceData.push({
        pos: new THREE.Vector3(mx, my, mz),
        rot: rot,
        rotSpeed: rotSpeed,
        scale: scale
      });
      instanceIndex++;
    }

    instancedAsteroidMesh.instanceMatrix.needsUpdate = true;
    asteroidBeltGroup.add(instancedAsteroidMesh);
    asteroidBeltGroup.visible = false;
    scene.add(asteroidBeltGroup);
  }

  // ── 09. CINEMATIC MULTI-ORBIT PARAMETRIC CAMERA EXPEDITION ──
  let arrivalPoses = [];

  function buildCameraFlightSpline() {
    if (!containerEl || !camera) return;
    const isMobile = (containerEl.clientWidth || window.innerWidth) <= 768;
    const vFOV = camera.fov * Math.PI / 180;

    arrivalPoses = projects.map((p, idx) => {
      // Planet position from Keplerian orbital model
      let pos;
      if (planetMeshes[idx] && planetMeshes[idx].group) {
        pos = planetMeshes[idx].group.position;
      } else {
        pos = computeKeplerianPosition(
          p.orbitRadius,
          p.eccentricity,
          p.inclination,
          p.nodeLongitude,
          p.periapsis,
          p.orbitAngle
        );
      }

      const r = p.planetRadius;
      const sunToPlanet = pos.clone().normalize();
      const tan = new THREE.Vector3(-sunToPlanet.z, 0, sunToPlanet.x).normalize();
      const up = new THREE.Vector3(0, 1, 0);

      // Phase C Requirement 4: Tailored celestial approach angles, elevations & scale relationships per planet:
      let angleOffset = 0.50;
      let elev = 0.35;
      let distMult = p.hasRings ? (isMobile ? 3.8 : 4.8) : (isMobile ? 2.8 : 3.8);

      if (idx === 0) { angleOffset = 0.52; elev = 0.48; distMult = isMobile ? 3.0 : 3.8; } // Planet 01 (RepoMentor AI): High Northern Dive
      else if (idx === 1) { angleOffset = -0.62; elev = -0.32; distMult = isMobile ? 2.9 : 3.8; } // Planet 02 (GymBuddy AI): Southern Glacial Skim
      else if (idx === 2) { angleOffset = 0.68; elev = 0.22; distMult = isMobile ? 3.2 : 4.2; } // Planet 03 (Career AI): Wide Stratospheric Flank
      else if (idx === 3) { angleOffset = 0.28; elev = 0.38; distMult = isMobile ? 2.9 : 3.8; } // Planet 04 (MindPulse AI): Frontal Sunlit Terminator Glide
      else if (idx === 4) { angleOffset = 0.44; elev = 0.55; distMult = isMobile ? 3.8 : 4.8; } // Planet 05 (Spotify): High Oblique Trans-Ring Vantage
      else if (idx === 5) { angleOffset = -0.58; elev = 0.16; distMult = isMobile ? 2.8 : 3.8; } // Planet 06 (URL Shortener): Low Volcanic Trench Pass
      else if (idx === 6) { angleOffset = 0.48; elev = 0.30; distMult = isMobile ? 2.7 : 3.6; } // Planet 07 (Gyan): Backlit Golden Corona Silhouette

      const viewDist = r * distMult;

      const viewDir = new THREE.Vector3()
        .addScaledVector(sunToPlanet, -Math.cos(angleOffset))
        .addScaledVector(tan, Math.sin(angleOffset))
        .addScaledVector(up, elev)
        .normalize();

      const camPos = pos.clone().addScaledVector(viewDir, viewDist);
      const camToPlanet = pos.clone().sub(camPos);
      const distToPlanet = camToPlanet.length();
      const fwd = camToPlanet.clone().normalize();
      const right = new THREE.Vector3().crossVectors(fwd, up).normalize();

      const halfHeight = distToPlanet * Math.tan(vFOV / 2);
      const halfWidth = halfHeight * camera.aspect;

      // Desktop: Frame planet on LEFT (screen X ~ 34%) matching reference image, leaving right 55% for HUD console
      // Mobile: Frame planet at screen X ~ 50% (centered), Y ~ 35% (upper third)
      const targetNdcX = isMobile ? 0.0 : -0.32;
      const targetNdcY = isMobile ? 0.35 : 0.0;

      const shiftX = targetNdcX * halfWidth;
      const shiftY = targetNdcY * halfHeight;

      const lookTarget = pos.clone()
        .addScaledVector(right, -shiftX)
        .addScaledVector(up, -shiftY);

      return {
        planetPos: pos,
        camPos: camPos,
        lookTarget: lookTarget,
        radius: r,
        viewDir: viewDir,
        viewDist: viewDist,
        fwd: fwd,
        right: right
      };
    });
  }

  // Smooth Cubic Bezier Vector3 Evaluator
  function cubicBezier3(p0, p1, p2, p3, t) {
    const omt = 1.0 - t;
    const t2 = t * t;
    const t3 = t2 * t;
    const omt2 = omt * omt;
    const omt3 = omt2 * omt;

    return new THREE.Vector3(
      omt3 * p0.x + 3 * omt2 * t * p1.x + 3 * omt * t2 * p2.x + t3 * p3.x,
      omt3 * p0.y + 3 * omt2 * t * p1.y + 3 * omt * t2 * p2.y + t3 * p3.y,
      omt3 * p0.z + 3 * omt2 * t * p1.z + 3 * omt * t2 * p2.z + t3 * p3.z
    );
  }

  // Exact 1st Derivative (Velocity / Tangent Vector) of Cubic Bezier
  function cubicBezierDerivative3(p0, p1, p2, p3, t) {
    const omt = 1.0 - t;
    const omt2 = omt * omt;
    const t2 = t * t;
    const c0 = 3 * omt2;
    const c1 = 6 * omt * t;
    const c2 = 3 * t2;
    return new THREE.Vector3(
      c0 * (p1.x - p0.x) + c1 * (p2.x - p1.x) + c2 * (p3.x - p2.x),
      c0 * (p1.y - p0.y) + c1 * (p2.y - p1.y) + c2 * (p3.y - p2.y),
      c0 * (p1.z - p0.z) + c1 * (p2.z - p1.z) + c2 * (p3.z - p2.z)
    );
  }

  // ── CONTINUOUS 3D CAMERA TRANSITION: HOME TO PROJECTS SOLAR SYSTEM ──
  let homeScrollTriggerInstance = null;
  let homeTransitionProgress = 0.0;
  let targetHomeTransitionProgress = 0.0;

  function evaluateHomeTransitionCamera(progress) {
    if (!arrivalPoses || arrivalPoses.length < projects.length) {
      buildCameraFlightSpline();
    }
    const cur = arrivalPoses[0];
    const P_SOLAR = cur ? cur.camPos.clone().add(new THREE.Vector3(-160, 110, 240)) : new THREE.Vector3(-210, 155, 360);
    const L_SOLAR = new THREE.Vector3(0, 0, 0);

    const clampedP = Math.max(0.0, Math.min(1.0, progress));

    const quintic = (u) => u * u * u * (u * (u * 6.0 - 15.0) + 10.0);
    const smooth = (a, b, x) => {
      const u = Math.max(0.0, Math.min(1.0, (x - a) / Math.max(0.0001, b - a)));
      return u * u * (3.0 - 2.0 * u);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // 3-STAGE CINEMATIC GALAXY ODYSSEY — Identical to Solar -> Sky Map:
    // Act 1 (0.00 <= p <= 0.25): ZOOM OUT straight back from Black Hole
    // Act 2 (0.25 < p <= 0.55): TURN CAMERA ANGLE from Black Hole to Sun + Bank
    // Act 3 (0.55 < p <= 1.00): ZOOM IN / Approach Solar System Overview
    // ═══════════════════════════════════════════════════════════════════════

    const L_HOME = new THREE.Vector3(0, 20, 0); // Natural gaze center on Home (BH on right, text on left)
    const P_00 = new THREE.Vector3(-60, 40, 480); // Camera starting vantage facing Home
    const P_25 = new THREE.Vector3(-240, 80, 920); // Zoom-Out apex (pure depth retreat)
    const P_55 = new THREE.Vector3(-520, 280, 820); // Deep space orbital turn vantage
    const P_85 = P_SOLAR.clone().add(new THREE.Vector3(-80, 50, 140)); // High approach corridor

    let camPos, lookTarget, roll = 0.0, fov = 44.0;

    if (clampedP <= 0.25) {
      // Act 1: Pure Zoom Out (camera pulls straight back along depth axis away from Home)
      const u = quintic(clampedP / 0.25);
      camPos = P_00.clone().lerp(P_25, u);
      lookTarget = L_HOME.clone();
      fov = 44.0 + 4.0 * u;
      roll = 0.0;
    } else if (clampedP <= 0.55) {
      // Act 2: Turn camera angle from Home to Sun + authentic banking roll
      const raw = (clampedP - 0.25) / 0.30;
      const u = quintic(raw);
      camPos = P_25.clone().lerp(P_55, u);
      lookTarget = L_HOME.clone().lerp(L_SOLAR, u);
      fov = 48.0 + 4.0 * Math.sin(raw * Math.PI); // peaks at 52° wide lens during the turn
      roll = -0.048 * Math.sin(raw * Math.PI); // realistic spacecraft banking
    } else if (clampedP <= 0.85) {
      // Act 3A: Fast approach glide toward the Solar System
      const raw = (clampedP - 0.55) / 0.30;
      const sm = raw * raw * (3.0 - 2.0 * raw);
      const u = 0.80 * raw + 0.20 * sm;
      camPos = P_55.clone().lerp(P_85, u);
      lookTarget = L_SOLAR.clone();
      fov = 48.0 - 3.0 * u;
      roll = -0.015 * (1.0 - u);
    } else {
      // Act 3B: Smooth deceleration & arrival into Solar System Overview pose
      const raw = (clampedP - 0.85) / 0.15;
      const u = 1.0 - Math.pow(1.0 - raw, 3.0);
      camPos = P_85.clone().lerp(P_SOLAR, u);
      lookTarget = L_SOLAR.clone();
      fov = 45.0 - 1.0 * u;
      roll = 0.0;
    }

    return { camPos, lookTarget, roll, fov, progress: clampedP };
  }

  function syncHomeElementsDrift(p) {
    if (!isActive) return;
    if (window.MasterJourneyController) return; // Master Journey Controller is the single authority for hero 3D camera synchronization
    const clampedP = Math.max(0.0, Math.min(1.0, p));
    const fadeOpacity = Math.max(0.0, 1.0 - clampedP * 1.35);
    // Pure zoom-out: scale down in place, no artificial sideways slide
    const scale = (1.0 - clampedP * 0.3).toFixed(3);

    const heroLayout = document.querySelector('#hero .space-hero-unified-layout') || document.querySelector('#hero .hero-layout');
    if (heroLayout) {
      heroLayout.style.transform = `scale(${scale})`;
      heroLayout.style.opacity = fadeOpacity.toFixed(3);
      heroLayout.style.pointerEvents = clampedP > 0.5 ? 'none' : 'auto';
    }

    const bhContainer = document.getElementById('blackHoleContainer');
    if (bhContainer) {
      bhContainer.style.transform = `translate3d(var(--bh-x, 0px), var(--bh-y, 0px), 0) scale(${scale})`;
      bhContainer.style.opacity = fadeOpacity.toFixed(3);
      bhContainer.style.pointerEvents = clampedP > 0.5 ? 'none' : 'auto';
    }

    const heroCanvas = document.getElementById('hero3DCanvas');
    if (heroCanvas) {
      heroCanvas.style.opacity = fadeOpacity.toFixed(3);
    }

    const bhHud = document.getElementById('blackHoleIntroHud');
    if (bhHud) {
      bhHud.style.opacity = fadeOpacity.toFixed(3);
    }
  }

  function updateHomeTransitionFromScroll() {
    if (!isActive) return;
    const heroEl = document.getElementById('hero');
    if (!heroEl) return;
    const rect = heroEl.getBoundingClientRect();
    const heroHeight = heroEl.offsetHeight || window.innerHeight;
    const p = Math.max(0.0, Math.min(1.0, -rect.top / Math.max(1, heroHeight)));
    targetHomeTransitionProgress = p;
  }

  // Continuous Parametric Camera Journey with Calibrated Planetary Dwell Plateaus
  function evaluateJourneyCamera(progress) {
    if (!arrivalPoses || arrivalPoses.length < projects.length) {
      buildCameraFlightSpline();
    }
    const clampedP = Math.max(0.0, Math.min(1.0, progress));
    const count = projects.length;

    // Stage 0: Deep space cosmic approach toward Planet 01 (RepoMentor AI)
    const p0DStart = (projects[0].encounter && projects[0].encounter.dwellPlateau) ? projects[0].encounter.dwellPlateau[0] : 0.035;
    if (clampedP < p0DStart) {
      const cur = arrivalPoses[0];
      const rawU = Math.max(0.0, Math.min(1.0, clampedP / p0DStart));
      // Quintic Hermite smoothstep for natural acceleration/deceleration
      const easedU = rawU * rawU * rawU * (rawU * (rawU * 6.0 - 15.0) + 10.0);

      // High cosmic entry pose gazing down into the solar system
      const P0 = cur.camPos.clone().add(new THREE.Vector3(-160, 110, 240));
      const P1 = P0.clone().addScaledVector(cur.camPos.clone().sub(P0), 0.40).add(new THREE.Vector3(0, 35, 0));
      const P2 = cur.camPos.clone().addScaledVector(cur.viewDir, cur.radius * 3.4).add(new THREE.Vector3(0, 25, 0));
      const P3 = cur.camPos;
      const camPos = cubicBezier3(P0, P1, P2, P3, easedU);

      // Forward flight velocity direction
      const tangent = cubicBezierDerivative3(P0, P1, P2, P3, Math.max(0.001, Math.min(0.999, easedU))).normalize();
      const forwardLook = camPos.clone().addScaledVector(tangent, 150.0);
      const coreLook = new THREE.Vector3(0, 0, 0);

      let lookTarget;
      if (easedU < 0.28) {
        const w = easedU / 0.28;
        lookTarget = coreLook.clone().lerp(forwardLook, w);
      } else if (easedU <= 0.68) {
        lookTarget = forwardLook;
      } else {
        const w = (easedU - 0.68) / 0.32;
        lookTarget = forwardLook.clone().lerp(cur.lookTarget, w);
      }

      const rollAngle = -Math.sin(rawU * Math.PI) * 0.08;
      const cruiseFov = 44.0 + 5.0 * Math.sin(rawU * Math.PI);
      return { camPos, lookTarget, segIdx: 0, rawU, easedU, isDwell: false, roll: rollAngle, fov: cruiseFov };
    }

    // Check if progress falls inside any project's dwell plateau or in interplanetary transit
    for (let i = 0; i < count; i++) {
      const p = projects[i];
      const dStart = (p.encounter && p.encounter.dwellPlateau) ? p.encounter.dwellPlateau[0] : (i / Math.max(1, count - 1));
      const dEnd = (p.encounter && p.encounter.dwellPlateau) ? p.encounter.dwellPlateau[1] : (i / Math.max(1, count - 1));

      if (clampedP >= dStart && clampedP <= dEnd) {
        // Rock-solid dwell plateau: camera position and look target are held completely stable
        const cur = arrivalPoses[i];
        return {
          camPos: cur.camPos.clone(),
          lookTarget: cur.lookTarget.clone(),
          segIdx: i,
          rawU: 0.0,
          easedU: 0.0,
          isDwell: true,
          roll: 0.0,
          fov: 44.0
        };
      }

      if (i < count - 1) {
        const nextP = projects[i + 1];
        const nextDStart = (nextP.encounter && nextP.encounter.dwellPlateau) ? nextP.encounter.dwellPlateau[0] : ((i + 1) / Math.max(1, count - 1));

        if (clampedP > dEnd && clampedP < nextDStart) {
          const transitLen = nextDStart - dEnd;
          const rawU = Math.max(0.0, Math.min(1.0, (clampedP - dEnd) / transitLen));
          
          // Quintic Hermite smoothstep for zero acceleration kick at boundaries:
          // S(u) = 6u^5 - 15u^4 + 10u^3
          const easedU = rawU * rawU * rawU * (rawU * (rawU * 6.0 - 15.0) + 10.0);

          const cur = arrivalPoses[i];
          const next = arrivalPoses[i + 1];

          // Cubic Bezier flight trajectory with solar-orbital curve passing near neighboring bodies
          const chord = next.camPos.clone().sub(cur.camPos);
          const normalXZ = new THREE.Vector3(-chord.z, 0, chord.x).normalize();
          const arcSign = (i % 2 === 0) ? 1.0 : -1.0;
          const arcBulge = Math.min(130.0, chord.length() * 0.28) * arcSign;

          const P0 = cur.camPos;
          const P1 = cur.camPos.clone()
            .addScaledVector(cur.viewDir, cur.radius * 2.8)
            .addScaledVector(normalXZ, arcBulge)
            .add(new THREE.Vector3(0, 32, 0));
          const P3 = next.camPos;
          const P2 = next.camPos.clone()
            .addScaledVector(next.viewDir, next.radius * 3.2)
            .addScaledVector(normalXZ, arcBulge)
            .add(new THREE.Vector3(0, 36, 0));
          const camPos = cubicBezier3(P0, P1, P2, P3, easedU);

          // Authentic Forward Velocity Direction from Bezier Tangent
          const tangent = cubicBezierDerivative3(P0, P1, P2, P3, Math.max(0.001, Math.min(0.999, easedU))).normalize();
          const forwardLook = camPos.clone().addScaledVector(tangent, 150.0);

          // 3-Stage Cinematic Look Blending:
          // 1. Departure (easedU < 0.28): pull away from departing world, turn smoothly toward forward path
          // 2. Interplanetary Cruise (0.28 <= easedU <= 0.72): forward look along velocity vector through starfield & asteroid belts
          // 3. Deceleration & Approach (easedU > 0.72): smoothly acquire and frame the destination planet
          // Phase C: 4-Phase Cinematic Arrival & Look Blending:
          // Phase 1 (Departure, easedU < 0.18): pull away from departing world, turn gaze forward along velocity
          // Phase 2 (Cruise, 0.18 <= easedU <= 0.65): forward gaze along velocity vector through deep space void
          // Phase 3 (Visual Acquisition, 0.65 < easedU <= 0.88): destination planet expands in view; camera turns gaze toward destination world
          // Phase 4 (Orbital Settle, easedU > 0.88): lock onto orbital inspection pose smoothly
          let lookTarget;
          if (easedU < 0.18) {
            const w = easedU / 0.18;
            lookTarget = cur.lookTarget.clone().lerp(forwardLook, w);
          } else if (easedU <= 0.65) {
            lookTarget = forwardLook;
          } else if (easedU <= 0.88) {
            const w = (easedU - 0.65) / 0.23;
            lookTarget = forwardLook.clone().lerp(next.lookTarget, w);
          } else {
            lookTarget = next.lookTarget.clone();
          }

          // Phase C Requirement 4: Distinct Dynamic Banking Roll per transit segment:
          const bankAngles = [-0.075, 0.085, -0.065, 0.090, -0.080, 0.060];
          const baseBank = bankAngles[i % bankAngles.length];
          const rollAngle = Math.sin(rawU * Math.PI) * baseBank;

          // Controlled FOV breathing: subtle zoom expansion during cruise, settling smoothly into destination inspection (44°)
          const cruiseFov = 44.0 + 4.5 * Math.sin(rawU * Math.PI);

          return { camPos, lookTarget, segIdx: i, rawU, easedU, isDwell: false, roll: rollAngle, fov: cruiseFov };
        }
      }
    }

    // ── PLANET 07 -> SKY MAP -> CONTACT CONTINUOUS CAMERA ──
    const lastIdx = count - 1;
    const lastDEnd = (projects[lastIdx].encounter && projects[lastIdx].encounter.dwellPlateau) ? projects[lastIdx].encounter.dwellPlateau[1] : 0.855;
    if (clampedP > 0.835 || clampedP > lastDEnd) {
      const mCtrl = window.MasterJourneyController;
      const masterT = (mCtrl && typeof mCtrl.getProgress === 'function')
        ? mCtrl.getProgress()
        : (0.572 + ((clampedP - 0.835) / 0.165) * (1.0 - 0.572));
      return evaluateConstellationJourneyCamera(masterT);
    }

    // Edge cases (below 0)
    const edgeIdx = clampedP <= 0 ? 0 : count - 1;
    const cur = arrivalPoses[edgeIdx];
    return {
      camPos: cur.camPos.clone(),
      lookTarget: cur.lookTarget.clone(),
      segIdx: edgeIdx,
      rawU: 0.0,
      easedU: 0.0,
      isDwell: true,
      roll: 0.0,
      fov: 44.0
    };
  }

  // ── 10. PREMIUM SPACECRAFT SCANNING EXPLORATION CONSOLE ──
  const projectRadarProfiles = [
    {
      score: '96%',
      labels: ['Architecture', 'Vector RAG', 'AST Parsing', 'Inference', 'Security'],
      values: [96, 94, 98, 92, 95]
    },
    {
      score: '95%',
      labels: ['CV Vision', 'Biomechanics', 'Client GPU', 'FSM State', 'Web Audio'],
      values: [98, 94, 96, 92, 90]
    },
    {
      score: '94%',
      labels: ['Multi-Agent', 'LangGraph', 'Schema API', 'Reasoning', 'Docker CI'],
      values: [96, 95, 94, 92, 90]
    },
    {
      score: '95%',
      labels: ['ML Pipeline', 'Random Forest', 'Data Hygiene', 'Out-Of-Bag', 'Cross-Val'],
      values: [94, 96, 98, 95, 92]
    },
    {
      score: '96%',
      labels: ['DOM Mastery', 'Web Audio', 'Zero-Framework', 'State Sync', 'Responsive'],
      values: [98, 95, 99, 94, 96]
    },
    {
      score: '96%',
      labels: ['Spring Boot 3', 'Redirection', 'Base62 Hash', 'OpenAPI 3', 'JPA Durability'],
      values: [96, 98, 99, 95, 92]
    },
    {
      score: '95%',
      labels: ['Accessibility', 'Offline SQLite', 'Multi-Sensory', 'Speech Engine', 'Zustand State'],
      values: [99, 96, 95, 92, 94]
    }
  ];

  function generateRadarSvg(profile, accentColor = '#F59E0B', accentRgb = [245, 158, 11]) {
    const cx = 75;
    const cy = 75;
    const r = 48;
    const n = profile.labels.length;
    const rgbStr = accentRgb.join(', ');

    // Concentric pentagonal grid rings at 25%, 50%, 75%, 100%
    const rings = [0.25, 0.5, 0.75, 1.0].map(scale => {
      const pts = [];
      for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        const x = cx + r * scale * Math.cos(angle);
        const y = cy + r * scale * Math.sin(angle);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      return `<polygon points="${pts.join(' ')}" fill="none" stroke="rgba(${rgbStr}, ${scale === 1.0 ? 0.35 : 0.15})" stroke-width="1" />`;
    }).join('');

    // Axis spokes and labels
    const spokes = [];
    const labelEls = [];
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      spokes.push(`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(${rgbStr}, 0.22)" stroke-width="1" />`);

      const lx = cx + (r + 14) * Math.cos(angle);
      const ly = cy + (r + 14) * Math.sin(angle);
      const anchor = Math.abs(Math.cos(angle)) < 0.2 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';
      labelEls.push(`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="central" fill="rgba(255, 255, 255, 0.78)" font-size="6.8" font-family="'JetBrains Mono', monospace" letter-spacing="0.04em">${profile.labels[i]}</text>`);
    }

    // Data polygon
    const dataPts = [];
    const dataCircles = [];
    for (let i = 0; i < n; i++) {
      const valScale = Math.max(0.1, Math.min(1.0, profile.values[i] / 100));
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const x = cx + r * valScale * Math.cos(angle);
      const y = cy + r * valScale * Math.sin(angle);
      dataPts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      dataCircles.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.2" fill="${accentColor}" />`);
    }

    return `
      <svg class="hud-radar-svg" viewBox="0 0 150 150" aria-label="Architecture Diagnostic Radar Chart">
        ${rings}
        ${spokes.join('')}
        <polygon points="${dataPts.join(' ')}" fill="rgba(${rgbStr}, 0.24)" stroke="${accentColor}" stroke-width="1.6" filter="drop-shadow(0 0 6px rgba(${rgbStr}, 0.45))" />
        ${dataCircles.join('')}
        ${labelEls.join('')}
      </svg>
    `;
  }

  function updateReticleScreenPosition(idx) {
    if (!hudEl || !camera || !planetMeshes[idx] || !planetMeshes[idx].group) return;
    const pGroup = planetMeshes[idx].group;
    const v = pGroup.position.clone();
    v.project(camera);

    const isMobile = (containerEl.clientWidth || window.innerWidth) <= 900;
    const reticle = hudEl.querySelector('#galaxyPlanetReticle');
    if (reticle) {
      if (v.z < 1) {
        const xPct = ((v.x + 1) / 2) * 100;
        const yPct = ((-v.y + 1) / 2) * 100;
        if (xPct >= 5 && xPct <= 95 && yPct >= 5 && yPct <= 95) {
          reticle.style.left = `${xPct.toFixed(1)}%`;
          reticle.style.top = `${yPct.toFixed(1)}%`;
          return;
        }
      }
      reticle.style.left = isMobile ? '50%' : '34%';
      reticle.style.top = isMobile ? '24%' : '50%';
    }
  }

  function buildHudStructure() {
    hudEl = document.createElement('div');
    hudEl.id = 'galaxyHudOverlay';
    hudEl.className = 'galaxy-hud-overlay';
    hudEl.style.opacity = '0';
    hudEl.style.visibility = 'hidden';
    hudEl.setAttribute('role', 'region');
    hudEl.setAttribute('aria-label', 'Spacecraft Planetary Scanning Interface');

    hudEl.innerHTML = `
      <!-- Cockpit Visor Outer Frame -->
      <div class="galaxy-cockpit-frame" aria-hidden="true">
        <div class="cockpit-border-top">
          <div class="cockpit-tick-scale">
            <span>500</span><span>1000</span><span>1500</span><span>2000</span>
          </div>
        </div>
        <div class="cockpit-border-left">
          <div class="cockpit-scale-v">
            <span>-100</span><span>-200</span><span>-300</span>
          </div>
        </div>
        <div class="cockpit-border-right">
          <div class="cockpit-scale-v">
            <span>3500</span><span>4000</span><span>4500</span>
          </div>
        </div>
        <div class="cockpit-corner-bracket tl"></div>
        <div class="cockpit-corner-bracket tr"></div>
        <div class="cockpit-corner-bracket bl"></div>
        <div class="cockpit-corner-bracket br"></div>
        <div class="cockpit-visor-label-tl">SYS.FLIGHT // COCKPIT HUD</div>
        <div class="cockpit-visor-label-br">ORBITAL RANGEFINDER ACTIVE</div>
      </div>

      <!-- Concentric Circular Planetary Targeting Reticle -->
      <div class="galaxy-planet-reticle" id="galaxyPlanetReticle" aria-hidden="true">
        <div class="reticle-radar-sweep"></div>
        <div class="reticle-outer-compass"></div>
        <div class="reticle-middle-arc cw"></div>
        <div class="reticle-middle-arc ccw"></div>
        <div class="reticle-inner-bracket"></div>
        <div class="reticle-center-crosshair"></div>
        <div class="reticle-scan-beam" id="reticleScanBeam"></div>
        <div class="reticle-coords-top" id="reticleCoordsTop">LAT: -42.86° // LONG: 174.12°</div>
        <div class="reticle-status-readout">
          <span class="reticle-tag" id="reticleStatusTag">TARGET ACQUISITION</span>
          <span class="reticle-dist" id="reticleDistLabel">RANGE: 1296M // LOCKED</span>
        </div>
      </div>

      <!-- Top Expedition Telemetry Header -->
      <div class="galaxy-hud-topbar">
        <div class="galaxy-hud-sector">
          <span class="sector-status-pip" aria-hidden="true"></span>
          <span id="galaxySectorLabel" class="sector-title">SECTOR // ALPHA • EXPEDITION ONLINE</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div id="galaxyStepIndicator" class="galaxy-step-indicator" style="display: none;" aria-label="Journey Transit Step">
            <span class="step-pip" aria-hidden="true"></span>
            <span class="step-label">STEP</span>
            <span id="galaxyStepValue" class="step-val">1/4</span>
          </div>
          <button type="button" id="galaxySkipBtn" class="galaxy-skip-btn" style="display: none;" aria-label="Skip Journey Hop">
            <span class="skip-btn-pulse" aria-hidden="true"></span>
            <span class="skip-btn-text">SKIP FLIGHT</span>
            <kbd class="skip-kbd">ESC</kbd>
          </button>
          <div class="galaxy-hud-coords">
            <span id="galaxyCoordsLabel">EXPEDITION WAYPOINT // 01 OF ${String(projects.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <!-- Planetary Assets Initial Telemetry Preloader -->
      <div id="galaxyPreloader" class="galaxy-preloader" aria-hidden="true">
        <div class="preloader-content">
          <div class="preloader-scanner-bar"></div>
          <div class="preloader-label">EXPEDITION TELEMETRY // CALIBRATING OPTICAL SENSORS</div>
          <div class="preloader-subtext">LOADING HIGH-PRECISION CELESTIAL ASSETS &bull; NASA / JPL ARCHIVES</div>
        </div>
      </div>

      <!-- Holographic Exploration Console & Spacecraft Dossier (Framing the Planet on the Left) -->
      <div class="galaxy-hud-center">
        <!-- Compact Planetary Discovery Interface (Planet remains the primary visual focal point) -->
        <div class="galaxy-hologram-console galaxy-compact-discovery" id="galaxyDossierCard" role="region" aria-label="Planetary Discovery Interface">
          
          <!-- Visor Header: Status & Coordinates -->
          <div class="discovery-header">
            <div class="discovery-telemetry-left">
              <span class="discovery-pulse-pip" aria-hidden="true"></span>
              <span class="discovery-tag" id="galaxyScanCompleteTitle">ORBIT LOCKED // REPOMENTOR AI</span>
            </div>
            <div class="discovery-telemetry-right">
              <span class="discovery-status-pill" id="signalStatusPill">PRODUCTION LIVE</span>
              <span class="discovery-index-badge" id="galaxyProjectIndex">01</span>
            </div>
          </div>

          <!-- Project Discovery Identity -->
          <div class="discovery-identity">
            <div class="discovery-category-row">
              <span class="discovery-category" id="galaxyProjectCategory">Codebase Intelligence • RAG</span>
            </div>
            <h2 class="discovery-title" id="galaxyProjectTitle">RepoMentor AI</h2>
            <p class="discovery-tagline" id="galaxyProjectTagline">Codebase Intelligence, Static AST Security Audits &amp; Grounded RAG Platform</p>
          </div>

          <!-- Project Visual Preview Frame -->
          <div class="discovery-preview-frame">
            <img id="galaxyProjectPreviewImg" class="discovery-preview-img" src="assets/repomentor.webp" alt="Project Visual Telemetry" />
            <div class="discovery-preview-overlay" aria-hidden="true">
              <span class="preview-status-tag">TELEMETRY // OPTICAL FEED</span>
            </div>
          </div>

          <!-- Verified Technology Chips (Top 4) -->
          <div class="discovery-tech-deck" id="galaxyProjectTech">
            <!-- Dynamically populated with verified technology pills -->
          </div>

          <!-- Discovery Direct Action Controls -->
          <div class="discovery-actions">
            <button type="button" id="galaxyInspectBtn" class="discovery-btn discovery-btn-primary" aria-label="Inspect Full 3-Screen Planetary Dossier">
              <span class="btn-glyph" aria-hidden="true">◈</span>
              <span class="btn-text">INSPECT DOSSIER</span>
              <span class="btn-step-count">DOSSIER // 3 SCREENS</span>
            </button>
            <button type="button" id="galaxyResumeBtn" class="discovery-btn discovery-btn-secondary" aria-label="Resume Expedition to Next Planet">
              <span class="btn-text">RESUME EXPEDITION</span>
              <span class="btn-arrow" aria-hidden="true">&darr;</span>
            </button>
          </div>

          <!-- Quick Repository & Live Comms Strip -->
          <div class="discovery-quick-strip">
            <a id="galaxyGithubLink" href="#" target="_blank" rel="noopener noreferrer" class="discovery-quick-link" aria-label="Open Source Repository on GitHub">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              <span>SOURCE REPO</span>
              <span class="quick-arrow">&nearr;</span>
            </a>
            <a id="galaxyDemoLink" href="#" target="_blank" rel="noopener noreferrer" class="discovery-quick-link" aria-label="Open Live System Demo">
              <span>LIVE DEMO</span>
              <span class="quick-arrow">&nearr;</span>
            </a>
          </div>

        </div>

        <!-- Interactive Spacecraft Computer Multi-Screen Dossier Modal -->
        <div class="galaxy-spacecraft-dossier" id="galaxySpacecraftDossier" role="dialog" aria-modal="true" aria-label="Spacecraft Mission Dossier" style="display: none;">
          <div class="dossier-console-inner">
            <div class="dossier-corner-bracket tl" aria-hidden="true"></div>
            <div class="dossier-corner-bracket tr" aria-hidden="true"></div>
            <div class="dossier-corner-bracket bl" aria-hidden="true"></div>
            <div class="dossier-corner-bracket br" aria-hidden="true"></div>
            <div class="dossier-scanlines" aria-hidden="true"></div>

            <!-- Dossier Visor Header -->
            <header class="dossier-header">
              <div class="dossier-header-left">
                <span class="dossier-signal-pip" aria-hidden="true"></span>
                <div class="dossier-header-titles">
                  <span class="dossier-sys-id" id="dossierSystemId">ORBITAL DOSSIER // SYS.PM-01</span>
                  <h3 class="dossier-project-title" id="dossierProjectTitle">RepoMentor AI</h3>
                </div>
              </div>
              <div class="dossier-header-right">
                <span class="dossier-status-nominal" id="dossierStatusNominal">STATUS: NOMINAL</span>
                <button type="button" class="dossier-close-btn" id="dossierCloseBtn" aria-label="Close Dossier Console">
                  <span>CLOSE</span>
                  <span class="dossier-close-x" aria-hidden="true">&times;</span>
                </button>
              </div>
            </header>

            <!-- Screen Stepper Navigation Tabs -->
            <nav class="dossier-stepper-nav" aria-label="Dossier Dialogue Screens">
              <button type="button" class="dossier-tab active" data-screen="1" id="dossierTab1">
                <span class="tab-index">01</span>
                <span class="tab-title">MISSION BRIEF</span>
              </button>
              <button type="button" class="dossier-tab" data-screen="2" id="dossierTab2">
                <span class="tab-index">02</span>
                <span class="tab-title">ENGINEERING REPORT</span>
              </button>
              <button type="button" class="dossier-tab" data-screen="3" id="dossierTab3">
                <span class="tab-index">03</span>
                <span class="tab-title">MISSION RESULTS</span>
              </button>
              <div class="dossier-stepper-counter" id="dossierStepCounter">01 / 03</div>
            </nav>

            <!-- Screen 1: MISSION BRIEF -->
            <div class="dossier-screen-panel active" id="dossierScreen1">
              <div class="dossier-panel-scroll">
                <div class="dossier-block">
                  <div class="dossier-block-label">// 1.1 MISSION SPECIFICATION &amp; PURPOSE</div>
                  <p class="dossier-lead-text" id="dossierBriefPurpose"></p>
                </div>
                <div class="dossier-block">
                  <div class="dossier-block-label">// 1.2 CORE PROBLEM SOLVED</div>
                  <p class="dossier-body-text" id="dossierBriefProblem"></p>
                </div>
                <div class="dossier-grid-two">
                  <div class="dossier-block">
                    <div class="dossier-block-label">// 1.3 TARGET DOMAIN &amp; AUDIENCE</div>
                    <p class="dossier-body-text" id="dossierBriefAudience"></p>
                  </div>
                  <div class="dossier-block">
                    <div class="dossier-block-label">// 1.4 CLASSIFICATION &amp; TELEMETRY</div>
                    <div class="dossier-mini-specs" id="dossierBriefTelemetry"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Screen 2: ENGINEERING REPORT -->
            <div class="dossier-screen-panel" id="dossierScreen2" style="display: none;">
              <div class="dossier-panel-scroll">
                <div class="dossier-block">
                  <div class="dossier-block-label">// 2.1 ARCHITECTURE LEAD &amp; CONTRIBUTION</div>
                  <p class="dossier-lead-text" id="dossierReportRole"></p>
                </div>
                <div class="dossier-block">
                  <div class="dossier-block-label">// 2.2 VERIFIED SYSTEM ARCHITECTURE BY LAYER</div>
                  <div class="dossier-stack-layers" id="dossierStackLayers"></div>
                </div>
                <div class="dossier-block">
                  <div class="dossier-block-label">// 2.3 DATA PIPELINE &amp; RETRIEVAL FLOW</div>
                  <ol class="dossier-flow-list" id="dossierDataFlowList"></ol>
                </div>
                <div class="dossier-block" id="dossierDecisionsBlock">
                  <div class="dossier-block-label">// 2.4 KEY ARCHITECTURAL DECISIONS</div>
                  <ul class="dossier-decisions-list" id="dossierDecisionsList"></ul>
                </div>
              </div>
            </div>

            <!-- Screen 3: MISSION RESULTS -->
            <div class="dossier-screen-panel" id="dossierScreen3" style="display: none;">
              <div class="dossier-panel-scroll">
                <div class="dossier-block">
                  <div class="dossier-block-label">// 3.1 VERIFIED CAPABILITIES &amp; ACHIEVEMENTS</div>
                  <div class="dossier-features-deck" id="dossierFeaturesDeck"></div>
                </div>
                <div class="dossier-block" id="dossierChallengesBlock">
                  <div class="dossier-block-label">// 3.2 TECHNICAL CONSTRAINTS &amp; RESOLUTIONS</div>
                  <div class="dossier-challenges-deck" id="dossierChallengesDeck"></div>
                </div>
                <div class="dossier-block">
                  <div class="dossier-block-label">// 3.3 EXTERNAL TELEMETRY &amp; VERIFIED REPOSITORIES</div>
                  <div class="dossier-external-links" id="dossierExternalLinks"></div>
                </div>
              </div>
            </div>

            <!-- Footer Controls -->
            <footer class="dossier-footer">
              <div class="dossier-nav-btns">
                <button type="button" class="dossier-footer-btn" id="dossierPrevBtn" aria-label="Previous Dialogue Screen">
                  <span>&larr; PREV</span>
                </button>
                <button type="button" class="dossier-footer-btn" id="dossierNextBtn" aria-label="Next Dialogue Screen">
                  <span>NEXT &rarr;</span>
                </button>
              </div>
              <div class="dossier-expedition-btns">
                <button type="button" class="dossier-footer-btn dossier-btn-resume" id="dossierResumeExpeditionBtn" aria-label="Resume Expedition to Next Planet">
                  <span>RESUME EXPEDITION &darr;</span>
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <!-- Bottom Navigational Stepper Bar -->
      <div class="galaxy-hud-bottombar">
        <div class="waypoint-stepper-wrap">
          <button id="galaxyPrevBtn" class="stepper-arrow" aria-label="Previous Planet">&uarr;</button>
          
          <div class="waypoint-pips-track" id="galaxyWaypointPips">
            ${projects.map((p, pIdx) => `<button class="waypoint-pip ${pIdx === 0 ? 'active' : ''}" data-index="${pIdx}" aria-label="Jump to Project ${pIdx + 1}">${p.index}</button>`).join('')}
          </div>

          <button id="galaxyNextBtn" class="stepper-arrow" aria-label="Next Planet">&darr;</button>
        </div>

        <div class="galaxy-scroll-prompt">
          <span class="prompt-glyph">&bull;</span>
          <span class="prompt-text">SCROLL TO TRAVEL THROUGH SOLAR SYSTEM</span>
        </div>
      </div>
    `;

    containerEl.appendChild(hudEl);
    initHudControls();
    updateDossier(0);

    if (typeof TypographyMotion !== 'undefined' && TypographyMotion.tokenizeElementText) {
      const h = hudEl.querySelector('#galaxyProjectTitle');
      const d = hudEl.querySelector('#galaxyProjectTagline');
      const s = hudEl.querySelector('#galaxySectorLabel');
      if (h) TypographyMotion.tokenizeElementText(h);
      if (d) TypographyMotion.tokenizeElementText(d);
      if (s) TypographyMotion.tokenizeElementText(s);
    }
  }

  function initHudControls() {
    const pips = hudEl.querySelectorAll('.waypoint-pip');
    pips.forEach((pip) => {
      pip.addEventListener('click', () => {
        const idx = parseInt(pip.getAttribute('data-index'), 10);
        jumpToProject(idx);
      });
    });

    const prevBtn = hudEl.querySelector('#galaxyPrevBtn');
    const nextBtn = hudEl.querySelector('#galaxyNextBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const nextIdx = Math.max(0, currentWaypointIndex - 1);
        jumpToProject(nextIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        if (isSpacecraftDossierOpen) closeSpacecraftDossier();
        const nextIdx = Math.min(projects.length - 1, currentWaypointIndex + 1);
        jumpToProject(nextIdx);
      });
    }

    // Direct Encounter Nav & Inspection Controls (Compact Discovery Interface)
    const inspectBtn = hudEl.querySelector('#galaxyInspectBtn');
    if (inspectBtn) {
      inspectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSpacecraftDossier(currentWaypointIndex, 1);
      });
    }

    const resumeBtn = hudEl.querySelector('#galaxyResumeBtn');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextIdx = Math.min(projects.length - 1, (activeTransit ? activeTransit.toIdx : currentWaypointIndex) + 1);
        jumpToProject(nextIdx);
      });
    }

    // Skip Transit Button Control
    const skipBtn = hudEl.querySelector('#galaxySkipBtn');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        skipTransit();
      });
    }

    let lastStepTime = 0;
    const MIN_STEP_INTERVAL_MS = 600;

    // Spacecraft Multi-Screen Dossier Event Isolation & Controls
    const dossierModal = hudEl.querySelector('#galaxySpacecraftDossier');
    if (dossierModal) {
      dossierModal.addEventListener('click', (e) => {
        // Clicking backdrop outside console inner closes the dossier
        if (!e.target.closest('.dossier-console-inner')) {
          closeSpacecraftDossier();
          return;
        }
        e.stopPropagation();
      });
      dossierModal.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.dossier-console-inner')) {
          e.stopPropagation();
        }
      });
      dossierModal.addEventListener('wheel', (e) => {
        const scrollPanel = e.target && e.target.closest ? e.target.closest('.dossier-panel-scroll') : null;
        if (scrollPanel) {
          const dy = e.deltaY;
          const atTop = scrollPanel.scrollTop <= 4;
          const atBottom = (scrollPanel.scrollTop + scrollPanel.clientHeight) >= (scrollPanel.scrollHeight - 4);
          if ((dy > 0 && !atBottom) || (dy < 0 && !atTop)) {
            return;
          }
        }
        if (Math.abs(e.deltaY) > 6) {
          closeSpacecraftDossier();
          window.scrollBy({ top: e.deltaY, behavior: 'auto' });
        }
      }, { passive: true });
      dossierModal.addEventListener('touchmove', (e) => {
        const scrollPanel = e.target && e.target.closest ? e.target.closest('.dossier-panel-scroll') : null;
        if (!scrollPanel) {
          closeSpacecraftDossier();
        }
      }, { passive: true });

      const dossierCloseBtn = dossierModal.querySelector('#dossierCloseBtn');
      if (dossierCloseBtn) {
        dossierCloseBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeSpacecraftDossier();
        });
      }

      for (let s = 1; s <= 3; s++) {
        const tabBtn = dossierModal.querySelector(`#dossierTab${s}`);
        if (tabBtn) {
          tabBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setDossierScreen(s);
          });
        }
      }

      const prevScreenBtn = dossierModal.querySelector('#dossierPrevBtn');
      if (prevScreenBtn) {
        const doPrev = (e) => {
          if (e) {
            e.stopPropagation();
            e.preventDefault();
          }
          if (currentDossierScreen > 1) {
            setDossierScreen(currentDossierScreen - 1);
          }
        };
        prevScreenBtn.addEventListener('click', doPrev);
      }

      const nextScreenBtn = dossierModal.querySelector('#dossierNextBtn');
      if (nextScreenBtn) {
        const doNext = (e) => {
          if (e) {
            e.stopPropagation();
            e.preventDefault();
          }
          if (currentDossierScreen < 3) {
            setDossierScreen(currentDossierScreen + 1);
          }
        };
        nextScreenBtn.addEventListener('click', doNext);
      }

      const resumeExpBtn = dossierModal.querySelector('#dossierResumeExpeditionBtn');
      if (resumeExpBtn) {
        resumeExpBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeSpacecraftDossier();
          const nextIdx = Math.min(projects.length - 1, currentWaypointIndex + 1);
          jumpToProject(nextIdx);
        });
      }
    }

    // Legacy Project Modal Fallback
    const modal = document.getElementById('projectDetailModal');
    if (modal) {
      const closeBtn = document.getElementById('projectModalClose');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeDetailModal);
      }
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeDetailModal();
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
          closeDetailModal();
        }
      });
    }

    // Keyboard navigation (Arrow keys & Escape)
    window.addEventListener('keydown', (e) => {
      if (!isActive) return;

      // When Spacecraft Dossier is open: Esc closes, Left/Right navigates screens 1-3
      if (isSpacecraftDossierOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          closeSpacecraftDossier();
          return;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          e.stopPropagation();
          if (currentDossierScreen > 1) {
            setDossierScreen(currentDossierScreen - 1);
          }
          return;
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          e.stopPropagation();
          if (currentDossierScreen < 3) {
            setDossierScreen(currentDossierScreen + 1);
          }
          return;
        }
      }

      const modalEl = document.getElementById('projectDetailModal');
      if (modalEl && modalEl.classList.contains('is-open')) return;
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;

      // Skip Journey Flight on Escape
      if (e.key === 'Escape' && activeTransit) {
        e.preventDefault();
        e.stopPropagation();
        skipTransit();
        return;
      }

      // Smooth Step Navigation on Arrow keys, Page Down/Up, Space
      const forwardCodes = ['ArrowRight', 'ArrowDown', 'PageDown', 'Space'];
      const backwardCodes = ['ArrowLeft', 'ArrowUp', 'PageUp'];
      const forwardKeys = ['ArrowRight', 'ArrowDown', 'PageDown', ' '];
      const backwardKeys = ['ArrowLeft', 'ArrowUp', 'PageUp'];

      const now = performance.now();
      if (forwardCodes.includes(e.code) || forwardKeys.includes(e.key)) {
        e.preventDefault();
        if (now - lastStepTime >= MIN_STEP_INTERVAL_MS) {
          lastStepTime = now;
          const nextIdx = Math.min(projects.length - 1, currentWaypointIndex + 1);
          jumpToProject(nextIdx);
        }
      } else if (backwardCodes.includes(e.code) || backwardKeys.includes(e.key)) {
        e.preventDefault();
        if (now - lastStepTime >= MIN_STEP_INTERVAL_MS) {
          lastStepTime = now;
          const prevIdx = Math.max(0, currentWaypointIndex - 1);
          jumpToProject(prevIdx);
        }
      }
    });
  }

  // ── 10B. MASTER JOURNEY CONTROLLER HANDOFF SYNC ──
  function onMasterJourneyUpdate(t) {
    if (!isActive) return;
    updateSector01VisualStaging(t);

    // Sector 01: Singularity Core & Approach (0.00 <= t <= 0.18)
    if (t <= 0.18) {
      const pHome = Math.max(0.0, Math.min(1.0, t / 0.18));
      targetHomeTransitionProgress = pHome;
      homeTransitionProgress = pHome;
      targetScrollProgress = 0.0;
      currentScrollProgress = 0.0;

      // HUD is hidden in Sector 01
      if (hudEl) {
        hudEl.style.opacity = '0';
        hudEl.style.visibility = 'hidden';
        hudEl.style.pointerEvents = 'none';
      }
    } 
    // Sector 02: Sol-7 Planetary Corridor (0.18 < t <= 0.572 -> pSol7 in [0, 0.835])
    else if (t <= 0.572) {
      targetHomeTransitionProgress = 1.0;
      homeTransitionProgress = 1.0;

      const pSol7 = Math.max(0.0, Math.min(0.835, ((t - 0.18) / (0.572 - 0.18)) * 0.835));
      targetScrollProgress = pSol7;
      currentScrollProgress = pSol7;

      // Smooth HUD entrance across 0.18 -> 0.22
      if (hudEl) {
        if (t < 0.22) {
          const hudAlpha = (t - 0.18) / 0.04;
          hudEl.style.opacity = hudAlpha.toFixed(3);
          hudEl.style.visibility = 'visible';
          hudEl.style.pointerEvents = hudAlpha > 0.4 ? 'auto' : 'none';
        } else {
          hudEl.style.opacity = '1';
          hudEl.style.visibility = 'visible';
          hudEl.style.pointerEvents = 'auto';
        }
      }
    }
    // Planet 07 -> Sky Map Continuous Flight (0.572 < t <= 0.850 -> pSol7 in [0.835, 1.0])
    else {
      targetHomeTransitionProgress = 1.0;
      homeTransitionProgress = 1.0;
      const tp = Math.max(0.0, Math.min(1.0, (t - 0.572) / (0.850 - 0.572)));
      const pMapped = 0.835 + tp * (1.0 - 0.835);
      targetScrollProgress = pMapped;
      currentScrollProgress = pMapped;
    }
  }

  // ── 11B. STAGE 4: TECHNOLOGIES & SKILLS SPATIAL DISCOVERY SCRUB ──
  let skillsScrollTriggerInstance = null;
  let currentSkillsDiscoveryProgress = 0.0;

  function updateSkillsDiscoveryProgress(progress) {
    currentSkillsDiscoveryProgress = Math.max(0.0, Math.min(1.0, progress));
    const disciplinesEl = document.getElementById('disciplines');
    if (!disciplinesEl) return;

    // Defer #disciplines visibility to Phase 4 handoffAlpha when on Sky Map; hide cleanly if scrolled away
    if (detailMode === 'skymap' && detailProgress <= 0.005) {
      disciplinesEl.style.opacity = '0';
      disciplinesEl.style.visibility = 'hidden';
      disciplinesEl.style.pointerEvents = 'none';
      disciplinesEl.classList.remove('is-interactive');
    }
  }

  function finalizeSkillsDiscovery(isSettled) {
    const disciplinesEl = document.getElementById('disciplines');
    if (!disciplinesEl) return;
    const rubric = disciplinesEl.querySelector('.section-rubric');
    const header = disciplinesEl.querySelector('.disciplines-header');
    const filterNav = disciplinesEl.querySelector('.constellation-filter-nav');
    const watermark = disciplinesEl.querySelector('.section-ghost-watermark');
    const categoryGroups = disciplinesEl.querySelectorAll('.skills-category-group');

    if (isSettled) {
      if (rubric) { rubric.style.opacity = ''; rubric.style.transform = ''; }
      if (header) { header.style.opacity = ''; header.style.transform = ''; }
      if (filterNav) { filterNav.style.opacity = ''; filterNav.style.transform = ''; }
      if (watermark) { watermark.style.opacity = ''; }
      categoryGroups.forEach(g => {
        g.style.opacity = '';
        g.style.transform = '';
        g.style.pointerEvents = '';
      });
    }
  }

  function updateContactFlightProgress(masterT) {
    const t = Math.max(0.0, Math.min(1.0, typeof masterT === 'number' ? masterT : 0.0));
    const dispatchEl = document.getElementById('dispatch');
    if (!dispatchEl) return;

    if (t >= 0.935) {
      dispatchEl.style.opacity = '1';
      dispatchEl.style.visibility = 'visible';
      dispatchEl.style.pointerEvents = (t >= 0.98) ? 'auto' : 'none';
      dispatchEl.classList.add('is-interactive');
      if (!dispatchEl.classList.contains('is-projecting')) {
        dispatchEl.classList.add('is-projecting');
      }

      const stageEl = document.getElementById('luminousIdentityStage') || document.getElementById('holoEmitterStage');
      if (window.LuminousIdentityStage) {
        if (typeof window.LuminousIdentityStage.init === 'function') {
          window.LuminousIdentityStage.init(stageEl);
        }
        if (typeof window.LuminousIdentityStage.updateFlightProgress === 'function') {
          window.LuminousIdentityStage.updateFlightProgress(t);
        }
      } else if (window.HologramProjectorStage) {
        if (typeof window.HologramProjectorStage.init === 'function') {
          window.HologramProjectorStage.init(stageEl);
        }
        if (typeof window.HologramProjectorStage.updateFlightProgress === 'function') {
          window.HologramProjectorStage.updateFlightProgress(t);
        }
      }

      // Contact Page Cards (Right-hand side: contact info + form)
      // Spec: Fades in smoothly between t = 0.97 and t = 1.00 with a subtle slide from the right (15-20 px)
      const formWrapper = dispatchEl.querySelector('.dispatch-col-right') || dispatchEl.querySelector('.dispatch-form-wrapper');
      const layout = dispatchEl.querySelector('.dispatch-layout');
      const rubric = dispatchEl.querySelector('.section-rubric');
      const header = dispatchEl.querySelector('.dispatch-header');

      const cardAlpha = Math.min(1.0, Math.max(0.0, (t - 0.97) / 0.03));
      const cardSlide = (1.0 - cardAlpha) * 18.0;

      if (formWrapper) {
        formWrapper.style.opacity = cardAlpha.toFixed(3);
        formWrapper.style.transform = `translateX(${cardSlide.toFixed(1)}px)`;
      }
      if (rubric) rubric.style.opacity = cardAlpha.toFixed(3);
      if (header) header.style.opacity = cardAlpha.toFixed(3);
      if (layout) {
        layout.style.opacity = '1';
      }
    } else {
      if (window.LuminousIdentityStage && typeof window.LuminousIdentityStage.updateFlightProgress === 'function') {
        window.LuminousIdentityStage.updateFlightProgress(t);
      } else if (window.HologramProjectorStage && typeof window.HologramProjectorStage.updateFlightProgress === 'function') {
        window.HologramProjectorStage.updateFlightProgress(t);
      }
      dispatchEl.style.opacity = '0';
      dispatchEl.style.visibility = 'hidden';
      dispatchEl.style.pointerEvents = 'none';
      dispatchEl.classList.remove('is-interactive');
      dispatchEl.classList.remove('is-projecting');
    }
  }

  function updateBeaconNexusProgress(progress) {
    const p = Math.max(0.0, Math.min(1.0, typeof progress === 'number' ? progress : 0.0));
    updateContactFlightProgress(0.93 + p * 0.07);
  }

  /**
   * Real-Time Telemetry Metrics for Leg 3 Flight Verification Table
   */
  function getLeg3Metrics(tInput) {
    const t = (typeof tInput === 'number')
      ? tInput
      : (window.MasterJourneyController ? window.MasterJourneyController.getProgress() : 1.0);
    
    // Ensure all stage, shader, and projector states are synchronously evaluated at t
    updateContactFlightProgress(t);
    const camData = evaluateContactFlightCamera(t);
    const starCount = 1410;

    let projMetrics = {
      projector: (t < 0.88) ? 'off' : (t < 0.92) ? 'beacon' : (t < 0.94) ? 'lens glow' : 'full',
      beamHeightPct: (t < 0.94) ? 0 : Math.round(Math.min(1.0, (t - 0.94) / 0.02) * 100),
      figureAlpha: (t < 0.96) ? 0.0 : Number(Math.min(1.0, (t - 0.96) / 0.02).toFixed(2)),
      nameRing: (t < 0.98) ? 'off' : 'active (4.0 rpm)'
    };
    if (window.LuminousIdentityStage && typeof window.LuminousIdentityStage.getMetrics === 'function') {
      const pm = window.LuminousIdentityStage.getMetrics();
      if (pm) projMetrics = Object.assign(projMetrics, pm);
    } else if (window.HologramProjectorStage && typeof window.HologramProjectorStage.getMetrics === 'function') {
      const pm = window.HologramProjectorStage.getMetrics();
      if (pm) projMetrics = Object.assign(projMetrics, pm);
    }

    const formOpacity = (t < 0.97) ? 0.0 : Number(Math.min(1.0, (t - 0.97) / 0.03).toFixed(2));

    let pitch = 0, yaw = 0, roll = 0;
    if (camData && camData.camPos && camData.lookTarget) {
      const dir = new THREE.Vector3().subVectors(camData.lookTarget, camData.camPos).normalize();
      pitch = Number((-Math.asin(dir.y) * 180 / Math.PI).toFixed(1));
      yaw = Number((Math.atan2(dir.x, dir.z) * 180 / Math.PI).toFixed(1));
      roll = Number(((camData.roll || 0) * 180 / Math.PI).toFixed(1));
    }

    return {
      t: Number(t.toFixed(2)),
      camPos: camData ? `(${Math.round(camData.camPos.x)}, ${Math.round(camData.camPos.y)}, ${Math.round(camData.camPos.z)})` : '(0,0,0)',
      camRot: `(${pitch}°, ${yaw}°, ${roll}°)`,
      starCount: starCount,
      projector: projMetrics.projector,
      beamHeightPct: `${projMetrics.beamHeightPct}%`,
      figureAlpha: projMetrics.figureAlpha.toFixed(2),
      nameRing: projMetrics.nameRing,
      formOpacity: formOpacity.toFixed(2)
    };
  }

  // ── 11. SCROLLTRIGGER PINNING & JOURNEY TIMELINE ──
  function initScrollTrigger() {
    // If MasterJourneyController is running as the authoritative continuous galaxy spine,
    // bypass competing ScrollTrigger instances to prevent duplicate pinning and conflicts
    if (window.MasterJourneyController) {
      console.info('[GalaxyJourney] MasterJourneyController active as authoritative spine. Bypassing legacy ScrollTriggers.');
      return;
    }

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[GalaxyJourney] GSAP or ScrollTrigger not detected. Running standard RAF mode.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (isReducedMotion) {
      return;
    }

    const triggerEl = document.getElementById('works') || containerEl;
    const isMobile = (containerEl.clientWidth || window.innerWidth) <= 768;
    const scrollDist = isMobile ? 11500 : 16500;

    // Dual-stage continuous flight triggers:
    // Stage A: Home-to-Works scrub (0.0 -> 1.0) turning spacecraft toward solar system
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      if (homeScrollTriggerInstance) {
        homeScrollTriggerInstance.kill(true);
      }
      homeScrollTriggerInstance = ScrollTrigger.create({
        id: "homeTransitionScrub",
        trigger: heroEl,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (!isActive || window.MasterJourneyController) return;
          targetHomeTransitionProgress = Math.max(0.0, Math.min(1.0, self.progress));
        },
        onLeave: () => {
          if (window.MasterJourneyController) return;
          targetHomeTransitionProgress = 1.0;
        },
        onEnterBack: () => {
          if (!isActive || window.MasterJourneyController) return;
          targetHomeTransitionProgress = Math.max(0.0, Math.min(1.0, homeScrollTriggerInstance ? homeScrollTriggerInstance.progress : 1.0));
        }
      });
    }

    // Stage B: Projects planetary exploration journey (RepoMentor AI through Spotify)
    scrollTriggerInstance = ScrollTrigger.create({
      id: "galaxyJourneyPin",
      trigger: triggerEl,
      start: "top top",
      end: "+=" + scrollDist,
      pin: triggerEl,
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) => {
        if (!isActive || window.MasterJourneyController) return;
        targetScrollProgress = Math.max(0.0, Math.min(1.0, self.progress));
        if (self.progress > 0.001 && self.progress < 0.999) {
          if (canvasEl) {
            canvasEl.style.opacity = '1';
            canvasEl.style.visibility = 'visible';
          }
          if (hudEl) {
            hudEl.classList.add('is-visible');
            hudEl.style.opacity = '1';
            hudEl.style.visibility = 'visible';
          }
        }
      },
      onEnter: () => {
        if (!isActive) return;
        if (canvasEl) {
          canvasEl.style.opacity = '1';
          canvasEl.style.visibility = 'visible';
        }
        if (hudEl) {
          hudEl.classList.add('is-visible');
          hudEl.style.opacity = '1';
          hudEl.style.visibility = 'visible';
          hudEl.style.pointerEvents = 'none';
        }
      },
      onLeave: () => {
        if (hudEl) {
          hudEl.classList.remove('is-visible');
          hudEl.style.opacity = '0';
          hudEl.style.visibility = 'hidden';
          hudEl.style.pointerEvents = 'none';
        }
      },
      onEnterBack: () => {
        if (!isActive) return;
        if (canvasEl) {
          canvasEl.style.opacity = '1';
          canvasEl.style.visibility = 'visible';
        }
        if (hudEl) {
          hudEl.classList.add('is-visible');
          hudEl.style.opacity = '1';
          hudEl.style.visibility = 'visible';
          hudEl.style.pointerEvents = 'none';
        }
      },
      onLeaveBack: () => {
        // Keep canvasEl persistently visible for continuous deep space background
        if (hudEl) {
          hudEl.classList.remove('is-visible');
          hudEl.style.opacity = '0';
          hudEl.style.visibility = 'hidden';
          hudEl.style.pointerEvents = 'none';
        }
      }
    });


  function updateSkillsDiscoveryFromScroll() {
    if (!isActive) return;
    const disciplinesEl = document.getElementById('disciplines');
    if (!disciplinesEl) return;
    const rect = disciplinesEl.getBoundingClientRect();
    const winH = window.innerHeight || 900;
    
    // Progress starts when top of disciplines enters viewport (rect.top <= winH * 0.95)
    // and settles when rect.top <= winH * 0.25
    const startY = winH * 0.95;
    const endY = winH * 0.25;
    if (rect.top >= startY) {
      updateSkillsDiscoveryProgress(0.0);
    } else if (rect.top <= endY) {
      updateSkillsDiscoveryProgress(1.0);
    } else {
      const frac = (startY - rect.top) / (startY - endY);
      updateSkillsDiscoveryProgress(frac);
    }
  }

    // Stage C: Technologies & Skills spatial discovery scrub (Stage 4)
    const disciplinesEl = document.getElementById('disciplines');
    if (disciplinesEl) {
      if (skillsScrollTriggerInstance) {
        skillsScrollTriggerInstance.kill(true);
      }
      skillsScrollTriggerInstance = ScrollTrigger.create({
        id: "skillsDiscoveryScrub",
        trigger: disciplinesEl,
        start: "top 95%",
        end: "top 25%",
        scrub: true,
        onUpdate: (self) => {
          if (!isActive) return;
          updateSkillsDiscoveryProgress(self.progress);
        },
        onLeave: () => {
          finalizeSkillsDiscovery(true);
        },
        onLeaveBack: () => {
          if (!isActive) return;
          updateSkillsDiscoveryProgress(0.0);
        }
      });
    }

    // Continuous scroll listener for high-responsiveness home-to-works transition scrub & skills discovery
    let isJourneyScrollTicking = false;
    function onJourneyScroll() {
      if (!isJourneyScrollTicking) {
        isJourneyScrollTicking = true;
        requestAnimationFrame(() => {
          updateHomeTransitionFromScroll();
          updateSkillsDiscoveryFromScroll();
          isJourneyScrollTicking = false;
        });
      }
    }
    window.addEventListener('scroll', onJourneyScroll, { passive: true });
    updateHomeTransitionFromScroll();
    updateSkillsDiscoveryFromScroll();

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  function updateArrivalState(progress) {
    if (!hudEl) return;
    const clampedT = Math.max(0.0, Math.min(1.0, progress));

    let activeIdx = 0;
    let encounterAlpha = 1.0;
    let isDwell = true;
    let nextIdx = 1;
    let transitU = 0.0;

    if (typeof PORTFOLIO_PROJECT_DETAILS !== 'undefined' && PORTFOLIO_PROJECT_DETAILS.getEncounterAtProgress) {
      const enc = PORTFOLIO_PROJECT_DETAILS.getEncounterAtProgress(clampedT);
      activeIdx = enc.activeIndex;
      encounterAlpha = enc.encounterAlpha;
      isDwell = enc.isDwell;
      nextIdx = enc.nextIndex;
      transitU = enc.transitU || 0.0;
    } else {
      const numSegs = Math.max(1, projects.length - 1);
      const scaledP = clampedT * numSegs;
      activeIdx = Math.max(0, Math.min(projects.length - 1, Math.round(scaledP)));
      const distToActive = Math.abs(scaledP - activeIdx);
      if (distToActive <= 0.14) {
        encounterAlpha = 1.0;
      } else if (distToActive < 0.28) {
        const easeU = (distToActive - 0.14) / (0.28 - 0.14);
        encounterAlpha = 0.5 * (1 + Math.cos(Math.PI * easeU));
      } else {
        encounterAlpha = 0;
      }
      isDwell = encounterAlpha >= 0.95;
      nextIdx = Math.min(projects.length - 1, activeIdx + 1);
    }

    currentEncounterAlpha = encounterAlpha;

    if (activeIdx !== currentWaypointIndex) {
      updateDossier(activeIdx);
    }
    // Auto-close spacecraft multi-screen dossier upon departure to prevent scroll trapping
    if (isSpacecraftDossierOpen && (!isDwell && encounterAlpha < 0.85)) {
      closeSpacecraftDossier();
    }

    // Explicit 5-Phase Encounter State Machine:
    // 1: APPROACHING  (entering encounter zone, alpha in (0.12, 0.40))
    // 2: ARRIVED      (at encounter threshold, alpha in [0.40, 0.70))
    // 3: SCANNING     (scanning surface, alpha in [0.70, 0.90))
    // 4: INFORMATION_REVEALED (docked at dwell plateau, isDwell || alpha >= 0.90)
    // 5: TRANSIT / DEPARTING (interplanetary void or departure, alpha <= 0.12)
    let state = 'TRANSIT';
    let meterBlocks = 0;
    let meterPct = '0%';
    let statusChevrons = 'CRUISING >>>>>';
    let statusState = 'WARP TRANSIT';
    let scanTitleText = 'WARP TRANSIT // SENSORS CALIBRATING';
    let reticleTagText = 'SEARCHING // WARP TRANSIT';

    if (isDwell || encounterAlpha >= 0.90) {
      state = 'INFORMATION_REVEALED';
      meterBlocks = 10;
      meterPct = '100%';
      statusChevrons = 'DECRYPTED >>>>>';
      statusState = 'SYSTEM LOCKED';
      scanTitleText = `SCAN COMPLETE // ${projects[activeIdx].title.toUpperCase()}`;
      reticleTagText = 'TARGET LOCKED // TELEMETRY SYNCED';
    } else if (encounterAlpha >= 0.70) {
      state = 'SCANNING';
      meterBlocks = 8;
      meterPct = '85%';
      statusChevrons = 'SCANNING >>>>>';
      statusState = 'SPECTROMETRY';
      scanTitleText = `SCANNING PLANETARY SURFACE...`;
      reticleTagText = 'SCANNING SURFACE // TELEMETRY SYNC';
    } else if (encounterAlpha >= 0.40) {
      state = 'ARRIVED';
      meterBlocks = 6;
      meterPct = '60%';
      statusChevrons = 'INSERTION >>>>>';
      statusState = 'ORBIT LOCKED';
      scanTitleText = `ORBITAL INSERTION CONFIRMED // SECTOR ${projects[activeIdx].index}`;
      reticleTagText = 'ORBITAL INSERTION // RANGE LOCKED';
    } else if (encounterAlpha > 0.12) {
      state = 'APPROACHING';
      meterBlocks = 3;
      meterPct = '30%';
      statusChevrons = 'ACQUIRING >>>>>';
      statusState = 'ACQUISITION';
      scanTitleText = `APPROACHING TARGET // SECTOR ${projects[activeIdx].index}`;
      reticleTagText = 'TARGET ACQUIRED // APPROACHING';
    } else {
      state = 'TRANSIT';
      meterBlocks = 0;
      meterPct = '0%';
      statusChevrons = 'CRUISING >>>>>';
      statusState = 'WARP CRUISE';
      const nextTitle = projects[nextIdx] ? (projects[nextIdx].title || '').toUpperCase() : 'NEXT SECTOR';
      scanTitleText = `WARP TRANSIT // APPROACHING ${nextTitle}`;
      reticleTagText = 'SEARCHING // WARP TRANSIT';
    }

    // Departure & Deep Space Telemetry Modulation (Stages 1, 2, 3)
    let departureProgress = 0.0;
    if (typeof PORTFOLIO_PROJECT_DETAILS !== 'undefined' && PORTFOLIO_PROJECT_DETAILS.getEncounterAtProgress) {
      const enc = PORTFOLIO_PROJECT_DETAILS.getEncounterAtProgress(clampedT);
      if (enc && enc.isDeparture) {
        departureProgress = enc.departureU || 0.0;
        if (departureProgress < 0.30) {
          state = 'TRANSIT';
          coordsLabelText = 'EXPEDITION COMPLETE // DEPARTING SOLAR SYSTEM';
          sectorLabelText = 'SOLAR SYSTEM BOUNDARY // OUTBOUND FLIGHT';
          promptTextContent = 'SCROLL TO TRAVEL INTO DEEP SPACE';
        } else if (departureProgress < 0.75) {
          state = 'TRANSIT';
          coordsLabelText = 'WARP SPEED // RAPID ZOOM OUT';
          sectorLabelText = 'HIGH-SPEED INTERSTELLAR FLIGHT';
          promptTextContent = 'ACCELERATING INTO THE COSMIC VOID';
        } else {
          state = 'TRANSIT';
          coordsLabelText = 'DEEP SPACE VOID // ENTERING ASTROMETRIC INVENTORY';
          sectorLabelText = 'SENSORS ACQUIRING TECHNOLOGY SYSTEMS';
          promptTextContent = 'SCROLL TO DISCOVER TECHNOLOGIES';
        }
      }
    }

    // Holographic exploration console lifecycle
    const dossierCard = hudEl.querySelector('#galaxyDossierCard');
    if (dossierCard) {
      if (state === 'TRANSIT') {
        dossierCard.style.opacity = '0';
        dossierCard.style.pointerEvents = 'none';
        dossierCard.style.transform = 'translateY(24px) scale(0.96)';
        dossierCard.classList.remove('is-arrival-active');
      } else {
        const cardOpacity = Math.max(0, Math.min(1, (encounterAlpha - 0.12) / 0.78));
        const liftY = (1 - encounterAlpha) * 20;

        if (isSpacecraftDossierOpen) {
          // When spacecraft dossier modal is open, discovery card is cleanly hidden
          dossierCard.style.opacity = '0';
          dossierCard.style.pointerEvents = 'none';
        } else {
          dossierCard.style.opacity = (cardOpacity * (state === 'INFORMATION_REVEALED' ? 1.0 : 0.85)).toFixed(3);
          dossierCard.style.transform = `translateY(${liftY.toFixed(1)}px) scale(${(0.98 + 0.02 * encounterAlpha).toFixed(3)})`;
          
          // Make interactive the moment it appears (whether approaching or coming back)
          const canInteract = (cardOpacity > 0.05);
          dossierCard.style.pointerEvents = canInteract ? 'auto' : 'none';

          if (canInteract) {
            dossierCard.classList.add('is-arrival-active');
          } else {
            dossierCard.classList.remove('is-arrival-active');
          }
        }
      }
    }

    // Reticle animation and locking
    const reticle = hudEl.querySelector('#galaxyPlanetReticle');
    if (reticle) {
      if (state === 'TRANSIT') {
        reticle.style.opacity = '0';
        reticle.classList.remove('is-scanning', 'is-locked');
      } else {
        const retScale = 1.0 + (1 - encounterAlpha) * 0.22;
        reticle.style.opacity = Math.min(1, encounterAlpha * 1.25).toFixed(3);
        reticle.style.transform = `translate(-50%, -50%) scale(${retScale.toFixed(2)})`;

        if (state === 'SCANNING') {
          reticle.classList.add('is-scanning');
          reticle.classList.remove('is-locked');
        } else if (state === 'INFORMATION_REVEALED' || state === 'ARRIVED') {
          reticle.classList.add('is-locked');
          reticle.classList.remove('is-scanning');
        } else {
          reticle.classList.remove('is-scanning', 'is-locked');
        }
      }
    }

    // Dynamic reticle screen alignment relative to 3D planet
    updateReticleScreenPosition(activeIdx);

    // Update Cockpit Frame scanning state (Persistent HUD + Inner HUD)
    const cockpitFrame = hudEl.querySelector('.galaxy-cockpit-frame');
    const mainCockpit = document.getElementById('spaceCockpitHud');
    const isScanning = (state === 'SCANNING' || state === 'APPROACHING');
    if (cockpitFrame) {
      cockpitFrame.classList.toggle('is-scanning', isScanning);
    }
    if (mainCockpit) {
      mainCockpit.classList.toggle('is-scanning', isScanning);
    }
    const currentProj = (projects && projects[activeIdx]) ? projects[activeIdx] : null;
    if (typeof SpaceCockpitController !== 'undefined' && SpaceCockpitController.updatePlanetaryTelemetry) {
      SpaceCockpitController.updatePlanetaryTelemetry(activeIdx, currentProj);
    }

    // Update Segmented Scanning Meter Blocks
    const segBlocks = hudEl.querySelectorAll('.hud-segmented-meter .seg-block');
    segBlocks.forEach((block, bIdx) => {
      if (bIdx < meterBlocks) {
        block.classList.add('active');
      } else {
        block.classList.remove('active');
      }
    });

    const meterPctEl = hudEl.querySelector('#hudMeterPercent');
    if (meterPctEl) meterPctEl.textContent = meterPct;

    const statusStateEl = hudEl.querySelector('#hudStatusStateLabel');
    if (statusStateEl) statusStateEl.textContent = statusState;

    const coordsLabel = hudEl.querySelector('#galaxyCoordsLabel');
    const sectorLabel = hudEl.querySelector('#galaxySectorLabel');
    const promptText = hudEl.querySelector('.prompt-text');
    const reticleStatusTag = hudEl.querySelector('#reticleStatusTag');
    const scanTitle = hudEl.querySelector('#galaxyScanCompleteTitle');

    if (scanTitle) scanTitle.textContent = scanTitleText;
    if (reticleStatusTag) reticleStatusTag.textContent = reticleTagText;

    if (departureProgress > 0.001) {
      if (coordsLabel) coordsLabel.textContent = coordsLabelText;
      if (sectorLabel) sectorLabel.textContent = sectorLabelText;
      if (promptText) promptText.textContent = promptTextContent;
    } else if (state === 'INFORMATION_REVEALED') {
      if (coordsLabel) coordsLabel.textContent = `EXPEDITION WAYPOINT // ${projects[activeIdx].index} OF ${String(projects.length).padStart(2, '0')}`;
      if (sectorLabel) sectorLabel.textContent = projects[activeIdx].sector;
      if (promptText) promptText.textContent = `SCROLL TO TRAVEL OR USE NAV CONTROLS`;
    } else if (state === 'APPROACHING' || state === 'ARRIVED' || state === 'SCANNING') {
      if (coordsLabel) coordsLabel.textContent = `APPROACHING // SECTOR ${projects[activeIdx].index}`;
      if (sectorLabel) sectorLabel.textContent = `DECELERATION // ${projects[activeIdx].title.toUpperCase()}`;
      if (promptText) promptText.textContent = `DECELERATING INTO ORBITAL POSITION`;
    } else {
      const nextNum = projects[nextIdx] ? projects[nextIdx].index : '01';
      if (coordsLabel) coordsLabel.textContent = `TRANSIT // INTERPLANETARY TRAVEL`;
      if (sectorLabel) sectorLabel.textContent = `WARP TRANSIT // DESTINATION SECTOR ${nextNum}`;
      if (promptText) promptText.textContent = `TRANSIT IN PROGRESS // DESTINATION SECTOR ${nextNum}`;
    }
  }

  function returnToHome(smooth = true) {
    closeSpacecraftDossier();
    currentWaypointIndex = 0;
    targetScrollProgress = 0;
    currentScrollProgress = 0;

    if (camera) {
      const pose = evaluateJourneyCamera(0);
      camera.position.copy(pose.camPos);
      camera.lookAt(pose.lookTarget);
    }

    if (hudEl) {
      hudEl.style.opacity = '0';
      hudEl.style.pointerEvents = 'none';
      const dossierCard = hudEl.querySelector('#galaxyDossierCard');
      if (dossierCard) {
        dossierCard.style.opacity = '0';
        dossierCard.style.pointerEvents = 'none';
      }
    }

    const st = scrollTriggerInstance || (typeof ScrollTrigger !== 'undefined' ? ScrollTrigger.getById('galaxyJourneyPin') : null);
    if (st && typeof st.scroll === 'function') {
      st.scroll(0);
    }

    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.update();
    }

    if (window.SpaceBlackHoleHero3D) {
      if (typeof window.SpaceBlackHoleHero3D.reigniteBlackHole === 'function') {
        window.SpaceBlackHoleHero3D.reigniteBlackHole();
      }
      if (typeof window.SpaceBlackHoleHero3D.resume === 'function') {
        window.SpaceBlackHoleHero3D.resume();
      }
    }
  }

  // ── CINEMATIC INTERPLANETARY JOURNEY ENGINE (Task 2: Scroll-Controlled Journey) ──
  const STEPS_PER_LEG = 4;
  let currentLegIndex = 0; // Leg index: 0 (P0 -> P1), 1 (P1 -> P2), ... 5 (P5 -> P6)
  let currentLegStep = 0;  // 0: in orbit at currentLegIndex; 1..STEPS_PER_LEG-1: transit checkpoints; STEPS_PER_LEG: arrival at currentLegIndex + 1
  let activeStepTransition = null;
  let activeTransit = null;
  let arrivalCardTimer = null;
  let dwellTimestamp = performance.now();

  function getWaypointProgress(idx) {
    const numSegs = Math.max(1, projects.length - 1);
    const p = projects[idx];
    let splineProgress = (idx / numSegs);
    if (p && p.encounter && p.encounter.dwellPlateau) {
      splineProgress = (p.encounter.dwellPlateau[0] + p.encounter.dwellPlateau[1]) / 2;
    }
    return Math.max(0, Math.min(1, splineProgress));
  }

  function getSplineProgressForLegStep(legIdx, step) {
    const pStart = getWaypointProgress(legIdx);
    const pEnd = getWaypointProgress(legIdx + 1);
    const frac = Math.max(0, Math.min(1, step / STEPS_PER_LEG));
    return pStart + (pEnd - pStart) * frac;
  }

  function updateStepIndicatorUI(step) {
    if (!hudEl) return;
    const indicator = hudEl.querySelector('#galaxyStepIndicator');
    const stepVal = hudEl.querySelector('#galaxyStepValue');
    const promptText = hudEl.querySelector('.galaxy-scroll-prompt .prompt-text');

    if (step > 0 && step < STEPS_PER_LEG) {
      if (indicator) indicator.style.display = 'inline-flex';
      if (stepVal) stepVal.textContent = `${step}/${STEPS_PER_LEG}`;
      if (promptText) {
        promptText.textContent = `TRANSIT STEP ${step}/${STEPS_PER_LEG} // SCROLL TO ADVANCE`;
      }
      const skipBtn = hudEl.querySelector('#galaxySkipBtn');
      if (skipBtn) skipBtn.style.display = 'inline-flex';
    } else {
      if (indicator) indicator.style.display = 'none';
      if (promptText) {
        promptText.textContent = 'SCROLL TO TRAVEL THROUGH SOLAR SYSTEM';
      }
      const skipBtn = hudEl.querySelector('#galaxySkipBtn');
      if (skipBtn) skipBtn.style.display = 'none';
    }
  }

  // 3-Phase Continuous C1 Trajectory Profile (Retained for Direct Pip Jumps)
  function evaluateTransitProfile(u) {
    const t1 = 0.15;
    const t2 = 0.70;
    const Vc = 1.0 / ((2 * t1 / Math.PI) + (t2 - t1) + (2 * (1.0 - t2) / Math.PI)); // ~1.195488
    const s1 = Vc * (2 * t1 / Math.PI);
    const s2 = s1 + Vc * (t2 - t1);

    if (u <= t1) {
      return Vc * (2 * t1 / Math.PI) * (1.0 - Math.cos(0.5 * Math.PI * (u / t1)));
    } else if (u <= t2) {
      return s1 + Vc * (u - t1);
    } else {
      const tau = (u - t2) / (1.0 - t2);
      return s2 + Vc * (2 * (1.0 - t2) / Math.PI) * Math.sin(0.5 * Math.PI * tau);
    }
  }

  function preloadPlanetTextures(idx) {
    const pTarget = projects[idx];
    const pNext = projects[(idx + 1) % projects.length];
    [pTarget, pNext].forEach(p => {
      if (p && p.textures) {
        Object.values(p.textures).forEach(url => {
          if (url && typeof url === 'string') getOrLoadTexture(url);
        });
      }
    });
  }

  function stepJourney(direction, instant = false) {
    if (isSpacecraftDossierOpen) {
      closeSpacecraftDossier();
    }
    const nextIdx = direction > 0
      ? Math.min(projects.length - 1, currentWaypointIndex + 1)
      : Math.max(0, currentWaypointIndex - 1);
    jumpToProject(nextIdx, instant);
  }

  function skipTransit() {
    if (activeTransit) {
      const destIdx = activeTransit.toIdx;
      activeTransit = null;
      jumpToProject(destIdx, true);
    }
  }

  function onTransitArrival(idx) {
    currentWaypointIndex = idx;
    currentLegIndex = Math.min(projects.length - 2, idx);
    currentLegStep = 0;
    dwellTimestamp = performance.now();
    if (camera) {
      camera.fov = 45.0;
      camera.updateProjectionMatrix();
    }
    const skipBtn = hudEl ? hudEl.querySelector('#galaxySkipBtn') : null;
    if (skipBtn) skipBtn.style.display = 'none';

    updateDossier(idx);
    updateArrivalState(currentScrollProgress);
    updateStepIndicatorUI(0);

    const card = hudEl ? hudEl.querySelector('#galaxyDossierCard') : null;
    if (card) {
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
      card.style.transform = 'translateY(0) scale(1)';
      card.classList.add('is-arrival-active');
    }
  }

  function syncScrollToProgress(splineProgress) {
    const st = scrollTriggerInstance || (typeof ScrollTrigger !== 'undefined' ? ScrollTrigger.getById('galaxyJourneyPin') : null);
    const worksEl = document.getElementById('works');
    const minStart = worksEl ? worksEl.offsetTop : 1080;
    const startY = (st && typeof st.start === 'number' && st.start >= minStart) ? st.start : minStart;
    const isMobileViewport = (containerEl?.clientWidth || window.innerWidth) <= 768;
    const defaultDist = isMobileViewport ? 8500 : 10500;
    const totalScroll = (st && typeof st.end === 'number' && st.end > startY) ? (st.end - startY) : defaultDist;
    const targetScroll = startY + (splineProgress * totalScroll);
    window.scrollTo({ top: targetScroll, behavior: 'auto' });
  }

  function jumpToProject(idx, instant = false) {
    const targetIdx = Math.max(0, Math.min(projects.length - 1, idx));
    const targetProgress = getWaypointProgress(targetIdx);

    currentWaypointIndex = targetIdx;
    currentLegIndex = Math.min(projects.length - 2, targetIdx);
    currentLegStep = 0;
    updateDossier(targetIdx);
    updateStepIndicatorUI(0);

    if (arrivalCardTimer) clearTimeout(arrivalCardTimer);

    if (hudEl) {
      const pips = hudEl.querySelectorAll('.waypoint-pip');
      pips.forEach((pip, pIdx) => {
        if (pIdx === targetIdx) pip.classList.add('active');
        else pip.classList.remove('active');
      });
      hudEl.style.opacity = '1';
      hudEl.style.visibility = 'visible';
    }
    if (canvasEl) {
      canvasEl.style.opacity = '1';
      canvasEl.style.visibility = 'visible';
    }

    preloadPlanetTextures(targetIdx);

    // Master Journey Controller Authority Integration
    if (window.MasterJourneyController) {
      const masterT = 0.18 + (targetProgress / 0.835) * (0.572 - 0.18);
      targetHomeTransitionProgress = 1.0;
      homeTransitionProgress = 1.0;
      if (instant || isReducedMotion) {
        window.MasterJourneyController.jumpTo(masterT);
        currentScrollProgress = targetProgress;
        targetScrollProgress = targetProgress;
        onTransitArrival(targetIdx);
      } else {
        window.MasterJourneyController.setTargetProgress(masterT, true);
      }
      return;
    }

    const st = scrollTriggerInstance || (typeof ScrollTrigger !== 'undefined' ? ScrollTrigger.getById('galaxyJourneyPin') : null);
    if (st && typeof st.start === 'number' && typeof st.end === 'number' && st.end > st.start) {
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      if (instant || isReducedMotion) {
        window.scrollTo({ top: targetScroll, behavior: 'auto' });
        currentScrollProgress = targetProgress;
        targetScrollProgress = targetProgress;
        onTransitArrival(targetIdx);
      } else {
        targetScrollProgress = targetProgress;
        const scrollObj = { y: window.scrollY };
        if (typeof gsap !== 'undefined') {
          gsap.to(scrollObj, {
            y: targetScroll,
            duration: 1.4,
            ease: "power2.inOut",
            overwrite: "auto",
            onUpdate: () => {
              window.scrollTo({ top: scrollObj.y, behavior: 'auto' });
            },
            onComplete: () => {
              onTransitArrival(targetIdx);
            }
          });
        } else {
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          onTransitArrival(targetIdx);
        }
      }
    } else {
      targetScrollProgress = targetProgress;
      if (instant || isReducedMotion) {
        currentScrollProgress = targetProgress;
        onTransitArrival(targetIdx);
      } else {
        const startProg = currentScrollProgress;
        activeTransit = {
          fromIdx: currentWaypointIndex,
          toIdx: targetIdx,
          startProgress: startProg,
          endProgress: targetProgress,
          duration: 2.2,
          elapsed: 0.0
        };
      }
    }
  }

  // ── 12. HOLOGRAPHIC PLANETARY DISCOVERY & SPACECRAFT DOSSIER (100% Verified Data) ──
  let isSpacecraftDossierOpen = false;
  let currentDossierScreen = 1;

  function updateDossier(idx) {
    const p = projects[idx];
    if (!p || !hudEl) return;

    currentWaypointIndex = idx;
    const accentColor = p.color || '#F59E0B';
    const accentRgb = p.accentRgb || [245, 158, 11];

    // Set accent color CSS variables on discovery console and reticle
    const dossierCard = hudEl.querySelector('#galaxyDossierCard');
    if (dossierCard) {
      dossierCard.style.setProperty('--planet-accent', accentColor);
      dossierCard.style.setProperty('--planet-accent-rgb', accentRgb.join(', '));

    }

    const reticle = hudEl.querySelector('#galaxyPlanetReticle');
    if (reticle) {
      reticle.style.setProperty('--planet-accent', accentColor);
      reticle.style.setProperty('--planet-accent-rgb', accentRgb.join(', '));
      const mProg = (window.MasterJourneyController && typeof window.MasterJourneyController.getProgress === 'function')
        ? window.MasterJourneyController.getProgress()
        : 0.0;
      if (mProg <= 0.18) {
        reticle.style.display = 'none';
        reticle.style.opacity = '0';
        reticle.classList.remove('is-sector02-active', 'is-scanning', 'is-locked');
      }
    }

    // Top Header & Waypoint Labels
    const sectorLabel = hudEl.querySelector('#galaxySectorLabel');
    const coordsLabel = hudEl.querySelector('#galaxyCoordsLabel');
    const scanTitle = hudEl.querySelector('#galaxyScanCompleteTitle');
    const indexBadge = hudEl.querySelector('#galaxyProjectIndex');
    const signalStatusPill = hudEl.querySelector('#signalStatusPill');

    if (sectorLabel) sectorLabel.textContent = p.sector;
    if (coordsLabel) coordsLabel.textContent = `EXPEDITION WAYPOINT // ${p.index} OF ${String(projects.length).padStart(2, '0')}`;
    if (scanTitle) scanTitle.textContent = `ORBIT LOCKED // ${p.title.toUpperCase()}`;
    if (indexBadge) indexBadge.textContent = p.index;

    const signalStatus = (p.telemetry && p.telemetry.signalStatus) || 'PRODUCTION LIVE';
    if (signalStatusPill) signalStatusPill.textContent = signalStatus;

    const lat = ((idx * 23.4) % 90 - 45).toFixed(2);
    const long = ((idx * 51.7) % 360 - 180).toFixed(2);

    // Compact Discovery Identity
    const headline = hudEl.querySelector('#galaxyProjectTitle');
    const categoryBadge = hudEl.querySelector('#galaxyProjectCategory');
    const tagline = hudEl.querySelector('#galaxyProjectTagline');

    if (headline) headline.textContent = p.title;
    if (categoryBadge) categoryBadge.textContent = `${p.category || 'Engineering Showcase'} • ${p.year || '2025'}`;
    if (tagline) tagline.textContent = p.tagline || p.description || '';

    // Project Visual Preview Feed
    const previewImg = hudEl.querySelector('#galaxyProjectPreviewImg');
    if (previewImg) {
      if (p.image) {
        previewImg.src = p.image;
        previewImg.alt = `${p.title} Preview`;
        if (previewImg.parentElement) previewImg.parentElement.style.display = 'block';
      } else if (previewImg.parentElement) {
        previewImg.parentElement.style.display = 'none';
      }
    }

    // Verified Technology Stack Chips (Top 4)
    const techRow = hudEl.querySelector('#galaxyProjectTech');
    if (techRow) {
      const stack = (p.architecture && p.architecture.stack) || p.technologies || [];
      techRow.innerHTML = stack.slice(0, 4).map(t => `<span class="discovery-tech-chip">${t}</span>`).join('');
    }

    // Direct Quick Links
    const demoLink = hudEl.querySelector('#galaxyDemoLink');
    const demoUrl = (p.links && p.links.demo) || p.demo;
    if (demoLink) {
      if (demoUrl) {
        demoLink.style.display = 'inline-flex';
        demoLink.href = demoUrl;
      } else {
        demoLink.style.display = 'none';
      }
    }

    const githubLink = hudEl.querySelector('#galaxyGithubLink');
    const githubUrl = (p.links && p.links.github) || p.github;
    if (githubLink) {
      if (githubUrl) {
        githubLink.style.display = 'inline-flex';
        githubLink.href = githubUrl;
      } else {
        githubLink.style.display = 'none';
      }
    }

    // Reticle live range & coordinates
    const reticleDist = hudEl.querySelector('#reticleDistLabel');
    if (reticleDist) {
      const distKm = Math.round(p.orbitRadius * 2.4);
      reticleDist.textContent = `RANGE: ${distKm}M // LOCKED`;
    }

    const reticleCoords = hudEl.querySelector('#reticleCoordsTop');
    if (reticleCoords) {
      reticleCoords.textContent = `LAT: ${lat}° // LONG: ${long}°`;
    }

    // Waypoint Pips Active State
    const pips = hudEl.querySelectorAll('.waypoint-pip');
    pips.forEach((pip, pIdx) => {
      if (pIdx === idx) {
        pip.classList.add('active');
      } else {
        pip.classList.remove('active');
      }
    });

    // Update screen projection position for reticle
    updateReticleScreenPosition(idx);

    // Synchronize Spacecraft Multi-Screen Dossier
    updateSpacecraftDossierContent(idx);

    if (typeof TypographyMotion !== 'undefined' && TypographyMotion.tokenizeElementText) {
      if (headline) TypographyMotion.tokenizeElementText(headline);
      if (sectorLabel) TypographyMotion.tokenizeElementText(sectorLabel);
    }
  }

  // ── 12B. SPACECRAFT COMPUTER MULTI-SCREEN DOSSIER ENGINE ──
  function openSpacecraftDossier(idx, initialScreen = 1) {
    const dossierEl = hudEl ? hudEl.querySelector('#galaxySpacecraftDossier') : null;
    const cardEl = hudEl ? hudEl.querySelector('#galaxyDossierCard') : null;
    const centerEl = hudEl ? hudEl.querySelector('.galaxy-hud-center') : null;
    if (!dossierEl) return;

    isSpacecraftDossierOpen = true;
    if (centerEl) centerEl.classList.add('has-dossier-open');
    currentWaypointIndex = (typeof idx === 'number') ? idx : currentWaypointIndex;
    updateSpacecraftDossierContent(currentWaypointIndex);
    setDossierScreen(initialScreen);

    dossierEl.style.display = 'flex';
    dossierEl.style.opacity = '1';
    dossierEl.style.pointerEvents = 'auto';

    if (cardEl) {
      cardEl.style.opacity = '0';
      cardEl.style.pointerEvents = 'none';
    }
  }

  function closeSpacecraftDossier() {
    const dossierEl = hudEl ? hudEl.querySelector('#galaxySpacecraftDossier') : null;
    const cardEl = hudEl ? hudEl.querySelector('#galaxyDossierCard') : null;
    const centerEl = hudEl ? hudEl.querySelector('.galaxy-hud-center') : null;
    isSpacecraftDossierOpen = false;
    if (centerEl) centerEl.classList.remove('has-dossier-open');

    if (dossierEl) {
      dossierEl.style.display = 'none';
      dossierEl.style.opacity = '0';
      dossierEl.style.pointerEvents = 'none';
    }

    if (cardEl && currentEncounterAlpha >= 0.15) {
      cardEl.style.opacity = '1';
      cardEl.style.pointerEvents = 'auto';
      cardEl.classList.add('is-arrival-active');
    }
  }

  function setDossierScreen(screenNum) {
    currentDossierScreen = Math.max(1, Math.min(3, screenNum));
    const dossierEl = hudEl ? hudEl.querySelector('#galaxySpacecraftDossier') : null;
    if (!dossierEl) return;

    // Update screen tabs
    for (let s = 1; s <= 3; s++) {
      const tab = dossierEl.querySelector(`#dossierTab${s}`);
      const screenPanel = dossierEl.querySelector(`#dossierScreen${s}`);
      if (tab) {
        if (s === currentDossierScreen) {
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
        } else {
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
        }
      }
      if (screenPanel) {
        if (s === currentDossierScreen) {
          screenPanel.classList.add('active');
          screenPanel.style.display = 'block';
        } else {
          screenPanel.classList.remove('active');
          screenPanel.style.display = 'none';
        }
      }
    }

    // Step counter (01 / 03, 02 / 03, 03 / 03)
    const counter = dossierEl.querySelector('#dossierStepCounter');
    if (counter) {
      counter.textContent = `0${currentDossierScreen} / 03`;
    }

    // Prev / Next button states
    const prevBtn = dossierEl.querySelector('#dossierPrevBtn');
    const nextBtn = dossierEl.querySelector('#dossierNextBtn');
    if (prevBtn) {
      prevBtn.disabled = (currentDossierScreen === 1);
      prevBtn.style.opacity = (currentDossierScreen === 1) ? '0.35' : '1';
    }
    if (nextBtn) {
      nextBtn.disabled = (currentDossierScreen === 3);
      nextBtn.style.opacity = (currentDossierScreen === 3) ? '0.35' : '1';
    }
  }

  function updateSpacecraftDossierContent(idx) {
    const p = projects[idx];
    if (!p || !hudEl) return;

    let detail = null;
    if (typeof PORTFOLIO_PROJECT_DETAILS !== 'undefined' && PORTFOLIO_PROJECT_DETAILS.getByIndex) {
      detail = PORTFOLIO_PROJECT_DETAILS.getByIndex(idx);
    }
    if (!detail) detail = p;

    const dossierEl = hudEl.querySelector('#galaxySpacecraftDossier');
    if (!dossierEl) return;

    const accentColor = detail.color || p.color || '#F59E0B';
    const accentRgb = detail.accentRgb || p.accentRgb || [245, 158, 11];
    dossierEl.style.setProperty('--planet-accent', accentColor);
    dossierEl.style.setProperty('--planet-accent-rgb', accentRgb.join(', '));

    // Header System ID & Project Title
    const sysId = dossierEl.querySelector('#dossierSystemId');
    const projTitle = dossierEl.querySelector('#dossierProjectTitle');
    if (sysId) sysId.textContent = `ORBITAL DOSSIER // SYS.PM-${detail.index || p.index}`;
    if (projTitle) projTitle.textContent = detail.title || p.title;

    // Screen 1: Mission Brief
    const purposeEl = dossierEl.querySelector('#dossierBriefPurpose');
    const problemEl = dossierEl.querySelector('#dossierBriefProblem');
    const audienceEl = dossierEl.querySelector('#dossierBriefAudience');
    const telemEl = dossierEl.querySelector('#dossierBriefTelemetry');

    if (purposeEl) {
      purposeEl.textContent = (detail.identity && detail.identity.purpose) || detail.description || p.description;
    }
    if (problemEl) {
      problemEl.textContent = (detail.identity && detail.identity.problemSolved) || 'Optimizing high-throughput system workflows with zero latency bottlenecks and strictly verified architecture.';
    }
    if (audienceEl) {
      audienceEl.textContent = (detail.identity && detail.identity.targetAudience) || 'Software Engineers, Technical Recruiters, Open-Source Maintainers';
    }
    if (telemEl) {
      const items = [];
      const classification = detail.planetClassification || (p.telemetry && p.telemetry.classification);
      if (classification) {
        items.push(`<div class="mini-spec-row"><span class="k">CLASSIFICATION:</span><span class="v">${classification}</span></div>`);
      }
      if (detail.sector) {
        items.push(`<div class="mini-spec-row"><span class="k">SECTOR:</span><span class="v">${detail.sector}</span></div>`);
      }
      const signal = (detail.telemetry && detail.telemetry.signalStatus) || (p.telemetry && p.telemetry.signalStatus);
      if (signal) {
        items.push(`<div class="mini-spec-row"><span class="k">SIGNAL STATUS:</span><span class="v">${signal}</span></div>`);
      }
      const orbitalPeriod = (detail.telemetry && detail.telemetry.orbitalPeriod) || (p.telemetry && p.telemetry.orbitalPeriod);
      if (orbitalPeriod) {
        items.push(`<div class="mini-spec-row"><span class="k">ORBITAL PERIOD:</span><span class="v">${orbitalPeriod}</span></div>`);
      }
      telemEl.innerHTML = items.join('');
    }

    // Screen 2: Engineering Report
    const roleEl = dossierEl.querySelector('#dossierReportRole');
    if (roleEl) {
      roleEl.textContent = `${detail.role || 'Full-Stack & Systems Architecture Lead'} (Parth Mandore)`;
    }

    const stackLayersEl = dossierEl.querySelector('#dossierStackLayers');
    if (stackLayersEl) {
      if (detail.architecture && detail.architecture.stackGrouped) {
        const groups = detail.architecture.stackGrouped;
        stackLayersEl.innerHTML = Object.entries(groups).map(([layer, techs]) => `
          <div class="dossier-layer-row">
            <span class="layer-title">${layer.toUpperCase()}:</span>
            <div class="layer-techs">
              ${techs.map(t => `<span class="dossier-tech-chip">${t}</span>`).join('')}
            </div>
          </div>
        `).join('');
      } else {
        const techs = (detail.architecture && detail.architecture.stack) || detail.technologies || p.technologies || [];
        stackLayersEl.innerHTML = `
          <div class="dossier-layer-row">
            <span class="layer-title">CORE STACK:</span>
            <div class="layer-techs">
              ${techs.map(t => `<span class="dossier-tech-chip">${t}</span>`).join('')}
            </div>
          </div>
        `;
      }
    }

    const flowListEl = dossierEl.querySelector('#dossierDataFlowList');
    if (flowListEl) {
      const flow = (detail.architecture && detail.architecture.dataFlow) || [
        'Data Ingestion & Tokenization',
        'Service Pipeline Processing',
        'Persistence & State Storage',
        'Client Presentation Update'
      ];
      flowListEl.innerHTML = flow.map((step, sIdx) => `
        <li class="dossier-flow-step">
          <span class="step-num">0${sIdx + 1}.</span>
          <span class="step-txt">${step}</span>
        </li>
      `).join('');
    }

    const decisionsEl = dossierEl.querySelector('#dossierDecisionsList');
    if (decisionsEl) {
      const decs = (detail.architecture && detail.architecture.decisions) || [
        `Engineered using modular ${detail.technologies ? detail.technologies[0] : 'system'} architecture for high maintainability and performance.`
      ];
      decisionsEl.innerHTML = decs.map(d => `<li class="dossier-decision-item">${d}</li>`).join('');
    }

    // Screen 3: Mission Results
    const featuresDeck = dossierEl.querySelector('#dossierFeaturesDeck');
    if (featuresDeck) {
      const feats = detail.features || [];
      if (feats.length > 0) {
        featuresDeck.innerHTML = feats.slice(0, 4).map(f => `
          <div class="dossier-feature-card">
            <span class="feat-glyph">⚡</span>
            <div class="feat-content">
              <strong class="feat-name">${f.name}</strong>
              <p class="feat-detail">${f.detail}</p>
            </div>
          </div>
        `).join('');
      } else {
        featuresDeck.innerHTML = `
          <div class="dossier-feature-card">
            <span class="feat-glyph">⚡</span>
            <div class="feat-content">
              <strong class="feat-name">Demonstrated Capabilities</strong>
              <p class="feat-detail">${detail.description || p.description}</p>
            </div>
          </div>
        `;
      }
    }

    const challengesDeck = dossierEl.querySelector('#dossierChallengesDeck');
    if (challengesDeck) {
      const chs = detail.challenges || [];
      if (chs.length > 0) {
        challengesDeck.innerHTML = chs.slice(0, 2).map(c => `
          <div class="dossier-challenge-card">
            <div class="challenge-row challenge-problem">
              <span class="challenge-badge">CONSTRAINT:</span>
              <p class="challenge-text">${c.challenge}</p>
            </div>
            <div class="challenge-row challenge-solution">
              <span class="challenge-badge-sol">SOLUTION:</span>
              <p class="challenge-text">${c.solution}</p>
            </div>
          </div>
        `).join('');
      } else {
        challengesDeck.innerHTML = `
          <div class="dossier-challenge-card">
            <div class="challenge-row challenge-solution">
              <span class="challenge-badge-sol">ARCHITECTURE:</span>
              <p class="challenge-text">Optimized end-to-end performance with sub-second response times and zero runtime regressions.</p>
            </div>
          </div>
        `;
      }
    }

    const externalLinksEl = dossierEl.querySelector('#dossierExternalLinks');
    if (externalLinksEl) {
      const links = [];
      const ghUrl = (detail.links && detail.links.github) || p.github;
      if (ghUrl) {
        links.push(`
          <a href="${ghUrl}" target="_blank" rel="noopener noreferrer" class="dossier-external-btn" aria-label="Open Source Repository on GitHub">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>SOURCE REPOSITORY</span>
            <span class="ext-arrow">&nearr;</span>
          </a>
        `);
      }
      const demoUrl = (detail.links && detail.links.demo) || p.demo;
      if (demoUrl) {
        links.push(`
          <a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="dossier-external-btn dossier-external-demo" aria-label="Open Live System Demo">
            <span>OPEN LIVE DEMO</span>
            <span class="ext-arrow">&nearr;</span>
          </a>
        `);
      }
      externalLinksEl.innerHTML = links.join('');
    }
  }

  let activeDetailIndex = 0;
  let heroTiltCleanup = null;
  let isDetailModalOpen = false;

  function openDetailModal(idxOrSlug) {
    const modal = document.getElementById('projectDetailModal');
    if (!modal) return;

    let detail = null;
    let idx = 0;

    if (typeof PORTFOLIO_PROJECT_DETAILS !== 'undefined') {
      if (typeof idxOrSlug === 'string' && isNaN(Number(idxOrSlug))) {
        detail = PORTFOLIO_PROJECT_DETAILS.getById(idxOrSlug);
        idx = detail ? parseInt(detail.index, 10) - 1 : 0;
      } else {
        idx = Math.max(0, Math.min(projects.length - 1, parseInt(idxOrSlug, 10) || 0));
        detail = PORTFOLIO_PROJECT_DETAILS.getByIndex(idx);
      }
    } else {
      if (typeof idxOrSlug === 'string' && isNaN(Number(idxOrSlug))) {
        idx = projects.findIndex(p => p.slug === idxOrSlug || p.id === idxOrSlug);
        if (idx === -1) idx = 0;
      } else {
        idx = Math.max(0, Math.min(projects.length - 1, parseInt(idxOrSlug, 10) || 0));
      }
    }

    const p = projects[idx] || (detail || projects[0]);
    if (!detail) {
      detail = p;
    }
    activeDetailIndex = idx;
    isDetailModalOpen = true;

    // Apply custom dynamic CSS accent variables to the modal overlay
    const accentColor = detail.color || p.color || '#F59E0B';
    const accentRgb = detail.accentRgb || p.accentRgb || [245, 158, 11];
    modal.style.setProperty('--project-accent', accentColor);
    modal.style.setProperty('--project-accent-rgb', accentRgb.join(', '));

    // 1. Waypoint & Top Navigation
    const wpText = document.getElementById('experienceWaypointText');
    if (wpText) {
      const classif = (detail.planetClassification || (p.telemetry && p.telemetry.classification) || 'TERRESTRIAL').split('//')[0].trim();
      wpText.textContent = `WAYPOINT // ORBIT ${detail.index || p.index}: ${classif}`;
    }

    // Prev / Next Project indices
    const prevIdx = (idx - 1 + projects.length) % projects.length;
    const nextIdx = (idx + 1) % projects.length;
    const prevProj = (typeof PORTFOLIO_PROJECT_DETAILS !== 'undefined' ? PORTFOLIO_PROJECT_DETAILS.getByIndex(prevIdx) : projects[prevIdx]) || projects[prevIdx];
    const nextProj = (typeof PORTFOLIO_PROJECT_DETAILS !== 'undefined' ? PORTFOLIO_PROJECT_DETAILS.getByIndex(nextIdx) : projects[nextIdx]) || projects[nextIdx];

    const prevBtn = document.getElementById('experiencePrevBtn');
    if (prevBtn) {
      prevBtn.setAttribute('aria-label', `Previous Project: ${prevProj.title}`);
      prevBtn.onclick = () => openDetailModal(prevIdx);
    }
    const nextBtn = document.getElementById('experienceNextBtn');
    if (nextBtn) {
      nextBtn.setAttribute('aria-label', `Next Project: ${nextProj.title}`);
      nextBtn.onclick = () => openDetailModal(nextIdx);
    }

    // 2. Identity Header
    const idxEl = document.getElementById('modalIndex');
    if (idxEl) idxEl.textContent = `INDEX // ${detail.index || p.index}`;
    const catEl = document.getElementById('modalCategory');
    if (catEl) catEl.textContent = detail.sector || p.sector;
    const yearEl = document.getElementById('experienceYear');
    if (yearEl) yearEl.textContent = detail.year || '2025';
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.textContent = detail.title || p.title;
    const taglineEl = document.getElementById('experienceTagline');
    if (taglineEl) taglineEl.textContent = detail.tagline || detail.category || p.description;

    // 3. Visual Hero Frame & Telemetry
    const modalImg = document.getElementById('modalImg');
    if (modalImg) {
      modalImg.src = detail.image || p.image;
      modalImg.alt = `${detail.title || p.title} Architecture Visual Showcase`;
      modalImg.onerror = function () {
        if (detail.fallbackImage) {
          this.src = detail.fallbackImage;
        } else if (p.image && p.image.endsWith('.png')) {
          this.src = p.image.replace('.png', '.svg');
        } else {
          this.src = 'assets/repomentor.png';
        }
      };
    }

    const tOrbit = document.getElementById('telemetryOrbit');
    if (tOrbit) tOrbit.textContent = (detail.telemetry && detail.telemetry.orbitalPeriod) || (p.telemetry && p.telemetry.orbitalPeriod) || '500 AU';
    const tSignal = document.getElementById('telemetrySignal');
    if (tSignal) tSignal.textContent = (detail.telemetry && detail.telemetry.signalStatus) || (p.telemetry && p.telemetry.signalStatus) || 'OPTIMAL';
    const tInfer = document.getElementById('telemetryInference');
    if (tInfer) {
      tInfer.textContent = (detail.telemetry && (detail.telemetry.inferenceMode || detail.telemetry.agentFramework || detail.telemetry.coreRuntime || detail.telemetry.regressorModel || detail.telemetry.recognition)) || (p.telemetry && p.telemetry.coreArch) || 'CLIENT / SERVER';
    }
    const tLookup = document.getElementById('telemetryLookup');
    if (tLookup) {
      tLookup.textContent = (detail.telemetry && (detail.telemetry.lookupLatency || detail.telemetry.landmarks || detail.telemetry.primaryMetrics || detail.telemetry.mediaIntegration || detail.telemetry.encodingAlgorithm || detail.telemetry.architecture)) || 'OPTIMIZED';
    }

    // 4. Section A: Purpose & Problem Solved
    const probEl = document.getElementById('experienceProblemText');
    if (probEl) {
      probEl.textContent = (detail.identity && detail.identity.problemSolved) || p.description;
    }
    const purpEl = document.getElementById('experiencePurposeText');
    if (purpEl) {
      purpEl.textContent = (detail.identity && detail.identity.purpose) || p.description;
    }
    const legacyDesc = document.getElementById('modalDescription');
    if (legacyDesc) legacyDesc.textContent = p.description;

    // 5. Section C: Features Grid
    const featuresGrid = document.getElementById('experienceFeaturesGrid');
    if (featuresGrid) {
      const feats = detail.features || p.technologies.map(t => ({ name: t, detail: `Implemented capability utilizing ${t} architecture.` }));
      featuresGrid.innerHTML = feats.map((f, fIdx) => `
        <div class="feature-artifact-card">
          <span class="feature-card-index">CAPABILITY // ${String(fIdx + 1).padStart(2, '0')}</span>
          <h3 class="feature-card-name">${f.name}</h3>
          <p class="feature-card-desc">${f.detail}</p>
        </div>
      `).join('');
    }

    // 6. Section D: Architecture & Decisions
    const techGroupsEl = document.getElementById('experienceTechGroups');
    if (techGroupsEl) {
      if (detail.architecture && detail.architecture.stackGrouped) {
        techGroupsEl.innerHTML = Object.entries(detail.architecture.stackGrouped).map(([cat, chips]) => `
          <div class="tech-group-item">
            <span class="tech-group-category">${cat.replace(/([A-Z])/g, ' $1').trim()}</span>
            <div class="tech-chips-wrap">
              ${chips.map(c => `<span class="tech-verified-chip">${c}</span>`).join('')}
            </div>
          </div>
        `).join('');
      } else {
        techGroupsEl.innerHTML = `
          <div class="tech-chips-wrap">
            ${(detail.architecture ? detail.architecture.stack : p.technologies).map(c => `<span class="tech-verified-chip">${c}</span>`).join('')}
          </div>
        `;
      }
    }
    const legacyPills = document.getElementById('modalTechnologies');
    if (legacyPills) {
      legacyPills.innerHTML = p.technologies.map(t => `<span class="modal-tech-pill">${t}</span>`).join('');
    }

    const dataFlowEl = document.getElementById('experienceDataFlow');
    if (dataFlowEl) {
      const steps = (detail.architecture && detail.architecture.dataFlow) || [
        'Client User Interaction',
        'Payload Validation & Routing',
        'Domain Service Logic Execution',
        'Persistence & Data Retrieval',
        'Telemetry Logging & Presentation Update'
      ];
      dataFlowEl.innerHTML = steps.map((s, sIdx) => `
        <div class="data-flow-step">
          <span class="step-number">${String(sIdx + 1).padStart(2, '0')}.</span>
          <span class="step-text">${s}</span>
        </div>
      `).join('');
    }

    const decisionsEl = document.getElementById('experienceDecisions');
    if (decisionsEl) {
      const decs = (detail.architecture && detail.architecture.decisions) || [
        `Engineered using modular ${p.technologies[0]} architecture for clean separation of concerns and high maintainability.`
      ];
      decisionsEl.innerHTML = decs.map(d => `<div class="decision-card">${d}</div>`).join('');
    }

    // 7. Section E: Engineering Challenges
    const challengesEl = document.getElementById('experienceChallengesDeck');
    if (challengesEl) {
      const chs = detail.challenges || [{
        challenge: 'Ensuring reliable execution under variable system constraints.',
        solution: 'Implemented structured error handling, clean validation boundaries, and automated testing.'
      }];
      challengesEl.innerHTML = chs.map(c => `
        <div class="challenge-resolution-card">
          <div class="challenge-side">
            <div class="side-header danger">
              <span aria-hidden="true">&#9888;</span>
              <span>TECHNICAL CONSTRAINT &amp; CHALLENGE</span>
            </div>
            <p class="side-body">${c.challenge}</p>
          </div>
          <div class="challenge-side">
            <div class="side-header success">
              <span aria-hidden="true">&#10003;</span>
              <span>VERIFIED ARCHITECTURAL SOLUTION</span>
            </div>
            <p class="side-body">${c.solution}</p>
          </div>
        </div>
      `).join('');
    }

    // 8. Section F: Links (Strictly verified only!)
    const liveDemo = document.getElementById('modalLiveDemo');
    const demoUrl = detail.links ? detail.links.demo : p.demo;
    if (liveDemo) {
      if (demoUrl) {
        liveDemo.style.display = 'inline-flex';
        liveDemo.href = demoUrl;
      } else {
        liveDemo.style.display = 'none';
      }
    }

    const githubLink = document.getElementById('modalGithubLink');
    const githubUrl = detail.links ? detail.links.github : p.github;
    if (githubLink) {
      if (githubUrl) {
        githubLink.style.display = 'inline-flex';
        githubLink.href = githubUrl;
      } else {
        githubLink.style.display = 'none';
      }
    }

    // 9. Section G: Footer Navigation
    const footerPrevTitle = document.getElementById('footerPrevTitle');
    if (footerPrevTitle) footerPrevTitle.textContent = prevProj.title;
    const footerNextTitle = document.getElementById('footerNextTitle');
    if (footerNextTitle) footerNextTitle.textContent = nextProj.title;

    const footerTeaserPrev = document.getElementById('footerTeaserPrev');
    if (footerTeaserPrev) footerTeaserPrev.onclick = () => openDetailModal(prevIdx);
    const footerTeaserNext = document.getElementById('footerTeaserNext');
    if (footerTeaserNext) footerTeaserNext.onclick = () => openDetailModal(nextIdx);

    const footerReturnBtn = document.getElementById('footerReturnBtn');
    if (footerReturnBtn) footerReturnBtn.onclick = closeDetailModal;

    // 10. Interactive 3D Hero Parallax Tilt
    const heroFrame = document.getElementById('experienceHeroFrame');
    if (heroTiltCleanup) heroTiltCleanup();
    if (heroFrame && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const handleTilt = (e) => {
        const rect = heroFrame.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroFrame.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-2px)`;
      };
      const resetTilt = () => {
        heroFrame.style.transform = 'rotateY(0deg) rotateX(0deg) translateY(0)';
      };
      heroFrame.addEventListener('mousemove', handleTilt);
      heroFrame.addEventListener('mouseleave', resetTilt);
      heroTiltCleanup = () => {
        heroFrame.removeEventListener('mousemove', handleTilt);
        heroFrame.removeEventListener('mouseleave', resetTilt);
      };
    }

    // 11. Modal State, URL Hash & Title
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const projectSlug = detail.slug || p.slug || p.id || `project-${p.index}`;
    if (window.location.hash !== `#/project/${projectSlug}`) {
      window.history.pushState({ modalOpen: true, projectSlug: projectSlug }, '', `#/project/${projectSlug}`);
    }
    document.title = `${detail.title || p.title} — Parth Mandore`;

    // Focus on close/return button for accessibility
    const closeBtn = document.getElementById('projectModalClose');
    if (closeBtn) closeBtn.focus();
  }

  function closeDetailModal() {
    const modal = document.getElementById('projectDetailModal');
    if (!modal) return;
    if (!modal.classList.contains('is-open')) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.title = 'Parth Mandore | Software Engineer Portfolio';
    isDetailModalOpen = false;

    if (heroTiltCleanup) {
      heroTiltCleanup();
      heroTiltCleanup = null;
    }

    // Revert URL hash if it was a project route without reloading
    if (window.location.hash.startsWith('#/project/')) {
      window.history.pushState({ modalOpen: false }, '', '#works');
    }

    // Return focus to trigger button
    if (hudEl) {
      const inspectBtn = hudEl.querySelector('#galaxyInspectBtn');
      if (inspectBtn) inspectBtn.focus();
    }
  }

  // ── 13. 60/120FPS RAF RENDER LOOP & PLANETARY DYNAMICS ──
  // ── CONTINUOUS CAMERA PAN & YAW TELEMETRY FOR SYNCHRONIZED BACKGROUND STARS ──
  let telemetryCamEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  let baseCamEuler = null;
  let continuousYaw = 0.0;
  let continuousPitch = 0.0;
  let prevRawYaw = 0.0;
  let prevRawPitch = 0.0;

  function updateCameraTelemetry() {
    if (!camera) return;
    telemetryCamEuler.setFromQuaternion(camera.quaternion, 'YXZ');
    if (baseCamEuler === null) {
      baseCamEuler = telemetryCamEuler.clone();
      prevRawYaw = telemetryCamEuler.y;
      prevRawPitch = telemetryCamEuler.x;
      return;
    }
    let dYaw = telemetryCamEuler.y - prevRawYaw;
    while (dYaw > Math.PI) dYaw -= Math.PI * 2;
    while (dYaw < -Math.PI) dYaw += Math.PI * 2;
    continuousYaw += dYaw;
    prevRawYaw = telemetryCamEuler.y;

    let dPitch = telemetryCamEuler.x - prevRawPitch;
    while (dPitch > Math.PI) dPitch -= Math.PI * 2;
    while (dPitch < -Math.PI) dPitch += Math.PI * 2;
    continuousPitch += dPitch;
    prevRawPitch = telemetryCamEuler.x;
  }

  function renderLoop() {
    updateCameraTelemetry();
    if (!isInitialized) return;
    if (document.hidden) {
      requestAnimationFrame(renderLoop);
      return;
    }
    try {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      smoothSkyMouseX += (skyMouseNormX - smoothSkyMouseX) * 0.08;
      smoothSkyMouseY += (skyMouseNormY - smoothSkyMouseY) * 0.08;

      if (isActive) {
        const heroEl = document.getElementById('hero');
        const worksEl = document.getElementById('works');
        const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;
        const worksRect = worksEl ? worksEl.getBoundingClientRect() : null;

        const isHeroVisible = heroRect && heroRect.bottom > 0 && heroRect.top < window.innerHeight;
        const isWorksVisible = worksRect && worksRect.bottom > 0 && worksRect.top < window.innerHeight;

        // Skip rendering only if neither Hero nor Works is in view and home transition is complete
        if (!isHeroVisible && !isWorksVisible && homeTransitionProgress >= 0.999) {
          requestAnimationFrame(renderLoop);
          return;
        }

      // 1. Fluid Scroll-Driven Progression & Programmatic Interplanetary Transit Kinematics
      let inTransitFlight = false;
      let flightCruiseWeight = 0.0;

      if (activeTransit) {
        inTransitFlight = true;
        activeTransit.elapsed += delta;
        const rawU = Math.min(1.0, activeTransit.elapsed / activeTransit.duration);
        const distanceFraction = evaluateTransitProfile(rawU);
        flightCruiseWeight = Math.sin(Math.PI * rawU);

        currentScrollProgress = activeTransit.startProgress + (activeTransit.endProgress - activeTransit.startProgress) * distanceFraction;
        targetScrollProgress = currentScrollProgress;

        // Dynamic FOV Widening during Cruise (45° resting to 53° high-speed transit)
        if (camera && !isReducedMotion) {
          if (rawU < 0.15) {
            camera.fov = 45.0 + 8.0 * Math.sin(0.5 * Math.PI * (rawU / 0.15));
          } else if (rawU <= 0.70) {
            camera.fov = 53.0;
          } else {
            const tau = (rawU - 0.70) / 0.30;
            camera.fov = 45.0 + 8.0 * Math.cos(0.5 * Math.PI * tau);
          }
          camera.updateProjectionMatrix();
        }

        // Complete Transit Arrival
        if (rawU >= 1.0) {
          const dest = activeTransit.toIdx;
          activeTransit = null;
          onTransitArrival(dest);
        }
      } else {
        const diff = targetScrollProgress - currentScrollProgress;
        const absDiff = Math.abs(diff);
        if (absDiff > 0.00005) {
          currentScrollProgress += diff * 0.14;
          flightCruiseWeight = Math.min(1.0, absDiff * 35.0);
          inTransitFlight = absDiff > 0.0008;
        } else {
          currentScrollProgress = targetScrollProgress;
          flightCruiseWeight = 0.0;
          inTransitFlight = false;
        }

        if (camera && !isReducedMotion) {
          const targetFov = 45.0 + 6.0 * flightCruiseWeight;
          camera.fov += (targetFov - camera.fov) * 0.08;
          camera.updateProjectionMatrix();
        }
      }

      // 1B. Dynamic Performance & Frame Rate Watchdog (Auto-Drop Quality if FPS < 45)
      fpsWatchdogCount++;
      const nowMs = performance.now();
      if (nowMs - fpsWatchdogLastMark >= 1000) {
        const measuredFps = (fpsWatchdogCount * 1000) / (nowMs - fpsWatchdogLastMark);
        fpsWatchdogCount = 0;
        fpsWatchdogLastMark = nowMs;
        if (measuredFps < 45) {
          fpsLowStreakSeconds++;
          if (fpsLowStreakSeconds >= 3 && !hasAutoDroppedQuality) {
            console.warn(`[PERF WATCHDOG] Sustained FPS ${measuredFps.toFixed(1)} < 45. Dropping pixel ratio & sky decoy load.`);
            hasAutoDroppedQuality = true;
            if (renderer) renderer.setPixelRatio(1.0);
            if (skyMapPoints && skyMapPoints.geometry) {
              const keepConstellationCount = skyMapStarMeta.length + Math.floor(SKY_MAP_CONFIG.decoyStarCount * 0.4) + Math.floor(SKY_MAP_CONFIG.parallaxStarCount * 0.4);
              skyMapPoints.geometry.setDrawRange(0, Math.max(skyMapStarMeta.length, keepConstellationCount));
            }
          }
        } else {
          fpsLowStreakSeconds = 0;
        }
      }

      // 2. Solar Plasma Shader Time Uniform & Organic Billboard Corona
      if (starMaterial && starMaterial.uniforms) {
        starMaterial.uniforms.uTime.value = elapsedTime;
      }
      if (starCoronaMat && starCoronaMat.uniforms) {
        starCoronaMat.uniforms.uTime.value = elapsedTime;
      }
      if (starCoronaMesh && camera) {
        starCoronaMesh.quaternion.copy(camera.quaternion);
      }
      if (centralStarMesh) {
        centralStarMesh.rotation.y = elapsedTime * 0.02;
      }

      // 3. Deep Space Starfield & Stardust Multi-Depth Parallax (Camera-Responsive)
      if (deepSpaceStarsGroup && camera) {
        // Distant stars move with subtle parallax (94% tracking camera -> 6% apparent depth shift)
        deepSpaceStarsGroup.position.x = camera.position.x * 0.94;
        deepSpaceStarsGroup.position.y = camera.position.y * 0.94;
        deepSpaceStarsGroup.position.z = camera.position.z * 0.94;
        deepSpaceStarsGroup.rotation.y = 0.0; // Strictly stationary when camera is still
      }
      if (foregroundStardustGroup && camera) {
        // Foreground stardust moves with high parallax (60% tracking camera -> 40% apparent dynamic shift)
        foregroundStardustGroup.position.x = camera.position.x * 0.60;
        foregroundStardustGroup.position.y = camera.position.y * 0.60;
        foregroundStardustGroup.position.z = camera.position.z * 0.60;
        foregroundStardustGroup.rotation.y = inTransitFlight ? (elapsedTime * 0.018 * flightCruiseWeight) : 0.0;
      }

      // 4. Instanced Asteroids 3D Tumbling
      if (instancedAsteroidMesh && asteroidInstanceData.length > 0) {
        const dummy = new THREE.Object3D();
        for (let a = 0; a < asteroidInstanceData.length; a++) {
          const item = asteroidInstanceData[a];
          item.rot.x += item.rotSpeed.x;
          item.rot.y += item.rotSpeed.y;
          item.rot.z += item.rotSpeed.z;
          dummy.position.copy(item.pos);
          dummy.rotation.copy(item.rot);
          dummy.scale.set(item.scale, item.scale, item.scale);
          dummy.updateMatrix();
          instancedAsteroidMesh.setMatrixAt(a, dummy.matrix);
        }
        instancedAsteroidMesh.instanceMatrix.needsUpdate = true;
      }

      // 5. Planetary Axial Rotation & Independent Cloud Layer Dynamics
      planetMeshes.forEach((item, idx) => {
        item.mesh.rotation.y += item.rotationSpeed;
        item.group.position.y = item.baseY;

        if (item.scanRingMesh) {
          if (idx === currentWaypointIndex && currentEncounterAlpha > 0.08) {
            item.scanRingMesh.visible = true;
            const scanPhase = (elapsedTime * 2.4) % (Math.PI * 2);
            const scanY = Math.sin(scanPhase) * (item.project.planetRadius * 0.90);
            item.scanRingMesh.position.y = scanY;
            const ringScale = Math.max(0.2, Math.cos(Math.asin(Math.min(0.98, Math.abs(scanY) / (item.project.planetRadius * 1.02)))));
            item.scanRingMesh.scale.set(ringScale, ringScale, 1);
            item.scanRingMesh.material.opacity = currentEncounterAlpha * (0.35 + 0.35 * Math.sin(elapsedTime * 7));
          } else {
            item.scanRingMesh.visible = false;
            item.scanRingMesh.material.opacity = 0;
          }
        }
      });

      // 5B. Orbiting Companion Moons Dynamics
      moonMeshes.forEach(m => {
        m.angle += m.speed * delta;
        m.mesh.position.set(
          Math.cos(m.angle) * m.dist,
          m.elevation * m.dist + Math.sin(m.angle * 2.0) * 1.5,
          Math.sin(m.angle) * m.dist
        );
      });

      cloudMeshes.forEach((cItem) => {
        cItem.mesh.rotation.y += cItem.rotSpeed;
      });

      if (saturnRingMesh) {
        saturnRingMesh.rotation.z = elapsedTime * 0.035;
        const saturnItem = planetMeshes[4];
        if (saturnItem && saturnItem.axialGroup && saturnRingMesh.material && saturnRingMesh.material.uniforms) {
          const sunWorldDir = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), saturnItem.group.position).normalize();
          const invQuat = saturnItem.axialGroup.getWorldQuaternion(new THREE.Quaternion()).invert();
          const sunLocalDir = sunWorldDir.clone().applyQuaternion(invQuat);
          saturnRingMesh.material.uniforms.uSunLocalDir.value.copy(sunLocalDir);

          if (saturnItem.mesh && saturnItem.mesh.material && saturnItem.mesh.material.userData && saturnItem.mesh.material.userData.shader) {
            saturnItem.mesh.material.userData.shader.uniforms.uSunLocalDir.value.copy(sunLocalDir);
          }
        }
      }

      // 6. Smooth Scroll Progression & Parametric Camera Trajectory (Home Transition or Planetary Journey)
      const homeDiff = targetHomeTransitionProgress - homeTransitionProgress;
      if (window.MasterJourneyController) {
        homeTransitionProgress = targetHomeTransitionProgress;
      } else if (Math.abs(homeDiff) > 0.0001) {
        homeTransitionProgress += homeDiff * 0.14;
      } else {
        homeTransitionProgress = targetHomeTransitionProgress;
      }

      // Sync physical drift of Home DOM elements as spacecraft yaws right
      syncHomeElementsDrift(homeTransitionProgress);

      let pose;
      if (cameraOverride) {
        camera.position.copy(cameraOverride.pos);
        camera.lookAt(cameraOverride.lookAt);
      } else if (homeTransitionProgress < 0.999) {
        // Continuous 3D flight & rightward yaw from Home into Works
        pose = evaluateHomeTransitionCamera(homeTransitionProgress);
        camera.position.copy(pose.camPos);

        targetCameraRoll = (pose.roll || 0.0);
        cameraRoll += (targetCameraRoll - cameraRoll) * 0.12;

        const fwd = new THREE.Vector3().subVectors(pose.lookTarget, pose.camPos).normalize();
        const baseUp = new THREE.Vector3(0, 1, 0);
        const right = new THREE.Vector3().crossVectors(fwd, baseUp).normalize();
        const rolledUp = new THREE.Vector3().crossVectors(right, fwd).normalize();
        rolledUp.applyAxisAngle(fwd, cameraRoll);

        camera.up.copy(rolledUp);
        camera.lookAt(pose.lookTarget);

        if (camera && pose.fov && !isReducedMotion) {
          camera.fov = pose.fov;
          camera.updateProjectionMatrix();
        }

        // Subtle foreground stardust parallax depth during the turn
        if (foregroundStardustGroup) {
          foregroundStardustGroup.position.x = -75.0 * homeTransitionProgress;
          foregroundStardustGroup.position.z = -45.0 * homeTransitionProgress;
        }
      } else {
        // Advance open/close zoom animation before evaluating this frame's camera pose
        tickDetailTransition();

        // Full planetary journey active
        pose = evaluateJourneyCamera(currentScrollProgress);
        camera.position.copy(pose.camPos);

        if (camera && pose.fov) {
          if (detailMode !== 'skymap' || isReducedMotion) {
            camera.fov = pose.fov;
          } else {
            camera.fov += (pose.fov - camera.fov) * (pose.isDeparture ? 0.35 : 0.10);
          }
          camera.updateProjectionMatrix();
        }

        const masterT = window.MasterJourneyController ? window.MasterJourneyController.getProgress() : 0.0;
        const transitionP = (window.MasterJourneyController && typeof window.MasterJourneyController.getTransitionProgress === 'function')
          ? window.MasterJourneyController.getTransitionProgress(masterT)
          : 0.0;

        // Apply pure-function staging (Solar system smoothly fades by distance/progress; zero pop-out)
        if (pose.isDeparture) {
          if (postMaterial && postMaterial.uniforms && postMaterial.uniforms.uMotionBlur) {
            postMaterial.uniforms.uMotionBlur.value = 0.0; // Strictly no warp streaks
          }
          if (foregroundStardustGroup) {
            foregroundStardustGroup.position.z = -transitionP * 220.0;
            foregroundStardustGroup.position.y = -transitionP * 40.0;
          }
        } else if (masterT > 0.18 && masterT <= 0.572) {
          // Interplanetary exploration inside Solar System (Planets 01..07)
          if (orbitalRingsGroup) {
            orbitalRingsGroup.children.forEach(ring => {
              if (ring.material && ring.userData.baseOpacity) {
                ring.material.opacity = ring.userData.baseOpacity;
              }
            });
          }
          if (postMaterial && postMaterial.uniforms && postMaterial.uniforms.uMotionBlur) {
            postMaterial.uniforms.uMotionBlur.value = 0.0;
          }
          if (centralStarGroup) {
            centralStarGroup.children.forEach(child => {
              if (child.isPointLight && child.userData.baseIntensity) {
                child.intensity = child.userData.baseIntensity;
              }
            });
            centralStarGroup.scale.set(1, 1, 1);
          }
          if (starCoronaMesh && starCoronaMesh.material) {
            starCoronaMesh.material.opacity = 1.0;
            starCoronaMesh.scale.set(1, 1, 1);
          }
          if (planetsGroup) {
            planetsGroup.scale.set(1, 1, 1);
            planetMeshes.forEach(pm => {
              if (pm.mesh && pm.mesh.material) {
                pm.mesh.material.opacity = 1.0;
              }
            });
          }
          if (asteroidBeltGroup && instancedAsteroidMesh && instancedAsteroidMesh.material) {
            instancedAsteroidMesh.material.opacity = 1.0;
          }

          // Interplanetary lateral stardust parallax (enhanced cosmic depth during deep-space cruise)
          if (foregroundStardustGroup) {
            if (!pose.isDwell && typeof pose.rawU === 'number') {
              const arcSign = (pose.segIdx % 2 === 0) ? 1.0 : -1.0;
              foregroundStardustGroup.position.x = Math.sin(pose.rawU * Math.PI) * 65.0 * arcSign;
              foregroundStardustGroup.position.z = -Math.sin(pose.rawU * Math.PI) * 50.0;
            } else {
              foregroundStardustGroup.position.x = 0;
              foregroundStardustGroup.position.z = 0;
            }
          }
        }

        targetCameraRoll = (pose.roll || 0.0);
        cameraRoll += (targetCameraRoll - cameraRoll) * 0.12;

        const fwd = new THREE.Vector3().subVectors(pose.lookTarget, pose.camPos).normalize();
        const baseUp = new THREE.Vector3(0, 1, 0);
        const right = new THREE.Vector3().crossVectors(fwd, baseUp).normalize();
        const rolledUp = new THREE.Vector3().crossVectors(right, fwd).normalize();
        rolledUp.applyAxisAngle(fwd, cameraRoll);

        camera.up.copy(rolledUp);
        camera.lookAt(pose.lookTarget);

        // Update Same-Scene 3D Sky Map & Alignment Stars strictly from transitionP (with Contact cross-dissolve past 0.865)
        updateSkyMapStage(transitionP, elapsedTime, masterT);

        if (ambientLight) {
          ambientLight.color.setHex(0x010204);
          ambientLight.intensity = 0.015;
        }

        // 7. Synchronized Sector 01 / Solar -> Sky Map Staging & Encounter State
        updateSector01VisualStaging(masterT);
        if (masterT > 0.18 && masterT <= 0.572) {
          updateArrivalState(currentScrollProgress);
        }
      }

      // 8. Three.js WebGL Render Call with Post-Processing
      if (postRenderTarget && postScene && postCamera) {
        postMaterial.uniforms.uTime.value = elapsedTime;
        renderer.setRenderTarget(postRenderTarget);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
        renderer.render(postScene, postCamera);
      } else {
        renderer.render(scene, camera);
      }
    }
    } catch (err) {
      console.error('[RENDER LOOP CRASH]', err);
    }

    requestAnimationFrame(renderLoop);
  }

  // ── 14. RESIZE & LIFECYCLE ──
  function syncNavHeight() {
    const nav = document.getElementById('atelier-header') || document.querySelector('.atelier-header');
    if (nav) {
      document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
    }
  }

  function onWindowResize() {
    syncNavHeight();
    if (!camera || !renderer || !containerEl) return;
    const width = containerEl.clientWidth || window.innerWidth;
    const height = containerEl.clientHeight || window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (skyMapPointsMat && skyMapPointsMat.uniforms && skyMapPointsMat.uniforms.uPixelRatio) {
      skyMapPointsMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2);
    }

    buildCameraFlightSpline();
    buildSkyMapStage();
    if (detailMode !== 'skymap' || detailProgress > 0.001) {
      computeDetailStarTargets(detailSectorIdx);
    }
  }

  function activate() {
    isActive = true;
    if (canvasEl) {
      canvasEl.style.display = 'block';
      canvasEl.style.opacity = '1';
      canvasEl.style.visibility = 'visible';
    }
    const mProg = (window.MasterJourneyController && typeof window.MasterJourneyController.getProgress === 'function')
      ? window.MasterJourneyController.getProgress()
      : 0.0;
    if (hudEl) {
      if (mProg > 0.18 && mProg <= 0.65) {
        hudEl.style.display = 'flex';
        hudEl.style.opacity = '1';
        hudEl.style.visibility = 'visible';
      } else {
        hudEl.style.display = 'none';
        hudEl.style.opacity = '0';
        hudEl.style.visibility = 'hidden';
      }
    }
    updateSector01VisualStaging(mProg);
    if (!scrollTriggerInstance) {
      initScrollTrigger();
    } else {
      scrollTriggerInstance.enable();
      if (homeScrollTriggerInstance) homeScrollTriggerInstance.enable();
    }
    updateHomeTransitionFromScroll();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
    console.info('[GalaxyJourney] Activated.');
  }

  function deactivate() {
    isActive = false;
    if (canvasEl) {
      canvasEl.style.display = 'none';
      canvasEl.style.opacity = '0';
      canvasEl.style.visibility = 'hidden';
    }
    if (hudEl) {
      hudEl.style.display = 'none';
      hudEl.style.opacity = '0';
      hudEl.style.visibility = 'hidden';
    }
    if (homeScrollTriggerInstance) {
      homeScrollTriggerInstance.kill(true);
      homeScrollTriggerInstance = null;
    }
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill(true);
      scrollTriggerInstance = null;
    }
    syncHomeElementsDrift(0);
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
    console.info('[GalaxyJourney] Deactivated.');
  }

  function setCameraOverride(pos, lookAt) {
    if (!pos || !lookAt) {
      cameraOverride = null;
    } else {
      cameraOverride = {
        pos: new THREE.Vector3(pos.x, pos.y, pos.z),
        lookAt: new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z)
      };
    }
  }

  // ── 15. EXPEDITION GLOBAL ROUTING & KEYBOARD SHORTCUTS ──
  function setupRoutingAndKeybindings() {
    window.addEventListener('keydown', (e) => {
      if (isDetailModalOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeDetailModal();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIdx = (activeDetailIndex - 1 + projects.length) % projects.length;
          openDetailModal(prevIdx);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIdx = (activeDetailIndex + 1) % projects.length;
          openDetailModal(nextIdx);
        }
      }
    });

    const handleHashRoute = () => {
      const hash = window.location.hash || '';
      const match = hash.match(/^#\/project\/([a-z0-9\-]+)$/i);
      if (match) {
        const slug = match[1];
        openDetailModal(slug);
      } else if (isDetailModalOpen) {
        closeDetailModal();
      }
    };

    window.addEventListener('hashchange', handleHashRoute);
    window.addEventListener('popstate', handleHashRoute);

    // Initial check after DOM & data are available
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(handleHashRoute, 250);
      });
    } else {
      setTimeout(handleHashRoute, 250);
    }
  }

  setupRoutingAndKeybindings();

  return {
    init: init,
    activate: activate,
    deactivate: deactivate,
    jumpToProject: jumpToProject,
    stepJourney: stepJourney,
    skipTransit: skipTransit,
    STEPS_PER_LEG: STEPS_PER_LEG,
    getCurrentWaypoint: () => currentWaypointIndex,
    isActive: () => isActive,
    getCurrentLegStep: () => currentLegStep,
    getCurrentLegIndex: () => currentLegIndex,
    returnToHome: returnToHome,
    openSpacecraftDossier: openSpacecraftDossier,
    closeSpacecraftDossier: closeSpacecraftDossier,
    setDossierScreen: setDossierScreen,
    openModal: openDetailModal,
    closeModal: closeDetailModal,
    getActiveDetailIndex: () => activeDetailIndex,
    isModalOpen: () => isDetailModalOpen,
    setProgress: (p, instant = false) => {
      targetScrollProgress = Math.max(0, Math.min(1, p));
      if (p > 0) {
        targetHomeTransitionProgress = 1.0;
        homeTransitionProgress = 1.0;
      }
      if (instant) {
        currentScrollProgress = targetScrollProgress;
        if (camera) {
          const pose = evaluateJourneyCamera(currentScrollProgress);
          camera.position.copy(pose.camPos);
          camera.lookAt(pose.lookTarget);
        }
        updateArrivalState(currentScrollProgress);
      }
    },
    setHomeTransitionProgress: (p, instant = false) => {
      targetHomeTransitionProgress = Math.max(0, Math.min(1, p));
      if (instant || window.MasterJourneyController) {
        homeTransitionProgress = targetHomeTransitionProgress;
        if (camera && instant) {
          const pose = evaluateHomeTransitionCamera(homeTransitionProgress);
          camera.position.copy(pose.camPos);
          camera.lookAt(pose.lookTarget);
        }
      }
    },
    getPostMaterial: () => postMaterial,
    getForegroundStardustGroup: () => foregroundStardustGroup,
    getHomeTransitionProgress: () => homeTransitionProgress,
    getSkillsDiscoveryProgress: () => currentSkillsDiscoveryProgress,
    updateSector01VisualStaging: updateSector01VisualStaging,
    updateSkillsDiscoveryProgress: updateSkillsDiscoveryProgress,
    updateBeaconNexusProgress: updateBeaconNexusProgress,
    updateContactFlightProgress: updateContactFlightProgress,
    getLeg3Metrics: getLeg3Metrics,
    evaluateContactFlightCamera: evaluateContactFlightCamera,
    getProgress: () => currentScrollProgress,
    getScrollTrigger: () => scrollTriggerInstance,
    getProjects: () => projects,
    isReady: () => isInitialized,
    setCameraOverride: setCameraOverride,
    getScene: () => scene,
    getCamera: () => camera,
    getCameraPanTelemetry: function () {
      return {
        yaw: continuousYaw,
        pitch: continuousPitch,
        fov: camera ? camera.fov : 45.0,
        camPos: camera ? camera.position : null
      };
    },
    evaluateHomeTransitionCamera: evaluateHomeTransitionCamera,
    getRenderer: () => renderer,
    skyConfig: SKY_MAP_CONFIG,
    getSkyMapMetrics: () => ({
      totalSkyStars: (skyMapPoints && skyMapPoints.geometry && skyMapPoints.geometry.userData) ? skyMapPoints.geometry.userData.totalCount : 0,
      constellationStars: skyMapStarMeta.length,
      constellationEdges: skyMapEdgeList.length,
      drawCalls: renderer && renderer.info ? renderer.info.render.calls : 0
    }),
    getGalacticCoreState: () => ({
      visible: centralStarGroup ? centralStarGroup.visible : false,
      scale: centralStarGroup ? centralStarGroup.scale.x : 0.0,
      starCoronaVisible: starCoronaMesh ? starCoronaMesh.visible : false
    }),
    getSkyStarScreenPositions: () => {
      if (!camera || !skyMapStarMeta.length) return [];
      const w = window.innerWidth || 1366;
      const h = window.innerHeight || 768;
      return skyMapStarMeta.map(m => {
        const v = m.worldPos.clone().project(camera);
        return {
          secIdx: m.secIdx,
          localIdx: m.localIdx,
          depth: Math.round(m.depth),
          sx: (v.x * 0.5 + 0.5) * w,
          sy: (-v.y * 0.5 + 0.5) * h,
          inBounds: v.x >= -0.99 && v.x <= 0.99 && v.y >= -0.99 && v.y <= 0.99 && v.z < 1.0
        };
      });
    },
    openConstellation: openConstellation,
    closeConstellationDetail: closeConstellationDetail,
    setActiveDetailSector: setActiveDetailSector,
    isConstellationDetailOpen: () => detailMode === 'detail' || detailMode === 'opening',
    isConstellationDetailActive: () => detailMode !== 'skymap' || detailProgress > 0.005,
    getDetailTransitionState: () => ({
      detailMode,
      detailProgress: Number(detailProgress.toFixed(4)),
      detailSectorIdx,
      zoomU: Number(Math.max(0, Math.min(1, detailProgress / DETAIL_ZOOM_FRAC)).toFixed(4)),
      handoffAlpha: Number(Math.max(0, Math.min(1, (detailProgress - DETAIL_ZOOM_FRAC) / (1.0 - DETAIL_ZOOM_FRAC))).toFixed(4))
    })
  };
}));
