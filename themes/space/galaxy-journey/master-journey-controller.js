/**
 * ============================================================================
 * MASTER JOURNEY CONTROLLER (Phase 1: Viewport Rigging & Master Scroll Spine)
 * Space Journey Continuous 3D Portfolio Architecture
 * ============================================================================
 * 
 * Provides the single authoritative spine for the continuous galaxy flight.
 * Computes normalized progress t in [0.0, 1.0] across all 5 spatial sectors:
 *   - Sector 01: Singularity Core (0.00 <= t < 0.18)
 *   - Sector 02: Sol-7 Corridor    (0.18 <= t < 0.65)
 *   - Sector 03: Interstellar Void (0.65 <= t < 0.75)
 *   - Sector 04: Constellation Belt(0.75 <= t < 0.90)
 *   - Sector 05: Beacon Nexus      (0.90 <= t <= 1.00)
 * 
 * Input isolation guarantees:
 *   - Black hole dragging locks journey progress.
 *   - Project dossier scrolling is isolated and does not advance the camera.
 *   - Detail modals lock journey scroll.
 *   - Motion uses critical damping with strict deadband snap (no infinite crawling).
 */

(function (window, document) {
  'use strict';

  // Sector Definitions (Phase 3 Exact Canonical HUD Modes)
  const SECTORS = [
    { 
      id: 1, 
      name: '01 // SINGULARITY APPROACH', 
      hudMode: 'SINGULARITY APPROACH',
      range: [0.00, 0.18], 
      checkpoint: 0.00,
      navModeKey: 'launch',
      sysMode: 'SYS.NAV // SINGULARITY APPROACH',
      coords: 'COORD: 18.52° N • 73.85° E // ALT: 420 KM',
      status: 'STATUS: ESCAPE VECTORS NOMINAL',
      directorLabel: 'NAV // 00° PITCH',
      showDirector: true,
      desc: 'Gravitational Singularity & Hero Deck' 
    },
    { 
      id: 2, 
      name: '02 // SOL-7 PLANETARY SURVEY', 
      hudMode: 'SOL-7 PLANETARY SURVEY',
      range: [0.18, 0.58], 
      checkpoint: 0.205,
      navModeKey: 'projects',
      sysMode: 'SYS.FLIGHT // SOL-7 PLANETARY SURVEY',
      coords: 'SOL-7 CORRIDOR // ASTROMETRIC LOCK',
      status: 'STATUS: 7 PLANETARY TARGETS LOCKED',
      directorLabel: 'SCAN // RETICLE ACTIVE',
      showDirector: false,
      desc: '7 Planetary Project Encounters' 
    },
    { 
      id: 3, 
      name: '03 // INTERSTELLAR VOID TRANSIT', 
      hudMode: 'INTERSTELLAR VOID TRANSIT',
      range: [0.58, 0.65], 
      checkpoint: 0.635,
      navModeKey: 'transit',
      sysMode: 'SYS.VOID // INTERSTELLAR VOID TRANSIT',
      coords: 'DEEP SPACE VOID // RANGE: 42,000 AU',
      status: 'STATUS: CONSTELLATION FIELD ACQUIRED',
      directorLabel: 'TRANSIT // WARP VECTOR',
      showDirector: true,
      desc: 'Relativistic Departure Corridor & Field Discovery' 
    },
    { 
      id: 4, 
      name: '04 // ASTROMETRIC INVENTORY SCAN', 
      hudMode: 'ASTROMETRIC INVENTORY SCAN',
      range: [0.65, 0.92], 
      checkpoint: 0.670,
      navModeKey: 'skills',
      sysMode: 'SYS.DIAG // ASTROMETRIC INVENTORY SCAN',
      coords: 'ASTROMETRIC GRID // 39 SUBSYSTEMS VERIFIED',
      status: 'STATUS: COMPILER & STACK MATRIX SYNCHRONIZED',
      directorLabel: 'DIAG // MATRIX ONLINE',
      showDirector: false,
      desc: '7 Continuous Astrometric Technology Constellations' 
    },
    { 
      id: 5, 
      name: '05 // BEACON NEXUS TRANSMISSION', 
      hudMode: 'BEACON NEXUS TRANSMISSION',
      range: [0.92, 1.00], 
      checkpoint: 1.00,
      navModeKey: 'contact',
      sysMode: 'SYS.COMM // BEACON NEXUS TRANSMISSION',
      coords: 'CARRIER: 1420.405 MHz // GAIN: +18dB',
      status: 'STATUS: UPLINK READY \u2022 SECURE CHANNEL OPEN',
      directorLabel: 'COMM // BEACON LOCK',
      showDirector: true,
      desc: 'Deep Space Dispatch Beacon' 
    }
  ];

  // Motion Tuning Constants & Solar-System-to-Sky-Map Transition Parameters
  const DEAD_BAND_EPSILON = 0.00008; // Strictly halts camera when delta is sub-pixel
  const DAMPING_FACTOR = 0.078;       // Critical damping rate per frame (~60fps)
  const ARRIVAL_DAMPING = 0.058;      // Long calm ease-out in 0.85-1.00 arrival window
  const TOUCH_SENSITIVITY = 0.00010;  // Normalized progress change per touch pixel

  // Leg 1: Home (Black Hole) -> Sector 02 Solar System Overview Transition [0.000, 0.180]
  const HOME_T_START = 0.000;
  const HOME_T_END = 0.180;
  const HOME_SPAN = HOME_T_END - HOME_T_START;
  const HOME_STEPS = 6;
  const HOME_AUTOPLAY_MS = 2400;

  // Leg 2: Planet 07 -> Sector 04 7-Constellation Continuous Flight [0.572, 0.910]
  const TRANSITION_T_START = 0.572;   // Planet 07 orbital position
  const TRANSITION_T_OVERVIEW = 0.635; // Complete constellation field discovered in wide overview
  const TRANSITION_T_END = 0.670;     // First constellation arrival (Languages)
  const TRANSITION_SPAN = TRANSITION_T_END - TRANSITION_T_START;
  const TRANSITION_STEPS = 6;
  const AUTOPLAY_DURATION_MS = 3500;
  const SKIP_DURATION_MS = 600;
  const AU_PER_LIGHT_YEAR = 63241;

  // 7 Verified Technology Constellation Waypoints across Sector 04
  const CONSTELLATION_WAYPOINTS = [
    { idx: 0, key: 'languages', title: 'Programming Languages', t: 0.670 },
    { idx: 1, key: 'backend',   title: 'Backend Development',   t: 0.710 },
    { idx: 2, key: 'frontend',  title: 'Front End',             t: 0.750 },
    { idx: 3, key: 'databases', title: 'Databases & Storage',   t: 0.790 },
    { idx: 4, key: 'ai',        title: 'Applied AI & ML',       t: 0.830 },
    { idx: 5, key: 'tools',     title: 'Developer Tools',       t: 0.870 },
    { idx: 6, key: 'cs',        title: 'CS Fundamentals',       t: 0.910 }
  ];
  const CONSTELLATION_WAYPOINT_T = [0.670, 0.710, 0.750, 0.790, 0.830, 0.870, 0.910];

  // Transition Playback & Step Gesture State
  let autoPlayState = null;           // { startP, endP, startMs, durationMs, isSkip }
  let wheelStepLockUntil = 0;
  let constellationWheelLockUntil = 0;
  let lastWheelMagnitude = 0;
  let lastWheelTimeMs = 0;
  let skipBtnEl = null;
  let debugBarEl = null;
  let debugSliderEl = null;
  let homeSliderEl = null;
  let debugValEl = null;

  // State
  let targetProgress = 0.0;
  let currentProgress = 0.0;
  let previousProgress = 0.0;
  let velocity = 0.0;
  let isMoving = false;
  let isInitialized = false;
  let isSuspended = false;

  // Active Sector
  let activeSectorIndex = 0;
  let activeSector = SECTORS[0];
  let sectorProgress = 0.0;

  // Input Locks
  const activeLocks = new Set();

  // Listeners
  const eventCallbacks = {
    update: [],
    sectorChange: [],
    settled: []
  };

  // DOM Elements
  let hudContainerEl = null;
  let hudProgressFill = null;
  let hudProgressVal = null;
  let hudSectorVal = null;
  let hudTargetVal = null;
  let hudCurrVal = null;
  let hudVelocityVal = null;
  let hudMotionVal = null;
  let hudLockVal = null;
  let scrollDriverEl = null;

  // Touch State
  let touchStartY = 0;
  let touchActive = false;
  let touchVelocityY = 0;
  let lastTouchY = 0;
  let lastTouchTime = 0;

  // Animation Frame Handle
  let rafId = null;
  let lastFrameTime = performance.now();

  /**
   * Helper: Check if Space Theme is active
   */
  function isSpaceTheme() {
    return document.documentElement.getAttribute('data-theme') === 'space';
  }

  /**
   * Find Sector for given progress t
   */
  function getSectorForProgress(t) {
    const clamped = Math.max(0, Math.min(1, t));
    for (let i = 0; i < SECTORS.length; i++) {
      const s = SECTORS[i];
      if (clamped >= s.range[0] && clamped <= s.range[1]) {
        return { sector: s, index: i };
      }
    }
    return { sector: SECTORS[SECTORS.length - 1], index: SECTORS.length - 1 };
  }

  /**
   * Register Event Listener
   */
  function addEventListener(eventName, callback) {
    if (eventCallbacks[eventName] && typeof callback === 'function') {
      eventCallbacks[eventName].push(callback);
    }
  }

  /**
   * Notify Listeners
   */
  function triggerEvent(eventName, payload) {
    const cbs = eventCallbacks[eventName];
    if (cbs) {
      for (let i = 0; i < cbs.length; i++) {
        try {
          cbs[i](payload);
        } catch (err) {
          console.warn('[MasterJourneyController] Listener error:', err);
        }
      }
    }
  }

  /**
   * Register or Release Input Lock
   */
  function setLock(lockId, active) {
    if (active) {
      activeLocks.add(lockId);
    } else {
      activeLocks.delete(lockId);
    }
    updateTelemetryHud();
  }

  function isInputLocked() {
    // Also auto-query external engines for active interactions
    if (window.SpaceBlackHoleHero3D && typeof window.SpaceBlackHoleHero3D.isDragging === 'function') {
      if (window.SpaceBlackHoleHero3D.isDragging()) return true;
    }
    if (window.GalaxyJourney && typeof window.GalaxyJourney.isModalOpen === 'function') {
      if (window.GalaxyJourney.isModalOpen()) return true;
    }
    return activeLocks.size > 0;
  }

  function getActiveLockReason() {
    if (window.SpaceBlackHoleHero3D && typeof window.SpaceBlackHoleHero3D.isDragging === 'function' && window.SpaceBlackHoleHero3D.isDragging()) {
      return 'BH-DRAG';
    }
    if (window.GalaxyJourney && typeof window.GalaxyJourney.isModalOpen === 'function' && window.GalaxyJourney.isModalOpen()) {
      return 'MODAL-OPEN';
    }
    if (activeLocks.size > 0) {
      return Array.from(activeLocks).join(',');
    }
    return 'NONE';
  }

  /**
   * Set Target Progress Programmatically
   */
  function setTargetProgress(t, syncScroll = true) {
    targetProgress = Math.max(0.0, Math.min(1.0, t));
    if (syncScroll && scrollDriverEl && isSpaceTheme()) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScrollY = targetProgress * maxScroll;
      if (Math.abs(window.scrollY - targetScrollY) > 2) {
        window.scrollTo({ top: targetScrollY, behavior: 'instant' });
      }
    }
  }

  /**
   * Immediately Jump Progress
   */
  function jumpToProgress(t) {
    const clamped = Math.max(0.0, Math.min(1.0, t));
    targetProgress = clamped;
    currentProgress = clamped;
    previousProgress = clamped;
    velocity = 0.0;
    isMoving = false;
    if (scrollDriverEl && isSpaceTheme()) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScrollY = clamped * maxScroll;
      if (Math.abs(window.scrollY - targetScrollY) > 2) {
        window.scrollTo({ top: targetScrollY, behavior: 'instant' });
      }
    }
    updateSectorState();
    triggerEvent('update', currentProgress);
    triggerEvent('settled', currentProgress);
    updateTelemetryHud();
    syncVisualHandoff(currentProgress, 0.0);
  }

  /**
   * Evaluate Sector state & Sector-relative progress
   */
  function updateSectorState() {
    const res = getSectorForProgress(currentProgress);
    const s = res.sector;
    const idx = res.index;

    const span = Math.max(0.001, s.range[1] - s.range[0]);
    sectorProgress = Math.max(0, Math.min(1, (currentProgress - s.range[0]) / span));

    if (idx !== activeSectorIndex) {
      activeSectorIndex = idx;
      activeSector = s;
      triggerEvent('sectorChange', { sector: s, index: idx });
    }

    updateCockpitHud(s, currentProgress);
    if (document.documentElement && s.navModeKey) {
      document.documentElement.setAttribute('data-cockpit-mode', s.navModeKey);
    }
  }

  /**
   * Synchronize Persistent Cockpit HUD Avionics across all 5 sectors
   */
  /**
   * Pure normalized homeProgress ∈ [0, 1] from Black Hole (0.000) -> Solar System Overview (0.180)
   */
  function getHomeProgress(t = currentProgress) {
    return Math.max(0.0, Math.min(1.0, (t - HOME_T_START) / HOME_SPAN));
  }

  function setHomeProgress(p, instant = false) {
    const clampedP = Math.max(0.0, Math.min(1.0, p));
    const mappedT = HOME_T_START + clampedP * HOME_SPAN;
    if (instant) {
      autoPlayState = null;
      hideSkipButton();
      jumpToProgress(mappedT);
    } else {
      setTargetProgress(mappedT, true);
    }
  }

  function isInHomeCorridor(t) {
    return t >= (HOME_T_START - 0.002) && t <= (HOME_T_END + 0.002);
  }

  function stepHome(direction) {
    const curTargetP = getHomeProgress(targetProgress);
    const stepFrac = 1.0 / HOME_STEPS; // 0.25 per step

    // If at Solar System edge (p >= 0.995) scrolling DOWN -> advance to Planet 01 dwell
    if (curTargetP >= 0.995 && direction > 0) {
      setTargetProgress(0.205, true);
      return true;
    }
    // If at Home (p <= 0.005) scrolling UP -> stay at 0.000
    if (curTargetP <= 0.005 && direction < 0) {
      setTargetProgress(0.000, true);
      return true;
    }

    const snappedIdx = Math.round(curTargetP * HOME_STEPS);
    const nextIdx = Math.max(0, Math.min(HOME_STEPS, snappedIdx + (direction > 0 ? 1 : -1)));
    const nextP = nextIdx * stepFrac;
    setHomeProgress(nextP, false);
    return true;
  }

  function computeHomeDistanceReadout(p) {
    // Logarithmic countdown to Sun: ~12.5 LY (~790,512 AU) at Home -> 40 AU at Solar System edge
    const au = 790512.0 * Math.pow(40.0 / 790512.0, Math.max(0.0, Math.min(1.0, p)));
    if (au >= AU_PER_LIGHT_YEAR) {
      const ly = au / AU_PER_LIGHT_YEAR;
      return `${ly.toFixed(2)} LY`;
    }
    return `${Math.round(au).toLocaleString()} AU`;
  }

  function formatHomeTelemetry(p) {
    const stepNum = Math.min(HOME_STEPS, Math.max(1, Math.ceil(Math.max(0.01, p) * HOME_STEPS)));
    let phaseLabel = 'Leaving the black hole';
    if (p >= 0.88) {
      phaseLabel = 'Solar system';
    } else if (p >= 0.58) {
      phaseLabel = 'Approaching the Sun';
    } else if (p >= 0.22) {
      phaseLabel = 'Deep space';
    }
    return {
      phaseLabel,
      stepText: `${stepNum}/${HOME_STEPS}`,
      distText: computeHomeDistanceReadout(p)
    };
  }

  /**
   * Pure normalized transitionProgress ∈ [0, 1] from Planet 07 (0.572) -> Sky Map (0.850)
   */
  function getTransitionProgress(t = currentProgress) {
    return Math.max(0.0, Math.min(1.0, (t - TRANSITION_T_START) / TRANSITION_SPAN));
  }

  function setTransitionProgress(p, instant = false) {
    const clampedP = Math.max(0.0, Math.min(1.0, p));
    const mappedT = TRANSITION_T_START + clampedP * TRANSITION_SPAN;
    if (instant) {
      autoPlayState = null;
      hideSkipButton();
      jumpToProgress(mappedT);
    } else {
      setTargetProgress(mappedT, true);
    }
  }

  function isInTransitionCorridor(t) {
    return t >= (TRANSITION_T_START - 0.002) && t <= (TRANSITION_T_END + 0.002);
  }

  function stepTransition(direction) {
    const curTargetP = getTransitionProgress(targetProgress);
    const stepFrac = 1.0 / TRANSITION_STEPS; // 0.25 per step

    // If at Sky Map (p >= 0.995) scrolling DOWN -> hold comfortably on Sky Map unless user explicitly scrolls into Contact
    if (curTargetP >= 0.995 && direction > 0) {
      if (targetProgress < 0.93) {
        setTargetProgress(Math.min(0.93, targetProgress + 0.015), true);
        return true;
      }
      setTargetProgress(Math.min(1.0, targetProgress + 0.035), true);
      return true;
    }
    // If at Planet 07 (p <= 0.005) scrolling UP -> return to Planet 06 transit
    if (curTargetP <= 0.005 && direction < 0) {
      setTargetProgress(Math.max(0.0, TRANSITION_T_START - 0.032), true);
      return true;
    }

    const snappedIdx = Math.round(curTargetP * TRANSITION_STEPS);
    const nextIdx = Math.max(0, Math.min(TRANSITION_STEPS, snappedIdx + (direction > 0 ? 1 : -1)));
    const nextP = nextIdx * stepFrac;
    setTransitionProgress(nextP, false);
    return true;
  }

  function computeDistanceReadout(p) {
    // Consistent continuous radial distance from Sun: 40 AU at Planet 07 -> ~18.4 ly at Sky Map
    const au = 40.0 * Math.pow(29000.0, Math.max(0.0, Math.min(1.0, p)));
    if (au < AU_PER_LIGHT_YEAR) {
      return `${Math.round(au).toLocaleString()} AU`;
    }
    const ly = au / AU_PER_LIGHT_YEAR;
    return `${ly.toFixed(2)} LY`;
  }

  function formatTransitionTelemetry(p) {
    const stepNum = Math.min(TRANSITION_STEPS, Math.max(1, Math.ceil(Math.max(0.01, p) * TRANSITION_STEPS)));
    let phaseLabel = 'Leaving the solar system';
    if (p >= 0.75) {
      phaseLabel = 'Sky map';
    } else if (p >= 0.25) {
      phaseLabel = 'Deep space';
    }
    return {
      phaseLabel,
      stepText: `${stepNum}/${TRANSITION_STEPS}`,
      distText: computeDistanceReadout(p)
    };
  }

  function updateCockpitHud(s, t) {
    if (!isSpaceTheme()) return;

    const inHomeWindow = t >= 0.002 && t <= (HOME_T_END + 0.005);
    const inTransitionWindow = t >= (TRANSITION_T_START + 0.002) && t <= (TRANSITION_T_END + 0.005);
    const pSky = getTransitionProgress(t);
    const pHome = getHomeProgress(t);
    const tInfo = inHomeWindow ? formatHomeTelemetry(pHome) : formatTransitionTelemetry(pSky);
    const inFlight = inHomeWindow || inTransitionWindow;

    // 1. Cockpit Section Label (Bottom-left plain status during flight, or standard sector label)
    const cockpitSection = document.getElementById('cockpitSectionLabel');
    const expectedSection = inFlight ? tInfo.phaseLabel : `SECTOR ${s.name}`;
    if (cockpitSection && cockpitSection.textContent !== expectedSection) {
      cockpitSection.textContent = expectedSection;
    }

    const navModeText = document.getElementById('cockpitNavModeText');
    const expectedNavMode = inFlight
      ? `STEP ${tInfo.stepText} // ${tInfo.distText}`
      : `MODE: ${s.hudMode}`;
    if (navModeText && navModeText.textContent !== expectedNavMode) {
      navModeText.textContent = expectedNavMode;
    }

    // 2. Cockpit Root Data Attribute & Visibility
    const spaceCockpitHud = document.getElementById('spaceCockpitHud');
    if (spaceCockpitHud) {
      if (spaceCockpitHud.getAttribute('data-cockpit-mode') !== s.navModeKey) {
        spaceCockpitHud.setAttribute('data-cockpit-mode', s.navModeKey);
      }
      spaceCockpitHud.style.display = 'block';
      spaceCockpitHud.style.opacity = '1';
      spaceCockpitHud.style.visibility = 'visible';
    }

    // 3. Telemetry Deck Values (plain distance & step counter during flight)
    const sysModeEl = document.getElementById('cockpitSysMode');
    const expectedSys = inFlight ? `TRANSIT ${tInfo.stepText}` : s.sysMode;
    if (sysModeEl && sysModeEl.textContent !== expectedSys) {
      sysModeEl.textContent = expectedSys;
    }

    const coordsEl = document.getElementById('cockpitFlightCoords');
    if (coordsEl) {
      const targetCoords = inHomeWindow
        ? `DISTANCE TO SUN // ${tInfo.distText}`
        : (inTransitionWindow ? `DISTANCE FROM SUN // ${tInfo.distText}` : s.coords);
      if ((inFlight || s.id !== 2 || !coordsEl.getAttribute('data-target-locked')) && coordsEl.textContent !== targetCoords) {
        coordsEl.textContent = targetCoords;
      }
    }

    const statusEl = document.getElementById('cockpitStatusVal');
    if (statusEl) {
      const targetStatus = inFlight ? `STEP ${tInfo.stepText}` : s.status;
      if ((inFlight || s.id !== 2 || !statusEl.getAttribute('data-target-locked')) && statusEl.textContent !== targetStatus) {
        statusEl.textContent = targetStatus;
      }
    }

    const directorEl = document.getElementById('cockpitTargetDirector');
    if (directorEl) {
      directorEl.style.opacity = (inFlight || s.showDirector) ? '0.36' : '0';
      directorEl.style.visibility = (inFlight || s.showDirector) ? 'visible' : 'hidden';
    }

    const directorLabelEl = document.getElementById('cockpitDirectorReadout');
    const expectedDirector = inFlight ? `${tInfo.stepText} • ${tInfo.distText}` : s.directorLabel;
    if (directorLabelEl && directorLabelEl.textContent !== expectedDirector) {
      directorLabelEl.textContent = expectedDirector;
    }

    // Sync ?debug=1 sliders if mounted
    if (debugValEl) {
      if (t <= HOME_T_END + 0.005) {
        if (homeSliderEl) homeSliderEl.value = pHome.toFixed(3);
        debugValEl.textContent = `Home p=${pHome.toFixed(2)} | ${tInfo.stepText} | ${tInfo.distText}`;
      } else {
        if (debugSliderEl) debugSliderEl.value = pSky.toFixed(3);
        debugValEl.textContent = `Sky p=${pSky.toFixed(2)} | ${tInfo.stepText} | ${tInfo.distText}`;
      }
    }

    // 4. Update Navbar Links Active State
    syncNavbarActiveState(t);
  }

  function syncNavbarActiveState(t) {
    let activeId = 'hero';
    if (t < 0.09) {
      activeId = 'hero';
    } else if (t < 0.60) {
      activeId = 'works';
    } else if (t < 0.925) {
      activeId = 'disciplines';
    } else {
      activeId = 'dispatch';
    }

    const links = document.querySelectorAll('#spaceNavLinks a, #atelier-header .atelier-nav-link, #atelier-header .nav-link');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const isTarget = href === `#${activeId}`;
      link.classList.toggle('active', isTarget);
    });
  }

  function showSkipButton() {
    if (!skipBtnEl) {
      skipBtnEl = document.createElement('button');
      skipBtnEl.id = 'transitionSkipBtn';
      skipBtnEl.type = 'button';
      skipBtnEl.textContent = 'Skip [Esc] →';
      skipBtnEl.style.cssText = [
        'position:fixed',
        'bottom:72px',
        'left:50%',
        'transform:translateX(-50%)',
        'z-index:9995',
        'font-family:"Space Mono",monospace',
        'font-size:12px',
        'padding:6px 14px',
        'border-radius:4px',
        'border:1px solid rgba(245,158,11,0.55)',
        'background:rgba(6,9,16,0.86)',
        'color:#f8fafc',
        'cursor:pointer',
        'backdrop-filter:blur(8px)',
        'transition:opacity 0.25s ease'
      ].join(';');
      skipBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerSkipToSkyMap();
      });
      document.body.appendChild(skipBtnEl);
    }
    skipBtnEl.style.display = 'block';
    skipBtnEl.style.opacity = '1';
  }

  function hideSkipButton() {
    if (skipBtnEl) {
      skipBtnEl.style.display = 'none';
      skipBtnEl.style.opacity = '0';
    }
  }

  function startAutoPlayToSkills(fromStart = false) {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // 0.6s clean crossfade under prefers-reduced-motion
      if (currentProgress < TRANSITION_T_START) {
        jumpToProgress(TRANSITION_T_START);
      }
      autoPlayState = {
        type: 'skills',
        startP: getTransitionProgress(currentProgress),
        endP: 1.0,
        startMs: performance.now(),
        durationMs: SKIP_DURATION_MS,
        isSkip: true
      };
      return;
    }

    if (fromStart || currentProgress < TRANSITION_T_START - 0.01) {
      jumpToProgress(TRANSITION_T_START);
    }
    const startP = getTransitionProgress(currentProgress);
    if (startP >= 0.995) {
      setTargetProgress(TRANSITION_T_END, true);
      return;
    }
    const remainingFrac = 1.0 - startP;
    autoPlayState = {
      type: 'skills',
      startP,
      endP: 1.0,
      startMs: performance.now(),
      durationMs: Math.max(800, Math.round(AUTOPLAY_DURATION_MS * remainingFrac)),
      isSkip: false
    };
    showSkipButton();
  }

  function startAutoPlayToContact() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      jumpToProgress(1.00);
      return;
    }
    if (window.GalaxyJourney && typeof window.GalaxyJourney.closeConstellationDetail === 'function') {
      window.GalaxyJourney.closeConstellationDetail(true);
    }
    const startT = Math.max(0.67, currentProgress);
    if (startT >= 0.995) {
      setTargetProgress(1.00, true);
      return;
    }
    const remainingFrac = (1.00 - startT) / (1.00 - 0.67);
    autoPlayState = {
      type: 'contact',
      startT,
      endT: 1.00,
      startMs: performance.now(),
      durationMs: Math.max(800, Math.round(2600 * remainingFrac)),
      isSkip: false
    };
  }

  function startAutoPlayToProjects(fromStart = false) {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      jumpToProgress(0.205);
      return;
    }

    if (fromStart || currentProgress < 0.005) {
      jumpToProgress(0.000);
    }
    const startP = getHomeProgress(currentProgress);
    if (startP >= 0.995 || currentProgress >= 0.18) {
      setTargetProgress(0.205, true);
      return;
    }
    const remainingFrac = 1.0 - startP;
    autoPlayState = {
      type: 'home',
      startP,
      endP: 1.0,
      startMs: performance.now(),
      durationMs: Math.max(800, Math.round(HOME_AUTOPLAY_MS * remainingFrac)),
      isSkip: false
    };
    showSkipButton();
  }

  function triggerSkipToProjects() {
    autoPlayState = null;
    hideSkipButton();
    setTargetProgress(0.205, true);
  }

  function triggerSkipToSkyMap() {
    const curP = getTransitionProgress(currentProgress);
    if (curP >= 0.995) {
      autoPlayState = null;
      hideSkipButton();
      return;
    }
    autoPlayState = {
      type: 'skills',
      startP: curP,
      endP: 1.0,
      startMs: performance.now(),
      durationMs: SKIP_DURATION_MS,
      isSkip: true
    };
  }

  function interruptAutoPlay() {
    if (!autoPlayState) return;
    autoPlayState = null;
    hideSkipButton();
    targetProgress = currentProgress;
  }

  function setupNavbarNavigation() {
    const navCheckpoints = {
      '#hero': 0.00,
      '#works': 0.205,
      '#projects': 0.205,
      '#disciplines': TRANSITION_T_END,
      '#skills': TRANSITION_T_END,
      '#dispatch': 1.00,
      '#contact': 1.00
    };

    const links = document.querySelectorAll(
      '#spaceNavLinks a, #atelier-header a[href^="#"], .brand-monogram, .footer-nav-link[href^="#"], .space-btn-expedition, .hero-cta-btn, .spatial-scroll-indicator, a[href="#works"], a[href="#projects"], a[href="#disciplines"], a[href="#skills"], a[href="#dispatch"], a[href="#contact"]'
    );
    links.forEach(link => {
      link.addEventListener('click', function (e) {
        if (!isSpaceTheme()) return;

        const href = this.getAttribute('href') || (this.classList.contains('brand-monogram') ? '#hero' : null) || (this.classList.contains('space-btn-expedition') || this.classList.contains('hero-cta-btn') || this.classList.contains('spatial-scroll-indicator') ? '#works' : null);
        if (!href) return;

        const targetT = navCheckpoints[href];
        if (targetT === undefined) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Close mobile nav drawer if open
        const navCenter = document.querySelector('.nav-center');
        const menuBtn = document.getElementById('menuToggle');
        if (navCenter) navCenter.classList.remove('open');
        if (menuBtn) {
          menuBtn.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
        }

        if (href === '#works') {
          if (currentProgress <= HOME_T_END + 0.01) {
            startAutoPlayToProjects(currentProgress < 0.005);
            return;
          }
        }

        if (href === '#disciplines') {
          if (window.GalaxyJourney && typeof window.GalaxyJourney.isConstellationDetailActive === 'function' && window.GalaxyJourney.isConstellationDetailActive()) {
            window.GalaxyJourney.closeConstellationDetail(false);
            return;
          }
          if (currentProgress <= TRANSITION_T_END + 0.005) {
            startAutoPlayToSkills(currentProgress < TRANSITION_T_START - 0.01);
          } else {
            // Returning backward from Contact (#dispatch) -> Sky Map
            autoPlayState = null;
            setTargetProgress(TRANSITION_T_END, true);
          }
          return;
        }

        if (href === '#dispatch') {
          if (currentProgress < 0.99) {
            startAutoPlayToContact();
            return;
          }
        }

        if (window.GalaxyJourney && typeof window.GalaxyJourney.closeConstellationDetail === 'function') {
          window.GalaxyJourney.closeConstellationDetail(true);
        }
        interruptAutoPlay();
        setTargetProgress(targetT, true);
      }, true);
    });
  }

  /**
   * Phase 2: Master Camera Handoff & Seamless Cross-fade Coordination
   * Synchronizes SpaceBlackHoleHero3D, GalaxyJourney, DOM layouts, and motion blur streaks
   */
  function syncVisualHandoff(t, v) {
    if (!isSpaceTheme()) return;

    if (window.GalaxyJourney && typeof window.GalaxyJourney.updateSector01VisualStaging === 'function') {
      window.GalaxyJourney.updateSector01VisualStaging(t);
    }

    const heroCanvas = document.getElementById('hero3DCanvas');
    const heroEl = document.getElementById('hero');
    const heroLayout = document.querySelector('#hero .space-hero-unified-layout') || document.querySelector('#hero .hero-layout');
    const bhContainer = document.getElementById('blackHoleContainer');
    const bhIntroHud = document.getElementById('blackHoleIntroHud');

    // ── 1. SECTOR 01: SINGULARITY CORE & HANDOFF WINDOW (0.00 <= t <= 0.18) ──
    const homeP = getHomeProgress(t);
    if (t <= 0.18) {
      if (heroEl) {
        heroEl.style.opacity = '1';
        heroEl.style.visibility = 'visible';
      }
      // Ensure Black Hole engine is running RAF loop
      if (window.SpaceBlackHoleHero3D && typeof window.SpaceBlackHoleHero3D.resume === 'function') {
        window.SpaceBlackHoleHero3D.resume();
      }

      // Continuous 3D coordination for both WebGL canvases
      if (window.SpaceBlackHoleHero3D && typeof window.SpaceBlackHoleHero3D.setHomeTransitionProgress === 'function') {
        window.SpaceBlackHoleHero3D.setHomeTransitionProgress(homeP);
      }
      if (window.GalaxyJourney && typeof window.GalaxyJourney.setHomeTransitionProgress === 'function') {
        window.GalaxyJourney.setHomeTransitionProgress(homeP, !isMoving);
      }

      // Hero text & UI elements lift away and fade out across [0.015, 0.140]
      const FADE_START = 0.015;
      const FADE_END = 0.140;
      let heroSyncAlpha = 1.0;
      let u = 0.0;
      if (homeP > FADE_START) {
        u = Math.min(1.0, (homeP - FADE_START) / (FADE_END - FADE_START));
        const smoothU = u * u * (3.0 - 2.0 * u);
        heroSyncAlpha = Math.max(0.0, 1.0 - smoothU);
      }

      // Black Hole canvas remains visible throughout flight (shader shrinks black hole to 4px orange speck)
      if (heroCanvas) {
        heroCanvas.style.opacity = '1';
        heroCanvas.style.visibility = 'visible';
        heroCanvas.style.pointerEvents = homeP > 0.03 ? 'none' : 'auto';
      }

      const monographEl = document.querySelector('.space-hero-monograph');
      const leadEl = document.querySelector('.space-monograph-lead') || document.querySelector('.space-hero-lead');
      const ctaEl = document.querySelector('.hero-actions') || document.querySelector('.space-hero-cta-group');
      const cockpitDeckEl = document.querySelector('.space-cockpit-instruments-deck');
      const accretionFooter = document.getElementById('spaceAccretionStatusPill') || document.querySelector('.space-accretion-hud');
      const constellationEl = document.querySelector('.space-orbital-constellation');

      if (heroLayout) {
        heroLayout.style.opacity = heroSyncAlpha.toFixed(3);
        heroLayout.style.pointerEvents = homeP > 0.03 ? 'none' : 'auto';
      }

      if (constellationEl) {
        const isDestroyedOrConsuming = (typeof BlackHoleLifecycle !== 'undefined' &&
          (BlackHoleLifecycle.isDestroying() || BlackHoleLifecycle.isReadyToDestroy() || BlackHoleLifecycle.isDestroyed())) ||
          constellationEl.dataset.consumed === '1';
        if (isDestroyedOrConsuming) {
          constellationEl.style.opacity = '0';
          constellationEl.style.pointerEvents = 'none';
        } else {
          constellationEl.style.opacity = heroSyncAlpha.toFixed(3);
          constellationEl.style.pointerEvents = heroSyncAlpha > 0.05 ? 'auto' : 'none';
        }
      }

      if (monographEl) {
        // Pure camera zoom out: scale down in place without artificial sideways sliding
        const tz = (-u * 280.0).toFixed(2);
        const scale = (1.0 - u * 0.28).toFixed(3);
        monographEl.style.transform = `translate3d(0px, 0px, ${tz}px) scale(${scale})`;
        monographEl.style.opacity = heroSyncAlpha.toFixed(3);
      }

      if (leadEl) {
        const tz = (-u * 220.0).toFixed(2);
        const scale = (1.0 - u * 0.22).toFixed(3);
        leadEl.style.transform = `translate3d(0px, 0px, ${tz}px) scale(${scale})`;
      }

      if (ctaEl) {
        const tz = (-u * 180.0).toFixed(2);
        const scale = (1.0 - u * 0.18).toFixed(3);
        ctaEl.style.transform = `translate3d(0px, 0px, ${tz}px) scale(${scale})`;
      }

      if (cockpitDeckEl) {
        const tz = (-u * 160.0).toFixed(2);
        const scale = (1.0 - u * 0.16).toFixed(3);
        cockpitDeckEl.style.transform = `translate3d(0px, 0px, ${tz}px) scale(${scale})`;
        cockpitDeckEl.style.opacity = heroSyncAlpha.toFixed(3);
      }

      if (bhIntroHud) {
        bhIntroHud.style.opacity = heroSyncAlpha.toFixed(3);
        bhIntroHud.style.pointerEvents = homeP > 0.03 ? 'none' : 'auto';
      }

      if (accretionFooter) {
        accretionFooter.style.opacity = heroSyncAlpha.toFixed(3);
        accretionFooter.style.pointerEvents = homeP > 0.03 ? 'none' : 'auto';
      }

      if (bhContainer) {
        bhContainer.style.pointerEvents = homeP > 0.03 ? 'none' : 'auto';
      }
    } 
    // ── 2. SECTOR 02+: DEEP SPACE EXPLORATION & PLANETARY CORRIDOR (t > 0.18) ──
    else {
      // Fully transitioned past the Singularity
      if (heroEl) {
        heroEl.style.opacity = '0';
        heroEl.style.visibility = 'hidden';
        heroEl.style.pointerEvents = 'none';
      }
      if (heroCanvas) {
        heroCanvas.style.opacity = '0';
        heroCanvas.style.visibility = 'hidden';
      }
      if (heroLayout) {
        heroLayout.style.opacity = '0';
        heroLayout.style.pointerEvents = 'none';
      }
      if (bhIntroHud) {
        bhIntroHud.style.opacity = '0';
        bhIntroHud.style.pointerEvents = 'none';
      }
      if (bhContainer) {
        bhContainer.style.pointerEvents = 'none';
      }

      // Pause Black Hole hero RAF to conserve 100% GPU budget for full planetary exploration
      if (window.SpaceBlackHoleHero3D && typeof window.SpaceBlackHoleHero3D.pause === 'function') {
        window.SpaceBlackHoleHero3D.pause();
      }
      if (window.GalaxyJourney && typeof window.GalaxyJourney.setHomeTransitionProgress === 'function') {
        window.GalaxyJourney.setHomeTransitionProgress(1.0, false);
      }
    }

    // ── 2B. SECTOR 02 -> SKY MAP CONTINUOUS SYNCHRONIZATION ──
    if (window.GalaxyJourney && typeof window.GalaxyJourney.setProgress === 'function') {
      if (t < 0.18) {
        window.GalaxyJourney.setProgress(0.0, true);
        window.GalaxyJourney.setHomeTransitionProgress(homeP, false);
      } else if (t <= TRANSITION_T_START) {
        const frac = (t - 0.18) / Math.max(0.001, TRANSITION_T_START - 0.18);
        window.GalaxyJourney.setProgress(frac * 0.835, false);
      } else if (t <= TRANSITION_T_END) {
        const tp = getTransitionProgress(t);
        window.GalaxyJourney.setProgress(0.835 + tp * (1.0 - 0.835), false);
      } else {
        window.GalaxyJourney.setProgress(1.0, false);
      }
    }

    // ── 3. DIRECTIONAL MOTION WARP STREAKS (Suppressed during Deep-Space Sky Map Transition) ──
    if (window.GalaxyJourney && typeof window.GalaxyJourney.getPostMaterial === 'function') {
      const postMat = window.GalaxyJourney.getPostMaterial();
      if (postMat && postMat.uniforms && postMat.uniforms.uMotionBlur) {
        const absVel = Math.abs(v || 0.0);
        let motionBlur = 0.0;
        if (t >= 0.05 && t <= 0.25) {
          motionBlur = Math.min(0.85, absVel * 95.0 + (isMoving ? 0.18 : 0.0));
        } else if (t > 0.25 && t < TRANSITION_T_START) {
          const PLANET_WAYPOINTS = [0.205, 0.266, 0.327, 0.388, 0.450, 0.511, 0.572];
          const isAtPlanetDwell = PLANET_WAYPOINTS.some(wp => Math.abs(t - wp) <= 0.014);
          // Subtle cinematic star streaks when cruising through interplanetary void
          motionBlur = isAtPlanetDwell ? 0.0 : Math.min(0.50, absVel * 85.0 + (isMoving ? 0.08 : 0.0));
        } else if (t >= 0.88 && t <= 0.94) {
          // Subtle cinematic star streaks during Leg 3 approach cruise (similar to Leg 1)
          motionBlur = Math.min(0.50, absVel * 75.0 + (isMoving ? 0.10 : 0.0));
        } else {
          // Strict zero warp streaks / zero tunnel effect in Solar -> Deep Space -> Sky Map
          motionBlur = 0.0;
        }
        postMat.uniforms.uMotionBlur.value = motionBlur;
      }
    }

    // ── 4. SECTOR 04 & SECTOR 05 HANDOFF (Leg 3: Continuous Starfield, Projector Ignition & Cards) ──
    if (window.GalaxyJourney) {
      if (typeof window.GalaxyJourney.updateSkillsDiscoveryProgress === 'function') {
        window.GalaxyJourney.updateSkillsDiscoveryProgress(t >= TRANSITION_T_END ? 1.0 : 0.0);
      }
      if (typeof window.GalaxyJourney.updateContactFlightProgress === 'function') {
        window.GalaxyJourney.updateContactFlightProgress(t);
      } else if (t > 0.93) {
        const pBeacon = Math.min(1.0, (t - 0.93) / 0.07);
        if (typeof window.GalaxyJourney.updateBeaconNexusProgress === 'function') {
          window.GalaxyJourney.updateBeaconNexusProgress(pBeacon);
        }
      } else {
        if (typeof window.GalaxyJourney.updateBeaconNexusProgress === 'function') {
          window.GalaxyJourney.updateBeaconNexusProgress(0.0);
        }
      }
    }

    // ── 4B. SECTOR 04: THE CONSTELLATION ATLAS SYNCHRONIZATION ──
    if (window.TechnologyConstellation && typeof window.TechnologyConstellation.updateProgress === 'function') {
      window.TechnologyConstellation.updateProgress(t);
    }
  }

  /**
   * Main Frame Loop (Critically Damped Motion Solver + Auto-Play)
   */
  function updateLoop(now) {
    rafId = requestAnimationFrame(updateLoop);

    if (isSuspended || !isSpaceTheme()) {
      return;
    }

    const deltaMs = Math.min(64, now - lastFrameTime);
    lastFrameTime = now;

    // 1. Optional Nav-Click Auto-Play (Home, Sky Map, or Contact flight)
    if (autoPlayState) {
      const isHome = autoPlayState.type === 'home';
      const isContact = autoPlayState.type === 'contact';
      const elapsed = now - autoPlayState.startMs;
      const rawU = Math.min(1.0, elapsed / Math.max(1, autoPlayState.durationMs));
      const easedU = autoPlayState.isSkip
        ? (1.0 - Math.pow(1.0 - rawU, 3.0))
        : (rawU < 0.5 ? 4.0 * rawU * rawU * rawU : 1.0 - Math.pow(-2.0 * rawU + 2.0, 3.0) / 2.0);
      let mappedT;
      if (isContact) {
        mappedT = autoPlayState.startT + (autoPlayState.endT - autoPlayState.startT) * easedU;
      } else if (isHome) {
        const curP = autoPlayState.startP + (autoPlayState.endP - autoPlayState.startP) * easedU;
        mappedT = HOME_T_START + curP * HOME_SPAN;
      } else {
        const curP = autoPlayState.startP + (autoPlayState.endP - autoPlayState.startP) * easedU;
        mappedT = TRANSITION_T_START + curP * TRANSITION_SPAN;
      }
      previousProgress = currentProgress;
      currentProgress = mappedT;
      targetProgress = mappedT;
      velocity = currentProgress - previousProgress;
      isMoving = rawU < 1.0;

      if (scrollDriverEl) {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({ top: mappedT * maxScroll, behavior: 'instant' });
      }

      updateSectorState();
      triggerEvent('update', currentProgress);
      updateTelemetryHud();

      if (rawU >= 1.0) {
        autoPlayState = null;
        isMoving = false;
        velocity = 0.0;
        hideSkipButton();
        if (isHome) {
          setTargetProgress(0.205, true);
        }
        triggerEvent('settled', currentProgress);
      }
      syncVisualHandoff(currentProgress, velocity);
      if (window.SpaceStarfield && typeof window.SpaceStarfield.setJourneyState === 'function') {
        window.SpaceStarfield.setJourneyState(currentProgress, velocity, isMoving);
      }
      return;
    }

    // 2. Critically Damped Solver with Deadband Snap (Longer ease-out in 0.85-1.00 arrival zone)
    const diff = targetProgress - currentProgress;
    const absDiff = Math.abs(diff);

    if (absDiff < DEAD_BAND_EPSILON) {
      if (isMoving) {
        currentProgress = targetProgress;
        velocity = 0.0;
        isMoving = false;
        updateSectorState();
        triggerEvent('update', currentProgress);
        triggerEvent('settled', currentProgress);
        updateTelemetryHud();
      }
    } else {
      previousProgress = currentProgress;
      const transP = getTransitionProgress(currentProgress);
      const damp = (isInTransitionCorridor(currentProgress) && transP >= 0.78) ? ARRIVAL_DAMPING : DAMPING_FACTOR;
      const frameDamp = 1.0 - Math.pow(1.0 - damp, deltaMs / 16.67);
      currentProgress += diff * frameDamp;
      velocity = currentProgress - previousProgress;
      isMoving = true;
      updateSectorState();
      triggerEvent('update', currentProgress);
      updateTelemetryHud();
    }
    syncVisualHandoff(currentProgress, velocity);
    if (window.SpaceStarfield && typeof window.SpaceStarfield.setJourneyState === 'function') {
      window.SpaceStarfield.setJourneyState(currentProgress, velocity, isMoving);
    }
  }

  /**
   * Synchronize from Native Window Scroll
   */
  function onWindowScroll() {
    if (!isSpaceTheme() || isInputLocked()) return;

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const rawProgress = Math.max(0.0, Math.min(1.0, window.scrollY / maxScroll));
    targetProgress = rawProgress;
  }

  /**
   * Wheel / Trackpad Handler with Context Isolation
   */
  function onWindowWheel(e) {
    if (!isSpaceTheme()) return;

    // Check if target is inside an open modal OR a card scroller that still has room to scroll
    const targetEl = (e.target && typeof e.target.closest === 'function') ? e.target : null;
    const modalContainer = targetEl && (
      targetEl.closest('#projectExperienceModal') ||
      targetEl.closest('.modal-scrollable-body') ||
      targetEl.closest('.blackhole-intro-hud') ||
      targetEl.closest('#galaxyDossierCard') ||
      targetEl.closest('#galaxySpacecraftDossier') ||
      targetEl.closest('.dossier-panel-scroll') ||
      targetEl.closest('.experience-dossier-grid') ||
      targetEl.closest('.dossier-screen-panel')
    );

    const cardScroller = targetEl && targetEl.closest('.dossier-scroll-pane, #projectDossierCard');
    const canScrollCard = Boolean(
      cardScroller && cardScroller.scrollHeight > cardScroller.clientHeight + 2 && (
        (e.deltaY > 0 && cardScroller.scrollTop + cardScroller.clientHeight < cardScroller.scrollHeight - 2) ||
        (e.deltaY < 0 && cardScroller.scrollTop > 2)
      )
    );

    if (modalContainer || (canScrollCard && !autoPlayState)) {
      // Allow internal scrolling on open modal or scrollable card interior without advancing journey
      return;
    }

    if (isInputLocked()) {
      return;
    }

    // Normalized delta (pixels vs lines vs pages)
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 24;      // Line mode
    else if (e.deltaMode === 2) delta *= 800; // Page mode

    if (e.cancelable) {
      e.preventDefault();
    }

    // Interrupt auto-play cleanly in-place if user takes over with wheel
    if (autoPlayState) {
      interruptAutoPlay();
      return;
    }

    const dir = delta > 0 ? 1 : (delta < 0 ? -1 : 0);
    if (!dir) return;

    // ── PLANET WAYPOINT DOCKING & SINGLE-SCROLL TAKEOFF ──
    const PLANET_WAYPOINTS = [0.205, 0.266, 0.327, 0.388, 0.450, 0.511, 0.572];
    const dockedPlanetWp = PLANET_WAYPOINTS.find(wp => Math.abs(targetProgress - wp) <= 0.008);

    if (dockedPlanetWp !== undefined) {
      // User is docked at a planet viewing the project dossier.
      // A SINGLE deliberate scroll movement initiates the takeoff sequence immediately!
      const takeoffOffset = 0.016; // Propels past dwell threshold [wp - 0.012, wp + 0.012]
      if (dir > 0) {
        // Forward takeoff toward next planet / destination
        const newTarget = Math.min(1.0, dockedPlanetWp + takeoffOffset);
        setTargetProgress(newTarget, true);
        return;
      } else if (dir < 0) {
        // Reverse takeoff toward previous sector / planet
        const newTarget = Math.max(0.0, dockedPlanetWp - takeoffOffset);
        setTargetProgress(newTarget, true);
        return;
      }
    }

    // ── CONSTELLATION WAYPOINT DOCKING & SINGLE-SCROLL TAKEOFF (Phase 2 Continuous Journey) ──
    const dockedConstellationWp = CONSTELLATION_WAYPOINT_T.find(wp => Math.abs(targetProgress - wp) <= 0.008);
    if (dockedConstellationWp !== undefined) {
      // User is settled at a technology constellation exploring its details.
      // A SINGLE deliberate scroll movement initiates departure immediately!
      const takeoffOffset = 0.016;
      if (dir > 0) {
        const newTarget = Math.min(1.0, dockedConstellationWp + takeoffOffset);
        setTargetProgress(newTarget, true);
        return;
      } else if (dir < 0) {
        const newTarget = Math.max(0.0, dockedConstellationWp - takeoffOffset);
        setTargetProgress(newTarget, true);
        return;
      }
    }

    // ── CALIBRATED SLOW & CINEMATIC PROGRESSION ACROSS ALL JOURNEY SECTORS ──
    const clampedDelta = Math.max(-50, Math.min(50, delta));

    let divisor = 14000;
    if (targetProgress >= 0.000 && targetProgress < 0.185) {
      // Sector 01: Deliberate, smooth, slow departure from Black Hole singularity to Solar System
      divisor = 14000;
    } else if (targetProgress >= 0.185 && targetProgress <= TRANSITION_T_START) {
      // Sector 02: Interplanetary travel between planets
      const isNearPlanet = PLANET_WAYPOINTS.some(wp => Math.abs(targetProgress - wp) <= 0.014);
      divisor = isNearPlanet ? 9000 : 16000;
    } else if (targetProgress > TRANSITION_T_START && targetProgress < 0.650) {
      // Sector 03: Interstellar void departure from Sol-7 to Constellation Field Discovery
      divisor = 18000;
    } else if (targetProgress >= 0.650 && targetProgress <= 0.920) {
      // Sector 04: Astrometric Constellations exploration
      const isNearConstellation = CONSTELLATION_WAYPOINT_T.some(wp => Math.abs(targetProgress - wp) <= 0.012);
      divisor = isNearConstellation ? 9500 : 16000;
    } else {
      // Sector 05: Calm, cinematic approach into Beacon Nexus / 3D Hologram Projector
      divisor = 14000;
    }

    let scrollDeltaProgress = (clampedDelta / divisor);

    // ── INPUT ACCUMULATION CLAMPING & MAGNETIC WAYPOINT DOCKING ──
    const MAX_LEAD_LAG = 0.035;
    const prospectiveTarget = targetProgress + scrollDeltaProgress;

    // Magnetic Docking to Constellation & Planet Waypoints during flight
    if (dir > 0) {
      const catchConstellation = CONSTELLATION_WAYPOINT_T.find(wp => targetProgress < wp && prospectiveTarget >= (wp - 0.006));
      if (catchConstellation !== undefined) {
        setTargetProgress(catchConstellation, true);
        return;
      }
      const catchPlanet = PLANET_WAYPOINTS.find(wp => targetProgress < wp && prospectiveTarget >= (wp - 0.006));
      if (catchPlanet !== undefined) {
        setTargetProgress(catchPlanet, true);
        return;
      }
    } else if (dir < 0) {
      const catchConstellation = CONSTELLATION_WAYPOINT_T.slice().reverse().find(wp => targetProgress > wp && prospectiveTarget <= (wp + 0.006));
      if (catchConstellation !== undefined) {
        setTargetProgress(catchConstellation, true);
        return;
      }
      const catchPlanet = PLANET_WAYPOINTS.slice().reverse().find(wp => targetProgress > wp && prospectiveTarget <= (wp + 0.006));
      if (catchPlanet !== undefined) {
        setTargetProgress(catchPlanet, true);
        return;
      }
    }

    const prospectiveDiff = prospectiveTarget - currentProgress;
    let newTarget;
    if (Math.abs(prospectiveDiff) <= MAX_LEAD_LAG) {
      newTarget = prospectiveTarget;
    } else {
      newTarget = currentProgress + Math.sign(prospectiveDiff) * MAX_LEAD_LAG;
    }

    newTarget = Math.max(0.0, Math.min(1.0, newTarget));
    setTargetProgress(newTarget, true);
  }

  /**
   * Touch Gesture Support with Momentum
   */
  function onTouchStart(e) {
    if (!isSpaceTheme() || e.touches.length !== 1) return;

    const targetEl = (e.target && typeof e.target.closest === 'function') ? e.target : null;
    if (targetEl) {
      // If starting on black hole hit area, don't hijack touch
      if (targetEl.closest('#blackHoleHitArea') || targetEl.closest('#blackHoleContainer')) {
        return;
      }

      // If starting inside dossier or modal, let container scroll natively
      if (targetEl.closest('#projectDossierCard') || targetEl.closest('#projectExperienceModal')) {
        return;
      }
    }

    touchStartY = e.touches[0].clientY;
    lastTouchY = touchStartY;
    lastTouchTime = performance.now();
    touchActive = true;
    touchVelocityY = 0;
  }

  function onTouchMove(e) {
    if (!touchActive || !isSpaceTheme() || isInputLocked() || e.touches.length !== 1) return;
    if (window.GalaxyJourney && typeof window.GalaxyJourney.isConstellationDetailActive === 'function' && window.GalaxyJourney.isConstellationDetailActive()) return;

    if (autoPlayState) {
      interruptAutoPlay();
      return;
    }

    const currentY = e.touches[0].clientY;
    const deltaY = lastTouchY - currentY;
    const now = performance.now();
    const timeDelta = Math.max(1, now - lastTouchTime);

    touchVelocityY = deltaY / timeDelta;
    lastTouchY = currentY;
    lastTouchTime = now;

    const PLANET_WAYPOINTS = [0.205, 0.266, 0.327, 0.388, 0.450, 0.511, 0.572];
    const dockedPlanetWp = PLANET_WAYPOINTS.find(wp => Math.abs(targetProgress - wp) <= 0.008);
    const dockedConstellationWp = CONSTELLATION_WAYPOINT_T.find(wp => Math.abs(targetProgress - wp) <= 0.008);
    const dir = deltaY > 0 ? 1 : (deltaY < 0 ? -1 : 0);

    if (dockedPlanetWp !== undefined && Math.abs(deltaY) > 10) {
      // Single swipe takeoff from planet
      const takeoffOffset = 0.016;
      const newTarget = dir > 0
        ? Math.min(1.0, dockedPlanetWp + takeoffOffset)
        : Math.max(0.0, dockedPlanetWp - takeoffOffset);
      setTargetProgress(newTarget, true);
      return;
    }

    if (dockedConstellationWp !== undefined && Math.abs(deltaY) > 10) {
      // Single swipe takeoff from constellation
      const takeoffOffset = 0.016;
      const newTarget = dir > 0
        ? Math.min(1.0, dockedConstellationWp + takeoffOffset)
        : Math.max(0.0, dockedConstellationWp - takeoffOffset);
      setTargetProgress(newTarget, true);
      return;
    }

    let touchFactor = TOUCH_SENSITIVITY;
    const isNearPlanet = PLANET_WAYPOINTS.some(wp => Math.abs(targetProgress - wp) <= 0.014);
    const isNearConstellation = CONSTELLATION_WAYPOINT_T.some(wp => Math.abs(targetProgress - wp) <= 0.014);
    if (isNearPlanet || isNearConstellation) {
      touchFactor *= 1.15;
    }

    const prospectiveTarget = targetProgress + (deltaY * touchFactor);

    // Magnetic Docking to Constellation & Planet Waypoints during touch gesture
    if (dir > 0) {
      const catchConstellation = CONSTELLATION_WAYPOINT_T.find(wp => targetProgress < wp && prospectiveTarget >= (wp - 0.006));
      if (catchConstellation !== undefined) {
        setTargetProgress(catchConstellation, true);
        return;
      }
      const catchPlanet = PLANET_WAYPOINTS.find(wp => targetProgress < wp && prospectiveTarget >= (wp - 0.006));
      if (catchPlanet !== undefined) {
        setTargetProgress(catchPlanet, true);
        return;
      }
    } else if (dir < 0) {
      const catchConstellation = CONSTELLATION_WAYPOINT_T.slice().reverse().find(wp => targetProgress > wp && prospectiveTarget <= (wp + 0.006));
      if (catchConstellation !== undefined) {
        setTargetProgress(catchConstellation, true);
        return;
      }
      const catchPlanet = PLANET_WAYPOINTS.slice().reverse().find(wp => targetProgress > wp && prospectiveTarget <= (wp + 0.006));
      if (catchPlanet !== undefined) {
        setTargetProgress(catchPlanet, true);
        return;
      }
    }

    const prospectiveDiff = prospectiveTarget - currentProgress;
    const MAX_LEAD_LAG = 0.035;
    let newTarget;
    if (Math.abs(prospectiveDiff) <= MAX_LEAD_LAG) {
      newTarget = prospectiveTarget;
    } else {
      newTarget = currentProgress + Math.sign(prospectiveDiff) * MAX_LEAD_LAG;
    }
    setTargetProgress(Math.max(0.0, Math.min(1.0, newTarget)), true);
  }

  function onTouchEnd() {
    if (!touchActive) return;
    touchActive = false;

    if (isInputLocked()) return;
    if (window.GalaxyJourney && typeof window.GalaxyJourney.isConstellationDetailActive === 'function' && window.GalaxyJourney.isConstellationDetailActive()) {
      const totalSwipeY = touchStartY - lastTouchY;
      const dir = totalSwipeY > 28 ? 1 : (totalSwipeY < -28 ? -1 : 0);
      if (!dir) return;

      const totalSectors = (window.TechnologyConstellation && typeof window.TechnologyConstellation.getSectorData === 'function')
        ? window.TechnologyConstellation.getSectorData().length
        : 7;
      const curSec = (window.TechnologyConstellation && typeof window.TechnologyConstellation.getActiveSectorIndex === 'function')
        ? window.TechnologyConstellation.getActiveSectorIndex()
        : (window.GalaxyJourney.getDetailTransitionState ? window.GalaxyJourney.getDetailTransitionState().detailSectorIdx : 0);

      if (dir > 0) {
        if (curSec < totalSectors - 1) {
          const nextSec = curSec + 1;
          if (window.TechnologyConstellation && typeof window.TechnologyConstellation.selectSector === 'function') {
            window.TechnologyConstellation.selectSector(nextSec);
          }
          if (window.GalaxyJourney && typeof window.GalaxyJourney.setActiveDetailSector === 'function') {
            window.GalaxyJourney.setActiveDetailSector(nextSec);
          }
        } else {
          if (window.GalaxyJourney && typeof window.GalaxyJourney.closeConstellationDetail === 'function') {
            window.GalaxyJourney.closeConstellationDetail(true);
          }
          setTargetProgress(0.980, true);
        }
      } else {
        if (curSec > 0) {
          const prevSec = curSec - 1;
          if (window.TechnologyConstellation && typeof window.TechnologyConstellation.selectSector === 'function') {
            window.TechnologyConstellation.selectSector(prevSec);
          }
          if (window.GalaxyJourney && typeof window.GalaxyJourney.setActiveDetailSector === 'function') {
            window.GalaxyJourney.setActiveDetailSector(prevSec);
          }
        } else {
          if (window.GalaxyJourney && typeof window.GalaxyJourney.closeConstellationDetail === 'function') {
            window.GalaxyJourney.closeConstellationDetail();
          }
        }
      }
      return;
    }

    const totalSwipeY = touchStartY - lastTouchY;
    const dir = totalSwipeY > 28 ? 1 : (totalSwipeY < -28 ? -1 : 0);

    if (Math.abs(touchVelocityY) > 0.4) {
      const momentumDelta = Math.max(-0.02, Math.min(0.02, touchVelocityY * 0.025));
      const newTarget = Math.max(0.0, Math.min(1.0, targetProgress + momentumDelta));
      setTargetProgress(newTarget, true);
    }
  }

  /**
   * Keyboard Navigation
   */
  function onKeyDown(e) {
    if (!isSpaceTheme()) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 't' || e.key === 'T') {
      toggleHudMinimization();
      return;
    }

    // Esc skips active auto-play cleanly
    if (e.key === 'Escape' && autoPlayState) {
      e.preventDefault();
      e.stopPropagation();
      if (autoPlayState.type === 'home') {
        triggerSkipToProjects();
      } else {
        triggerSkipToSkyMap();
      }
      return;
    }

    if (isInputLocked()) return;
    if (window.GalaxyJourney && typeof window.GalaxyJourney.isConstellationDetailActive === 'function' && window.GalaxyJourney.isConstellationDetailActive()) return;

    const isFwd = e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ' || e.code === 'Space';
    const isBwd = e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp';

    if (isFwd || isBwd) {
      e.preventDefault();
      if (autoPlayState) {
        interruptAutoPlay();
        return;
      }
      const dir = isFwd ? 1 : -1;

      // Single-action takeoff from docked planet or constellation waypoint
      const PLANET_WAYPOINTS = [0.205, 0.266, 0.327, 0.388, 0.450, 0.511, 0.572];
      const dockedPlanetWp = PLANET_WAYPOINTS.find(wp => Math.abs(targetProgress - wp) <= 0.008);
      const dockedConstellationWp = CONSTELLATION_WAYPOINT_T.find(wp => Math.abs(targetProgress - wp) <= 0.008);

      if (dockedPlanetWp !== undefined) {
        const takeoffOffset = 0.016;
        const newTarget = dir > 0
          ? Math.min(1.0, dockedPlanetWp + takeoffOffset)
          : Math.max(0.0, dockedPlanetWp - takeoffOffset);
        setTargetProgress(newTarget, true);
        return;
      }

      if (dockedConstellationWp !== undefined) {
        const takeoffOffset = 0.016;
        const newTarget = dir > 0
          ? Math.min(1.0, dockedConstellationWp + takeoffOffset)
          : Math.max(0.0, dockedConstellationWp - takeoffOffset);
        setTargetProgress(newTarget, true);
        return;
      }

      const STEP = 0.008; // Deliberate small step
      setTargetProgress(Math.max(0.0, Math.min(1.0, targetProgress + dir * STEP)), true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      interruptAutoPlay();
      setTargetProgress(0.0, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      interruptAutoPlay();
      setTargetProgress(1.0, true);
    }
  }

  /**
   * Build & Inject Cockpit Debug Telemetry Readout (Phase 1 Readout)
   */
  function mountTelemetryHud() {
    if (document.getElementById('journeyTelemetryHud')) {
      hudContainerEl = document.getElementById('journeyTelemetryHud');
      hudProgressFill = document.getElementById('hudProgressFill');
      hudProgressVal = document.getElementById('hudProgressVal');
      hudSectorVal = document.getElementById('hudSectorVal');
      hudTargetVal = document.getElementById('hudTargetVal');
      hudCurrVal = document.getElementById('hudCurrVal');
      hudVelocityVal = document.getElementById('hudVelocityVal');
      hudMotionVal = document.getElementById('hudMotionVal');
      hudLockVal = document.getElementById('hudLockVal');
      const header = document.getElementById('hudTelemetryHeader');
      if (header) {
        header.addEventListener('click', toggleHudMinimization);
      }
      return;
    }

    hudContainerEl = document.createElement('aside');
    hudContainerEl.id = 'journeyTelemetryHud';
    hudContainerEl.className = 'journey-telemetry-hud';
    hudContainerEl.setAttribute('role', 'region');
    hudContainerEl.setAttribute('aria-label', 'Spacecraft Avionics Navigation HUD');

    hudContainerEl.innerHTML = `
      <div class="hud-telemetry-header" id="hudTelemetryHeader" title="Click to Toggle Telemetry Deck (Key: [T])">
        <div class="hud-telemetry-brand">
          <span class="hud-telemetry-pip" aria-hidden="true"></span>
          <span class="hud-brand-title">NAV.AVIONICS // TRACER</span>
        </div>
        <div class="hud-telemetry-actions">
          <span class="hud-lock-badge" id="hudLockVal">SYS.ACTIVE</span>
          <button type="button" class="hud-toggle-btn" id="hudToggleBtn" aria-label="Minimize Telemetry HUD">&minus;</button>
        </div>
      </div>
      <div class="hud-telemetry-body">
        <div class="hud-sector-block">
          <span class="hud-block-label">CURRENT SECTOR</span>
          <div class="hud-sector-name" id="hudSectorVal">01 // SINGULARITY APPROACH</div>
        </div>

        <div class="hud-progress-block">
          <div class="hud-progress-meta">
            <span class="hud-block-label">TRAJECTORY</span>
            <span class="hud-progress-value" id="hudProgressVal">00.0%</span>
          </div>
          <div class="hud-progress-bar-wrap">
            <div class="hud-progress-bar-fill" id="hudProgressFill"></div>
          </div>
        </div>

        <div class="hud-telemetry-grid">
          <div class="hud-grid-cell">
            <span class="hud-grid-label">TARGET t</span>
            <span class="hud-grid-val" id="hudTargetVal">0.0000</span>
          </div>
          <div class="hud-grid-cell">
            <span class="hud-grid-label">CURRENT t</span>
            <span class="hud-grid-val" id="hudCurrVal">0.0000</span>
          </div>
          <div class="hud-grid-cell">
            <span class="hud-grid-label">IMPULSE</span>
            <span class="hud-grid-val" id="hudVelocityVal">+0.0000/f</span>
          </div>
          <div class="hud-grid-cell">
            <span class="hud-grid-label">STATUS</span>
            <span class="hud-grid-val is-green" id="hudMotionVal">SETTLED</span>
          </div>
        </div>
      </div>
      <div class="hud-telemetry-footer">
        <span class="hud-status-chip">
          <span class="hud-status-dot pulse-green"></span>
          AVIONICS LOCK
        </span>
        <span class="hud-key-hint">KEY: [T]</span>
      </div>
    `;

    document.body.appendChild(hudContainerEl);

    // Bind references
    hudProgressFill = document.getElementById('hudProgressFill');
    hudProgressVal = document.getElementById('hudProgressVal');
    hudSectorVal = document.getElementById('hudSectorVal');
    hudTargetVal = document.getElementById('hudTargetVal');
    hudCurrVal = document.getElementById('hudCurrVal');
    hudVelocityVal = document.getElementById('hudVelocityVal');
    hudMotionVal = document.getElementById('hudMotionVal');
    hudLockVal = document.getElementById('hudLockVal');

    // Header click toggles minimization
    const header = document.getElementById('hudTelemetryHeader');
    if (header) {
      header.addEventListener('click', toggleHudMinimization);
    }
    // Collapsed by default across all viewports (unobtrusive chip; expand with click or [T])
    if (hudContainerEl) {
      hudContainerEl.classList.add('is-minimized');
      const toggleBtn = document.getElementById('hudToggleBtn');
      if (toggleBtn) toggleBtn.textContent = '▲';
    }
  }

  function toggleHudMinimization() {
    if (!hudContainerEl) return;
    hudContainerEl.classList.toggle('is-minimized');
    const btn = document.getElementById('hudToggleBtn');
    if (btn) {
      btn.textContent = hudContainerEl.classList.contains('is-minimized') ? '▲' : '▼';
    }
  }

  /**
   * Update Telemetry HUD Readout (Low-overhead DOM updates)
   */
  function updateTelemetryHud() {
    if (!hudContainerEl || !isSpaceTheme()) return;

    const pct = (currentProgress * 100).toFixed(1) + '%';
    if (hudProgressVal) hudProgressVal.textContent = pct;
    if (hudProgressFill) hudProgressFill.style.width = pct;
    if (hudSectorVal) hudSectorVal.textContent = activeSector.name;

    if (hudTargetVal) hudTargetVal.textContent = targetProgress.toFixed(4);
    if (hudCurrVal) hudCurrVal.textContent = currentProgress.toFixed(4);

    if (hudVelocityVal) {
      const vStr = (velocity >= 0 ? '+' : '') + velocity.toFixed(4);
      hudVelocityVal.textContent = vStr + '/f';
    }

    if (hudMotionVal) {
      hudMotionVal.textContent = isMoving ? 'CRUISING' : 'SETTLED';
      hudMotionVal.className = 'hud-grid-val ' + (isMoving ? 'is-amber' : 'is-green');
    }

    if (hudLockVal) {
      const lockReason = getActiveLockReason();
      hudLockVal.textContent = lockReason === 'NONE' ? 'SYS.ACTIVE' : lockReason;
      hudLockVal.className = 'hud-lock-badge ' + (lockReason !== 'NONE' ? 'is-locked' : 'is-clear');
    }
  }

  /**
   * Mount Virtual Scroll Driver Element
   */
  function mountScrollSpineDriver() {
    if (document.getElementById('scrollSpineDriver')) {
      scrollDriverEl = document.getElementById('scrollSpineDriver');
      return;
    }
    scrollDriverEl = document.createElement('div');
    scrollDriverEl.id = 'scrollSpineDriver';
    scrollDriverEl.className = 'scroll-spine-driver';
    scrollDriverEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(scrollDriverEl);
  }

  function mountDebugScrubber() {
    if (typeof window === 'undefined' || !window.location.search.includes('debug=1')) return;
    if (document.getElementById('transitionDebugBar')) return;

    debugBarEl = document.createElement('div');
    debugBarEl.id = 'transitionDebugBar';
    debugBarEl.style.cssText = [
      'position:fixed',
      'top:74px',
      'right:18px',
      'z-index:9998',
      'background:rgba(6,9,16,0.92)',
      'border:1px solid rgba(245,158,11,0.55)',
      'border-radius:6px',
      'padding:8px 12px',
      'display:flex',
      'flex-direction:column',
      'gap:6px',
      'font-family:"Space Mono",monospace',
      'font-size:12px',
      'color:#f8fafc',
      'backdrop-filter:blur(10px)',
      'width:280px'
    ].join(';');

    debugBarEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="color:#f59e0b;font-weight:700;">FLIGHT DEBUG SCRUBBER</span>
        <span id="transitionDebugVal" style="font-size:11px;">p=0.00</span>
      </div>
      <div style="font-size:11px;color:#94a3b8;margin-top:2px;">LEG 1: Home -> Solar System</div>
      <input id="homeDebugSlider" type="range" min="0" max="1" step="0.005" value="0" style="width:100%;cursor:pointer;" />
      <div style="display:flex;gap:4px;flex-wrap:wrap;">
        ${[0, 0.1, 0.25, 0.5, 0.75, 0.88, 1.0].map(v =>
          `<button type="button" data-dbg-home="${v}" style="padding:2px 6px;font-size:11px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#e2e8f0;border-radius:3px;cursor:pointer;">${v}</button>`
        ).join('')}
      </div>
      <div style="font-size:11px;color:#94a3b8;margin-top:6px;">LEG 2: Solar System -> Sky Map</div>
      <input id="transitionDebugSlider" type="range" min="0" max="1" step="0.005" value="0" style="width:100%;cursor:pointer;" />
      <div style="display:flex;gap:4px;flex-wrap:wrap;">
        ${[0, 0.25, 0.55, 0.65, 0.75, 0.85, 1.0].map(v =>
          `<button type="button" data-dbg-p="${v}" style="padding:2px 6px;font-size:11px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#e2e8f0;border-radius:3px;cursor:pointer;">${v}</button>`
        ).join('')}
      </div>
      <div style="font-size:11px;color:#38bdf8;margin-top:6px;">LEG 3: Skills -> Contact</div>
      <input id="contactDebugSlider" type="range" min="0.85" max="1.00" step="0.002" value="0.85" style="width:100%;cursor:pointer;" />
      <div style="display:flex;gap:4px;flex-wrap:wrap;">
        ${[0.85, 0.88, 0.91, 0.94, 0.97, 0.99, 1.00].map(v =>
          `<button type="button" data-dbg-contact="${v}" style="padding:2px 6px;font-size:11px;background:rgba(0,229,255,0.12);border:1px solid rgba(0,229,255,0.4);color:#e0f7fa;border-radius:3px;cursor:pointer;">${v}</button>`
        ).join('')}
      </div>
    `;
    document.body.appendChild(debugBarEl);

    debugSliderEl = document.getElementById('transitionDebugSlider');
    homeSliderEl = document.getElementById('homeDebugSlider');
    const contactSliderEl = document.getElementById('contactDebugSlider');
    debugValEl = document.getElementById('transitionDebugVal');

    if (homeSliderEl) {
      homeSliderEl.addEventListener('input', (e) => {
        setHomeProgress(parseFloat(e.target.value), true);
      });
    }
    debugBarEl.querySelectorAll('[data-dbg-home]').forEach(btn => {
      btn.addEventListener('click', () => {
        setHomeProgress(parseFloat(btn.getAttribute('data-dbg-home')), true);
      });
    });

    if (debugSliderEl) {
      debugSliderEl.addEventListener('input', (e) => {
        setTransitionProgress(parseFloat(e.target.value), true);
      });
    }
    debugBarEl.querySelectorAll('[data-dbg-p]').forEach(btn => {
      btn.addEventListener('click', () => {
        setTransitionProgress(parseFloat(btn.getAttribute('data-dbg-p')), true);
      });
    });

    if (contactSliderEl) {
      contactSliderEl.addEventListener('input', (e) => {
        interruptAutoPlay();
        setTargetProgress(parseFloat(e.target.value), true);
      });
    }
    debugBarEl.querySelectorAll('[data-dbg-contact]').forEach(btn => {
      btn.addEventListener('click', () => {
        interruptAutoPlay();
        setTargetProgress(parseFloat(btn.getAttribute('data-dbg-contact')), true);
      });
    });
  }

  /**
   * Initialize Controller
   */
  function init() {
    if (isInitialized) return;
    isInitialized = true;

    mountScrollSpineDriver();
    mountTelemetryHud();
    mountDebugScrubber();
    setupNavbarNavigation();

    // Event Listeners
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    window.addEventListener('wheel', onWindowWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('hashchange', () => {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash === '#works' || hash === '#projects') {
        interruptAutoPlay();
        setTargetProgress(0.205, true);
      } else if (hash === '#disciplines' || hash === '#skills') {
        interruptAutoPlay();
        setTargetProgress(TRANSITION_T_END, true);
      } else if (hash === '#dispatch' || hash === '#contact') {
        interruptAutoPlay();
        setTargetProgress(1.0, true);
      } else if (hash === '#hero') {
        interruptAutoPlay();
        setTargetProgress(0.0, true);
      }
    });
    // Cancel auto-play cleanly if user clicks anywhere outside Skip/Nav
    window.addEventListener('pointerdown', (e) => {
      if (autoPlayState && e.target && !e.target.closest('#transitionSkipBtn') && !e.target.closest('a[href="#disciplines"]') && !e.target.closest('a[href="#works"]')) {
        interruptAutoPlay();
      }
    }, { passive: true });

    // Initial sync + Direct-Load handling (?t=... or #works / #disciplines / #skills)
    onWindowScroll();
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search || '');
      const initialT = urlParams.get('t');
      const initialP = urlParams.get('p');
      const initialHomeP = urlParams.get('phome');
      const hash = (window.location.hash || '').toLowerCase();
      if (initialHomeP !== null && !isNaN(parseFloat(initialHomeP))) {
        const clampedHP = Math.max(0.0, Math.min(1.0, parseFloat(initialHomeP)));
        currentProgress = targetProgress = HOME_T_START + clampedHP * HOME_SPAN;
      } else if (initialP !== null && !isNaN(parseFloat(initialP))) {
        const clampedP = Math.max(0.0, Math.min(1.0, parseFloat(initialP)));
        currentProgress = targetProgress = TRANSITION_T_START + clampedP * TRANSITION_SPAN;
      } else if (initialT !== null && !isNaN(parseFloat(initialT))) {
        currentProgress = targetProgress = Math.max(0.0, Math.min(1.0, parseFloat(initialT)));
      } else if (hash === '#works' || hash === '#projects') {
        currentProgress = targetProgress = 0.205; // Direct load on Projects skips flight
      } else if (hash === '#disciplines' || hash === '#skills') {
        currentProgress = targetProgress = TRANSITION_T_END;
      }
    }
    updateSectorState();
    updateTelemetryHud();
    syncVisualHandoff(currentProgress, 0.0);
    if (window.GalaxyJourney && typeof window.GalaxyJourney.updateSector01VisualStaging === 'function') {
      window.GalaxyJourney.updateSector01VisualStaging(currentProgress);
    }

    // Start RAF update loop
    lastFrameTime = performance.now();
    rafId = requestAnimationFrame(updateLoop);

    console.log('[MasterJourneyController] Phase 1 Master Scroll Spine initialized.');
  }

  // Public API
  const Controller = {
    init: init,
    on: addEventListener,
    setTargetProgress: setTargetProgress,
    jumpTo: jumpToProgress,
    jumpToProgress: jumpToProgress,
    getHomeProgress: getHomeProgress,
    setHomeProgress: setHomeProgress,
    stepHome: stepHome,
    startAutoPlayToProjects: startAutoPlayToProjects,
    triggerSkipToProjects: triggerSkipToProjects,
    HOME_T_START: HOME_T_START,
    HOME_T_END: HOME_T_END,
    HOME_STEPS: HOME_STEPS,
    getTransitionProgress: getTransitionProgress,
    setTransitionProgress: setTransitionProgress,
    stepTransition: stepTransition,
    startAutoPlayToSkills: startAutoPlayToSkills,
    startAutoPlayToContact: startAutoPlayToContact,
    triggerSkipToSkyMap: triggerSkipToSkyMap,
    TRANSITION_T_START: TRANSITION_T_START,
    TRANSITION_T_END: TRANSITION_T_END,
    TRANSITION_STEPS: TRANSITION_STEPS,
    setLock: setLock,
    isLocked: isInputLocked,
    getLockReason: getActiveLockReason,
    getProgress: () => currentProgress,
    getTargetProgress: () => targetProgress,
    getVelocity: () => velocity,
    isMoving: () => isMoving,
    getActiveSector: () => activeSector,
    getSectorProgress: () => sectorProgress,
    getSectors: () => SECTORS,
    updateCockpitHud: updateCockpitHud,
    syncNavbarActiveState: syncNavbarActiveState,
    toggleTelemetry: toggleHudMinimization,
    suspend: () => { isSuspended = true; },
    resume: () => { isSuspended = false; }
  };

  window.MasterJourneyController = Controller;

  // Auto-init on DOMContentLoaded or immediate if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window, document);
