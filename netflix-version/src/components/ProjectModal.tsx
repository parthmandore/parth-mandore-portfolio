import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { projects, topPicks, type Project } from '../data/portfolio';
import { useScrollLock } from '../hooks/smoothScroll';
import { EASE, Magnetic } from './fx';
import { ProjectArt } from './Poster';

const block = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
};

function getMetricFontSize(value: string): string {
  const len = value.length;
  if (len > 10) {
    return 'text-sm sm:text-base lg:text-[1.2rem] leading-tight tracking-tight';
  }
  if (len > 7) {
    return 'text-lg sm:text-xl lg:text-[1.6rem] leading-tight';
  }
  return 'text-2xl sm:text-3xl lg:text-[2.2rem] leading-none';
}

export default function ProjectModal({ project, onClose, onSwitch }: { project: Project; onClose: () => void; onSwitch: (p: Project) => void }) {
  useScrollLock(true);
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [project.id]);

  const isOriginal = projects.some((p) => p.id === project.id);
  const more = (topPicks.length > 0 ? topPicks : projects).filter((p) => p.id !== project.id).slice(0, 4);

  return (
    <motion.div className="fixed inset-0 z-[140]" role="dialog" aria-modal="true" aria-labelledby={`title-${project.id}-modal`}>
      <motion.div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
      />
      <div ref={scroller} data-lenis-prevent className="absolute inset-0 overflow-y-auto overscroll-contain [perspective:1400px]" onClick={onClose}>
        <motion.div
          className="relative mx-auto min-h-full max-w-5xl bg-ink-2 shadow-[0_35px_100px_rgba(0,0,0,0.9),0_0_80px_rgba(229,19,43,0.14)] sm:my-10 sm:min-h-0 sm:rounded-2xl ring-1 ring-white/15 [transform-style:preserve-3d]"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, rotateX: 6, y: 36 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, rotateX: -3, y: 24 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* billboard */}
          <div className="relative h-[52vh] min-h-[340px] overflow-hidden sm:rounded-t-2xl [transform-style:preserve-3d]">
            <motion.div layoutId={`art-${project.id}`} className="absolute inset-0 [transform:translateZ(-8px)]" transition={{ duration: 0.7, ease: EASE }}>
              <ProjectArt project={project} />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/30 to-transparent" />
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              data-cursor="close"
              aria-label="Close project"
              className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-lg text-bone backdrop-blur ring-1 ring-white/15 transition hover:bg-black hover:scale-110"
            >
              ✕
            </button>

            <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-10 [transform-style:preserve-3d]">
              {/* Category label: enters from LEFT */}
              <motion.p
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
                className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.34em] text-bone/80 [transform:translateZ(20px)]"
              >
                <span className="font-display text-xl tracking-normal text-crimson-2">P</span> {isOriginal ? 'ORIGINAL' : 'FEATURED'}
              </motion.p>

              {/* Title: spatial entrance from RIGHT */}
              <motion.h2
                id={`title-${project.id}-modal`}
                initial={{ opacity: 0, x: 40, rotateY: 2 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(2.2rem,6.5vw,5rem)] leading-[0.9] tracking-wide text-bone drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)] [transform:translateZ(35px)] break-words hyphens-auto max-w-full"
              >
                {project.title}
              </motion.h2>
            </div>
          </div>

          <div className="px-5 pb-12 sm:px-10 min-w-0">
            {/* Metadata: enters from LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.28, ease: EASE }}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-mist"
            >
              <span className="font-semibold text-[#46e3a8]">{project.year}</span>
              <span className="h-1 w-1 rounded-full bg-smoke" />
              <span>{project.genre}</span>
            </motion.div>

            {/* Logline: enters from RIGHT */}
            <motion.p
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.95, delay: 0.36, ease: EASE }}
              className="mt-4 max-w-3xl text-lg leading-relaxed text-bone sm:text-xl break-words"
            >
              {project.logline}
            </motion.p>

            {(project.demo || project.github) && (
              <motion.div variants={block} className="mt-6 flex flex-wrap gap-3">
                {project.demo && (
                  <Magnetic>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="link"
                      className="flex min-h-12 items-center gap-2 rounded-md bg-crimson px-6 text-[15px] font-bold text-white transition hover:bg-crimson-2"
                    >
                      ▶ Live Demo
                    </a>
                  </Magnetic>
                )}
                {project.github && (
                  <Magnetic>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="link"
                      className="flex min-h-12 items-center gap-2 rounded-md bg-bone px-6 text-[15px] font-bold text-ink transition hover:bg-white"
                    >
                      GitHub ↗
                    </a>
                  </Magnetic>
                )}
              </motion.div>
            )}

            {/* impact: fully responsive grid and dynamic metric typography */}
            {project.metrics && project.metrics.length > 0 && (
              <motion.section variants={block} className="mt-12 min-w-0">
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Result / Impact</h3>
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-3 lg:grid-cols-5 min-w-0">
                  {project.metrics.map((m, i) => (
                    <motion.div
                      key={m.label}
                      className="flex min-w-0 flex-col justify-between overflow-hidden bg-ink p-3.5 sm:p-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.07, duration: 0.5, ease: EASE }}
                    >
                      <p
                        className={`font-display font-bold text-bone break-words hyphens-auto max-w-full ${getMetricFontSize(m.value)}`}
                        style={{
                          color: i === 0 ? project.palette.accent : undefined,
                          overflowWrap: 'anywhere',
                          wordBreak: 'break-word',
                        }}
                      >
                        {m.value}
                      </p>
                      <p className="mt-2 text-[11px] sm:text-xs leading-snug text-mist break-words min-w-0">{m.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            <div className="mt-12 grid gap-10 lg:grid-cols-[3fr_2fr] min-w-0">
              {project.build && project.build.length > 0 && (
                <motion.section variants={block} className="min-w-0">
                  <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">My Contribution</h3>
                  <ul className="space-y-4">
                    {project.build.map((b) => (
                      <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-bone/85 break-words min-w-0">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: project.palette.accent }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              )}
              <div className="space-y-10 min-w-0">
                {project.stack && project.stack.length > 0 && (
                  <motion.section variants={block} className="min-w-0">
                    <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2 min-w-0">
                      {project.stack.map((t) => (
                        <span key={t} className="glass rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-bone break-words max-w-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.section>
                )}
                {project.features && project.features.length > 0 && (
                  <motion.section variants={block} className="min-w-0">
                    <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Key Features</h3>
                    <ul className="space-y-2.5 min-w-0">
                      {project.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm text-bone/85 break-words min-w-0">
                          <span className="text-crimson-2 shrink-0">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.section>
                )}
              </div>
            </div>

            {/* more like this */}
            {more.length > 0 && (
              <motion.section variants={block} className="mt-14 border-t border-white/10 pt-8">
                <h3 className="mb-4 font-sans text-lg font-semibold text-bone">More Projects</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {more.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      data-cursor="view"
                      onClick={() => onSwitch(p)}
                      className="group relative aspect-video overflow-hidden rounded-xl text-left ring-1 ring-white/10 transition hover:ring-white/30"
                    >
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                        <ProjectArt project={p} />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mist">{p.genre}</p>
                        <p className="font-display text-3xl leading-none tracking-wide text-bone">{p.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
