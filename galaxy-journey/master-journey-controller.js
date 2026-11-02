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
      range: [0.18, 0.65], 
      checkpoint: 0.22,
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
      range: [0.65, 0.75], 
      checkpoint: 0.68,
      navModeKey: 'transit',
      sysMode: 'SYS.VOID // INTERSTELLAR VOID TRANSIT',
      coords: 'DEEP SPACE VOID // RANGE: 42,000 AU',
      status: 'STATUS: RELATIVISTIC CRUISE ACTIVE',
      directorLabel: 'TRANSIT // WARP VECTOR',
      showDirector: true,
      desc: 'Relativistic Departure Corridor' 
    },
    { 
      id: 4, 
      name: '04 // ASTROMETRIC INVENTORY SCAN', 
      hudMode: 'ASTROMETRIC INVENTORY SCAN',
      range: [0.75, 0.90], 
      checkpoint: 0.85,
      navModeKey: 'skills',
      sysMode: 'SYS.DIAG // ASTROMETRIC INVENTORY SCAN',
      coords: 'ASTROMETRIC GRID // 39 SUBSYSTEMS VERIFIED',
      status: 'STATUS: COMPILER & STACK MATRIX SYNCHRONIZED',
      directorLabel: 'DIAG // MATRIX ONLINE',
      showDirector: false,
      desc: '3D Astrometric Technology Monoliths' 
    },
    { 
      id: 5, 
      name: '05 // BEACON NEXUS TRANSMISSION', 
      hudMode: 'BEACON NEXUS TRANSMISSION',
      range: [0.90, 1.00], 
      checkpoint: 0.96,
      navModeKey: 'contact',
      sysMode: 'SYS.COMM // BEACON NEXUS TRANSMISSION',
      coords: 'CARRIER: 1420.405 MHz // GAIN: +18dB',
      status: 'STATUS: UPLINK READY • SECURE CHANNEL OPEN',
      directorLabel: 'COMM // BEACON LOCK',
      showDirector: true,
      desc: 'Deep Space Dispatch Beacon' 
    }
  ];

  // Motion Tuning Constants
  const DEAD_BAND_EPSILON = 0.00008; // Strictly halts camera when delta is sub-pixel
  const DAMPING_FACTOR = 0.085;       // Critical damping rate per frame (~60fps)
  const TOUCH_SENSITIVITY = 0.00032;  // Normalized progress change per touch pixel

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
  function updateCockpitHud(s, t) {
    if (!isSpaceTheme()) return;

    // 1. Cockpit Section Label & HUD Mode Text
    const cockpitSection = document.getElementById('cockpitSectionLabel');
    const expectedSection = `SECTOR ${s.name}`;
    if (cockpitSection && cockpitSection.textContent !== expectedSection) {
      cockpitSection.textContent = expectedSection;
    }

    const navModeText = document.getElementById('cockpitNavModeText');
    const expectedNavMode = `MODE: ${s.hudMode}`;
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

    // 3. Telemetry Deck Values
    const sysModeEl = document.getElementById('cockpitSysMode');
    if (sysModeEl && sysModeEl.textContent !== s.sysMode) {
      sysModeEl.textContent = s.sysMode;
    }

    const coordsEl = document.getElementById('cockpitFlightCoords');
    if (coordsEl) {
      if (s.id !== 2 || !coordsEl.getAttribute('data-target-locked')) {
        if (coordsEl.textContent !== s.coords) {
          coordsEl.textContent = s.coords;
        }
      }
    }

    const statusEl = document.getElementById('cockpitStatusVal');
    if (statusEl) {
      if (s.id !== 2 || !statusEl.getAttribute('data-target-locked')) {
        if (statusEl.textContent !== s.status) {
          statusEl.textContent = s.status;
        }
      }
    }

    const directorEl = document.getElementById('cockpitTargetDirector');
    if (directorEl) {
      directorEl.style.opacity = s.showDirector ? '0.36' : '0';
      directorEl.style.visibility = s.showDirector ? 'visible' : 'hidden';
    }

    const directorLabelEl = document.getElementById('cockpitDirectorReadout');
    if (directorLabelEl && directorLabelEl.textContent !== s.directorLabel) {
      directorLabelEl.textContent = s.directorLabel;
    }

    // 4. Update Navbar Links Active State
    syncNavbarActiveState(t);
  }

  function syncNavbarActiveState(t) {
    let activeId = 'hero';
    if (t < 0.18) {
      activeId = 'hero';
    } else if (t < 0.75) {
      activeId = 'works';
    } else if (t < 0.90) {
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

  function setupNavbarNavigation() {
    const navCheckpoints = {
      '#hero': 0.00,
      '#works': 0.22,
      '#disciplines': 0.85,
      '#dispatch': 0.96
    };

    const links = document.querySelectorAll('#spaceNavLinks a, #atelier-header a[href^="#"], .brand-monogram, .footer-nav-link[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', function (e) {
        if (!isSpaceTheme()) return;

        const href = this.getAttribute('href') || (this.classList.contains('brand-monogram') ? '#hero' : null);
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
    const heroLayout = document.querySelector('#hero .space-hero-unified-layout') || document.querySelector('#hero .hero-layout');
    const bhContainer = document.getElementById('blackHoleContainer');
    const bhIntroHud = document.getElementById('blackHoleIntroHud');

    // ── 1. SECTOR 01: SINGULARITY CORE & HANDOFF WINDOW (0.00 <= t <= 0.18) ──
    if (t <= 0.18) {
      // Ensure Black Hole engine is running RAF loop
      if (window.SpaceBlackHoleHero3D && typeof window.SpaceBlackHoleHero3D.resume === 'function') {
        window.SpaceBlackHoleHero3D.resume();
      }

      // Phase B 5-Stage Transition Window (0.00 <= t <= 0.18)
      // Hero Canvas Opacity: Solid 1.0 from t=0 to 0.09 (Stages 1 & 2),
      // then soft Hermite crossfade 1.0 -> 0.0 across [0.09, 0.14] (Stage 3 Deep Space Transit)
      let heroCanvasAlpha = 1.0;
      if (t > 0.09) {
        const fadeU = Math.min(1.0, (t - 0.09) / 0.05);
        const smoothFade = fadeU * fadeU * (3.0 - 2.0 * fadeU);
        heroCanvasAlpha = Math.max(0.0, 1.0 - smoothFade);
      }

      if (heroCanvas) {
        heroCanvas.style.opacity = heroCanvasAlpha.toFixed(4);
        heroCanvas.style.display = heroCanvasAlpha > 0.0001 ? 'block' : 'none';
        heroCanvas.style.visibility = heroCanvasAlpha > 0.0001 ? 'visible' : 'hidden';
      }

      // Hero Text Monograph & Intro HUD: Crisp and readable through Stage 1 (t <= 0.04),
      // then smooth leftward drift & fade across [0.04, 0.085]
      let textFade = 1.0;
      if (t > 0.04) {
        const rawT = Math.min(1.0, (t - 0.04) / 0.045);
        textFade = Math.max(0.0, 1.0 - rawT * rawT * (3.0 - 2.0 * rawT));
      }
      const textSlideX = -180.0 * (1.0 - textFade);

      if (heroLayout) {
        heroLayout.style.opacity = textFade.toFixed(3);
        heroLayout.style.transform = `translate3d(${textSlideX.toFixed(2)}px, 0, 0)`;
        heroLayout.style.pointerEvents = t > 0.06 ? 'none' : 'auto';
      }

      if (bhIntroHud) {
        bhIntroHud.style.opacity = textFade.toFixed(3);
        bhIntroHud.style.pointerEvents = t > 0.06 ? 'none' : 'auto';
      }

      if (bhContainer) {
        bhContainer.style.pointerEvents = t > 0.05 ? 'none' : 'auto';
      }
    } 
    // ── 2. SECTOR 02+: DEEP SPACE EXPLORATION & PLANETARY CORRIDOR (t > 0.18) ──
    else {
      // Fully transitioned past the Singularity
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
    }

    // ── 3. DIRECTIONAL MOTION WARP STREAKS (Phase 2B Requirement 4) ──
    // As spacecraft accelerates through the transition window t in [0.06, 0.22],
    // velocity stretches stars into subtle directional streaks
    if (window.GalaxyJourney && typeof window.GalaxyJourney.getPostMaterial === 'function') {
      const postMat = window.GalaxyJourney.getPostMaterial();
      if (postMat && postMat.uniforms && postMat.uniforms.uMotionBlur) {
        const absVel = Math.abs(v || 0.0);
        let motionBlur = 0.0;
        if (t >= 0.05 && t <= 0.25) {
          // Dynamic velocity-proportional stretch during transit corridor
          motionBlur = Math.min(0.85, absVel * 95.0 + (isMoving ? 0.18 : 0.0));
        } else {
          motionBlur = Math.min(0.60, absVel * 60.0);
        }
        postMat.uniforms.uMotionBlur.value = motionBlur;
      }
    }

    // ── 4. SECTOR 04 & SECTOR 05: TECHNOLOGY & BEACON NEXUS HANDOFF ──
    if (window.GalaxyJourney) {
      if (t >= 0.75 && t <= 0.90) {
        const pSkills = (t - 0.75) / 0.15;
        if (typeof window.GalaxyJourney.updateSkillsDiscoveryProgress === 'function') {
          window.GalaxyJourney.updateSkillsDiscoveryProgress(pSkills);
        }
        if (typeof window.GalaxyJourney.updateBeaconNexusProgress === 'function') {
          window.GalaxyJourney.updateBeaconNexusProgress(0.0);
        }
      } else if (t > 0.90) {
        // Sector 05: Beacon Nexus
        const pBeacon = Math.min(1.0, (t - 0.90) / 0.10);
        if (typeof window.GalaxyJourney.updateSkillsDiscoveryProgress === 'function') {
          window.GalaxyJourney.updateSkillsDiscoveryProgress(0.0);
        }
        if (typeof window.GalaxyJourney.updateBeaconNexusProgress === 'function') {
          window.GalaxyJourney.updateBeaconNexusProgress(pBeacon);
        }
      } else {
        // t < 0.75
        if (typeof window.GalaxyJourney.updateSkillsDiscoveryProgress === 'function') {
          window.GalaxyJourney.updateSkillsDiscoveryProgress(0.0);
        }
        if (typeof window.GalaxyJourney.updateBeaconNexusProgress === 'function') {
          window.GalaxyJourney.updateBeaconNexusProgress(0.0);
        }
      }
    }
  }

  /**
   * Main Frame Loop (Critically Damped Motion Solver)
   */
  function updateLoop(now) {
    rafId = requestAnimationFrame(updateLoop);

    if (isSuspended || !isSpaceTheme()) {
      return;
    }

    const deltaMs = Math.min(64, now - lastFrameTime);
    lastFrameTime = now;

    // Critically Damped Solver with Deadband Snap
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
      // Damped step with framerate compensation
      const frameDamp = 1.0 - Math.pow(1.0 - DAMPING_FACTOR, deltaMs / 16.67);
      currentProgress += diff * frameDamp;
      velocity = currentProgress - previousProgress;
      isMoving = true;
      updateSectorState();
      triggerEvent('update', currentProgress);
      updateTelemetryHud();
    }
    syncVisualHandoff(currentProgress, velocity);
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

    // Check if target is inside an isolated scroll container
    const targetEl = (e.target && typeof e.target.closest === 'function') ? e.target : null;
    const isInsideIsolatedContainer = Boolean(
      targetEl && (
        targetEl.closest('#projectDossierCard') ||
        targetEl.closest('#projectExperienceModal') ||
        targetEl.closest('.dossier-scroll-pane') ||
        targetEl.closest('.modal-scrollable-body') ||
        targetEl.closest('.blackhole-intro-hud') ||
        targetEl.closest('#galaxyDossierCard') ||
        targetEl.closest('#galaxySpacecraftDossier') ||
        targetEl.closest('.dossier-panel-scroll') ||
        targetEl.closest('.experience-dossier-grid') ||
        targetEl.closest('.dossier-screen-panel')
      )
    );

    if (isInsideIsolatedContainer) {
      // Allow internal scrolling on the dossier/modal card without advancing journey
      return;
    }

    if (isInputLocked()) {
      return;
    }

    // Normalized delta (pixels vs lines vs pages)
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 24;      // Line mode
    else if (e.deltaMode === 2) delta *= 800; // Page mode

    // Modulate target progress
    // Phase C Requirement 1: Calibrated interplanetary pacing
    // Sector 02 has ~2.8x higher scroll resolution for slow, immersive cinematic planetary exploration
    let divisor = 3200;
    if (targetProgress >= 0.16 && targetProgress <= 0.68) {
      divisor = 7000;
    }
    const scrollDeltaProgress = (delta / divisor);
    const newTarget = Math.max(0.0, Math.min(1.0, targetProgress + scrollDeltaProgress));
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

    const currentY = e.touches[0].clientY;
    const deltaY = lastTouchY - currentY;
    const now = performance.now();
    const timeDelta = Math.max(1, now - lastTouchTime);

    touchVelocityY = deltaY / timeDelta;
    lastTouchY = currentY;
    lastTouchTime = now;

    const newTarget = Math.max(0.0, Math.min(1.0, targetProgress + (deltaY * TOUCH_SENSITIVITY)));
    setTargetProgress(newTarget, true);
  }

  function onTouchEnd() {
    if (!touchActive) return;
    touchActive = false;

    // Apply brief touch momentum
    if (Math.abs(touchVelocityY) > 0.4 && !isInputLocked()) {
      const momentumDelta = touchVelocityY * 0.045;
      const newTarget = Math.max(0.0, Math.min(1.0, targetProgress + momentumDelta));
      setTargetProgress(newTarget, true);
    }
  }

  /**
   * Keyboard Navigation
   */
  function onKeyDown(e) {
    if (!isSpaceTheme()) return;

    // Do not interfere if user is typing in a form input or textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 't' || e.key === 'T') {
      toggleHudMinimization();
      return;
    }

    if (isInputLocked()) return;

    const STEP = 0.02;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      setTargetProgress(Math.min(1.0, targetProgress + STEP), true);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      setTargetProgress(Math.max(0.0, targetProgress - STEP), true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setTargetProgress(0.0, true);
    } else if (e.key === 'End') {
      e.preventDefault();
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
    hudContainerEl.setAttribute('aria-label', 'Master Journey Telemetry Telemetry Deck');

    hudContainerEl.innerHTML = `
      <div class="hud-telemetry-header" id="hudTelemetryHeader" title="Click to Toggle Telemetry Deck (Key: [T])">
        <div class="hud-telemetry-title">
          <span class="hud-telemetry-pip"></span>
          <span>JOURNEY TELEMETRY // P-1</span>
        </div>
        <button type="button" class="hud-toggle-btn" id="hudToggleBtn" aria-label="Minimize Telemetry HUD">&minus;</button>
      </div>
      <div class="hud-telemetry-body">
        <div class="hud-telemetry-row">
          <span class="hud-telemetry-label">PROGRESS:</span>
          <span class="hud-telemetry-value is-amber" id="hudProgressVal">00.0%</span>
        </div>
        <div class="hud-telemetry-row">
          <span class="hud-telemetry-label">SECTOR:</span>
          <span class="hud-telemetry-value is-cyan" id="hudSectorVal">01 // SINGULARITY</span>
        </div>
        <div class="hud-telemetry-row">
          <span class="hud-telemetry-label">TARGET t:</span>
          <span class="hud-telemetry-value" id="hudTargetVal">0.0000</span>
        </div>
        <div class="hud-telemetry-row">
          <span class="hud-telemetry-label">CURRENT t:</span>
          <span class="hud-telemetry-value" id="hudCurrVal">0.0000</span>
        </div>
        <div class="hud-telemetry-row">
          <span class="hud-telemetry-label">VELOCITY:</span>
          <span class="hud-telemetry-value" id="hudVelocityVal">0.0000/f</span>
        </div>
        <div class="hud-telemetry-row">
          <span class="hud-telemetry-label">STATUS:</span>
          <span class="hud-telemetry-value is-green" id="hudMotionVal">SETTLED</span>
        </div>
        <div class="hud-telemetry-row">
          <span class="hud-telemetry-label">INPUT LOCK:</span>
          <span class="hud-telemetry-value" id="hudLockVal">NONE</span>
        </div>
        <div class="hud-progress-bar-wrap">
          <div class="hud-progress-bar-fill" id="hudProgressFill"></div>
        </div>
      </div>
      <div class="hud-telemetry-footer">
        <span>PHASE 1 SPINAL RIG</span>
        <span>KEY: [T] HIDE</span>
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
    // Auto-minimize on laptop & tablet screens (<=1400px) for unobtrusive cockpit avionics
    if (window.innerWidth <= 1400 && hudContainerEl) {
      hudContainerEl.classList.add('is-minimized');
      const toggleBtn = document.getElementById('hudToggleBtn');
      if (toggleBtn) toggleBtn.textContent = '+';
    }
  }

  function toggleHudMinimization() {
    if (!hudContainerEl) return;
    hudContainerEl.classList.toggle('is-minimized');
    const btn = document.getElementById('hudToggleBtn');
    if (btn) {
      btn.textContent = hudContainerEl.classList.contains('is-minimized') ? '+' : '−';
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
      hudMotionVal.className = 'hud-telemetry-value ' + (isMoving ? 'is-amber' : 'is-green');
    }

    if (hudLockVal) {
      const lockReason = getActiveLockReason();
      hudLockVal.textContent = lockReason;
      hudLockVal.className = 'hud-telemetry-value ' + (lockReason !== 'NONE' ? 'is-amber' : 'is-green');
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

  /**
   * Initialize Controller
   */
  function init() {
    if (isInitialized) return;
    isInitialized = true;

    mountScrollSpineDriver();
    mountTelemetryHud();
    setupNavbarNavigation();

    // Event Listeners
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    window.addEventListener('wheel', onWindowWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    // Initial sync
    onWindowScroll();
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
