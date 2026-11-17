/**
 * LUMINOUS IDENTITY SCAN & TRANSIT SYSTEM (Phase 3 Beacon Nexus)
 * Traces Parth Mandore's portrait using pure white luminous light,
 * subtle particles, controlled light trails, and restrained glow.
 * 
 * Replaces obsolete hardware projector/pedestal and scanline glitches.
 */

(function () {
  'use strict';

  let container = null;
  let canvas = null;
  let ctx = null;
  let animId = null;
  let isRunning = false;
  let outlineImg = null;
  let imgLoaded = false;

  // Animation State
  let currentProgress = 0.0; // masterT
  let illuminationProgress = 0.0; // 0.0 -> 1.0 across masterT [0.935, 0.980]
  let time = 0.0;
  let mouseTarget = { x: 0, y: 0 };
  let mouseCurrent = { x: 0, y: 0 };

  // Particles & Light Trails
  const PARTICLE_COUNT = 36;
  const particles = [];

  function createParticle(w, h, randomY = false) {
    // Generate particles concentrated around the silhouette bounds
    const rx = 0.25 + Math.random() * 0.50;
    const ry = randomY ? (0.15 + Math.random() * 0.75) : (0.80 + Math.random() * 0.15);
    return {
      x: rx * w,
      y: ry * h,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -0.35 - Math.random() * 0.75, // drift gently upward
      size: 1.0 + Math.random() * 1.8,
      alpha: 0.1 + Math.random() * 0.65,
      maxAlpha: 0.5 + Math.random() * 0.45,
      decay: 0.003 + Math.random() * 0.006,
      history: []
    };
  }

  function initParticles(w, h) {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(w, h, true));
    }
  }

  function init(targetContainer) {
    container = targetContainer || document.getElementById('luminousIdentityStage');
    if (!container) return;

    canvas = document.getElementById('luminousPortraitCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'luminousPortraitCanvas';
      canvas.className = 'luminous-portrait-canvas';
      container.appendChild(canvas);
    }

    ctx = canvas.getContext('2d');
    resize();

    if (!outlineImg) {
      outlineImg = new Image();
      outlineImg.onload = function () {
        imgLoaded = true;
        render();
      };
      // Try themes path first, fallback to relative assets
      outlineImg.src = 'themes/space/assets/parth-luminous-outline.png';
      outlineImg.onerror = function () {
        outlineImg.src = 'assets/parth-luminous-outline.png';
        outlineImg.onload = function () {
          imgLoaded = true;
          render();
        };
      };
    }

    // Window Resize Handler
    window.addEventListener('resize', onResize);

    // Mouse Move Parallax Handler
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    start();
  }

  function resize() {
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(280, rect.width || 360);
    const h = Math.max(380, rect.height || 480);

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    if (particles.length === 0) {
      initParticles(w, h);
    }
  }

  function onResize() {
    resize();
  }

  function onMouseMove(e) {
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.5;
    mouseTarget.x = (e.clientX - cx) / cx; // -1 to 1
    mouseTarget.y = (e.clientY - cy) / cy; // -1 to 1
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    loop();
  }

  function stop() {
    isRunning = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  function updateFlightProgress(masterT) {
    currentProgress = typeof masterT === 'number' ? Math.max(0.0, Math.min(1.0, masterT)) : 0.0;
    
    // Map masterT [0.935, 0.980] to illuminationProgress [0.0, 1.0]
    if (currentProgress < 0.935) {
      illuminationProgress = 0.0;
    } else if (currentProgress >= 0.980) {
      illuminationProgress = 1.0;
    } else {
      illuminationProgress = (currentProgress - 0.935) / (0.980 - 0.935);
    }
    render();
  }

  function loop() {
    if (!isRunning) return;
    time += 0.016;

    // Smooth mouse tilt lerp
    mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.05;
    mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.05;

    render();
    animId = requestAnimationFrame(loop);
  }

  function render() {
    if (!ctx || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // If before appearance threshold, exit cleanly
    if (illuminationProgress <= 0.001) {
      ctx.restore();
      return;
    }

    // 3D Parallax Tilt Shift
    const tiltX = mouseCurrent.x * 10; // +/- 10px horizontal
    const tiltY = mouseCurrent.y * 8;  // +/- 8px vertical

    ctx.save();
    ctx.translate(tiltX, tiltY);

    // 1. Draw Glowing Outline Portrait
    if (imgLoaded && outlineImg) {
      // Calculate aspect-fit scaling to fill upper 80% of canvas
      const imgAspect = outlineImg.width / outlineImg.height;
      const targetH = h * 0.86;
      const targetW = targetH * imgAspect;
      const drawX = (w - targetW) * 0.5;
      const drawY = (h - targetH) * 0.38;

      // Master Opacity tied to illumination progress
      const baseAlpha = Math.min(1.0, illuminationProgress * 1.25);
      
      // Gentle breathing glow (subtle, 0.94 -> 1.00)
      const breathe = 0.94 + 0.06 * Math.sin(time * 1.8);
      const portraitAlpha = baseAlpha * breathe;

      ctx.save();

      // Progressive Illumination: Reveal from bottom to top as illuminationProgress increases
      if (illuminationProgress < 0.999) {
        // Cutoff line travels from bottom to top
        const cutoffY = drawY + targetH * (1.0 - illuminationProgress);
        ctx.beginPath();
        ctx.rect(drawX - 20, cutoffY, targetW + 40, drawY + targetH - cutoffY + 20);
        ctx.clip();

        // Draw active laser sweep line at cutoff edge
        const sweepGrad = ctx.createLinearGradient(drawX, cutoffY, drawX + targetW, cutoffY);
        sweepGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.0)');
        sweepGrad.addColorStop(0.2, 'rgba(56, 189, 248, 0.7)');
        sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
        sweepGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.7)');
        sweepGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

        ctx.strokeStyle = sweepGrad;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(drawX - 15, cutoffY);
        ctx.lineTo(drawX + targetW + 15, cutoffY);
        ctx.stroke();
      }

      // Draw portrait outline with restrained luminous glow
      ctx.globalAlpha = portraitAlpha;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.75)';
      ctx.shadowBlur = 10;
      ctx.drawImage(outlineImg, drawX, drawY, targetW, targetH);

      // Second soft atmospheric aura pass (additive)
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = portraitAlpha * 0.35;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      ctx.shadowBlur = 22;
      ctx.drawImage(outlineImg, drawX, drawY, targetW, targetH);

      ctx.restore();
    }

    // 2. Render Floating Stardust Particles & Light Trails
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Update particle physics
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      // Record light trail history
      p.history.push({ x: p.x, y: p.y });
      if (p.history.length > 5) {
        p.history.shift();
      }

      // Respawn particle if expired
      if (p.alpha <= 0 || p.y < 20 || p.x < 10 || p.x > w - 10) {
        particles[i] = createParticle(w, h, false);
        continue;
      }

      // Only render if portrait is visibly illuminated
      const pAlpha = p.alpha * illuminationProgress;
      if (pAlpha <= 0.01) continue;

      // Draw light trail
      if (p.history.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.history[0].x, p.history[0].y);
        for (let j = 1; j < p.history.length; j++) {
          ctx.lineTo(p.history[j].x, p.history[j].y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${(pAlpha * 0.35).toFixed(3)})`;
        ctx.lineWidth = p.size * 0.6;
        ctx.stroke();
      }

      // Draw particle core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha.toFixed(3)})`;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
      ctx.shadowBlur = 6;
      ctx.fill();
    }

    ctx.restore(); // Restore particles
    ctx.restore(); // Restore tilt
    ctx.restore(); // Restore scale
  }

  // Telemetry metrics export
  function getMetrics() {
    return {
      status: illuminationProgress >= 0.98 ? 'illuminated' : (illuminationProgress > 0 ? 'scanning' : 'dormant'),
      illuminationProgress: Number(illuminationProgress.toFixed(3)),
      masterProgress: Number(currentProgress.toFixed(3)),
      particlesActive: particles.length,
      imageLoaded: imgLoaded
    };
  }

  function destroy() {
    stop();
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMouseMove);
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    canvas = null;
    ctx = null;
  }

  // Expose Global API
  const LuminousIdentityStage = {
    init: init,
    start: start,
    stop: stop,
    updateFlightProgress: updateFlightProgress,
    getMetrics: getMetrics,
    destroy: destroy
  };

  window.LuminousIdentityStage = LuminousIdentityStage;

  // Backwards compatibility alias for any existing telemetry or test hooks
  window.HologramProjectorStage = LuminousIdentityStage;

  // Auto-init on DOMContentLoaded if stage container exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      const stage = document.getElementById('luminousIdentityStage') || document.getElementById('holoEmitterStage');
      if (stage) init(stage);
    });
  } else {
    const stage = document.getElementById('luminousIdentityStage') || document.getElementById('holoEmitterStage');
    if (stage) init(stage);
  }
})();
