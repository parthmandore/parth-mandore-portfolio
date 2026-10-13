import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { education, profile } from '../data/portfolio';
import { SectionHeading } from './fx';
import { CINE_EASE } from './CinematicTypography';
import { useScrollDownTrigger } from '../hooks/useScrollDirectionTrigger';
import { useReducedMotionPref } from '../hooks/useMedia';
import './About.css';

/**
 * About page portrait card ported from Light theme's homepage portrait:
 * - Dual photograph layering: sharp base (/assets/parth.jpg) + cutout (/assets/parth-cutout.png).
 * - Exact pointer-responsive 3D tilt calculation (-12deg to +12deg) with RAF.
 * - Cutout pop-out on hover with translate3d(0, -32px, 80px) and deep drop-shadow.
 * - Background photo dims (brightness 0.35) and blurs (blur 4px) on hover.
 * - Specular dynamic glare on glass panel following cursor (px%, py%).
 * - Parallax translations on cutout, base image, and ambient glow backdrop.
 * - Smooth cubic-bezier reset on mouseleave.
 * - Netflix editorial overlay (STARRING Parth Mandore, S01–S05) floating in 3D foreground.
 */
function AboutPortrait() {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const cutout = card.querySelector('.netflix-cutout-wrapper') as HTMLElement | null;
    const bgImage = card.querySelector('.netflix-card-bg-image') as HTMLElement | null;
    const glow = container.querySelector('.netflix-profile-glow-backdrop') as HTMLElement | null;
    const glassPanel = card.querySelector('.netflix-card-glass-panel') as HTMLElement | null;

    const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasPointer || prefersReduced) return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

        if (cutout) {
          cutout.style.transform = `translateZ(44px) scale(1.04) translate(${(rotateY * 0.4).toFixed(1)}px, ${(-rotateX * 0.4).toFixed(1)}px)`;
        }
        if (bgImage) {
          bgImage.style.transform = `translateZ(-12px) scale(1.02)`;
        }
        if (glow) {
          glow.style.transform = `translate(${(-rotateY * 1.5).toFixed(1)}px, ${(rotateX * 1.5).toFixed(1)}px)`;
        }
        if (glassPanel) {
          const px = ((x / rect.width) * 100).toFixed(1);
          const py = ((y / rect.height) * 100).toFixed(1);
          glassPanel.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.18) 0%, transparent 60%)`;
        }
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafId);
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      if (cutout) {
        cutout.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        cutout.style.transform = 'translateZ(0px) scale(1) translate(0px, 0px)';
      }
      if (bgImage) {
        bgImage.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        bgImage.style.transform = 'translateZ(0px) scale(1)';
      }
      if (glow) {
        glow.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        glow.style.transform = 'translate(0px, 0px)';
      }
      if (glassPanel) {
        glassPanel.style.background = '';
      }
      setTimeout(() => {
        card.style.transition = '';
        if (cutout) cutout.style.transition = '';
        if (bgImage) bgImage.style.transition = '';
        if (glow) glow.style.transition = '';
      }, 600);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      cancelAnimationFrame(rafId);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="netflix-about-profile">
      <div className="netflix-profile-glow-backdrop" />
      <div className="netflix-profile-particles">
        <span className="netflix-particle p-1" />
        <span className="netflix-particle p-2" />
        <span className="netflix-particle p-3" />
        <span className="netflix-particle p-4" />
      </div>
      <div
        ref={cardRef}
        tabIndex={0}
        data-cursor="view"
        aria-label={`Portrait of ${profile.displayName}`}
        className="netflix-profile-3d-card"
      >
        <div className="netflix-card-border-ring">
          <div className="netflix-card-glass-panel">
            <div className="netflix-card-edge-light" />
            <div className="netflix-card-image-wrapper">
              <img
                src="/assets/parth.jpg"
                className="netflix-card-bg-image"
                alt={profile.displayName}
                loading="lazy"
              />
              <div className="netflix-card-image-overlay" />
              <div className="netflix-card-depth-shading" />
            </div>
          </div>
        </div>
        <div className="netflix-cutout-wrapper">
          <img
            src="/assets/parth-cutout.png"
            className="netflix-card-cutout-image"
            alt={`${profile.displayName} Cutout`}
            loading="lazy"
          />
        </div>

        {/* Netflix Editorial Floating Typography Overlay */}
        <div className="netflix-card-editorial-overlay">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-crimson-2 uppercase">STARRING</p>
            <p className="font-display text-3xl leading-none text-bone drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
              {profile.displayName}
            </p>
          </div>
          <span className="rounded border border-white/30 px-1.5 text-[10px] font-bold text-bone backdrop-blur bg-black/40">
            S01–S05
          </span>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const { ref: sectionRef, hasEntered } = useScrollDownTrigger<HTMLDivElement>(0.85);
  const reduced = useReducedMotionPref();

  const facts = [
    {
      k: 'Education',
      v: 'B.Tech, Computer Eng',
      s: `${education[0].school} · CGPA 7.68 / 10 (Through Sem VI)`,
      highlight: true,
    },
    {
      k: 'Focus Area',
      v: 'Backend & Applied AI',
      s: 'Software Project Development · 2024–Present',
      highlight: false,
    },
    {
      k: 'Primary Stack',
      v: 'Java & Spring Boot',
      s: 'with Python, TypeScript, SQL',
      highlight: false,
    },
    {
      k: 'Based in',
      v: profile.location,
      s: 'India',
      highlight: false,
    },
  ];

  return (
    <div ref={sectionRef} className="relative">
      <SectionHeading kicker="The Pilot" title="About Me" />

      <div className="gutter grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        {/* PORTRAIT INTERACTIVE CARD */}
        <motion.div
          className="mx-auto w-full max-w-md lg:max-w-none"
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
          animate={
            hasEntered || reduced
              ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
              : { opacity: 0, scale: 0.92, filter: 'blur(8px)' }
          }
          transition={{ duration: 1.1, ease: CINE_EASE }}
        >
          <AboutPortrait />
        </motion.div>

        {/* EDITORIAL CONTENT */}
        <div>
          {/* Quote enters gently from LEFT when scrolling down; stays rock stable on scroll up */}
          <div className="relative overflow-hidden pb-2">
            <motion.p
              className="font-serif text-[clamp(1.6rem,3.2vw,2.5rem)] italic leading-[1.2] text-bone"
              initial={{ x: '-60px', opacity: 0 }}
              animate={
                hasEntered || reduced
                  ? { x: '0%', opacity: 1 }
                  : { x: '-60px', opacity: 0 }
              }
              transition={{ duration: 1.35, ease: CINE_EASE }}
            >
              “{profile.intro}”
            </motion.p>
          </div>

          {/* Attribution enters gently from RIGHT */}
          <div className="relative overflow-hidden mt-3">
            <motion.p
              className="text-sm font-medium text-mist flex items-center gap-2"
              initial={{ x: '50px', opacity: 0 }}
              animate={
                hasEntered || reduced
                  ? { x: '0%', opacity: 1 }
                  : { x: '50px', opacity: 0 }
              }
              transition={{ duration: 1.3, delay: 0.15, ease: CINE_EASE }}
            >
              <span className="h-px w-6 bg-crimson" />
              <span>— {profile.fullName}</span>
            </motion.p>
          </div>

          {/* Facts grid with controlled stagger */}
          <motion.dl
            className="mt-10 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2"
            initial="hidden"
            animate={hasEntered || reduced ? 'show' : 'hidden'}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.12, delayChildren: 0.2 },
              },
            }}
          >
            {facts.map((f) => (
              <motion.div
                key={f.k}
                className="bg-ink-2 p-5 relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.85, ease: CINE_EASE },
                  },
                }}
              >
                {f.highlight && (
                  <div className="absolute top-0 right-0 h-1.5 w-16 bg-gradient-to-l from-crimson to-transparent" />
                )}
                <dt className="text-[10px] font-bold uppercase tracking-[0.28em] text-smoke flex items-center gap-1.5">
                  {f.highlight && <span className="h-1.5 w-1.5 rounded-full bg-crimson" />}
                  <span>{f.k}</span>
                </dt>
                <dd className="mt-2 text-base font-semibold text-bone">{f.v}</dd>
                <dd className="mt-0.5 text-xs text-mist">{f.s}</dd>
              </motion.div>
            ))}
          </motion.dl>

          <div className="mt-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-smoke flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-crimson" />
              <span>Interests</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, idx) => (
                <motion.span
                  key={interest}
                  className="glass rounded-full px-3 py-1.5 text-xs font-medium text-bone hover:border-crimson/40 transition-colors"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={hasEntered || reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: 0.35 + idx * 0.05 }}
                >
                  {interest}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
