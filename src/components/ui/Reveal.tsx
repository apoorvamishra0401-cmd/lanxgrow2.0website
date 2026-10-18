import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useReveal } from '@/hooks/useReveal';

/**
 * Wraps content in a scroll-triggered fade-up.
 *
 * Respects `prefers-reduced-motion` in CSS, and renders visible content when
 * JavaScript or IntersectionObserver is unavailable.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger in milliseconds (capped, so nothing feels slow). */
  delay?: number;
  className?: string;
}) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={cn(
        'lx-reveal',
        !revealed && 'lx-reveal--armed',
        revealed && 'lx-reveal--in',
        className,
      )}
      style={delay && revealed ? { transitionDelay: `${Math.min(delay, 320)}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
