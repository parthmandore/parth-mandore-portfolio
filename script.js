/**
 * ═══════════════════════════════════════════════════════════════════
 * PARTH MANDORE — EDITORIAL ARCHITECTURAL PORTFOLIO
 * 3D Kinetic Architectural Monolith, Portrait Physics & Engine
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════
  // 00. MASTER AUTHORITATIVE BLACK HOLE LIFECYCLE STATE MACHINE (PHASE 1 REBUILD)
  // Authoritative States: 'IDLE' | 'READY_TO_DESTROY' | 'DESTROYING' | 'REBUILDING'
  // Supplemental State: 'CONSUMING' (drag holding / proximity accumulation)
  // ═══════════════════════════════════════════════════════════════════
  const BlackHoleLifecycle = (function () {
    let state = 'IDLE';
    let subStage = 'IDLE';
    let currentGenerationId = 1;
    const listeners = new Set();

    // Strict, validated state transition map supporting the required lifecycle:
    // IDLE -> CONSUMING -> DESTROYING -> QUASAR_BURST -> RECONSTITUTING -> ORBITAL_GALAXY -> RESTORING -> IDLE
    const VALID_TRANSITIONS = {
      'IDLE': ['CONSUMING', 'DESTROYING', 'CHARGING', 'READY_TO_DESTROY', 'RESTORING', 'ORBITAL_GALAXY'],
      'CONSUMING': ['IDLE', 'DESTROYING', 'READY_TO_DESTROY', 'RESTORING'],
      'READY_TO_DESTROY': ['DESTROYING', 'QUASAR_BURST', 'RESTORING', 'IDLE'],
      'CHARGING': ['DESTROYING', 'QUASAR_BURST', 'RESTORING', 'IDLE'],
      'DESTROYING': ['QUASAR_BURST', 'RECONSTITUTING', 'REBUILDING', 'DESTROYED', 'ORBITAL_GALAXY', 'RESTORING', 'IDLE'],
      'QUASAR_BURST': ['RECONSTITUTING', 'REBUILDING', 'ORBITAL_GALAXY', 'RESTORING', 'IDLE'],
      'RECONSTITUTING': ['ORBITAL_GALAXY', 'IDLE', 'READY_TO_DESTROY', 'CONSUMING', 'RESTORING'],
      'REBUILDING': ['ORBITAL_GALAXY', 'IDLE', 'READY_TO_DESTROY', 'CONSUMING', 'RESTORING'], // backward-compat alias
      'DESTROYED': ['ORBITAL_GALAXY', 'RECONSTITUTING', 'REBUILDING', 'RESTORING', 'IDLE'],
      'ORBITAL_GALAXY': ['DESTROYING', 'READY_TO_DESTROY', 'CHARGING', 'CONSUMING', 'RESTORING', 'IDLE'],
      'RESTORING': ['IDLE', 'RECONSTITUTING', 'REBUILDING', 'ORBITAL_GALAXY']
    };

    return {
      getState: () => state,
      getSubStage: () => subStage,
      setSubStage: (stage) => { subStage = stage; },
      getGenerationId: () => currentGenerationId,
      nextGeneration: () => {
        currentGenerationId++;
        return currentGenerationId;
      },
      isCurrentGeneration: (id) => id === currentGenerationId,
      is: (s) => state === s,
      isIdle: () => state === 'IDLE',
      isReadyToDestroy: () => state === 'READY_TO_DESTROY' || state === 'CHARGING',
      isCharging: () => state === 'READY_TO_DESTROY' || state === 'CHARGING',
      isDestroying: () => state === 'DESTROYING',
      isQuasarBurst: () => state === 'QUASAR_BURST',
      isReconstituting: () => state === 'RECONSTITUTING' || state === 'REBUILDING',
      isRebuilding: () => state === 'REBUILDING' || state === 'RECONSTITUTING',
      isOrbitalGalaxy: () => state === 'ORBITAL_GALAXY',
      isDestroyed: () => state === 'DESTROYING' || state === 'QUASAR_BURST' || state === 'DESTROYED' || state === 'REBUILDING' || state === 'RECONSTITUTING',
      isRestoring: () => state === 'RESTORING' || state === 'REBUILDING' || state === 'RECONSTITUTING',
      isConsuming: () => state === 'CONSUMING',
      isInteracting: () => state === 'CONSUMING' || state === 'READY_TO_DESTROY' || state === 'DESTROYING' || state === 'ORBITAL_GALAXY' || state === 'DESTROYED',
      canDrag: () => state === 'IDLE' || state === 'CONSUMING' || state === 'ORBITAL_GALAXY' || state === 'DESTROYED' || (state === 'DESTROYING' && subStage !== 'STAGE_A_CHARGING' && subStage !== 'STAGE_B_PEAK'),
      canTransitionTo: (next) => {
        if (state === next) return true;
        const normalized = (next === 'CHARGING') ? 'READY_TO_DESTROY' : (next === 'RESTORING' ? 'REBUILDING' : next);
        const allowed = VALID_TRANSITIONS[state];
        return !!(allowed && (allowed.includes(next) || allowed.includes(normalized)));
      },
      setState: (next, newSubStage) => {
        // Normalize legacy aliases
        if (next === 'CHARGING') next = 'READY_TO_DESTROY';
        if (next === 'REBUILDING') next = 'RECONSTITUTING';

        if (state === next) {
          if (newSubStage !== undefined) subStage = newSubStage;
          return true;
        }
        const allowed = VALID_TRANSITIONS[state];
        if (!allowed || !allowed.includes(next)) {
          if (next === 'IDLE') {
            const prev = state;
            state = 'IDLE';
            subStage = 'IDLE';
            currentGenerationId++;
            listeners.forEach(fn => { try { fn(state, prev, currentGenerationId); } catch (e) {} });
            return true;
          }
          console.warn(`[BlackHoleLifecycle] Blocked invalid transition: ${state} -> ${next}`);
          return false;
        }

        const prev = state;
        state = next;
        if (newSubStage !== undefined) {
          subStage = newSubStage;
        } else if (next === 'READY_TO_DESTROY') {
          subStage = 'CHARGE';
        } else if (next === 'DESTROYING') {
          subStage = 'CHARGE';
        } else if (next === 'QUASAR_BURST') {
          subStage = 'ENERGY_RELEASE';
        } else if (next === 'RECONSTITUTING' || next === 'REBUILDING') {
          subStage = 'REFORMATION';
        } else if (next === 'ORBITAL_GALAXY') {
          subStage = 'ACTIVE';
        } else {
          subStage = 'IDLE';
        }

        const shouldIncrementGen = (
          next === 'READY_TO_DESTROY' ||
          (next === 'DESTROYING' && prev !== 'READY_TO_DESTROY' && prev !== 'CHARGING') ||
          next === 'RESTORING' ||
          next === 'IDLE'
        );
        if (shouldIncrementGen) {
          currentGenerationId++;
        }

        listeners.forEach(fn => {
          try { fn(state, prev, currentGenerationId); } catch (e) { console.error(e); }
        });
        return true;
      },
      subscribe: (fn) => {
        listeners.add(fn);
        return () => listeners.delete(fn);
      }
    };
  })();

  window.BlackHoleLifecycle = BlackHoleLifecycle;

  // Synchronize DOM elements and interaction hit area with authoritative lifecycle state
  BlackHoleLifecycle.subscribe((state, prev, genId) => {
    const container = document.getElementById('blackHoleContainer');
    const hitArea = document.getElementById('blackHoleHitArea');
    const rebirthPrompt = document.getElementById('cosmicRebirthPrompt');

    if (state === 'READY_TO_DESTROY' || state === 'DESTROYING' || state === 'QUASAR_BURST') {
      document.body.classList.remove('blackhole-dragging', 'over-blackhole');
      if (container) {
        container.style.pointerEvents = 'none';
        container.style.opacity = '1';
      }
      if (hitArea) {
        hitArea.style.pointerEvents = 'none';
      }
      if (rebirthPrompt) {
        rebirthPrompt.classList.remove('visible');
      }
    } else if (state === 'REBUILDING' || state === 'RECONSTITUTING') {
      document.body.classList.remove('blackhole-dragging', 'over-blackhole');
      if (container) {
        container.style.pointerEvents = 'none';
        container.style.opacity = '1';
      }
      if (hitArea) {
        hitArea.style.pointerEvents = 'none';
      }
      if (rebirthPrompt) {
        rebirthPrompt.classList.remove('visible');
      }
    } else if (state === 'ORBITAL_GALAXY') {
      document.body.classList.remove('blackhole-destroyed');
      if (container) {
        container.style.pointerEvents = 'auto';
        container.style.opacity = '1';
      }
      if (hitArea) {
        hitArea.style.pointerEvents = 'auto';
      }
      if (rebirthPrompt) {
        rebirthPrompt.classList.add('visible');
      }
    } else if (state === 'IDLE' || state === 'CONSUMING') {
      document.body.classList.remove('blackhole-destroyed');
      if (container) {
        container.style.pointerEvents = 'auto';
        container.style.opacity = '1';
      }
      if (hitArea) {
        hitArea.style.pointerEvents = 'auto';
      }
    }
  });


  // ── 01. THREE.JS RELATIVISTIC 3D BLACK HOLE HERO CHAMBER ──
  const SpaceBlackHoleHero3D = (function () {
    let canvas, scene, camera, renderer;
    let blackHoleRoot, diskMesh, haloMesh, photonMesh, horizonMesh;
    let infallParticles, particlePositions, particleColors, particleData;
    let animId = null;
    let clock;
    let diskMaterial, haloMaterial, coronalBeamMesh, coronalBeamMaterial;

    // Single Source of Truth: Position strictly relative to the #hero container
    let heroRelX = 0;
    let heroRelY = 0;
    let anchorHeroX = 0;
    let anchorHeroY = 0;
    let hasUserDragged = false; // Preserves custom drag position across resizes & destruction
    let isWebGLActiveFlag = false;

    // Strict Scroll-Lock Mechanism: guarantees window.scrollY NEVER changes during destruction & rebuilding
    let lockedScrollY = 0;
    let isScrollLocked = false;
    function lockScroll() {
      lockedScrollY = window.scrollY;
      isScrollLocked = true;
    }
    function unlockScroll() {
      isScrollLocked = false;
    }
    window.addEventListener('scroll', () => {
      if (isScrollLocked && window.scrollY !== lockedScrollY) {
        window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'instant' });
      }
    }, { passive: false });

    // Current viewport screen coordinates (computed synchronously from heroRect + heroRelX/Y)
    let currentScreenX = 0;
    let currentScreenY = 0;
    let targetScreenX = 0;
    let targetScreenY = 0;

    // Drag tracking & gyroscopic banking velocity (active ONLY during intentional user drag)
    let isDragging = false;
    let hasDragged = false;
    let activePointerId = null;
    let dragStartPointerX = 0;
    let dragStartPointerY = 0;
    let dragStartRelX = 0;
    let dragStartRelY = 0;
    let dragVelX = 0;
    let dragVelY = 0;
    let smoothVelX = 0;
    let smoothVelY = 0;

    // Mass Accretion, Growth & Pulsing (Authentic Space Theme Design)
    function getResponsiveInitialScale() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w >= 1440 && h >= 900) return 0.38;
      if (w >= 1025 && h <= 800) return 0.30;
      if (w >= 1025) return 0.34;
      if (w >= 768) return 0.24;
      return 0.18;
    }
    const INITIAL_SCALE = getResponsiveInitialScale();
    const MAX_SCALE = 0.72;     // Disciplined maximum size after multiple consumptions
    let currentScale = INITIAL_SCALE;
    let targetScale = INITIAL_SCALE;
    let pulseScale = 1.0;
    let pulseUniformValue = 0.0;
    let hasFiredEjection = false;
    let peakObservedDestructionScale = 0;

    // Configurable consumption growth model
    const CONSUMPTION_GROWTH_CONFIG = {
      getRestingScale: getResponsiveInitialScale,
      getMaxScale: () => 0.72,
      // Exponential saturation denominator:
      // Rate = 7.0 produces responsive, convincing and visually obvious growth per letter:
      // Consuming 3-5 letters expands black hole by ~30-40%, asymptoting gracefully at maxScale
      saturationDenominator: 7.0
    };

    function getMaxConsumptionScale() {
      return CONSUMPTION_GROWTH_CONFIG.getMaxScale();
    }
    function getConsumptionTargetScale() {
      if (typeof BlackHoleLifecycle !== 'undefined' && (BlackHoleLifecycle.isDestroyed() || BlackHoleLifecycle.isDestroying())) {
        return getResponsiveInitialScale();
      }
      const init = CONSUMPTION_GROWTH_CONFIG.getRestingScale();
      const maxS = CONSUMPTION_GROWTH_CONFIG.getMaxScale();
      const consumed = (typeof GravitationalEngine !== 'undefined' && GravitationalEngine.getConsumedCount)
        ? GravitationalEngine.getConsumedCount()
        : 0;
      if (consumed <= 0) return init;
      const maxGrowth = maxS - init;
      // Smooth saturation curve: noticeable continuous growth that gracefully asymptotes
      const growth = maxGrowth * (1.0 - Math.exp(-consumed / CONSUMPTION_GROWTH_CONFIG.saturationDenominator));
      return Math.min(maxS, init + growth);
    }

    // Cinematic Introduction Sequence & Hero Confinement State Machine
    let introState = 'SETTLED';
    let introTimer = 0.0;
    let introStartTime = 0;
    let destructionStartTime = 0;
    let isHeroActive = true;

    // Pre-burst gathering, shockwave wave & matter blast particle dynamics
    let shockwaveMesh, shockwaveMaterial;
    let shockwaveRadius = 0.0;
    let shockwaveAlpha = 0.0;

    const BLAST_COUNT = 160;
    let blastMesh, blastPositions, blastVelocities, blastColors, blastLife = 0.0;

    // Relativistic Quasar Bipolar Jet & Central Energy Flash
    let jetGroup, upperJetMesh, lowerJetMesh, jetMaterial;
    let jetProgress = 0.0;
    let jetAlpha = 0.0;

    let flashMesh, flashMaterial;
    let flashAlpha = 0.0;

    // Complete Black-Hole Destruction & Disintegration Mechanics
    let horizonShardsGroup, horizonShards = [];
    let crackLinesGroup, crackLines = [], crackMaterial;
    let currentDestructionGenId = 0;
    let destructionTimer = 0.0;
    let onDestructionReleaseCallback = null;

    // Intentional Tap Detector Configuration (Stage 1 Tap Detection)
    const TAP_THRESHOLD = 3;
    let tapCount = 0;
    let tapResetTimer = null;
    let pointerDownTime = 0;

    const PARTICLE_COUNT = 1200;
    const HORIZON_RADIUS = 2.2;
    const INNER_DISK_RADIUS = 2.32;
    const OUTER_DISK_RADIUS = 7.6;

    // Strategic default placement relative to the #hero container
    // As shown in reference image: horizontally centered under the floating navbar,
    // with its upper coronal arc hugging the lower edge of the navbar pill.
    function computeDefaultHeroPosition() {
      const heroEl = document.getElementById('hero');
      const w = window.innerWidth || document.documentElement.clientWidth || 1200;
      const heroWidth = (heroEl && heroEl.offsetWidth > 0) ? heroEl.offsetWidth : w;
      const headerEl = document.getElementById('atelier-header');
      const navEl = document.querySelector('.atelier-nav');

      let navHeight = 70;
      if (navEl && navEl.offsetHeight > 0) {
        navHeight = navEl.offsetHeight;
      } else if (headerEl && headerEl.offsetHeight > 0) {
        navHeight = headerEl.offsetHeight;
      }

      const heroHeight = (heroEl && heroEl.offsetHeight > 0) ? heroEl.offsetHeight : (window.innerHeight || 800);
      const h = window.innerHeight || heroHeight;
      const defaultX = Math.round(heroWidth * 0.50);
      
      // On desktop: balanced cinematic focal placement with generous negative space
      if (w >= 1025) {
        const rightX = Math.round(heroWidth * 0.65);
        const rightY = h <= 768 ? Math.round(heroHeight * 0.44) : Math.round(heroHeight * 0.46);
        return { x: rightX, y: rightY };
      }
      
      // On tablet: center in generous lower visual zone below monograph & actions
      if (w >= 600) {
        return { x: defaultX, y: Math.round(heroHeight * 0.63) };
      }
      
      // On mobile: center in spacious open sector between actions and bottom cockpit bar
      return { x: defaultX, y: Math.min(heroHeight - 130, Math.round(heroHeight * 0.72)) };
    }

    // Safe boundaries: allows the black hole to move across the full intended hero area,
    // approaching both the left and right edges while ensuring the hit area remains grab-able.
    // Coordinates (x, y) are relative to #hero container (independent of scroll position).
    function clampToHeroBounds(x, y) {
      const heroEl = document.getElementById('hero');
      if (!heroEl) return { x, y };
      const heroWidth = heroEl.offsetWidth;
      const heroHeight = heroEl.offsetHeight;
      const headerEl = document.getElementById('atelier-header');
      const navEl = document.querySelector('.atelier-nav');

      let navHeight = 70;
      if (navEl && navEl.offsetHeight > 0) {
        navHeight = navEl.offsetHeight;
      } else if (headerEl && headerEl.offsetHeight > 0) {
        navHeight = headerEl.offsetHeight;
      }

      const minMarginX = 35;
      const minX = minMarginX;
      const maxX = Math.max(minX + 40, heroWidth - minMarginX);
      const minY = Math.max(navHeight + 20, 70);
      const maxY = Math.max(minY + 40, heroHeight - 40);

      return {
        x: Math.max(minX, Math.min(maxX, x)),
        y: Math.max(minY, Math.min(maxY, y))
      };
    }

    // Synchronize DOM interaction container and hit area with heroRelX and heroRelY
    function updateContainerDOM() {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        currentScreenX = heroRect.left + heroRelX;
        currentScreenY = heroRect.top + heroRelY;
      }
      const container = document.getElementById('blackHoleContainer');
      if (container) {
        container.style.setProperty('--bh-x', `${Math.round(heroRelX)}px`);
        container.style.setProperty('--bh-y', `${Math.round(heroRelY)}px`);
        const hitSize = Math.max(80, Math.round(140 * (currentScale / 0.31)));
        container.style.setProperty('--bh-hit-size', `${hitSize}px`);
      }
      updateIntroHudPosition();
    }

    function init() {
      canvas = document.getElementById('hero3DCanvas');
      if (!canvas || typeof THREE === 'undefined') return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      clock = new THREE.Clock();
      introStartTime = performance.now();

      targetScale = getResponsiveInitialScale();
      currentScale = targetScale;
      const defPos = computeDefaultHeroPosition();
      heroRelX = defPos.x;
      heroRelY = defPos.y;
      anchorHeroX = defPos.x;
      anchorHeroY = defPos.y;

      const heroEl = document.getElementById('hero');
      const heroRect = heroEl ? heroEl.getBoundingClientRect() : { left: 0, top: 0 };
      currentScreenX = heroRect.left + heroRelX;
      currentScreenY = heroRect.top + heroRelY;
      targetScreenX = currentScreenX;
      targetScreenY = currentScreenY;

      // Keep DOM container and draggable hit area aligned frame-synchronously
      const bhContainerEl = document.getElementById('blackHoleContainer');
      if (bhContainerEl) {
        bhContainerEl.style.setProperty('--bh-x', `${Math.round(heroRelX)}px`);
        bhContainerEl.style.setProperty('--bh-y', `${Math.round(heroRelY)}px`);
        const hitSize = Math.max(90, Math.round(150 * (currentScale / 0.34)));
        bhContainerEl.style.setProperty('--bh-hit-size', `${hitSize}px`);
      }

      updateContainerDOM();

      // 1. Scene & Deep Space Obsidian Atmosphere
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.004);

      // 2. Perspective Camera (Fixed along Z looking at origin)
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 20);
      camera.lookAt(0, 0, 0);

      // 3. High-Performance WebGL Renderer
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 4. Black Hole Root Group
      blackHoleRoot = new THREE.Group();
      blackHoleRoot.position.set(0, 0, -2.0);
      scene.add(blackHoleRoot);

      // 5. Central Singularity / Event Horizon (Absolute Pitch Black, RenderOrder 999)
      const horizonGeo = new THREE.SphereGeometry(HORIZON_RADIUS, 64, 64);
      const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
      horizonMesh.renderOrder = 999;
      blackHoleRoot.add(horizonMesh);

      // 6. Photon Sphere / Layered Boundary Halo (Sharp Laser Edge + Soft Controlled Outer Aura)
      const photonGeo = new THREE.RingGeometry(HORIZON_RADIUS + 0.005, HORIZON_RADIUS + 0.38, 128);
      const photonMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPulse: { value: 0 },
          uIntroAlpha: { value: 1.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPos;
          void main() {
            vUv = uv;
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uPulse;
          uniform float uIntroAlpha;
          varying vec2 vUv;
          varying vec3 vPos;
          void main() {
            float r = length(vPos.xy);
            float rMin = 2.205;
            float rMax = 2.58;
            if (r < rMin || r > rMax) discard;

            // 1. Razor-sharp white-gold boundary ring at the edge of the event horizon
            float dEdge = abs(r - 2.228);
            float razorEdge = exp(-dEdge * 34.0);

            // 2. Controlled layered boundary halo aura
            float aura = exp(-max(0.0, r - 2.228) * 6.8);

            vec3 colLaserWhite = vec3(1.0, 0.99, 0.96);
            vec3 colGoldAmber  = vec3(0.98, 0.72, 0.16);
            vec3 colWarmAmber  = vec3(0.92, 0.48, 0.05);

            vec3 col = mix(colLaserWhite, colGoldAmber, clamp((r - 2.228) / 0.14, 0.0, 1.0));
            col = mix(col, colWarmAmber, clamp((r - 2.368) / 0.18, 0.0, 1.0));

            float intensity = (razorEdge * 1.75 + aura * 0.70) * (1.0 + uPulse * 1.6);
            gl_FragColor = vec4(col * intensity, intensity * 0.95 * uIntroAlpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      photonMesh = new THREE.Mesh(photonGeo, photonMat);
      photonMesh.rotation.x = 1.15;
      photonMesh.rotation.y = 0.0;
      photonMesh.rotation.z = 0.0;
      blackHoleRoot.add(photonMesh);

      // 7. Primary Relativistic Accretion Disk (Layered Dynamic Bands, Keplerian Flow, Controlled Warm Palette)
      const diskGeo = new THREE.RingGeometry(INNER_DISK_RADIUS, OUTER_DISK_RADIUS, 144, 24);
      diskMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPulse: { value: 0 },
          uIntroAlpha: { value: 1.0 },
          uAccretionSpeed: { value: 1.0 },
          uTemperature: { value: 0.0 },
          uCompression: { value: 1.0 },
          uDopplerBoost: { value: 0.45 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          varying float vRadius;
          void main() {
            vUv = uv;
            vPosition = position;
            vRadius = length(position.xy);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uPulse;
          uniform float uIntroAlpha;
          uniform float uAccretionSpeed;
          uniform float uTemperature;
          uniform float uCompression;
          uniform float uDopplerBoost;
          varying vec2 vUv;
          varying vec3 vPosition;
          varying float vRadius;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                       mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
          }

          float fbm(vec2 p) {
            float v = 0.0;
            v += 0.500 * noise(p); p *= 2.02;
            v += 0.250 * noise(p); p *= 2.03;
            v += 0.125 * noise(p);
            return v;
          }

          void main() {
            float r = vRadius * uCompression;
            float rMin = 2.32;
            float rMax = 7.60;
            if (r < rMin || r > rMax) discard;

            float u = (r - rMin) / (rMax - rMin);

            // Keplerian differential rotation: inner layers circulate faster
            float phi = atan(vPosition.y, vPosition.x);
            float speed = (2.65 / pow(r, 1.25)) * uAccretionSpeed;
            float rotPhi = phi + uTime * speed;

            // Concentric layered elliptical bands with harmonic variations in density & brightness
            float band1 = sin(r * 5.8 - uTime * 0.85) * 0.5 + 0.5;
            float band2 = sin(r * 13.5 + uTime * 0.40) * 0.5 + 0.5;
            float band3 = sin(r * 26.0 - rotPhi * 3.2) * 0.5 + 0.5;
            float layeredBands = 0.65 + 0.23 * band1 + 0.12 * band2;

            // Flowing matter turbulence and fine plasma streams
            vec2 streamCoords = vec2(r * 1.75 - uTime * 0.42 * uAccretionSpeed, rotPhi * 3.4 + r * 1.1);
            float plasma = fbm(streamCoords);
            float fineStream = noise(vec2(rotPhi * 7.2, r * 4.0 - uTime * 0.70 * uAccretionSpeed));
            float combinedFlow = (plasma * 0.68 + fineStream * 0.32) * layeredBands;

            // Relativistic Doppler beaming: approaching matter is brighter, receding matter dimmer
            float doppler = 1.0 + (0.38 + uDopplerBoost * 0.3) * sin(phi);

            // Controlled color palette: white-gold core, warm amber, fiery orange, deep rust, fading into obsidian
            vec3 colWhiteHot = vec3(1.0, 0.98, 0.94);
            vec3 colGold     = vec3(1.0, 0.82, 0.30);
            vec3 colAmber    = vec3(0.96, 0.58, 0.06);
            vec3 colFiery    = vec3(0.82, 0.28, 0.02);
            vec3 colDeepRust = vec3(0.42, 0.10, 0.01);

            vec3 color = vec3(0.0);
            if (u < 0.18) {
              color = mix(colWhiteHot, colGold, u / 0.18);
            } else if (u < 0.50) {
              color = mix(colGold, colAmber, (u - 0.18) / 0.32);
            } else if (u < 0.80) {
              color = mix(colAmber, colFiery, (u - 0.50) / 0.30);
            } else {
              color = mix(colFiery, colDeepRust, (u - 0.80) / 0.20);
            }

            // Crisp inner boundary and smooth exponential outer falloff into space
            float innerFade = smoothstep(0.0, 0.06, u);
            float outerFade = smoothstep(1.0, 0.58, u) * exp(-max(0.0, r - 5.2) * 0.85);
            float density = innerFade * outerFade;

            float intensity = (0.68 + 0.82 * combinedFlow) * doppler * density * (1.0 + uPulse * 0.80);
            gl_FragColor = vec4(color * intensity, intensity * 0.95 * uIntroAlpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      diskMesh = new THREE.Mesh(diskGeo, diskMaterial);
      diskMesh.rotation.x = 1.15;
      diskMesh.rotation.y = 0.0;
      diskMesh.rotation.z = 0.0;
      blackHoleRoot.add(diskMesh);

      // 8. Gravitational Lensing Halo (Arched Vertical Einstein Ring / Gargantua Deflection)
      const haloGeo = new THREE.RingGeometry(HORIZON_RADIUS + 0.06, 4.8, 128, 16);
      haloMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPulse: { value: 0 },
          uIntroAlpha: { value: 1.0 },
          uLensingStrength: { value: 1.0 },
          uDopplerBoost: { value: 0.45 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          varying float vRadius;
          void main() {
            vUv = uv;
            vPosition = position;
            vRadius = length(position.xy);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uPulse;
          uniform float uIntroAlpha;
          uniform float uLensingStrength;
          uniform float uDopplerBoost;
          varying vec2 vUv;
          varying vec3 vPosition;
          varying float vRadius;

          void main() {
            float r = vRadius;
            float rMin = 2.26;
            float rMax = 4.80;
            if (r < rMin || r > rMax) discard;

            float u = (r - rMin) / (rMax - rMin);
            float phi = atan(vPosition.y, vPosition.x);

            // Symmetric vertical Einstein deflection ring
            float verticalBeaming = pow(abs(cos(phi)), 1.6);
            float innerFalloff = smoothstep(0.0, 0.08, u);
            float outerFalloff = pow(1.0 - u, 2.2);

            vec3 colWhite = vec3(1.0, 0.97, 0.92);
            vec3 colAmber = vec3(0.96, 0.60, 0.05);
            vec3 col = mix(colWhite, colAmber, u);

            float intensity = innerFalloff * outerFalloff * (0.55 + 0.65 * verticalBeaming) * uLensingStrength * (1.0 + uPulse * 0.65);
            gl_FragColor = vec4(col * intensity, intensity * 0.65 * uIntroAlpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      haloMesh = new THREE.Mesh(haloGeo, haloMaterial);
      haloMesh.rotation.x = 0;
      haloMesh.rotation.y = 0;
      blackHoleRoot.add(haloMesh);

      // 8B. Horizontal Relativistic Coronal Beam (Eliminated per user specification)
      coronalBeamMesh = null;
      coronalBeamMaterial = null;

      // 9. Relativistic Infall Particles
      initInfallParticles();

      // 10. Gravitational Shockwave Pulse Ring (Matter Expulsion Wave)
      const shockGeo = new THREE.RingGeometry(0.1, 1.2, 96);
      shockwaveMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uRadius: { value: 0.0 },
          uAlpha: { value: 0.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPos;
          void main() {
            vUv = uv;
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uRadius;
          uniform float uAlpha;
          varying vec2 vUv;
          varying vec3 vPos;
          void main() {
            if (uAlpha <= 0.005) discard;
            float r = length(vPos.xy);
            float dist = abs(r - uRadius);
            if (dist > 1.2) discard;
            float ring = exp(-dist * 3.8);
            vec3 colWhite = vec3(1.0, 0.98, 0.95);
            vec3 colAmber = vec3(0.96, 0.62, 0.04);
            vec3 col = mix(colWhite, colAmber, clamp(dist * 0.85, 0.0, 1.0));
            float a = ring * uAlpha * 1.5;
            gl_FragColor = vec4(col * a, a);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      shockwaveMesh = new THREE.Mesh(shockGeo, shockwaveMaterial);
      shockwaveMesh.renderOrder = 998;
      blackHoleRoot.add(shockwaveMesh);

      // 11. Outward Blast Particles
      initBlastParticles();

      // 11B. Relativistic Quasar Bipolar Jet & Central Energy Flash
      initQuasarJets();
      initEnergyFlash();

      // 11C. Horizon Obsidian Shards & Luminous Rupture Cracks for Disintegration
      initHorizonShards();
      initCrackLines();

      // 12. Hit Area & Window Listeners (Click-and-Drag only movement)
      initHitAreaListeners();
      window.addEventListener('resize', onResize, { passive: true });
      window.addEventListener('scroll', onScrollHeroCheck, { passive: true });

      const introCloseBtn = document.getElementById('introHudCloseBtn');
      if (introCloseBtn) {
        introCloseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dismissIntroHud();
        });
      }

      animate();
    }

    function initInfallParticles() {
      const geo = new THREE.BufferGeometry();
      particlePositions = new Float32Array(PARTICLE_COUNT * 3);
      particleColors = new Float32Array(PARTICLE_COUNT * 3);
      particleData = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const radius = INNER_DISK_RADIUS + Math.random() * (OUTER_DISK_RADIUS - INNER_DISK_RADIUS);
        const angle = Math.random() * Math.PI * 2;
        const speed = (2.6 / Math.pow(radius, 1.25)) * (0.85 + Math.random() * 0.3);
        const drift = 0.08 + Math.random() * 0.14;
        const zSpread = (Math.random() - 0.5) * 0.45;

        particleData.push({
          radius: radius,
          angle: angle,
          speed: speed,
          drift: drift,
          zSpread: zSpread
        });

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = zSpread;

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        const heat = 1.0 - (radius - INNER_DISK_RADIUS) / (OUTER_DISK_RADIUS - INNER_DISK_RADIUS);
        particleColors[i * 3] = 0.96 + heat * 0.04;
        particleColors[i * 3 + 1] = 0.62 + heat * 0.35;
        particleColors[i * 3 + 2] = 0.04 + heat * 0.85;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.085,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      infallParticles = new THREE.Points(geo, mat);
      infallParticles.visible = false; // Disabled noisy yellow dots per user spec
      infallParticles.rotation.x = 1.15;
      infallParticles.rotation.y = 0.0;
      infallParticles.rotation.z = 0.0;
      blackHoleRoot.add(infallParticles);
    }

    function initBlastParticles() {
      const geo = new THREE.BufferGeometry();
      blastPositions = new Float32Array(BLAST_COUNT * 3);
      blastVelocities = new Float32Array(BLAST_COUNT * 3);
      blastColors = new Float32Array(BLAST_COUNT * 3);

      for (let i = 0; i < BLAST_COUNT; i++) {
        blastPositions[i * 3] = 0;
        blastPositions[i * 3 + 1] = 0;
        blastPositions[i * 3 + 2] = 0;

        blastVelocities[i * 3] = 0;
        blastVelocities[i * 3 + 1] = 0;
        blastVelocities[i * 3 + 2] = 0;

        blastColors[i * 3] = 1.0;
        blastColors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        blastColors[i * 3 + 2] = 0.2 + Math.random() * 0.4;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(blastPositions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(blastColors, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.16,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      blastMesh = new THREE.Points(geo, mat);
      blackHoleRoot.add(blastMesh);
    }

    // Relativistic Quasar Bipolar Jet Components (Collimated Spine + Turbulent Shear Sheath + Moving Knots)
    let upperSpineMesh, lowerSpineMesh, upperSheathMesh, lowerSheathMesh;
    let jetSpineMaterial, jetSheathMaterial;

    function initQuasarJets() {
      jetGroup = new THREE.Group();
      // Polar alignment: mathematically normal to the accretion disk plane
      jetGroup.rotation.x = (Math.PI * 0.38) - (Math.PI * 0.5);
      jetGroup.rotation.y = 0.14;
      jetGroup.rotation.z = -0.12;

      // 1. Central Collimated Relativistic Spine (Narrow, elegant, non-spiky jet stream)
      const upperSpineGeo = new THREE.CylinderGeometry(0.05, 0.35, 8.0, 32, 16, true);
      upperSpineGeo.translate(0, 4.5, 0);

      const lowerSpineGeo = new THREE.CylinderGeometry(0.35, 0.05, 8.0, 32, 16, true);
      lowerSpineGeo.translate(0, -4.5, 0);

      // 2. Turbulent Outer Shear Sheath (Soft boundary layer)
      const upperSheathGeo = new THREE.CylinderGeometry(0.12, 0.75, 8.0, 32, 16, true);
      upperSheathGeo.translate(0, 4.5, 0);

      const lowerSheathGeo = new THREE.CylinderGeometry(0.75, 0.12, 8.0, 32, 16, true);
      lowerSheathGeo.translate(0, -4.5, 0);

      // Core Spine Shader: Synchrotron emission, internal relativistic shock knots (HST-1 plasmoids)
      jetSpineMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0.0 },
          uAlpha: { value: 0.0 },
          uBeaming: { value: 1.85 } // Doppler boosted for approaching upper jet
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPos;
          void main() {
            vUv = uv;
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uProgress;
          uniform float uAlpha;
          uniform float uBeaming;
          varying vec2 vUv;
          varying vec3 vPos;

          void main() {
            if (uAlpha <= 0.005 || uProgress <= 0.001) discard;

            // vUv.y: 0 is near black hole base, 1 is outer reach
            float dist = vUv.y;
            float maxReach = clamp(uProgress * 1.32, 0.0, 1.0);
            if (dist > maxReach) discard;

            // Central core beam concentration with high-order Gaussian falloff
            float core = sin(vUv.x * 3.14159265);
            core = pow(core, 3.2);

            // Relativistic shock knots (discrete plasmoids propagating outward at relativistic apparent speeds)
            float knot1 = exp(-pow(fract(dist * 2.5 - uTime * 6.5) - 0.5, 2.0) * 38.0);
            float knot2 = exp(-pow(fract(dist * 4.6 - uTime * 9.2 + 0.35) - 0.5, 2.0) * 48.0);
            float knot3 = exp(-pow(fract(dist * 1.4 - uTime * 3.8 + 0.70) - 0.5, 2.0) * 24.0);
            float shocks = (knot1 * 1.6 + knot2 * 1.2 + knot3 * 0.9) * smoothstep(0.08, 0.25, dist);

            // Fine synchrotron plasma turbulence
            float plasmaFlow = sin(dist * 34.0 - uTime * 24.0) * 0.16 + 0.84;

            // Smooth nozzle base emergence & tip dissipation
            float baseFade = smoothstep(0.0, 0.04, dist);
            float tipFade = smoothstep(maxReach, maxReach * 0.75, dist);

            // Ultra-relativistic synchrotron spectrum:
            // Incandescent cyan-white nozzle core -> platinum gold -> amber shock boundaries
            vec3 colNozzleCyan = vec3(0.85, 0.96, 1.0);
            vec3 colWhiteHot    = vec3(1.0, 0.99, 0.96);
            vec3 colGold        = vec3(1.0, 0.86, 0.35);
            vec3 colAmber       = vec3(0.96, 0.55, 0.06);

            vec3 col = mix(colAmber, colGold, core);
            col = mix(col, colWhiteHot, pow(core, 2.4) * (1.0 - dist * 0.35));
            col = mix(col, colNozzleCyan, smoothstep(0.18, 0.02, dist) * pow(core, 1.8));

            // Knots burst with intense incandescent white-cyan highlights
            col += colNozzleCyan * shocks * 0.85;

            float intensity = (core * 1.5 + shocks) * plasmaFlow * baseFade * tipFade * uBeaming;
            float alpha = intensity * uAlpha;

            gl_FragColor = vec4(col * alpha, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      // Turbulent Outer Sheath Shader: Helical Kelvin-Helmholtz plasma coils and diffuse halo
      jetSheathMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0.0 },
          uAlpha: { value: 0.0 },
          uBeaming: { value: 1.45 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPos;
          void main() {
            vUv = uv;
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uProgress;
          uniform float uAlpha;
          uniform float uBeaming;
          varying vec2 vUv;
          varying vec3 vPos;

          void main() {
            if (uAlpha <= 0.005 || uProgress <= 0.001) discard;

            float dist = vUv.y;
            float maxReach = clamp(uProgress * 1.22, 0.0, 1.0);
            if (dist > maxReach) discard;

            float sheath = sin(vUv.x * 3.14159265);
            sheath = pow(sheath, 1.6);

            // Helical magnetic field coils wrapping around the jet axis
            float phi = vUv.x * 6.2831853;
            float helix = sin(dist * 12.0 - uTime * 18.0 + phi * 2.0) * 0.35 + 0.65;

            float baseFade = smoothstep(0.0, 0.08, dist);
            float tipFade = smoothstep(maxReach, maxReach * 0.65, dist);

            vec3 colGold  = vec3(1.0, 0.82, 0.30);
            vec3 colAmber = vec3(0.96, 0.52, 0.04);
            vec3 colRust  = vec3(0.68, 0.22, 0.02);

            vec3 col = mix(colRust, colAmber, sheath);
            col = mix(col, colGold, pow(sheath, 2.2) * 0.7);

            float intensity = sheath * helix * baseFade * tipFade * 0.85 * uBeaming;
            float alpha = intensity * uAlpha * 0.75;

            gl_FragColor = vec4(col * alpha, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      // Backward compatibility reference for lifecycle animations
      jetMaterial = jetSpineMaterial;

      // Upper Jet: Approaching observer (Doppler boosted)
      upperSpineMesh = new THREE.Mesh(upperSpineGeo, jetSpineMaterial);
      upperSpineMesh.renderOrder = 997;
      jetGroup.add(upperSpineMesh);

      upperSheathMesh = new THREE.Mesh(upperSheathGeo, jetSheathMaterial);
      upperSheathMesh.renderOrder = 996;
      jetGroup.add(upperSheathMesh);

      // Lower Jet: Receding counter-jet (Doppler de-boosted)
      // Create separate counter-jet material with dimmer relativistic beaming
      const counterSpineMat = jetSpineMaterial.clone();
      counterSpineMat.uniforms.uBeaming.value = 0.55; // Astrophysical counter-jet attenuation
      lowerSpineMesh = new THREE.Mesh(lowerSpineGeo, counterSpineMat);
      lowerSpineMesh.renderOrder = 997;
      jetGroup.add(lowerSpineMesh);

      const counterSheathMat = jetSheathMaterial.clone();
      counterSheathMat.uniforms.uBeaming.value = 0.42;
      lowerSheathMesh = new THREE.Mesh(lowerSheathGeo, counterSheathMat);
      lowerSheathMesh.renderOrder = 996;
      jetGroup.add(lowerSheathMesh);

      upperJetMesh = upperSpineMesh;
      lowerJetMesh = lowerSpineMesh;

      blackHoleRoot.add(jetGroup);
    }

    function initEnergyFlash() {
      // Anisotropic directional radiation flare (elongated along jet axis)
      const flashGeo = new THREE.PlaneGeometry(24, 12);
      flashMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uAlpha: { value: 0.0 },
          uTime: { value: 0.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uAlpha;
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            if (uAlpha <= 0.005) discard;
            // Elliptical anisotropic profile aligned with the bipolar eruption
            vec2 p = (vUv - vec2(0.5)) * 2.0;
            p.x *= 0.65; // Elongate along vertical polar axis
            float d = length(p);
            if (d > 1.0) discard;
            float core = exp(-d * 4.2);
            vec3 colCyanWhite = vec3(0.90, 0.96, 1.0);
            vec3 colGold      = vec3(1.0, 0.85, 0.32);
            vec3 colAmber     = vec3(0.96, 0.58, 0.05);
            vec3 col = mix(colCyanWhite, colGold, clamp(d * 0.7, 0.0, 1.0));
            col = mix(col, colAmber, clamp(d * 1.4 - 0.4, 0.0, 1.0));
            float a = core * uAlpha * 1.4;
            gl_FragColor = vec4(col * a, a);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      flashMesh = new THREE.Mesh(flashGeo, flashMaterial);
      flashMesh.renderOrder = 998;
      blackHoleRoot.add(flashMesh);
    }

    function initHorizonShards() {
      horizonShardsGroup = new THREE.Group();
      horizonShardsGroup.visible = false;
      horizonShards = [];

      const shardGeo = new THREE.TetrahedronGeometry(0.42, 0);
      const shardMat = new THREE.ShaderMaterial({
        uniforms: {
          uAlpha: { value: 1.0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            vViewPos = -mvPos.xyz;
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          uniform float uAlpha;
          varying vec3 vNormal;
          varying vec3 vViewPos;
          void main() {
            vec3 N = normalize(vNormal);
            vec3 V = normalize(vViewPos);
            float rim = 1.0 - max(0.0, dot(N, V));
            rim = pow(rim, 3.0);
            vec3 baseCol = vec3(0.04, 0.035, 0.05);
            vec3 edgeCol = vec3(0.96, 0.62, 0.12);
            vec3 col = baseCol + edgeCol * rim * 0.95;
            gl_FragColor = vec4(col, uAlpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide
      });

      const shardCount = 28;
      for (let i = 0; i < shardCount; i++) {
        const phi = Math.acos(1.0 - 2.0 * (i + 0.5) / shardCount);
        const theta = Math.PI * (1.0 + Math.sqrt(5.0)) * (i + 0.5);
        const dir = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi)
        ).normalize();

        const sScale = 0.75 + ((i * 13) % 10) * 0.06;
        const shardMesh = new THREE.Mesh(shardGeo.clone(), shardMat.clone());
        shardMesh.scale.set(sScale, sScale * 1.25, sScale * 0.85);

        const initialPos = dir.clone().multiplyScalar(HORIZON_RADIUS);
        shardMesh.position.copy(initialPos);

        const rotVel = new THREE.Vector3(
          ((i % 5) - 2) * 2.6,
          (((i * 3) % 7) - 3) * 2.4,
          (((i * 7) % 5) - 2) * 2.8
        );
        const speed = 7.2 + ((i * 17) % 11) * 0.90;

        horizonShards.push({
          mesh: shardMesh,
          initialPos: initialPos,
          dir: dir,
          speed: speed,
          rotVel: rotVel,
          initialRot: new THREE.Euler(i * 0.42, i * 0.78, i * 0.25)
        });

        shardMesh.rotation.copy(horizonShards[i].initialRot);
        horizonShardsGroup.add(shardMesh);
      }
      blackHoleRoot.add(horizonShardsGroup);
    }

    function initCrackLines() {
      crackLinesGroup = new THREE.Group();
      crackLinesGroup.visible = false;
      crackLines = [];

      crackMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uAlpha: { value: 0.0 }
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
          uniform float uAlpha;
          varying vec2 vUv;
          void main() {
            if (uAlpha <= 0.005) discard;
            vec3 colWhite = vec3(1.0, 0.98, 0.92);
            vec3 colGold = vec3(1.0, 0.84, 0.35);
            float pulse = 0.75 + 0.25 * sin(uTime * 35.0 + vUv.x * 12.0);
            vec3 col = mix(colGold, colWhite, pulse);
            float alpha = uAlpha * pulse;
            gl_FragColor = vec4(col * alpha, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      for (let c = 0; c < 6; c++) {
        const points = [];
        const basePhi = (c * Math.PI) / 3;
        const segments = 16;
        for (let s = 0; s <= segments; s++) {
          const frac = s / segments;
          const theta = frac * Math.PI;
          const phi = basePhi + Math.sin(frac * Math.PI * 2.0) * 0.45;
          const r = HORIZON_RADIUS * 1.018;
          points.push(new THREE.Vector3(
            r * Math.sin(theta) * Math.cos(phi),
            r * Math.sin(theta) * Math.sin(phi),
            r * Math.cos(theta)
          ));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.048, 6, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, crackMaterial);
        tubeMesh.renderOrder = 998;
        crackLinesGroup.add(tubeMesh);
        crackLines.push(tubeMesh);
      }
      blackHoleRoot.add(crackLinesGroup);
    }

    function triggerFullscreenEnergyFlash(bhX, bhY, genId) {
      const flashEl = document.getElementById('cosmicEnergyFlash');
      if (!flashEl) return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        flashEl.style.transition = 'none';
        flashEl.style.opacity = '0';
        return;
      }
      flashEl.style.setProperty('--flash-x', `${bhX.toFixed(1)}px`);
      flashEl.style.setProperty('--flash-y', `${bhY.toFixed(1)}px`);
      flashEl.style.transition = 'none';
      // Restrained, directional anisotropic radiation burst (never blinding full-screen whiteout)
      flashEl.style.opacity = '0.52';
      requestAnimationFrame(() => {
        if (typeof genId === 'number' && !BlackHoleLifecycle.isCurrentGeneration(genId)) {
          flashEl.style.transition = 'none';
          flashEl.style.opacity = '0';
          return;
        }
        flashEl.style.transition = 'opacity 0.48s cubic-bezier(0.16, 1, 0.3, 1)';
        flashEl.style.opacity = '0';
      });
    }

    function initHitAreaListeners() {
      const hitArea = document.getElementById('blackHoleHitArea');
      if (!hitArea) return;

      hitArea.addEventListener('pointerdown', onHitAreaPointerDown);
      hitArea.addEventListener('pointermove', onHitAreaPointerMove);
      hitArea.addEventListener('pointerup', onHitAreaPointerUp);
      hitArea.addEventListener('pointercancel', onHitAreaPointerUp);

      window.addEventListener('pointermove', onHitAreaPointerMove);
      window.addEventListener('pointerup', onHitAreaPointerUp);
      window.addEventListener('pointercancel', onHitAreaPointerUp);

      hitArea.addEventListener('touchstart', (e) => {
        // Prevent default mobile scrolling when starting touch drag on the black hole
        if (e.cancelable) e.preventDefault();
      }, { passive: false });
      hitArea.addEventListener('touchmove', (e) => {
        if (isDragging && e.cancelable) e.preventDefault();
      }, { passive: false });

      hitArea.addEventListener('keydown', (e) => {
        if ([' ', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.key)) {
          e.preventDefault();
        }
        if (e.key === ' ' || e.key === 'Enter') {
          if (!BlackHoleLifecycle.isInteracting() || !isHeroActive) return;
          if (typeof GravitationalEngine !== 'undefined' && GravitationalEngine.triggerCollapseAndDestruction) {
            GravitationalEngine.triggerCollapseAndDestruction();
          } else {
            triggerDestructionSequence();
          }
          return;
        }

        // Full keyboard arrow control across the entire hero width and height
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
          if (!BlackHoleLifecycle.canDrag() || !isHeroActive) return;
          dismissIntroHud();
          hasUserDragged = true;
          const step = e.shiftKey ? 50 : 20;
          let dx = 0;
          let dy = 0;
          if (e.key === 'ArrowLeft') dx = -step;
          if (e.key === 'ArrowRight') dx = step;
          if (e.key === 'ArrowUp') dy = -step;
          if (e.key === 'ArrowDown') dy = step;

          const clamped = clampToHeroBounds(heroRelX + dx, heroRelY + dy);
          dragVelX = clamped.x - heroRelX;
          dragVelY = clamped.y - heroRelY;
          heroRelX = clamped.x;
          heroRelY = clamped.y;
          updateContainerDOM();
        }
      });

      hitArea.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isDragging || hasDragged) return;
        if (!BlackHoleLifecycle.isInteracting() || !isHeroActive) return;
        tapCount = 0;
        if (tapResetTimer) { clearTimeout(tapResetTimer); tapResetTimer = null; }
        if (typeof GravitationalEngine !== 'undefined' && GravitationalEngine.triggerCollapseAndDestruction) {
          GravitationalEngine.triggerCollapseAndDestruction();
        } else {
          triggerDestructionSequence();
        }
      });
    }

    let dragOffsetHeroX = 0;
    let dragOffsetHeroY = 0;

    function onHitAreaPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (!BlackHoleLifecycle.canDrag() || !isHeroActive) return;

      // Never initiate drag if click originated on or inside another interactive element
      if (e.target.closest('button, a, input, textarea, select')) return;

      dismissIntroHud();
      isDragging = true;
      hasDragged = false;
      activePointerId = e.pointerId;
      dragStartPointerX = e.clientX;
      dragStartPointerY = e.clientY;
      pointerDownTime = performance.now();
      dragStartRelX = heroRelX;
      dragStartRelY = heroRelY;

      const heroEl = document.getElementById('hero');
      const heroRect = heroEl ? heroEl.getBoundingClientRect() : { left: 0, top: 0 };
      dragOffsetHeroX = (e.clientX - heroRect.left) - heroRelX;
      dragOffsetHeroY = (e.clientY - heroRect.top) - heroRelY;

      try {
        e.target.setPointerCapture(e.pointerId);
      } catch (err) {}

      document.body.classList.add('blackhole-dragging');
    }

    function onHitAreaPointerMove(e) {
      if (!isDragging || e.pointerId !== activePointerId || !BlackHoleLifecycle.canDrag()) {
        if (isHeroActive && haloMaterial && BlackHoleLifecycle.canDrag()) {
          haloMaterial.uniforms.uPulse.value = Math.max(haloMaterial.uniforms.uPulse.value, 0.20);
        }
        return;
      }

      const dx = e.clientX - dragStartPointerX;
      const dy = e.clientY - dragStartPointerY;

      if (!hasDragged && Math.hypot(dx, dy) >= 6) {
        hasDragged = true;
        hasUserDragged = true;
        tapCount = 0;
        if (tapResetTimer) { clearTimeout(tapResetTimer); tapResetTimer = null; }
        if (BlackHoleLifecycle.is('IDLE')) {
          BlackHoleLifecycle.setState('CONSUMING');
        }
      }

      if (hasDragged) {
        e.preventDefault(); // Prevent unwanted text selection while dragging
        const heroEl = document.getElementById('hero');
        const heroRect = heroEl ? heroEl.getBoundingClientRect() : { left: 0, top: 0 };
        const targetRelX = (e.clientX - heroRect.left) - dragOffsetHeroX;
        const targetRelY = (e.clientY - heroRect.top) - dragOffsetHeroY;
        const clamped = clampToHeroBounds(targetRelX, targetRelY);

        dragVelX = clamped.x - heroRelX;
        dragVelY = clamped.y - heroRelY;

        heroRelX = clamped.x;
        heroRelY = clamped.y;
        anchorHeroX = clamped.x;
        anchorHeroY = clamped.y;

        updateContainerDOM();
      }
    }

    function onHitAreaPointerUp(e) {
      if (!isDragging || (activePointerId !== null && e.pointerId !== activePointerId)) return;

      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch (err) {}

      isDragging = false;
      activePointerId = null;
      document.body.classList.remove('blackhole-dragging');
      dragVelX = 0;
      dragVelY = 0;
      smoothVelX = 0;
      smoothVelY = 0;

      if (hasDragged) {
        // Deliberate drag completed: settle firmly at release position, invalidate tap count
        tapCount = 0;
        if (tapResetTimer) { clearTimeout(tapResetTimer); tapResetTimer = null; }
        setTimeout(() => { hasDragged = false; }, 80);
      } else {
        hasDragged = false;
        const now = performance.now();
        const duration = now - pointerDownTime;
        const dist = Math.hypot(e.clientX - dragStartPointerX, e.clientY - dragStartPointerY);

        // Stage 1 Tap Detection: Count only valid, intentional taps (< 6px movement, < 450ms duration)
        if (dist < 6 && duration < 450) {
          if (!isHeroActive) return;

          // Immediate subtle tactile visual feedback on the black hole
          pulseScale = 1.08;
          pulseUniformValue = 1.45;

          if (BlackHoleLifecycle.is('IDLE')) {
            BlackHoleLifecycle.setState('CONSUMING');
          }

          if (tapResetTimer) clearTimeout(tapResetTimer);
          tapCount++;

          if (tapCount >= TAP_THRESHOLD) {
            tapCount = 0;
            tapResetTimer = null;
            if (typeof GravitationalEngine !== 'undefined' && GravitationalEngine.triggerCollapseAndDestruction) {
              GravitationalEngine.triggerCollapseAndDestruction();
            } else {
              triggerDestructionSequence();
            }
          } else {
            tapResetTimer = setTimeout(() => {
              tapCount = 0;
              tapResetTimer = null;
            }, 1200);
          }
        }
      }

      if (BlackHoleLifecycle.isInteracting() || BlackHoleLifecycle.is('CONSUMING')) {
        if (BlackHoleLifecycle.isOrbitalGalaxy()) {
          // Remains in ORBITAL_GALAXY
        } else if (hasUserDragged || (typeof GravitationalEngine !== 'undefined' && GravitationalEngine.hasActiveTargets && GravitationalEngine.hasActiveTargets())) {
          BlackHoleLifecycle.setState('CONSUMING');
        } else if (typeof GravitationalEngine !== 'undefined' && GravitationalEngine.getConsumedCount && GravitationalEngine.getConsumedCount() > 0) {
          BlackHoleLifecycle.setState('CONSUMING');
        } else {
          BlackHoleLifecycle.setState('IDLE');
        }
      }
    }

    function checkHeroConfinement() {
      const heroEl = document.getElementById('hero');
      if (!heroEl) return false;
      const rect = heroEl.getBoundingClientRect();
      return rect.bottom > 60 && rect.top < window.innerHeight;
    }

    // Scroll handler: scrolling must keep currentScreenX/Y synchronously aligned with hero
    function onScrollHeroCheck() {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        currentScreenX = heroRect.left + heroRelX;
        currentScreenY = heroRect.top + heroRelY;
        targetScreenX = currentScreenX;
        targetScreenY = currentScreenY;
      }
      const inHero = checkHeroConfinement();
      updateHeroConfinementState(inHero);
    }

    function updateHeroConfinementState(inHero) {
      const container = document.getElementById('blackHoleContainer');
      const pCanvas = document.getElementById('portraitFragmentCanvas');
      const hud = document.getElementById('blackHoleIntroHud');

      isHeroActive = inHero;
      if (!inHero) {
        if (canvas) canvas.classList.add('is-hero-hidden');
        if (container) container.classList.add('is-hero-hidden');
        if (pCanvas) pCanvas.classList.add('is-hero-hidden');
        if (hud) {
          hud.classList.add('is-hero-hidden');
          hud.classList.remove('is-visible');
        }
      } else {
        if (canvas) canvas.classList.remove('is-hero-hidden');
        if (container) container.classList.remove('is-hero-hidden');
        if (pCanvas) pCanvas.classList.remove('is-hero-hidden');
        if (hud && !hud.classList.contains('is-dismissed')) {
          hud.classList.remove('is-hero-hidden');
        }
      }
    }

    function showIntroHud() {
      // Phase 2.6 / Polish Requirement 2: Guidance banner removed permanently from hero
      const hud = document.getElementById('blackHoleIntroHud');
      if (hud) {
        hud.style.display = 'none';
        hud.style.visibility = 'hidden';
      }
    }

    function toggleIntroHud() {
      const hud = document.getElementById('blackHoleIntroHud');
      if (!hud) return;
      if (hud.classList.contains('is-user-open')) {
        dismissIntroHud();
      } else {
        hud.classList.remove('is-dismissed', 'is-hero-hidden');
        hud.classList.add('is-user-open');
        updateIntroHudPosition();
      }
    }

    function dismissIntroHud() {
      const hud = document.getElementById('blackHoleIntroHud');
      if (hud) {
        hud.classList.remove('is-user-open');
        hud.classList.add('is-dismissed');
      }
      try {
        sessionStorage.setItem('bh_intro_dismissed', '1');
      } catch (e) {}
    }

    function dismissIntroHud() {
      const hud = document.getElementById('blackHoleIntroHud');
      if (hud) {
        hud.classList.add('is-dismissed');
        hud.classList.remove('is-visible');
      }
      try {
        sessionStorage.setItem('bh_intro_dismissed', '1');
      } catch (e) {}
    }

    function updateIntroHudPosition() {
      // Phase 2.6 / Polish Requirement 2: Guidance banner removed permanently from hero
      const hud = document.getElementById('blackHoleIntroHud');
      if (hud) {
        hud.style.display = 'none';
        hud.style.visibility = 'hidden';
      }
    }
    function triggerPreDestructionGatheringPulse(onComplete) {
      if (BlackHoleLifecycle.isDestroying() || BlackHoleLifecycle.isDestroyed() || BlackHoleLifecycle.isRestoring()) return;
      if (!BlackHoleLifecycle.canTransitionTo('DESTROYING')) return;
      BlackHoleLifecycle.setState('DESTROYING', 'CHARGE');
      const genId = BlackHoleLifecycle.getGenerationId();
      currentDestructionGenId = genId;
      dismissIntroHud();
      pulseScale = 0.88;
      pulseUniformValue = 2.8;
      flashAlpha = 0.50;
      if (flashMaterial && flashMaterial.uniforms && flashMaterial.uniforms.uAlpha) {
        flashMaterial.uniforms.uAlpha.value = 0.50;
      }
      setTimeout(() => {
        if (!BlackHoleLifecycle.isCurrentGeneration(genId) || !BlackHoleLifecycle.is('DESTROYING')) return;
        if (typeof onComplete === 'function') {
          onComplete(genId);
        }
      }, 180);
    }

    // Window resize: never resets user-dragged position, safely re-clamps to new hero bounds
    function onResize() {
      if (!renderer || !camera) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      targetScale = getResponsiveInitialScale();
      currentScale = targetScale;

      if (hasUserDragged) {
        // Retain user's custom position, re-clamping within safe bounds so it is never trapped
        const clamped = clampToHeroBounds(heroRelX, heroRelY);
        heroRelX = clamped.x;
        heroRelY = clamped.y;
      } else {
        // Adapt default placement to new screen dimensions
        const defPos = computeDefaultHeroPosition();
        heroRelX = defPos.x;
        heroRelY = defPos.y;
      }
      updateContainerDOM();
    }

    function animate() {
      animId = requestAnimationFrame(animate);
      try {
      const delta = Math.min(clock.getDelta(), 0.05); // clamp against frame lag spikes
      const elapsed = clock.getElapsedTime();

      // Check hero confinement on each animation tick
      const inHero = checkHeroConfinement();
      updateHeroConfinementState(inHero);

      if (!inHero) {
        // Black hole is outside hero section - skip Three.js rendering and clear buffer
        if (renderer) renderer.clear();
        return;
      }

      // Natural hero-anchored visibility for hero canvas: remains 100% visible while hero section is in view,
      // smoothly fading only when the hero section leaves the viewport past the top (rect.bottom < 180)
      const heroEl = document.getElementById('hero');
      if (!heroEl) return;
      const heroRect = heroEl.getBoundingClientRect();

      let heroExitAlpha = 1.0;
      if (heroRect.bottom < 180) {
        heroExitAlpha = Math.max(0, Math.min(1, heroRect.bottom / 180));
      }
      if (canvas) canvas.style.opacity = heroExitAlpha.toFixed(3);
      const bhContEl = document.getElementById('blackHoleContainer');
      if (bhContEl) bhContEl.style.opacity = '1';

      if (heroRelX <= 10 || heroRelY <= 10) {
        const defPos = computeDefaultHeroPosition();
        heroRelX = defPos.x;
        heroRelY = defPos.y;
        anchorHeroX = defPos.x;
        anchorHeroY = defPos.y;
      }

      // SYNCHRONOUS HERO-ANCHORED SCREEN POSITION:
      // Page scrolling moves heroRect.top; currentScreenY matches synchronously with ZERO lag!
      currentScreenX = heroRect.left + heroRelX;
      currentScreenY = heroRect.top + heroRelY;
      targetScreenX = currentScreenX;
      targetScreenY = currentScreenY;

      // Keep DOM container and draggable hit area aligned frame-synchronously
      const bhContainerEl = document.getElementById('blackHoleContainer');
      if (bhContainerEl) {
        bhContainerEl.style.setProperty('--bh-x', `${Math.round(heroRelX)}px`);
        bhContainerEl.style.setProperty('--bh-y', `${Math.round(heroRelY)}px`);
        const hitSize = Math.max(90, Math.round(150 * (currentScale / 0.26)));
        bhContainerEl.style.setProperty('--bh-hit-size', `${hitSize}px`);
      }

      // Banking velocity is active ONLY during deliberate user drag:
      if (isDragging) {
        const velFilter = 1.0 - Math.exp(-12.0 * delta);
        smoothVelX += (dragVelX - smoothVelX) * velFilter;
        smoothVelY += (dragVelY - smoothVelY) * velFilter;
        dragVelX = 0;
        dragVelY = 0;
      } else {
        // Stationary when not dragging: ZERO banking, ZERO tilt flutter, ZERO drift!
        smoothVelX = 0;
        smoothVelY = 0;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;

      // Closed-form projection from viewport screen pixels to Three.js world space
      // distZ precisely equals camera.position.z (20.0) - blackHoleRoot.position.z (0.0) for zero-parallax subpixel alignment
      const fovRad = (45 / 2) * (Math.PI / 180);
      const distZ = camera.position.z - (blackHoleRoot ? blackHoleRoot.position.z : 0.0);
      const vHalfHeight = Math.tan(fovRad) * distZ;
      const vHalfWidth = vHalfHeight * aspect;

      const ndcX = (currentScreenX / width) * 2 - 1;
      const ndcY = -(currentScreenY / height) * 2 + 1;

      // ══════════════════════════════════════════════════════════════════
      // 5-STAGE CINEMATIC INTRODUCTION TIMELINE (NON-BLOCKING STARTUP)
      // ══════════════════════════════════════════════════════════════════
      let introDiskAlpha = 1.0;
      let introHaloAlpha = 1.0;
      let introPhotonAlpha = 1.0;
      let activeParticleRatio = 1.0;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (introState !== 'SETTLED') {
        introState = 'SETTLED';
        currentScale = INITIAL_SCALE;
        targetScale = INITIAL_SCALE;
        introDiskAlpha = 1.0;
        introHaloAlpha = 1.0;
        introPhotonAlpha = 1.0;
        activeParticleRatio = 1.0;
        showIntroHud();
      } else {
        // Framerate-independent smooth mass accretion once settled
        if (destructionTimer <= 0) {
          targetScale = getConsumptionTargetScale();
        }
        const scaleDamp = 1.0 - Math.exp(-3.2 * delta);
        currentScale += (targetScale - currentScale) * scaleDamp;
      }

      const pulseDamp = 1.0 - Math.exp(-7.5 * delta);
      pulseScale += (1.0 - pulseScale) * pulseDamp;

      const uniformDamp = 1.0 - Math.exp(-5.0 * delta);
      pulseUniformValue += (0.0 - pulseUniformValue) * uniformDamp;

      const compositeScale = currentScale * pulseScale;

      if (blackHoleRoot) {
        // Phase 2 Continuous Journey Recession
        // As spacecraft accelerates forward into deep space, black hole recedes along -Z and scales smoothly
        let journeyRecession = 0.0;
        if (window.MasterJourneyController && typeof window.MasterJourneyController.getProgress === 'function') {
          const jt = window.MasterJourneyController.getProgress();
          if (jt > 0.0001) {
            const rawU = Math.min(1.0, jt / 0.16);
            journeyRecession = rawU * rawU * (3.0 - 2.0 * rawU);
          }
        }
        const recedeScale = 1.0 - 0.75 * journeyRecession;
        blackHoleRoot.position.x = (ndcX * vHalfWidth) - (3.5 * journeyRecession);
        blackHoleRoot.position.y = (ndcY * vHalfHeight) + (0.8 * journeyRecession);
        blackHoleRoot.position.z = -2.0 - (16.0 * journeyRecession);

        // Constrained Orientation Model:
        // Maintains natural, stable viewing angle and counteracts perspective camera parallax
        // Center-screen resting orientation: approximately horizontal, tilted naturally toward viewer
        const BASE_PITCH = 1.04; // ~59.5 deg pitch (creates majestic open elliptical aspect ratio b/a ~ 0.51)
        
        // Calculate camera view ray angle to black hole position in world space
        // Camera is at (0, 0, 20), black hole is at (x, y, -2). Camera-to-BH distance in Z is 22.0.
        const camParallaxY = Math.atan2(blackHoleRoot.position.y, 22.0);
        const camParallaxX = Math.atan2(blackHoleRoot.position.x, 22.0);

        // Dynamic gyroscopic banking with low-speed deadband
        const speed = Math.sqrt(smoothVelX * smoothVelX + smoothVelY * smoothVelY);
        const bankFactor = Math.min(1.0, speed / 3.2);
        
        // Clamped subtle banking (prevents rapid tipping, fluttering or extreme angles)
        const rawBankZ = -smoothVelX * 0.0035 * bankFactor;
        const targetBankZ = THREE.MathUtils.clamp(rawBankZ, -0.05, 0.05); // max ±2.8 deg
        
        const rawBankX = smoothVelY * 0.0025 * bankFactor;
        const dynamicBankX = THREE.MathUtils.clamp(rawBankX, -0.04, 0.04);

        // Counteract vertical perspective parallax:
        // As BH moves up (y > 0), camParallaxY > 0. We subtract camParallaxY from world pitch
        // so the effective pitch in camera space stays constant without steepening or tipping over!
        const compensatedPitch = BASE_PITCH - camParallaxY + dynamicBankX;
        
        // Strictly clamp pitch to prevent extreme angles, flattening, or flipping upside down!
        const clampedPitch = THREE.MathUtils.clamp(compensatedPitch, 0.85, 1.20);
        
        // Slight yaw compensation for horizontal parallax
        const compensatedYaw = -camParallaxX * 0.35;

        // Smoothly apply orientation to diskMesh, photonMesh, and infallParticles
        const rotDamp = 1.0 - Math.exp(-8.0 * delta);
        if (diskMesh) {
          diskMesh.rotation.x += (clampedPitch - diskMesh.rotation.x) * rotDamp;
          diskMesh.rotation.y += (compensatedYaw - diskMesh.rotation.y) * rotDamp;
          diskMesh.rotation.z += (0.0 - diskMesh.rotation.z) * rotDamp;
        }
        if (photonMesh) {
          photonMesh.rotation.x = diskMesh.rotation.x;
          photonMesh.rotation.y = diskMesh.rotation.y;
          photonMesh.rotation.z = diskMesh.rotation.z;
        }
        if (infallParticles) {
          infallParticles.rotation.x = diskMesh.rotation.x;
          infallParticles.rotation.y = diskMesh.rotation.y;
          infallParticles.rotation.z = diskMesh.rotation.z;
        }

        // Subtle root banking strictly on Z
        blackHoleRoot.rotation.z += (targetBankZ - blackHoleRoot.rotation.z) * rotDamp;
        blackHoleRoot.rotation.x += (0.0 - blackHoleRoot.rotation.x) * rotDamp;

        // Keep bipolar jet group strictly aligned with the tilted accretion disk orientation
        if (jetGroup && diskMesh) {
          jetGroup.rotation.x = diskMesh.rotation.x - Math.PI * 0.5;
          jetGroup.rotation.y = diskMesh.rotation.y;
          jetGroup.rotation.z = diskMesh.rotation.z;
        }

        // Scale horizon, disk, photon ring, lensing halo & particles synchronously
        const finalBhScale = compositeScale * recedeScale;
        blackHoleRoot.scale.set(finalBhScale, finalBhScale, finalBhScale);
      }

      // Dynamic consumption responsiveness for disk intensity and gravitational lensing
      const maxConsScale = getMaxConsumptionScale();
      const consRatio = Math.max(0.0, Math.min(1.0, (currentScale - INITIAL_SCALE) / Math.max(0.04, maxConsScale - INITIAL_SCALE)));

      if (diskMaterial && destructionTimer <= 0) {
        diskMaterial.uniforms.uTime.value = elapsed * (1.0 + consRatio * 0.45);
        diskMaterial.uniforms.uPulse.value = pulseUniformValue;
        diskMaterial.uniforms.uAccretionSpeed.value = 1.0 + consRatio * 0.50;
        diskMaterial.uniforms.uTemperature.value = consRatio * 0.35;
        if (diskMaterial.uniforms.uIntroAlpha) diskMaterial.uniforms.uIntroAlpha.value = introDiskAlpha;
      }
      if (haloMaterial && destructionTimer <= 0) {
        haloMaterial.uniforms.uTime.value = elapsed;
        haloMaterial.uniforms.uPulse.value = pulseUniformValue;
        haloMaterial.uniforms.uLensingStrength.value = 1.0 + consRatio * 0.40;
        if (haloMaterial.uniforms.uIntroAlpha) haloMaterial.uniforms.uIntroAlpha.value = introHaloAlpha;
      }
      if (coronalBeamMaterial) {
        coronalBeamMaterial.uniforms.uTime.value = elapsed;
        coronalBeamMaterial.uniforms.uPulse.value = pulseUniformValue;
        if (coronalBeamMaterial.uniforms.uIntroAlpha) coronalBeamMaterial.uniforms.uIntroAlpha.value = introDiskAlpha;
      }
      if (photonMesh && photonMesh.material && photonMesh.material.uniforms) {
        if (photonMesh.material.uniforms.uPulse) photonMesh.material.uniforms.uPulse.value = pulseUniformValue;
        if (photonMesh.material.uniforms.uIntroAlpha) photonMesh.material.uniforms.uIntroAlpha.value = introPhotonAlpha;
      }

      // Relativistic particle infall around the moving black hole singularity
      if (infallParticles && particlePositions && particleData) {
        const dt = Math.min(delta, 0.05);
        const activeLimit = Math.floor(PARTICLE_COUNT * activeParticleRatio);
        if (infallParticles.material) {
          infallParticles.material.opacity = Math.min(0.95, activeParticleRatio);
        }
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          if (i >= activeLimit) {
            particlePositions[i * 3 + 2] = -9999.0;
            continue;
          }
          const p = particleData[i];

          p.angle += p.speed * dt;
          p.radius -= p.drift * (4.2 / p.radius) * dt;

          if (p.radius <= HORIZON_RADIUS + 0.05) {
            p.radius = OUTER_DISK_RADIUS * (0.85 + Math.random() * 0.25);
            p.angle = Math.random() * Math.PI * 2;
            p.speed = (2.6 / Math.pow(p.radius, 1.25)) * (0.85 + Math.random() * 0.3);
          }

          particlePositions[i * 3] = Math.cos(p.angle) * p.radius;
          particlePositions[i * 3 + 1] = Math.sin(p.angle) * p.radius;
          particlePositions[i * 3 + 2] = p.zSpread;
        }
        infallParticles.geometry.attributes.position.needsUpdate = true;
      }

      // ══════════════════════════════════════════════════════════════════
      // LIFECYCLE DESTRUCTION & RECREATION TIMELINE:
      // DESTROYING (0.0s - 1.1s) -> QUASAR_BURST (1.1s - 2.4s) -> RECONSTITUTING (2.4s - 3.8s) -> ORBITAL_GALAXY (3.8s+)
      // ══════════════════════════════════════════════════════════════════
      if (BlackHoleLifecycle.isReadyToDestroy() || BlackHoleLifecycle.isDestroying() || BlackHoleLifecycle.isQuasarBurst() || BlackHoleLifecycle.isReconstituting() || BlackHoleLifecycle.isRebuilding()) {
        if (destructionStartTime) {
          destructionTimer = (performance.now() - destructionStartTime) / 1000;
        } else {
          destructionTimer += delta;
        }
        if (currentScale > peakObservedDestructionScale) {
          peakObservedDestructionScale = currentScale;
        }

        // Black hole remains user-interactive and responsive; anchor updates whenever user drags
        if (isDragging) {
          anchorHeroX = heroRelX;
          anchorHeroY = heroRelY;
        }

        // ══════════════════════════════════════════════════════════════════
        // 5-STAGE CONTROLLED CINEMATIC DESTRUCTION SEQUENCE
        // Stage A: Gravitational activation (0.00s - 0.70s)
        // Stage B: Accretion acceleration (0.70s - 1.40s)
        // Stage C: Relativistic flare (1.40s - 1.85s)
        // Stage D: Controlled ejection (1.85s - 2.75s)
        // Stage E: Settle (2.75s - 3.50s) -> Stabilized to IDLE ready for interaction







        // ══════════════════════════════════════════════════════════════════

        // ══════════════════════════════════════════════════════════════════
        // 4-STAGE CINEMATIC BLACK-HOLE DESTRUCTION SEQUENCE
        // STAGE 1: Gravitational Acceleration (0.00s - 0.75s)
        // STAGE 2: Black-Hole Growth (0.75s - 1.80s) -> Visibly doubles in size!
        // STAGE 3: Cinematic Collapse (1.80s - 2.65s) -> Compression, flash, shockwave, embers
        // STAGE 4: Settled State (2.65s - 3.45s) -> Returns to resting scale, stable and draggable
        // ══════════════════════════════════════════════════════════════════

        // ── 5-STAGE DETERMINISTIC CINEMATIC DESTRUCTION SEQUENCE (PHASE 3) ──
        // STAGE A: CHARGING (0.00s to 0.80s)
        // - Accretion disk accelerates and brightens
        // - Event horizon expands toward intermediate scale (~0.32)
        // - Gravitational distortion & lensing halo intensify
        if (destructionTimer < 0.80) {
          if (!BlackHoleLifecycle.is('DESTROYING')) {
            BlackHoleLifecycle.setState('DESTROYING', 'STAGE_A_CHARGING');
          } else {
            BlackHoleLifecycle.setSubStage('STAGE_A_CHARGING');
          }
          const tA = destructionTimer / 0.80; // 0.0 -> 1.0

          // Disk rotation and brightness ramp
          const diskSpeedMult = 1.0 + 1.8 * tA;
          if (diskMaterial) {
            diskMaterial.uniforms.uTime.value = elapsed * diskSpeedMult;
            diskMaterial.uniforms.uAccretionSpeed.value = diskSpeedMult;
            diskMaterial.uniforms.uTemperature.value = tA * 0.15;
            diskMaterial.uniforms.uDopplerBoost.value = 0.45 + 0.18 * tA;
          }

          // Horizon growth from resting scale to intermediate scale (~0.38)
          const chargeScale = INITIAL_SCALE + (0.38 - INITIAL_SCALE) * (tA * tA);
          currentScale = chargeScale;
          targetScale = chargeScale;

          pulseScale = 1.0 + 0.04 * Math.sin(destructionTimer * 20.0);
          pulseUniformValue = 1.0 + 1.8 * tA;

          if (haloMaterial) {
            haloMaterial.uniforms.uLensingStrength.value = 1.0 + 0.45 * tA;
            haloMaterial.uniforms.uDopplerBoost.value = 0.45 + 0.15 * tA;
          }

        // ── STAGE B: PEAK (0.80s to 1.60s) ──
        // - Black hole reaches largest intended scale (~0.54, >2.07x resting size!)
        // - Accretion disk incandescent peak; event horizon remains crisp and visually coherent
        // - Luminous core flash; user clearly sees dramatic growth
        } else if (destructionTimer < 1.60) {
          BlackHoleLifecycle.setSubStage('STAGE_B_PEAK');
          const tB = (destructionTimer - 0.80) / 0.80; // 0.0 -> 1.0

          const peakEase = Math.sin(tB * Math.PI * 0.5);
          currentScale = 0.38 + (0.54 - 0.38) * peakEase;
          targetScale = currentScale;

          const diskSpeedMult = 2.8 + 1.2 * tB;
          if (diskMaterial) {
            diskMaterial.uniforms.uTime.value = elapsed * diskSpeedMult;
            diskMaterial.uniforms.uAccretionSpeed.value = diskSpeedMult;
            diskMaterial.uniforms.uTemperature.value = 0.15 + 0.65 * tB;
            diskMaterial.uniforms.uDopplerBoost.value = 0.60 + 0.35 * tB;
          }

          pulseUniformValue = 2.8 + 2.0 * tB * (0.90 + 0.10 * Math.sin(destructionTimer * 30.0));
          pulseScale = 1.0 + 0.05 * Math.sin(tB * Math.PI * 3.0);

          if (haloMaterial) {
            haloMaterial.uniforms.uLensingStrength.value = 1.45 + 0.75 * tB;
            haloMaterial.uniforms.uDopplerBoost.value = 0.60 + 0.35 * tB;
          }

        // ── STAGE C: RELEASE (1.60s to 2.50s) ──
        // - Consumed characters are released outward from black hole origin
        // - Trajectories fan multi-directionally across all 4 quadrants (top, bottom, left, right)
        // - Controlled luminous flash & expanding shockwave pulse
        } else if (destructionTimer < 2.50) {
          BlackHoleLifecycle.setSubStage('STAGE_C_RELEASE');
          const tC = (destructionTimer - 1.60) / 0.90; // 0.0 -> 1.0

          // Fire hero ejection once at exact moment of release (t = 1.60s)
          if (!hasFiredEjection) {
            hasFiredEjection = true;
            if (typeof GravitationalEngine !== 'undefined' && GravitationalEngine.triggerHeroEjection) {
              GravitationalEngine.triggerHeroEjection(currentScreenX, currentScreenY);
            }
            if (onDestructionReleaseCallback) {
              try { onDestructionReleaseCallback(); } catch (e) {}
              onDestructionReleaseCallback = null;
            }
          }

          // Smooth contraction from peak (~0.54) toward intermediate scale (~0.36)
          currentScale = 0.54 - (0.54 - 0.36) * Math.pow(tC, 1.4);
          targetScale = currentScale;

          if (diskMaterial) {
            diskMaterial.uniforms.uTime.value = elapsed * 3.5;
            diskMaterial.uniforms.uAccretionSpeed.value = Math.max(1.4, 3.5 - 1.8 * tC);
            diskMaterial.uniforms.uCompression.value = 1.0 - 0.18 * Math.sin(tC * Math.PI);
            diskMaterial.uniforms.uTemperature.value = Math.max(0.0, 0.80 * (1.0 - tC * 0.9));
          }

          // Controlled luminous flash & expanding shockwave
          const flashAlpha = Math.max(0.0, 0.70 * (1.0 - tC * 1.6));
          if (flashMaterial) {
            flashMaterial.uniforms.uAlpha.value = flashAlpha;
            flashMaterial.uniforms.uTime.value = elapsed;
          }
          const shockRadius = 1.5 + 5.5 * Math.sin(tC * Math.PI * 0.5);
          const shockAlpha = Math.max(0.0, 0.60 * (1.0 - tC));
          if (shockwaveMaterial) {
            shockwaveMaterial.uniforms.uRadius.value = shockRadius;
            shockwaveMaterial.uniforms.uAlpha.value = shockAlpha;
          }

          // Narrow soft relativistic jet
          if (jetGroup && diskMesh) {
            jetGroup.rotation.x = diskMesh.rotation.x - Math.PI * 0.5;
            jetGroup.rotation.y = diskMesh.rotation.y;
            jetGroup.rotation.z = diskMesh.rotation.z;
          }
          const jetAlpha = Math.max(0.0, 0.35 * (1.0 - tC * 1.3));
          if (jetSpineMaterial) {
            jetSpineMaterial.uniforms.uAlpha.value = jetAlpha;
            jetSpineMaterial.uniforms.uProgress.value = Math.min(1.0, tC * 2.0);
          }
          if (jetSheathMaterial) {
            jetSheathMaterial.uniforms.uAlpha.value = jetAlpha * 0.65;
            jetSheathMaterial.uniforms.uProgress.value = Math.min(1.0, tC * 2.0);
          }

          pulseScale = 1.06 - 0.06 * tC;
          pulseUniformValue = Math.max(0.2, 3.0 * (1.0 - tC));

        // ── STAGE D: ORBITAL SETTLING (2.50s to 3.60s) ──
        // - Characters settle into continuous distance-based Keplerian orbits
        // - Inner trajectories faster, outer trajectories slower; layered natural field
        // - Core smoothly contracts toward resting scale
        } else if (destructionTimer < 3.60) {
          BlackHoleLifecycle.setSubStage('STAGE_D_ORBITAL_SETTLING');
          const tD = (destructionTimer - 2.50) / 1.10; // 0.0 -> 1.0

          if (shockwaveMaterial) shockwaveMaterial.uniforms.uAlpha.value = 0.0;
          if (flashMaterial) flashMaterial.uniforms.uAlpha.value = 0.0;
          if (jetSpineMaterial) jetSpineMaterial.uniforms.uAlpha.value = 0.0;
          if (jetSheathMaterial) jetSheathMaterial.uniforms.uAlpha.value = 0.0;

          // Smooth contraction from 0.36 to near resting scale
          currentScale = 0.36 - (0.36 - (INITIAL_SCALE + 0.01)) * (tD * (2.0 - tD));
          targetScale = currentScale;

          if (diskMaterial) {
            const diskSpeedMult = 1.7 - 0.5 * tD;
            diskMaterial.uniforms.uTime.value = elapsed * diskSpeedMult;
            diskMaterial.uniforms.uAccretionSpeed.value = diskSpeedMult;
            diskMaterial.uniforms.uTemperature.value = 0.0;
            diskMaterial.uniforms.uCompression.value = 1.0;
            diskMaterial.uniforms.uDopplerBoost.value = 0.45;
          }
          if (haloMaterial) {
            haloMaterial.uniforms.uLensingStrength.value = 1.0 + 0.20 * (1.0 - tD);
            haloMaterial.uniforms.uDopplerBoost.value = 0.45;
          }
          pulseScale = 1.0;
          pulseUniformValue = 0.2 * (1.0 - tD);

        // ── STAGE E: SETTLE (3.60s to 4.50s) ──
        // - Black hole reaches exact resting scale (0.22)
        // - Accretion disk and singularity stabilize
        // - Characters continue orbiting smoothly; UI is settled, readable, and draggable
        } else if (destructionTimer < 4.50) {
          BlackHoleLifecycle.setSubStage('STAGE_E_SETTLE');
          const tE = (destructionTimer - 3.60) / 0.90; // 0.0 -> 1.0

          currentScale = (INITIAL_SCALE + 0.01) - 0.01 * tE;
          targetScale = getResponsiveInitialScale();

          if (diskMaterial) {
            diskMaterial.uniforms.uAccretionSpeed.value = 1.0;
            diskMaterial.uniforms.uTemperature.value = 0.0;
            diskMaterial.uniforms.uCompression.value = 1.0;
            diskMaterial.uniforms.uDopplerBoost.value = 0.45;
          }
          if (haloMaterial) {
            haloMaterial.uniforms.uLensingStrength.value = 1.0;
            haloMaterial.uniforms.uDopplerBoost.value = 0.45;
          }
          pulseScale = 1.0;
          pulseUniformValue = 0.0;

        // ── SEQUENCE COMPLETE: STABILIZED & RE-INTERACTIVE (4.50s+) ──
        } else {
          destructionTimer = 0.0;
          destructionStartTime = 0;
          currentDestructionGenId = 0;
          onDestructionReleaseCallback = null;
          hasFiredEjection = false;

          if (shockwaveMaterial) shockwaveMaterial.uniforms.uAlpha.value = 0.0;
          if (flashMaterial) flashMaterial.uniforms.uAlpha.value = 0.0;
          if (jetSpineMaterial) jetSpineMaterial.uniforms.uAlpha.value = 0.0;
          if (jetSheathMaterial) jetSheathMaterial.uniforms.uAlpha.value = 0.0;
          if (blastMesh) blastMesh.material.opacity = 0.0;

          if (diskMaterial && diskMaterial.uniforms) {
            diskMaterial.uniforms.uAccretionSpeed.value = 1.0;
            diskMaterial.uniforms.uTemperature.value = 0.0;
            diskMaterial.uniforms.uCompression.value = 1.0;
            diskMaterial.uniforms.uDopplerBoost.value = 0.45;
          }
          if (haloMaterial && haloMaterial.uniforms) {
            haloMaterial.uniforms.uLensingStrength.value = 1.0;
            haloMaterial.uniforms.uDopplerBoost.value = 0.45;
          }
          if (horizonMesh) {
            horizonMesh.visible = true;
            horizonMesh.scale.set(1.0, 1.0, 1.0);
          }

          targetScale = getResponsiveInitialScale();
          currentScale = targetScale;
          pulseScale = 1.0;
          pulseUniformValue = 0.0;

          unlockScroll();

          BlackHoleLifecycle.setState('ORBITAL_GALAXY', 'ACTIVE');

          if (typeof GravitationalEngine !== 'undefined') {
            if (GravitationalEngine.updateTelemetryBadge) {
              GravitationalEngine.updateTelemetryBadge();
            }
          }
        }
        /* LEGACY 7-STAGE DESTRUCTION SEQUENCE REMOVED
        } else if (destructionTimer < 2.50) {
          if (!BlackHoleLifecycle.is('QUASAR_BURST')) {
            BlackHoleLifecycle.setState('QUASAR_BURST', 'ERUPTION');
          } else {
            BlackHoleLifecycle.setSubStage('ERUPTION');
          }
          const tD = (destructionTimer - 1.75) / 0.75; // 0.0 -> 1.0

          pulseScale = 1.08 + 0.18 * Math.sin(tD * Math.PI * 0.5);
          pulseUniformValue = 4.8 + 0.6 * Math.sin(tD * Math.PI * 4.0);

          // Event horizon fractures: shards tumble outward
          if (horizonMesh) horizonMesh.visible = false;
          if (horizonShardsGroup) horizonShardsGroup.visible = true;
          if (crackLinesGroup) crackLinesGroup.visible = true;

          const shardAlpha = tD < 0.60 ? 1.0 : Math.max(0.0, 1.0 - (tD - 0.60) / 0.40);
          for (let k = 0; k < horizonShards.length; k++) {
            const sh = horizonShards[k];
            const outwardDist = sh.speed * tD * tD * 0.58;
            sh.mesh.position.copy(sh.initialPos).addScaledVector(sh.dir, outwardDist);
            sh.mesh.rotation.x += sh.rotVel.x * delta;
            sh.mesh.rotation.y += sh.rotVel.y * delta;
            sh.mesh.rotation.z += sh.rotVel.z * delta;
            if (sh.mesh.material && sh.mesh.material.uniforms) {
              sh.mesh.material.uniforms.uAlpha.value = shardAlpha;
            }
          }

          if (crackMaterial) {
            crackMaterial.uniforms.uTime.value = elapsed;
            crackMaterial.uniforms.uAlpha.value = Math.max(0.0, 1.0 - tD * 0.8);
          }
          if (coronalBeamMaterial && coronalBeamMaterial.uniforms && coronalBeamMaterial.uniforms.uIntroAlpha) {
            coronalBeamMaterial.uniforms.uIntroAlpha.value = Math.max(0.0, 1.0 - tD * 2.0);
          }
          if (crackLinesGroup) {
            const crackSpread = 1.0 + 0.55 * tD;
            crackLinesGroup.scale.set(crackSpread, crackSpread, crackSpread);
          }

          // Relativistic Bipolar Jets fire with rapid axial propagation
          if (jetGroup && diskMesh) {
            jetGroup.rotation.x = diskMesh.rotation.x - Math.PI * 0.5;
            jetGroup.rotation.y = diskMesh.rotation.y;
            jetGroup.rotation.z = diskMesh.rotation.z;
          }

          // Rapid outward propagation (reach full 24 units in 0.35s)
          const jetReach = Math.min(1.0, tD / 0.45);
          const jetAlphaVal = tD < 0.45 ? Math.min(1.0, tD * 3.5) : Math.max(0.25, 1.0 - (tD - 0.45) * 0.85);

          if (jetSpineMaterial) {
            jetSpineMaterial.uniforms.uTime.value = elapsed;
            jetSpineMaterial.uniforms.uProgress.value = jetReach;
            jetSpineMaterial.uniforms.uAlpha.value = jetAlphaVal;
          }
          if (jetSheathMaterial) {
            jetSheathMaterial.uniforms.uTime.value = elapsed;
            jetSheathMaterial.uniforms.uProgress.value = jetReach;
            jetSheathMaterial.uniforms.uAlpha.value = jetAlphaVal * 0.85;
          }

          // At tD >= 0.09 (t = 1.82s): Trigger directional radiation flash and shatter hero items into clones ONCE
          if (tD >= 0.09 && onDestructionReleaseCallback) {
            const cb = onDestructionReleaseCallback;
            onDestructionReleaseCallback = null;
            triggerFullscreenEnergyFlash(currentScreenX, currentScreenY, currentDestructionGenId);
            cb(currentDestructionGenId);
          }

          // Relativistic shockwave ring expands with high-order deceleration
          if (tD >= 0.09) {
            const tShock = (tD - 0.09) / 0.91;
            const shockExp = 12.0 + 26.0 * (1.0 - Math.exp(-tShock * 3.6));
            shockwaveRadius = shockExp;
            shockwaveAlpha = Math.max(0.0, 1.0 - Math.pow(tShock, 1.3));
            if (shockwaveMaterial) {
              shockwaveMaterial.uniforms.uRadius.value = shockwaveRadius;
              shockwaveMaterial.uniforms.uAlpha.value = shockwaveAlpha;
            }
            if (blastMesh && blastPositions && blastVelocities) {
              blastLife = Math.max(0.0, 1.0 - tShock);
              blastMesh.material.opacity = blastLife;
              for (let i = 0; i < BLAST_COUNT; i++) {
                blastPositions[i * 3] += blastVelocities[i * 3] * delta;
                blastPositions[i * 3 + 1] += blastVelocities[i * 3 + 1] * delta;
                blastPositions[i * 3 + 2] += blastVelocities[i * 3 + 2] * delta;
              }
              blastMesh.geometry.attributes.position.needsUpdate = true;
            }
          }

        // ── STAGE E: IRREGULAR MATTER EJECTION (2.50s to 3.20s) ──
        } else if (destructionTimer < 3.20) {
          BlackHoleLifecycle.setSubStage('MATTER_EJECTION');
          const tE = (destructionTimer - 2.50) / 0.70;

          // Jets smoothly dissipate from base outward
          const jetAlphaVal = Math.max(0.0, 0.45 * (1.0 - tE));
          if (jetSpineMaterial) jetSpineMaterial.uniforms.uAlpha.value = jetAlphaVal;
          if (jetSheathMaterial) jetSheathMaterial.uniforms.uAlpha.value = jetAlphaVal * 0.75;

          // Shards fade out
          if (horizonShardsGroup) {
            for (let k = 0; k < horizonShards.length; k++) {
              const sh = horizonShards[k];
              const outwardDist = sh.speed * (0.58 + tE * 0.25);
              sh.mesh.position.copy(sh.initialPos).addScaledVector(sh.dir, outwardDist);
              sh.mesh.rotation.x += sh.rotVel.x * delta;
              sh.mesh.rotation.y += sh.rotVel.y * delta;
              sh.mesh.rotation.z += sh.rotVel.z * delta;
              if (sh.mesh.material && sh.mesh.material.uniforms) {
                sh.mesh.material.uniforms.uAlpha.value = Math.max(0.0, 0.40 * (1.0 - tE));
              }
            }
          }

          if (crackLinesGroup) crackLinesGroup.visible = false;
          if (shockwaveMaterial) shockwaveMaterial.uniforms.uAlpha.value = Math.max(0.0, 0.25 * (1.0 - tE));
          if (blastMesh) blastMesh.material.opacity = Math.max(0.0, 0.30 * (1.0 - tE));

        // ── STAGE F: BLACK-HOLE RECONSTITUTION (3.20s to 4.10s) ──
        } else if (destructionTimer < 4.10) {
          if (!BlackHoleLifecycle.is('RECONSTITUTING')) {
            BlackHoleLifecycle.setState('RECONSTITUTING', 'REFORMATION');
          } else {
            BlackHoleLifecycle.setSubStage('REFORMATION');
          }
          const tF = (destructionTimer - 3.20) / 0.90; // 0.0 -> 1.0
          const qReb = tF * tF * (3.0 - 2.0 * tF); // smoothstep

          // Clean up destruction-only meshes
          if (horizonShardsGroup) horizonShardsGroup.visible = false;
          if (crackLinesGroup) crackLinesGroup.visible = false;
          if (shockwaveMaterial) shockwaveMaterial.uniforms.uAlpha.value = 0.0;
          if (blastMesh) blastMesh.material.opacity = 0.0;
          if (jetSpineMaterial) jetSpineMaterial.uniforms.uAlpha.value = 0.0;
          if (jetSheathMaterial) jetSheathMaterial.uniforms.uAlpha.value = 0.0;

          // Re-emerge black hole structure at EXACT destruction coordinates
          blackHoleRoot.visible = true;
          if (horizonMesh) {
            horizonMesh.visible = true;
            horizonMesh.scale.set(1.0, 1.0, 1.0);
          }

          // Gravitational collapse / reformation: scale emerges from singularity seed (0.05) to targetScale
          currentScale = 0.05 + (targetScale - 0.05) * qReb;
          pulseScale = 1.0 + 0.08 * Math.sin(tF * Math.PI);
          pulseUniformValue = 2.5 * (1.0 - qReb);

          if (diskMaterial && diskMaterial.uniforms) {
            if (diskMaterial.uniforms.uIntroAlpha) diskMaterial.uniforms.uIntroAlpha.value = Math.min(1.0, 0.2 + 0.8 * qReb);
            diskMaterial.uniforms.uAccretionSpeed.value = 1.0 + 3.0 * (1.0 - qReb);
            diskMaterial.uniforms.uTemperature.value = 0.85 * (1.0 - qReb);

            diskMaterial.uniforms.uDopplerBoost.value = 0.45 + 0.40 * (1.0 - qReb);
            diskMaterial.uniforms.uTime.value = elapsed * (1.0 + 1.5 * (1.0 - qReb));
          }
          if (haloMaterial && haloMaterial.uniforms) {
            if (haloMaterial.uniforms.uIntroAlpha) haloMaterial.uniforms.uIntroAlpha.value = Math.min(1.0, 0.2 + 0.8 * qReb);
            if (haloMaterial.uniforms.uLensingStrength) haloMaterial.uniforms.uLensingStrength.value = 1.0 + 1.2 * (1.0 - qReb);
          }
          if (coronalBeamMesh) coronalBeamMesh.visible = true;
          if (coronalBeamMaterial && coronalBeamMaterial.uniforms && coronalBeamMaterial.uniforms.uIntroAlpha) {
            coronalBeamMaterial.uniforms.uIntroAlpha.value = Math.min(1.0, 0.2 + 0.8 * qReb);
          }
          if (photonMesh && photonMesh.material && photonMesh.material.uniforms && photonMesh.material.uniforms.uIntroAlpha) {
            photonMesh.material.uniforms.uIntroAlpha.value = Math.min(1.0, 0.2 + 0.8 * qReb);
          }
          if (infallParticles && infallParticles.material) {
            infallParticles.material.opacity = Math.min(0.85, qReb);
          }

        // ── STAGE G: SETTLE TO ORBITAL_GALAXY (4.10s+) ──
        } else {
          destructionTimer = 0.0;
          destructionStartTime = 0;
          currentDestructionGenId = 0;
          onDestructionReleaseCallback = null;
          hasFiredEjection = false;
          currentScale = targetScale;
          pulseScale = 1.0;
          pulseUniformValue = 0.0;

          if (diskMaterial && diskMaterial.uniforms) {
            if (diskMaterial.uniforms.uIntroAlpha) diskMaterial.uniforms.uIntroAlpha.value = 1.0;
            diskMaterial.uniforms.uAccretionSpeed.value = 1.0;
            diskMaterial.uniforms.uTemperature.value = 0.0;

            diskMaterial.uniforms.uDopplerBoost.value = 0.45;
          }
          if (haloMaterial && haloMaterial.uniforms) {
            if (haloMaterial.uniforms.uIntroAlpha) haloMaterial.uniforms.uIntroAlpha.value = 1.0;
            if (haloMaterial.uniforms.uLensingStrength) haloMaterial.uniforms.uLensingStrength.value = 1.0;
          }
          if (photonMesh && photonMesh.material && photonMesh.material.uniforms && photonMesh.material.uniforms.uIntroAlpha) photonMesh.material.uniforms.uIntroAlpha.value = 1.0;

          unlockScroll();
          BlackHoleLifecycle.setState('ORBITAL_GALAXY', 'ACTIVE'); */

          if (false) { if (false) {
            // MARKER_2531_STEP2

          }
        }
      } else {
        if (shockwaveMaterial && shockwaveMaterial.uniforms.uAlpha.value > 0) {
          shockwaveMaterial.uniforms.uAlpha.value = 0.0;
        }
        if (jetMaterial && jetMaterial.uniforms.uAlpha.value > 0) {
          jetMaterial.uniforms.uAlpha.value = 0.0;
        }
        if (flashMaterial && flashMaterial.uniforms.uAlpha.value > 0) {
          flashMaterial.uniforms.uAlpha.value = 0.0;
        }
      }

      // Time-reversal animation sequence: smooth accretion disk braking and inward particle stream
      if (isTimeReversalActive) {
        const trElapsed = (performance.now() - timeReversalStartTime) / 1000;
        const trProgress = Math.min(1.0, trElapsed / timeReversalDuration);

        if (diskMaterial && diskMaterial.uniforms) {
          if (trProgress < 0.35) {
            const decel = 1.0 - (trProgress / 0.35);
            diskMaterial.uniforms.uAccretionSpeed.value = 0.25 + 0.75 * decel;
          } else {
            const accel = (trProgress - 0.35) / 0.65;
            diskMaterial.uniforms.uAccretionSpeed.value = 0.25 + 0.75 * accel;
          }
        }

        if (trProgress >= 1.0) {
          isTimeReversalActive = false;
          if (diskMaterial && diskMaterial.uniforms) {
            diskMaterial.uniforms.uAccretionSpeed.value = 1.0;
          }
        }
      }

      renderer.render(scene, camera);

      if (!isWebGLActiveFlag) {
        isWebGLActiveFlag = true;
        const bhCont = document.getElementById('blackHoleContainer');
        if (bhCont) bhCont.classList.add('is-webgl-active');
      }

      // Pass visual screen coordinates and current scale to GravitationalEngine
      if (typeof GravitationalEngine !== 'undefined' && GravitationalEngine.update && !GravitationalEngine.hasIndependentLoop) {
        GravitationalEngine.update(currentScreenX, currentScreenY, currentScale);
      }
      } catch (err) {
        console.error('[CRITICAL] SpaceBlackHoleHero3D.animate() error:', err);
      }
    }

    function onElementConsumed(info) {
      if (!BlackHoleLifecycle.isInteracting()) return;
      if (BlackHoleLifecycle.is('IDLE')) BlackHoleLifecycle.setState('CONSUMING');

      // 1. Subtle, restrained pulse (heartbeat impulse)
      pulseScale = 1.035;
      pulseUniformValue = 1.1;

      // 2. Accrete mass to black hole: start small (INITIAL_SCALE = 0.34), grow incrementally based on weight, capping at MAX_SCALE = 0.72
      const deltaMass = (info && typeof info.weight === 'number') ? info.weight * 0.55 : 0.012;
      targetScale = Math.min(MAX_SCALE, targetScale + deltaMass);

      // 3. Mini particle infall burst along angle
      if (infallParticles && particleData && particlePositions) {
        const burstAngle = (info && typeof info.angle === 'number') ? info.angle : Math.random() * Math.PI * 2;
        const count = 14;
        for (let k = 0; k < count; k++) {
          const idx = Math.floor(Math.random() * PARTICLE_COUNT);
          const p = particleData[idx];
          p.radius = HORIZON_RADIUS + 0.3 + Math.random() * 0.4;
          p.angle = burstAngle + (Math.random() - 0.5) * 0.4;
          p.speed = 10.0;
          p.drift = 0.85;
        }
      }
    }

    function resetScale() {
      targetScale = getResponsiveInitialScale();
      currentScale = targetScale;
    }

    function resetBlackHoleVisuals(preserveUserPosition = true) {
      // 1. Reset destruction state & timers
      destructionTimer = 0.0;
      onDestructionReleaseCallback = null;

      // 2. Restore 3D root visibility
      if (blackHoleRoot) blackHoleRoot.visible = true;

      // 3. Reset Event Horizon void & scale
      if (horizonMesh) {
        horizonMesh.visible = true;
        horizonMesh.scale.set(1, 1, 1);
      }

      // 4. Reset 28 Shards
      if (horizonShardsGroup) {
        horizonShardsGroup.visible = false;
        for (let k = 0; k < horizonShards.length; k++) {
          const sh = horizonShards[k];
          sh.mesh.position.copy(sh.initialPos);
          sh.mesh.rotation.copy(sh.initialRot);
          if (sh.mesh.material && sh.mesh.material.uniforms) {
            sh.mesh.material.uniforms.uAlpha.value = 1.0;
          }
        }
      }

      // 5. Reset Crack lines
      if (crackLinesGroup) {
        crackLinesGroup.visible = false;
        crackLinesGroup.scale.set(1, 1, 1);
      }
      if (crackMaterial && crackMaterial.uniforms && crackMaterial.uniforms.uAlpha) {
        crackMaterial.uniforms.uAlpha.value = 0.0;
      }

      // 6. Reset Jets & Flash
      jetProgress = 0.0;
      jetAlpha = 0.0;
      if (jetSpineMaterial && jetSpineMaterial.uniforms) {
        jetSpineMaterial.uniforms.uProgress.value = 0.0;
        jetSpineMaterial.uniforms.uAlpha.value = 0.0;
      }
      if (jetSheathMaterial && jetSheathMaterial.uniforms) {
        jetSheathMaterial.uniforms.uProgress.value = 0.0;
        jetSheathMaterial.uniforms.uAlpha.value = 0.0;
      }
      if (jetMaterial && jetMaterial.uniforms) {
        jetMaterial.uniforms.uProgress.value = 0.0;
        jetMaterial.uniforms.uAlpha.value = 0.0;
      }
      flashAlpha = 0.0;
      if (flashMaterial && flashMaterial.uniforms) {
        flashMaterial.uniforms.uAlpha.value = 0.0;
      }

      // 7. Reset Shockwave & Blast particles
      shockwaveRadius = 18.0;
      shockwaveAlpha = 0.0;
      if (shockwaveMaterial && shockwaveMaterial.uniforms) {
        shockwaveMaterial.uniforms.uRadius.value = 18.0;
        shockwaveMaterial.uniforms.uAlpha.value = 0.0;
      }
      if (blastMesh) {
        blastMesh.material.opacity = 0.0;
      }

      // 8. Reset Accretion Disk & Boundary Halo materials
      if (diskMaterial && diskMaterial.uniforms) {
        if (diskMaterial.uniforms.uPulse) diskMaterial.uniforms.uPulse.value = 1.0;
        if (diskMaterial.uniforms.uIntroAlpha) diskMaterial.uniforms.uIntroAlpha.value = 1.0;
        if (diskMaterial.uniforms.uAccretionSpeed) diskMaterial.uniforms.uAccretionSpeed.value = 1.0;
        if (diskMaterial.uniforms.uTemperature) diskMaterial.uniforms.uTemperature.value = 0.0;
        if (diskMaterial.uniforms.uCompression) diskMaterial.uniforms.uCompression.value = 1.0;
        if (diskMaterial.uniforms.uDopplerBoost) diskMaterial.uniforms.uDopplerBoost.value = 0.45;
      }

      introState = 'SETTLED';
      introTimer = 999.0;
      if (haloMaterial && haloMaterial.uniforms) {
        if (haloMaterial.uniforms.uIntroAlpha) haloMaterial.uniforms.uIntroAlpha.value = 1.0;
        if (haloMaterial.uniforms.uLensingStrength) haloMaterial.uniforms.uLensingStrength.value = 1.0;
        if (haloMaterial.uniforms.uDopplerBoost) haloMaterial.uniforms.uDopplerBoost.value = 0.45;
      }
      if (photonMesh && photonMesh.material && photonMesh.material.uniforms && photonMesh.material.uniforms.uIntroAlpha) {
        photonMesh.material.uniforms.uIntroAlpha.value = 1.0;
      }
      if (coronalBeamMaterial && coronalBeamMaterial.uniforms) {
        if (coronalBeamMaterial.uniforms.uIntroAlpha) coronalBeamMaterial.uniforms.uIntroAlpha.value = 1.0;
        if (coronalBeamMaterial.uniforms.uPulse) coronalBeamMaterial.uniforms.uPulse.value = 1.0;
      }
      if (coronalBeamMesh) {
        coronalBeamMesh.visible = true;
      }

      // 9. Reset Infall Particles
      if (infallParticles && particleData && particlePositions) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = particleData[i];
          p.radius = INNER_DISK_RADIUS + Math.random() * (OUTER_DISK_RADIUS - INNER_DISK_RADIUS);
          p.speed = (2.6 / Math.pow(p.radius, 1.25)) * (0.85 + Math.random() * 0.3);
          p.drift = 0.05;
        }
      }

      // 10. Position & Scale
      targetScale = getResponsiveInitialScale();
      currentScale = targetScale;
      pulseScale = 1.0;
      pulseUniformValue = 1.0;

      if (preserveUserPosition && anchorHeroX > 0 && anchorHeroY > 0) {
        heroRelX = anchorHeroX;
        heroRelY = anchorHeroY;
      } else if (!preserveUserPosition || !hasUserDragged) {
        const defPos = computeDefaultHeroPosition();
        heroRelX = defPos.x;
        heroRelY = defPos.y;
        hasUserDragged = false;
      } else {
        const clamped = clampToHeroBounds(heroRelX, heroRelY);
        heroRelX = clamped.x;
        heroRelY = clamped.y;
      }

      if (blackHoleRoot) {
        blackHoleRoot.visible = true;
      }
      if (horizonMesh) {
        horizonMesh.visible = true;
        horizonMesh.scale.set(1.0, 1.0, 1.0);
      }
      if (horizonShardsGroup) {
        horizonShardsGroup.visible = false;
      }
      if (crackLinesGroup) {
        crackLinesGroup.visible = false;
      }

      isDragging = false;
      hasDragged = false;
      dragVelX = 0;
      dragVelY = 0;
      smoothVelX = 0;
      smoothVelY = 0;

      const heroEl = document.getElementById('hero');
      const heroRect = heroEl ? heroEl.getBoundingClientRect() : { left: 0, top: 0 };
      currentScreenX = heroRect.left + heroRelX;
      currentScreenY = heroRect.top + heroRelY;
      targetScreenX = currentScreenX;
      targetScreenY = currentScreenY;

      // Keep DOM container and draggable hit area aligned frame-synchronously
      const bhContainerEl = document.getElementById('blackHoleContainer');
      if (bhContainerEl) {
        bhContainerEl.style.setProperty('--bh-x', `${Math.round(heroRelX)}px`);
        bhContainerEl.style.setProperty('--bh-y', `${Math.round(heroRelY)}px`);
        const hitSize = Math.max(90, Math.round(150 * (currentScale / 0.26)));
        bhContainerEl.style.setProperty('--bh-hit-size', `${hitSize}px`);
      }

      updateContainerDOM();
      document.body.classList.remove('blackhole-dragging', 'over-blackhole');
    }

    function resetToInitialPosition() {
      resetBlackHoleVisuals(false);
    }

    function triggerDestructionSequence(onRelease, passedGenId) {
      if (BlackHoleLifecycle.isDestroying() || BlackHoleLifecycle.isQuasarBurst() || BlackHoleLifecycle.isReconstituting() || BlackHoleLifecycle.isRebuilding()) return;
      if (destructionTimer > 0.0 && onDestructionReleaseCallback !== null) return;

      // Lock current hero coordinates as the authoritative anchor for destruction and recreation
      anchorHeroX = heroRelX;
      anchorHeroY = heroRelY;

      // Strict scroll lock
      lockScroll();

      if (!BlackHoleLifecycle.is('DESTROYING')) {
        BlackHoleLifecycle.setState('DESTROYING', 'STAGE_1_ACCELERATION');
      }
      currentDestructionGenId = BlackHoleLifecycle.getGenerationId();
      destructionTimer = 0.001;
      destructionStartTime = performance.now();
      onDestructionReleaseCallback = onRelease;
      hasFiredEjection = false;
      peakObservedDestructionScale = 0;

      // Lock dragging immediately
      isDragging = false;
      hasDragged = false;
      document.body.classList.remove('blackhole-dragging', 'over-blackhole');

      // Initial instability impulse
      pulseScale = 1.05;
      pulseUniformValue = 1.6;

      // Setup luminous cosmic ember particles for Collapse
      if (blastMesh && blastPositions && blastVelocities) {
        for (let i = 0; i < BLAST_COUNT; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 3.5 + Math.random() * 4.5;
          const elev = (Math.random() - 0.5) * 1.5;
          blastPositions[i * 3] = Math.cos(ang) * (HORIZON_RADIUS * 0.6);
          blastPositions[i * 3 + 1] = Math.sin(ang) * (HORIZON_RADIUS * 0.6);
          blastPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

          blastVelocities[i * 3] = Math.cos(ang) * spd;
          blastVelocities[i * 3 + 1] = Math.sin(ang) * spd;
          blastVelocities[i * 3 + 2] = elev;
        }
        blastMesh.geometry.attributes.position.needsUpdate = true;
        blastMesh.material.opacity = 0.0;
      }
    }

    function reigniteBlackHole() {
      destructionTimer = 0.0;
      destructionStartTime = 0;
      currentDestructionGenId = 0;
      onDestructionReleaseCallback = null;
      hasFiredEjection = false;
      peakObservedDestructionScale = 0;
      unlockScroll();
      resetBlackHoleVisuals(false); // Return to proper initial resting position & scale
      targetScale = getResponsiveInitialScale();
      currentScale = targetScale;
      pulseUniformValue = 1.0;
      pulseScale = 1.0;
    }

    let isTimeReversalActive = false;
    let timeReversalStartTime = 0;
    let timeReversalDuration = 1.65;

    function triggerTimeReversalSequence(duration) {
      isTimeReversalActive = true;
      timeReversalStartTime = performance.now();
      timeReversalDuration = typeof duration === 'number' ? duration : 1.65;

      // Restrained, subtle time-reversal cues (no giant flash or screen shake):
      pulseScale = 1.05;
      pulseUniformValue = 1.25;

      // Inward particle flow: gently accelerate particles inward toward the event horizon
      if (infallParticles && particleData) {
        for (let i = 0; i < particleData.length; i++) {
          particleData[i].drift = 1.6;
          particleData[i].speed = 10.0;
        }
      }

      resetScale();
    }

    function triggerOrdinaryRestorationPulse(onRelease) {
      if (!BlackHoleLifecycle.isInteracting()) return;
      pulseScale = 1.15;
      pulseUniformValue = 3.2;
      flashAlpha = 0.85;
      if (flashMaterial && flashMaterial.uniforms && flashMaterial.uniforms.uAlpha) {
        flashMaterial.uniforms.uAlpha.value = 0.85;
      }
      jetProgress = 0.85;
      jetAlpha = 0.90;
      if (jetMaterial && jetMaterial.uniforms) {
        jetMaterial.uniforms.uProgress.value = 0.85;
        jetMaterial.uniforms.uAlpha.value = 0.90;
      }

      resetScale();

      if (typeof onRelease === 'function') {
        setTimeout(onRelease, 220);
      }
    }

    function triggerRestorationBurst(onRelease) {
      triggerOrdinaryRestorationPulse(onRelease);
    }

    function triggerIdlePulse() {
      if (!BlackHoleLifecycle.isInteracting()) return;
      pulseScale = 1.08;
      pulseUniformValue = 1.6;
      flashAlpha = 0.50;
      if (flashMaterial && flashMaterial.uniforms && flashMaterial.uniforms.uAlpha) {
        flashMaterial.uniforms.uAlpha.value = 0.50;
      }
      jetProgress = 0.35;
      jetAlpha = 0.45;
      if (jetMaterial && jetMaterial.uniforms) {
        jetMaterial.uniforms.uProgress.value = 0.35;
        jetMaterial.uniforms.uAlpha.value = 0.45;
      }
    }

    function isPointOverBlackHole(clientX, clientY) {
      if (!BlackHoleLifecycle.isInteracting() || !isHeroActive) return false;
      if (typeof clientX !== 'number' || typeof clientY !== 'number') return false;
      const dx = clientX - currentScreenX;
      const dy = clientY - currentScreenY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hitRadius = Math.max(38, 70 * (currentScale / 0.31));
      return dist <= hitRadius;
    }

    return {
      init: init,
      resetDragState: function () { hasUserDragged = false; isDragging = false; hasDragged = false; },
      setHeroRelPos: function (rx, ry) { heroRelX = rx; heroRelY = ry; updateContainerDOM(); },
      onElementConsumed: onElementConsumed,
      resetScale: resetScale,
      resetBlackHoleVisuals: resetBlackHoleVisuals,
      resetDestructionTimers: function () { destructionTimer = 0.0; destructionStartTime = 0; currentDestructionGenId = 0; onDestructionReleaseCallback = null; hasFiredEjection = false; },
      resetToInitialPosition: resetToInitialPosition,
      triggerDestructionSequence: triggerDestructionSequence,
      triggerTimeReversalSequence: triggerTimeReversalSequence,
      triggerOrdinaryRestorationPulse: triggerOrdinaryRestorationPulse,
      triggerRestorationBurst: triggerRestorationBurst,
      reigniteBlackHole: reigniteBlackHole,
      triggerIdlePulse: triggerIdlePulse,
      triggerPreDestructionGatheringPulse: triggerPreDestructionGatheringPulse,
      isReady: () => true,
      isPointOverBlackHole: isPointOverBlackHole,
      hasJustDragged: () => hasDragged,
      isDragging: () => isDragging,
      isDestroying: () => BlackHoleLifecycle.isDestroying(),
      getDestructionProgress: () => destructionTimer,
      isDestroyed: () => BlackHoleLifecycle.isDestroyed(),
      isHeroActive: () => isHeroActive,
      pause: function () {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      },
      resume: function () {
        if (!animId && clock) {
          clock.start();
          animate();
        }
      },
      isSettled: () => (introState === 'SETTLED'),
      pulseAccretionDisk: function (angle) {
        pulseUniformValue = Math.min(1.0, pulseUniformValue + 0.12);
        pulseScale = Math.min(1.08, pulseScale + 0.005);
      },
      showIntroHud: showIntroHud,
      dismissIntroHud: dismissIntroHud,
      getHeroRelativePosition: () => ({ x: heroRelX, y: heroRelY }),
      setHeroRelativePosition: function (relX, relY) {
        const clamped = clampToHeroBounds(relX, relY);
        heroRelX = clamped.x;
        heroRelY = clamped.y;
        hasUserDragged = true;
        updateContainerDOM();
      },
      _getMeshes: () => ({ horizonMesh, photonMesh, diskMesh, haloMesh, infallParticles, scene, camera, renderer, blackHoleRoot }),
      getShaderUniforms: function () {
        return {
          diskSpeed: diskMaterial && diskMaterial.uniforms && diskMaterial.uniforms.uAccretionSpeed ? diskMaterial.uniforms.uAccretionSpeed.value : 1.0,
          diskTemp: diskMaterial && diskMaterial.uniforms && diskMaterial.uniforms.uTemperature ? diskMaterial.uniforms.uTemperature.value : 0.0,
          diskCompression: diskMaterial && diskMaterial.uniforms && diskMaterial.uniforms.uCompression ? diskMaterial.uniforms.uCompression.value : 1.0,
          diskDoppler: diskMaterial && diskMaterial.uniforms && diskMaterial.uniforms.uDopplerBoost ? diskMaterial.uniforms.uDopplerBoost.value : 0.45,
          lensingStrength: haloMaterial && haloMaterial.uniforms && haloMaterial.uniforms.uLensingStrength ? haloMaterial.uniforms.uLensingStrength.value : 1.0,
          jetSpineAlpha: jetSpineMaterial && jetSpineMaterial.uniforms && jetSpineMaterial.uniforms.uAlpha ? jetSpineMaterial.uniforms.uAlpha.value : 0.0,
          jetSheathAlpha: jetSheathMaterial && jetSheathMaterial.uniforms && jetSheathMaterial.uniforms.uAlpha ? jetSheathMaterial.uniforms.uAlpha.value : 0.0,
          jetProgress: jetSpineMaterial && jetSpineMaterial.uniforms && jetSpineMaterial.uniforms.uProgress ? jetSpineMaterial.uniforms.uProgress.value : 0.0
        };
      },
      getBlackHoleState: function () {
        return {
          x: currentScreenX,
          y: currentScreenY,
          heroRelX: heroRelX,
          heroRelY: heroRelY,
          scale: currentScale,
          radius: 95 * currentScale,
          isHeroActive: isHeroActive,
          isSettled: (introState === 'SETTLED'),
          destructionTimer: destructionTimer,
          currentDestructionGenId: currentDestructionGenId,
          peakDestructionScale: peakObservedDestructionScale
        };
      }
    };
  })();

  window.SpaceBlackHoleHero3D = SpaceBlackHoleHero3D;

  // ── 02. FUTURISTIC AR RESEARCH TERMINAL INTERACTION ──
  const ARPortraitInteraction = (function () {
    let terminal, frame;
    let bracketTL, bracketTR, bracketBL, bracketBR;
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;
    let targetDepthX = 0, targetDepthY = 0;
    let currentDepthX = 0, currentDepthY = 0;
    let isHovered = false;

    function init() {
      terminal = document.getElementById('arPortraitTerminal');
      if (!terminal) return;

      frame = document.getElementById('arFrame');
      bracketTL = terminal.querySelector('.corner-tl');
      bracketTR = terminal.querySelector('.corner-tr');
      bracketBL = terminal.querySelector('.corner-bl');
      bracketBR = terminal.querySelector('.corner-br');

      terminal.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      terminal.addEventListener('mousemove', (e) => {
        const rect = terminal.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        // Controlled 3D micro-tilt (max ±7.0 deg)
        targetRotX = -ny * 7.0;
        targetRotY = nx * 7.0;

        // Corner bracket displacement
        targetDepthX = nx * 6.0;
        targetDepthY = ny * 6.0;
      });

      terminal.addEventListener('mouseleave', () => {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        targetDepthX = 0;
        targetDepthY = 0;
      });

      function loop() {
        const factor = isHovered ? 0.09 : 0.05;

        currentRotX += (targetRotX - currentRotX) * factor;
        currentRotY += (targetRotY - currentRotY) * factor;
        currentDepthX += (targetDepthX - currentDepthX) * factor;
        currentDepthY += (targetDepthY - currentDepthY) * factor;

        if (frame) {
          if (typeof PortraitDisintegrationEngine !== 'undefined' && PortraitDisintegrationEngine.isControllingFrame && PortraitDisintegrationEngine.isControllingFrame()) {
            // Handled exclusively by PortraitDisintegrationEngine during gravitational interaction
          } else {
            frame.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
          }
        }

        if (bracketTL) {
          bracketTL.style.transform = `translate3d(${(-currentDepthX - (isHovered ? 3 : 0)).toFixed(1)}px, ${(-currentDepthY - (isHovered ? 3 : 0)).toFixed(1)}px, 15px)`;
        }
        if (bracketTR) {
          bracketTR.style.transform = `translate3d(${(currentDepthX + (isHovered ? 3 : 0)).toFixed(1)}px, ${(-currentDepthY - (isHovered ? 3 : 0)).toFixed(1)}px, 15px)`;
        }
        if (bracketBL) {
          bracketBL.style.transform = `translate3d(${(-currentDepthX - (isHovered ? 3 : 0)).toFixed(1)}px, ${(currentDepthY + (isHovered ? 3 : 0)).toFixed(1)}px, 15px)`;
        }
        if (bracketBR) {
          bracketBR.style.transform = `translate3d(${(currentDepthX + (isHovered ? 3 : 0)).toFixed(1)}px, ${(currentDepthY + (isHovered ? 3 : 0)).toFixed(1)}px, 15px)`;
        }

        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    }

    return { init: init };
  })();

  // ── 02B. CINEMATIC PORTRAIT PARTICLE DISINTEGRATION ENGINE ──
  // Simulates 5-stage relativistic consumption and cosmic ejection for authentic portrait:
  // Stage A: Gravitational Distortion (edges curve inward, perspective lens distortion)
  // Stage B: Swirling Image (spiral twist toward singularity, spaghettification shear)
  // Stage C: Particle Disintegration Illusion (~768 sampled authentic RGB photographic fragments)
  // Stage D: Relativistic Orbital Fragments (1-2 complete revolutions, differential Keplerian shear)
  // Stage E: Event Horizon Consumption (inward plunge into pitch-black singularity)
  // Restoration: Quasar ejection burst, apex hover & high-order reassembly back into authentic photo
  const PortraitDisintegrationEngine = (function () {
    let canvas, ctx;
    let terminalEl, frameEl, photoEl;
    let particles = [];
    let isImageSampled = false;
    let isInitialized = false;

    // State Machine: 'DORMANT' | 'DISTORTING' | 'SWIRLING' | 'DISINTEGRATING' | 'ORBITING' | 'CONSUMED' | 'EJECTING'
    let state = 'DORMANT';
    let distortionP = 0.0;
    let swirlP = 0.0;
    
    // Ejection / Restoration animation state
    let ejectTimer = 0.0;
    let rebirthTimer = 0.0;
    let ordinaryTimer = 0.0;
    const EJECT_DURATION = 1.35;
    let burstOrigin = { x: 0, y: 0 };

    let width = 0, height = 0;
    let dpr = 1;

    // Grid sampling dimensions: 24 columns x 32 rows = 768 authentic photographic points
    const COLS = 24;
    const ROWS = 32;

    function init() {
      canvas = document.getElementById('portraitFragmentCanvas');
      terminalEl = document.getElementById('arPortraitTerminal');
      frameEl = document.getElementById('arFrame');
      photoEl = frameEl ? frameEl.querySelector('.ar-photo') : null;

      if (!canvas || !frameEl || !photoEl) return;
      ctx = canvas.getContext('2d');

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      samplePhotograph();
      isInitialized = true;
    }

    function resizeCanvas() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }

    function samplePhotograph() {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = photoEl.currentSrc || photoEl.src || 'assets/parth.jpg';

      const doSample = () => {
        try {
          const offCanvas = document.createElement('canvas');
          offCanvas.width = COLS;
          offCanvas.height = ROWS;
          const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
          offCtx.drawImage(img, 0, 0, COLS, ROWS);
          const imgData = offCtx.getImageData(0, 0, COLS, ROWS).data;

          particles = [];
          for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
              const idx = (row * COLS + col) * 4;
              const r = imgData[idx];
              const g = imgData[idx + 1];
              const b = imgData[idx + 2];
              const a = (imgData[idx + 3] / 255.0);

              const u = (col + 0.5) / COLS;
              const v = (row + 0.5) / ROWS;
              const pIndex = row * COLS + col;

              const cu = u - 0.5;
              const cv = v - 0.5;
              const edgeDist = Math.sqrt(cu * cu + cv * cv) * 1.414;

              particles.push({
                index: pIndex,
                col: col,
                row: row,
                u: u,
                v: v,
                edgeDist: edgeDist,
                r: r,
                g: g,
                b: b,
                baseAlpha: a > 0.1 ? a : 1.0,
                color: `rgb(${r},${g},${b})`,

                screenX: 0,
                screenY: 0,
                targetX: 0,
                targetY: 0,
                vx: 0,
                vy: 0,

                orbitRadius: 0,
                orbitRadiusFactor: 0.90 + ((pIndex * 0.17) % 0.42),
                orbitAngle: 0,
                angleSwept: 0,
                targetRevolutions: 1.35 + ((pIndex * 0.19) % 0.55), // 1.35 to 1.90 full revolutions
                orbitSpeed: 3.2 + ((pIndex * 0.08) % 1.5),
                orbitSense: 1,

                ejectAngle: 0,
                ejectDist: 0,
                ejectApexX: 0,
                ejectApexY: 0,

                alpha: 0.0,
                size: 2.8 + ((pIndex % 3) * 0.5),
                active: false,
                consumed: false
              });
            }
          }
          isImageSampled = true;
        } catch (e) {
          console.warn('[PortraitDisintegrationEngine] Sampling fallback', e);
          createFallbackParticles();
        }
      };

      if (img.complete && img.naturalWidth > 0) {
        doSample();
      } else {
        img.onload = doSample;
        img.onerror = createFallbackParticles;
      }
    }

    function createFallbackParticles() {
      particles = [];
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const u = (col + 0.5) / COLS;
          const v = (row + 0.5) / ROWS;
          const pIndex = row * COLS + col;
          const r = Math.round(180 + 50 * (1 - v));
          const g = Math.round(150 + 40 * (1 - v));
          const b = Math.round(130 + 30 * (1 - v));
          particles.push({
            index: pIndex,
            col: col,
            row: row,
            u: u,
            v: v,
            edgeDist: Math.hypot(u - 0.5, v - 0.5) * 1.414,
            r: r, g: g, b: b,
            baseAlpha: 1.0,
            color: `rgb(${r},${g},${b})`,
            screenX: 0, screenY: 0, targetX: 0, targetY: 0, vx: 0, vy: 0,
            orbitRadius: 0,
            orbitRadiusFactor: 0.90 + ((pIndex * 0.17) % 0.42),
            orbitAngle: 0,
            angleSwept: 0,
            targetRevolutions: 1.35 + ((pIndex * 0.19) % 0.55),
            orbitSpeed: 3.2 + ((pIndex * 0.08) % 1.5),
            orbitSense: 1,
            ejectAngle: 0, ejectDist: 0, ejectApexX: 0, ejectApexY: 0,
            alpha: 0.0,
            size: 3.0,
            active: false,
            consumed: false
          });
        }
      }
      isImageSampled = true;
    }

    function isControllingFrame() {
      return state !== 'DORMANT';
    }

    function needsRestoration() {
      return state === 'CONSUMED' || state === 'ORBITING' || state === 'DISINTEGRATING' || state === 'EJECTING';
    }

    function getFrameViewportRect() {
      if (!frameEl) return null;
      const vp = frameEl.querySelector('.ar-photo-viewport') || frameEl;
      return vp.getBoundingClientRect();
    }

    function smoothstep(min, max, value) {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    }

    function startDisintegration(bhX, bhY, bhScale, vpRect) {
      if (!isImageSampled || particles.length === 0) return;
      state = 'DISINTEGRATING';

      if (frameEl) {
        frameEl.style.transition = 'opacity 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)';
        frameEl.style.opacity = '0';
        frameEl.style.pointerEvents = 'none';
        frameEl.classList.add('grav-distorting');
      }

      const effDiskRadius = 88.0 * (bhScale / 0.34);
      const kMinor = 0.40;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.screenX = vpRect.left + p.u * vpRect.width;
        p.screenY = vpRect.top + p.v * vpRect.height;
        p.targetX = p.screenX;
        p.targetY = p.screenY;
        p.alpha = p.baseAlpha;
        p.active = true;
        p.consumed = false;
        p.angleSwept = 0;
        p.orbitRadius = effDiskRadius * p.orbitRadiusFactor;

        const relX = p.screenX - bhX;
        const relY = (p.screenY - bhY) / kMinor;
        p.orbitAngle = Math.atan2(relY, relX);

        const peelSpeed = 42.0 + (p.edgeDist * 60.0);
        const toBhDist = Math.hypot(p.screenX - bhX, p.screenY - bhY);
        p.vx = toBhDist > 0 ? ((bhX - p.screenX) / toBhDist) * peelSpeed : 0;
        p.vy = toBhDist > 0 ? ((bhY - p.screenY) / toBhDist) * peelSpeed : 0;
      }
    }

    function update(bhX, bhY, bhScale, dt) {
      if (!isInitialized) return;
      dt = Math.min(dt || 0.016, 0.045);

      const vpRect = getFrameViewportRect();
      if (!vpRect) return;

      const ptX = vpRect.left + vpRect.width * 0.5;
      const ptY = vpRect.top + vpRect.height * 0.5;
      const dx = bhX - ptX;
      const dy = bhY - ptY;
      const dist = Math.hypot(dx, dy);

      const dirX = dist > 0.001 ? dx / dist : 0;
      const dirY = dist > 0.001 ? dy / dist : 0;

      const DIST_INFLUENCE = 440.0 * (bhScale / 0.34);
      const DIST_SWIRL = 250.0 * (bhScale / 0.34);
      const DIST_DISINTEGRATE = 158.0 * (bhScale / 0.34);

      if (state === 'DORMANT') {
        if (dist < DIST_INFLUENCE) {
          state = 'DISTORTING';
        }
      }

      if (state === 'DISTORTING' || state === 'SWIRLING') {
        if (dist < DIST_DISINTEGRATE) {
          // Breach threshold: initiate Stage C Particle Disintegration into dots!
          startDisintegration(bhX, bhY, bhScale, vpRect);
        } else if (dist < DIST_INFLUENCE) {
          const pA = smoothstep(DIST_INFLUENCE, DIST_SWIRL, dist);
          const pB = dist < DIST_SWIRL ? smoothstep(DIST_SWIRL, DIST_DISINTEGRATE, dist) : 0.0;
          state = pB > 0.05 ? 'SWIRLING' : 'DISTORTING';

          distortionP += (pA - distortionP) * (1.0 - Math.exp(-12.0 * dt));
          swirlP += (pB - swirlP) * (1.0 - Math.exp(-12.0 * dt));

          // Natural, subtle gravitational tension without weird 3D block warping
          const jx = (Math.sin(Date.now() * 0.04) * distortionP * 2.5).toFixed(1);
          const jy = (Math.cos(Date.now() * 0.045) * distortionP * 2.5).toFixed(1);
          const fadeAlpha = Math.max(0.12, 1.0 - distortionP * 0.5 - swirlP * 0.45);

          if (frameEl) {
            frameEl.style.transform = `translate3d(${jx}px, ${jy}px, 0)`;
            frameEl.style.opacity = fadeAlpha.toFixed(2);
            frameEl.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.6), 0 0 15px rgba(245, 158, 11, ${(0.2 * distortionP).toFixed(2)})`;
            frameEl.classList.remove('grav-distorting');
          }
        } else {
          // Black hole drifted away: decay smoothly back to resting state
          distortionP += (0.0 - distortionP) * (1.0 - Math.exp(-9.0 * dt));
          swirlP += (0.0 - swirlP) * (1.0 - Math.exp(-9.0 * dt));

          if (distortionP < 0.01 && swirlP < 0.01) {
            distortionP = 0.0;
            swirlP = 0.0;
            state = 'DORMANT';
            if (frameEl) {
              frameEl.style.transform = '';
              frameEl.style.opacity = '1';
              frameEl.style.boxShadow = '';
              frameEl.classList.remove('grav-distorting');
            }
          }
        }
      }

      // Stage D & Stage E: Particle Orbital Infall & Consumption
      if (state === 'DISINTEGRATING' || state === 'ORBITING') {
        ctx.clearRect(0, 0, width, height);

        const effHorizon = 32.0 * (bhScale / 0.34);
        const effDiskRadius = 88.0 * (bhScale / 0.34);
        const kMinor = 0.40;
        let activeCount = 0;
        let lastAngle = 0;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!p.active || p.consumed) continue;

          activeCount++;

          // Keplerian differential shear speed: inner particles orbit faster
          const currentR = Math.max(effHorizon, p.orbitRadius);
          const rRatio = currentR / effDiskRadius;
          const dTheta = (p.orbitSpeed / Math.sqrt(Math.max(0.35, rRatio))) * dt;

          p.orbitAngle += dTheta * p.orbitSense;
          p.angleSwept += Math.abs(dTheta);
          lastAngle = p.orbitAngle;

          // Stage D: Revolve around accretion disk for 1–2 complete revolutions (360°–720°)
          const reqRadians = p.targetRevolutions * Math.PI * 2.0;

          if (p.angleSwept < reqRadians) {
            // Orbiting along the illuminated accretion disk
            const targetX = bhX + Math.cos(p.orbitAngle) * p.orbitRadius;
            const targetY = bhY + Math.sin(p.orbitAngle) * p.orbitRadius * kMinor;

            const blend = 1.0 - Math.exp(-9.0 * dt);
            p.screenX += (targetX - p.screenX) * blend;
            p.screenY += (targetY - p.screenY) * blend;

            // Maintain stable accretion disk orbit radius
            p.orbitRadius += (effDiskRadius * p.orbitRadiusFactor - p.orbitRadius) * (1.0 - Math.exp(-3.0 * dt));
          } else {
            // Stage E: Consumption! Spiral inward through photon sphere into pitch-black singularity
            p.orbitRadius -= (140.0 * (bhScale / 0.34)) * dt;
            const targetX = bhX + Math.cos(p.orbitAngle) * p.orbitRadius;
            const targetY = bhY + Math.sin(p.orbitAngle) * p.orbitRadius * kMinor;

            p.screenX = targetX;
            p.screenY = targetY;

            // Plunge through event horizon: rapid collapse & fade
            if (p.orbitRadius <= effHorizon * 1.15) {
              p.alpha -= 5.5 * dt;
              p.size = Math.max(0.4, p.size - 4.2 * dt);
              if (p.alpha <= 0.01) {
                p.alpha = 0.0;
                p.active = false;
                p.consumed = true;
              }
            }
          }

          // Render fragment particle with depth ordering & authentic sampled RGB
          if (p.alpha > 0.005) {
            const zDepth = Math.sin(p.orbitAngle);
            const depthAlpha = zDepth > 0 ? p.alpha : p.alpha * 0.72;
            const depthSize = zDepth > 0 ? p.size * 1.15 : p.size * 0.88;

            ctx.save();
            ctx.globalAlpha = depthAlpha;
            ctx.fillStyle = p.color;

            ctx.beginPath();
            ctx.arc(p.screenX, p.screenY, depthSize * 0.5, 0, Math.PI * 2);
            ctx.fill();

            // Near-side subtle specular glint
            if (zDepth > 0.35) {
              ctx.fillStyle = 'rgba(255, 245, 220, 0.35)';
              ctx.beginPath();
              ctx.arc(p.screenX - 0.4, p.screenY - 0.4, depthSize * 0.22, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.restore();
          }
        }

        if (activeCount === 0 && particles.length > 0) {
          state = 'CONSUMED';
          if (!terminalEl) terminalEl = document.getElementById('arPortraitTerminal');
          if (terminalEl) {
            terminalEl.style.opacity = '0';
            terminalEl.style.visibility = 'hidden';
            terminalEl.style.pointerEvents = 'none';
          }
          if (typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.onElementConsumed) {
            SpaceBlackHoleHero3D.onElementConsumed({
              weight: 0.10, // Photographic portrait mass accretion
              angle: lastAngle
            });
          }
        }
      }

      // Cosmic Ejection & Scattered Fragment Dynamics
      if (state === 'EJECTING') {
        ejectTimer += dt;
        const u = Math.min(1.0, ejectTimer / EJECT_DURATION);

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const ease1 = 1.0 - Math.pow(1.0 - u, 2.8);
          const arcOffset = Math.sin(u * Math.PI) * (((i % 2 === 0 ? 1 : -1)) * (20 + (i % 30)));
          const perpAngle = p.ejectAngle + Math.PI * 0.5;

          p.screenX = burstOrigin.x + (p.ejectApexX - burstOrigin.x) * ease1 + Math.cos(perpAngle) * arcOffset;
          p.screenY = burstOrigin.y + (p.ejectApexY - burstOrigin.y) * ease1 + Math.sin(perpAngle) * arcOffset;
          p.alpha = Math.min(1.0, u * 2.5) * p.baseAlpha;
          p.size = 3.6;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (u >= 1.0) {
          state = 'ORBITAL_GALAXY';
        }
      }

      if (state === 'ORBITAL_GALAXY' || state === 'SCATTERED') {
        ctx.clearRect(0, 0, width, height);
        const kMinor = 0.40;
        const effDiskRadius = 110.0 * (bhScale / 0.34);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!p.active) continue;

          // Keplerian orbital rotation for photo particles
          p.orbitRadius = p.orbitRadius || (effDiskRadius * (0.85 + ((i * 0.17) % 0.85)));
          const dTheta = (1.5 / Math.sqrt(Math.max(0.4, p.orbitRadius / 100))) * dt;
          p.orbitAngle = (p.orbitAngle !== undefined ? p.orbitAngle : (i * 0.1)) + dTheta;

          const targetX = bhX + Math.cos(p.orbitAngle) * p.orbitRadius;
          const targetY = bhY + Math.sin(p.orbitAngle) * p.orbitRadius * kMinor;

          p.screenX += (targetX - p.screenX) * (1.0 - Math.exp(-6.0 * dt));
          p.screenY += (targetY - p.screenY) * (1.0 - Math.exp(-6.0 * dt));

          // Depth rendering
          const zDepth = Math.sin(p.orbitAngle);
          const depthAlpha = (zDepth > 0 ? 0.95 : 0.65) * p.baseAlpha;
          const depthSize = zDepth > 0 ? 3.0 : 2.2;

          ctx.save();
          ctx.globalAlpha = depthAlpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, depthSize * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Rebirth: Controlled Photographic Reassembly
      if (state === 'REBIRTHING') {
        rebirthTimer += dt;
        const u = Math.min(1.0, rebirthTimer / 0.95);
        const ease = u < 0.5 ? 4.0 * u * u * u : 1.0 - Math.pow(-2.0 * u + 2.0, 3.0) / 2.0;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (vpRect) {
            p.targetX = vpRect.left + p.u * vpRect.width;
            p.targetY = vpRect.top + p.v * vpRect.height;
          }

          p.screenX = p.ejectApexX + (p.targetX - p.ejectApexX) * ease;
          p.screenY = p.ejectApexY + (p.targetY - p.ejectApexY) * ease;

          ctx.save();
          ctx.globalAlpha = p.baseAlpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, 2.8 * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (u >= 1.0) {
          ctx.clearRect(0, 0, width, height);
          state = 'DORMANT';
          distortionP = 0.0;
          swirlP = 0.0;
          if (frameEl) {
            frameEl.style.transition = 'opacity 0.4s ease-out';
            frameEl.style.opacity = '1';
            frameEl.style.transform = '';
            frameEl.style.boxShadow = '';
            frameEl.style.pointerEvents = '';
            frameEl.classList.remove('grav-distorting');
          }
          if (photoEl) {
            photoEl.style.transform = '';
            photoEl.style.filter = '';
            photoEl.classList.remove('grav-distorting');
          }
        }
      }

      // Ordinary Restoration: Rapid outward burst to apex then smooth docking into photograph frame
      if (state === 'ORDINARY_RESTORING') {
        ordinaryTimer += dt;
        const totalDuration = 1.15;
        const u = Math.min(1.0, ordinaryTimer / totalDuration);

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (vpRect) {
            p.targetX = vpRect.left + p.u * vpRect.width;
            p.targetY = vpRect.top + p.v * vpRect.height;
          }

          if (u < 0.38) {
            const t1 = u / 0.38;
            const q1 = 1.0 - Math.pow(1.0 - t1, 2.8);
            p.screenX = burstOrigin.x + (p.ejectApexX - burstOrigin.x) * q1;
            p.screenY = burstOrigin.y + (p.ejectApexY - burstOrigin.y) * q1;
          } else {
            const t2 = (u - 0.38) / 0.62;
            const q2 = 1.0 - Math.pow(1.0 - t2, 3.2);
            p.screenX = p.ejectApexX + (p.targetX - p.ejectApexX) * q2;
            p.screenY = p.ejectApexY + (p.targetY - p.ejectApexY) * q2;
          }

          ctx.save();
          ctx.globalAlpha = p.baseAlpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, 2.8 * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (u >= 1.0) {
          ctx.clearRect(0, 0, width, height);
          state = 'DORMANT';
          distortionP = 0.0;
          swirlP = 0.0;
          if (frameEl) {
            frameEl.style.transition = 'opacity 0.4s ease-out';
            frameEl.style.opacity = '1';
            frameEl.style.transform = '';
            frameEl.style.boxShadow = '';
            frameEl.style.pointerEvents = '';
            frameEl.classList.remove('grav-distorting');
          }
          if (photoEl) {
            photoEl.style.transform = '';
            photoEl.style.filter = '';
            photoEl.classList.remove('grav-distorting');
          }
        }
      }
    }

    function triggerDestructionEjection(originX, originY) {
      if (!isImageSampled || particles.length === 0) {
        samplePhotograph();
      }
      burstOrigin.x = originX;
      burstOrigin.y = originY;
      state = 'EJECTING';
      ejectTimer = 0.0;

      if (frameEl) {
        frameEl.style.transition = 'opacity 0.25s ease-out';
        frameEl.style.opacity = '0';
        frameEl.style.pointerEvents = 'none';
        frameEl.classList.add('grav-distorting');
      }

      const vpRect = getFrameViewportRect();
      if (!vpRect) return;

      const GOLDEN_ANGLE = 2.39996322972865332;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.active = true;
        p.consumed = false;
        p.alpha = p.baseAlpha;
        p.size = 3.2;

        p.screenX = originX;
        p.screenY = originY;
        p.targetX = vpRect.left + p.u * vpRect.width;
        p.targetY = vpRect.top + p.v * vpRect.height;

        p.ejectAngle = (i * GOLDEN_ANGLE) + (((i * 0.37) % 0.5) - 0.25);
        p.ejectDist = 160.0 + ((i * 29) % 260.0);
        p.ejectApexX = originX + Math.cos(p.ejectAngle) * p.ejectDist;
        p.ejectApexY = originY + Math.sin(p.ejectAngle) * p.ejectDist;
      }
    }

    function triggerOrdinaryRestoration(originX, originY) {
      if (state === 'DORMANT') return;

      burstOrigin.x = originX;
      burstOrigin.y = originY;
      state = 'ORDINARY_RESTORING';
      ordinaryTimer = 0.0;

      const vpRect = getFrameViewportRect();
      if (!vpRect) return;

      const GOLDEN_ANGLE = 2.39996322972865332;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.active = true;
        p.consumed = false;
        p.alpha = p.baseAlpha;
        p.size = 3.2;

        p.screenX = originX;
        p.screenY = originY;
        p.targetX = vpRect.left + p.u * vpRect.width;
        p.targetY = vpRect.top + p.v * vpRect.height;

        p.ejectAngle = (i * GOLDEN_ANGLE) + (((i * 0.37) % 0.5) - 0.25);
        p.ejectDist = 120.0 + ((i * 23) % 180.0);
        p.ejectApexX = originX + Math.cos(p.ejectAngle) * p.ejectDist;
        p.ejectApexY = originY + Math.sin(p.ejectAngle) * p.ejectDist;
      }
    }

    function triggerRestorationBurst(originX, originY) {
      triggerOrdinaryRestoration(originX, originY);
    }

    function reigniteAndRestore() {
      if (state === 'DORMANT') {
        if (frameEl) {
          frameEl.style.opacity = '1';
          frameEl.style.transform = '';
          frameEl.style.boxShadow = '';
          frameEl.style.pointerEvents = '';
          frameEl.classList.remove('grav-distorting');
        }
        if (photoEl) {
          photoEl.style.transform = '';
          photoEl.style.filter = '';
          photoEl.classList.remove('grav-distorting');
        }
        return;
      }
      state = 'REBIRTHING';
      rebirthTimer = 0.0;
    }

    function instantRestore() {
      state = 'DORMANT';
      distortionP = 0.0;
      swirlP = 0.0;
      if (ctx && canvas) ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].active = false;
        particles[i].consumed = false;
      }
      if (!frameEl) frameEl = document.getElementById('arFrame');
      if (frameEl) {
        frameEl.style.transition = 'none';
        frameEl.style.opacity = '1';
        frameEl.style.transform = '';
        frameEl.style.boxShadow = '';
        frameEl.style.pointerEvents = '';
        frameEl.classList.remove('grav-distorting');
      }
      if (photoEl) {
        photoEl.style.transform = '';
        photoEl.style.filter = '';
        photoEl.classList.remove('grav-distorting');
      }
    }

    return {
      init: init,
      update: update,
      hasActiveTargets: () => targets.some(t => t.state === 'CONSUMING' || t.state === 'ORBITING' || (t.overlapRatio && t.overlapRatio > 0)),
      getBoxTargets: () => targets.filter(t => t.isBox),
      getTargets: () => targets,
      applyBoxOverlapRatio: function (targetEl, ratio) {
        if (!targetEl) return;
        targetEl.style.opacity = Math.max(0, 1.0 - ratio).toFixed(2);
      },
      isControllingFrame: isControllingFrame,
      needsRestoration: needsRestoration,
      triggerDestructionEjection: triggerDestructionEjection,
      triggerOrdinaryRestoration: triggerOrdinaryRestoration,
      triggerRestorationBurst: triggerRestorationBurst,
      reigniteAndRestore: reigniteAndRestore,
      instantRestore: instantRestore
    };
  })();

  // ── 02C. UNIVERSAL GRAVITATIONAL CONSUMPTION ENGINE ──
  // Simulates physical gravitational attraction, relativistic orbital deflection,
  // spaghettification, event horizon consumption, dynamic black-hole growth,
  // and reversible state restoration across all eligible portfolio components.


  const GravitationalEngine = (function () {
    let targets = [];
    let isInitialized = false;
    let needsRectRefresh = true;
    let lastTime = 0;
    let nextTargetId = 1;

    // Consumed elements registry & batch tracking (Authoritative state governed by BlackHoleLifecycle)
    let consumedRegistry = [];
    let ejectingBatch = [];
    let rebirthingBatch = [];
    let restoringBatch = [];
    let orbitalGalaxyBatch = [];
    let activeMatterDots = [];

    // Visual extraction helper: Extracts tech glyphs and brand accent colors for disintegration & quantum shard ejection
    function getBoxVisualData(el) {
      if (!el) return { glyph: null, title: '', accentColor: '#f59e0b', isSvg: false };
      const isSvg = (el instanceof SVGElement) || (el.tagName && el.tagName.toLowerCase() === 'svg');
      const glyphEl = el.querySelector ? el.querySelector('.badge-glyph, .role-chevron, .btn-scan-reticle') : null;
      const glyph = glyphEl ? glyphEl.textContent.trim() : null;
      const titleEl = el.querySelector ? el.querySelector('.badge-title, span') : null;
      const title = titleEl ? titleEl.textContent.trim() : '';

      let accentColor = '#f59e0b';
      if (glyph === '🍃') accentColor = '#10b981';
      else if (glyph === '☕') accentColor = '#f59e0b';
      else if (glyph === '⚡') accentColor = '#38bdf8';
      else if (glyph === '🧠') accentColor = '#a855f7';
      else if (glyph === '🕸️') accentColor = '#ec4899';
      else if (glyph === '🐳') accentColor = '#0ea5e9';
      else if (el.id === 'arFrame' || (el.closest && el.closest('#arPortraitTerminal'))) accentColor = '#fbbf24';
      else if (el.classList && el.classList.contains('atelier-btn')) accentColor = '#38bdf8';
      else if (isSvg || (el.classList && el.classList.contains('orbital-tracks-svg'))) accentColor = '#f59e0b';

      return { glyph, title, accentColor, isSvg };
    }

    // Spawns streaming matter dots peeling off from disintegrating cards and elements
    function spawnBoxMatterDots(item, r, bhX, bhY, progress, layerFront) {
      if (!layerFront || activeMatterDots.length >= 80) return;
      const vData = getBoxVisualData(item.element);
      const dotsToSpawn = Math.random() < 0.65 ? 2 : 1;
      for (let d = 0; d < dotsToSpawn; d++) {
        const dotEl = document.createElement('div');
        dotEl.className = 'gravity-matter-dot';
        const size = Math.random() < 0.3 ? 5 : (Math.random() < 0.6 ? 4 : 3);
        dotEl.style.width = size + 'px';
        dotEl.style.height = size + 'px';
        dotEl.style.background = vData.accentColor;
        dotEl.style.boxShadow = `0 0 ${size * 2}px ${vData.accentColor}`;
        dotEl.style.position = 'fixed';
        dotEl.style.pointerEvents = 'none';
        dotEl.style.zIndex = '58';
        dotEl.style.willChange = 'transform, opacity';

        const spawnX = r.left + Math.random() * r.width;
        const spawnY = r.top + Math.random() * r.height;

        layerFront.appendChild(dotEl);
        activeMatterDots.push({
          el: dotEl,
          x: spawnX,
          y: spawnY,
          vx: (Math.random() - 0.5) * 24,
          vy: (Math.random() - 0.5) * 24,
          birth: performance.now(),
          life: 420 + Math.random() * 320,
          color: vData.accentColor
        });
      }
    }

    // PHASE 2: Destruction Release & Continuous Gravitational Orbital Field
    // Releases the actual characters consumed by the black hole, fanning them multi-directionally
    // across all hero quadrants and transitioning them into stable, distance-based Keplerian orbits.
    function triggerHeroEjection(originX, originY) {
      const heroEl = document.getElementById('hero');
      const heroRect = heroEl ? heroEl.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight };
      const navEl = document.getElementById('atelier-header') || document.querySelector('.atelier-nav');
      const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 70;

      const layerFront = document.getElementById('gravityAnimationLayerFront');
      const layerBack = document.getElementById('gravityAnimationLayerBack');
      if (!layerFront || !layerBack) return;

      // Clean existing debris / character clones
      ejectingBatch.forEach(p => { if (p.el) p.el.remove(); });
      ejectingBatch = [];

      // Deduplicate consumed items so every consumed element is accounted for exactly once
      const uniqueEntries = [];
      const seenIds = new Set();
      consumedRegistry.forEach(entry => {
        const id = entry.id || (entry.targetItem ? entry.targetItem.id : null);
        if (id && !seenIds.has(id)) {
          seenIds.add(id);
          uniqueEntries.push(entry);
        } else if (!id) {
          uniqueEntries.push(entry);
        }
      });

      // Filter out child box elements whose parent box container is already in the ejection batch
      const topLevelEntries = uniqueEntries.filter(entry => {
        if (!entry.isBox && entry.type !== 'box') return true; // Consumed characters/words are always preserved
        const el = entry.targetItem ? entry.targetItem.element : null;
        if (!el) return true;
        return !uniqueEntries.some(other => {
          if (other === entry || (!other.isBox && other.type !== 'box')) return false;
          const otherEl = other.targetItem ? other.targetItem.element : null;
          return otherEl && otherEl !== el && otherEl.contains(el);
        });
      });

      // Front-page / hero boundary constraints (strictly protect navbar and prevent spill into lower sections)
      const boundLeft = heroRect.left + 50;
      const boundRight = heroRect.right - 50;
      const boundTop = Math.max(heroRect.top + 20, navBottom + 25);
      const boundBottom = heroRect.bottom - 45;
      const effOriginY = Math.max(originY, navBottom + 85);

      function getMaxDistanceToBoundaries(ox, oy, angle, pKMinor) {
        const kM = pKMinor || 0.65;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const candidates = [];
        if (cosA < -0.0001) candidates.push((boundLeft - ox) / cosA);
        if (cosA > 0.0001) candidates.push((boundRight - ox) / cosA);
        if (sinA < -0.0001) {
          if (oy > boundTop + 10) candidates.push((boundTop - oy) / (sinA * kM));
          else candidates.push(60);
        }
        if (sinA > 0.0001) {
          if (oy < boundBottom - 10) candidates.push((boundBottom - oy) / (sinA * kM));
          else candidates.push(60);
        }
        const positive = candidates.filter(d => d > 20);
        return positive.length > 0 ? Math.min(...positive) : 450;
      }

      const now = performance.now();
      const isNearNavbar = (effOriginY < boundTop + 50);

      if (topLevelEntries.length > 0) {
        // CASE A: The black hole has consumed actual content (letters, words, boxes, badges, buttons)
        // Eject ALL consumed content far outward across the entire front-page screen!
        const count = topLevelEntries.length;

        for (let i = 0; i < count; i++) {
          const entry = topLevelEntries[i];
          const isBox = !!(entry.isBox || entry.type === 'box');

          let releaseAngle;
          if (isNearNavbar) {
            // Fan across the wide downward arc covering the hero area [0.14 * PI, 0.86 * PI]
            const minAngle = 0.14 * Math.PI;
            const maxAngle = 0.86 * Math.PI;
            const baseAngle = minAngle + (i / Math.max(1, count - 1)) * (maxAngle - minAngle);
            const jitter = (((i * 31) % 19) / 19.0 - 0.5) * 0.12;
            releaseAngle = Math.max(minAngle, Math.min(maxAngle, baseAngle + jitter));
          } else {
            // Multi-directional distribution across 360 degrees in all 4 quadrants
            const baseAngle = (i * (2.0 * Math.PI / count));
            const jitter = (((i * 31) % 19) / 19.0 - 0.5) * 0.45;
            releaseAngle = (baseAngle + jitter + Math.PI * 2) % (Math.PI * 2);
          }

          // Dynamic per-particle perspective tilt & wide screen boundary calculation
          const particleKMinor = 0.54 + ((i * 19) % 7) * 0.045; // 0.54 to 0.81 varied perspective depth
          const maxAvailDist = getMaxDistanceToBoundaries(originX, effOriginY, releaseAngle, particleKMinor);
          const minHeroRadius = 180;
          const maxHeroRadius = Math.max(minHeroRadius + 90, maxAvailDist * 0.92);

          // Varied radial tiers covering the entire hero screen (inner, mid, outer, far-outer)
          const tierProgress = (i % 7) / 6.0; // 7 spatial tiers
          const tierJitter = (((i * 47) % 29) / 29.0 - 0.5) * 0.14;
          const spreadFraction = Math.max(0.06, Math.min(0.96, tierProgress + tierJitter));
          const targetRadius = minHeroRadius + spreadFraction * (maxHeroRadius - minHeroRadius);

          // ONE CONSISTENT ORBITAL DIRECTION: 1.0 (Counter-Clockwise matching accretion disk)
          // Distance-based Keplerian velocity (closer = faster, distant = slower)
          const keplerOmega = (44.0 / Math.pow(targetRadius, 0.72)) * (0.92 + ((i * 17) % 5) * 0.04);
          const ejectDuration = 0.85 + ((i * 13) % 7) * 0.07;

          let el;
          let charHalfW = 9;
          let charHalfH = 11;
          const isNearCore = (targetRadius < 210);

          if (isBox) {
            const sourceEl = entry.targetItem ? entry.targetItem.element : null;
            const vData = (entry.visualData && entry.visualData.glyph) ? entry.visualData : getBoxVisualData(sourceEl);

            if (vData.glyph) {
              // Sleek, glowing Quantum Tech Glyph Token (e.g. 🍃, ☕, ⚡, 🧠, 🕸️, 🐳)
              el = document.createElement('div');
              el.className = 'gravity-tech-token';
              el.innerHTML = `<span>${vData.glyph}</span>`;
              el.style.borderColor = vData.accentColor;
              el.style.boxShadow = `0 0 14px ${vData.accentColor}, inset 0 0 6px rgba(255, 255, 255, 0.25)`;
              charHalfW = 13;
              charHalfH = 13;
            } else {
              // User requirement: Do NOT throw boxes or image whole! Eject glowing dot shards / pixel beacons
              el = document.createElement('div');
              el.className = 'gravity-dot-shard';
              const dotSize = 5 + (i % 3) * 2;
              el.style.width = dotSize + 'px';
              el.style.height = dotSize + 'px';
              el.style.background = vData.accentColor;
              el.style.boxShadow = `0 0 10px ${vData.accentColor}`;
              charHalfW = dotSize * 0.5;
              charHalfH = dotSize * 0.5;
            }
          } else {
            el = document.createElement('span');
            el.className = 'gravity-flying-char gravity-released-char';
            el.textContent = entry.char || '•';
            el.style.fontFamily = (entry.originalStyle && entry.originalStyle.fontFamily) || 'inherit';
            el.style.fontSize = (entry.originalStyle && entry.originalStyle.fontSize) || '17px';
            el.style.fontWeight = (entry.originalStyle && entry.originalStyle.fontWeight) || '600';
            el.style.color = isNearCore ? '#fff5e6' : '#f8fafc';
            el.style.textShadow = isNearCore
              ? '0 0 6px rgba(245, 158, 11, 0.40), 0 0 12px rgba(245, 158, 11, 0.18)'
              : '0 0 5px rgba(255, 255, 255, 0.35)';
          }

          el.style.position = 'fixed';
          el.style.left = '0';
          el.style.top = '0';
          el.style.margin = '0';
          el.style.pointerEvents = 'none';
          el.style.userSelect = 'none';
          el.style.zIndex = '52';
          el.style.willChange = 'transform, opacity';

          layerFront.appendChild(el);

          ejectingBatch.push({
            el: el,
            entry: entry,
            isGenericSpark: false,
            isBox: isBox,
            charWidth: charHalfW * 2,
            charHeight: charHalfH * 2,
            kMinor: particleKMinor,
            phase: 'EJECTING',
            startTime: now,
            ejectDuration: ejectDuration,
            currentX: originX,
            currentY: effOriginY,
            releaseAngle: releaseAngle,
            currentAngle: releaseAngle,
            currentRadius: 0,
            targetRadius: targetRadius,
            angularVelocity: keplerOmega,
            radialDriftAmp: 4 + (i % 4) * 2,
            radialDriftFreq: 1.0 + (i % 3) * 0.3,
            radialDriftPhase: i * 1.3
          });
        }
      } else {
        // CASE B: Black hole consumed NO elements prior to destruction.
        // Eject restrained cosmic sparks far outward across the entire front-page screen
        const count = 24;
        const symbols = ['✦', '✧', '·', '•', '⋆'];

        for (let i = 0; i < count; i++) {
          let releaseAngle;
          if (isNearNavbar) {
            const minAngle = 0.14 * Math.PI;
            const maxAngle = 0.86 * Math.PI;
            const baseAngle = minAngle + (i / Math.max(1, count - 1)) * (maxAngle - minAngle);
            const jitter = (((i * 23) % 17) / 17.0 - 0.5) * 0.12;
            releaseAngle = Math.max(minAngle, Math.min(maxAngle, baseAngle + jitter));
          } else {
            const baseAngle = (i * (2.0 * Math.PI / count));
            const jitter = (((i * 23) % 17) / 17.0 - 0.5) * 0.40;
            releaseAngle = (baseAngle + jitter + Math.PI * 2) % (Math.PI * 2);
          }

          const particleKMinor = 0.55 + (i % 5) * 0.05;
          const maxAvailDist = getMaxDistanceToBoundaries(originX, effOriginY, releaseAngle, particleKMinor);
          const minHeroRadius = 160;
          const maxHeroRadius = Math.max(minHeroRadius + 80, maxAvailDist * 0.90);

          const tierProgress = (i % 5) / 4.0;
          const targetRadius = minHeroRadius + tierProgress * (maxHeroRadius - minHeroRadius);
          const keplerOmega = (44.0 / Math.pow(targetRadius, 0.72));
          const ejectDuration = 0.85 + (i % 4) * 0.08;

          const el = document.createElement('span');
          el.className = 'gravity-flying-char gravity-debris-spark';
          el.textContent = symbols[i % symbols.length];
          el.style.color = '#fdfcf7';
          el.style.textShadow = '0 0 4px rgba(255, 235, 190, 0.45)';
          el.style.fontSize = (12 + (i % 5) * 2) + 'px';
          el.style.position = 'fixed';
          el.style.left = '0';
          el.style.top = '0';
          el.style.margin = '0';
          el.style.pointerEvents = 'none';
          el.style.userSelect = 'none';
          el.style.zIndex = '52';
          el.style.willChange = 'transform, opacity';

          layerFront.appendChild(el);

          ejectingBatch.push({
            el: el,
            entry: null,
            isGenericSpark: true,
            isBox: false,
            charWidth: 16,
            charHeight: 16,
            kMinor: particleKMinor,
            phase: 'EJECTING',
            startTime: now,
            ejectDuration: ejectDuration,
            currentX: originX,
            currentY: effOriginY,
            releaseAngle: releaseAngle,
            currentAngle: releaseAngle,
            currentRadius: 0,
            targetRadius: targetRadius,
            angularVelocity: keplerOmega,
            radialDriftAmp: 4 + (i % 3) * 2,
            radialDriftFreq: 1.2,
            radialDriftPhase: i * 0.9
          });
        }
      }
    }

    // Section-Aware Interaction Layer (Site-Wide Micro-Vortex Focal Lens)
    let isSectionInteractionActive = false;
    let sectionFocalX = window.innerWidth * 0.5;
    let sectionFocalY = window.innerHeight * 0.5;
    let sectionFocalLensEl = null;
    let activeSectionSelector = null;
    let sectionAutoDeactivateTimer = null;
    let engineAnimId = null;

    // HUD Badge elements
    let telemetryBadge = null;
    let telemetryCountEl = null;

    // Influence zones in screen pixels (matching physical Three.js visual dimensions)
    const BASE_INFLUENCE_RADIUS = 420; // Generous gravitational well (~4.2x event horizon radius)
    const BASE_HORIZON_RADIUS = 95;    // Event horizon perimeter in screen pixels
    const BASE_SINGULARITY_RADIUS = 28;// Deep singularity collapse

    // Configurable consumption profiles per category (Tuned for observable orbital motion and physical spaghettification)
    const CONSUMPTION_PROFILES = {
      'char':       { duration: 1.45, weight: 0.014, maxStretch: 1.85, maxSkew: 20 },
      'word':       { duration: 1.65, weight: 0.022, maxStretch: 1.55, maxSkew: 18 },
      'label':      { duration: 1.85, weight: 0.026, maxStretch: 1.40, maxSkew: 15 },
      'pill':       { duration: 1.95, weight: 0.032, maxStretch: 1.35, maxSkew: 14 },
      'nav':        { duration: 2.05, weight: 0.035, maxStretch: 1.35, maxSkew: 13 },
      'button':     { duration: 2.30, weight: 0.042, maxStretch: 1.30, maxSkew: 12 },
      'paragraph':  { duration: 2.55, weight: 0.052, maxStretch: 1.25, maxSkew: 10 },
      'screenshot': { duration: 2.80, weight: 0.065, maxStretch: 1.20, maxSkew: 8 },
      'card':       { duration: 3.10, weight: 0.075, maxStretch: 1.18, maxSkew: 8 },
      'portrait':   { duration: 3.80, weight: 0.100, maxStretch: 1.15, maxSkew: 6 }
    };

    function isProtectedElement(el) {
      if (!el) return true;

      // 1. Strictly never consume navbar or header elements (including brand, nav links, theme menus, tools)
      if (el.closest('#spaceNavbar, #atelier-header, .atelier-nav, #navbar, nav, header, .theme-dropdown-wrapper, .theme-dropdown-menu, .menu-btn, .footer-nav, #spaceThemeDropdownMenu, #themeDropdownMenu, #ghNavbar, .nav-brand, .brand-monogram, .atelier-nav-links, .nav-tools, .location-pill, .studio-pill, #spaceNavLinks, #ghNavLinks')) {
        return true;
      }

      // 2. Element MUST be contained inside #hero
      const hero = document.getElementById('hero');
      if (!hero || !hero.contains(el)) {
        return true;
      }

      // 3. Never consume black hole interaction containers, HUD controls, overlays, or canvases
      if (el.id === 'cosmicRebirthPrompt' || el.closest('#cosmicRebirthPrompt') ||
          el.id === 'cosmicEnergyFlash' || el.closest('#cosmicEnergyFlash') ||
          el.id === 'gravityTelemetryBadge' || el.closest('#gravityTelemetryBadge') ||
          el.id === 'gravityRestoreBtn' || el.id === 'gravityDestroyBtn' || el.id === 'gravityRebirthBadgeBtn' ||
          el.id === 'gravityFieldToggleBtn' ||
          el.id === 'cosmicRebirthPromptBtn' ||
          el.id === 'blackHoleIntroHud' || el.closest('#blackHoleIntroHud') || el.id === 'introHudCloseBtn' ||
          el.id === 'galaxyHudBottombar' || el.closest('.galaxy-hud-bottombar') ||
          el.id === 'galaxy3DCanvas' || el.id === 'hero3DCanvas' || el.id === 'spaceStarfield' || el.id === 'portraitFragmentCanvas' ||
          el.id === 'gravitationalFocalLens' || el.closest('#gravitationalFocalLens') ||
          el.id === 'gravityAnimationLayerBack' || el.closest('#gravityAnimationLayerBack') ||
          el.id === 'gravityAnimationLayerFront' || el.closest('#gravityAnimationLayerFront') ||
          el.id === 'reticle-dot' || el.id === 'reticle-ring' ||
          el.id === 'blackHoleContainer' || el.closest('#blackHoleContainer') ||
          el.id === 'blackHoleHitArea' || el.closest('#blackHoleHitArea') ||
          el.id === 'projectModalClose' ||
          el.id === 'toastContainer' || el.closest('#toastContainer')) {
        return true;
      }

      // 4. Form controls
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return true;

      return false;
    }

    function isElementFixed(el) {
      let curr = el;
      while (curr && curr !== document.body && curr !== document.documentElement) {
        const pos = window.getComputedStyle(curr).position;
        if (pos === 'fixed') return true;
        curr = curr.parentElement;
      }
      return false;
    }

    function init() {
      initTelemetryBadge();
      initSectionFocalLens();
      initSectionPointerListeners();

      // Delay registration slightly so initial typography splitting has settled
      setTimeout(() => {
        registerTargets();
        isInitialized = true;
        lastTime = performance.now();
        startEngineLoop();
      }, 120);

      window.addEventListener('scroll', () => { needsRectRefresh = true; }, { passive: true });
      window.addEventListener('resize', () => { needsRectRefresh = true; }, { passive: true });

      // Interaction on the black hole (dragging, taps, threshold destruction)
      // is handled authoritatively by SpaceBlackHoleHero3D on #blackHoleHitArea.
      // Restoration is ONLY executed on explicit user request via buttons or hotkeys.

      // Unified Keyboard shortcuts:
      // 'U', 'Z', 'R': Instant element restoration / timeline recovery
      // 'D', 'X': Trigger black-hole collapse & destruction sequence
      // 'G': Toggle gravitational consumption field
      window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.key === 'u' || e.key === 'U' || e.key === 'z' || e.key === 'Z') {
          triggerCinematicRestoration();
        } else if (e.key === 'r' || e.key === 'R') {
          triggerCinematicRestoration();
        } else if (e.key === 'd' || e.key === 'D' || e.key === 'x' || e.key === 'X') {
          triggerCollapseAndDestruction();
        } else if (e.key === 'g' || e.key === 'G') {
          if (BlackHoleLifecycle.is('IDLE')) {
            BlackHoleLifecycle.setState('CONSUMING');
          } else {
            triggerCinematicRestoration();
          }
        }
      });
    }

    // ── SECTION-AWARE GRAVITATIONAL INTERACTION LAYER ──
    function initSectionFocalLens() {
      let lens = document.getElementById('gravitationalFocalLens');
      if (!lens) {
        lens = document.createElement('div');
        lens.id = 'gravitationalFocalLens';
        lens.className = 'gravitational-focal-lens';
        lens.setAttribute('aria-hidden', 'true');
        lens.innerHTML = `
          <div class="lens-core"></div>
          <div class="lens-ring"></div>
          <div class="lens-halo"></div>
        `;
        const layerFront = document.getElementById('gravityAnimationLayerFront') || document.body;
        layerFront.appendChild(lens);
      }
      sectionFocalLensEl = lens;
    }

    function initSectionPointerListeners() {
      let isPointerDown = false;
      window.addEventListener('pointerdown', (e) => {
        const heroEl = document.getElementById('hero');
        const inHero = heroEl ? (heroEl.getBoundingClientRect().bottom > 20 && heroEl.getBoundingClientRect().top < window.innerHeight) : false;
        if (inHero) return;

        if (e.target.closest('#gravityTelemetryBadge') || e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('textarea')) {
          return;
        }

        if (isSectionInteractionActive) {
          isPointerDown = true;
          setInteractionOrigin(e.clientX, e.clientY);
        }
      }, { passive: true });

      window.addEventListener('pointermove', (e) => {
        if (isSectionInteractionActive && isPointerDown) {
          setInteractionOrigin(e.clientX, e.clientY);
        }
      }, { passive: true });

      window.addEventListener('pointerup', () => {
        isPointerDown = false;
      }, { passive: true });
    }

    function setInteractionOrigin(x, y) {
      sectionFocalX = x;
      sectionFocalY = y;
      if (sectionFocalLensEl) {
        sectionFocalLensEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }
    }

    function activateSectionConsumption(sectionSelector, optX, optY) {
      isSectionInteractionActive = true;
      activeSectionSelector = sectionSelector || null;
      if (!sectionFocalLensEl) initSectionFocalLens();

      if (typeof optX === 'number' && typeof optY === 'number') {
        setInteractionOrigin(optX, optY);
      } else if (sectionSelector) {
        const targetEl = document.querySelector(sectionSelector);
        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          const cx = Math.max(80, Math.min(window.innerWidth - 80, rect.left + rect.width * 0.5));
          const cy = Math.max(80, Math.min(window.innerHeight - 80, rect.top + Math.min(rect.height * 0.4, 250)));
          setInteractionOrigin(cx, cy);
        } else {
          setInteractionOrigin(window.innerWidth * 0.5, window.innerHeight * 0.5);
        }
      } else {
        setInteractionOrigin(window.innerWidth * 0.5, window.innerHeight * 0.5);
      }

      if (sectionFocalLensEl) {
        sectionFocalLensEl.style.display = 'block';
        sectionFocalLensEl.style.opacity = '1';
      }

      const toggleBtn = document.getElementById('gravityFieldToggleBtn');
      if (toggleBtn) {
        toggleBtn.classList.add('is-active');
        toggleBtn.textContent = '✦ FIELD ACTIVE (G)';
      }

      if (typeof TypographyMotion !== 'undefined' && TypographyMotion.initUniversalInteractiveTokens) {
        TypographyMotion.initUniversalInteractiveTokens();
      }
      registerTargets();
    }

    function deactivateSectionConsumption() {
      isSectionInteractionActive = false;
      activeSectionSelector = null;
      if (sectionAutoDeactivateTimer) {
        clearTimeout(sectionAutoDeactivateTimer);
        sectionAutoDeactivateTimer = null;
      }
      if (sectionFocalLensEl) {
        sectionFocalLensEl.style.opacity = '0';
        setTimeout(() => {
          if (!isSectionInteractionActive && sectionFocalLensEl) {
            sectionFocalLensEl.style.display = 'none';
          }
        }, 250);
      }
      const toggleBtn = document.getElementById('gravityFieldToggleBtn');
      if (toggleBtn) {
        toggleBtn.classList.remove('is-active');
        toggleBtn.textContent = '🌀 GRAVITY FIELD (G)';
      }
    }

    function toggleSectionConsumption(optSectionSelector) {
      if (isSectionInteractionActive) {
        deactivateSectionConsumption();
      } else {
        activateSectionConsumption(optSectionSelector);
      }
    }

    function consumeSection(sectionSelector) {
      const secEl = document.querySelector(sectionSelector);
      if (!secEl) return;
      const rect = secEl.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = Math.max(100, Math.min(window.innerHeight - 100, rect.top + Math.min(rect.height * 0.35, 260)));
      activateSectionConsumption(sectionSelector, cx, cy);
    }

    function startEngineLoop() {
      if (engineAnimId) return;
      function loop() {
        engineAnimId = requestAnimationFrame(loop);

        let inHero = false;
        let bhX = -99999;
        let bhY = -99999;
        let scale = 0.34;

        if (typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.getBlackHoleState) {
          const bhState = SpaceBlackHoleHero3D.getBlackHoleState();
          inHero = bhState.isHeroActive;
          if (inHero) {
            bhX = bhState.x;
            bhY = bhState.y;
            scale = bhState.scale || 0.34;
          }
        }

        if (!inHero) {
          if (isSectionInteractionActive) {
            bhX = sectionFocalX;
            bhY = sectionFocalY;
            scale = 0.40;
          }
        }

        update(bhX, bhY, scale);
      }
      engineAnimId = requestAnimationFrame(loop);
    }

    function stopEngineLoop() {
      if (engineAnimId) {
        cancelAnimationFrame(engineAnimId);
        engineAnimId = null;
      }
    }

    function initTelemetryBadge() {
      if (document.documentElement.getAttribute('data-theme') === 'space') {
        // Space cockpit console handles telemetry at bottom bar
        return;
      }
      let badge = document.getElementById('gravityTelemetryBadge');
      if (!badge) {
        badge = document.createElement('div');
        badge.id = 'gravityTelemetryBadge';
        badge.className = 'gravitational-telemetry-badge is-visible';
        badge.setAttribute('role', 'status');
        badge.setAttribute('aria-live', 'polite');
        badge.innerHTML = `
          <span class="telemetry-pip" aria-hidden="true"></span>
          <span class="telemetry-label" id="gravityTelemetryLabel">ACCRETION: <strong id="gravityConsumedCount">0</strong> CONSUMED</span>
          <button type="button" class="telemetry-btn" id="gravityRestoreBtn" title="Restore letters to native layout (U or R)">✦ RESTORE (U)</button>
          <button type="button" class="telemetry-btn telemetry-btn-danger" id="gravityDestroyBtn" title="Trigger black hole destruction sequence (D)">💥 DESTROY (D)</button>
        `;
        const spaceContainer = document.getElementById('view-space') || document.body;
        spaceContainer.appendChild(badge);
      }
      telemetryBadge = badge;
      telemetryCountEl = document.getElementById('gravityConsumedCount');
      bindBadgeButtons();
    }

    function bindBadgeButtons() {
      const toggleBtn = document.getElementById('gravityFieldToggleBtn');
      if (toggleBtn) {
        toggleBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (BlackHoleLifecycle.is('CONSUMING')) {
            BlackHoleLifecycle.setState('IDLE');
            instantRestoreAll();
          } else if (BlackHoleLifecycle.is('IDLE')) {
            BlackHoleLifecycle.setState('CONSUMING');
            updateTelemetryBadge();
          } else {
            triggerCinematicRestoration();
          }
        };
      }
      const restoreBtn = document.getElementById('gravityRestoreBtn');
      if (restoreBtn) {
        restoreBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          triggerCinematicRestoration();
        };
      }
      const destroyBtn = document.getElementById('gravityDestroyBtn');
      if (destroyBtn) {
        destroyBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          triggerCollapseAndDestruction();
        };
      }
    }

    function getConsumedCount() {
      return targets.filter(t => t.state === 'CONSUMED').length;
    }

    function updateTelemetryBadge() {
      if (!telemetryBadge) return;
      const count = getConsumedCount();
      const labelEl = document.getElementById('gravityTelemetryLabel');
      const restoreBtn = document.getElementById('gravityRestoreBtn');
      const destroyBtn = document.getElementById('gravityDestroyBtn');

      if (BlackHoleLifecycle.is('RESTORING')) {
        telemetryBadge.classList.add('rebirth-ready');
        if (labelEl) labelEl.innerHTML = `TEMPORAL REVERSAL // RECONSTRUCTING`;
        if (restoreBtn) {
          restoreBtn.style.display = '';
          restoreBtn.textContent = '⏳ REVERSING...';
          restoreBtn.disabled = true;
          restoreBtn.style.pointerEvents = 'none';
        }
        if (destroyBtn) {
          destroyBtn.disabled = true;
          destroyBtn.style.pointerEvents = 'none';
        }
        return;
      }

      if (restoreBtn) restoreBtn.style.pointerEvents = '';
      if (destroyBtn) destroyBtn.style.pointerEvents = '';

      if (BlackHoleLifecycle.is('ORBITAL_GALAXY') || BlackHoleLifecycle.is('DESTROYED')) {
        telemetryBadge.classList.add('rebirth-ready');
        if (labelEl) labelEl.innerHTML = `TIMELINE ALTERED // <strong id="gravityConsumedCount">${count}</strong> ACTIVE`;
        if (restoreBtn) {
          restoreBtn.style.display = '';
          restoreBtn.textContent = '✦ RESTORE (U / R)';
        }
        if (destroyBtn) destroyBtn.style.display = 'none';
        return;
      }

      telemetryBadge.classList.remove('rebirth-ready');
      const toggleBtn = document.getElementById('gravityFieldToggleBtn');
      const isDestroyed = BlackHoleLifecycle.is('DESTROYED') || BlackHoleLifecycle.isReadyToDestroy();
      const isConsuming = BlackHoleLifecycle.is('CONSUMING');

      if (toggleBtn) {
        if (isConsuming) {
          toggleBtn.classList.add('is-active');
          toggleBtn.textContent = '✦ FIELD ACTIVE (G)';
        } else {
          toggleBtn.classList.remove('is-active');
          toggleBtn.textContent = '🌀 GRAVITY FIELD (G)';
        }
        toggleBtn.disabled = isDestroyed;
      }
      if (restoreBtn) {
        restoreBtn.style.display = '';
        restoreBtn.textContent = '✦ RESTORE (U)';
        if (isDestroyed || getConsumedCount() > 0) {
          restoreBtn.classList.add('is-active');
        } else {
          restoreBtn.classList.remove('is-active');
        }
      }
      if (destroyBtn) {
        destroyBtn.style.display = '';
        if (isDestroyed) {
          destroyBtn.textContent = '💥 DESTROYED';
          destroyBtn.disabled = true;
        } else {
          destroyBtn.textContent = '💥 DESTROY (D)';
          destroyBtn.disabled = false;
        }
      }
      if (labelEl) {
        labelEl.innerHTML = `ACCRETION: <strong id="gravityConsumedCount">${count}</strong> CONSUMED`;
        telemetryCountEl = document.getElementById('gravityConsumedCount');
      } else if (telemetryCountEl) {
        telemetryCountEl.textContent = count;
      }
    }

    function registerTargets() {
      // Prune disconnected elements while preserving existing in-flight / consumed items
      targets = targets.filter(t => t.element && t.element.isConnected);
      const seenElements = new Set(targets.map(t => t.element));

      // 1. Register character tokens in active hero section
      const charElements = document.querySelectorAll('#hero .gravity-char');
      charElements.forEach(el => {
        if (isProtectedElement(el)) return;
        if (seenElements.has(el)) return;
        seenElements.add(el);
        addTarget(el, 'char');
      });

      // 2. Register eligible rectangular boxes, cards, and buttons in active hero section (Entire front page eatable except navbar)
      const boxElements = document.querySelectorAll(
        '#hero .orbital-tech-badge, #hero .atelier-btn, #hero .ar-bracket, #hero .spatial-scroll-indicator, #hero #arFrame, #hero #arPortraitTerminal, #hero .space-commander-terminal, #hero .orbital-tracks-svg, #hero .ar-hud-telemetry, #hero .ar-identity-badge, #hero .space-meta-tag, #hero .meta-tag, #hero .space-hero-role-title, #hero .hero-footer-meta .meta-group, #hero .hero-footer-meta .meta-separator'
      );
      boxElements.forEach(el => {
        if (isProtectedElement(el)) return;
        if (seenElements.has(el)) return;
        seenElements.add(el);
        addTarget(el, 'box');
      });

      refreshRects();
    }

    function addTarget(el, type = 'char') {
      if (!el || isProtectedElement(el)) return;
      const targetId = nextTargetId++;
      const isFixed = isElementFixed(el);
      const isBox = (type === 'box');

      const parentBlock = el.closest('.gravity-word-wrapper') || el.parentElement;
      const profile = CONSUMPTION_PROFILES[type] || CONSUMPTION_PROFILES['char'];

      targets.push({
        id: 'grav_target_' + targetId,
        targetId: targetId,
        element: el,
        type: type,
        isBox: isBox,
        overlapRatio: 0.0,
        isFixed: isFixed,
        parentBlock: parentBlock,
        weight: profile.weight,
        maxStretch: profile.maxStretch,

        // State Machine: NORMAL | CONSUMING | CONSUMED | RETURNING | RESTORING
        state: 'NORMAL',
        progress: 0.0,

        // Accurate source layout measurements
        startX: 0,
        startY: 0,
        width: 8,
        height: 16,
        docX: 0,
        docY: 0,
        baseX: 0,
        baseY: 0,

        // Positioned visual animation clone (for characters)
        cloneEl: null,
        currentLayer: 'front',
        curScreenX: 0,
        curScreenY: 0,

        startTime: 0,
        consumptionDuration: 0.95,
        startRelX: 0,
        startRelY: 0,
        startRadius: 0,
        travelAngle: 0
      });
    }

    function refreshRects() {
      for (let i = 0; i < targets.length; i++) {
        const item = targets[i];
        if (!item.element.isConnected) continue;
        if (item.state === 'CONSUMED') continue;

        const r = item.element.getBoundingClientRect();
        item.width = Math.max(r.width, 6);
        item.height = Math.max(r.height, 12);

        if (item.isFixed) {
          item.baseX = r.left + item.width * 0.5;
          item.baseY = r.top + item.height * 0.5;
          item.docX = item.baseX;
          item.docY = item.baseY;
          item.startX = r.left;
          item.startY = r.top;
        } else {
          item.docX = r.left + item.width * 0.5 + window.scrollX;
          item.docY = r.top + item.height * 0.5 + window.scrollY;
          item.baseX = item.docX - window.scrollX;
          item.baseY = item.docY - window.scrollY;
          item.startX = r.left;
          item.startY = r.top;
        }
      }
      needsRectRefresh = false;
    }

    function smoothstep(min, max, value) {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    }

    // Helper: Spawn visual clone for physical ATTRACTION -> ORBITAL CAPTURE -> ACCRETING sequence
    function spawnVisualClone(item, bhX, bhY, effHorizon, layerFront) {
      if (item.cloneEl) return;
      const rect = item.element.getBoundingClientRect();
      item.startX = rect.left;
      item.startY = rect.top;
      item.width = Math.max(rect.width, 8);
      item.height = Math.max(rect.height, 14);
      item.curScreenX = rect.left;
      item.curScreenY = rect.top;

      const clone = document.createElement('span');
      clone.className = 'gravity-flying-char';
      clone.textContent = (item.element.textContent || '').trim() || item.element.innerText || '';

      const cs = window.getComputedStyle(item.element);
      clone.style.fontFamily = cs.fontFamily;
      clone.style.fontSize = cs.fontSize;
      clone.style.fontWeight = cs.fontWeight;
      clone.style.lineHeight = cs.lineHeight;
      clone.style.letterSpacing = cs.letterSpacing;
      clone.style.color = cs.color;
      clone.style.textTransform = cs.textTransform;
      clone.style.position = 'fixed';
      clone.style.left = '0';
      clone.style.top = '0';
      clone.style.margin = '0';
      clone.style.pointerEvents = 'none';
      clone.style.userSelect = 'none';
      clone.style.zIndex = '52';
      clone.style.willChange = 'transform, opacity, filter';

      clone.style.transform = `translate3d(${rect.left.toFixed(1)}px, ${rect.top.toFixed(1)}px, 0)`;
      layerFront.appendChild(clone);
      item.cloneEl = clone;
      item.currentLayer = 'front';

      // Hide original without causing any layout shift
      item.element.style.visibility = 'hidden';

      const charCenterX = rect.left + item.width * 0.5;
      const charCenterY = rect.top + item.height * 0.5;
      const relX0 = charCenterX - bhX;
      const relY0 = charCenterY - bhY;

      // Target capture radius in accretion disk zone (smoothly distributed between 120px and 220px)
      const captureRadius = Math.max(120, effHorizon * (2.2 + 0.8 * ((item.targetId * 19) % 10) / 10.0));
      const entryAngle = Math.atan2(relY0, relX0);

      item.startRelX = relX0;
      item.startRelY = relY0;
      item.startRadius = Math.hypot(relX0, relY0);
      item.captureRadius = captureRadius;
      item.entryAngle = entryAngle;

      // Stage 1: ATTRACTION phase parameters (0.85s to 1.35s smooth glide toward accretion orbit)
      item.attractStartTime = performance.now();
      item.attractDuration = 0.85 + Math.min(0.65, (item.startRadius / 800) * 0.45) + ((item.targetId * 13) % 4) * 0.08;
      item.state = 'ATTRACTING';
    }

    function update(bhX, bhY, currentScale = 1.0) {
      if (!isInitialized || targets.length === 0) return;

      const inHero = typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.isHeroActive ? SpaceBlackHoleHero3D.isHeroActive() : true;

      if (inHero && typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.isSettled && !SpaceBlackHoleHero3D.isSettled()) {
        return;
      }

      const isInteractionOriginValid = (bhX > -9000 && bhY > -9000);
      const canCaptureInCurrentContext = inHero ? isInteractionOriginValid : (isSectionInteractionActive && isInteractionOriginValid);

      const now = performance.now();
      const dt = lastTime > 0 ? Math.min((now - lastTime) / 1000, 0.045) : 0.016;
      lastTime = now;

      if (needsRectRefresh) {
        refreshRects();
      }

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Effective radii scaled by current black hole scale
      const effHorizon = BASE_HORIZON_RADIUS * currentScale;
      const effOrbitCapture = effHorizon * 3.4;
      const effInfluence = BASE_INFLUENCE_RADIUS * currentScale;
      const kMinor = 0.40;

      if (typeof PortraitDisintegrationEngine !== 'undefined' && PortraitDisintegrationEngine.update) {
        PortraitDisintegrationEngine.update(bhX, bhY, currentScale, dt);
      }

      const layerBack = document.getElementById('gravityAnimationLayerBack');
      const layerFront = document.getElementById('gravityAnimationLayerFront');
      if (!layerFront || !layerBack) return;

      // Update Released Content & Hero-Wide Gravitational Orbital Field
      // The black hole position (bhX, bhY) is the authoritatively maintained source of truth on EVERY frame
      if (ejectingBatch.length > 0) {
        const heroEl = document.getElementById('hero');
        const heroRect = heroEl ? heroEl.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
        // Front-page / hero boundary constraints strictly moving with hero on page scroll
        const boundLeft = heroRect.left + 35;
        const boundRight = heroRect.right - 35;
        const boundTop = heroRect.top + 20;
        const boundBottom = heroRect.bottom - 35;

        for (let i = 0; i < ejectingBatch.length; i++) {
          const p = ejectingBatch[i];
          const elapsed = (now - p.startTime) / 1000;

          if (p.phase === 'REVERSING') {
            const revElapsed = (now - p.reversalStartTime) / 1000;
            const u = Math.min(1.0, revElapsed / p.reversalDuration);

            let renderX, renderY, scale, opacity;

            if (u < 0.25) {
              // Sub-phase 1: Orbital braking and smooth reverse arc
              const tBrake = u / 0.25;
              const brakeFactor = 1.0 - tBrake;
              p.currentAngle -= p.initialOmega * dt * brakeFactor * 1.5;
              const kMinorReversal = p.kMinor || 0.62;
              p.reversalMidX = bhX + Math.cos(p.currentAngle) * p.currentRadius;
              p.reversalMidY = bhY + Math.sin(p.currentAngle) * (p.currentRadius * kMinorReversal);

              renderX = p.reversalMidX - (p.charWidth ? p.charWidth * 0.5 : 9);
              renderY = p.reversalMidY - (p.charHeight ? p.charHeight * 0.5 : 11);
              scale = 0.95;
              opacity = 0.85;
            } else {
              // Sub-phase 2: Guided return flight to exact live DOM location
              const s = (u - 0.25) / 0.75;
              const q = 1.0 - Math.pow(1.0 - s, 3.2);

              // Live recalculation of target position from DOM element (handles window resize dynamically!)
              let destX = p.reversalMidX, destY = p.reversalMidY;
              const sourceItem = (p.entry && p.entry.targetItem) ? p.entry.targetItem : null;
              if (sourceItem && sourceItem.element && sourceItem.element.isConnected) {
                const r = sourceItem.element.getBoundingClientRect();
                destX = r.left;
                destY = r.top;
              } else if (p.entry && p.entry.originalRect) {
                destX = p.entry.originalRect.x - window.scrollX;
                destY = p.entry.originalRect.y - window.scrollY;
              }

              const curX = p.reversalMidX * (1.0 - q) + destX * q;
              const curY = p.reversalMidY * (1.0 - q) + destY * q;
              renderX = curX;
              renderY = curY;
              scale = 0.95 * (1.0 - q) + 1.0 * q;
              opacity = 0.85 * (1.0 - q) + 1.0 * q;

              if (s > 0.6 && p.el) {
                p.el.style.textShadow = 'none';
              }
            }

            p.currentX = renderX;
            p.currentY = renderY;

            if (p.el) {
              p.el.style.transform = `translate3d(${renderX.toFixed(1)}px, ${renderY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
              p.el.style.opacity = opacity.toFixed(2);
            }
            continue;
          }

          if (elapsed < p.ejectDuration) {
            // PHASE 1: ENERGETIC EJECTION BURST (Decelerating expansion outward from current black hole position)
            const u = Math.max(0.0, Math.min(1.0, elapsed / p.ejectDuration));
            const easeOut = 1.0 - Math.pow(1.0 - u, 3.0);
            p.currentRadius = p.targetRadius * easeOut;
            p.currentAngle = p.releaseAngle + u * p.angularVelocity * 0.25;
          } else {
            // PHASE 2: CONTINUOUS KEPLERIAN GRAVITATIONAL ORBIT (ONE CONSISTENT DIRECTION)
            if (p.phase !== 'ORBITING') {
              p.phase = 'ORBITING';
              p.currentRadius = p.targetRadius;
            }
            const orbitElapsed = elapsed - p.ejectDuration;
            p.currentAngle += p.angularVelocity * dt;
            // Smoothly phased radial drift that starts at 0 at transition (zero snap or teleportation!)
            const drift = p.radialDriftAmp * Math.sin(p.radialDriftFreq * orbitElapsed) * Math.min(1.0, orbitElapsed / 1.2);
            p.currentRadius = p.targetRadius + drift;
          }

          // Elliptical perspective orbit matching 3D inclination angle of black hole accretion disk
          // Synchronously tracks live bhX, bhY and moves smoothly up behind the navbar on scroll
          const kMinor = p.kMinor || 0.62;
          const x = bhX + Math.cos(p.currentAngle) * p.currentRadius;
          const y = bhY + Math.sin(p.currentAngle) * (p.currentRadius * kMinor);

          // Natural elliptical Keplerian positioning relative to live (bhX, bhY) without navbar trapping
          const charHalfW = p.charWidth ? p.charWidth * 0.5 : 9;
          const charHalfH = p.charHeight ? p.charHeight * 0.5 : 11;
          const renderX = Math.max(boundLeft, Math.min(boundRight - charHalfW * 2, x - charHalfW));
          const renderY = Math.max(boundTop, Math.min(boundBottom - charHalfH * 2, y - charHalfH));

          p.currentX = x;
          p.currentY = y;

          // 3D Depth Layering: Front vs Back of the black hole
          const isFront = Math.sin(p.currentAngle) >= -0.05;
          const targetLayer = isFront ? layerFront : layerBack;
          if (p.el && p.el.parentElement !== targetLayer) {
            targetLayer.appendChild(p.el);
          }

          const baseOpacity = isFront ? 0.95 : 0.62;
          const scale = isFront ? 1.02 : 0.88;

          if (p.el) {
            p.el.style.transform = `translate3d(${renderX.toFixed(1)}px, ${renderY.toFixed(1)}px, 0) scale(${scale.toFixed(2)})`;
            p.el.style.opacity = baseOpacity.toFixed(2);
          }
        }
      }

      const allowedCaptures = new Set();
      const isFieldActive = BlackHoleLifecycle.is('CONSUMING') || BlackHoleLifecycle.isReadyToDestroy() || BlackHoleLifecycle.isDestroying();
      const canCaptureNew = canCaptureInCurrentContext && (isFieldActive || BlackHoleLifecycle.isInteracting()) && restoringBatch.length === 0 && ejectingBatch.length === 0 && rebirthingBatch.length === 0;

      if (canCaptureNew) {
        // Gravitational capture radius: strictly respects physical proximity to black hole
        // Only content that enters the effective capture region begins responding
        const maxPullDist = Math.max(160, effHorizon * 7.5);
        const blockMinDist = new Map();
        const blockCandidate = new Map();

        for (let i = 0; i < targets.length; i++) {
          const item = targets[i];
          if (!item.element.isConnected) continue;
          if (item.type !== 'char') continue;
          if (item.state !== 'NORMAL') continue;

          let bx, by;
          if (item.isFixed) {
            bx = item.baseX;
            by = item.baseY;
          } else if (item.element && item.element.closest('.space-hero-plinth, .orbital-tech-badge')) {
            const r = item.element.getBoundingClientRect();
            bx = r.left + r.width * 0.5;
            by = r.top + r.height * 0.5;
          } else {
            bx = item.docX - window.scrollX;
            by = item.docY - window.scrollY;
          }
          const d = Math.hypot(bhX - bx, bhY - by);

          if (d <= maxPullDist) {
            const parent = item.parentBlock || item.element.parentElement;
            const currentMin = blockMinDist.get(parent);
            if (currentMin === undefined || d < currentMin) {
              blockMinDist.set(parent, d);
              blockCandidate.set(parent, item);
            }
          }
        }

        // Staggered organic release: closest letters peel away first
        blockCandidate.forEach((candidate, parent) => {
          const lastCapture = parent._lastCaptureTimestamp || 0;
          if (now - lastCapture >= 42) {
            allowedCaptures.add(candidate);
            parent._lastCaptureTimestamp = now;
          }
        });
      }

      for (let i = 0; i < targets.length; i++) {
        const item = targets[i];
        if (!item.element || !item.element.isConnected) continue;

        if (item.state === 'CONSUMED') continue;

        if (item.state === 'RESTORING') {
          handleRestoringItem(item, dt, now);
          continue;
        }

        // ── 1. PROGRESSIVE CONSUMPTION OF RECTANGULAR BOXES, CARDS & BUTTONS ──
        if (item.type === 'box') {
          const r = item.element.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;

          const closestX = Math.max(r.left, Math.min(r.right, bhX));
          const closestY = Math.max(r.top, Math.min(r.bottom, bhY));
          const dMin = Math.hypot(bhX - closestX, bhY - closestY);

          const dMax = Math.max(
            Math.hypot(bhX - r.left, bhY - r.top),
            Math.hypot(bhX - r.right, bhY - r.top),
            Math.hypot(bhX - r.left, bhY - r.bottom),
            Math.hypot(bhX - r.right, bhY - r.bottom)
          );

          const cardInfluence = Math.max(160, effHorizon * 7.0);

          if (canCaptureNew && dMin <= cardInfluence) {
            const progress = Math.max(0, Math.min(1.0, (cardInfluence - dMin) / (cardInfluence * 0.88)));
            item.overlapRatio = progress;

            // Fully consumed threshold: black hole singularity engulfed the card, or deep overlap reaches singularity
            const isEngulfed = (dMin === 0) || progress >= 0.60 || dMin <= effHorizon * 2.5;

            if (isEngulfed) {
              item.element.style.transition = 'opacity 0.22s ease';
              item.element.style.opacity = '0';
              item.element.style.visibility = 'hidden';
              item.element.style.pointerEvents = 'none';
              item.element.style.transform = 'none';
              item.element.style.webkitMaskImage = '';
              item.element.style.maskImage = '';
              item.element.style.border = 'none';
              item.element.style.boxShadow = 'none';
              item.element.style.outline = 'none';
              item.element.style.background = 'transparent';
              item.state = 'CONSUMED';

              // If this is a plinth or terminal container, ensure all child frames, brackets, and images are hidden
              if (item.element.id === 'arPortraitTerminal' || item.element.classList.contains('space-commander-terminal')) {
                const subElements = item.element.querySelectorAll('#arFrame, .ar-bracket, .ar-hud-telemetry, picture, img, .ar-identity-badge');
                subElements.forEach(s => {
                  s.style.opacity = '0';
                  s.style.visibility = 'hidden';
                });
              } else if (item.element.id === 'arFrame') {
                const parentTerm = document.getElementById('arPortraitTerminal');
                if (parentTerm) {
                  parentTerm.style.opacity = '0';
                  parentTerm.style.visibility = 'hidden';
                }
              }

              // Also consume any child characters of this card that haven't peeled off yet
              for (let c = 0; c < targets.length; c++) {
                const child = targets[c];
                if (child.type === 'char' && child.state === 'NORMAL' && item.element.contains(child.element)) {
                  child.state = 'CONSUMED';
                  child.element.style.visibility = 'hidden';
                  const rec = {
                    id: child.id,
                    targetItem: child,
                    char: (child.element.textContent || '').trim() || child.element.innerText || '',
                    element: child.element,
                    parentElement: child.element.parentElement,
                    docX: child.docX,
                    docY: child.docY,
                    width: child.width,
                    height: child.height,
                    style: {
                      color: window.getComputedStyle(child.element).color,
                      fontFamily: window.getComputedStyle(child.element).fontFamily,
                      fontSize: window.getComputedStyle(child.element).fontSize,
                      fontWeight: window.getComputedStyle(child.element).fontWeight
                    },
                    state: 'CONSUMED',
                    consumedAt: Date.now(),
                    type: 'char',
                    isBox: false
                  };
                  if (!consumedRegistry.some(e => e.id === child.id)) {
                    consumedRegistry.push(rec);
                  }
                }
              }

              const visualData = getBoxVisualData(item.element);
              consumedRegistry.push({
                id: item.id,
                targetItem: item,
                visualData: visualData,
                consumedAt: Date.now(),
                type: 'box',
                isBox: true
              });

              if (typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.onElementConsumed) {
                SpaceBlackHoleHero3D.onElementConsumed({
                  type: 'box',
                  angle: Math.atan2(closestY - bhY, closestX - bhX),
                  weight: 0.05
                });
              }
              updateTelemetryBadge();
              continue;
            }

            // User requirement: Originality in consumption! Nothing big enters whole.
            // Boxes and images dissolve into streams of glowing matter dots peeling toward singularity.
            // No weird circle masks, no rigid 3D warping or scaling.
            const jAmp = progress * 2.2;
            const jx = (Math.sin(Date.now() * 0.04 + item.targetId * 17) * jAmp).toFixed(1);
            const jy = (Math.cos(Date.now() * 0.045 + item.targetId * 19) * jAmp).toFixed(1);

            item.element.style.transform = `translate3d(${jx}px, ${jy}px, 0)`;
            item.element.style.webkitMaskImage = '';
            item.element.style.maskImage = '';
            item.element.style.opacity = `${Math.max(0, 1.0 - progress * 1.35).toFixed(3)}`;
            item.element.style.pointerEvents = 'auto';
            item.state = 'CONSUMING';

            // Spawn streaming matter dots peeling off into the gravitational sink
            if (progress > 0.08) {
              spawnBoxMatterDots(item, r, bhX, bhY, progress, layerFront);
            }
          } else if (item.state === 'CONSUMING' && dMin > cardInfluence) {
            item.element.style.transform = '';
            item.element.style.webkitMaskImage = '';
            item.element.style.maskImage = '';
            item.element.style.opacity = '';
            item.element.style.pointerEvents = '';
            item.overlapRatio = 0;
            item.state = 'NORMAL';
          }
          continue;
        }

        // ── 2. FULL GRAVITATIONAL SEQUENCE: ATTRACTION -> ORBITAL CAPTURE -> ACCELERATING ORBIT -> ACCRETION -> CONSUMED ──
        const bx = item.isFixed ? item.baseX : (item.docX - window.scrollX);
        const by = item.isFixed ? item.baseY : (item.docY - window.scrollY);

        if (item.state === 'NORMAL') {
          if (allowedCaptures.has(item)) {
            spawnVisualClone(item, bhX, bhY, effHorizon, layerFront);
          }
          continue;
        }

        // STAGE A: ATTRACTION (Smooth glide from native layout position to the outer accretion orbit)
        if (item.state === 'ATTRACTING') {
          const elapsed = (now - item.attractStartTime) / 1000;
          const tau = Math.min(1.0, elapsed / item.attractDuration);

          // Smooth cubic ease-in-out curve
          const q = tau < 0.5 ? 4.0 * tau * tau * tau : 1.0 - Math.pow(-2.0 * tau + 2.0, 3.0) / 2.0;

          const entryX = bhX + item.captureRadius * Math.cos(item.entryAngle) - item.width * 0.5;
          const entryY = bhY + item.captureRadius * Math.sin(item.entryAngle) * 0.44 - item.height * 0.5;

          const curX = item.startX * (1.0 - q) + entryX * q;
          const curY = item.startY * (1.0 - q) + entryY * q;
          item.curScreenX = curX;
          item.curScreenY = curY;

          // Subtle flight orientation along glide path
          const flightAngle = Math.atan2(entryY - item.startY, entryX - item.startX) * q * 0.45;

          if (item.cloneEl) {
            item.cloneEl.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) rotate(${flightAngle.toFixed(3)}rad)`;
            item.cloneEl.style.opacity = '1.0';
          }

          if (tau >= 1.0) {
            // Seamlessly transition into sustained ORBITING!
            item.state = 'ORBITING';
            item.orbitStartTime = now;
            item.orbitAngle = item.entryAngle;
            item.currentAngle = item.entryAngle;
            item.orbitRadius = item.captureRadius;
            item.orbitDuration = 4.0 + ((item.targetId * 7) % 5) * 0.35; // 4.0s to 5.4s sustained orbit
            // Physical variation between letters
            item.speedVar = 0.92 + ((item.targetId * 17) % 7) * 0.026; // 0.92 to 1.08
            item.eccentricity = 0.04 + ((item.targetId * 23) % 6) * 0.015; // 0.04 to 0.115
            item.pericenterPhase = ((item.targetId * 31) % 10) * 0.628;
            item.inclination = 0.42 + ((item.targetId * 11) % 5) * 0.012; // 0.42 to 0.47
          }
          continue;
        }

        // STAGE B: ORBITING & ACCELERATING ORBIT (Distance-Based Keplerian Velocity & Progressive Tidal Stretch)
        if (item.state === 'ORBITING') {
          const elapsed = (now - item.orbitStartTime) / 1000;
          const u = Math.min(1.0, elapsed / item.orbitDuration);
          const rHorizon = effHorizon * 0.90;

          // 1. Orbital Decay: Radius smoothly spirals inward toward event horizon
          const rCurrent = item.captureRadius * (1.0 - Math.pow(u, 1.45)) + rHorizon * Math.pow(u, 1.45);

          // 2. Distance-Based Angular Velocity Function (Keplerian-inspired: omega strictly increases as radius decreases)
          // Normalized distance: 1.0 at capture perimeter, 0.0 at event horizon
          const s = Math.max(0.0, Math.min(1.0, (rCurrent - rHorizon) / Math.max(10, item.captureRadius - rHorizon)));
          const omegaMin = 1.30 * (item.speedVar || 1.0);  // Far away: slow stately orbit (~0.20 rev/s)
          const omegaMax = 7.60 * (item.speedVar || 1.0);  // Near horizon: fast acceleration (~1.20 rev/s)
          const omega = omegaMin + (omegaMax - omegaMin) * Math.pow(1.0 - s, 1.5);

          if (item.currentAngle === undefined) item.currentAngle = item.orbitAngle || item.entryAngle || 0;
          item.currentAngle += omega * dt;
          const theta = item.currentAngle;

          // 3. Inclined Elliptical Orbit matching accretion disk inclination with subtle eccentric variation
          const inc = item.inclination || 0.44;
          const ecc = item.eccentricity || 0.05;
          const peri = item.pericenterPhase || 0.0;
          const rMod = rCurrent * (1.0 + ecc * Math.cos(theta + peri));

          const curX = bhX + rMod * Math.cos(theta) - item.width * 0.5;
          const curY = bhY + rMod * Math.sin(theta) * inc - item.height * 0.5;
          item.curScreenX = curX;
          item.curScreenY = curY;

          // 4. 3D Depth Layer Switching: front half in front of black hole, rear half passes behind!
          const sinTheta = Math.sin(theta);
          if (sinTheta < 0 && item.currentLayer !== 'front') {
            layerFront.appendChild(item.cloneEl);
            item.currentLayer = 'front';
          } else if (sinTheta > 0 && item.currentLayer !== 'back') {
            layerBack.appendChild(item.cloneEl);
            item.currentLayer = 'back';
          }

          // 5. Believable Gravitational Tidal Stretching along the orbital flight tangent
          const flightTangent = Math.atan2(inc * Math.cos(theta), -Math.sin(theta));
          const stretchFactor = 1.0 + 2.5 * Math.pow(1.0 - s, 1.6);
          const thinFactor = Math.max(0.22, 1.0 / Math.sqrt(stretchFactor));

          // 6. Gravitational Redshift & Time Dilation Dimming near the horizon
          let filterStr = '';
          if (u > 0.65) {
            const redProgress = (u - 0.65) / 0.35;
            filterStr = `sepia(${(0.85 * redProgress).toFixed(2)}) saturate(${(1.0 + 3.5 * redProgress).toFixed(2)}) hue-rotate(${(-28 * redProgress).toFixed(1)}deg) brightness(${(1.0 - 0.35 * redProgress).toFixed(2)})`;
          }

          let opacity = 1.0;
          if (u > 0.88) {
            opacity = Math.max(0.0, (1.0 - u) / 0.12);
          }

          if (item.cloneEl) {
            item.cloneEl.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) rotate(${flightTangent.toFixed(3)}rad) scale(${stretchFactor.toFixed(2)}, ${thinFactor.toFixed(2)}) rotate(${(-flightTangent).toFixed(3)}rad)`;
            item.cloneEl.style.opacity = opacity.toFixed(3);
            if (filterStr) item.cloneEl.style.filter = filterStr;
          }

          // 7. Event Horizon Crossing: Accretion & Consumption!
          if (u >= 1.0 || rCurrent <= rHorizon) {
            item.state = 'CONSUMED';
            item.progress = 1.0;
            if (item.cloneEl) {
              item.cloneEl.remove();
              item.cloneEl = null;
            }
            if (item.element) {
              item.element.style.opacity = '0';
              item.element.style.visibility = 'hidden';
              item.element.style.pointerEvents = 'none';
            }

            const charContent = item.element ? (item.element.textContent || '').trim() : '';
            const cs = item.element ? window.getComputedStyle(item.element) : null;

            const record = {
              id: item.id,
              targetItem: item,
              char: charContent,
              element: item.element,
              parent: item.parentBlock || (item.element ? item.element.parentElement : null),
              originalPos: {
                x: item.baseX,
                y: item.baseY,
                width: item.width,
                height: item.height
              },
              originalStyle: {
                color: cs ? cs.color : '#e0e6ed',
                fontSize: cs ? cs.fontSize : '16px',
                fontFamily: cs ? cs.fontFamily : 'inherit',
                fontWeight: cs ? cs.fontWeight : '400',
                letterSpacing: cs ? cs.letterSpacing : 'normal',
                textTransform: cs ? cs.textTransform : 'none'
              },
              state: 'CONSUMED',
              consumedAt: Date.now(),
              entryAngle: theta,
              entryPos: {
                x: bhX + Math.cos(theta) * rHorizon,
                y: bhY + Math.sin(theta) * rHorizon
              },
              type: item.type || 'char',
              isBox: !!item.isBox
            };

            if (!consumedRegistry.some(e => e.id === item.id)) {
              consumedRegistry.push(record);
            }

            // Accretion disk briefly flashes and black hole mass accretes smoothly
            if (typeof SpaceBlackHoleHero3D !== 'undefined') {
              if (SpaceBlackHoleHero3D.pulseAccretionDisk) {
                SpaceBlackHoleHero3D.pulseAccretionDisk(theta);
              }
              if (SpaceBlackHoleHero3D.onElementConsumed) {
                SpaceBlackHoleHero3D.onElementConsumed({
                  type: 'char',
                  angle: theta,
                  weight: 0.005
                });
              }
            }

            updateTelemetryBadge();
          }
          continue;
        }

        // Interrupted returning
        if (item.state === 'RETURNING') {
          const returnDamp = 1.0 - Math.exp(-9.0 * dt);
          item.curScreenX += (item.startX - item.curScreenX) * returnDamp;
          item.curScreenY += (item.startY - item.curScreenY) * returnDamp;
          item.progress = Math.max(0, item.progress - dt * 1.5);

          if (item.cloneEl) {
            item.cloneEl.style.transform = `translate3d(${item.curScreenX.toFixed(1)}px, ${item.curScreenY.toFixed(1)}px, 0)`;
            item.cloneEl.style.opacity = '1';
          }

          if (Math.hypot(item.curScreenX - item.startX, item.curScreenY - item.startY) < 1.5) {
            if (item.cloneEl) {
              item.cloneEl.remove();
              item.cloneEl = null;
            }
            item.element.style.opacity = '';
            item.state = 'NORMAL';
            item.progress = 0;
          }
          continue;
        }
      }

      // Update in-flight matter dots flowing into black hole
      if (activeMatterDots.length > 0) {
        const nowMs = performance.now();
        for (let mIdx = activeMatterDots.length - 1; mIdx >= 0; mIdx--) {
          const m = activeMatterDots[mIdx];
          const age = nowMs - m.birth;
          if (age > m.life) {
            if (m.el && m.el.parentNode) m.el.parentNode.removeChild(m.el);
            activeMatterDots.splice(mIdx, 1);
            continue;
          }
          const dx = bhX - m.x;
          const dy = bhY - m.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < effHorizon * 0.9) {
            if (m.el && m.el.parentNode) m.el.parentNode.removeChild(m.el);
            activeMatterDots.splice(mIdx, 1);
            continue;
          }
          const pull = Math.min(22.0, 1400 / (dist + 25));
          const swirlX = (-dy / dist) * pull * 0.70;
          const swirlY = (dx / dist) * pull * 0.70;
          m.vx += (dx / dist * pull + swirlX) * 0.32;
          m.vy += (dy / dist * pull + swirlY) * 0.32;
          m.vx *= 0.86;
          m.vy *= 0.86;
          m.x += m.vx;
          m.y += m.vy;
          const alpha = Math.max(0, 1.0 - (age / m.life));
          m.el.style.transform = `translate3d(${m.x.toFixed(1)}px, ${m.y.toFixed(1)}px, 0)`;
          m.el.style.opacity = alpha.toFixed(2);
        }
      }
    }

    function instantRestoreAll() {
      isRestorationRunning = false;
      const genId = BlackHoleLifecycle.nextGeneration();
      deactivateSectionConsumption();

      // Reignite and reset 3D black hole
      if (typeof SpaceBlackHoleHero3D !== 'undefined') {
        if (SpaceBlackHoleHero3D.reigniteBlackHole) {
          SpaceBlackHoleHero3D.reigniteBlackHole();
        } else if (SpaceBlackHoleHero3D.resetBlackHoleVisuals) {
          SpaceBlackHoleHero3D.resetBlackHoleVisuals(true);
        }
        if (SpaceBlackHoleHero3D.resetDragState) {
          SpaceBlackHoleHero3D.resetDragState();
        }
        if (SpaceBlackHoleHero3D.resetDestructionTimers) {
          SpaceBlackHoleHero3D.resetDestructionTimers();
        }
      }

      // Clean all flying/released clones in batches
      ejectingBatch.forEach(p => { if (p.el) p.el.remove(); });
      ejectingBatch = [];
      orbitalGalaxyBatch = [];
      rebirthingBatch = [];
      restoringBatch = [];
      consumedRegistry = [];

      // Clean animation layers of any orphaned DOM clones or debris
      const layerBack = document.getElementById('gravityAnimationLayerBack');
      const layerFront = document.getElementById('gravityAnimationLayerFront');
      if (layerBack) layerBack.innerHTML = '';
      if (layerFront) layerFront.innerHTML = '';

      // Clear any debris items that may have been created
      document.querySelectorAll('.gravity-flying-char, .gravity-debris-item, .gravity-released-box').forEach(el => el.remove());

      // Restore every target cleanly
      for (let i = 0; i < targets.length; i++) {
        const item = targets[i];
        if (!item || !item.element) continue;

        item.state = 'NORMAL';
        item.progress = 0.0;
        item.overlapRatio = 0.0;
        item.angleSwept = 0;
        item.orbitAngle = 0;
        item.isOrbitInitialized = false;
        item.isDirty = false;
        item.isPreTidalPulled = false;
        if (item.cloneEl) {
          item.cloneEl.remove();
          item.cloneEl = null;
        }

        if (item.parentBlock) {
          item.parentBlock._lastCaptureTimestamp = 0;
        }
        if (item.element && item.element.parentElement) {
          item.element.parentElement._lastCaptureTimestamp = 0;
        }

        if (item.element) {
          item.element.classList.remove(
            'gravity-active',
            'gravity-consuming',
            'gravity-consumed',
            'gravity-orbit-front',
            'gravity-orbit-back',
            'gravity-scattered'
          );
          item.element.style.transform = '';
          item.element.style.opacity = '';
          item.element.style.filter = '';
          item.element.style.textShadow = '';
          item.element.style.color = '';
          item.element.style.visibility = '';
          item.element.style.pointerEvents = '';
          item.element.style.userSelect = '';
          item.element.style.zIndex = '';
          item.element.style.transition = '';
          item.element.style.border = '';
          item.element.style.boxShadow = '';
          item.element.style.outline = '';
          item.element.style.background = '';
          item.element.style.webkitMaskImage = '';
          item.element.style.maskImage = '';
          item.element.style.clipPath = '';
        }
      }

      // Re-register targets to drop stale references to deleted nodes and pick up all active hero tokens
      if (typeof TypographyMotion !== 'undefined' && TypographyMotion.initUniversalInteractiveTokens) {
        TypographyMotion.initUniversalInteractiveTokens();
      }
      registerTargets();
      refreshRects();

      const protectedHeaderEls = document.querySelectorAll('#atelier-header, #atelier-header *, #spaceNavbar, #spaceNavbar *');
      protectedHeaderEls.forEach(el => {
        if (el.style) {
          if (el.style.opacity === '0') el.style.opacity = '';
          if (el.style.pointerEvents === 'none') el.style.pointerEvents = '';
          if (el.style.visibility === 'hidden') el.style.visibility = '';
        }
      });

      activeMatterDots.forEach(m => { if (m.el && m.el.parentNode) m.el.parentNode.removeChild(m.el); });
      activeMatterDots = [];

      if (typeof PortraitDisintegrationEngine !== 'undefined' && PortraitDisintegrationEngine.instantRestore) {
        PortraitDisintegrationEngine.instantRestore();
      }
      const arFrameEl = document.getElementById('arFrame');
      if (arFrameEl) {
        arFrameEl.style.transition = 'none';
        arFrameEl.style.opacity = '1';
        arFrameEl.style.transform = '';
        arFrameEl.style.webkitMaskImage = '';
        arFrameEl.style.maskImage = '';
        arFrameEl.classList.remove('grav-distorting');
      }

      const terminalEl = document.getElementById('arPortraitTerminal');
      if (terminalEl) {
        terminalEl.style.transition = 'none';
        terminalEl.style.opacity = '1';
        terminalEl.style.visibility = 'visible';
        terminalEl.style.pointerEvents = '';
        const childNodes = terminalEl.querySelectorAll('*');
        childNodes.forEach(c => {
          if (c.style) {
            c.style.opacity = '';
            c.style.visibility = '';
          }
        });
      }
      const tracksSvg = document.querySelector('.orbital-tracks-svg');
      if (tracksSvg) {
        tracksSvg.style.opacity = '1';
        tracksSvg.style.visibility = 'visible';
      }

      const flashEl = document.getElementById('cosmicEnergyFlash');
      if (flashEl) {
        flashEl.style.opacity = '0';
        flashEl.style.transform = 'scale(0.01)';
      }

      const rebirthPrompt = document.getElementById('cosmicRebirthPrompt');
      if (rebirthPrompt) rebirthPrompt.classList.remove('visible');

      BlackHoleLifecycle.setState('IDLE');
      needsRectRefresh = true;
      updateTelemetryBadge();

      if (typeof ProjectsManager !== 'undefined' && ProjectsManager.refreshScene) {
        ProjectsManager.refreshScene();
      }
    }

    let isRestorationRunning = false;

    function triggerCinematicRestoration() {
      // 1. Guard against overlapping restoration sequences
      if (BlackHoleLifecycle.is('RESTORING') || isRestorationRunning) {
        return;
      }

      // 2. Safeguard against incomplete destruction: cancel destruction timers and unlock scroll
      if (typeof SpaceBlackHoleHero3D !== 'undefined') {
        if (SpaceBlackHoleHero3D.resetDestructionTimers) {
          SpaceBlackHoleHero3D.resetDestructionTimers();
        }
        if (SpaceBlackHoleHero3D.unlockScroll) {
          SpaceBlackHoleHero3D.unlockScroll();
        }
      }

      const hasContentToRestore = (
        ejectingBatch.length > 0 ||
        consumedRegistry.length > 0 ||
        getConsumedCount() > 0 ||
        targets.some(t => t.state !== 'NORMAL')
      );

      // If page is already clean, trigger subtle tactile response and return
      if (!hasContentToRestore) {
        if (typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.triggerIdlePulse) {
          SpaceBlackHoleHero3D.triggerIdlePulse();
        }
        instantRestoreAll();
        return;
      }

      isRestorationRunning = true;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = prefersReduced ? 0.20 : 1.65;

      // 3. Signal time-reversal event through BlackHoleLifecycle & HUD
      BlackHoleLifecycle.setState('RESTORING', 'TIME_REVERSAL');
      const genId = BlackHoleLifecycle.getGenerationId();
      updateTelemetryBadge();

      const bhState = (typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.getBlackHoleState)
        ? SpaceBlackHoleHero3D.getBlackHoleState()
        : { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };

      const bhX = bhState.x;
      const bhY = bhState.y;

      // 4. Subtle cinematic black hole time-reversal cues (smooth braking, inward particle flow, scale reset)
      if (typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.triggerTimeReversalSequence) {
        SpaceBlackHoleHero3D.triggerTimeReversalSequence(duration);
      }

      if (typeof PortraitDisintegrationEngine !== 'undefined' && PortraitDisintegrationEngine.triggerOrdinaryRestoration) {
        PortraitDisintegrationEngine.triggerOrdinaryRestoration(bhX, bhY);
      }

      const now = performance.now();

      // 5. Reverse released orbiting characters in ejectingBatch
      if (ejectingBatch.length > 0) {
        for (let i = 0; i < ejectingBatch.length; i++) {
          const p = ejectingBatch[i];
          p.phase = 'REVERSING';
          p.reversalStartTime = now;
          p.reversalDuration = duration;
          p.reversalFromX = p.currentX;
          p.reversalFromY = p.currentY;
          p.reversalMidX = p.currentX;
          p.reversalMidY = p.currentY;
          p.initialOmega = p.angularVelocity || 0;
        }
      }

      // 6. Restore original boxes, plinths, and items currently in flight
      targets.forEach((item, index) => {
        if (!item.element || !item.element.isConnected) return;
        if (item.state === 'CONSUMED' || item.state === 'ATTRACTING' || item.state === 'ORBITING') {
          item.state = 'RESTORING';
          item.restoreGenId = genId;
          item.restoreStartTime = now;
          item.restoreDuration = duration;

          if (item.type === 'box') {
            item.element.style.visibility = 'visible';
            item.element.style.transition = prefersReduced
              ? 'opacity 0.15s ease'
              : 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
            const delay = prefersReduced ? 0 : 200 + (index % 5) * 45;
            setTimeout(() => {
              if (BlackHoleLifecycle.isCurrentGeneration(genId) && item.element) {
                item.element.style.transform = 'translate3d(0, 0, 0) scale(1.0)';
                item.element.style.opacity = '1';
                item.element.style.pointerEvents = '';
                item.element.style.border = '';
                item.element.style.boxShadow = '';
                item.element.style.outline = '';
                item.element.style.background = '';

                if (item.element.id === 'arPortraitTerminal' || item.element.classList.contains('space-commander-terminal')) {
                  const childNodes = item.element.querySelectorAll('*');
                  childNodes.forEach(c => {
                    if (c.style) {
                      c.style.visibility = 'visible';
                      c.style.opacity = '1';
                    }
                  });
                }
              }
            }, delay);
          }
        }
      });

      // 7. For any consumed items not already in ejectingBatch (e.g. pre-destruction consumption):
      // Animate them via restoringBatch clones
      const layerFront = document.getElementById('gravityAnimationLayerFront');
      restoringBatch = [];
      const handledTargetIds = new Set();
      ejectingBatch.forEach(p => {
        if (p.entry && p.entry.targetItem) handledTargetIds.add(p.entry.targetItem.id);
      });

      consumedRegistry.forEach((entry, index) => {
        const item = entry.targetItem;
        if (!item || !item.element || !item.element.isConnected || handledTargetIds.has(item.id) || item.type === 'box') return;
        handledTargetIds.add(item.id);

        const r = item.element.getBoundingClientRect();
        item.startX = r.left;
        item.startY = r.top;

        if (item.cloneEl) {
          item.cloneEl.remove();
          item.cloneEl = null;
        }

        const clone = document.createElement('span');
        clone.className = 'gravity-flying-char gravity-debris-item gravity-debris-char';
        clone.textContent = (item.element.textContent || '').trim() || item.element.innerText || '';

        const cs = window.getComputedStyle(item.element);
        clone.style.fontFamily = cs.fontFamily;
        clone.style.fontSize = cs.fontSize;
        clone.style.fontWeight = cs.fontWeight;
        clone.style.color = cs.color;
        clone.style.position = 'fixed';
        clone.style.left = '0';
        clone.style.top = '0';
        clone.style.margin = '0';
        clone.style.pointerEvents = 'none';
        clone.style.userSelect = 'none';
        clone.style.zIndex = '52';
        clone.style.transform = `translate3d(${bhX.toFixed(1)}px, ${bhY.toFixed(1)}px, 0) scale(0.05)`;
        if (layerFront) layerFront.appendChild(clone);
        item.cloneEl = clone;

        const ejectAngle = (index * 2.3999632) % (Math.PI * 2);
        const arcDistance = 60 + (index * 11) % 90;
        item.state = 'RESTORING';
        item.restoreGenId = genId;
        item.restoreStartTime = now;
        item.restoreDuration = duration;
        item.startDx = bhX;
        item.startDy = bhY;
        item.arcDx = bhX + Math.cos(ejectAngle) * arcDistance;
        item.arcDy = bhY + Math.sin(ejectAngle) * arcDistance * 0.40;
        item.destDx = item.startX;
        item.destDy = item.startY;
        item.startRot = (Math.random() - 0.5) * 40;
        restoringBatch.push(item);
      });

      // 8. Timed completion to cleanly finalize restoration
      setTimeout(() => {
        if (BlackHoleLifecycle.is('RESTORING') || BlackHoleLifecycle.isCurrentGeneration(genId)) {
          finalizeCinematicRestoration(genId);
        }
      }, Math.round(duration * 1000 + 40));
    }

    function finalizeCinematicRestoration(genId) {
      if (!isRestorationRunning && !BlackHoleLifecycle.is('RESTORING')) return;
      if (genId && !BlackHoleLifecycle.isCurrentGeneration(genId) && !BlackHoleLifecycle.is('RESTORING')) return;
      isRestorationRunning = false;
      instantRestoreAll();
    }

    function triggerOrdinaryRestoration() {
      triggerCinematicRestoration();
    }

    function handleRestoringItem(item, dt, now) {
      if (!BlackHoleLifecycle.isCurrentGeneration(item.restoreGenId)) {
        if (item.cloneEl) {
          item.cloneEl.remove();
          item.cloneEl = null;
        }
        return;
      }

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        finalizeOrdinaryRestoration(item);
        return;
      }

      if (now < item.restoreStartTime) {
        if (item.cloneEl) {
          item.cloneEl.style.transform = `translate3d(${item.startDx.toFixed(1)}px, ${item.startDy.toFixed(1)}px, 0) scale(0.05)`;
          item.cloneEl.style.opacity = '0.2';
        }
        return;
      }

      const elapsed = (now - item.restoreStartTime) / 1000;
      const u = Math.min(1.0, elapsed / item.restoreDuration);

      if (u < 1.0) {
        let curX, curY, curRot, curScale, curOpacity;

        if (u < 0.35) {
          // Phase 1: Rapid outward acceleration from singularity to arc apex
          const t1 = u / 0.35;
          const q1 = 1.0 - Math.pow(1.0 - t1, 2.4);
          curX = item.startDx * (1.0 - q1) + item.arcDx * q1;
          curY = item.startDy * (1.0 - q1) + item.arcDy * q1;
          curRot = item.startRot * q1;
          curScale = 0.05 + (1.05 - 0.05) * q1;
          curOpacity = 0.2 + (1.0 - 0.2) * q1;
        } else {
          // Phase 2: Controlled cubic ease-out docking from apex into native destination
          const t2 = (u - 0.35) / 0.65;
          const q2 = 1.0 - Math.pow(1.0 - t2, 3.2);
          curX = item.arcDx * (1.0 - q2) + item.destDx * q2;
          curY = item.arcDy * (1.0 - q2) + item.destDy * q2;
          curRot = item.startRot * (1.0 - q2);
          curScale = 1.05 * (1.0 - q2) + 1.0 * q2;
          curOpacity = 1.0;
        }

        if (item.cloneEl) {
          if (item.isCard) {
            item.cloneEl.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) perspective(900px) rotate(${curRot.toFixed(1)}deg) scale(${curScale.toFixed(3)})`;
          } else {
            item.cloneEl.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) rotate(${curRot.toFixed(1)}deg) scale(${curScale.toFixed(3)})`;
          }
          item.cloneEl.style.opacity = curOpacity.toFixed(3);
        }
      } else {
        finalizeOrdinaryRestoration(item);
      }
    }

    function finalizeOrdinaryRestoration(item) {
      // Reached destination: clean disposal of visual clone
      if (item.cloneEl) {
        item.cloneEl.remove();
        item.cloneEl = null;
      }

      // Unhide source character in DOM
      item.element.style.opacity = '';
      item.element.style.transform = '';
      item.element.style.filter = '';
      item.element.style.textShadow = '';
      item.element.style.visibility = '';
      item.element.style.pointerEvents = '';
      item.element.style.userSelect = '';
      item.element.style.zIndex = '';
      item.element.classList.remove(
        'gravity-active',
        'gravity-consuming',
        'gravity-consumed',
        'gravity-orbit-front',
        'gravity-orbit-back',
        'gravity-scattered'
      );

      item.state = 'NORMAL';
      item.progress = 0.0;
      item.angleSwept = 0;
      item.orbitAngle = 0;
      item.isOrbitInitialized = false;

      const idx = restoringBatch.indexOf(item);
      if (idx !== -1) {
        restoringBatch.splice(idx, 1);
      }

      if (restoringBatch.length === 0) {
        if (!isRestorationRunning && BlackHoleLifecycle.is('RESTORING')) {
          BlackHoleLifecycle.setState('IDLE');
        }
        needsRectRefresh = true;
        updateTelemetryBadge();
      }
    }

    function triggerCollapseAndDestruction() {
      if (BlackHoleLifecycle.isReadyToDestroy() || BlackHoleLifecycle.isDestroying() || BlackHoleLifecycle.isRebuilding()) {
        return;
      }
      if (!BlackHoleLifecycle.canTransitionTo('READY_TO_DESTROY')) return;

      restoringBatch = [];
      rebirthingBatch = [];

      BlackHoleLifecycle.setState('READY_TO_DESTROY', 'CHARGE');
      const genId = BlackHoleLifecycle.getGenerationId();

      if (typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.triggerDestructionSequence) {
        startInwardCollapse(genId);
        SpaceBlackHoleHero3D.triggerDestructionSequence(null, genId);
        if (false) { ((cbGenId) => {
          const activeGen = cbGenId || genId;
          if (BlackHoleLifecycle.isCurrentGeneration(activeGen)) {
            startInwardCollapse(activeGen);
          }
        })(genId); }
      } else {
        startInwardCollapse(genId);
      }
    }

    function startInwardCollapse(genId) {
      if (genId && !BlackHoleLifecycle.isCurrentGeneration(genId)) return;
      BlackHoleLifecycle.setSubStage('INWARD_COLLAPSE');

      const bhState = (typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.getBlackHoleState)
        ? SpaceBlackHoleHero3D.getBlackHoleState()
        : { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };

      const now = performance.now();

      // Only accelerate letters that were ALREADY captured or in flight!
      // Do NOT scatter or clone distant uncaptured hero text across the screen.
      targets.forEach((item) => {
        if (!item.element || !item.element.isConnected) return;
        if (item.state === 'CONSUMED') return;

        if (item.type === 'box') {
          item.element.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
          item.element.style.transform = `translate3d(${(bhState.x - (item.startX || 0)) * 0.45}px, ${(bhState.y - (item.startY || 0)) * 0.45}px, 0) scale(0.04)`;
          item.element.style.opacity = '0';
          item.element.style.visibility = 'hidden';
          item.element.style.pointerEvents = 'none';
          item.state = 'CONSUMED';
          consumedRegistry.push({
            id: item.id,
            targetItem: item,
            consumedAt: Date.now(),
            type: 'box',
            isBox: true
          });
          return;
        }

        // If letter is already attracted or orbiting, rapidly accelerate inward to horizon
        if (item.state === 'ATTRACTING' || item.state === 'ORBITING') {
          item.state = 'ORBITING';
          item.orbitStartTime = now;
          item.orbitDuration = 1.2 + ((item.targetId * 7) % 4) * 0.10;
          item.orbitTotalRounds = 2.8 + ((item.targetId * 11) % 3) * 0.3;
        }
      });

      updateTelemetryBadge();
    }

    function forceAllToConsumed() {
      targets.forEach(item => {
        if (item.state !== 'CONSUMED') {
          item.state = 'CONSUMED';
          item.progress = 1.0;
          if (item.cloneEl) {
            item.cloneEl.remove();
            item.cloneEl = null;
          }
          if (item.element) {
            item.element.style.visibility = 'hidden';
            item.element.style.opacity = '0';
            item.element.style.pointerEvents = 'none';
            item.element.style.webkitMaskImage = '';
            item.element.style.maskImage = '';
          }
          const cs = (item.element && window.getComputedStyle) ? window.getComputedStyle(item.element) : null;
          consumedRegistry.push({
            id: item.id,
            targetItem: item,
            char: item.char || (item.element ? (item.element.textContent || '').trim() : '•'),
            originalStyle: {
              color: cs ? cs.color : '#f8fafc',
              fontSize: cs ? cs.fontSize : '16px',
              fontWeight: cs ? cs.fontWeight : '600',
              fontFamily: cs ? cs.fontFamily : 'inherit'
            },
            consumedAt: Date.now(),
            type: item.type || 'char',
            isBox: !!item.isBox
          });
        }
      });
      updateTelemetryBadge();
    }

    function consumeSample(count = 25) {
      let consumed = 0;
      for (let i = 0; i < targets.length && consumed < count; i++) {
        const item = targets[i];
        if (item.state !== 'CONSUMED') {
          item.state = 'CONSUMED';
          item.progress = 1.0;
          if (item.cloneEl) {
            item.cloneEl.remove();
            item.cloneEl = null;
          }
          if (item.element) {
            item.element.style.visibility = 'hidden';
            item.element.style.opacity = '0';
            item.element.style.pointerEvents = 'none';
            item.element.style.webkitMaskImage = '';
            item.element.style.maskImage = '';
          }
          const cs = (item.element && window.getComputedStyle) ? window.getComputedStyle(item.element) : null;
          consumedRegistry.push({
            id: item.id,
            targetItem: item,
            char: item.char || (item.element ? (item.element.textContent || '').trim() : '•'),
            originalStyle: {
              color: cs ? cs.color : '#f8fafc',
              fontSize: cs ? cs.fontSize : '16px',
              fontWeight: cs ? cs.fontWeight : '600',
              fontFamily: cs ? cs.fontFamily : 'inherit'
            },
            consumedAt: Date.now(),
            type: item.type || 'char',
            isBox: !!item.isBox
          });
          if (typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.onElementConsumed) {
            SpaceBlackHoleHero3D.onElementConsumed({
              type: item.type || 'char',
              angle: (consumed * 0.4),
              weight: item.isBox ? 0.02 : 0.005
            });
          }
          consumed++;
        }
      }
      updateTelemetryBadge();
      return consumed;
    }

    function triggerCosmicRebirth() {
      if (!BlackHoleLifecycle.canTransitionTo('RESTORING')) return;
      if (BlackHoleLifecycle.is('RESTORING')) return;

      BlackHoleLifecycle.setState('RESTORING');
      const genId = BlackHoleLifecycle.getGenerationId();

      // Hide floating Rebirth HUD prompt
      const rebirthPrompt = document.getElementById('cosmicRebirthPrompt');
      if (rebirthPrompt) rebirthPrompt.classList.remove('visible');

      // Reignite 3D Black Hole
      if (typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.reigniteBlackHole) {
        SpaceBlackHoleHero3D.reigniteBlackHole();
      }

      // Reassemble portrait if disintegrated
      if (typeof PortraitDisintegrationEngine !== 'undefined' && PortraitDisintegrationEngine.reigniteAndRestore) {
        PortraitDisintegrationEngine.reigniteAndRestore();
      }

      const now = performance.now();
      rebirthingBatch = [];

      targets.forEach((item, index) => {
        if (item.cloneEl || item.state === 'SCATTERED' || item.state === 'ORBITAL_GALAXY' || item.state === 'EJECTING' || item.state === 'CONSUMED' || item.isDirty) {
          item.state = 'REBIRTHING';
          item.rebirthGenId = genId;
          item.rebirthStartTime = now + Math.min(120, index * 6); // slight organic ripple
          item.rebirthDuration = 0.95; // 0.95s smooth glide

          // Freshly measure source element's current screen position in layout
          const r = item.element.getBoundingClientRect();
          item.homeScreenX = r.left;
          item.homeScreenY = r.top;

          item.fromScreenX = item.curScreenX !== undefined ? item.curScreenX : (item.destScatteredX !== undefined ? item.destScatteredX : r.left);
          item.fromScreenY = item.curScreenY !== undefined ? item.curScreenY : (item.destScatteredY !== undefined ? item.destScatteredY : r.top);
          item.fromRot = item.curRot || item.tumbleAngle || 0;
          item.fromTiltX = item.cardTiltX || 0;
          item.fromTiltY = item.cardTiltY || 0;
          item.fromScale = item.curScale || item.finalScale || 1.0;

          // If for some reason cloneEl was missing, spawn it at scattered position
          if (!item.cloneEl) {
            const layerFront = document.getElementById('gravityAnimationLayerFront');
            const clone = document.createElement('span');
            clone.className = 'gravity-flying-char gravity-debris-item gravity-debris-char';
            clone.textContent = (item.element.textContent || '').trim() || item.element.innerText || '';
            const cs = window.getComputedStyle(item.element);
            clone.style.fontFamily = cs.fontFamily;
            clone.style.fontSize = cs.fontSize;
            clone.style.fontWeight = cs.fontWeight;
            clone.style.lineHeight = cs.lineHeight;
            clone.style.letterSpacing = cs.letterSpacing;
            clone.style.color = cs.color;
            clone.style.textTransform = cs.textTransform;
            clone.style.position = 'absolute';
            clone.style.left = '0';
            clone.style.top = '0';
            clone.style.margin = '0';
            clone.style.pointerEvents = 'none';
            clone.style.userSelect = 'none';
            clone.style.zIndex = '1350';
            if (layerFront) layerFront.appendChild(clone);
            item.cloneEl = clone;
          }

          rebirthingBatch.push(item);
        }
      });

      orbitalGalaxyBatch = [];
      consumedRegistry = [];

      if (rebirthingBatch.length === 0) {
        BlackHoleLifecycle.setState('IDLE');
        updateTelemetryBadge();
        if (typeof ProjectsManager !== 'undefined' && ProjectsManager.refreshScene) {
          ProjectsManager.refreshScene();
        }
        return;
      }

      // Failsafe timeout ensuring rebirth settles to IDLE cleanly
      setTimeout(() => {
        if (BlackHoleLifecycle.isCurrentGeneration(genId) && BlackHoleLifecycle.is('RESTORING')) {
          instantRestoreAll();
        }
      }, 1600);
    }

    function handleRebirthingItem(item, dt, now) {
      if (!BlackHoleLifecycle.isCurrentGeneration(item.rebirthGenId)) {
        if (item.cloneEl) {
          item.cloneEl.remove();
          item.cloneEl = null;
        }
        return;
      }

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        finalizeItemRestoration(item);
        return;
      }

      if (now < item.rebirthStartTime) return;

      const elapsed = (now - item.rebirthStartTime) / 1000;
      const u = Math.min(1.0, elapsed / item.rebirthDuration);

      if (u < 1.0) {
        // Smooth cubic ease-in-out curve for controlled docking back to layout home (0, 0)
        const q = u < 0.5 ? 4.0 * u * u * u : 1.0 - Math.pow(-2.0 * u + 2.0, 3.0) / 2.0;

        const curX = item.fromScreenX * (1.0 - q) + item.homeScreenX * q;
        const curY = item.fromScreenY * (1.0 - q) + item.homeScreenY * q;
        const curRot = item.fromRot * (1.0 - q);
        const tiltX = item.fromTiltX * (1.0 - q);
        const tiltY = item.fromTiltY * (1.0 - q);
        const curScale = item.fromScale * (1.0 - q) + 1.0 * q;

        if (item.cloneEl) {
          if (item.isCard) {
            item.cloneEl.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) perspective(900px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) rotate(${curRot.toFixed(1)}deg) scale(${curScale.toFixed(3)})`;
          } else {
            item.cloneEl.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) rotate(${curRot.toFixed(1)}deg) scale(${curScale.toFixed(3)})`;
          }
          item.cloneEl.style.opacity = '1.0';
        }
      } else {
        finalizeItemRestoration(item);
      }
    }

    function finalizeItemRestoration(item) {
      // Cleanly remove visual clone
      if (item.cloneEl) {
        item.cloneEl.remove();
        item.cloneEl = null;
      }

      // Reset state and flags
      item.state = 'NORMAL';
      item.progress = 0.0;
      item.angleSwept = 0;
      item.orbitAngle = 0;
      item.isOrbitInitialized = false;
      item.curDx = 0;
      item.curDy = 0;
      item.curRot = 0;
      item.curScale = 1.0;
      item.curOpacity = 1.0;
      item.curBlur = 0;
      item.curSkew = 0;
      item.isDirty = false;

      // Cleanly remove all interaction state classes
      item.element.classList.remove('gravity-active', 'gravity-consuming', 'gravity-consumed', 'gravity-orbit-front', 'gravity-orbit-back', 'gravity-scattered');

      // Pristine wipe: all inline styles cleared so original CSS/typography/layout rules govern
      item.element.style.transform = '';
      item.element.style.opacity = '';
      item.element.style.filter = '';
      item.element.style.textShadow = '';
      item.element.style.visibility = '';
      item.element.style.pointerEvents = '';
      item.element.style.userSelect = '';
      item.element.style.zIndex = '';
      item.element.style.transition = '';

      const idx = rebirthingBatch.indexOf(item);
      if (idx !== -1) {
        rebirthingBatch.splice(idx, 1);
      }

      if (rebirthingBatch.length === 0) {
        const layerBack = document.getElementById('gravityAnimationLayerBack');
        const layerFront = document.getElementById('gravityAnimationLayerFront');
        if (layerBack) layerBack.innerHTML = '';
        if (layerFront) layerFront.innerHTML = '';

        // Complete restoration of photographic AR portrait
        if (typeof PortraitDisintegrationEngine !== 'undefined' && PortraitDisintegrationEngine.instantRestore) {
          PortraitDisintegrationEngine.instantRestore();
        }
        const arFrameEl = document.getElementById('arFrame');
        if (arFrameEl) {
          arFrameEl.style.transition = 'none';
          arFrameEl.style.opacity = '1';
          arFrameEl.style.transform = '';
          arFrameEl.classList.remove('grav-distorting');
        }

        needsRectRefresh = true;

        BlackHoleLifecycle.setState('IDLE');

        updateTelemetryBadge();

        if (typeof ProjectsManager !== 'undefined' && ProjectsManager.refreshScene) {
          ProjectsManager.refreshScene();
        }
      }
    }

    function restoreAll() {
      instantRestoreAll();
    }

    function restoreElement(targetIdOrElement) {
      instantRestoreAll();
    }

    return {
      init: init,
      update: update,
      registerTargets: registerTargets,
      triggerCollapseAndDestruction: triggerCollapseAndDestruction,
      triggerCinematicRestoration: triggerCinematicRestoration,
      triggerOrdinaryRestoration: triggerCinematicRestoration,
      instantRestoreAll: instantRestoreAll,
      forceAllToConsumed: forceAllToConsumed,
      consumeSample: consumeSample,
      triggerCosmicRebirth: triggerCosmicRebirth,
      triggerHeroEjection: triggerHeroEjection,
      updateTelemetryBadge: updateTelemetryBadge,
      isProtectedElement: isProtectedElement,
      isDestroyedOrVanished: () => BlackHoleLifecycle.isDestroyed() || BlackHoleLifecycle.isDestroying() || BlackHoleLifecycle.isCharging(),
      restoreAll: triggerCinematicRestoration,
      restoreElement: triggerCinematicRestoration,
      getConsumedCount: getConsumedCount,
      getTargets: () => targets,
      activateSectionConsumption: activateSectionConsumption,
      deactivateSectionConsumption: deactivateSectionConsumption,
      setInteractionOrigin: setInteractionOrigin,
      consumeSection: consumeSection,
      toggleSectionConsumption: toggleSectionConsumption,
      isSectionActive: () => isSectionInteractionActive,
      hasIndependentLoop: true,
      pause: stopEngineLoop,
      resume: startEngineLoop,
      getConsumedList: function () {
        return consumedRegistry.map(e => ({
          id: e.id,
          type: e.type,
          consumedAt: e.consumedAt,
          element: e.targetItem ? e.targetItem.element : e.element
        }));
      },
      getConsumptionScore: function () {
        const count = getConsumedCount();
        const mass = consumedRegistry.reduce((acc, e) => acc + (e.targetItem ? (e.targetItem.weight || 0.005) : 0.005), 0);
        return { count: count, mass: mass };
      }
    };
  })();

  window.GravitationalEngine = GravitationalEngine;

  // ── 02B. PROCEDURAL IMAGE FALLBACK & GUARANTEE ENGINE ──
  // Guarantees zero broken image icons can ever appear in the portfolio.
  window.handleImageError = function (imgEl, projectIdx) {
    if (!imgEl) return;
    const currentSrc = imgEl.src || '';

    // If a PNG failed to load, try corresponding SVG first
    if (currentSrc.endsWith('.png')) {
      const svgSrc = currentSrc.replace('.png', '.svg');
      imgEl.onerror = function () {
        renderProceduralFallback(imgEl, projectIdx);
      };
      imgEl.src = svgSrc;
      return;
    }

    renderProceduralFallback(imgEl, projectIdx);
  };

  function renderProceduralFallback(imgEl, projectIdx) {
    imgEl.onerror = null;
    const project = (typeof ProjectsManager !== 'undefined' && ProjectsManager.getProject)
      ? ProjectsManager.getProject(projectIdx)
      : null;
    const title = project ? project.title : 'ENGINEERING ARTIFACT';
    const index = project ? project.index : (projectIdx !== undefined ? String(projectIdx + 1).padStart(2, '0') : '01');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 750;
      const c = canvas.getContext('2d');
      if (!c) return;

      // Obsidian background
      c.fillStyle = '#0e0d14';
      c.fillRect(0, 0, 1200, 750);

      // Deep space grid
      c.strokeStyle = 'rgba(245, 158, 11, 0.12)';
      c.lineWidth = 1;
      for (let x = 0; x < 1200; x += 60) {
        c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 750); c.stroke();
      }
      for (let y = 0; y < 750; y += 60) {
        c.beginPath(); c.moveTo(0, y); c.lineTo(1200, y); c.stroke();
      }

      // Border frame
      c.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      c.lineWidth = 2;
      c.strokeRect(40, 40, 1120, 670);

      // Corner accent brackets
      c.fillStyle = '#f59e0b';
      c.fillRect(40, 40, 30, 4);
      c.fillRect(40, 40, 4, 30);
      c.fillRect(1130, 40, 30, 4);
      c.fillRect(1156, 40, 4, 30);
      c.fillRect(40, 706, 30, 4);
      c.fillRect(40, 680, 4, 30);
      c.fillRect(1130, 706, 30, 4);
      c.fillRect(1156, 680, 4, 30);

      // Title & Telemetry
      c.fillStyle = '#f59e0b';
      c.font = 'bold 20px "Space Mono", monospace';
      c.fillText(`PARTH MANDORE // SYSTEM ARTIFACT // INDEX ${index}`, 80, 110);

      c.fillStyle = '#FAF9F6';
      c.font = 'bold 44px "Syne", sans-serif';
      c.fillText(title, 80, 340);

      c.fillStyle = '#B0ADC0';
      c.font = '20px "Inter", sans-serif';
      c.fillText('Production Codebase Visual • Architectural Space Edition Preview', 80, 400);

      c.fillStyle = '#f59e0b';
      c.font = 'bold 16px "Space Mono", monospace';
      c.fillText('STATUS: TELEMETRY VERIFIED • LATENCY OPTIMAL', 80, 630);

      imgEl.src = canvas.toDataURL('image/png');
    } catch (e) {
      // Fallback silent fail
    }
  }

  // ── 03. PROJECTS EXHIBITION MANAGER (3D Spatial Revolving Engine) ──
  const ProjectsManager = (function () {
    // Genuine project records
    const projects = [
      {
        id: 'repomentor-ai',
        slug: 'repomentor-ai',
        index: '01',
        title: 'Repository Mentor AI',
        description: 'An AI-powered GitHub repository analysis platform that performs static code analysis, architecture topology detection, semantic repository search, RAG-based Q&A, security insights, and recruiter-friendly repository reports.',
        image: 'assets/repomentor.webp',
        demo: 'https://repomentor.vercel.app',
        github: 'https://github.com/parthmandore/RepoMentor-AI',
        technologies: ['FastAPI', 'Next.js', 'PostgreSQL', 'pgvector', 'Ollama', 'RAG'],
        featured: true
      },
      {
        id: 'gymbuddy-ai',
        slug: 'gymbuddy-ai',
        index: '02',
        title: 'GymBuddy AI Trainer',
        description: 'A real-time, browser-based AI personal trainer and workout tracking application using high-frequency computer vision pose tracking to monitor biomechanics, count repetitions, assess posture, and offer instant audio-visual coaching cues.',
        image: 'assets/gymbuddy.webp',
        github: 'https://github.com/parthmandore/GymBuddy-AI-Trainer',
        technologies: ['Computer Vision', 'PoseNet', 'TensorFlow.js', 'WebAudio API']
      },
      {
        id: 'career-ai-platform',
        slug: 'career-ai-platform',
        index: '03',
        title: 'Career AI Platform',
        description: 'An AI-powered career development platform that helps users analyze resumes, optimize ATS compatibility, and streamline professional workflows with automated generative insights.',
        image: 'assets/career-ai.webp',
        github: 'https://github.com/parthmandore/career-ai-platform',
        technologies: ['Generative AI', 'NLP', 'Next.js', 'RESTful APIs']
      },
      {
        id: 'mindpulse-ai',
        slug: 'mindpulse-ai',
        index: '04',
        title: 'MindPulse AI',
        description: 'Machine Learning-based burnout risk prediction and proactive wellness advisory platform predicting risk from sleep, stress, exercise, screen time, and work hours using Random Forest regression models.',
        image: 'assets/mindpulse.webp',
        github: 'https://github.com/parthmandore/MindPulse-AI',
        technologies: ['Python', 'Scikit-Learn', 'Random Forest', 'Pandas']
      },
      {
        id: 'spotify-clone',
        slug: 'spotify-clone',
        index: '05',
        title: 'Spotify Web Player Clone',
        description: 'A responsive, pixel-perfect frontend replica of the Spotify web player interface engineered for intuitive music discovery, interactive playback controls, and playlist navigation.',
        image: 'assets/spotify.webp',
        github: 'https://github.com/parthmandore/Spotify_Clone',
        technologies: ['JavaScript', 'HTML5 Audio', 'CSS Grid', 'UI Replication']
      },
      {
        id: 'url-shortener',
        slug: 'url-shortener',
        index: '06',
        title: 'URL Shortener Service',
        description: 'A high-throughput URL shortening service converting long URLs into unique short links with sub-millisecond redirection, optimized short-code generation, and clean layered architecture.',
        image: 'assets/url-shortner.webp',
        github: 'https://github.com/parthmandore/url-shortener-api',
        technologies: ['Java', 'Spring Boot', 'MySQL', 'JPA', 'REST API']
      },
      {
        id: 'gyan-app',
        slug: 'gyan-app',
        index: '07',
        title: 'Gyan — Dyslexia Support Mobile App',
        description: 'An offline-first assistive mobile learning platform designed for children with dyslexia and dysgraphia. Selected as a Top 25 National Finalist at Ideathon 2025 out of hundreds of entries across India.',
        image: 'assets/gyan.svg',
        demo: 'https://github.com/parthmandore/Gyan-Deployed',
        github: 'https://github.com/parthmandore/Gyan',
        technologies: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Speech Engine']
      }
    ];

    let cardEls = [];
    let currentProgress = 0;
    let targetProgress = 0;
    let activeCardIdx = 0;
    let scrollTriggerInstance = null;
    let is3DMode = true;

    // DOM Elements
    let stage, dossierIndex, dossierTitle, dossierDesc, dossierTags, dossierFlagship;
    let dossierDemoBtn, dossierGithubBtn, progressFill, modal;

    function init() {
      stage = document.getElementById('stage3D');
      dossierIndex = document.getElementById('dossierIndex');
      dossierTitle = document.getElementById('dossierTitle');
      dossierDesc = document.getElementById('dossierDesc');
      dossierTags = document.getElementById('dossierTags');
      dossierFlagship = document.getElementById('dossierFlagship');
      dossierDemoBtn = document.getElementById('dossierDemoBtn');
      dossierGithubBtn = document.getElementById('dossierGithubBtn');
      progressFill = document.getElementById('showcaseProgressFill');
      modal = document.getElementById('projectDetailModal');

      // Dynamic project count binding across DOM counters
      const countStr = String(projects.length).padStart(2, '0');
      const totalEl = document.getElementById('dossierTotal');
      if (totalEl) totalEl.textContent = `/ ${countStr}`;
      const numberWords = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
      const wordEl = document.getElementById('projectsCountWord');
      if (wordEl) wordEl.textContent = numberWords[projects.length] || String(projects.length);

      if (!stage) return;

      // 1. Build 3D Stage Cards
      build3DCards();

      // 2. Build Archival Grid Alternative
      buildArchivalGrid();

      // 3. 60/120fps RAF Render Loop
      startRenderLoop();

      // 4. Setup Controls and Modal
      initControls();

      // Initial Dossier State
      updateDossier(0);
    }

    function build3DCards() {
      const rotor = document.getElementById('carouselRotor');
      if (!rotor) return;
      rotor.innerHTML = '';
      cardEls = [];

      if (!projects || projects.length === 0) {
        rotor.innerHTML = `
          <div class="catalog-empty-state" role="status">
            <div class="empty-icon-glyph">∅</div>
            <div class="empty-title">NO ARTIFACTS AVAILABLE</div>
            <div class="empty-subtitle">No engineering artifacts currently match the selected criteria.</div>
          </div>
        `;
        return;
      }

      projects.forEach((p, idx) => {
        const panel = document.createElement('div');
        panel.className = 'carousel-panel';
        panel.setAttribute('data-index', idx);
        panel.setAttribute('role', 'button');
        panel.setAttribute('tabindex', '0');
        panel.setAttribute('aria-label', `Inspect project ${p.title}`);

        panel.innerHTML = `
          <div class="panel-mount-arm" aria-hidden="true">
            <span class="arm-joint"></span>
            <span class="arm-strut"></span>
          </div>
          <div class="panel-card-inner">
            <div class="panel-header-bar">
              <span class="panel-index-tag">INDEX // ${p.index}</span>
              ${p.featured ? '<span class="panel-flagship-pill">&#9670; FLAGSHIP</span>' : ''}
            </div>
            <div class="panel-viewport skeleton-shimmer">
              <img src="${p.image}" alt="${p.title}" class="panel-thumb" loading="lazy" onload="this.parentElement.classList.remove('skeleton-shimmer')" onerror="this.parentElement.classList.remove('skeleton-shimmer'); handleImageError(this, ${idx})" />
              <div class="panel-veil" aria-hidden="true"></div>
            </div>
            <div class="panel-footer-bar">
              <span class="panel-live-pip"></span>
              <span class="panel-compact-title">${p.title}</span>
              <span class="panel-inspect-cue">INSPECT &rarr;</span>
            </div>
          </div>
        `;

        panel.addEventListener('click', () => {
          const absDelta = Math.abs(idx - currentProgress);
          if (absDelta < 0.45) {
            openModal(idx);
          } else {
            scrollToProject(idx);
          }
        });

        panel.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const absDelta = Math.abs(idx - currentProgress);
            if (absDelta < 0.45) {
              openModal(idx);
            } else {
              scrollToProject(idx);
            }
          }
        });

        rotor.appendChild(panel);
        cardEls.push(panel);
      });
    }

    function buildArchivalGrid() {
      const gridContainer = document.getElementById('projectsGridContainer');
      if (!gridContainer) return;

      let html = '';
      projects.forEach((p, idx) => {
        html += `
          <article class="monograph-item">
            <div class="monograph-viewport">
              ${p.featured ? '<span class="monograph-flagship-tag">&#9670; FEATURED ARTIFACT</span>' : ''}
              <img src="${p.image}" alt="${p.title}" class="monograph-img" loading="lazy" onerror="handleImageError(this, ${idx})" />
            </div>
            <div class="monograph-details">
              <span class="monograph-index">INDEX // ${p.index}</span>
              <h3 class="monograph-title">${p.title}</h3>
              <p class="monograph-desc">${p.description}</p>
              <div class="monograph-chips">
                ${p.technologies.map(t => `<span class="monograph-chip">${t}</span>`).join('')}
              </div>
              <div class="monograph-links">
                ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener noreferrer" class="atelier-btn btn-solid btn-sm"><span>LIVE DEMO</span><span class="btn-arrow">&nearr;</span></a>` : ''}
                ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer" class="atelier-btn btn-ghost btn-sm"><span>SOURCE CODE</span><span class="btn-arrow">&nearr;</span></a>` : ''}
              </div>
            </div>
          </article>
        `;
      });
      gridContainer.innerHTML = html;
    }

    function initScrollTrigger() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

      gsap.registerPlugin(ScrollTrigger);

      // Check reduced motion preference
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setMode(false);
        return;
      }

      scrollTriggerInstance = ScrollTrigger.create({
        id: "worksShowcasePin",
        trigger: "#works",
        start: "top top",
        end: "+=2600",
        pin: true,
        pinSpacing: true,
        scrub: 0.80,
        onUpdate: (self) => {
          if (!is3DMode) return;
          targetProgress = self.progress * (projects.length - 1);
        },
        onEnter: () => {
          const pinStage = document.getElementById('works3DPin');
          if (pinStage && is3DMode) {
            pinStage.style.opacity = '1';
            pinStage.style.visibility = 'visible';
          }
        },
        onEnterBack: () => {
          const pinStage = document.getElementById('works3DPin');
          if (pinStage && is3DMode) {
            pinStage.style.opacity = '1';
            pinStage.style.visibility = 'visible';
          }
        }
      });
    }

    function startRenderLoop() {
      function tick() {
        if (is3DMode) {
          const worksEl = document.getElementById('works');
          if (worksEl) {
            const rect = worksEl.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              const diff = targetProgress - currentProgress;
              currentProgress += diff * 0.12;
              render3DScene(currentProgress);
            }
          }
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    function render3DScene(prog) {
      const count = projects.length; // 7

      // Mechanical rotation of the central structural axis shaft with depth recession (-180px)
      const axis = document.getElementById('carouselAxis');
      if (axis) {
        axis.style.transform = `translate3d(-50%, -50%, -180px) rotateY(${(-prog * 22).toFixed(1)}deg)`;
      }

      const radius = 260;
      const angleStepDeg = 360 / count; // 51.42857 deg
      const yStep = 55; // Helical step ensuring all 7 cards remain physically visible in viewport

      cardEls.forEach((panel, i) => {
        const delta = i - prog; // 0 = active
        const angleDeg = delta * angleStepDeg;
        const angleRad = angleDeg * (Math.PI / 180);

        // Cylindrical Helix coordinates
        const x = Math.sin(angleRad) * radius;
        const z = Math.cos(angleRad) * radius - radius;
        const y = delta * yStep;

        const rotY = angleDeg * 0.72;
        const rotX = -delta * 4.5;
        const absDelta = Math.abs(delta);
        const scale = Math.max(0.74, 1.0 - absDelta * 0.08);

        // Depth recession across all 7 projects (zero disappearing cards)
        let opacity, blur, zIndex;
        if (absDelta < 0.45) {
          opacity = 1.0;
          blur = 0;
          zIndex = 120;
          panel.classList.add('is-active');
        } else if (absDelta < 1.8) {
          opacity = 0.74;
          blur = 1.2;
          zIndex = 80;
          panel.classList.remove('is-active');
        } else {
          opacity = 0.42;
          blur = 2.6;
          zIndex = 40;
          panel.classList.remove('is-active');
        }

        panel.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        panel.style.opacity = opacity.toFixed(2);
        panel.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : 'none';
        panel.style.zIndex = zIndex;
        panel.style.pointerEvents = 'auto'; // All cards clickable
      });

      // Update Dossier Metadata to nearest project
      const nearestIdx = Math.max(0, Math.min(count - 1, Math.round(prog)));
      if (nearestIdx !== activeCardIdx) {
        activeCardIdx = nearestIdx;
        updateDossier(activeCardIdx);

        // Update Axis Collar illumination
        const collarEls = document.querySelectorAll('.axis-collar');
        collarEls.forEach((collar, cIdx) => {
          if (cIdx === nearestIdx) {
            collar.classList.add('is-active');
          } else {
            collar.classList.remove('is-active');
          }
        });
      }

      // Update progress bar & cue
      if (progressFill) {
        const pct = (prog / (count - 1)) * 100;
        progressFill.style.width = `${pct.toFixed(1)}%`;
      }

      const cue = document.querySelector('.scroll-instruction-cue');
      if (cue && projects[activeCardIdx]) {
        cue.textContent = `${projects[activeCardIdx].index} / ${String(count).padStart(2, '0')} • SCROLL TO REVOLVE`;
      }
    }

    function updateDossier(idx) {
      const p = projects[idx];
      if (!p) return;

      if (dossierIndex) dossierIndex.textContent = p.index;
      if (dossierTitle) {
        dossierTitle.textContent = p.title;
        if (typeof TextScrambler !== 'undefined') {
          TextScrambler.scramble(dossierTitle, p.title, 200);
        }
      }
      if (dossierDesc) dossierDesc.textContent = p.description;

      if (dossierFlagship) {
        dossierFlagship.style.display = p.featured ? 'inline-block' : 'none';
      }

      if (dossierTags) {
        dossierTags.innerHTML = p.technologies.map(t => `<span class="dossier-chip">${t}</span>`).join('');
      }

      if (dossierDemoBtn) {
        if (p.demo) {
          dossierDemoBtn.style.display = 'inline-flex';
          dossierDemoBtn.href = p.demo;
        } else {
          dossierDemoBtn.style.display = 'none';
        }
      }

      if (dossierGithubBtn) {
        if (p.github) {
          dossierGithubBtn.style.display = 'inline-flex';
          dossierGithubBtn.href = p.github;
        } else {
          dossierGithubBtn.style.display = 'none';
        }
      }
    }

    function scrollToProject(idx) {
      if (!scrollTriggerInstance) return;
      const totalScroll = scrollTriggerInstance.end - scrollTriggerInstance.start;
      const targetScroll = scrollTriggerInstance.start + (idx / (projects.length - 1)) * totalScroll;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }

    function initControls() {
      // Prev and Next Arrow Buttons
      const prevBtn = document.getElementById('showcasePrevBtn');
      const nextBtn = document.getElementById('showcaseNextBtn');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const nextIdx = Math.max(0, activeCardIdx - 1);
          scrollToProject(nextIdx);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const nextIdx = Math.min(projects.length - 1, activeCardIdx + 1);
          scrollToProject(nextIdx);
        });
      }

      // Inspect Architecture Button
      const inspectBtn = document.getElementById('dossierInspectBtn');
      if (inspectBtn) {
        inspectBtn.addEventListener('click', () => {
          openModal(activeCardIdx);
        });
      }

      // Modal Close Handlers
      const closeBtn = document.getElementById('projectModalClose');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }

      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
        });
      }

      // Keyboard Controls
      window.addEventListener('keydown', (e) => {
        if (modal && modal.classList.contains('is-open')) {
          if (e.key === 'Escape') closeModal();
          return;
        }

        // Arrow navigation when works section is in view
        const worksSec = document.getElementById('works');
        if (worksSec) {
          const rect = worksSec.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
              e.preventDefault();
              scrollToProject(Math.max(0, activeCardIdx - 1));
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
              e.preventDefault();
              scrollToProject(Math.min(projects.length - 1, activeCardIdx + 1));
            }
          }
        }
      });
    }

    function setMode(mode) {
      const worksSection = document.getElementById('works');
      const galaxyStage = document.getElementById('worksGalaxyStage');
      const pinStage = document.getElementById('works3DPin');
      const gridStage = document.getElementById('worksGridStage');
      const modeGalaxyBtn = document.getElementById('viewModeGalaxy');
      const mode3DBtn = document.getElementById('viewMode3D');
      const modeGridBtn = document.getElementById('viewModeGrid');

      if (mode === 'galaxy') {
        is3DMode = false;
        if (worksSection) {
          worksSection.classList.remove('is-grid-active');
          worksSection.classList.add('is-3d-active');
        }
        if (galaxyStage) galaxyStage.style.display = 'block';
        if (pinStage) pinStage.style.display = 'none';
        if (gridStage) gridStage.style.display = 'none';
        if (modeGalaxyBtn) modeGalaxyBtn.classList.add('active');
        if (mode3DBtn) mode3DBtn.classList.remove('active');
        if (modeGridBtn) modeGridBtn.classList.remove('active');
        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill(true);
          scrollTriggerInstance = null;
        }
        if (typeof GalaxyJourneyManager !== 'undefined' && GalaxyJourneyManager.activate) {
          GalaxyJourneyManager.activate();
        }
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      } else if (mode === 'carousel' || mode === true) {
        is3DMode = true;
        if (worksSection) {
          worksSection.classList.remove('is-grid-active');
          worksSection.classList.add('is-3d-active');
        }
        if (galaxyStage) galaxyStage.style.display = 'none';
        if (pinStage) pinStage.style.display = 'flex';
        if (gridStage) gridStage.style.display = 'none';
        if (mode3DBtn) mode3DBtn.classList.add('active');
        if (modeGalaxyBtn) modeGalaxyBtn.classList.remove('active');
        if (modeGridBtn) modeGridBtn.classList.remove('active');
        if (typeof GalaxyJourneyManager !== 'undefined' && GalaxyJourneyManager.deactivate) {
          GalaxyJourneyManager.deactivate();
        }
        if (!scrollTriggerInstance) {
          initScrollTrigger();
        } else {
          scrollTriggerInstance.enable();
        }
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      } else {
        is3DMode = false;
        if (worksSection) {
          worksSection.classList.remove('is-3d-active');
          worksSection.classList.add('is-grid-active');
        }
        if (galaxyStage) galaxyStage.style.display = 'none';
        if (pinStage) pinStage.style.display = 'none';
        if (gridStage) gridStage.style.display = 'block';
        if (modeGridBtn) modeGridBtn.classList.add('active');
        if (modeGalaxyBtn) modeGalaxyBtn.classList.remove('active');
        if (mode3DBtn) mode3DBtn.classList.remove('active');
        if (typeof GalaxyJourneyManager !== 'undefined' && GalaxyJourneyManager.deactivate) {
          GalaxyJourneyManager.deactivate();
        }
        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill(true);
          scrollTriggerInstance = null;
        }
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }

      // Re-register gravitational targets when view mode toggles dynamic elements
      if (typeof GravitationalEngine !== 'undefined' && GravitationalEngine.registerTargets) {
        setTimeout(() => GravitationalEngine.registerTargets(), 50);
      }
    }

    function openModal(idx) {
      if (typeof GalaxyJourneyManager !== 'undefined' && GalaxyJourneyManager.openModal) {
        GalaxyJourneyManager.openModal(idx);
        return;
      }
      const p = projects[idx];
      if (!p || !modal) return;

      const idxEl = document.getElementById('modalIndex');
      if (idxEl) idxEl.textContent = `INDEX // ${p.index}`;
      const catEl = document.getElementById('modalCategory');
      if (catEl) catEl.textContent = p.featured ? 'FLAGSHIP ARCHITECTURAL ARTIFACT' : 'PRODUCTION SOFTWARE SYSTEM';
      const titleEl = document.getElementById('modalTitle');
      if (titleEl) titleEl.textContent = p.title;
      const modalImg = document.getElementById('modalImg');
      if (modalImg) modalImg.src = p.image;
      const descEl = document.getElementById('modalDescription');
      if (descEl) descEl.textContent = p.description;

      const techContainer = document.getElementById('modalTechnologies');
      if (techContainer) {
        techContainer.innerHTML = p.technologies.map(t => `<span class="modal-tech-pill">${t}</span>`).join('');
      }

      const liveDemo = document.getElementById('modalLiveDemo');
      if (liveDemo) {
        liveDemo.style.display = p.demo ? 'inline-flex' : 'none';
        if (p.demo) liveDemo.href = p.demo;
      }

      const githubLink = document.getElementById('modalGithubLink');
      if (githubLink) {
        githubLink.style.display = p.github ? 'inline-flex' : 'none';
        if (p.github) githubLink.href = p.github;
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (typeof GalaxyJourneyManager !== 'undefined' && GalaxyJourneyManager.closeModal) {
        GalaxyJourneyManager.closeModal();
        return;
      }
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    return {
      init: init,
      getProjects: () => projects,
      getProject: (idx) => projects[idx],
      openModal: openModal,
      setMode: setMode,
      refreshScene: () => render3DScene(currentProgress)
    };
  })();

  // ── 04. RETICLE CURSOR ──
  const ReticleCursor = (function () {
    function init() {
      const dot = document.getElementById('reticle-dot');
      const ring = document.getElementById('reticle-ring');
      if (!dot || !ring) return;

      let mouseX = -100, mouseY = -100;
      let ringX = -100, ringY = -100;

      window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
      }, { passive: true });

      function loop() {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);

      // Expand on interactive elements
      const selector = 'a, button, input, textarea, .portrait-plinth, .monograph-item, .pillar-card, .catalog-row, .chronology-entry, .channel-row';
      const interactives = document.querySelectorAll(selector);
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
      });
    }

    return { init: init };
  })();

  // ── 05. CONTACT DISPATCH HUB ──
  const ContactHub = (function () {
    let lastSubmitTime = 0;
    const SUBMIT_COOLDOWN_MS = 15000; // 15-second throttle between submissions

    function init() {
      const form = document.getElementById('contactForm');
      const btn = document.getElementById('sendBtn');

      if (form) {
        form.addEventListener('submit', async function (e) {
          e.preventDefault();

          // 1. Anti-Spam Honeypot Check (bots fill hidden inputs; humans do not)
          const honeyField = document.getElementById('formHoney');
          if (honeyField && honeyField.value.trim() !== '') {
            console.warn('[ContactHub] Automated submission trapped by honeypot.');
            showAlert('success', 'Message dispatched successfully. I will review and reply soon.');
            form.reset();
            return;
          }

          // 2. Submission Cooldown Throttle
          const now = Date.now();
          if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
            const remaining = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSubmitTime)) / 1000);
            const cooldownMsg = `Please wait ${remaining}s before dispatching another message.`;
            showAlert('error', cooldownMsg);
            showToast(cooldownMsg, 'warning');
            return;
          }

          // 3. Field Retrieval & Sanitization
          const nameInput = document.getElementById('formName');
          const emailInput = document.getElementById('formEmail');
          const subjectInput = document.getElementById('formSubject');
          const msgInput = document.getElementById('formMsg');

          const name = nameInput ? nameInput.value.trim() : '';
          const email = emailInput ? emailInput.value.trim() : '';
          const subject = (subjectInput && subjectInput.value.trim()) ? subjectInput.value.trim() : 'Portfolio Inquiry';
          const message = msgInput ? msgInput.value.trim() : '';

          // 4. Client-side Input Validation
          if (!name || !email || !message) {
            showAlert('error', 'Please complete all required fields.');
            showToast('Please complete all required fields.', 'warning');
            return;
          }

          if (name.length < 2) {
            showAlert('error', 'Please provide a valid name (minimum 2 characters).');
            showToast('Name must be at least 2 characters.', 'warning');
            if (nameInput) nameInput.focus();
            return;
          }

          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
          if (!emailRegex.test(email)) {
            showAlert('error', 'Please provide a valid email address.');
            showToast('Please enter a valid email format.', 'warning');
            if (emailInput) emailInput.focus();
            return;
          }

          if (message.length < 10) {
            showAlert('error', 'Message is too brief. Please enter at least 10 characters.');
            showToast('Message must be at least 10 characters.', 'warning');
            if (msgInput) msgInput.focus();
            return;
          }

          btn.disabled = true;
          showAlert('sending', 'Transmitting inquiry signal...');

          try {
            const res = await fetch('https://formsubmit.co/ajax/mandoreparth14@gmail.com', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                name: name,
                email: email,
                _subject: `${subject} — from ${name}`,
                message: message,
                _honey: '',
                _template: 'table'
              })
            });

            const data = await res.json();
            if (data.success === 'true' || data.success === true) {
              lastSubmitTime = Date.now();
              showAlert('success', 'Message dispatched successfully. I will review and reply soon.');
              form.reset();
              showToast('Signal Transmitted Successfully — inquiry received.', 'success');
              if (window.PortfolioAnalytics) {
                window.PortfolioAnalytics.track('contact_form_submit', {
                  status: 'success'
                });
              }
            } else if (data.message && data.message.includes('Activation')) {
              // Provider origin activation check (requires one-time email confirmation per domain)
              showAlert('error', 'Local test origin requires FormSubmit activation. Please email mandoreparth14@gmail.com directly or submit on the live site.');
              showToast('Local origin activation pending. Please email directly.', 'info');
            } else {
              showAlert('error', 'Message could not be sent. Please email mandoreparth14@gmail.com directly.');
              showToast('Transmission rejected. Please email directly.', 'error');
            }
          } catch (err) {
            showAlert('error', 'Network error. Please email mandoreparth14@gmail.com directly.');
            showToast('Network error. Please email directly.', 'error');
          }

          btn.disabled = false;
        });
      }

      // Email Copy Button
      const copyBtn = document.getElementById('copyEmailBtn');
      if (copyBtn) {
        let copyResetTimer = null;
        copyBtn.addEventListener('click', function () {
          const email = 'mandoreparth14@gmail.com';
          const textSpan = copyBtn.querySelector('.copy-btn-text') || copyBtn.querySelector('span');
          const originalText = textSpan ? textSpan.textContent : 'COPY';

          function markCopied() {
            copyBtn.classList.add('is-copied');
            if (textSpan) textSpan.textContent = 'COPIED ✓';
            showToast('Copied to clipboard: mandoreparth14@gmail.com', 'success');

            if (copyResetTimer) clearTimeout(copyResetTimer);
            copyResetTimer = setTimeout(() => {
              copyBtn.classList.remove('is-copied');
              if (textSpan) textSpan.textContent = originalText;
            }, 2500);
          }

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(markCopied).catch(() => {
              markCopied();
            });
          } else {
            markCopied();
          }
        });
      }

      // Input focus and group focus tracking
      if (form) {
        const formInputs = form.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
          const onFocus = () => {
            input.classList.add('is-focused');
            const grp = input.closest('.form-input-group');
            if (grp) grp.classList.add('is-focused');
          };
          const onBlur = () => {
            input.classList.remove('is-focused');
            const grp = input.closest('.form-input-group');
            if (grp) grp.classList.remove('is-focused');
          };
          input.addEventListener('focus', onFocus);
          input.addEventListener('focusin', onFocus);
          input.addEventListener('blur', onBlur);
          input.addEventListener('focusout', onBlur);
        });
      }
    }

    function showAlert(type, msg) {
      const box = document.getElementById('formStatus');
      if (!box) return;
      box.className = `form-alert-box ${type}`;
      box.textContent = msg;
    }

    return { init: init };
  })();

  // ── REUSABLE ACCESSIBLE TOAST NOTIFICATION HUB ──
  const ToastHub = (function () {
    function show(msg, type = 'info', duration = 3800) {
      const container = document.getElementById('toastContainer');
      if (!container) return;

      // Limit active toasts to prevent covering controls
      while (container.children.length >= 3) {
        container.removeChild(container.firstChild);
      }

      const toast = document.createElement('div');
      const validTypes = ['success', 'error', 'warning', 'info'];
      const toastType = validTypes.includes(type) ? type : 'info';
      toast.className = `atelier-toast toast-${toastType}`;
      toast.setAttribute('role', toastType === 'error' || toastType === 'warning' ? 'alert' : 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.setAttribute('tabindex', '0');

      let iconGlyph = 'ℹ';
      if (toastType === 'success') iconGlyph = '✓';
      else if (toastType === 'error') iconGlyph = '✕';
      else if (toastType === 'warning') iconGlyph = '⚠';

      toast.innerHTML = `
        <div class="toast-content-wrap">
          <span class="toast-badge-icon" aria-hidden="true">${iconGlyph}</span>
          <span class="toast-msg-text">${msg}</span>
        </div>
        <button type="button" class="toast-dismiss-btn" aria-label="Dismiss notification">&times;</button>
      `;

      function dismiss() {
        if (!toast.parentNode) return;
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px) scale(0.96)';
        setTimeout(() => {
          if (toast.parentNode) toast.remove();
        }, 220);
      }

      const closeBtn = toast.querySelector('.toast-dismiss-btn');
      if (closeBtn) closeBtn.addEventListener('click', dismiss);

      toast.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Enter') {
          e.preventDefault();
          dismiss();
        }
      });

      container.appendChild(toast);

      if (duration > 0) {
        setTimeout(dismiss, duration);
      }
    }

    return { show: show };
  })();

  window.showToast = ToastHub.show;
  window.ToastHub = ToastHub;

  // ── 06. EDITORIAL NAVIGATION & TELEMETRY ──
  const EditorialNav = (function () {
    function initClock() {
      const clockEl = document.getElementById('footerClock');
      if (!clockEl) return;

      function update() {
        const now = new Date();
        const opts = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        clockEl.textContent = `${now.toLocaleTimeString('en-GB', opts)} IST`;
      }
      update();
      setInterval(update, 1000);
    }



    function initMobileMenu() {
      const menuBtn = document.getElementById('menuToggle');
      const navCenter = document.querySelector('.nav-center') || document.getElementById('spaceNavLinks');
      const links = document.querySelectorAll('#spaceNavLinks a, #atelier-header .atelier-nav-link, #atelier-header .nav-link');

      if (menuBtn && navCenter) {
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = navCenter.classList.toggle('open');
          menuBtn.classList.toggle('open', isOpen);
          menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Space Theme Dedicated Smooth Navigation Router with Pinned Journey Awareness
        document.querySelectorAll('#spaceNavLinks a, .brand-monogram, .footer-nav-link[href^="#"]').forEach(link => {
          link.addEventListener('click', function (e) {
            const href = this.getAttribute('href') || (this.classList.contains('brand-monogram') ? '#hero' : null);
            if (!href || !href.startsWith('#')) return;

            e.preventDefault();
            navCenter.classList.remove('open');
            menuBtn.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');

            if (window.MasterJourneyController && document.documentElement.getAttribute('data-theme') === 'space') {
              const checkpoints = {
                '#hero': 0.00,
                '#works': 0.22,
                '#disciplines': 0.85,
                '#dispatch': 0.96
              };
              if (checkpoints[href] !== undefined) {
                window.MasterJourneyController.setTargetProgress(checkpoints[href], true);
                return;
              }
            }

            if (href === '#hero') {
              if (typeof GalaxyJourney !== 'undefined' && GalaxyJourney.returnToHome) {
                GalaxyJourney.returnToHome(false);
              } else {
                window.scrollTo({ top: 0, behavior: 'auto' });
              }
            } else if (href === '#works') {
              if (typeof GalaxyJourney !== 'undefined' && GalaxyJourney.jumpToProject) {
                GalaxyJourney.jumpToProject(0, true);
              } else {
                const worksEl = document.getElementById('works');
                if (worksEl) worksEl.scrollIntoView({ behavior: 'auto' });
              }
            } else if (href === '#disciplines') {
              if (typeof GalaxyJourney !== 'undefined' && GalaxyJourney.closeSpacecraftDossier) {
                GalaxyJourney.closeSpacecraftDossier();
              }
              const st = (typeof ScrollTrigger !== 'undefined') ? ScrollTrigger.getById('galaxyJourneyPin') : null;
              const targetY = (st && typeof st.end === 'number') ? st.end + 60 : (document.getElementById('disciplines')?.offsetTop || 12000);
              if (st && typeof st.scroll === 'function') {
                st.scroll(targetY);
              }
              window.scrollTo({ top: targetY, behavior: 'auto' });
              if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.update();
              }
            } else if (href === '#dispatch') {
              if (typeof GalaxyJourney !== 'undefined' && GalaxyJourney.closeSpacecraftDossier) {
                GalaxyJourney.closeSpacecraftDossier();
              }
              const st = (typeof ScrollTrigger !== 'undefined') ? ScrollTrigger.getById('galaxyJourneyPin') : null;
              const discEl = document.getElementById('disciplines');
              const dispEl = document.getElementById('dispatch');
              const discTop = discEl?.offsetTop || 12000;
              const dispTop = dispEl?.offsetTop || 14500;
              const diff = Math.max(1200, dispTop - discTop);
              const targetY = (st && typeof st.end === 'number') ? st.end + diff : dispTop;
              if (st && typeof st.scroll === 'function') {
                st.scroll(targetY);
              }
              window.scrollTo({ top: targetY, behavior: 'auto' });
              if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.update();
              }
            }
          });
        });

        document.addEventListener('click', function (e) {
          if (navCenter.classList.contains('open') && !navCenter.contains(e.target) && !menuBtn.contains(e.target)) {
            navCenter.classList.remove('open');
            menuBtn.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      // Active Section Scroll Spy
      const sections = document.querySelectorAll('#view-space section[id]');
      function updateActiveSectionNav() {
        if (window.MasterJourneyController && document.documentElement.getAttribute('data-theme') === 'space') return;
        const vh = window.innerHeight;
        let currentActiveId = 'hero';

        if (window.scrollY < 300) {
          currentActiveId = 'hero';
        } else {
          sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            // Active when top is above 45% of viewport and bottom is below 20% of viewport
            if (rect.top <= vh * 0.45 && rect.bottom >= vh * 0.20) {
              currentActiveId = sec.getAttribute('id');
            }
          });
        }

        document.querySelectorAll('#spaceNavLinks a, #atelier-header .atelier-nav-link, #atelier-header .nav-link').forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${currentActiveId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }

      window.addEventListener('scroll', updateActiveSectionNav, { passive: true });
      updateActiveSectionNav();
    }

    return {
      init: function () {
        initClock();
        initMobileMenu();
      }
    };
  })();

  // ── 07. KINETIC TEXT SCRAMBLER ──
  const TextScrambler = (function () {
    const GLYPHS = '/\\[]_+<>01•§Δ~*';

    function scramble(element, targetText, duration = 300, onComplete) {
      if (!element) return;
      const original = targetText || element.getAttribute('data-original-text') || element.textContent.trim();
      if (!element.getAttribute('data-original-text')) {
        element.setAttribute('data-original-text', original);
      }

      if (element._scrambleAnimId) {
        cancelAnimationFrame(element._scrambleAnimId);
      }

      const length = original.length;
      const startTime = performance.now();
      element.classList.add('scramble-active');

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1.0);
        const resolvedCount = Math.floor(progress * length);

        let output = '';
        for (let i = 0; i < length; i++) {
          const char = original[i];
          if (char === ' ' || char === '\n') {
            output += char;
          } else if (i < resolvedCount) {
            output += char;
          } else {
            const randomGlyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            output += randomGlyph;
          }
        }
        element.textContent = output;

        if (progress < 1.0) {
          element._scrambleAnimId = requestAnimationFrame(tick);
        } else {
          element.textContent = original;
          element.classList.remove('scramble-active');
          element._scrambleAnimId = null;
          if (typeof onComplete === 'function') onComplete();
        }
      }

      element._scrambleAnimId = requestAnimationFrame(tick);
    }

    return { scramble: scramble };
  })();

  // ── 08. CINEMATIC TYPOGRAPHY ENGINE ──
  const TypographyMotion = (function () {
    let lastScrollY = window.pageYOffset;
    let scrollDirection = 'down';

    function init() {
      initHeroHeadline();
      initEditorialHeadings();
      initEditorialParagraphs();
      initUniversalInteractiveTokens();
      initSectionRubrics();
      initGhostWatermarks();
      initHoverScrambleTriggers();
      initScrollCoordinator();
    }

    // 1. Hero Headline Masked Entrance & Directional Drift
    function initHeroHeadline() {
      const headline = document.querySelector('.monograph-headline');
      const heroMonograph = document.querySelector('.hero-monograph');
      if (!headline) return;

      const reveal = () => {
        headline.classList.add('is-revealed');
        if (heroMonograph) heroMonograph.classList.add('is-revealed');
      };
      reveal();
      requestAnimationFrame(reveal);
    }

    // Helper: Escape HTML characters safely
    function escapeHtmlChar(c) {
      if (c === '&') return '&amp;';
      if (c === '<') return '&lt;';
      if (c === '>') return '&gt;';
      if (c === '"') return '&quot;';
      return c;
    }

    // 2. Wrap editorial headings in architectural word-masks with character-level tokens
    function initEditorialHeadings() {
      const headings = document.querySelectorAll('.editorial-heading');
      headings.forEach(heading => {
        if (heading.classList.contains('has-word-masks')) return;

        const countSpan = heading.querySelector('#projectsCountWord');
        const text = heading.textContent.trim();
        const words = text.split(/\s+/);
        let maskedHTML = '';

        words.forEach((word, idx) => {
          const delay = (0.026 * idx).toFixed(3);
          let charsHTML = '';
          for (let c = 0; c < word.length; c++) {
            charsHTML += `<span class="gravity-char">${escapeHtmlChar(word[c])}</span>`;
          }
          const wordContent = `<span class="word-mask-wrap"><span class="word-mask-inner" style="transition-delay: ${delay}s"><span class="gravity-word-wrapper">${charsHTML}</span></span></span> `;
          if (idx === 0 && countSpan) {
            maskedHTML += `<span id="projectsCountWord">${wordContent}</span>`;
          } else {
            maskedHTML += wordContent;
          }
        });

        heading.innerHTML = maskedHTML;
        heading.classList.add('has-word-masks');
      });
    }

    // 2B. Deconstruct editorial body paragraphs into consumable character tokens
    function initEditorialParagraphs() {
      const paragraphs = document.querySelectorAll(
        '.monograph-lead p, .editorial-body p, .foundation-narrative p, .dispatch-lead, .exhibition-sub, .footer-tagline, .meta-text'
      );
      paragraphs.forEach(p => {
        // Exclude discrete card containers so cards can be consumed as cohesive units
        if (p.closest('.pillar-card, .entry-card, .carousel-panel, .monograph-item, .dossier-box')) return;
        if (p.querySelector('.gravity-char')) return;

        function wrapTextNodes(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (!text || !text.trim()) return;
            const tokens = text.split(/(\s+)/);
            const frag = document.createDocumentFragment();

            tokens.forEach(tok => {
              if (!tok) return;
              if (/^\s+$/.test(tok)) {
                frag.appendChild(document.createTextNode(tok));
              } else {
                const wordWrap = document.createElement('span');
                wordWrap.className = 'gravity-word-wrapper';
                const chars = Array.from(tok);
                for (let i = 0; i < chars.length; i++) {
                  const chSpan = document.createElement('span');
                  chSpan.className = 'gravity-char';
                  chSpan.textContent = chars[i];
                  wordWrap.appendChild(chSpan);
                }
                frag.appendChild(wordWrap);
              }
            });

            node.parentNode.replaceChild(frag, node);
          } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('gravity-char') && !node.classList.contains('gravity-word-wrapper')) {
            Array.from(node.childNodes).forEach(child => wrapTextNodes(child));
          }
        }

        wrapTextNodes(p);
      });
    }

    // 2C. Universal Tokenizer: Converts text within containers into stable .gravity-word-wrapper and .gravity-char spans
    function tokenizeElementText(container) {
      if (!container) return;
      if (container.closest('#atelier-header, .atelier-nav, #navbar, nav, .theme-dropdown-wrapper, .theme-dropdown-menu, .menu-btn, .footer-nav, #spaceThemeDropdownMenu, #themeDropdownMenu, #ghNavbar')) {
        return;
      }
      if (container.querySelector && container.querySelector('.gravity-char')) return;
      if (typeof GravitationalEngine !== 'undefined' && GravitationalEngine.isProtectedElement && GravitationalEngine.isProtectedElement(container)) {
        return;
      }

      function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text || !text.trim()) return;
          const tokens = text.split(/(\s+)/);
          const frag = document.createDocumentFragment();

          tokens.forEach(tok => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) {
              frag.appendChild(document.createTextNode(tok));
            } else {
              const wordWrap = document.createElement('span');
              wordWrap.className = 'gravity-word-wrapper';
              const chars = Array.from(tok);
              for (let i = 0; i < chars.length; i++) {
                const chSpan = document.createElement('span');
                chSpan.className = 'gravity-char';
                chSpan.textContent = chars[i];
                wordWrap.appendChild(chSpan);
              }
              frag.appendChild(wordWrap);
            }
          });

          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList.contains('gravity-char') || node.classList.contains('gravity-word-wrapper')) {
            return;
          }
          if (['SVG', 'svg', 'path', 'INPUT', 'TEXTAREA', 'SCRIPT', 'STYLE'].includes(node.tagName)) {
            return;
          }
          if (node.classList.contains('devicon') || node.classList.contains('btn-arrow') || node.classList.contains('link-idx') || node.classList.contains('rubric-num')) {
            return;
          }
          Array.from(node.childNodes).forEach(child => processNode(child));
        }
      }

      processNode(container);
    }

    // 2D. Tokenize all eligible interactive text across active website sections:
    // Hero, Works (Projects), Disciplines (Skills), Dispatch (Contact), and Footer
    function initUniversalInteractiveTokens() {
      // 1. Buttons across hero section
      document.querySelectorAll('#hero .atelier-btn, #hero .btn, #hero .mode-pill').forEach(tokenizeElementText);

      // 2. Hero meta tags, lead text, monograph narrative, and meta elements
      document.querySelectorAll('#hero .monograph-lead p, #hero .meta-tag, #hero .meta-bracket, #hero .meta-caption, #hero .meta-value, #hero .meta-separator').forEach(tokenizeElementText);

      // 3. Hero role title and spatial scroll indicator
      document.querySelectorAll('#hero .space-hero-role-title, #hero .spatial-scroll-indicator .scroll-label').forEach(tokenizeElementText);

      // 4. Technology labels (Docker, Java, pgvector, FastAPI, LangGraph, Spring Boot, specs, and glyphs)
      document.querySelectorAll('#hero .orbital-tech-badge .badge-title, #hero .orbital-tech-badge .badge-spec, #hero .orbital-tech-badge .badge-glyph').forEach(tokenizeElementText);

      // 5. Tactical Commander Station / Profile identity tokens and telemetry markers
      document.querySelectorAll('#hero .ar-identity-badge .ar-id-name, #hero .ar-identity-badge .ar-id-field, #hero .ar-identity-badge .ar-id-loc, #hero .ar-hud-telemetry .hud-marker').forEach(tokenizeElementText);
    }

    function initSectionRubrics() {
      const rubrics = document.querySelectorAll('.section-rubric');
      rubrics.forEach(rubric => {
        const title = rubric.querySelector('.rubric-title');
        if (title && !title.getAttribute('data-original-text')) {
          title.setAttribute('data-original-text', title.textContent.trim());
        }
      });
    }

    // 4. Subtle Parallax Drift for Ghost Background Typography
    function initGhostWatermarks() {
      const watermarks = document.querySelectorAll('.section-ghost-watermark');
      if (watermarks.length === 0) return;

      function updateWatermarks() {
        const vh = window.innerHeight;

        watermarks.forEach(wm => {
          const section = wm.closest('section');
          if (!section) return;

          const rect = section.getBoundingClientRect();
          if (rect.top < vh + 120 && rect.bottom > -120) {
            const relY = rect.top - vh * 0.5;
            const driftY = -relY * 0.11;
            wm.style.transform = `translate3d(0, ${driftY.toFixed(1)}px, 0)`;
          }
        });
      }

      window.addEventListener('scroll', updateWatermarks, { passive: true });
      updateWatermarks();
    }

    // 5. Tactile Monospace Hover Scramble
    function initHoverScrambleTriggers() {
      const scrambleTargets = document.querySelectorAll('.meta-tag .meta-text, .rubric-title, .channel-tag, .catalog-tag, .entry-year');
      scrambleTargets.forEach(el => {
        el.style.cursor = 'default';
        el.addEventListener('mouseenter', () => {
          TextScrambler.scramble(el, null, 240);
        });
      });
    }

    // 6. Bi-Directional Scroll Coordinator with IntersectionObserver
    function initScrollCoordinator() {
      const observerOpts = {
        root: null,
        rootMargin: '-4% 0px -8% 0px',
        threshold: [0, 0.12, 0.3]
      };

      const typographyObserver = new IntersectionObserver((entries) => {
        const currentY = window.pageYOffset;
        scrollDirection = currentY >= lastScrollY ? 'down' : 'up';
        lastScrollY = currentY;

        entries.forEach(entry => {
          const el = entry.target;

          if (entry.isIntersecting) {
            if (!el.classList.contains('is-revealed')) {
              el.classList.add('is-revealed');

              if (el.classList.contains('section-rubric')) {
                const title = el.querySelector('.rubric-title');
                if (title) {
                  TextScrambler.scramble(title, null, 320);
                }
              }
              typographyObserver.unobserve(el);
            }
          }
        });
      }, observerOpts);

      const targetElements = document.querySelectorAll('.editorial-heading, .section-rubric, .editorial-body, .exhibition-sub, .dispatch-channels-card, .form-container');
      targetElements.forEach(item => {
        typographyObserver.observe(item);
      });

      // Immediate reveal on anchor clicks to avoid mid-transition traps
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
          const targetId = link.getAttribute('href');
          if (targetId && targetId !== '#') {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
              targetSection.querySelectorAll('.editorial-heading, .section-rubric, .editorial-body, .exhibition-sub').forEach(el => {
                el.classList.add('is-revealed');
              });
            }
          }
        });
      });

      // Initial check for elements already in viewport on page load
      setTimeout(() => {
        targetElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('is-revealed');
            if (el.classList.contains('section-rubric')) {
              const title = el.querySelector('.rubric-title');
              if (title) TextScrambler.scramble(title, null, 260);
            }
          }
        });
      }, 100);

      // Scroll-linked Hero Monograph drift
      const heroMonograph = document.querySelector('.hero-monograph');
      const headlinePrimary = document.querySelector('.monograph-headline .headline-primary');
      const headlineSecondary = document.querySelector('.monograph-headline .headline-secondary');

      if (heroMonograph && headlinePrimary && headlineSecondary) {
        window.addEventListener('scroll', () => {
          const scrollY = window.pageYOffset;
          if (scrollY < window.innerHeight * 1.25) {
            const p = Math.min(1.0, scrollY / window.innerHeight);
            const x1 = -p * 28;
            const x2 = p * 24;

            headlinePrimary.style.transform = `translate3d(${x1.toFixed(1)}px, 0, 0)`;
            headlineSecondary.style.transform = `translate3d(${x2.toFixed(1)}px, 0, 0)`;
            // User requirement: text continues smoothly to top of page and behind navbar
            heroMonograph.style.opacity = '1';
          } else {
            heroMonograph.style.opacity = '0';
          }
        }, { passive: true });
      }
    }

    return {
      init: init,
      tokenizeElementText: tokenizeElementText,
      initUniversalInteractiveTokens: initUniversalInteractiveTokens
    };
  })();

  // ── 09C. PERSISTENT SPACECRAFT COCKPIT CONTROLLER (Unified Space Theme) ──
  const SpaceCockpitController = (function () {
    let activeMode = null;
    let isActive = false;

    const modes = {
      hero: {
        modeKey: 'launch',
        navMode: 'MODE: LAUNCH',
        sysMode: 'SYS.NAV // LAUNCH & NAVIGATION',
        coords: 'COORD: 18.52° N • 73.85° E // ALT: 420 KM',
        sector: 'SECTOR 01 // HOME ORBITAL DOCK',
        status: 'STATUS: ESCAPE VECTORS NOMINAL',
        directorLabel: 'NAV // 00° PITCH',
        showDirector: true
      },
      works: {
        modeKey: 'projects',
        navMode: 'MODE: EXPEDITION',
        sysMode: 'SYS.FLIGHT // PLANETARY EXPEDITION',
        coords: 'SOL-7 CORRIDOR // ASTROMETRIC LOCK',
        sector: 'SECTOR 02 // EXOPLANETARY VOYAGE',
        status: 'STATUS: 7 PLANETARY TARGETS LOCKED',
        directorLabel: 'SCAN // RETICLE ACTIVE',
        showDirector: false
      },
      disciplines: {
        modeKey: 'skills',
        navMode: 'MODE: INVENTORY',
        sysMode: 'SYS.DIAG // SYSTEM INVENTORY & SCAN',
        coords: 'ASTROMETRIC GRID // 39 SUBSYSTEMS VERIFIED',
        sector: 'SECTOR 03 // TECHNICAL APPARATUS',
        status: 'STATUS: COMPILER & STACK MATRIX SYNCHRONIZED',
        directorLabel: 'DIAG // MATRIX ONLINE',
        showDirector: true
      },
      dispatch: {
        modeKey: 'contact',
        navMode: 'MODE: COMM LINK',
        sysMode: 'SYS.COMM // SUBSPACE TRANSMISSION',
        coords: 'CARRIER: 1420.405 MHz // GAIN: +18dB',
        sector: 'SECTOR 04 // DEEP-SPACE RELAY',
        status: 'STATUS: UPLINK READY • SECURE CHANNEL OPEN',
        directorLabel: 'COMM // BEAM LOCKED',
        showDirector: true
      }
    };

    function setMode(sectionId) {
      if (activeMode === sectionId) return;
      const config = modes[sectionId] || modes.hero;
      activeMode = sectionId;

      const hud = document.getElementById('spaceCockpitHud');
      if (hud) {
        hud.setAttribute('data-cockpit-mode', config.modeKey);
      }

      // Update Nav pill text
      const navModeText = document.getElementById('cockpitNavModeText');
      if (navModeText) {
        navModeText.textContent = config.navMode;
      }

      // Update Telemetry Elements
      const sysModeEl = document.getElementById('cockpitSysMode');
      const coordsEl = document.getElementById('cockpitFlightCoords');
      const sectorEl = document.getElementById('cockpitSectionLabel');
      const statusEl = document.getElementById('cockpitStatusVal');
      const directorEl = document.getElementById('cockpitTargetDirector');
      const directorLabelEl = document.getElementById('cockpitDirectorReadout');

      if (sysModeEl) sysModeEl.textContent = config.sysMode;
      if (coordsEl) coordsEl.textContent = config.coords;
      if (sectorEl) sectorEl.textContent = config.sector;
      if (statusEl) statusEl.textContent = config.status;

      if (directorEl) {
        directorEl.style.opacity = config.showDirector ? '0.36' : '0';
        directorEl.style.visibility = config.showDirector ? 'visible' : 'hidden';
      }
      if (directorLabelEl) directorLabelEl.textContent = config.directorLabel;

      // Sync active state on navbar links
      document.querySelectorAll('#spaceNavLinks a, #atelier-header .atelier-nav-link, #atelier-header .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        const isCurrent = href === `#${sectionId}`;
        link.classList.toggle('active', isCurrent);
      });
    }

    function updatePlanetaryTelemetry(planetIdx, projectData) {
      if (activeMode !== 'works') return;
      const coordsEl = document.getElementById('cockpitFlightCoords');
      const statusEl = document.getElementById('cockpitStatusVal');
      if (coordsEl && projectData) {
        const title = (projectData.title || projectData.name || 'CELESTIAL BODY').toUpperCase();
        coordsEl.textContent = `TARGET 0${planetIdx + 1}: ${title} // ORBITAL LOCK`;
      }
      if (statusEl) {
        statusEl.textContent = `STATUS: PLANETARY SCANNER OPTIMAL`;
      }
    }

    function onScroll() {
      if (document.documentElement.getAttribute('data-theme') !== 'space') return;
      if (window.MasterJourneyController) return;

      const vh = window.innerHeight;
      const scrollY = window.pageYOffset || window.scrollY;

      const st = (typeof ScrollTrigger !== 'undefined') ? ScrollTrigger.getById('galaxyJourneyPin') : null;

      let targetSection = 'hero';

      if (st && typeof st.start === 'number' && typeof st.end === 'number') {
        if (scrollY < st.start - 80) {
          targetSection = 'hero';
        } else if (scrollY >= st.start - 80 && scrollY < st.end - 50) {
          targetSection = 'works';
        } else {
          const dispEl = document.getElementById('dispatch');
          const discEl = document.getElementById('disciplines');
          const dispRect = dispEl ? dispEl.getBoundingClientRect() : null;
          const discRect = discEl ? discEl.getBoundingClientRect() : null;

          if (dispRect && dispRect.top <= vh * 0.45) {
            targetSection = 'dispatch';
          } else if (discRect && discRect.top <= vh * 0.70) {
            targetSection = 'disciplines';
          } else {
            targetSection = 'works';
          }
        }
      } else {
        if (scrollY < 300) {
          targetSection = 'hero';
        } else {
          const dispEl = document.getElementById('dispatch');
          const discEl = document.getElementById('disciplines');
          const worksEl = document.getElementById('works');

          if (dispEl && dispEl.getBoundingClientRect().top <= vh * 0.45) {
            targetSection = 'dispatch';
          } else if (discEl && discEl.getBoundingClientRect().top <= vh * 0.70) {
            targetSection = 'disciplines';
          } else if (worksEl && worksEl.getBoundingClientRect().top <= vh * 0.50) {
            targetSection = 'works';
          }
        }
      }

      setMode(targetSection);
    }

    function activate() {
      isActive = true;
      const hud = document.getElementById('spaceCockpitHud');
      if (hud) {
        hud.style.display = 'block';
        hud.style.opacity = '1';
        hud.style.visibility = 'visible';
      }
      onScroll();
    }

    function deactivate() {
      isActive = false;
      const hud = document.getElementById('spaceCockpitHud');
      if (hud) {
        hud.style.opacity = '0';
        hud.style.visibility = 'hidden';
      }
    }

    let isCockpitScrollTicking = false;
    function handleCockpitScroll() {
      if (!isCockpitScrollTicking) {
        isCockpitScrollTicking = true;
        requestAnimationFrame(() => {
          onScroll();
          isCockpitScrollTicking = false;
        });
      }
    }

    function init() {
      window.addEventListener('scroll', handleCockpitScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      activate();
    }

    return {
      init,
      activate,
      deactivate,
      setMode,
      updatePlanetaryTelemetry,
      onScroll,
      getActiveMode: () => activeMode
    };
  })();

  // ── 09. SECTION SCROLL SPY & NAVBAR SYNCHRONIZATION ──
  const SectionScrollSpy = (function () {
    const sections = ['works', 'disciplines', 'dispatch'];
    function onScroll() {
      if (document.documentElement.getAttribute('data-theme') === 'space') return;
      const scrollY = window.pageYOffset;
      const vh = window.innerHeight;
      let activeId = 'hero';
      if (scrollY >= vh * 0.45) {
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el && scrollY >= el.offsetTop - vh * 0.35) {
            activeId = id;
          }
        }
      }
      document.body.setAttribute('data-active-section', activeId);
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
      });
    }
    function init() {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      onScroll();
    }
    return { init: init };
  })();

  // ── 09B. SPACE EDITION MULTI-LAYER STARFIELD & BACKGROUND COMET ENGINE ──
  const SpaceStarfield = (function () {
    let canvas, ctx;
    let width, height;
    let stars = [];
    let comets = [];
    let isVisible = true;
    let starAnimId = null;
    let targetParallaxX = 0, targetParallaxY = 0;
    let currentParallaxX = 0, currentParallaxY = 0;
    let journeyProgress = 0.0;
    let journeyVelocity = 0.0;
    let smoothedVelocity = 0.0;
    let isJourneyMoving = false;
    let nextCometSpawnTime = Date.now() + 2500 + Math.random() * 3500;
    const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setJourneyState(prog, vel, moving) {
      journeyProgress = typeof prog === 'number' ? prog : 0.0;
      journeyVelocity = typeof vel === 'number' ? vel : 0.0;
      isJourneyMoving = Boolean(moving);
    }

    function init() {
      canvas = document.getElementById('spaceStarfield');
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      if (!ctx) return;

      onResize();
      window.addEventListener('resize', onResize, { passive: true });
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      document.addEventListener('visibilitychange', function () {
        isVisible = !document.hidden;
      });

      startRender();
    }

    function onResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createStars();
    }

    function onMouseMove(e) {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      targetParallaxX = nx;
      targetParallaxY = ny;
    }

    function createStars() {
      stars = [];
      // Layer 0: Distant micro-stars (count: ~140)
      for (let i = 0; i < 140; i++) {
        const baseAlpha = Math.random() * 0.4 + 0.2;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.65 + 0.35,
          baseAlpha: baseAlpha,
          currentAlpha: baseAlpha,
          orbitSense: Math.random() > 0.5 ? 1 : -1,
          isRespawning: false,
          respawnProgress: 1.0,
          twinkleSpeed: Math.random() * 0.02 + 0.006,
          twinklePhase: Math.random() * Math.PI * 2,
          layer: 0,
          color: '#e2ded8'
        });
      }

      // Layer 1: Midfield stars with amber/titanium tint (count: ~65)
      for (let i = 0; i < 65; i++) {
        const isAmber = Math.random() > 0.55;
        const baseAlpha = Math.random() * 0.5 + 0.35;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.85 + 0.7,
          baseAlpha: baseAlpha,
          currentAlpha: baseAlpha,
          orbitSense: Math.random() > 0.5 ? 1 : -1,
          isRespawning: false,
          respawnProgress: 1.0,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          layer: 1,
          color: isAmber ? '#f59e0b' : '#FAF9F6'
        });
      }

      // Layer 2: Cosmic dust motes drifting gently (count: ~24)
      for (let i = 0; i < 24; i++) {
        const baseAlpha = Math.random() * 0.35 + 0.25;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.3 + 1.1,
          baseAlpha: baseAlpha,
          currentAlpha: baseAlpha,
          orbitSense: Math.random() > 0.5 ? 1 : -1,
          isRespawning: false,
          respawnProgress: 1.0,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.1,
          layer: 2,
          color: Math.random() > 0.4 ? 'rgba(245, 158, 11, ' : 'rgba(226, 222, 216, '
        });
      }
    }

    // ── Spawns a subtle or foreground celestial comet with varied trajectory & dynamics ──
    function spawnComet(overrideProps = {}) {
      if (isReducedMotion) return null;
      // 70% subtle deep-space comets, 30% luminous foreground comets
      const isForeground = overrideProps.isForeground !== undefined ? overrideProps.isForeground : (Math.random() < 0.30);
      
      const speed = overrideProps.speed !== undefined 
        ? overrideProps.speed 
        : (isForeground ? (Math.random() * 4.0 + 7.0) : (Math.random() * 2.0 + 3.5));
      
      const headRadius = overrideProps.headRadius !== undefined 
        ? overrideProps.headRadius 
        : (isForeground ? (Math.random() * 0.8 + 1.5) : (Math.random() * 0.5 + 0.8));
      
      const tailLength = overrideProps.tailLength !== undefined 
        ? overrideProps.tailLength 
        : (isForeground ? (Math.random() * 80 + 180) : (Math.random() * 60 + 90));
      
      const maxAlpha = overrideProps.maxAlpha !== undefined 
        ? overrideProps.maxAlpha 
        : (isForeground ? (Math.random() * 0.22 + 0.55) : (Math.random() * 0.18 + 0.22));

      // Trajectory angle: 60% sweep top-left to bottom-right (22°–50°), 40% top-right to bottom-left (130°–158°)
      const dirSense = overrideProps.dirSense !== undefined ? overrideProps.dirSense : (Math.random() < 0.6 ? 1 : -1);
      const angleDeg = dirSense === 1 
        ? (Math.random() * 28 + 22)   // downward right
        : (Math.random() * 28 + 130); // downward left
      const angleRad = (angleDeg * Math.PI) / 180;

      const vx = Math.cos(angleRad) * speed;
      const vy = Math.sin(angleRad) * speed;

      // Start coordinate: above screen top or outside upper side borders
      let startX, startY;
      if (overrideProps.startX !== undefined && overrideProps.startY !== undefined) {
        startX = overrideProps.startX;
        startY = overrideProps.startY;
      } else if (Math.random() < 0.65) {
        startX = dirSense === 1 
          ? (Math.random() * (width * 0.75) - 40)
          : (Math.random() * (width * 0.75) + width * 0.25);
        startY = -30;
      } else {
        startX = dirSense === 1 ? -40 : (width + 40);
        startY = Math.random() * (height * 0.45);
      }

      // Celestial color: molten amber or titanium-gold
      const isAmber = Math.random() < 0.45;
      const headColor = isAmber ? 'rgba(245, 158, 11, ' : 'rgba(250, 249, 246, ';
      const tailColor = isAmber ? 'rgba(217, 119, 6, ' : 'rgba(226, 222, 216, ';

      const comet = {
        x: startX,
        y: startY,
        vx: vx,
        vy: vy,
        speed: speed,
        headRadius: headRadius,
        tailLength: tailLength,
        maxAlpha: maxAlpha,
        headColor: headColor,
        tailColor: tailColor,
        traveled: 0,
        fadeInDist: Math.min(140, tailLength * 0.8),
        isForeground: isForeground
      };

      comets.push(comet);
      return comet;
    }

    function startRender() {
      function tick() {
        requestAnimationFrame(tick);
        if (!isVisible) return;

        currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
        currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

        const isVanished = typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.isVanished && SpaceBlackHoleHero3D.isVanished();
        const bh = (!isVanished && typeof SpaceBlackHoleHero3D !== 'undefined' && SpaceBlackHoleHero3D.getBlackHoleState)
          ? SpaceBlackHoleHero3D.getBlackHoleState()
          : null;
        const bhX = bh ? bh.x : -9999;
        const bhY = bh ? bh.y : -9999;
        const bhScale = bh ? bh.scale : 0.34;
        const starGravRadius = Math.max(160, 360 * bhScale);
        const starHorizonRadius = Math.max(22, 60 * bhScale);

        ctx.clearRect(0, 0, width, height);

        // Smooth journey velocity for organic star flight
        smoothedVelocity += (journeyVelocity - smoothedVelocity) * 0.16;
        if (Math.abs(smoothedVelocity) < 0.00001) smoothedVelocity = 0.0;

        // ── 1. Render Multi-Layer Starfield ──
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.twinklePhase += s.twinkleSpeed;

          // Progressive respawn opacity ramp (prevents pop-in after horizon infall)
          if (s.isRespawning) {
            s.respawnProgress += 0.022;
            if (s.respawnProgress >= 1.0) {
              s.isRespawning = false;
              s.respawnProgress = 1.0;
            }
            s.currentAlpha = s.baseAlpha * Math.sin(s.respawnProgress * Math.PI * 0.5);
          } else {
            s.currentAlpha = s.baseAlpha;
          }

          let alpha = Math.max(0, s.currentAlpha + Math.sin(s.twinklePhase) * (s.currentAlpha * 0.35));

          // Gravitational attraction & orbital spiral around moving black hole (when hero active & settled)
          if (bh && bh.isHeroActive && bh.isSettled) {
            const dx = bhX - s.x;
            const dy = bhY - s.y;
            const dist = Math.hypot(dx, dy);

            if (dist < starGravRadius) {
              const pullFactor = Math.pow(Math.max(0, 1.0 - dist / starGravRadius), 1.2);
              const inwardSpeed = pullFactor * 4.0;
              const tangSpeed = pullFactor * 3.6 * (s.orbitSense || 1);
              const nx = dx / (dist || 1);
              const ny = dy / (dist || 1);

              // Spiral inward with relativistic orbital deflection
              s.x += nx * inwardSpeed - ny * tangSpeed;
              s.y += ny * inwardSpeed + nx * tangSpeed;

              // Smooth horizon fade-out before infall
              if (dist <= starHorizonRadius) {
                const horizonFade = Math.max(0, (dist - starHorizonRadius * 0.32) / (starHorizonRadius * 0.68));
                alpha *= horizonFade;

                // Infall into singularity: respawn outside gravity well with progressive fade-in
                if (dist <= starHorizonRadius * 0.32) {
                  const edge = Math.floor(Math.random() * 4);
                  if (edge === 0) { s.x = Math.random() * width; s.y = -20; }
                  else if (edge === 1) { s.x = width + 20; s.y = Math.random() * height; }
                  else if (edge === 2) { s.x = Math.random() * width; s.y = height + 20; }
                  else { s.x = -20; s.y = Math.random() * height; }

                  const newDx = bhX - s.x;
                  const newDy = bhY - s.y;
                  const newDist = Math.hypot(newDx, newDy);
                  if (newDist < starGravRadius + 60) {
                    const pnx = (s.x - bhX) / (newDist || 1);
                    const pny = (s.y - bhY) / (newDist || 1);
                    s.x = bhX + pnx * (starGravRadius + 80 + Math.random() * 120);
                    s.y = bhY + pny * (starGravRadius + 80 + Math.random() * 120);
                  }

                  s.isRespawning = true;
                  s.respawnProgress = 0.0;
                  s.currentAlpha = 0.0;
                  s.baseAlpha = Math.random() * 0.45 + 0.25;
                  alpha = 0.0;
                }
              }
            }
          }

          // Parallax depth multiplier and camera journey flight participation
          const depthMultiplier = s.layer === 0 ? 8 : (s.layer === 1 ? 18 : 30);
          const journeySpeed = s.layer === 0 ? 70 : (s.layer === 1 ? 190 : 380);
          let px = s.x - currentParallaxX * depthMultiplier;
          let py = s.y - currentParallaxY * depthMultiplier - (smoothedVelocity * journeySpeed);

          // Wrap around edges before gravitational deflection
          if (px < -15) px += width + 30;
          if (px > width + 15) px -= width + 30;
          if (py < -15) py += height + 30;
          if (py > height + 15) py -= height + 30;

          // Relativistic Gravitational Lensing (curved light deflection around the event horizon)
          if (bh && bh.isHeroActive) {
            const dx = px - bhX;
            const dy = py - bhY;
            const dist = Math.hypot(dx, dy);
            const einsteinR = Math.max(28, 92 * bhScale);
            const lensingBound = einsteinR * 3.2;

            if (dist < lensingBound && dist > 1.0) {
              const nx = dx / dist;
              const ny = dy / dist;
              // Einstein deflection angle creates curved apparent path
              const deflection = (einsteinR * einsteinR) / (dist + 14.0);
              // Asymmetric Kerr shear frame dragging matching disk inclination
              const kerrShear = Math.sin(Math.atan2(dy, dx) - 0.52) * (einsteinR * 0.16) * Math.exp(-dist / einsteinR);
              px += nx * deflection - ny * kerrShear;
              py += ny * deflection + nx * kerrShear;

              // Flux magnification near the Einstein ring
              const uDist = Math.max(0.15, dist / einsteinR);
              const mag = Math.min(2.2, (uDist * uDist + 2.0) / (2.0 * uDist * Math.sqrt(uDist * uDist + 4.0)));
              alpha *= mag;

              // Central black silhouette preservation: stars behind horizon are eclipsed by the void
              if (dist < starHorizonRadius * 1.05) {
                const eclipse = Math.max(0.0, (dist - starHorizonRadius * 0.70) / (starHorizonRadius * 0.35));
                alpha *= eclipse;
              }
            }
          }

          if (s.layer === 2) {
            s.x += s.vx;
            s.y += s.vy;
            if (s.x < 0) s.x += width;
            if (s.x > width) s.x -= width;
            if (s.y < 0) s.y += height;
            if (s.y > height) s.y -= height;
          }

          // Directional velocity motion streak (Phase 2.6 Requirement 4)
          const streakLen = (!isReducedMotion && Math.abs(smoothedVelocity) > 0.00015)
            ? Math.min(12, Math.abs(smoothedVelocity) * (s.layer + 1) * 320)
            : 0;

          if (streakLen > 1.2) {
            const dirY = smoothedVelocity >= 0 ? 1 : -1;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px, py - dirY * streakLen);
            ctx.lineWidth = Math.max(1, s.radius * (s.layer === 2 ? 1.0 : 0.85));
            ctx.strokeStyle = (s.layer === 2) ? s.color + alpha.toFixed(3) + ')' : s.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
            ctx.stroke();
            ctx.globalAlpha = 1;
          } else {
            ctx.beginPath();
            ctx.arc(px, py, s.radius, 0, Math.PI * 2);
            if (s.layer === 2) {
              ctx.fillStyle = s.color + alpha.toFixed(3) + ')';
              ctx.fill();
            } else {
              ctx.fillStyle = s.color;
              ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          }
        }

        // ── 2. Background Comet Spawner & Render System ──
        if (!isReducedMotion && isVisible) {
          const now = Date.now();
          if (now > nextCometSpawnTime && comets.length < 2) {
            spawnComet();
            // Variable, non-periodic next spawn interval between 4.5s and 12s
            nextCometSpawnTime = now + (4500 + Math.random() * 7500);
          }
        }

        // Render & Advance Active Comets
        for (let cIdx = comets.length - 1; cIdx >= 0; cIdx--) {
          const c = comets[cIdx];
          c.x += c.vx;
          c.y += c.vy;
          c.traveled += c.speed;

          // Smooth fade-in at birth and smooth fade-out near edges
          let fadeAlpha = 1.0;
          if (c.traveled < c.fadeInDist) {
            fadeAlpha = c.traveled / c.fadeInDist;
          }
          const edgeMargin = 100;
          if (c.x < edgeMargin || c.x > width - edgeMargin || c.y > height - edgeMargin) {
            const edgeDist = Math.min(
              c.vx < 0 ? c.x : width - c.x,
              height - c.y
            );

            fadeAlpha = Math.min(fadeAlpha, Math.max(0, edgeDist / edgeMargin));
          }

          const currentAlpha = Math.max(0, Math.min(c.maxAlpha, c.maxAlpha * fadeAlpha));

          // Draw trailing tail with linear gradient along reverse velocity vector
          const tailEndX = c.x - (c.vx / c.speed) * c.tailLength;
          const tailEndY = c.y - (c.vy / c.speed) * c.tailLength;

          const grad = ctx.createLinearGradient(c.x, c.y, tailEndX, tailEndY);
          grad.addColorStop(0, c.headColor + currentAlpha.toFixed(3) + ')');
          grad.addColorStop(0.2, c.tailColor + (currentAlpha * 0.65).toFixed(3) + ')');
          grad.addColorStop(0.65, c.tailColor + (currentAlpha * 0.22).toFixed(3) + ')');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(tailEndX, tailEndY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = c.headRadius * 1.4;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Draw luminous head core & glow
          const headGlow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.headRadius * 3.5);
          headGlow.addColorStop(0, '#FFFFFF');
          headGlow.addColorStop(0.3, c.headColor + currentAlpha.toFixed(3) + ')');
          headGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.arc(c.x, c.y, c.headRadius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = headGlow;
          ctx.fill();

          // Out of bounds check & resource cleanup
          const isOffscreen = (
            (c.vx > 0 && c.x - c.tailLength > width + 60) ||
            (c.vx < 0 && c.x + c.tailLength < -60) ||
            (c.vy > 0 && c.y - c.tailLength > height + 60)
          );

          if (isOffscreen || currentAlpha <= 0.001) {
            comets.splice(cIdx, 1);
          }
        }
      }

      starAnimId = requestAnimationFrame(tick);
    }

    return {
      init: init,
      pause: function () {
        isVisible = false;
      },
      resume: function () {
        isVisible = true;
      },
      setJourneyState: setJourneyState,
      spawnComet: spawnComet,
      getComets: () => comets
    };
  })();

  // ── PROJECT EXPERIENCE SWITCHER ──
  window.setProjectExperience = function (mode) {
    if (typeof ProjectsManager !== 'undefined' && ProjectsManager.setMode) {
      ProjectsManager.setMode(mode === 'galaxy' ? 'galaxy' : (mode === 'grid' ? 'grid' : 'carousel'));
    }
  };

  // ── 10. SKILL MATRIX & REPOSITORY INTERACTIONS ──
  const SkillInteractions = (function () {
    function init() {
      const entries = document.querySelectorAll('.skill-entry');
      if (!entries.length) return;

      entries.forEach(entry => {
        // Track pointer for subtle localized gravitational glow and 3D perspective tilt
        entry.addEventListener('pointermove', (e) => {
          const rect = entry.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
          const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
          entry.style.setProperty('--card-mx', x);
          entry.style.setProperty('--card-my', y);

          // Subtle 3D perspective tilt (-4deg to +4deg)
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          const rx = (-ny * 5).toFixed(2) + 'deg';
          const ry = (nx * 6).toFixed(2) + 'deg';
          entry.style.setProperty('--tilt-rx', rx);
          entry.style.setProperty('--tilt-ry', ry);
        }, { passive: true });

        // Reset tilt on pointer leave
        entry.addEventListener('pointerleave', () => {
          entry.style.setProperty('--tilt-rx', '0deg');
          entry.style.setProperty('--tilt-ry', '0deg');
        }, { passive: true });

        // Touch support: tap highlights the card without preventing default on repo links
        entry.addEventListener('touchstart', () => {
          entries.forEach(other => {
            if (other !== entry) other.classList.remove('is-touch-active');
          });
          entry.classList.add('is-touch-active');
        }, { passive: true });
      });

      // Clear touch focus when tapping outside
      document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.skill-entry')) {
          entries.forEach(entry => entry.classList.remove('is-touch-active'));
        }
      }, { passive: true });

      // Category filter nav tabs (Phase 2.6 Requirement 6: Display ONLY Selected Category)
      const filterNav = document.querySelector('.constellation-filter-nav');
      if (filterNav) {
        const filterBtns = filterNav.querySelectorAll('.constellation-filter-btn');
        const categoryGroups = document.querySelectorAll('.skills-category-group');

        // Initial default: Activate category 1 (Programming Languages), hide all others
        let activeCategory = 'languages';
        filterBtns.forEach((btn, idx) => {
          const cat = btn.getAttribute('data-filter');
          const isDefault = (cat === 'languages' || idx === 0);
          btn.classList.toggle('is-active', isDefault);
          btn.setAttribute('aria-selected', isDefault ? 'true' : 'false');
          if (isDefault) activeCategory = cat;
        });

        categoryGroups.forEach(group => {
          const grpCat = group.getAttribute('data-category');
          const isDefault = (grpCat === activeCategory);
          if (isDefault) {
            group.style.display = '';
            group.removeAttribute('hidden');
            group.style.opacity = '1';
            group.classList.add('is-active');
          } else {
            group.style.display = 'none';
            group.setAttribute('hidden', '');
            group.style.opacity = '0';
            group.classList.remove('is-active');
          }
        });

        filterBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetFilter = btn.getAttribute('data-filter');
            if (!targetFilter) return;

            // Clicking the active category retains it; NEVER resets to show all
            if (btn.classList.contains('is-active') && targetFilter === activeCategory) {
              return;
            }

            filterBtns.forEach(b => {
              b.classList.remove('is-active');
              b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('is-active');
            btn.setAttribute('aria-selected', 'true');
            activeCategory = targetFilter;

            categoryGroups.forEach(group => {
              const grpCat = group.getAttribute('data-category');
              if (grpCat === targetFilter) {
                group.style.display = '';
                group.removeAttribute('hidden');
                group.classList.add('skills-group-entering', 'is-active');
                void group.offsetWidth;
                group.style.opacity = '1';
                setTimeout(() => group.classList.remove('skills-group-entering'), 350);
              } else {
                group.style.opacity = '0';
                group.style.display = 'none';
                group.setAttribute('hidden', '');
                group.classList.remove('is-active', 'skills-group-entering');
              }
            });
          });
        });
      }
    }

    return {
      init: init,
      showTelemetry: function (techId) {
        if (typeof window.TechnologyConstellation !== 'undefined') {
          window.TechnologyConstellation.selectTech(techId);
        }
      },
      hideTelemetry: function () {},
      jumpToProjectPlanet: function (pIdx) {
        if (typeof window.GalaxyJourneyManager !== 'undefined' && typeof window.GalaxyJourneyManager.jumpToProject === 'function') {
          window.GalaxyJourneyManager.jumpToProject(pIdx);
        }
      }
    };
  })();

  // ── 12. PRIVACY-AWARE ANALYTICS & CONSENT SYSTEM ──
  const ConsentAndAnalyticsSystem = (function () {
    const CONSENT_STORAGE_KEY = 'portfolio_consent';
    const recentEvents = [];
    const seenEventKeys = new Map();

    // Default privacy state: strictly opt-in for analytics
    let consentState = {
      version: 1,
      essential: true,
      analytics: false,
      decided: false
    };

    function loadConsent() {
      try {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed.analytics === 'boolean' && parsed.decided) {
            consentState = parsed;
          }
        }
      } catch (e) {}
      return consentState;
    }

    function saveConsent(analyticsVal) {
      consentState = {
        version: 1,
        essential: true,
        analytics: !!analyticsVal,
        decided: true,
        timestamp: Date.now()
      };
      try {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentState));
      } catch (e) {}

      updateUI();

      if (typeof window.ToastHub !== 'undefined') {
        const msg = consentState.analytics
          ? 'Preferences Saved: Anonymous analytics enabled.'
          : 'Preferences Saved: Only strictly necessary storage active.';
        window.ToastHub.show(msg, 'info');
      }
    }

    function isDuplicateEvent(key, cooldownMs = 3000) {
      const now = Date.now();
      const last = seenEventKeys.get(key) || 0;
      if (now - last < cooldownMs) {
        return true;
      }
      seenEventKeys.set(key, now);
      // Prune old entries
      if (seenEventKeys.size > 100) {
        for (const [k, t] of seenEventKeys) {
          if (now - t > 15000) seenEventKeys.delete(k);
        }
      }
      return false;
    }

    function track(eventName, params = {}) {
      // Functional enforcement: strictly dropped if analytics consent is not granted
      if (!consentState || !consentState.analytics) {
        return false;
      }

      // Filter and sanitize params - strictly avoid any personal data
      const sanitized = {};
      const allowedKeys = ['file', 'location', 'project_title', 'project_id', 'repo', 'url', 'channel', 'status', 'view_mode'];
      for (const [k, v] of Object.entries(params)) {
        if (allowedKeys.includes(k) && typeof v === 'string') {
          sanitized[k] = v.slice(0, 150); // limit length
        }
      }

      // Event deduplication key
      const dedupeKey = `${eventName}_${JSON.stringify(sanitized)}`;
      if (isDuplicateEvent(dedupeKey)) {
        return false;
      }

      const eventRecord = {
        event: eventName,
        params: sanitized,
        timestamp: new Date().toISOString()
      };

      recentEvents.push(eventRecord);
      if (recentEvents.length > 50) recentEvents.shift();

      // Provider-neutral dispatch: if a provider (e.g. gtag or plausible) exists in future, forward event
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, sanitized);
      } else if (typeof window.plausible === 'function') {
        window.plausible(eventName, { props: sanitized });
      }

      return true;
    }

    function updateUI() {
      const banner = document.getElementById('cookieConsentBanner');
      if (banner) {
        banner.style.display = consentState.decided ? 'none' : 'block';
      }
      const toggle = document.getElementById('analyticsConsentToggle');
      if (toggle) {
        toggle.checked = !!consentState.analytics;
      }
      const statusLabel = document.getElementById('analyticsStatusLabel');
      if (statusLabel) {
        statusLabel.textContent = consentState.analytics ? 'Enabled' : 'Disabled';
        statusLabel.style.color = consentState.analytics ? 'var(--accent-amber)' : 'var(--text-muted)';
      }
    }

    let lastFocusedEl = null;

    function openModal() {
      lastFocusedEl = document.activeElement;
      const modal = document.getElementById('cookiePrefsModal');
      if (!modal) return;
      const toggle = document.getElementById('analyticsConsentToggle');
      if (toggle) {
        toggle.checked = !!consentState.analytics;
      }
      modal.style.display = 'flex';
      const closeBtn = document.getElementById('cookieModalClose');
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      const modal = document.getElementById('cookiePrefsModal');
      if (modal) {
        modal.style.display = 'none';
      }
      if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
        lastFocusedEl.focus();
      }
    }

    function setupEventListeners() {
      // Banner buttons
      const acceptAllBtn = document.getElementById('cookieAcceptAll');
      if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', () => saveConsent(true));
      }

      const rejectOptionalBtn = document.getElementById('cookieRejectOptional');
      if (rejectOptionalBtn) {
        rejectOptionalBtn.addEventListener('click', () => saveConsent(false));
      }

      const openSettingsBtn = document.getElementById('cookieOpenSettings');
      if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', openModal);
      }

      // Footer preference reopen button
      const footerPrefsBtn = document.getElementById('cookiePrefsBtn');
      if (footerPrefsBtn) {
        footerPrefsBtn.addEventListener('click', openModal);
      }

      // Modal controls
      const closeBtn = document.getElementById('cookieModalClose');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }

      const modalBackdrop = document.getElementById('cookiePrefsModal');
      if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
          if (e.target === modalBackdrop) closeModal();
        });
      }

      const saveCustomBtn = document.getElementById('cookieSaveCustom');
      if (saveCustomBtn) {
        saveCustomBtn.addEventListener('click', () => {
          const toggle = document.getElementById('analyticsConsentToggle');
          saveConsent(toggle ? toggle.checked : false);
          closeModal();
        });
      }

      const rejectAllModalBtn = document.getElementById('cookieRejectAllModal');
      if (rejectAllModalBtn) {
        rejectAllModalBtn.addEventListener('click', () => {
          saveConsent(false);
          closeModal();
        });
      }

      // Keyboard handling (ESC closes modal)
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const modal = document.getElementById('cookiePrefsModal');
          if (modal && modal.style.display !== 'none') {
            closeModal();
          }
        }
      });

      // Track conversion clicks across actual features
      // 1. Resume downloads
      document.querySelectorAll('a[href*="Parth-Mandore.pdf"]').forEach(link => {
        link.addEventListener('click', () => {
          track('resume_download', { file: 'Parth-Mandore.pdf', location: link.closest('header, main, section, footer')?.id || 'page' });
        });
      });

      // 2. Demo buttons
      const modalDemo = document.getElementById('modalLiveDemo');
      if (modalDemo) {
        modalDemo.addEventListener('click', () => {
          const title = document.getElementById('modalTitle')?.textContent || 'project';
          track('project_demo_view', { project_title: title, url: modalDemo.href });
        });
      }

      const dossierDemo = document.getElementById('dossierDemoBtn');
      if (dossierDemo) {
        dossierDemo.addEventListener('click', () => {
          const title = document.getElementById('dossierTitle')?.textContent || 'project';
          track('project_demo_view', { project_title: title, url: dossierDemo.href });
        });
      }

      // 3. GitHub repository links
      const modalGithub = document.getElementById('modalGithubLink');
      if (modalGithub) {
        modalGithub.addEventListener('click', () => {
          const title = document.getElementById('modalTitle')?.textContent || 'project';
          track('project_github_view', { project_title: title, url: modalGithub.href });
        });
      }

      const dossierGithub = document.getElementById('dossierGithubBtn');
      if (dossierGithub) {
        dossierGithub.addEventListener('click', () => {
          const title = document.getElementById('dossierTitle')?.textContent || 'project';
          track('project_github_view', { project_title: title, url: dossierGithub.href });
        });
      }

      // 4. Contact channel links
      document.querySelectorAll('.channel-main-link').forEach(link => {
        link.addEventListener('click', () => {
          const channel = link.href.includes('linkedin') ? 'linkedin' : link.href.includes('github') ? 'github' : 'external';
          track('contact_channel_click', { channel: channel });
        });
      });
    }

    function init() {
      loadConsent();
      updateUI();
      setupEventListeners();
    }

    return {
      init: init,
      track: track,
      hasConsent: function () { return !!consentState.analytics; },
      getConsentState: function () { return Object.assign({}, consentState); },
      setConsent: function (state) {
        consentState = Object.assign({}, consentState, state);
        try { localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentState)); } catch (e) {}
        updateUI();
      },
      getRecentEvents: function () { return recentEvents.slice(); },
      showPreferences: openModal,
      clearEvents: function () { recentEvents.length = 0; }
    };
  })();

  // ── 11. BOOTSTRAP ──
  function bootPortfolio() {
    SpaceBlackHoleHero3D.init();
    PortraitDisintegrationEngine.init();
    ARPortraitInteraction.init();
    TypographyMotion.init();
    GravitationalEngine.init();
    ProjectsManager.init();

    // Initialize Cinematic 3D Galaxy Project Exhibition
    const galaxyContainer = document.getElementById('worksGalaxyStage');
    if (typeof GalaxyJourneyManager !== 'undefined' && galaxyContainer) {
      GalaxyJourneyManager.init(galaxyContainer);
      // Activate Galaxy Journey as primary 3D exhibition by default
      if (ProjectsManager && ProjectsManager.setMode) {
        ProjectsManager.setMode('galaxy');
      }
    }

    SkillInteractions.init();
    ReticleCursor.init();
    ContactHub.init();
    EditorialNav.init();
    SpaceStarfield.init();
    ConsentAndAnalyticsSystem.init();
    SectionScrollSpy.init();
    SpaceCockpitController.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPortfolio);
  } else {
    bootPortfolio();
  }

  // Global access for interaction testing and browser devtools
  window.SpaceBlackHoleHero3D = SpaceBlackHoleHero3D;
  window.BlackHoleLifecycle = BlackHoleLifecycle;
  window.GravitationalEngine = GravitationalEngine;
  window.PortraitDisintegrationEngine = PortraitDisintegrationEngine;
  window.SkillInteractions = SkillInteractions;
  window.SpaceStarfield = SpaceStarfield;
  window.PortfolioAnalytics = ConsentAndAnalyticsSystem;
  window.SpaceCockpitController = SpaceCockpitController;
  if (typeof GalaxyJourneyManager !== 'undefined') window.GalaxyJourneyManager = GalaxyJourneyManager;

})();


// ═══════════════════════════════════════════════════════════════════
// GRAND UNIFIED FOUR-THEME CONTROLLER (Dark, Light, Space, Netflix)
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  const VALID_THEMES = ['dark', 'light', 'space', 'netflix'];
  const THEME_STORAGE_KEY = 'parth_portfolio_theme';
  let currentTheme = 'space';

  const themeIcons = {
    dark: '🌙',
    light: '☀️',
    space: '🌌',
    netflix: '🎬'
  };

  const themeLabels = {
    dark: 'Dark',
    light: 'Light',
    space: 'Space',
    netflix: 'Netflix Version'
  };


  // ═══════════════════════════════════════════════════════════════════
  // SPACE THEME CINEMATIC INTRO CONTROLLER
  // ═══════════════════════════════════════════════════════════════════
  const SpaceIntroController = (function () {
    let isPlaying = false;
    let animFrameId = null;
    let timers = [];
    let stars = [];

    function clearAllTimers() {
      timers.forEach(t => clearTimeout(t));
      timers = [];
    }

    function initStarfield(canvas) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width = window.innerWidth;
      const height = canvas.height = window.innerHeight;

      stars = [];
      const count = Math.min(120, Math.max(50, Math.floor((width * height) / 10000)));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.3 + 0.4,
          alpha: Math.random() * 0.7 + 0.2,
          phase: Math.random() * Math.PI * 2,
          isAmber: Math.random() > 0.85
        });
      }

      const startTime = performance.now();
      function render(now) {
        if (!isPlaying) return;
        ctx.clearRect(0, 0, width, height);
        const elapsed = (now - startTime) / 1000;

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          const twinkle = Math.sin(elapsed * 2.8 + s.phase) * 0.22;
          const currentAlpha = Math.max(0.12, Math.min(1, s.alpha + twinkle));
          ctx.fillStyle = s.isAmber
            ? `rgba(245, 158, 11, ${currentAlpha})`
            : `rgba(250, 249, 246, ${currentAlpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }

        animFrameId = requestAnimationFrame(render);
      }

      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(render);
    }

    function play(opts = {}) {
      const overlay = document.getElementById('spaceIntroOverlay');
      if (!overlay) return;

      // Never display intro if current theme is not space
      if (document.documentElement.getAttribute('data-theme') !== 'space') {
        abort();
        return;
      }

      if (isPlaying && !opts.force) return;
      if (isPlaying && opts.force) {
        clearAllTimers();
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      }
      isPlaying = true;

      clearAllTimers();
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }

      // Step 1: Screen begins pitch black
      overlay.classList.remove('stars-visible', 'telemetry-visible', 'title-visible', 'sweep-active', 'glow-visible');
      overlay.style.transition = 'none';
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
      overlay.style.display = 'flex';
      overlay.setAttribute('aria-hidden', 'false');
      overlay.classList.add('is-active');

      const progressFill = document.getElementById('introProgressFill');
      const progressPct = document.getElementById('introProgressPct');
      if (progressFill) progressFill.style.width = '0%';
      if (progressPct) progressPct.textContent = '0%';

      // Handle reduced motion preference
      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        timers.push(setTimeout(() => { complete(); }, 200));
        return;
      }

      // Initialize starfield canvas
      const canvas = document.getElementById('spaceIntroStars');
      initStarfield(canvas);

      // Step 2 (80ms): Small stars gradually become visible
      timers.push(setTimeout(() => {
        if (!isPlaying) return;
        overlay.classList.add('stars-visible');
      }, 80));

      // Step 3 (200ms): Navigation telemetry & reticle initialize
      timers.push(setTimeout(() => {
        if (!isPlaying) return;
        overlay.classList.add('telemetry-visible', 'glow-visible');
      }, 200));

      // Step 4 (380ms): Title appears with cinematic reveal & progress bar fills
      timers.push(setTimeout(() => {
        if (!isPlaying) return;
        overlay.classList.add('title-visible');

        const progStart = performance.now();
        const progDuration = 560; // 380ms -> 940ms
        function updateProgress(now) {
          if (!isPlaying) return;
          const prog = Math.min(1, (now - progStart) / progDuration);
          const easeProg = 1 - Math.pow(1 - prog, 3);
          const pct = Math.floor(easeProg * 100);
          if (progressFill) progressFill.style.width = `${pct}%`;
          if (progressPct) progressPct.textContent = `${pct}%`;
          if (prog < 1) {
            requestAnimationFrame(updateProgress);
          }
        }
        requestAnimationFrame(updateProgress);
      }, 380));

      // Step 5 (720ms): Subtle light sweep passes across
      timers.push(setTimeout(() => {
        if (!isPlaying) return;
        overlay.classList.add('sweep-active');
      }, 720));

      // Step 6 (1100ms): Introduction fades smoothly into existing space home page
      timers.push(setTimeout(() => {
        if (!isPlaying) return;
        overlay.style.transition = 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        overlay.style.opacity = '0';
      }, 1100));

      // Conclusion (1460ms): Clean up and fully deactivate overlay (~1.46s total)
      timers.push(setTimeout(() => {
        complete();
      }, 1460));

      // Hard safety timer (1750ms): Guaranteed never to exceed 2 seconds or leave page stuck
      timers.push(setTimeout(() => {
        if (isPlaying) {
          complete();
        }
      }, 1750));
    }

    function complete() {
      isPlaying = false;
      clearAllTimers();
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }

      const overlay = document.getElementById('spaceIntroOverlay');
      if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.classList.remove('is-active', 'stars-visible', 'telemetry-visible', 'title-visible', 'sweep-active', 'glow-visible');
      }
    }

    function abort() {
      complete();
    }

    return {
      play: play,
      abort: abort,
      complete: complete,
      isPlaying: () => isPlaying
    };
  })();

  window.SpaceIntroController = SpaceIntroController;
  window.playSpaceIntro = (opts) => SpaceIntroController.play(opts || { force: true });

  function getSavedTheme() {
    try {
      const urlParam = new URLSearchParams(window.location.search).get('theme');
      if (urlParam) {
        const lp = urlParam.toLowerCase();
        if (VALID_THEMES.includes(lp)) return lp;
        if (lp === 'purple') return 'dark';
        if (lp === 'newsletter') return 'light';
      }

      const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem('theme');
      if (saved) {
        const ls = saved.toLowerCase();
        if (VALID_THEMES.includes(ls)) return ls;
        if (ls === 'purple') return 'dark';
        if (ls === 'newsletter') return 'light';
      }
    } catch (e) {}
    return 'space';
  }

  function applyThemeDOM(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Synchronize all dropdown trigger icons and labels across views
    const triggers = document.querySelectorAll('.theme-dropdown-trigger');
    triggers.forEach(trigger => {
      const icon = trigger.querySelector('.theme-trigger-icon');
      const label = trigger.querySelector('.theme-trigger-label');
      if (icon) icon.textContent = themeIcons[theme] || '🌌';
      if (label) label.textContent = themeLabels[theme] || 'Space';
    });

    // Synchronize all dropdown list items
    const items = document.querySelectorAll('.theme-dropdown-item');
    items.forEach(item => {
      const val = item.getAttribute('data-theme-val');
      const isSelected = val === theme;
      item.classList.toggle('active', isSelected);
      item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    // View Container management
    const viewGithub = document.getElementById('view-github');
    const viewSpace = document.getElementById('view-space');
    const viewNetflix = document.getElementById('view-netflix');
    const netflixFrame = document.getElementById('netflixPortfolioFrame');

    if (theme === 'dark' || theme === 'light') {
      if (window.SpaceIntroController) window.SpaceIntroController.abort();
      if (viewGithub) {
        viewGithub.style.display = 'block';
        viewGithub.setAttribute('aria-hidden', 'false');
      }
      if (viewSpace) {
        viewSpace.style.display = 'none';
        viewSpace.setAttribute('aria-hidden', 'true');
      }
      if (viewNetflix) {
        viewNetflix.style.display = 'none';
        viewNetflix.setAttribute('aria-hidden', 'true');
      }

      // Suspend Space journey controller to halt scroll RAF & listeners
      if (window.MasterJourneyController && typeof window.MasterJourneyController.suspend === 'function') {
        window.MasterJourneyController.suspend();
      }
      // Pause Space animations to reduce CPU/GPU
      if (window.SpaceBlackHoleHero3D && window.SpaceBlackHoleHero3D.pause) {
        window.SpaceBlackHoleHero3D.pause();
      }
      if (window.SpaceStarfield && window.SpaceStarfield.pause) {
        window.SpaceStarfield.pause();
      }
      if (window.GravitationalEngine && window.GravitationalEngine.pause) {
        window.GravitationalEngine.pause();
      }
      if (window.GalaxyJourneyManager && window.GalaxyJourneyManager.deactivate) {
        window.GalaxyJourneyManager.deactivate();
      }
      if (window.SpaceCockpitController && window.SpaceCockpitController.deactivate) {
        window.SpaceCockpitController.deactivate();
      }

      // Re-trigger GitHub portfolio init, typewriter, and counters
      if (window.GitHubPortfolio) {
        if (window.GitHubPortfolio.init) {
          window.GitHubPortfolio.init();
        }
        if (window.GitHubPortfolio.startTyping) {
          window.GitHubPortfolio.startTyping();
        }
        if (window.GitHubPortfolio.resetStats) {
          window.GitHubPortfolio.resetStats();
        }
      }
    } else if (theme === 'space') {
      if (viewSpace) {
        viewSpace.style.display = 'block';
        viewSpace.setAttribute('aria-hidden', 'false');
      }
      if (viewGithub) {
        viewGithub.style.display = 'none';
        viewGithub.setAttribute('aria-hidden', 'true');
      }
      if (viewNetflix) {
        viewNetflix.style.display = 'none';
        viewNetflix.setAttribute('aria-hidden', 'true');
      }

      // Resume Space animations
      // Resume Space journey controller
      if (window.MasterJourneyController && typeof window.MasterJourneyController.resume === 'function') {
        window.MasterJourneyController.resume();
      }
      if (window.SpaceBlackHoleHero3D && window.SpaceBlackHoleHero3D.resume) {
        window.SpaceBlackHoleHero3D.resume();
      }
      if (window.SpaceStarfield && window.SpaceStarfield.resume) {
        window.SpaceStarfield.resume();
      }
      if (window.GravitationalEngine && window.GravitationalEngine.resume) {
        window.GravitationalEngine.resume();
      }
      if (window.GalaxyJourneyManager && window.GalaxyJourneyManager.activate) {
        window.GalaxyJourneyManager.activate();
      }
      if (window.SpaceCockpitController && window.SpaceCockpitController.activate) {
        window.SpaceCockpitController.activate();
      }
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
      if (window.SpaceIntroController) {
        window.SpaceIntroController.play();
      }
    } else if (theme === 'netflix') {
      if (window.SpaceIntroController) window.SpaceIntroController.abort();
      if (viewNetflix) {
        viewNetflix.style.display = 'block';
        viewNetflix.setAttribute('aria-hidden', 'false');
      }
      if (viewGithub) {
        viewGithub.style.display = 'none';
        viewGithub.setAttribute('aria-hidden', 'true');
      }
      if (viewSpace) {
        viewSpace.style.display = 'none';
        viewSpace.setAttribute('aria-hidden', 'true');
      }

      // Suspend Space journey controller
      if (window.MasterJourneyController && typeof window.MasterJourneyController.suspend === 'function') {
        window.MasterJourneyController.suspend();
      }
      // Pause Space animations
      if (window.SpaceBlackHoleHero3D && window.SpaceBlackHoleHero3D.pause) {
        window.SpaceBlackHoleHero3D.pause();
      }
      if (window.SpaceStarfield && window.SpaceStarfield.pause) {
        window.SpaceStarfield.pause();
      }
      if (window.GravitationalEngine && window.GravitationalEngine.pause) {
        window.GravitationalEngine.pause();
      }
      if (window.GalaxyJourneyManager && window.GalaxyJourneyManager.deactivate) {
        window.GalaxyJourneyManager.deactivate();
      }

      // Ensure netflix iframe is loaded and notify iframe of theme
      if (netflixFrame) {
        if (!netflixFrame.getAttribute('src') || netflixFrame.getAttribute('src') === 'about:blank') {
          netflixFrame.setAttribute('src', 'netflix-version/index.html');
        }
        if (netflixFrame.contentWindow) {
          netflixFrame.contentWindow.postMessage({ type: 'SET_THEME', theme: 'netflix' }, '*');
        }
      }
    }
  }

  function setTheme(newTheme) {
    if (!VALID_THEMES.includes(newTheme)) {
      newTheme = 'space';
    }
    currentTheme = newTheme;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      localStorage.setItem('theme', newTheme);
    } catch (e) {}

    applyThemeDOM(newTheme);

    // Broadcast to any embedded frames
    const netflixFrame = document.getElementById('netflixPortfolioFrame');
    if (netflixFrame && netflixFrame.contentWindow) {
      netflixFrame.contentWindow.postMessage({ type: 'SET_THEME', theme: newTheme }, '*');
    }
  }

  function initDropdown() {
    const wrappers = document.querySelectorAll('.theme-dropdown-wrapper');
    wrappers.forEach(wrapper => {
      const trigger = wrapper.querySelector('.theme-dropdown-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = wrapper.classList.toggle('open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      const items = wrapper.querySelectorAll('.theme-dropdown-item');
      items.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetTheme = item.getAttribute('data-theme-val');
          if (targetTheme) {
            setTheme(targetTheme);
            wrapper.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
          }
        });

        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const targetTheme = item.getAttribute('data-theme-val');
            if (targetTheme) {
              setTheme(targetTheme);
              wrapper.classList.remove('open');
              trigger.setAttribute('aria-expanded', 'false');
            }
          }
        });
      });
    });

    document.addEventListener('click', (e) => {
      wrappers.forEach(wrapper => {
        if (!wrapper.contains(e.target)) {
          wrapper.classList.remove('open');
          const trigger = wrapper.querySelector('.theme-dropdown-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        wrappers.forEach(wrapper => {
          if (wrapper.classList.contains('open')) {
            wrapper.classList.remove('open');
            const trigger = wrapper.querySelector('.theme-dropdown-trigger');
            if (trigger) {
              trigger.setAttribute('aria-expanded', 'false');
              trigger.focus();
            }
          }
        });
      }
    });

    // Listen for postMessage from Netflix iframe
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SET_THEME') {
        const receivedTheme = event.data.theme;
        if (VALID_THEMES.includes(receivedTheme)) {
          setTheme(receivedTheme);
        }
      }
    });
  }

  function init() {
    currentTheme = getSavedTheme();
    initDropdown();
    applyThemeDOM(currentTheme);

    // Initialize GitHub view
    if (window.GitHubPortfolio && window.GitHubPortfolio.init) {
      window.GitHubPortfolio.init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ThemeManager = {
    init: init,
    setTheme: setTheme,
    getTheme: () => currentTheme
  };

  window.setTheme = function (theme) {
    setTheme(theme);
  };

  window.switchTheme = function (theme) {
    setTheme(theme);
  };
})();



// ── 3D CELESTIAL TACTICAL SPHERE & ASTROLABE (Space Hero Right Zone) ──
(function initCelestialHolosphere() {
  function setup() {
    const canvas = document.getElementById('celestialHolosphereCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const width = 300;
    const height = 300;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const group = new THREE.Group();
    scene.add(group);

    // 1. Outer Wireframe Meridian Sphere (Amber)
    const sphereGeo = new THREE.SphereGeometry(1.25, 20, 20);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphereMesh);

    // 2. Inner Glowing Core Points (Gold)
    const coreGeo = new THREE.SphereGeometry(0.75, 24, 24);
    const coreMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.035,
      transparent: true,
      opacity: 0.85
    });
    const corePoints = new THREE.Points(coreGeo, coreMat);
    group.add(corePoints);

    // 3. Astrolabe Gimbal Rings (Inclined Orbits)
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.65 });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.5 });
    
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.018, 12, 64), ringMat1);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.015, 12, 64), ringMat2);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    let mouseX = 0, mouseY = 0;
    window.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      mouseX = (e.clientX - cx) * 0.0015;
      mouseY = (e.clientY - cy) * 0.0015;
    }, { passive: true });

    function animate() {
      requestAnimationFrame(animate);
      if (document.documentElement.getAttribute('data-theme') !== 'space') return;

      sphereMesh.rotation.y += 0.006;
      corePoints.rotation.y -= 0.004;
      ring1.rotation.z += 0.008;
      ring2.rotation.x += 0.007;

      group.rotation.x += (mouseY - group.rotation.x) * 0.05;
      group.rotation.y += (mouseX - group.rotation.y) * 0.05;

      renderer.render(scene, camera);
    }
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setTimeout(setup, 100);
  }
})();
