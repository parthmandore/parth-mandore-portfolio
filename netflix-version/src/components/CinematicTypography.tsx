import { useRef, type ReactNode } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { useReducedMotionPref } from '../hooks/useMedia';

/**
 * Confident, weighted deceleration curve inspired by cinematic creative reels.
 * Fast initial velocity from off-screen, settling cleanly into place without bounce.
 */
export const CINE_EASE = [0.16, 1, 0.3, 1] as const;

export type Direction = 'left' | 'right';

/**
 * Wraps existing text in a clipped container and sweeps it in horizontally
 * from the left or right screen edge into its final position.
 * 
 * Supports both:
 * 1. `scrollSync: true` — movement is smoothly bound to scroll progress via useScroll + useSpring.
 * 2. `scrollSync: false` (default) — deliberate, slower cinematic entrance (1.35s) with bidirectional exit.
 */
export function DirectionalText({
  children,
  direction = 'left',
  distance = '100%',
  delay = 0,
  duration = 1.35,
  className = '',
  containerClassName = '',
  as = 'div',
  tilt = true,
  scrollSync = false,
}: {
  children: ReactNode;
  direction?: Direction;
  distance?: string;
  delay?: number;
  duration?: number;
  className?: string;
  containerClassName?: string;
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  tilt?: boolean;
  scrollSync?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPref();
  const Tag = motion[as];

  const offscreenX = direction === 'left' ? `-${distance}` : distance;
  const offscreenRotate = tilt ? (direction === 'left' ? -2 : 2) : 0;

  // Scroll synchronization hooks (unconditional)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 24,
    mass: 0.55,
    restDelta: 0.001,
  });

  // Entrance across 0.04 -> 0.32, reading plateau 0.32 -> 0.78, exit 0.78 -> 0.98
  const syncX = useTransform(smoothProgress, [0.04, 0.32, 0.78, 0.98], [offscreenX, '0%', '0%', offscreenX]);
  const syncRotate = useTransform(smoothProgress, [0.04, 0.32, 0.78, 0.98], [offscreenRotate, 0, 0, offscreenRotate]);
  const syncOpacity = useTransform(smoothProgress, [0.04, 0.26, 0.82, 0.98], [0, 1, 1, 0]);

  // In-view observer for slower, deliberate cinematic entrance mode
  const isInView = useInView(containerRef, {
    margin: '-6% 0px -6% 0px',
    once: false,
  });

  if (scrollSync && !reduced) {
    return (
      <div ref={containerRef} className={`relative overflow-hidden ${containerClassName}`}>
        <Tag
          style={{ x: syncX, rotate: syncRotate, opacity: syncOpacity }}
          className={`will-change-transform ${className}`}
        >
          {children}
        </Tag>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${containerClassName}`}>
      <Tag
        animate={
          reduced
            ? { opacity: isInView ? 1 : 0 }
            : {
                x: isInView ? '0%' : offscreenX,
                rotate: isInView ? 0 : offscreenRotate,
                opacity: isInView ? 1 : 0,
              }
        }
        transition={{
          duration: isInView ? duration : 0.55,
          ease: CINE_EASE,
          delay: isInView ? delay : 0,
        }}
        className={`will-change-transform ${className}`}
      >
        {children}
      </Tag>
    </div>
  );
}

/**
 * Splits multiple existing lines so adjacent lines enter from OPPOSITE sides
 * (e.g., line 1 from LEFT, line 2 from RIGHT, line 3 from LEFT).
 * Uses slower, cinematic duration (1.45s) with deliberate staggers.
 */
export function AlternatingLines({
  lines,
  startDirection = 'left',
  distance = '110%',
  delay = 0,
  duration = 1.45,
  stagger = 0.14,
  className = '',
  lineClassName = '',
  as = 'h2',
}: {
  lines: string[];
  startDirection?: Direction;
  distance?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  lineClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    margin: '-6% 0px -6% 0px',
    once: false,
  });
  const reduced = useReducedMotionPref();
  const Tag = as;
  const fullText = lines.join(' ');

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Tag className="flex flex-col" aria-label={fullText}>
        {lines.map((line, idx) => {
          const isLeft = startDirection === 'left' ? idx % 2 === 0 : idx % 2 !== 0;
          const offscreenX = isLeft ? `-${distance}` : distance;
          const lineDelay = delay + idx * stagger;

          return (
            <span key={idx} className="block overflow-hidden pb-[0.06em] pt-[0.02em]" aria-hidden>
              <motion.span
                animate={
                  reduced
                    ? { opacity: isInView ? 1 : 0 }
                    : {
                        x: isInView ? '0%' : offscreenX,
                        rotate: isInView ? 0 : isLeft ? -1.5 : 1.5,
                        opacity: isInView ? 1 : 0,
                      }
                }
                transition={{
                  duration: isInView ? duration : 0.55,
                  ease: CINE_EASE,
                  delay: isInView ? lineDelay : 0,
                }}
                className={`block will-change-transform ${lineClassName}`}
              >
                {line}
              </motion.span>
            </span>
          );
        })}
      </Tag>
    </div>
  );
}
