import { useRef, type ReactNode } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { useReducedMotionPref } from '../hooks/useMedia';

/**
 * Confident, weighted deceleration curve inspired by cinematic creative reels.
 * Gentle initial glide from off-screen, settling cleanly into place without bounce.
 */
export const CINE_EASE = [0.12, 1, 0.22, 1] as const;

export type Direction = 'left' | 'right';

/**
 * Wraps existing text in a clipped container and sweeps it in horizontally
 * from the left or right screen edge into its final position.
 * 
 * Supports:
 * 1. `scrollSync: true` — movement is smoothly bound to scroll progress via useScroll + useSpring.
 * 2. `trigger: boolean` — explicit external direction-aware trigger state.
 * 3. Default in-view observer with smart latching.
 */
export function DirectionalText({
  children,
  direction = 'left',
  distance = '100%',
  delay = 0,
  duration = 1.4,
  className = '',
  containerClassName = '',
  as = 'div',
  tilt = true,
  scrollSync = false,
  once = true,
  trigger,
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
  once?: boolean;
  trigger?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPref();
  const Tag = motion[as];

  const offscreenX = direction === 'left' ? `-${distance}` : distance;
  const offscreenRotate = tilt ? (direction === 'left' ? -1.8 : 1.8) : 0;

  // Scroll synchronization hooks (unconditional)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 26,
    mass: 0.7,
    restDelta: 0.001,
  });

  // Entrance across 0.02 -> 0.28, generous reading plateau 0.28 -> 0.82, exit 0.82 -> 0.98
  const syncX = useTransform(smoothProgress, [0.02, 0.28, 0.82, 0.98], [offscreenX, '0%', '0%', offscreenX]);
  const syncRotate = useTransform(smoothProgress, [0.02, 0.28, 0.82, 0.98], [offscreenRotate, 0, 0, offscreenRotate]);
  const syncOpacity = useTransform(smoothProgress, [0.02, 0.22, 0.85, 0.98], [0, 1, 1, 0]);

  // In-view observer for deliberate cinematic entrance mode:
  const isInView = useInView(containerRef, {
    margin: '-8% 0px -4% 0px',
    once,
  });

  const active = trigger !== undefined ? trigger : isInView;

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
            ? { opacity: active ? 1 : 0 }
            : {
                x: active ? '0%' : offscreenX,
                rotate: active ? 0 : offscreenRotate,
                opacity: active ? 1 : 0,
              }
        }
        transition={{
          duration: active ? duration : 0.65,
          ease: CINE_EASE,
          delay: active ? delay : 0,
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
 * Supports explicit `trigger` for direction-aware scroll lifecycles.
 */
export function AlternatingLines({
  lines,
  startDirection = 'left',
  distance = '110%',
  delay = 0,
  duration = 1.5,
  stagger = 0.14,
  className = '',
  lineClassName = '',
  as = 'h2',
  once = true,
  trigger,
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
  once?: boolean;
  trigger?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    margin: '-8% 0px -4% 0px',
    once,
  });
  const reduced = useReducedMotionPref();
  const Tag = as;
  const fullText = lines.join(' ');
  const active = trigger !== undefined ? trigger : isInView;

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
                    ? { opacity: active ? 1 : 0 }
                    : {
                        x: active ? '0%' : offscreenX,
                        rotate: active ? 0 : isLeft ? -1.5 : 1.5,
                        opacity: active ? 1 : 0,
                      }
                }
                transition={{
                  duration: active ? duration : 0.55,
                  ease: CINE_EASE,
                  delay: active ? lineDelay : 0,
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
