import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'success' | 'error' | 'info';

const toneStyles: Record<Tone, { wrap: string; icon: ReactNode }> = {
  success: {
    wrap: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: (
      <path d="M3.5 8.5 6.5 11.5l6-7" />
    ),
  },
  error: {
    wrap: 'border-terracotta-200 bg-terracotta-50 text-terracotta-800',
    icon: <path d="M8 4.5v4M8 11.25h.01" />,
  },
  info: {
    wrap: 'border-line bg-ivory-50 text-ink-700',
    icon: <path d="M8 7.5v4M8 4.75h.01" />,
  },
};

/**
 * Inline status message used by the contact and sign-in forms.
 *
 * Renders with `role="status"` so assistive technology announces the change
 * without stealing focus.
 */
export function Alert({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const styles = toneStyles[tone];

  return (
    <div
      role="status"
      className={cn('flex items-start gap-3 rounded-xl border px-4 py-3.5 text-[0.875rem]', styles.wrap, className)}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className={cn('mt-0.5 h-4 w-4 shrink-0', tone === 'success' && 'text-emerald-600', tone === 'error' && 'text-terracotta-600', tone === 'info' && 'text-ink-500')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {tone !== 'success' && <circle cx="8" cy="8" r="6.25" />}
        {styles.icon}
      </svg>
      <div className="leading-relaxed">
        {title && <p className="font-medium">{title}</p>}
        <div className={cn(title && 'mt-0.5 opacity-90')}>{children}</div>
      </div>
    </div>
  );
}
