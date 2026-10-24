import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './Container';

type SectionProps = {
  children: ReactNode;
  /** Vertical rhythm. `tight` is used between closely related blocks. */
  spacing?: 'tight' | 'normal' | 'loose';
  /** Optional surface treatment. */
  tone?: 'ivory' | 'alabaster' | 'sand' | 'ink';
  className?: string;
  /** Adds a hairline top border to separate editorial sections. */
  divided?: boolean;
  id?: string;
};

const spacingMap = {
  tight: 'py-14 sm:py-16',
  normal: 'py-20 sm:py-24 lg:py-28',
  loose: 'py-24 sm:py-32 lg:py-40',
} as const;

const toneMap = {
  ivory: 'bg-ivory text-ink',
  alabaster: 'bg-ivory-50 text-ink',
  sand: 'bg-sand text-ink',
  ink: 'bg-ink-900 text-ivory-100',
} as const;

export function Section({
  children,
  spacing = 'normal',
  tone = 'ivory',
  className,
  divided = false,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'lx-section relative',
        spacingMap[spacing],
        toneMap[tone],
        divided && 'border-t border-line',
        // Sections that are anchor targets must clear the sticky header.
        id && 'scroll-mt-[4.5rem] lg:scroll-mt-20',
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
