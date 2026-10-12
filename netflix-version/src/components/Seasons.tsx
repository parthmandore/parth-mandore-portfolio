import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { seasons } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';
import EpisodeCard from './EpisodeCard';
import { RailButtons } from './Rail';
import { DirectionalText } from './CinematicTypography';

export default function Seasons() {
  const [active, setActive] = useState(seasons.length - 2);
  const season = seasons[active];
  const rail = useRef<HTMLDivElement>(null);

  return (
    <>
      <SectionHeading
        kicker={`${seasons.length} Seasons`}
        title="My Journey"
        aside={<p className="max-w-xs text-sm text-mist">Every stage of the resume, told as a season — select one to see its episodes.</p>}
      />

      {/* season selector */}
      <div className="rail gutter mb-8 flex gap-2 overflow-x-auto" role="tablist" aria-label="Seasons">
        {seasons.map((s, i) => (
          <button
            key={s.number}
            role="tab"
            aria-selected={i === active}
            type="button"
            onClick={() => {
              setActive(i);
              rail.current?.scrollTo({ left: 0, behavior: 'smooth' });
            }}
            className={`relative shrink-0 rounded-full px-4 py-2.5 text-left transition ${i === active ? 'text-ink' : 'text-mist hover:text-bone'}`}
          >
            {i === active && <motion.span layoutId="season-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ duration: 0.5, ease: EASE }} />}
            <span className="relative block text-[10px] font-bold tracking-[0.24em]">SEASON {String(s.number).padStart(2, '0')}</span>
            <span className="relative block whitespace-nowrap text-sm font-semibold">{s.title}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={season.number}
          className="relative overflow-hidden"
          exit={{ opacity: 0, x: -30, transition: { duration: 0.25 } }}
        >
          <div className="gutter mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <div className="flex items-baseline">
              {/* Season number: enters dramatically from LEFT */}
              <DirectionalText direction="left" distance="110%" delay={0.08} duration={1.4} as="span" containerClassName="inline-block mr-3">
                <span className="font-display text-4xl tracking-wide text-crimson-2 sm:text-5xl">
                  S{String(season.number).padStart(2, '0')}
                </span>
              </DirectionalText>

              {/* Season title: enters dramatically from RIGHT */}
              <DirectionalText direction="right" distance="110%" delay={0.16} duration={1.45} as="span" containerClassName="inline-block">
                <h3 className="font-display text-4xl tracking-wide text-bone sm:text-5xl">
                  {season.title}
                </h3>
              </DirectionalText>
            </div>

            {/* Period and episodes count: enters from RIGHT */}
            <DirectionalText direction="right" distance="100%" delay={0.24} duration={1.3} as="span" containerClassName="inline-block">
              <span className="text-sm font-medium text-mist">
                {season.period} · {season.episodes.length} {season.episodes.length === 1 ? 'Episode' : 'Episodes'}
              </span>
            </DirectionalText>
          </div>

          {/* Synopsis: enters from LEFT */}
          <DirectionalText direction="left" distance="100%" delay={0.32} duration={1.4} as="div" containerClassName="gutter max-w-3xl">
            <p className="text-[15px] leading-relaxed text-bone/75">{season.synopsis}</p>
          </DirectionalText>

          <div className="group/rail relative">
            <div ref={rail} className="rail gutter flex snap-x snap-mandatory gap-4 overflow-x-auto py-8 [perspective:1200px]">
              {season.episodes.map((e, i) => (
                <EpisodeCard key={e.code} episode={e} index={i} />
              ))}
            </div>
            <RailButtons rail={rail} />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
