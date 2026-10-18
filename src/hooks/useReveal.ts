import { useEffect, useRef, useState } from 'react';

/**
 * Adds the reveal animation classes to an element once it scrolls into view.
 *
 * Progressive enhancement: content is fully visible without JavaScript, and the
 * CSS layer disables transitions entirely under `prefers-reduced-motion`.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number;
  /** Reveal once and stop observing (default) or re-hide on exit. */
  once?: boolean;
}) {
  const { threshold = 0.12, once = true } = options ?? {};
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If the browser cannot observe, just show the content.
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      // No bottom rootMargin: a short page with nothing to scroll must still
      // reveal everything that sits inside the viewport.
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, revealed };
}
