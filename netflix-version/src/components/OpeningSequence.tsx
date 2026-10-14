import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import { useReducedMotionPref } from '../hooks/useMedia';
import { EASE } from './fx';

/**
 * Cinematic cohesive entry sequence:
 * black → studio card → PARTH → PORTFOLIO → portrait reveal → role → seamless transition to hero
 * Auto-advances cleanly into the main portfolio, or immediately upon user click / skip.
 */
const TIMELINE = [
  { at: 200, beat: 1 },  // studio card
  { at: 1000, beat: 2 }, // PARTH title
  { at: 1600, beat: 3 }, // PORTFOLIO badge
  { at: 2200, beat: 4 }, // portrait reveal
  { at: 2800, beat: 5 }, // role & tagline
  { at: 3800, beat: 6 }, // auto-advance into main portfolio
];

export default function OpeningSequence({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotionPref();
  const [beat, setBeat] = useState(reduced ? 6 : 0);

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }
    const timers = TIMELINE.map(({ at, beat: b }) =>
      window.setTimeout(() => {
        setBeat(b);
        if (b === 6) {
          onDone();
        }
      }, at)
    );
    return () => timers.forEach(clearTimeout);
  }, [reduced, onDone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onDone();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[120] cursor-pointer overflow-hidden bg-black select-none"
      onClick={onDone}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
      transition={{ duration: 0.85, ease: EASE }}
      role="dialog"
      aria-label="Opening titles — Click anywhere to skip directly to portfolio"
    >
      {/* letterbox bars */}
      <motion.div
        className="absolute inset-x-0 top-0 z-30 h-[7vh] bg-black"
        initial={{ y: 0 }}
        animate={{ y: beat >= 4 ? '-100%' : 0 }}
        transition={{ duration: 1.1, ease: EASE }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 z-30 h-[7vh] bg-black"
        initial={{ y: 0 }}
        animate={{ y: beat >= 4 ? '100%' : 0 }}
        transition={{ duration: 1.1, ease: EASE }}
      />

      {/* projector flicker light & crimson atmosphere */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(60% 50% at 50% 55%, rgba(229,19,43,0.26), transparent 70%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: beat >= 2 ? [0, 0.9, 0.6, 1] : 0 }}
        transition={{ duration: 1.4 }}
      />

      {/* studio card */}
      <AnimatePresence>
        {beat === 1 && (
          <motion.div
            key="studio"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.55 }}
          >
            <motion.p
              className="font-sans text-xs font-semibold text-mist sm:text-sm"
              initial={{ letterSpacing: '0.25em', opacity: 0 }}
              animate={{ letterSpacing: '0.6em', opacity: 1 }}
              transition={{ duration: 1.3, ease: EASE }}
            >
              {profile.originalLabel}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* portrait */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-0 mx-auto flex h-[68vh] max-w-[900px] items-end justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 1.1, filter: 'blur(16px) brightness(0.3)' }}
        animate={beat >= 4 ? { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' } : {}}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <img
          src={profile.portrait.src}
          srcSet={profile.portrait.srcSet}
          sizes="(max-width: 768px) 100vw, 900px"
          alt={profile.portrait.alt}
          className="h-full w-auto max-w-none object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_55%,transparent_98%)]"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(70%_60%_at_50%_40%,transparent_30%,rgba(0,0,0,0.85)_100%)]" />

      {/* title: PARTH PORTFOLIO */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center pointer-events-none">
        <motion.h1
          className="font-display leading-[0.82] text-bone drop-shadow-[0_8px_40px_rgba(0,0,0,0.8)]"
          style={{ fontSize: 'clamp(4.6rem, 20vw, 15rem)' }}
          initial={{ opacity: 0, scale: 1.25, filter: 'blur(18px)', letterSpacing: '0.3em' }}
          animate={beat >= 2 ? { opacity: 1, scale: 1, filter: 'blur(0px)', letterSpacing: '0.04em', y: beat >= 4 ? '-28vh' : 0 } : {}}
          transition={{ duration: 1.2, ease: EASE }}
        >
          {profile.firstName}
        </motion.h1>
        <motion.p
          className="font-sans text-sm font-bold text-crimson-2 [text-shadow:0_2px_20px_rgba(0,0,0,0.9)] sm:text-lg"
          initial={{ opacity: 0, letterSpacing: '1.2em' }}
          animate={beat >= 3 ? { opacity: 1, letterSpacing: '0.6em', y: beat >= 4 ? '-28vh' : 0 } : {}}
          transition={{ duration: 1.0, ease: EASE }}
        >
          PORTFOLIO
        </motion.p>
      </div>

      {/* role & tagline */}
      <div className="absolute inset-x-0 bottom-[9vh] z-20 flex flex-col items-center gap-4 px-4 text-center pointer-events-none">
        <motion.p
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-bone/90 sm:text-sm sm:tracking-[0.4em]"
          initial={{ opacity: 0, y: 14 }}
          animate={beat >= 5 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {profile.tagline.join('  •  ')}
        </motion.p>
      </div>

      {/* SKIP INTRO button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDone();
        }}
        data-cursor="view"
        className="absolute right-4 top-[calc(7vh+12px)] z-40 rounded-full border border-white/25 bg-black/40 px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.2em] text-mist backdrop-blur transition hover:border-white/70 hover:bg-white/10 hover:text-bone"
      >
        SKIP INTRO →
      </button>
    </motion.div>
  );
}
