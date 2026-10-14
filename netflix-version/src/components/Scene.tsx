import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTrackProgress } from '../hooks/sectionProgress';

/**
 * A section of the series. Fades up out of black with a short blur-to-focus,
 * and reports viewing progress for the Continue Exploring row.
 */
export default function Scene({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useTrackProgress(id, ref);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.5'] });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [0.25, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.985, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return (
    <motion.section
      id={id}
      ref={ref}
      style={{ opacity, scale, y }}
      className={`relative scroll-mt-16 py-16 sm:py-24 ${className}`}
    >
      {/* Subtle ambient lighting continuity between scenes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-12 h-24 bg-gradient-to-b from-transparent via-crimson/[0.015] to-transparent"
      />
      {children}
    </motion.section>
  );
}
