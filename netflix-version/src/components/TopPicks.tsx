import { useRef } from 'react';
import { motion } from 'framer-motion';
import { topPicks, type Project } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';
import { PosterBackdrop } from './Poster';
import { RailButtons } from './Rail';

export default function TopPicks({ onOpen }: { onOpen: (p: Project) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  return (
    <>
      <SectionHeading
        kicker={`${topPicks.length} Repositories · GitHub Showcase`}
        title="Parth's Projects"
        aside={<p className="max-w-xs text-sm text-mist">Verified public repositories and software projects built by Parth Mandore. Click any title for details.</p>}
      />
      <div className="group/rail relative">
        <div ref={rail} className="rail gutter flex snap-x snap-mandatory gap-2 overflow-x-auto py-6">
          {topPicks.map((pick, i) => (
            <motion.div
              key={pick.id || pick.title}
              role="button"
              tabIndex={0}
              onClick={() => onOpen(pick)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpen(pick);
                }
              }}
              data-cursor="view"
              aria-label={`View details for ${pick.title}`}
              className="group relative flex h-[260px] shrink-0 cursor-pointer select-none snap-start items-end focus:outline-none sm:h-[300px]"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '0px -5% 0px 0px' }}
              transition={{ duration: 0.7, delay: Math.min(i, 5) * 0.06, ease: EASE }}
            >
              <span
                aria-hidden
                className="text-outline -mr-6 select-none font-display leading-[0.78] transition duration-500 group-hover:[-webkit-text-stroke-color:rgba(255,61,90,0.85)] sm:-mr-8"
                style={{ fontSize: i >= 9 ? 'clamp(8rem, 19vw, 13rem)' : 'clamp(11rem, 26vw, 19rem)', letterSpacing: i >= 9 ? '-0.07em' : 0 }}
              >
                {i + 1}
              </span>
              <div className="relative z-10 h-[85%] w-[160px] overflow-hidden rounded-lg shadow-[-12px_0_30px_rgba(0,0,0,0.7)] ring-1 ring-white/10 transition duration-500 group-hover:-translate-y-2 group-hover:ring-white/30 sm:w-[190px]">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <PosterBackdrop palette={pick.palette} />
                </div>
                <div className="absolute inset-0 flex flex-col justify-between p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-bone/70">{pick.label || pick.genre}</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] text-bone/70 backdrop-blur transition group-hover:bg-crimson group-hover:text-bone">ℹ</span>
                  </div>
                  <div>
                    <p className="font-display text-[1.75rem] leading-[0.92] tracking-wide text-bone">{pick.title}</p>
                    <p className="mt-1 text-[11px] leading-snug text-mist line-clamp-2">{pick.logline}</p>
                    {pick.stack && (
                      <p className="mt-1.5 truncate text-[9px] font-medium text-bone/60">
                        {Array.isArray(pick.stack) ? pick.stack.slice(0, 3).join(' · ') : pick.stack}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <RailButtons rail={rail} />
      </div>
    </>
  );
}
