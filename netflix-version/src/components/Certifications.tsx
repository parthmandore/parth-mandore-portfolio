import { motion } from 'framer-motion';
import { certifications } from '../data/portfolio';
import { EASE, SectionHeading, Tilt } from './fx';

export default function Certifications() {
  return (
    <>
      <SectionHeading kicker="Credentials & Continuous Learning" title="Certifications" />

      {certifications.length === 0 ? (
        <div className="gutter mx-auto max-w-4xl">
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-ink-2 p-8 text-center ring-1 ring-white/10 sm:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(229,19,43,0.12),transparent_70%)]" />
            <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-2xl text-crimson-2 shadow-[0_0_30px_rgba(229,19,43,0.3)]">
              ✦
            </div>
            <h3 className="relative mt-5 font-display text-3xl tracking-wide text-bone sm:text-4xl">
              Certifications In Progress
            </h3>
            <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-mist">
              New certifications will appear here as I complete them. Currently preparing for industry credentials in Java, Spring Boot, and Cloud Architecture.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-2">
              <span className="glass rounded-full px-4 py-1.5 text-xs font-medium text-bone/80">Java SE & Spring Boot</span>
              <span className="glass rounded-full px-4 py-1.5 text-xs font-medium text-bone/80">Cloud & Distributed Systems</span>
              <span className="glass rounded-full px-4 py-1.5 text-xs font-medium text-bone/80">Applied AI & Machine Learning</span>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="gutter mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <motion.div
              key={`${c.issuer}-${c.name}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
            >
              <Tilt max={6} className="h-full rounded-xl">
                <article className="flex h-full flex-col justify-between rounded-xl bg-ink-2 p-5 ring-1 ring-white/10 transition hover:ring-white/30">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-crimson-2">{c.issuer}</span>
                      {c.issueDate && <span className="text-xs text-smoke">{c.issueDate}</span>}
                    </div>
                    <h4 className="mt-4 text-base font-semibold leading-snug text-bone">{c.name}</h4>
                    {c.credentialId && <p className="mt-1 text-xs text-smoke">ID: {c.credentialId}</p>}
                  </div>
                  {(c.link || c.url) && (
                    <a
                      href={c.link || c.url}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="link"
                      className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-bone underline decoration-white/30 underline-offset-4 hover:decoration-bone"
                    >
                      Verify Credential ↗
                    </a>
                  )}
                </article>
              </Tilt>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
