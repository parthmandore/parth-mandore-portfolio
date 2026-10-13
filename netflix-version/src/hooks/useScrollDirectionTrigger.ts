import { useState, useEffect, useRef } from 'react';
import { useReducedMotionPref } from './useMedia';

/**
 * Direction-aware scroll trigger hook.
 *
 * SPECIFICATION (Phase 6):
 * 1. Scroll DOWN into section -> animation plays (hasEntered = true).
 * 2. Continue scrolling through section -> animation does not repeatedly restart.
 * 3. Scroll UP -> no entrance animations replay; content remains stable and visible (opacity: 1).
 * 4. Scroll far back UP above section -> resets trigger state when section exits below viewport.
 * 5. Scroll DOWN into section again -> animation plays again cleanly.
 * 6. Content is guaranteed to NEVER remain invisible.
 */
export function useScrollDownTrigger<T extends HTMLElement = HTMLDivElement>(threshold = 0.85) {
  const ref = useRef<T>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const lastScrollY = useRef(0);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    if (reduced) {
      setHasEntered(true);
      return;
    }

    lastScrollY.current = window.scrollY;

    const checkVisibility = () => {
      const el = ref.current;
      if (!el) return;

      const currentY = window.scrollY;
      const isDown = currentY >= lastScrollY.current - 1; // allow micro variations
      lastScrollY.current = currentY;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // In view:
      const inView = rect.top < vh * threshold && rect.bottom > 0;

      if (inView && isDown) {
        setHasEntered(true);
      } else if (rect.top > vh * 1.05) {
        // Scrolled back up above this section:
        setHasEntered(false);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const rect = entry.boundingClientRect;
          const vh = window.innerHeight || document.documentElement.clientHeight;

          if (entry.isIntersecting) {
            setHasEntered(true);
          } else if (rect.top >= vh * 0.98) {
            // Element left through the bottom of the viewport (user scrolled up above it)
            setHasEntered(false);
          }
        });
      },
      { rootMargin: '0px 0px -5% 0px', threshold: [0, 0.1, 0.25] }
    );

    const el = ref.current;
    if (el) io.observe(el);

    checkVisibility();

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [threshold, reduced]);

  return { ref, hasEntered: reduced || hasEntered };
}
