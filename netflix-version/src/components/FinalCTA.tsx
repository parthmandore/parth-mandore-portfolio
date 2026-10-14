import { motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE, Magnetic, Particles } from './fx';
import { SeriesMark } from './Poster';
import { DirectionalText, AlternatingLines } from './CinematicTypography';
import { useScrollDownTrigger } from '../hooks/useScrollDirectionTrigger';
import { useReducedMotionPref } from '../hooks/useMedia';

export default function FinalCTA({ onReplay }: { onReplay: () => void }) {
  const { ref: sectionRef, hasEntered } = useScrollDownTrigger<HTMLElement>(0.85);
  const { scrollTo } = useSmoothScroll();
  const reduced = useReducedMotionPref();

  const ctas = [
    { label: "Let's Build", href: `mailto:${profile.email}?subject=${encodeURIComponent("Let's build something")}`, primary: true, cursor: 'play' },
    { label: 'LinkedIn', href: profile.links.linkedin, cursor: 'link' },
    { label: 'GitHub', href: profile.links.github, cursor: 'link' },
    { label: 'Email', href: `mailto:${profile.email}`, cursor: 'link' },
  ];

  return (
    <section id="contact" ref={sectionRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_60%,rgba(229,19,43,0.18),transparent_70%)]" />
      <Particles count={36} />

      {/* The Next Episode: enters from LEFT */}
      <DirectionalText
        direction="left"
        distance="110%"
        delay={0.08}
        duration={1.25}
        trigger={hasEntered || reduced}
        className="relative z-10 mb-4"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-crimson-2 flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse" />
          <span>The Next Episode</span>
        </p>
      </DirectionalText>

      {/* TO BE CONTINUED…: alternating line entry (TO BE from LEFT, CONTINUED… from RIGHT) */}
      <AlternatingLines
        lines={['TO BE', 'CONTINUED…']}
        startDirection="left"
        distance="110%"
        delay={0.16}
        stagger={0.14}
        duration={1.5}
        as="h2"
        trigger={hasEntered || reduced}
        className="relative z-10 font-display leading-[0.84] text-bone"
        lineClassName="text-[clamp(3.8rem,13vw,11.5rem)] tracking-[0.01em]"
      />

      <div className="relative z-10 mt-12">
        {/* Name: enters from LEFT */}
        <DirectionalText
          direction="left"
          distance="100%"
          delay={0.3}
          duration={1.3}
          trigger={hasEntered || reduced}
        >
          <p className="font-sans text-2xl font-semibold tracking-[0.2em] text-bone sm:text-3xl">
            {profile.displayName.toUpperCase()}
          </p>
        </DirectionalText>

        {/* Role: enters from RIGHT */}
        <DirectionalText
          direction="right"
          distance="100%"
          delay={0.4}
          duration={1.3}
          trigger={hasEntered || reduced}
        >
          <p className="mt-2 text-xs font-semibold tracking-[0.4em] text-mist sm:text-sm">
            {profile.role.toUpperCase()}
          </p>
        </DirectionalText>
      </div>

      <motion.div
        className="relative mt-10 flex flex-wrap justify-center gap-3"
        initial="hidden"
        animate={hasEntered || reduced ? 'show' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
        }}
      >
        {ctas.map((c) => (
          <motion.div
            key={c.label}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.9 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
            }}
          >
            <Magnetic>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                data-cursor={c.cursor}
                className={`flex min-h-12 items-center gap-2 rounded-full px-7 text-sm font-bold tracking-[0.12em] transition ${
                  c.primary ? 'bg-crimson text-white shadow-[0_0_50px_rgba(229,19,43,0.5)] hover:bg-crimson-2' : 'border border-white/25 text-bone hover:border-bone hover:bg-white/10'
                }`}
              >
                {c.primary && <span>▶</span>}
                {c.label.toUpperCase()}
                {!c.primary && <span className="text-mist">↗</span>}
              </a>
            </Magnetic>
          </motion.div>
        ))}
      </motion.div>

      <div className="relative mt-16 flex flex-wrap justify-center gap-6 text-xs font-semibold tracking-[0.24em] text-smoke">
        <button type="button" onClick={() => scrollTo(0, { offset: 0 })} className="hover:text-bone transition-colors">
          ↺ WATCH AGAIN
        </button>
        <button type="button" onClick={onReplay} className="hover:text-bone transition-colors">
          ▶ REPLAY OPENING
        </button>
      </div>

      <footer className="absolute inset-x-0 bottom-0 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
        <div className="mb-2 text-base">
          <SeriesMark />
        </div>
        <p className="text-[11px] text-smoke">
          © 2026 {profile.fullName}. A personal, streaming-inspired portfolio — not affiliated with any streaming service.
        </p>
      </footer>
    </section>
  );
}
