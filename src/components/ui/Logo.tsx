import { cn } from '@/lib/cn';
import { brand } from '@/config/site';

/**
 * Wordmark. Drawn with type + a simple glyph so no external asset is required,
 * and so it stays crisp at every size.
 */
export function Logo({
  className,
  tone = 'default',
}: {
  className?: string;
  tone?: 'default' | 'inverse';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 font-display text-[1.375rem] leading-none tracking-[-0.01em]',
        tone === 'inverse' ? 'text-ivory-50' : 'text-ink-900',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'grid h-8 w-8 place-items-center rounded-[10px]',
          tone === 'inverse' ? 'bg-ivory-50 text-ink-900' : 'bg-ink-900 text-ivory-50',
        )}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18V6M6 18h5" />
          <path d="M18 6l-4 6 4 6" className="text-terracotta-400" />
        </svg>
      </span>
      <span>
        LanXgrow
        <span className="sr-only"> — {brand.tagline}</span>
      </span>
    </span>
  );
}
