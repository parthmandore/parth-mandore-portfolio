import { motion } from 'framer-motion';
import type { Episode } from '../data/portfolio';
import { EASE, Tilt } from './fx';
import { PosterBackdrop } from './Poster';

export default function EpisodeCard({ episode, index }: { episode: Episode; index: number }) {
  const [season, ep] = episode.code.split(' ');
  return (
    <motion.article
      className="w-[80vw] shrink-0 snap-start sm:w-[52vw] md:w-[38vw] lg:w-[30vw] xl:w-[26vw]"
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
    >
      <Tilt max={6} className="group h-full rounded-xl [transform-style:preserve-3d]">
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-ink-2 ring-1 ring-white/10 transition-all duration-500 ease-out group-hover:ring-crimson-2/70 group-hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.85)] [transform-style:preserve-3d]">
          <div className="relative aspect-video overflow-hidden [transform-style:preserve-3d]">
            <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-cine)] group-hover:scale-108 [transform:translateZ(-4px)]">
              <PosterBackdrop palette={episode.palette}>
                <span className="absolute -bottom-6 right-2 font-display text-[7.5rem] leading-none text-white/[0.09]">{ep}</span>
              </PosterBackdrop>
            </div>
            <div className="absolute left-4 top-4 flex items-center gap-2 [transform:translateZ(20px)]">
              <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] text-bone backdrop-blur">{season}</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-bone/90">EPISODE {ep.replace('E', '')}</span>
            </div>
            <h4 className="absolute bottom-4 left-4 right-4 font-display text-3xl leading-none tracking-wide text-bone drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] [transform:translateZ(32px)] sm:text-4xl">
              {episode.title}
            </h4>
          </div>
          <div className="flex flex-1 flex-col p-4 [transform-style:preserve-3d]">
            <div className="mb-2 flex items-center justify-between text-[11px] text-smoke [transform:translateZ(18px)]">
              <span className="font-semibold text-mist">{episode.runtime}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[10px] text-bone transition-all duration-300 group-hover:border-bone group-hover:bg-bone group-hover:text-ink group-hover:scale-110">
                ▶
              </span>
            </div>
            <p className="text-sm leading-relaxed text-bone/80 [transform:translateZ(14px)]">{episode.description}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-4 [transform:translateZ(16px)]">
              {episode.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-mist">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}
