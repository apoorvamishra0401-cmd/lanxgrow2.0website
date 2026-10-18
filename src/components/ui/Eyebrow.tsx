import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Small uppercase label that opens an editorial section. */
export function Eyebrow({
  children,
  className,
  tone = 'terracotta',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'terracotta' | 'muted' | 'inverse';
}) {
  const tones = {
    terracotta: 'text-terracotta-600',
    muted: 'text-ink-500',
    inverse: 'text-terracotta-300',
  } as const;

  return (
    <p
      className={cn(
        'flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em]',
        tones[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-50" />
      {children}
    </p>
  );
}
