/**
 * ============================================================================
 * CONSTELLATION SKY ATLAS — SKILLS & TECHNOLOGIES (Sector 04)
 * Astronomical constellation layout faithfully modeled on user sketch:
 * - Central irregular star cluster inside broken dashed ring + helper stars
 * - Real HTML tech cards auto-arranged around perimeter with non-crossing lines
 * - Project cross-references derived dynamically from PORTFOLIO_PROJECT_DETAILS
 * - Single DPR<=2 Canvas 2D sky: Milky Way, dust lanes, 3 parallax star layers
 * - Click star/card to push camera in to granulated stellar body + jump to planet
 * - Pan between 7 distinct constellations, readable List view, mobile strip
 * ============================================================================
 */

(function (window, document) {
  'use strict';

  // ── 1. SINGLE TUNABLE CONFIGURATION OBJECT ─────────────────────────────────
  // All coordinates are local normalized offsets [-1.0, +1.0] inside the ring.
  // Brightness defaults apply when 0 verified projects match a technology.
  const CONSTELLATION_CONFIG = {
    // Timing & motion (tune freely)
    ringRotationDegPerSec: 0.35,      // Very slow broken ring rotation
    breathingAmplitude: 0.03,         // ~3% subtle star brightness breathing
    cameraZoomDurationMs: 1850,       // ~2s push-in / pull-out on star click
    sectorPanDurationMs: 1850,        // ~2s camera sky pan between sectors
    starAppearDelayMs: 135,           // Sequential star appearance (~0.14s apart)
    lineDrawDurationMs: 420,          // Constellation lines trace duration
    starDefaultFaintness: 0.34,       // Brightness factor for 0-project skills

    // Sky visual restraint & performance
    skyDriftSpeed: 0.00018,           // Ultra-slow ambient drift
    parallaxWeights: [0.22, 0.50, 0.90],
    maxDesktopBgStars: 1650,
    minBgStarsAfterThrottle: 520,
    fpsThreshold: 45,
    grainOpacity: 0.035,

    // Spectral temperature palettes (realistic restrained stellar tints)
    temperatures: {
      'blue-white': { core: '#f4f8ff', mid: [188, 216, 255], glow: [120, 175, 255] },
      'white':      { core: '#ffffff', mid: [242, 246, 255], glow: [200, 214, 240] },
      'yellow':     { core: '#fff9ea', mid: [255, 224, 158], glow: [245, 180, 82] },
      'orange':     { core: '#fff1e0', mid: [255, 184, 122], glow: [235, 130, 68] }
    },

    // 7 distinct irregular patterns (NO symmetric diamonds/kites)
    sectors: [
      {
        key: 'languages',
        title: 'Programming Languages',
        color: '#F59E0B',
        rgb: '245, 158, 11',
        skyOffset: { x: 0, y: 0 },
        nebulaTint: [210, 150, 75],
        // Scorpius-inspired crooked hook & tail
        stars: [
          { tech: 'Java',       x: -0.58, y: -0.44, temp: 'orange' },
          { tech: 'Python',     x:  0.46, y: -0.50, temp: 'yellow' },
          { tech: 'TypeScript', x:  0.64, y:  0.04, temp: 'blue-white' },
          { tech: 'SQL',        x:  0.14, y:  0.34, temp: 'yellow' },
          { tech: 'C / C++',    x: -0.32, y:  0.62, temp: 'white' },
          { tech: 'JavaScript', x: -0.66, y:  0.14, temp: 'yellow' },
          { isHelper: true,     x: -0.06, y: -0.14, temp: 'white',  faint: 0.30 },
          { isHelper: true,     x:  0.52, y:  0.52, temp: 'orange', faint: 0.26 }
        ],
        // 0:Java, 1:Python, 2:TS, 3:SQL, 4:C++, 5:JS, 6:H1, 7:H2
        edges: [[0, 6], [6, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 7]]
      },
      {
        key: 'backend',
        title: 'Backend Development',
        color: '#10B981',
        rgb: '16, 185, 129',
        skyOffset: { x: 740, y: -260 },
        nebulaTint: [75, 175, 155],
        // Asymmetric Big Dipper ladle + crooked handle
        stars: [
          { tech: 'Spring Boot',       x: -0.68, y: -0.36, temp: 'yellow' },
          { tech: 'Django REST',       x: -0.12, y: -0.56, temp: 'white' },
          { tech: 'FastAPI',           x:  0.54, y: -0.44, temp: 'blue-white' },
          { tech: 'REST APIs',         x:  0.68, y:  0.14, temp: 'yellow' },
          { tech: 'Microservices',     x:  0.22, y:  0.54, temp: 'white' },
          { tech: 'JWT Auth',          x: -0.36, y:  0.58, temp: 'orange' },
          { tech: 'Node.js & Express', x: -0.62, y:  0.18, temp: 'white' },
          { isHelper: true,            x:  0.04, y: -0.06, temp: 'white',  faint: 0.28 },
          { isHelper: true,            x:  0.28, y:  0.12, temp: 'yellow', faint: 0.26 }
        ],
        // 0:Spring, 1:Django, 2:FastAPI, 3:REST, 4:Micro, 5:JWT, 6:Node, 7:H1, 8:H2
        edges: [[0, 1], [1, 7], [7, 2], [2, 3], [3, 8], [8, 4], [4, 5], [5, 6]]
      },
      {
        key: 'frontend',
        title: 'Front End',
        color: '#38BDF8',
        rgb: '56, 189, 248',
        skyOffset: { x: -680, y: 310 },
        nebulaTint: [85, 145, 220],
        // Directly modeled on hand-drawn sketch: irregular zig-zag with middle unlabeled helper star
        stars: [
          { tech: 'Next.js',             x: -0.66, y: -0.22, temp: 'blue-white' },
          { tech: 'React Native & Expo', x:  0.34, y: -0.56, temp: 'white' },
          { tech: 'React',               x:  0.66, y: -0.08, temp: 'blue-white' },
          { tech: 'HTML5 / CSS3',        x:  0.10, y:  0.22, temp: 'orange' },
          { tech: 'Tailwind CSS',        x: -0.48, y:  0.44, temp: 'yellow' },
          // Unlabeled central helper star at top apex of zig-zag (exact match to sketch)
          { isHelper: true,              x: -0.10, y: -0.54, temp: 'white', faint: 0.34 },
          { isHelper: true,              x: -0.34, y:  0.06, temp: 'white', faint: 0.24 }
        ],
        // 0:Next, 1:RN, 2:React, 3:HTML, 4:Tailwind, 5:H1(mid-top), 6:H2(lower-left)
        edges: [[0, 5], [5, 3], [3, 2], [2, 1], [0, 4], [4, 6]]
      },
      {
        key: 'databases',
        title: 'Databases & Storage',
        color: '#A855F7',
        rgb: '168, 85, 247',
        skyOffset: { x: 520, y: 580 },
        nebulaTint: [135, 105, 195],
        // Draco-inspired winding serpent hook
        stars: [
          { tech: 'PostgreSQL',  x: -0.60, y: -0.34, temp: 'blue-white' },
          { tech: 'Supabase',    x:  0.18, y: -0.54, temp: 'yellow' },
          { tech: 'MySQL',       x:  0.64, y: -0.04, temp: 'orange' },
          { tech: 'H2 Database', x:  0.24, y:  0.50, temp: 'white' },
          { tech: 'MongoDB',     x: -0.48, y:  0.42, temp: 'yellow' },
          { isHelper: true,      x: -0.16, y: -0.06, temp: 'white', faint: 0.30 },
          { isHelper: true,      x: -0.34, y: -0.58, temp: 'white', faint: 0.24 }
        ],
        // 0:PG, 1:Supabase, 2:MySQL, 3:H2, 4:Mongo, 5:H1, 6:H2_aux
        edges: [[6, 0], [0, 1], [1, 5], [5, 2], [2, 3], [3, 4]]
      },
      {
        key: 'ai',
        title: 'Applied AI & Machine Learning',
        color: '#EC4899',
        rgb: '236, 72, 153',
        skyOffset: { x: -860, y: -390 },
        nebulaTint: [175, 100, 155],
        // Asymmetric flying swan / Y-fork
        stars: [
          { tech: 'MediaPipe',            x: -0.64, y: -0.36, temp: 'white' },
          { tech: 'Generative AI & LLMs', x:  0.04, y: -0.60, temp: 'blue-white' },
          { tech: 'RAG & Vector Search',  x:  0.62, y: -0.26, temp: 'yellow' },
          { tech: 'Scikit-Learn',         x:  0.52, y:  0.34, temp: 'orange' },
          { tech: 'Pandas / NumPy',       x: -0.14, y:  0.56, temp: 'yellow' },
          { tech: 'Computer Vision',      x: -0.60, y:  0.22, temp: 'white' },
          { isHelper: true,               x:  0.02, y: -0.04, temp: 'white', faint: 0.34 },
          { isHelper: true,               x: -0.30, y: -0.46, temp: 'white', faint: 0.24 }
        ],
        // 0:MP, 1:GenAI, 2:RAG, 3:Sklearn, 4:Pandas, 5:CV, 6:H1, 7:H2
        edges: [[0, 7], [7, 1], [1, 6], [6, 2], [6, 3], [3, 4], [4, 5]]
      },
      {
        key: 'tools',
        title: 'Developer Tools & Platforms',
        color: '#F97316',
        rgb: '249, 115, 22',
        skyOffset: { x: 980, y: 120 },
        nebulaTint: [195, 130, 90],
        // Perseus-inspired crooked staff with hanging fork
        stars: [
          { tech: 'Git / GitHub',      x: -0.56, y: -0.42, temp: 'white' },
          { tech: 'Docker',            x:  0.26, y: -0.52, temp: 'blue-white' },
          { tech: 'Swagger / OpenAPI', x:  0.66, y:  0.06, temp: 'yellow' },
          { tech: 'Linux / CLI',       x:  0.14, y:  0.54, temp: 'orange' },
          { tech: 'Postman',           x: -0.58, y:  0.32, temp: 'white' },
          { isHelper: true,            x: -0.06, y: -0.12, temp: 'white', faint: 0.30 }
        ],
        // 0:Git, 1:Docker, 2:Swagger, 3:Linux, 4:Postman, 5:H1
        edges: [[0, 5], [5, 1], [1, 2], [5, 3], [5, 4]]
      },
      {
        key: 'cs',
        title: 'Computer Science Fundamentals',
        color: '#6366F1',
        rgb: '99, 102, 241',
        skyOffset: { x: -240, y: -640 },
        nebulaTint: [110, 125, 210],
        // Skewed Cepheus crown (tilted irregular house hook, non-symmetric)
        stars: [
          { tech: 'DSA',               x: -0.58, y: -0.38, temp: 'white' },
          { tech: 'OOP',               x:  0.34, y: -0.56, temp: 'yellow' },
          { tech: 'DBMS',              x:  0.66, y:  0.02, temp: 'blue-white' },
          { tech: 'Operating Systems', x:  0.12, y:  0.54, temp: 'orange' },
          { tech: 'Computer Networks', x: -0.56, y:  0.38, temp: 'white' },
          { isHelper: true,            x: -0.06, y: -0.08, temp: 'white', faint: 0.32 },
          { isHelper: true,            x:  0.46, y:  0.42, temp: 'white', faint: 0.24 }
        ],
        // 0:DSA, 1:OOP, 2:DBMS, 3:OS, 4:Networks, 5:H1, 6:H2
        edges: [[0, 1], [1, 2], [2, 6], [2, 5], [5, 3], [3, 4], [0, 5]]
      }
    ]
  };

  // Strict word-boundary/alias matchers so e.g. Java never matches JavaScript, REST never matches Forest
  const TECH_TAG_MATCHERS = {
    'Java':               [/^java(?:\s+\d+(?:\s+lts)?)?$/i],
    'Python':             [/^python(?:\s+[\d.]+)?$/i],
    'TypeScript':         [/^typescript$/i],
    'JavaScript':         [/^(?:vanilla\s+)?javascript(?:\s*\(.*\))?$/i],
    'SQL':                [/\bsql\b/i, /\bpostgresql\b/i, /\bmysql\b/i, /\bsqlite\b/i, /\bh2\b/i],
    'C / C++':            [/^c\s*\/\s*c\+\+$/i, /^c\+\+$/i],
    'Spring Boot':        [/^spring\s*boot/i, /^spring\s*data\s*jpa$/i],
    'Django REST':        [/^django\s*rest/i],
    'FastAPI':            [/^fastapi$/i],
    'Node.js & Express':  [/^node\.js$/i, /^express$/i],
    'REST APIs':          [/^rest\s*apis?$/i],
    'Microservices':      [/^microservices?$/i],
    'JWT Auth':           [/^jwt/i],
    'React':              [/^react$/i],
    'Next.js':            [/^next\.js/i],
    'React Native & Expo':[/^react\s*native$/i, /^expo$/i],
    'Tailwind CSS':       [/^tailwind\s*css$/i],
    'HTML5 / CSS3':       [/\bhtml5\b/i, /\bcss3\b/i],
    'PostgreSQL':         [/\bpostgresql\b/i],
    'MySQL':              [/\bmysql\b/i],
    'Supabase':           [/\bsupabase\b/i],
    'MongoDB':            [/^mongodb$/i],
    'H2 Database':        [/\bh2\b/i],
    'MediaPipe':          [/mediapipe/i],
    'Computer Vision':    [/computer\s*vision/i, /mediapipe/i],
    'RAG & Vector Search':[/\bpgvector\b/i, /fastembed/i, /\brag\b/i],
    'Scikit-Learn':       [/scikit-learn/i],
    'Generative AI & LLMs':[/gemini\s*api/i, /langgraph/i, /llm/i],
    'Pandas / NumPy':     [/^pandas$/i, /^numpy$/i],
    'Git / GitHub':       [/^git/i],
    'Docker':             [/^docker/i],
    'Postman':            [/^postman$/i],
    'Swagger / OpenAPI':  [/swagger/i, /openapi/i],
    'Linux / CLI':        [/^linux/i],
    'DSA':                [/^dsa$/i],
    'OOP':                [/^oop$/i],
    'DBMS':               [/^dbms$/i],
    'Operating Systems':  [/operating\s*systems/i],
    'Computer Networks':  [/computer\s*networks/i]
  };

  // ── 2. MODULE STATE ────────────────────────────────────────────────────────
  let isInitialized = false;
  let disciplinesEl = null;
  let rootEl = null;
  let skyCanvas = null;
  let skyCtx = null;
  let stageViewportEl = null;
  let leaderSvgEl = null;
  let starsHitLayerEl = null;
  let cardsLayerEl = null;
  let titleEl = null;
  let detailPanelEl = null;
  let listOverlayEl = null;
  let tabsEl = null;
  let listToggleBtn = null;

  let sectorData = [];       // Merged DOM skills + project links + config coords
  let activeSectorIdx = 2;   // Default starts at Languages or Frontend? Wait: index 0 (Languages), tab click switches. Let's default 0!
  activeSectorIdx = 0;

  let hoveredNodeIdx = -1;
  let zoomedStarIdx = -1;
  let isListView = false;
  let prefersReducedMotion = false;

  // Layout state
  let stageW = 1200;
  let stageH = 600;
  let cx = 600;
  let cy = 300;
  let ringRadius = 175;
  let scaleRadius = 155;
  let computedPlacements = []; // { starIdx, screenX, screenY, cardX, cardY, cardW, cardH, cardCornerX, cardCornerY }

  // Sky camera & animation state
  let rafId = null;
  let lastFrameMs = 0;
  let camSkyX = 0;
  let camSkyY = 0;
  let skyPanFrom = { x: 0, y: 0 };
  let skyPanTo = { x: 0, y: 0 };
  let skyPanStartMs = 0;
  let skyPanDurationMs = 0;
  let isPanningSky = false;

  // Star click zoom camera state
  let zoomAlpha = 0;        // 0 = full constellation, 1 = zoomed in on star
  let zoomTargetAlpha = 0;
  let zoomAnimStartMs = 0;
  let zoomFromAlpha = 0;
  let zoomedStarOrigin = { x: 0, y: 0 };

  // Entrance stagger state
  let entranceStartMs = 0;
  let entranceSkipped = false;
  let sharedThreeBackdrop = false;
  let backToSkyBtn = null;

  // Parallax & drift
  let mouseNormX = 0;
  let mouseNormY = 0;
  let smoothMouseX = 0;
  let smoothMouseY = 0;
  let bgStars = [];
  let milkyWayBuffer = null;
  let grainPattern = null;
  let ringAngleRad = 0;

  // Performance FPS watchdog
  let fpsFrames = 0;
  let fpsLastCheckMs = 0;
  let lowFpsStreak = 0;

  // ── 3. DATA HARVESTING FROM DOM + PORTFOLIO_PROJECT_DETAILS ────────────────
  function buildVerifiedSectorData() {
    const projects = (window.PORTFOLIO_PROJECT_DETAILS && Array.isArray(window.PORTFOLIO_PROJECT_DETAILS.projects))
      ? window.PORTFOLIO_PROJECT_DETAILS.projects
      : [];

    // Harvest every existing skill-entry card from #skillsMatrix DOM
    const domSkillMap = new Map(); // catKey -> [{ tech, desc }]
    const groups = disciplinesEl.querySelectorAll('.skills-category-group');
    groups.forEach(grp => {
      const catKey = (grp.getAttribute('data-category') || '').trim();
      if (!catKey) return;
      const items = [];
      grp.querySelectorAll('.skill-entry').forEach(card => {
        const tech = (card.getAttribute('data-tech') || '').trim();
        const descNode = card.querySelector('.skill-entry-desc');
        const desc = descNode ? descNode.textContent.trim() : '';
        if (tech) items.push({ tech, desc });
      });
      domSkillMap.set(catKey, items);
    });

    sectorData = CONSTELLATION_CONFIG.sectors.map(secCfg => {
      const domItems = domSkillMap.get(secCfg.key) || [];
      const descByTech = new Map(domItems.map(d => [d.tech.toLowerCase(), d.desc]));

      const stars = secCfg.stars.map((st, idx) => {
        if (st.isHelper) {
          return {
            idx,
            isHelper: true,
            tech: '',
            desc: '',
            x: st.x,
            y: st.y,
            temp: st.temp || 'white',
            faint: typeof st.faint === 'number' ? st.faint : 0.30,
            usedIn: [],
            brightness: typeof st.faint === 'number' ? st.faint : 0.30
          };
        }

        const desc = descByTech.get(st.tech.toLowerCase()) || '';
        const matchers = TECH_TAG_MATCHERS[st.tech] || [new RegExp(`^${escapeRegExp(st.tech)}$`, 'i')];
        const usedIn = [];

        projects.forEach((proj, pIdx) => {
          const rawTags = [
            ...(proj.architecture && Array.isArray(proj.architecture.stack) ? proj.architecture.stack : []),
            ...(proj.architecture && proj.architecture.stackGrouped
              ? Object.values(proj.architecture.stackGrouped).flat()
              : [])
          ];
          const isUsed = rawTags.some(tag => {
            const cleanTag = String(tag).trim();
            return matchers.some(rx => rx.test(cleanTag));
          });
          if (isUsed) {
            usedIn.push({
              id: proj.id,
              title: proj.title,
              color: proj.color || secCfg.color,
              projectIndex: pIdx
            });
          }
        });

        // Brightness derived strictly from project count (0 -> default faint level)
        const count = usedIn.length;
        const brightness = count === 0
          ? CONSTELLATION_CONFIG.starDefaultFaintness
          : Math.min(1.0, 0.50 + count * 0.18);

        return {
          idx,
          isHelper: false,
          tech: st.tech,
          desc,
          x: st.x,
          y: st.y,
          temp: st.temp || 'white',
          usedIn,
          brightness
        };
      });

      // Mark top 1–2 brightest tech stars ONLY to receive thin diffraction spikes
      const rankedTechs = stars
        .filter(s => !s.isHelper)
        .slice()
        .sort((a, b) => b.usedIn.length - a.usedIn.length || b.brightness - a.brightness);

      // Strictly realistic point-source stars with zero artificial cross spikes
      stars.forEach(s => { s.hasSpikes = false; });

      const techCount = stars.filter(s => !s.isHelper).length;
      return {
        ...secCfg,
        techCount,
        stars
      };
    });
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ── 4. DOM CONSTRUCTION (Semantic HTML Cards + Top Bar + Canvas) ───────────
  function buildDOM() {
    rootEl = document.getElementById('technologyConstellationAtlas');
    if (!rootEl) {
      rootEl = document.createElement('div');
      rootEl.id = 'technologyConstellationAtlas';
      rootEl.className = 'cs-atlas-root';
      const parent = disciplinesEl.querySelector('.atelier-container') || disciplinesEl;
      parent.appendChild(rootEl);
    }

    rootEl.innerHTML = `
      <canvas id="csSkyCanvas" class="cs-sky-canvas" aria-hidden="true"></canvas>
      <div class="cs-sky-vignette" aria-hidden="true"></div>

      <div class="cs-topbar">
        <div id="csCategoryTabs" class="cs-category-tabs" role="tablist" aria-label="Technology sectors"></div>
      </div>

      <div id="csStageViewport" class="cs-stage-viewport">
        <header id="csTitleHeader" class="cs-title-header">
          <h2 id="csConstellationTitle" class="cs-constellation-title"></h2>
          <p class="cs-constellation-legend">Brighter star = used in more projects</p>
        </header>

        <svg id="csLeaderSvg" class="cs-leader-svg" aria-hidden="true"></svg>
        <div id="csStarsHitLayer" class="cs-stars-hit-layer"></div>
        <div id="csCardsLayer" class="cs-cards-layer"></div>

        <!-- Zoom-In Star Detail View -->
        <aside id="csDetailPanel" class="cs-detail-panel" role="dialog" aria-modal="false" aria-label="Technology details">
          <button type="button" id="csDetailBack" class="cs-detail-back">&larr; Back (Esc)</button>
          <div id="csDetailSector" class="cs-detail-sector"></div>
          <h3 id="csDetailTitle" class="cs-detail-title"></h3>
          <p id="csDetailDesc" class="cs-detail-desc"></p>
          <div id="csDetailProjectsWrap" class="cs-detail-projects-wrap">
            <p class="cs-detail-used-heading">Used in:</p>
            <div id="csDetailProjectList" class="cs-detail-project-list"></div>
          </div>
        </aside>
      </div>
    `;

    skyCanvas = rootEl.querySelector('#csSkyCanvas');
    skyCtx = skyCanvas.getContext('2d', { alpha: true });
    stageViewportEl = rootEl.querySelector('#csStageViewport');
    leaderSvgEl = rootEl.querySelector('#csLeaderSvg');
    starsHitLayerEl = rootEl.querySelector('#csStarsHitLayer');
    cardsLayerEl = rootEl.querySelector('#csCardsLayer');
    titleEl = rootEl.querySelector('#csConstellationTitle');
    detailPanelEl = rootEl.querySelector('#csDetailPanel');
    listOverlayEl = rootEl.querySelector('#csListOverlay');
    tabsEl = rootEl.querySelector('#csCategoryTabs');
    backToSkyBtn = null;
    listToggleBtn = null;

    // Build Sector Tabs (counts derived strictly from data)
    sectorData.forEach((sec, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `cs-cat-btn ${idx === activeSectorIdx ? 'is-active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', idx === activeSectorIdx ? 'true' : 'false');
      btn.setAttribute('data-sector', sec.key);
      btn.style.setProperty('--cat-color', sec.color);
      btn.style.setProperty('--cat-rgb', sec.rgb);
      btn.innerHTML = `
        <span class="cs-cat-dot" aria-hidden="true"></span>
        <span>${escapeHtml(sec.title)}</span>
        <span class="cs-cat-count">${sec.techCount}</span>
      `;
      btn.addEventListener('click', () => {
        const WAYPOINTS = [0.670, 0.710, 0.750, 0.790, 0.830, 0.870, 0.910];
        if (window.MasterJourneyController && typeof window.MasterJourneyController.setTargetProgress === 'function') {
          window.MasterJourneyController.setTargetProgress(WAYPOINTS[idx], true);
        } else {
          switchSector(idx);
        }
      });
      tabsEl.appendChild(btn);
    });

    rootEl.querySelector('#csDetailBack').addEventListener('click', exitStarDetail);

    // Click empty sky to close detail if clicking background
    stageViewportEl.addEventListener('click', (e) => {
      if (!entranceSkipped && performance.now() - entranceStartMs < 2400) {
        entranceSkipped = true;
      }
      if (zoomedStarIdx >= 0 && !e.target.closest('.cs-detail-panel') && !e.target.closest('.cs-star-hit') && !e.target.closest('.cs-tech-card')) {
        exitStarDetail();
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', onKeyDown);

    // Parallax mouse listener
    window.addEventListener('mousemove', (e) => {
      if (prefersReducedMotion) return;
      mouseNormX = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      mouseNormY = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
    }, { passive: true });

    // Populate List View DOM once from verified data
    populateListView();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  // ── 5. DEEP SPACE SKY GENERATION (Milky Way, Dust Lanes, Grain, Stars) ─────
  function initSkyAssets() {
    generateBackgroundStars(CONSTELLATION_CONFIG.maxDesktopBgStars);
    buildMilkyWayBuffer();
    buildGrainPattern();
    sizeCanvas();
  }

  function generateBackgroundStars(count) {
    bgStars = [];
    // Seeded PRNG for reproducible natural night sky
    let seed = 42197;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const temps = ['blue-white', 'white', 'white', 'yellow', 'orange'];
    for (let i = 0; i < count; i++) {
      // Astronomical luminosity distribution: power law -> mostly faint stars, very few bright
      const lum = Math.pow(rand(), 4.2);
      const layer = i % 3;
      bgStars.push({
        x: rand() * 3400 - 1100,
        y: rand() * 2400 - 700,
        r: 0.45 + lum * 1.45,
        alpha: 0.14 + lum * 0.72,
        layer,
        temp: temps[Math.floor(rand() * temps.length)],
        phase: rand() * Math.PI * 2
      });
    }
  }

  function buildMilkyWayBuffer() {
    // Low-res offscreen sky glow stretched smoothly (fast & zero physical images!)
    const w = 480;
    const h = 300;
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const ctx = off.getContext('2d');

    ctx.clearRect(0, 0, w, h);

    // Subtle diagonal Milky Way galactic plane wash
    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.rotate(-0.36);
    const bandGrad = ctx.createLinearGradient(0, -110, 0, 110);
    bandGrad.addColorStop(0.0, 'rgba(30, 42, 68, 0)');
    bandGrad.addColorStop(0.32, 'rgba(46, 62, 96, 0.11)');
    bandGrad.addColorStop(0.50, 'rgba(78, 94, 130, 0.17)');
    bandGrad.addColorStop(0.68, 'rgba(46, 62, 96, 0.11)');
    bandGrad.addColorStop(1.0, 'rgba(30, 42, 68, 0)');
    ctx.fillStyle = bandGrad;
    ctx.fillRect(-w, -115, w * 2, 230);

    // Subtle dark dust lanes slicing through the Milky Way band
    const dustPatches = [
      { x: -120, y: -4, rx: 110, ry: 12, a: 0.55 },
      { x: 40,   y:  8, rx: 145, ry: 14, a: 0.58 },
      { x: -30,  y: -14, rx: 85, ry:  9, a: 0.45 },
      { x: 140,  y: -6, rx:  95, ry: 11, a: 0.48 }
    ];
    ctx.globalCompositeOperation = 'destination-out';
    dustPatches.forEach(d => {
      const rg = ctx.createRadialGradient(d.x, d.y, 1, d.x, d.y, d.rx);
      rg.addColorStop(0, `rgba(0,0,0,${d.a})`);
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.save();
      ctx.scale(1, d.ry / d.rx);
      ctx.beginPath();
      ctx.arc(d.x, d.y * (d.rx / d.ry), d.rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();
    milkyWayBuffer = off;
  }

  function buildGrainPattern() {
    const size = 96;
    const off = document.createElement('canvas');
    off.width = size;
    off.height = size;
    const ctx = off.getContext('2d');
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.floor(Math.random() * 255);
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    grainPattern = skyCtx.createPattern(off, 'repeat');
  }

  function sizeCanvas() {
    if (!skyCanvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    skyCanvas.width = Math.floor(vw * dpr);
    skyCanvas.height = Math.floor(vh * dpr);
    skyCanvas.style.width = vw + 'px';
    skyCanvas.style.height = vh + 'px';
    skyCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ── 6. ZERO-CROSSING PERIMETER AUTO-LAYOUT & LEADER LINES (PHASE 1) ────────
  function computeConstellationLayout() {
    if (!stageViewportEl || !cardsLayerEl || !starsHitLayerEl || !leaderSvgEl) return;

    const sec = sectorData[activeSectorIdx];
    if (!sec) return;

    const vpRect = stageViewportEl.getBoundingClientRect();
    stageW = Math.max(320, vpRect.width);
    stageH = Math.max(300, vpRect.height);

    const isMobile = window.innerWidth <= 820;

    // Header clearance under "Constellation: <Name>" + legend
    const headerRect = titleEl ? titleEl.parentElement.getBoundingClientRect() : { height: 54 };
    const safeTop = Math.max(54, headerRect.height + 12);

    if (isMobile) {
      // Mobile: scale constellation cleanly above the bottom swipeable card strip
      const stripReserve = 165;
      const availH = Math.max(200, stageH - safeTop - stripReserve);
      cx = stageW * 0.5;
      cy = safeTop + availH * 0.49;
      ringRadius = Math.min(stageW * 0.36, availH * 0.42, 138);
      scaleRadius = ringRadius * 0.80;

      renderMobileCardsAndHits(sec);
      return;
    }

    // Desktop & Laptop: spacious central constellation + perimeter real HTML cards
    cardsLayerEl.classList.remove('is-mobile-strip');
    const padX = Math.max(18, Math.min(44, stageW * 0.032));
    const safeBottom = stageH - 12;
    const safeH = Math.max(260, safeBottom - safeTop);

    // Center the constellation cleanly in the open dark space
    cx = stageW * 0.5;
    cy = safeTop + safeH * 0.51;

    const cardW = Math.round(Math.max(225, Math.min(278, stageW * 0.195)));
    // Leave wide empty dark margin between cards and dashed ring
    const maxRingByW = (stageW - (padX * 2 + cardW * 2 + 110)) * 0.5;
    const maxRingByH = safeH * 0.40;
    ringRadius = Math.max(118, Math.min(maxRingByW, maxRingByH, 218));
    scaleRadius = ringRadius * 0.84;

    // 1. Build HTML cards first so we measure exact wrapped height cleanly
    cardsLayerEl.innerHTML = '';
    starsHitLayerEl.innerHTML = '';

    const techStars = sec.stars.filter(s => !s.isHelper);
    const starToScreen = (s) => ({
      sx: cx + s.x * scaleRadius,
      sy: cy + s.y * scaleRadius
    });

    // Sort tech stars in strict clockwise order around constellation centroid (cx, cy)
    // Screen coordinates: atan2(y, x) increases clockwise starting from +X (-PI -> +PI)
    const sortedTechStars = techStars.map(s => {
      const { sx, sy } = starToScreen(s);
      const ang = Math.atan2(sy - cy, sx - cx); // [-PI, PI], -PI is left, -PI/2 is top, 0 is right, +PI/2 is bottom
      return { star: s, sx, sy, ang };
    }).sort((a, b) => a.ang - b.ang);

    // Measure every card at fixed cardW
    const cardEls = new Map();
    const cardSizes = new Map();
    sortedTechStars.forEach(({ star }) => {
      const card = createCardElement(star, sec);
      card.style.width = cardW + 'px';
      card.style.left = '-9999px';
      card.style.top = '-9999px';
      cardsLayerEl.appendChild(card);
      const r = card.getBoundingClientRect();
      cardEls.set(star.idx, card);
      cardSizes.set(star.idx, { w: cardW, h: Math.ceil(r.height) });
    });

    // Partition into Left & Right perimeter groups strictly keeping clockwise angle order.
    // Whenever a sector has 7 items (e.g. Backend) or a tight column would exceed available height
    // on 1366x768, assign the lowest star to Bottom-Center and split the remaining items cleanly
    // (at most 3 Left, 3 Right) by sorted clockwise angle rank so neither side ever overflows!
    let bottomItem = null;
    let pool = sortedTechStars;
    if (sortedTechStars.length >= 7 && safeH < 570) {
      let bestBottomDist = Infinity;
      let bestIdx = -1;
      sortedTechStars.forEach((it, idx) => {
        const dAng = Math.abs(it.ang - Math.PI * 0.5);
        if (dAng < bestBottomDist) {
          bestBottomDist = dAng;
          bestIdx = idx;
        }
      });
      if (bestIdx >= 0) {
        bottomItem = sortedTechStars[bestIdx];
        pool = sortedTechStars.filter((_, idx) => idx !== bestIdx);
        cy -= 26;
        ringRadius = Math.max(106, ringRadius - 18);
        scaleRadius = ringRadius * 0.84;
        pool.forEach(it => {
          const p = starToScreen(it.star);
          it.sx = p.sx;
          it.sy = p.sy;
          it.ang = Math.atan2(it.sy - cy, it.sx - cx);
        });
        const bp = starToScreen(bottomItem.star);
        bottomItem.sx = bp.sx;
        bottomItem.sy = bp.sy;
      }
    }

    const leftGroup = [];
    const rightGroup = [];
    pool.forEach(item => {
      if (item.ang <= -Math.PI * 0.5 || item.ang > Math.PI * 0.5) {
        leftGroup.push(item);
      } else {
        rightGroup.push(item);
      }
    });

    // Left column sweeps Bottom -> Top (clockwise); Right column sweeps Top -> Bottom (clockwise)
    leftGroup.sort((a, b) => b.sy - a.sy);
    rightGroup.sort((a, b) => a.sy - b.sy);

    // Balance if 1 side has 4+ cards while opposite side has <=2 cards (keeps cyclic perimeter order!)
    while (leftGroup.length > 3 && rightGroup.length < 3) {
      // Top-most of leftGroup (last element after Bottom->Top sort) crosses over to top of rightGroup,
      // OR bottom-most crosses to bottom of rightGroup without crossing any lines!
      const topLeft = leftGroup[leftGroup.length - 1];
      const botLeft = leftGroup[0];
      if (Math.abs(topLeft.sx - cx) < Math.abs(botLeft.sx - cx)) {
        rightGroup.unshift(leftGroup.pop());
      } else {
        rightGroup.push(leftGroup.shift());
      }
    }
    while (rightGroup.length > 3 && leftGroup.length < 3) {
      const topRight = rightGroup[0];
      const botRight = rightGroup[rightGroup.length - 1];
      if (Math.abs(topRight.sx - cx) < Math.abs(botRight.sx - cx)) {
        leftGroup.push(rightGroup.shift());
      } else {
        leftGroup.unshift(rightGroup.pop());
      }
    }

    // Reserve exact sub-pixel space strictly above collapsed NAV.AVIONICS chip
    const hudEl = document.getElementById('journeyTelemetryHud');
    const hudRect = hudEl ? hudEl.getBoundingClientRect() : null;
    const rightMaxBottom = (hudRect && hudRect.height > 0 && hudRect.top > vpRect.top)
      ? Math.min(safeBottom - 8, (hudRect.top - vpRect.top) - 16)
      : (safeBottom - 54);
    const rightTopLimit = safeTop + 2;

    // If a column still overflows rightMaxBottom/safeBottom even after compacting (e.g. Languages Right: Python+TS+SQL),
    // promote its lowest card into Bottom-Center when bottomItem is free so ZERO cards ever collide or clamp-overlap!
    const estHeight = (items) => items.reduce((s, it) => s + cardSizes.get(it.star.idx).h, 0) + Math.max(0, items.length - 1) * 8;
    if (!bottomItem && safeH < 580) {
      if (estHeight(rightGroup) > (rightMaxBottom - rightTopLimit) && rightGroup.length >= 3) {
        bottomItem = rightGroup.pop();
      } else if (estHeight(leftGroup) > (safeBottom - (safeTop + 2)) && leftGroup.length >= 3) {
        bottomItem = leftGroup.shift();
      }
      if (bottomItem) {
        cy -= 24;
        ringRadius = Math.max(106, ringRadius - 16);
        scaleRadius = ringRadius * 0.84;
        [...leftGroup, ...rightGroup, bottomItem].forEach(it => {
          const p = starToScreen(it.star);
          it.sx = p.sx;
          it.sy = p.sy;
          it.ang = Math.atan2(it.sy - cy, it.sx - cx);
        });
      }
    }

    // Distribute vertical slots inside column with zero overlap and zero clipping
    function layoutColumn(items, isRight) {
      if (!items.length) return [];
      const topLimit = isRight ? rightTopLimit : (safeTop + 2);
      const botLimit = isRight ? rightMaxBottom : safeBottom;
      const availColH = botLimit - topLimit;
      let colCardW = cardW;
      let totalCardH = items.reduce((sum, it) => sum + cardSizes.get(it.star.idx).h, 0);
      let minGap = items.length >= 3 && availColH < 430 ? 8 : 12;

      // Widen slightly & tighten vertical padding when 3 tall cards share a tight column (e.g. SQL / Python)
      if (items.length >= 3 && totalCardH + minGap * (items.length - 1) > availColH) {
        colCardW = Math.min(305, Math.round(stageW * 0.228));
        items.forEach(it => {
          const el = cardEls.get(it.star.idx);
          el.style.width = colCardW + 'px';
          el.style.padding = '7px 11px';
          const descEl = el.querySelector('.cs-card-desc');
          if (descEl) descEl.style.lineHeight = '1.24';
          const usedEl = el.querySelector('.cs-card-used-in');
          if (usedEl) usedEl.style.marginTop = '3px';
          const nr = el.getBoundingClientRect();
          cardSizes.set(it.star.idx, { w: colCardW, h: Math.ceil(nr.height) });
        });
        totalCardH = items.reduce((sum, it) => sum + cardSizes.get(it.star.idx).h, 0);
      }

      const placed = items.map((it, i) => {
        const h = cardSizes.get(it.star.idx).h;
        let targetY;
        if (items.length === 2) {
          targetY = i === 0
            ? (isRight ? topLimit + 6 : botLimit - h - 6)
            : (isRight ? botLimit - h - 6 : topLimit + 6);
        } else {
          targetY = Math.max(topLimit, Math.min(botLimit - h, it.sy - h * 0.5));
        }
        return {
          ...it,
          cardW: colCardW,
          cardH: h,
          cardX: isRight ? (stageW - padX - colCardW) : padX,
          cardY: targetY
        };
      });

      if (isRight) {
        for (let i = 1; i < placed.length; i++) {
          const minY = placed[i - 1].cardY + placed[i - 1].cardH + minGap;
          if (placed[i].cardY < minY) placed[i].cardY = minY;
        }
        const last = placed[placed.length - 1];
        if (last.cardY + last.cardH > botLimit) {
          last.cardY = botLimit - last.cardH;
          for (let i = placed.length - 2; i >= 0; i--) {
            const maxY = placed[i + 1].cardY - placed[i].cardH - minGap;
            if (placed[i].cardY > maxY) placed[i].cardY = maxY;
          }
        }
      } else {
        for (let i = 1; i < placed.length; i++) {
          const maxY = placed[i - 1].cardY - placed[i].cardH - minGap;
          if (placed[i].cardY > maxY) placed[i].cardY = maxY;
        }
        const last = placed[placed.length - 1];
        if (last.cardY < topLimit) {
          last.cardY = topLimit;
          for (let i = placed.length - 2; i >= 0; i--) {
            const minY = placed[i + 1].cardY + placed[i + 1].cardH + minGap;
            if (placed[i].cardY < minY) placed[i].cardY = minY;
          }
        }
      }

      // Hard clamp strictly within [topLimit, botLimit] if 3 very tall cards (e.g. Languages SQL)
      if (totalCardH + minGap * (items.length - 1) > availColH) {
        const orderedTopDown = isRight ? placed : placed.slice().reverse();
        const shrinkMax = Math.max(4, availColH - minGap * (items.length - 1));
        if (totalCardH > shrinkMax) {
          orderedTopDown.forEach(p => {
            const el = cardEls.get(p.star.idx);
            const titleElCard = el.querySelector('.cs-card-title');
            if (titleElCard) titleElCard.style.marginBottom = '2px';
            el.style.padding = '6px 10px';
            p.cardH = Math.ceil(el.getBoundingClientRect().height);
          });
          totalCardH = orderedTopDown.reduce((sum, p) => sum + p.cardH, 0);
        }
        let cursor = topLimit;
        const tightGap = Math.max(4, Math.floor((availColH - totalCardH) / Math.max(1, items.length - 1)));
        orderedTopDown.forEach(p => {
          p.cardY = Math.min(cursor, botLimit - p.cardH);
          cursor = p.cardY + p.cardH + tightGap;
        });
      }
      return placed;
    }

    const leftPlaced = layoutColumn(leftGroup, false);
    const rightPlaced = layoutColumn(rightGroup, true);
    computedPlacements = [...leftPlaced, ...rightPlaced];

    if (bottomItem) {
      const bEl = cardEls.get(bottomItem.star.idx);
      const bW = Math.min(340, Math.round(stageW * 0.28));
      bEl.style.width = bW + 'px';
      bEl.style.padding = '7px 12px';
      const br = bEl.getBoundingClientRect();
      const bH = Math.ceil(br.height);
      computedPlacements.push({
        ...bottomItem,
        cardW: bW,
        cardH: bH,
        cardX: Math.round(cx - bW * 0.5),
        cardY: Math.round(safeBottom - bH - 6)
      });
    }

    // Apply DOM positions & build star hit-targets + star name labels + SVG leader lines
    const vpWidthPx = Math.round(stageW);
    const vpHeightPx = Math.round(stageH);
    leaderSvgEl.setAttribute('viewBox', `0 0 ${vpWidthPx} ${vpHeightPx}`);
    leaderSvgEl.innerHTML = '';

    // Place tech star labels & hit buttons avoiding overlap with constellation edges/cards
    sec.stars.forEach(s => {
      const { sx, sy } = starToScreen(s);
      if (s.isHelper) return;

      const hitBtn = document.createElement('button');
      hitBtn.type = 'button';
      hitBtn.className = 'cs-star-hit';
      hitBtn.setAttribute('data-star-idx', String(s.idx));
      hitBtn.setAttribute('aria-label', `${s.tech}: ${s.desc}`);
      hitBtn.style.left = sx.toFixed(1) + 'px';
      hitBtn.style.top = sy.toFixed(1) + 'px';
      hitBtn.addEventListener('mouseenter', () => setHoverNode(s.idx));
      hitBtn.addEventListener('mouseleave', () => setHoverNode(-1));
      hitBtn.addEventListener('focus', () => setHoverNode(s.idx));
      hitBtn.addEventListener('blur', () => setHoverNode(-1));
      hitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        enterStarDetail(s.idx);
      });
      starsHitLayerEl.appendChild(hitBtn);
    });

    computedPlacements.forEach(p => {
      const card = cardEls.get(p.star.idx);
      card.style.left = Math.round(p.cardX) + 'px';
      card.style.top = Math.round(p.cardY) + 'px';
      card.style.width = p.cardW + 'px';

      // Nearest corner of card facing the star (with subtle chamfer elbow <= 1 bend)
      const corners = [
        { x: p.cardX, y: p.cardY },
        { x: p.cardX + p.cardW, y: p.cardY },
        { x: p.cardX, y: p.cardY + p.cardH },
        { x: p.cardX + p.cardW, y: p.cardY + p.cardH }
      ];
      let bestCorner = corners[0];
      let bestDist = Infinity;
      corners.forEach(c => {
        const d = Math.hypot(c.x - p.sx, c.y - p.sy);
        if (d < bestDist) {
          bestDist = d;
          bestCorner = c;
        }
      });

      // Tiny ring center sits on the star; line exits outward cleanly from ring edge (r=6)
      const ringR = 6;
      const dx = bestCorner.x - p.sx;
      const dy = bestCorner.y - p.sy;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const ux = dx / dist;
      const uy = dy / dist;
      const startX = p.sx + ux * ringR;
      const startY = p.sy + uy * ringR;

      // Single clean chamfer bend or straight line (like the hand sketch!)
      let dAttr;
      const horizGap = Math.abs(bestCorner.x - startX);
      if (horizGap > 48 && Math.abs(bestCorner.y - startY) > 16) {
        const elbowX = bestCorner.x + (bestCorner.x < p.sx ? 22 : -22);
        const elbowY = bestCorner.y;
        dAttr = `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${elbowX.toFixed(1)} ${elbowY.toFixed(1)} L ${bestCorner.x.toFixed(1)} ${bestCorner.y.toFixed(1)}`;
      } else {
        dAttr = `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${bestCorner.x.toFixed(1)} ${bestCorner.y.toFixed(1)}`;
      }

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'cs-leader-group');
      g.setAttribute('data-star-idx', String(p.star.idx));
      g.style.setProperty('--cat-color', sec.color);
      g.style.setProperty('--cat-rgb', sec.rgb);

      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', p.sx.toFixed(1));
      ring.setAttribute('cy', p.sy.toFixed(1));
      ring.setAttribute('r', String(ringR));
      ring.setAttribute('class', 'cs-leader-ring');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', dAttr);
      path.setAttribute('class', 'cs-leader-path');

      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', bestCorner.x.toFixed(1));
      dot.setAttribute('cy', bestCorner.y.toFixed(1));
      dot.setAttribute('r', '2');
      dot.setAttribute('class', 'cs-leader-dot');

      g.appendChild(ring);
      g.appendChild(path);
      g.appendChild(dot);
      leaderSvgEl.appendChild(g);

      p.cornerX = bestCorner.x;
      p.cornerY = bestCorner.y;
    });

    syncHoverClasses();
  }

  function renderMobileCardsAndHits(sec) {
    cardsLayerEl.innerHTML = '';
    cardsLayerEl.classList.add('is-mobile-strip');
    starsHitLayerEl.innerHTML = '';
    leaderSvgEl.innerHTML = '';
    computedPlacements = [];

    const techStars = sec.stars.filter(s => !s.isHelper);
    techStars.forEach(s => {
      const sx = cx + s.x * scaleRadius;
      const sy = cy + s.y * scaleRadius;

      const card = createCardElement(s, sec);
      cardsLayerEl.appendChild(card);

      // Push mobile star name label gently outward radially from center to clear constellation lines
      const radDist = Math.max(1, Math.hypot(sx - cx, sy - cy));
      const ux = (sx - cx) / radDist;
      const uy = (sy - cy) / radDist;
      const lblX = Math.max(58, Math.min(stageW - 58, sx + ux * 18));
      const lblY = sy + uy * 16 + (uy >= 0 ? 8 : -16);

      const lbl = document.createElement('span');
      lbl.className = 'cs-star-label';
      lbl.setAttribute('data-star-idx', String(s.idx));
      lbl.textContent = s.tech;
      lbl.style.left = lblX.toFixed(1) + 'px';
      lbl.style.top = lblY.toFixed(1) + 'px';
      lbl.style.transform = 'translateX(-50%)';
      starsHitLayerEl.appendChild(lbl);

      const hitBtn = document.createElement('button');
      hitBtn.type = 'button';
      hitBtn.className = 'cs-star-hit';
      hitBtn.setAttribute('data-star-idx', String(s.idx));
      hitBtn.setAttribute('aria-label', `${s.tech}: ${s.desc}`);
      hitBtn.style.left = sx.toFixed(1) + 'px';
      hitBtn.style.top = sy.toFixed(1) + 'px';
      hitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setHoverNode(s.idx);
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      starsHitLayerEl.appendChild(hitBtn);
      computedPlacements.push({ star: s, sx, sy });
    });
  }

  function createCardElement(star, sec) {
    const card = document.createElement('article');
    card.className = 'cs-tech-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('data-star-idx', String(star.idx));
    card.style.setProperty('--cat-color', sec.color);
    card.style.setProperty('--cat-rgb', sec.rgb);

    const usedHtml = star.usedIn.length > 0
      ? `<p class="cs-card-used-in"><span class="cs-card-used-label">Used in:</span> ${star.usedIn.map(u => escapeHtml(u.title)).join(', ')}</p>`
      : '';

    card.innerHTML = `
      <h3 class="cs-card-title">${escapeHtml(star.tech)}</h3>
      <p class="cs-card-desc">${escapeHtml(star.desc)}</p>
      ${usedHtml}
      <div class="cs-card-action-cue">
        <span>Click to view detailed info</span>
        <span class="cs-card-cue-arrow" aria-hidden="true">&rsaquo;</span>
      </div>
    `;

    card.addEventListener('mouseenter', () => setHoverNode(star.idx));
    card.addEventListener('mouseleave', () => setHoverNode(-1));
    card.addEventListener('focus', () => setHoverNode(star.idx));
    card.addEventListener('blur', () => setHoverNode(-1));
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      enterStarDetail(star.idx);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enterStarDetail(star.idx);
      }
    });
    return card;
  }

  // ── 7. HOVER / EXPLORE INTERACTION / PAN & ZOOM ────────────────────────────
  function setHoverNode(idx) {
    if (zoomedStarIdx >= 0) return;
    hoveredNodeIdx = idx;
    syncHoverClasses();
  }

  function syncHoverClasses() {
    const hasHover = hoveredNodeIdx >= 0;
    if (cardsLayerEl) {
      cardsLayerEl.querySelectorAll('.cs-tech-card').forEach(el => {
        const sIdx = Number(el.getAttribute('data-star-idx'));
        el.classList.toggle('is-highlighted', hasHover && sIdx === hoveredNodeIdx);
        el.classList.toggle('is-dimmed', hasHover && sIdx !== hoveredNodeIdx);
      });
    }
    if (leaderSvgEl) {
      leaderSvgEl.querySelectorAll('.cs-leader-group').forEach(el => {
        const sIdx = Number(el.getAttribute('data-star-idx'));
        el.classList.toggle('is-highlighted', hasHover && sIdx === hoveredNodeIdx);
        el.classList.toggle('is-dimmed', hasHover && sIdx !== hoveredNodeIdx);
      });
    }
    if (starsHitLayerEl) {
      starsHitLayerEl.querySelectorAll('.cs-star-label').forEach(el => {
        const sIdx = Number(el.getAttribute('data-star-idx'));
        el.classList.toggle('is-highlighted', hasHover && sIdx === hoveredNodeIdx);
        el.classList.toggle('is-dimmed', hasHover && sIdx !== hoveredNodeIdx);
      });
    }
  }

  function switchSector(newIdx, opts) {
    const o = opts || {};
    if (newIdx < 0 || newIdx >= sectorData.length) return;
    if (isListView) {
      toggleListView();
    }
    if (zoomedStarIdx >= 0) {
      exitStarDetail(true);
    }

    const oldOffset = sectorData[activeSectorIdx].skyOffset;
    activeSectorIdx = newIdx;
    const sec = sectorData[activeSectorIdx];
    hoveredNodeIdx = -1;

    // Update tab aria states
    tabsEl.querySelectorAll('.cs-cat-btn').forEach((btn, i) => {
      const act = i === activeSectorIdx;
      btn.classList.toggle('is-active', act);
      btn.setAttribute('aria-selected', act ? 'true' : 'false');
    });

    // Update title ("Constellation: Front End")
    if (titleEl) titleEl.textContent = `Constellation: ${sec.title}`;
    rootEl.style.setProperty('--cat-color', sec.color);
    rootEl.style.setProperty('--cat-rgb', sec.rgb);

    // Camera sky pan animation across patches (~1.85s or instant if requested / reduced motion)
    skyPanFrom = { x: camSkyX, y: camSkyY };
    skyPanTo = { x: sec.skyOffset.x, y: sec.skyOffset.y };
    skyPanStartMs = performance.now();
    skyPanDurationMs = (prefersReducedMotion || o.instant) ? 0 : CONSTELLATION_CONFIG.sectorPanDurationMs;
    isPanningSky = !prefersReducedMotion && !o.instant && (oldOffset.x !== sec.skyOffset.x || oldOffset.y !== sec.skyOffset.y);

    // Start staggered entrance timeline unless handoff already aligned 3D stars
    entranceStartMs = performance.now();
    entranceSkipped = prefersReducedMotion || Boolean(o.skipEntrance);

    computeConstellationLayout();
    if (!o.fromThree && window.GalaxyJourney && typeof window.GalaxyJourney.setActiveDetailSector === 'function') {
      window.GalaxyJourney.setActiveDetailSector(activeSectorIdx);
    }
  }

  function enterStarDetail(starIdx) {
    const sec = sectorData[activeSectorIdx];
    const star = sec && sec.stars[starIdx];
    if (!star || star.isHelper) return;

    zoomedStarIdx = starIdx;
    hoveredNodeIdx = -1;
    zoomedStarOrigin = {
      x: cx + star.x * scaleRadius,
      y: cy + star.y * scaleRadius
    };

    zoomFromAlpha = zoomAlpha;
    zoomTargetAlpha = 1;
    zoomAnimStartMs = performance.now();
    if (prefersReducedMotion) zoomAlpha = 1;

    // Populate clean Detail Panel
    rootEl.querySelector('#csDetailSector').textContent = `Constellation: ${sec.title}`;
    rootEl.querySelector('#csDetailTitle').textContent = star.tech;
    rootEl.querySelector('#csDetailDesc').textContent = star.desc;

    const projWrap = rootEl.querySelector('#csDetailProjectsWrap');
    const projList = rootEl.querySelector('#csDetailProjectList');
    projList.innerHTML = '';

    if (star.usedIn.length > 0) {
      projWrap.style.display = 'block';
      star.usedIn.forEach(proj => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cs-detail-project-btn';
        btn.innerHTML = `<span>${escapeHtml(proj.title)}</span><span aria-hidden="true">&rarr;</span>`;
        btn.addEventListener('click', () => flyToProjectPlanet(proj.projectIndex));
        projList.appendChild(btn);
      });
    } else {
      projWrap.style.display = 'none';
    }

    detailPanelEl.classList.add('is-visible');
    // Fade constellation periphery smoothly
    if (cardsLayerEl) { cardsLayerEl.style.opacity = '0'; cardsLayerEl.style.pointerEvents = 'none'; }
    if (leaderSvgEl) { leaderSvgEl.style.opacity = '0'; }
    if (starsHitLayerEl) { starsHitLayerEl.style.opacity = '0'; starsHitLayerEl.style.pointerEvents = 'none'; }
    if (titleEl && titleEl.parentElement) { titleEl.parentElement.style.opacity = '0'; }

    const backBtn = rootEl.querySelector('#csDetailBack');
    if (backBtn) setTimeout(() => backBtn.focus(), 60);
  }

  function exitStarDetail(instant = false) {
    if (zoomedStarIdx < 0 && zoomTargetAlpha === 0) return;
    zoomedStarIdx = -1;
    zoomFromAlpha = zoomAlpha;
    zoomTargetAlpha = 0;
    zoomAnimStartMs = performance.now();
    if (instant || prefersReducedMotion) zoomAlpha = 0;

    if (detailPanelEl) detailPanelEl.classList.remove('is-visible');
    if (cardsLayerEl) { cardsLayerEl.style.opacity = '1'; cardsLayerEl.style.pointerEvents = ''; }
    if (leaderSvgEl) { leaderSvgEl.style.opacity = '1'; }
    if (starsHitLayerEl) { starsHitLayerEl.style.opacity = '1'; starsHitLayerEl.style.pointerEvents = ''; }
    if (titleEl && titleEl.parentElement) { titleEl.parentElement.style.opacity = '1'; }
    syncHoverClasses();
  }

  function flyToProjectPlanet(projectIndex) {
    exitStarDetail(true);
    if (isListView) toggleListView();
    if (window.GalaxyJourney && typeof window.GalaxyJourney.closeConstellationDetail === 'function') {
      window.GalaxyJourney.closeConstellationDetail(true);
    }
    if (window.GalaxyJourney && typeof window.GalaxyJourney.jumpToProject === 'function') {
      window.GalaxyJourney.jumpToProject(projectIndex);
    }
  }

  function toggleListView() {
    isListView = !isListView;
    if (listToggleBtn) listToggleBtn.setAttribute('aria-pressed', isListView ? 'true' : 'false');
    if (listOverlayEl) listOverlayEl.classList.toggle('is-visible', isListView);
  }

  function populateListView() {
    if (!listOverlayEl) return;
    const totalTech = sectorData.reduce((s, c) => s + c.techCount, 0);
    let html = `<div class="cs-list-grid-wrap">`;
    sectorData.forEach(sec => {
      html += `<section aria-label="${escapeHtml(sec.title)}">
        <h3 class="cs-list-sector-heading">
          <span>${escapeHtml(sec.title)}</span>
          <span class="cs-list-sector-count">${sec.techCount} of ${totalTech}</span>
        </h3>
        <div class="cs-list-items">`;
      sec.stars.filter(s => !s.isHelper).forEach(st => {
        const projHtml = st.usedIn.length > 0
          ? `<div class="cs-list-item-used"><span>Used in:</span> ${st.usedIn.map(p =>
              `<button type="button" class="cs-list-project-btn" data-project-idx="${p.projectIndex}">${escapeHtml(p.title)} &rarr;</button>`
            ).join('')}</div>`
          : '';
        html += `
          <article class="cs-list-item">
            <h4 class="cs-list-item-name">${escapeHtml(st.tech)}</h4>
            <p class="cs-list-item-desc">${escapeHtml(st.desc)}</p>
            ${projHtml}
          </article>`;
      });
      html += `</div></section>`;
    });
    html += `</div>`;
    listOverlayEl.innerHTML = html;

    listOverlayEl.querySelectorAll('.cs-list-project-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pIdx = Number(btn.getAttribute('data-project-idx'));
        flyToProjectPlanet(pIdx);
      });
    });
  }

  function onKeyDown(e) {
    // Only handle Esc / Tab arrows when Sector 04 (#disciplines) is active
    if (!disciplinesEl || disciplinesEl.style.visibility === 'hidden' || parseFloat(disciplinesEl.style.opacity || '1') < 0.2) {
      return;
    }
    if (e.key === 'Escape') {
      if (zoomedStarIdx >= 0) {
        e.preventDefault();
        exitStarDetail();
        return;
      }
      if (isListView) {
        e.preventDefault();
        toggleListView();
        return;
      }
      if (window.GalaxyJourney && typeof window.GalaxyJourney.closeConstellationDetail === 'function') {
        e.preventDefault();
        window.GalaxyJourney.closeConstellationDetail();
        return;
      }
    }
    if (document.activeElement && document.activeElement.classList.contains('cs-cat-btn')) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = (activeSectorIdx + 1) % sectorData.length;
        switchSector(next);
        tabsEl.children[next].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = (activeSectorIdx - 1 + sectorData.length) % sectorData.length;
        switchSector(prev);
        tabsEl.children[prev].focus();
      }
    }
  }

  // ── 8. REAL ASTRONOMICAL RENDER LOOP (CANVAS 2D) ───────────────────────────
  function isDisciplinesVisible() {
    if (document.hidden || !disciplinesEl) return false;
    if (document.documentElement.getAttribute('data-theme') !== 'space') return false;
    const style = window.getComputedStyle(disciplinesEl);
    return style.visibility !== 'hidden' && parseFloat(style.opacity) > 0.02;
  }

  function startRenderLoop() {
    if (rafId) cancelAnimationFrame(rafId);
    lastFrameMs = performance.now();
    fpsLastCheckMs = lastFrameMs;
    const tick = (now) => {
      rafId = requestAnimationFrame(tick);
      if (!isDisciplinesVisible()) return;
      renderFrame(now);
    };
    rafId = requestAnimationFrame(tick);
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function renderFrame(now) {
    const dt = Math.min(0.1, (now - lastFrameMs) / 1000);
    lastFrameMs = now;

    // Adaptive FPS check (Phase 6: automatically trim background star count if FPS < 45)
    fpsFrames++;
    if (now - fpsLastCheckMs >= 1000) {
      const fps = fpsFrames * 1000 / (now - fpsLastCheckMs);
      fpsFrames = 0;
      fpsLastCheckMs = now;
      if (fps < CONSTELLATION_CONFIG.fpsThreshold) {
        lowFpsStreak++;
        if (lowFpsStreak >= 2 && bgStars.length > CONSTELLATION_CONFIG.minBgStarsAfterThrottle) {
          bgStars.length = Math.max(CONSTELLATION_CONFIG.minBgStarsAfterThrottle, Math.floor(bgStars.length * 0.68));
        }
      } else {
        lowFpsStreak = 0;
      }
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const sec = sectorData[activeSectorIdx];
    if (!sec) return;

    // Smooth camera pan across deep space
    if (isPanningSky) {
      const p = Math.min(1, (now - skyPanStartMs) / Math.max(1, skyPanDurationMs));
      const ep = easeInOutCubic(p);
      camSkyX = skyPanFrom.x + (skyPanTo.x - skyPanFrom.x) * ep;
      camSkyY = skyPanFrom.y + (skyPanTo.y - skyPanFrom.y) * ep;
      if (p >= 1) isPanningSky = false;
    } else {
      camSkyX = sec.skyOffset.x;
      camSkyY = sec.skyOffset.y;
    }

    // Smooth star push-in zoom progress
    if (!prefersReducedMotion && zoomAlpha !== zoomTargetAlpha) {
      const zp = Math.min(1, (now - zoomAnimStartMs) / CONSTELLATION_CONFIG.cameraZoomDurationMs);
      const ezp = easeInOutCubic(zp);
      zoomAlpha = zoomFromAlpha + (zoomTargetAlpha - zoomFromAlpha) * ezp;
      if (zp >= 1) zoomAlpha = zoomTargetAlpha;
    }

    // Smooth mouse parallax + whisper-slow cosmic drift
    smoothMouseX += (mouseNormX - smoothMouseX) * 0.06;
    smoothMouseY += (mouseNormY - smoothMouseY) * 0.06;
    const driftX = prefersReducedMotion ? 0 : now * CONSTELLATION_CONFIG.skyDriftSpeed * 8;
    const driftY = prefersReducedMotion ? 0 : now * CONSTELLATION_CONFIG.skyDriftSpeed * 3;

    if (!prefersReducedMotion) {
      ringAngleRad += (CONSTELLATION_CONFIG.ringRotationDegPerSec * Math.PI / 180) * dt;
    }

    // Entrance progression (< 2.5s total)
    const elapsed = entranceSkipped ? 9999 : (now - entranceStartMs);
    const totalStars = sec.stars.length;
    const starsReadyAt = totalStars * CONSTELLATION_CONFIG.starAppearDelayMs;
    const lineProg = entranceSkipped ? 1 : Math.max(0, Math.min(1, (elapsed - starsReadyAt * 0.72) / CONSTELLATION_CONFIG.lineDrawDurationMs));
    const ringProg = entranceSkipped ? 1 : Math.max(0, Math.min(1, (elapsed - starsReadyAt * 0.92) / 360));
    const cardsProg = entranceSkipped ? 1 : Math.max(0, Math.min(1, (elapsed - starsReadyAt * 1.02) / 340));

    if (cardsLayerEl && zoomedStarIdx < 0) {
      cardsLayerEl.style.opacity = cardsProg.toFixed(3);
    }
    if (leaderSvgEl && zoomedStarIdx < 0) {
      leaderSvgEl.style.opacity = cardsProg.toFixed(3);
    }

    if (sharedThreeBackdrop) {
      // Transparent layer over #galaxy3DCanvas so 3D Milky Way + stars remain pixel-identical during 3D->2D fade
      skyCtx.clearRect(0, 0, vw, vh);
      if (zoomAlpha > 0.04) {
        skyCtx.fillStyle = `rgba(3, 5, 10, ${(0.72 * zoomAlpha).toFixed(3)})`;
        skyCtx.fillRect(0, 0, vw, vh);
      }
    } else {
      // 1. PITCH DARK SPACE BACKGROUND
      skyCtx.fillStyle = '#03050a';
      skyCtx.fillRect(0, 0, vw, vh);

      // 2. FAINT MILKY WAY BAND + DARK DUST LANES
      if (milkyWayBuffer) {
        skyCtx.save();
        skyCtx.globalAlpha = 0.75 * (1 - zoomAlpha * 0.35);
        const mwOffX = -(camSkyX * 0.14 + smoothMouseX * 10) % 240;
        const mwOffY = -(camSkyY * 0.14 + smoothMouseY * 8) % 180;
        skyCtx.drawImage(milkyWayBuffer, mwOffX - 120, mwOffY - 90, vw + 240, vh + 180);
        skyCtx.restore();
      }
    }

    // 3. VERY FAINT LOCALIZED NEBULA TINT AROUND ACTIVE CONSTELLATION ONLY
    const vpRect = stageViewportEl.getBoundingClientRect();
    const absCx = vpRect.left + cx;
    const absCy = vpRect.top + cy;
    const zoomScaleFactor = 1 + zoomAlpha * 1.1;

    if (zoomAlpha < 0.95) {
      const [nr, ng, nb] = sec.nebulaTint;
      const nebR = Math.max(180, ringRadius * 1.65);
      const nebGrad = skyCtx.createRadialGradient(absCx, absCy, 0, absCx, absCy, nebR);
      nebGrad.addColorStop(0, `rgba(${nr}, ${ng}, ${nb}, ${(0.055 * (1 - zoomAlpha)).toFixed(4)})`);
      nebGrad.addColorStop(0.55, `rgba(${nr}, ${ng}, ${nb}, ${(0.022 * (1 - zoomAlpha)).toFixed(4)})`);
      nebGrad.addColorStop(1, `rgba(${nr}, ${ng}, ${nb}, 0)`);
      skyCtx.fillStyle = nebGrad;
      skyCtx.fillRect(0, 0, vw, vh);
    }

    // 4. THREE PARALLAX DEEP STARFIELD LAYERS (skipped when live 3D #galaxy3DCanvas provides shared stars)
    if (!sharedThreeBackdrop) {
      for (let i = 0; i < bgStars.length; i++) {
        const st = bgStars[i];
        const pw = CONSTELLATION_CONFIG.parallaxWeights[st.layer];
        const sx = modWrap(st.x - camSkyX * pw - smoothMouseX * (16 * pw) - driftX * pw, vw + 80) - 40;
        const sy = modWrap(st.y - camSkyY * pw - smoothMouseY * (14 * pw) - driftY * pw, vh + 80) - 40;
        const palette = CONSTELLATION_CONFIG.temperatures[st.temp];
        const [r, g, b] = palette.mid;
        const a = st.alpha * (prefersReducedMotion ? 1 : (0.97 + 0.03 * Math.sin(now * 0.0014 + st.phase)));
        skyCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
        if (st.r < 1.1) {
          skyCtx.fillRect(sx, sy, st.r * 1.15, st.r * 1.15);
        } else {
          skyCtx.beginPath();
          skyCtx.arc(sx, sy, st.r * 0.65, 0, Math.PI * 2);
          skyCtx.fill();
        }
      }
    }

    // 5. CONSTELLATION RING, EDGES, AND POINT-SOURCE STARS
    const constellationFade = Math.max(0, 1 - zoomAlpha * 1.25);
    if (constellationFade > 0.01) {
      skyCtx.save();
      skyCtx.globalAlpha = constellationFade;

      // Pan / zoom slightly around star origin during camera push
      if (zoomAlpha > 0.001) {
        const originAbsX = vpRect.left + zoomedStarOrigin.x;
        const originAbsY = vpRect.top + zoomedStarOrigin.y;
        skyCtx.translate(originAbsX, originAbsY);
        skyCtx.scale(zoomScaleFactor, zoomScaleFactor);
        skyCtx.translate(-originAbsX, -originAbsY);
      }

      // Compute star absolute screen coords
      const absStars = sec.stars.map(s => ({
        ...s,
        ax: absCx + s.x * scaleRadius,
        ay: absCy + s.y * scaleRadius
      }));

      // A) Broken Dashed Circle with Tiny Tick Marks around cluster
      if (ringProg > 0.01) {
        drawBrokenDashedRing(skyCtx, absCx, absCy, ringRadius, ringAngleRad, ringProg);
      }

      // B) Delicate astronomical constellation lines with ~12px gap before star centers
      const hasHover = hoveredNodeIdx >= 0;
      sec.edges.forEach(([iA, iB]) => {
        const a = absStars[iA];
        const b = absStars[iB];
        if (!a || !b || lineProg <= 0.01) return;

        const isIncident = hasHover && (iA === hoveredNodeIdx || iB === hoveredNodeIdx);
        const isHelperEdge = Boolean(a.isHelper || b.isHelper);
        const baseOpacity = isHelperEdge ? 0.14 : 0.22;
        const edgeOpacity = hasHover ? (isIncident ? 0.58 : 0.08) : baseOpacity;
        const gap = 12;
        const dx = b.ax - a.ax;
        const dy = b.ay - a.ay;
        const len = Math.hypot(dx, dy);
        if (len <= gap * 2 + 2) return;

        const ux = dx / len;
        const uy = dy / len;
        const x1 = a.ax + ux * gap;
        const y1 = a.ay + uy * gap;
        const x2Full = b.ax - ux * gap;
        const y2Full = b.ay - uy * gap;
        const x2 = x1 + (x2Full - x1) * easeOutCubic(lineProg);
        const y2 = y1 + (y2Full - y1) * easeOutCubic(lineProg);

        skyCtx.strokeStyle = isIncident
          ? `rgba(245, 185, 80, ${edgeOpacity.toFixed(3)})`
          : `rgba(220, 230, 248, ${edgeOpacity.toFixed(3)})`;
        skyCtx.lineWidth = isIncident ? 1.15 : (isHelperEdge ? 0.75 : 0.90);
        skyCtx.beginPath();
        skyCtx.moveTo(x1, y1);
        skyCtx.lineTo(x2, y2);
        skyCtx.stroke();
      });

      // C) Real Point-Source Stars (sharp Airy pinpoint core + smooth Moffat PSF atmospheric glow, ZERO '+' crosses)
      absStars.forEach((s, i) => {
        const appearDelay = i * CONSTELLATION_CONFIG.starAppearDelayMs;
        const starVis = entranceSkipped ? 1 : easeOutCubic(Math.max(0, Math.min(1, (elapsed - appearDelay) / 260)));
        if (starVis <= 0.01) return;

        const isFocused = hasHover && i === hoveredNodeIdx;
        const dimMul = hasHover && !isFocused && !s.isHelper ? 0.52 : (isFocused ? 1.25 : 1.0);
        const breathe = prefersReducedMotion
          ? 1.0
          : (1.0 + CONSTELLATION_CONFIG.breathingAmplitude * Math.sin(now * 0.0018 + i * 1.7));

        drawRealPointStar(
          skyCtx,
          s.ax,
          s.ay,
          s.brightness * dimMul * breathe * starVis,
          s.temp,
          false,
          Boolean(s.isHelper)
        );
      });

      skyCtx.restore();
    }

    // 6. ZOOMED-IN REAL GRANULATED STAR BODY (PHASE 4)
    if (zoomAlpha > 0.04 && zoomedStarIdx >= 0) {
      const targetStar = sec.stars[zoomedStarIdx];
      if (targetStar) {
        const targetScreenX = vw < 820 ? vw * 0.5 : vw * 0.31;
        const targetScreenY = vw < 820 ? vh * 0.30 : vh * 0.50;
        const startX = vpRect.left + zoomedStarOrigin.x;
        const startY = vpRect.top + zoomedStarOrigin.y;

        const bodyX = startX + (targetScreenX - startX) * easeInOutCubic(zoomAlpha);
        const bodyY = startY + (targetScreenY - startY) * easeInOutCubic(zoomAlpha);
        const maxBodyR = vw < 820 ? Math.min(vw * 0.22, 88) : Math.min(vw * 0.145, vh * 0.24, 155);
        const bodyR = 4 + (maxBodyR - 4) * easeOutCubic(zoomAlpha);

        drawGranulatedStarBody(skyCtx, bodyX, bodyY, bodyR, targetStar.temp, now, zoomAlpha);
      }
    }

    // 7. SUBTLE FILM GRAIN OVERLAY
    if (grainPattern && CONSTELLATION_CONFIG.grainOpacity > 0) {
      skyCtx.save();
      skyCtx.globalAlpha = CONSTELLATION_CONFIG.grainOpacity;
      skyCtx.fillStyle = grainPattern;
      skyCtx.fillRect(0, 0, vw, vh);
      skyCtx.restore();
    }
  }

  function modWrap(val, max) {
    return ((val % max) + max) % max;
  }

  function drawBrokenDashedRing(ctx, centerX, centerY, r, rotOffset, reveal) {
    // Broken hand-drawn-style dashed orbital guide with gaps and tiny tick marks
    const arcSegments = [
      { start: 0.12, end: 1.48 },
      { start: 1.78, end: 3.12 },
      { start: 3.44, end: 4.92 },
      { start: 5.18, end: 6.12 }
    ];
    ctx.save();
    ctx.globalAlpha *= reveal;
    ctx.strokeStyle = 'rgba(206, 218, 240, 0.22)';
    ctx.lineWidth = 1;
    ctx.setLineDash([7, 7]);
    arcSegments.forEach(seg => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, seg.start + rotOffset, seg.end + rotOffset);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Small delicate tick marks along circle circumference (every 30 degrees inside active arcs)
    ctx.strokeStyle = 'rgba(206, 218, 240, 0.24)';
    for (let deg = 0; deg < 360; deg += 30) {
      const theta = (deg * Math.PI) / 180;
      const inArc = arcSegments.some(seg => theta >= seg.start && theta <= seg.end);
      if (!inArc) continue;
      const a = theta + rotOffset;
      const rIn = r - 4;
      const rOut = r + 4;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(a) * rIn, centerY + Math.sin(a) * rIn);
      ctx.lineTo(centerX + Math.cos(a) * rOut, centerY + Math.sin(a) * rOut);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawRealPointStar(ctx, x, y, brightness, tempName, hasSpikes, isHelper) {
    const pal = CONSTELLATION_CONFIG.temperatures[tempName] || CONSTELLATION_CONFIG.temperatures['white'];
    const [mr, mg, mb] = pal.mid;
    const [gr, gg, gb] = pal.glow;

    // Astronomical Point Spread Function (PSF):
    // Refined pinpoint core (1.0-1.8px) with intense incandescent center + soft Moffat atmospheric halo (ZERO '+' crosses)
    const glowR = isHelper ? 8 : (11 + brightness * 14);
    const coreR = isHelper ? 1.05 : (1.35 + brightness * 1.15);

    const g = ctx.createRadialGradient(x, y, 0, x, y, glowR);
    g.addColorStop(0.00, `rgba(255, 255, 255, ${Math.min(1, 0.85 + brightness * 0.15).toFixed(3)})`);
    g.addColorStop(0.18, `rgba(${mr}, ${mg}, ${mb}, ${(0.42 * brightness).toFixed(3)})`);
    g.addColorStop(0.50, `rgba(${gr}, ${gg}, ${gb}, ${(0.10 * brightness).toFixed(3)})`);
    g.addColorStop(1.00, `rgba(${gr}, ${gg}, ${gb}, 0)`);

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fill();

    // Pure incandescent stellar core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, coreR, 0, Math.PI * 2);
    ctx.fill();
  }

  const photosphereCache = new Map();

  function getPhotosphereTexture(tempName) {
    if (photosphereCache.has(tempName)) return photosphereCache.get(tempName);

    const pal = CONSTELLATION_CONFIG.temperatures[tempName] || CONSTELLATION_CONFIG.temperatures['white'];
    const [mr, mg, mb] = pal.mid;
    const [gr, gg, gb] = pal.glow;

    const size = 200;
    const off = document.createElement('canvas');
    off.width = size;
    off.height = size;
    const octx = off.getContext('2d');
    const img = octx.createImageData(size, size);
    const data = img.data;
    const half = size * 0.5;

    // Fast multi-octave cellular harmonic noise for realistic convective stellar granulation
    const granulation = (nx, ny) => {
      const v1 = Math.sin(nx * 13.0 + Math.cos(ny * 11.0) * 1.4) * Math.cos(ny * 13.0 - Math.sin(nx * 9.0) * 1.3);
      const v2 = Math.sin(nx * 27.0 + ny * 19.0) * Math.cos(nx * 23.0 - ny * 29.0);
      const v3 = Math.sin(nx * 53.0 - ny * 47.0);
      const cells = Math.abs(v1 * 0.55 + v2 * 0.30 + v3 * 0.15);
      return Math.pow(Math.min(1, cells * 1.15), 0.72);
    };

    for (let py = 0; py < size; py++) {
      for (let px = 0; px < size; px++) {
        const dx = (px - half) / half;
        const dy = (py - half) / half;
        const r2 = dx * dx + dy * dy;
        const idx = (py * size + px) * 4;
        if (r2 > 1.0) {
          data[idx + 3] = 0;
          continue;
        }
        const rDist = Math.sqrt(r2);
        // Limb darkening: mu = cos(theta) = sqrt(1 - r^2)
        const mu = Math.sqrt(Math.max(0, 1.0 - r2));
        const limb = Math.pow(mu, 0.48);

        // Spherical foreshortening warp so granulation curves around sphere!
        const sphereScale = 1.0 / (0.45 + 0.55 * mu);
        const gran = granulation(dx * sphereScale, dy * sphereScale);
        // Active bright faculae + darker intergranular lanes
        const plasma = 0.78 + 0.28 * gran;

        const coreMix = Math.pow(mu, 1.45);
        const R = Math.min(255, ((255 * coreMix + mr * (1 - coreMix)) * limb * plasma + gr * 0.14 * (1 - limb)));
        const G = Math.min(255, ((255 * coreMix + mg * (1 - coreMix)) * limb * plasma + gg * 0.12 * (1 - limb)));
        const B = Math.min(255, ((255 * coreMix + mb * (1 - coreMix)) * limb * plasma + gb * 0.12 * (1 - limb)));

        data[idx] = Math.round(R);
        data[idx + 1] = Math.round(G);
        data[idx + 2] = Math.round(B);
        // Antialiased outer rim
        const edgeAlpha = rDist > 0.96 ? Math.max(0, (1.0 - rDist) / 0.04) : 1.0;
        data[idx + 3] = Math.round(edgeAlpha * 255);
      }
    }
    octx.putImageData(img, 0, 0);
    photosphereCache.set(tempName, off);
    return off;
  }

  function drawGranulatedStarBody(ctx, x, y, r, tempName, now, alpha) {
    const pal = CONSTELLATION_CONFIG.temperatures[tempName] || CONSTELLATION_CONFIG.temperatures['white'];
    const [mr, mg, mb] = pal.mid;
    const [gr, gg, gb] = pal.glow;

    ctx.save();
    ctx.globalAlpha = Math.min(1, alpha);

    // 1. Restrained Physical Stellar Corona
    const corona = ctx.createRadialGradient(x, y, r * 0.88, x, y, r * 2.05);
    corona.addColorStop(0.00, `rgba(${mr}, ${mg}, ${mb}, 0.36)`);
    corona.addColorStop(0.35, `rgba(${gr}, ${gg}, ${gb}, 0.11)`);
    corona.addColorStop(1.00, `rgba(${gr}, ${gg}, ${gb}, 0)`);
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.05, 0, Math.PI * 2);
    ctx.fill();

    // 2. Crisp Photosphere Disk with Convection Texture & Limb Darkening
    const tex = getPhotosphereTexture(tempName);
    ctx.save();
    ctx.translate(x, y);
    if (!prefersReducedMotion) {
      ctx.rotate(now * 0.000045);
    }
    ctx.drawImage(tex, -r, -r, r * 2, r * 2);
    ctx.restore();

    ctx.restore();
  }

  // ── 9. INITIALIZATION & PUBLIC API ─────────────────────────────────────────
  function handleResize() {
    sizeCanvas();
    computeConstellationLayout();
  }

  function debounce(fn, ms) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  function init() {
    if (isInitialized) return;
    disciplinesEl = document.getElementById('disciplines');
    if (!disciplinesEl) return;

    prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    buildVerifiedSectorData();
    buildDOM();
    initSkyAssets();

    // Initialize title, colors, layout & start render loop cleanly on default sector (0)
    const sec = sectorData[activeSectorIdx];
    camSkyX = sec.skyOffset.x;
    camSkyY = sec.skyOffset.y;
    if (titleEl) titleEl.textContent = `Constellation: ${sec.title}`;
    rootEl.style.setProperty('--cat-color', sec.color);
    rootEl.style.setProperty('--cat-rgb', sec.rgb);

    entranceStartMs = performance.now();
    entranceSkipped = prefersReducedMotion;
    computeConstellationLayout();
    startRenderLoop();

    window.addEventListener('resize', debounce(handleResize, 120));
    isInitialized = true;
    console.info(`[TechnologyConstellation] Ready (${sectorData.length} sectors, ${sectorData.reduce((s, c) => s + c.techCount, 0)} technologies).`);
  }

  function updateProgress(masterT) {
    const disciplinesEl = document.getElementById('disciplines');
    if (!disciplinesEl || !rootEl) return;

    // Constellation Atlas is active across Sector 04 (0.635 <= masterT <= 0.930)
    if (masterT < 0.635 || masterT > 0.930) {
      disciplinesEl.style.opacity = '0';
      disciplinesEl.style.visibility = 'hidden';
      disciplinesEl.style.pointerEvents = 'none';
      disciplinesEl.classList.remove('is-interactive');
      if (zoomedStarIdx >= 0) exitStarDetail(true);
      return;
    }

    disciplinesEl.style.opacity = '1';
    disciplinesEl.style.visibility = 'visible';
    disciplinesEl.classList.add('is-interactive');
    if (!sharedThreeBackdrop) {
      sharedThreeBackdrop = true;
      rootEl.classList.add('is-shared-backdrop');
    }

    const WAYPOINTS = [0.670, 0.710, 0.750, 0.790, 0.830, 0.870, 0.910];
    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < WAYPOINTS.length; i++) {
      const diff = Math.abs(masterT - WAYPOINTS[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }

    // Alpha in [0, 1] representing presence/prominence of the active constellation's details
    let alpha = 0.0;
    if (masterT < 0.670) {
      // Approach from field overview
      alpha = Math.max(0.0, Math.min(1.0, (masterT - 0.640) / 0.030));
    } else if (masterT > 0.910) {
      // Departure toward Contact terminal
      alpha = Math.max(0.0, Math.min(1.0, 1.0 - (masterT - 0.910) / 0.020));
    } else {
      const halfSpan = 0.020;
      if (minDiff <= 0.006) {
        alpha = 1.0;
      } else {
        alpha = Math.max(0.0, Math.min(1.0, 1.0 - (minDiff - 0.006) / (halfSpan - 0.006)));
      }
    }

    if (closestIdx !== activeSectorIdx && alpha > 0.15) {
      switchSector(closestIdx, { instant: true, skipEntrance: true, fromThree: true });
    }

    const titleHeader = rootEl.querySelector('#csTitleHeader');
    if (titleHeader) {
      titleHeader.style.opacity = alpha.toFixed(3);
      titleHeader.style.transform = `translateY(${(-16 * (1.0 - alpha)).toFixed(1)}px)`;
    }

    if (cardsLayerEl) {
      cardsLayerEl.style.opacity = alpha.toFixed(3);
      cardsLayerEl.style.pointerEvents = (alpha > 0.80) ? 'auto' : 'none';
      const leftCards = cardsLayerEl.querySelectorAll('.cs-tech-card.is-left');
      const rightCards = cardsLayerEl.querySelectorAll('.cs-tech-card.is-right');
      const transX = 24 * (1.0 - alpha);
      leftCards.forEach(c => { c.style.transform = `translateX(${(-transX).toFixed(1)}px)`; });
      rightCards.forEach(c => { c.style.transform = `translateX(${transX.toFixed(1)}px)`; });
    }

    if (leaderSvgEl) {
      leaderSvgEl.style.opacity = (alpha * alpha).toFixed(3);
    }
  }

  window.TechnologyConstellation = {
    init,
    updateProgress,
    config: CONSTELLATION_CONFIG,
    selectCategory: switchSector,
    selectSector: (keyOrIdx, opts) => {
      if (typeof keyOrIdx === 'number') return switchSector(keyOrIdx, opts);
      const found = sectorData.findIndex(s => s.key === keyOrIdx);
      if (found >= 0) switchSector(found, opts);
    },
    getActiveSectorIndex: () => activeSectorIdx,
    getSectorCount: () => sectorData.length,
    setSharedBackdropMode: (enabled) => {
      sharedThreeBackdrop = Boolean(enabled);
      if (rootEl) rootEl.classList.toggle('is-shared-backdrop', sharedThreeBackdrop);
    },
    forceRenderNow: () => renderFrame(performance.now()),
    getLayoutMetrics: () => {
      const sec = sectorData[activeSectorIdx];
      if (!sec || !stageViewportEl) return null;
      const vpRect = stageViewportEl.getBoundingClientRect();
      const absCx = vpRect.left + cx;
      const absCy = vpRect.top + cy;
      return {
        sectorIdx: activeSectorIdx,
        sectorKey: sec.key,
        absCx,
        absCy,
        scaleRadius,
        ringRadius,
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
        stars: sec.stars.map(s => ({
          idx: s.idx,
          isHelper: !!s.isHelper,
          sx: absCx + s.x * scaleRadius,
          sy: absCy + s.y * scaleRadius,
          brightness: s.brightness,
          hasSpikes: Boolean(s.hasSpikes && !s.isHelper)
        }))
      };
    },
    zoomToStar: enterStarDetail,
    zoomOut: exitStarDetail,
    toggleListView,
    getSectorData: () => sectorData,
    getComputedPlacements: () => computedPlacements
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window, document);
