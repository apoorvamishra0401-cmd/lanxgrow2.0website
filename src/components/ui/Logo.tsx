import { cn } from '@/lib/cn';
import { brand } from '@/config/site';

/**
 * Shared wordmark using the owner-supplied official logo asset.
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
      <img
        src="/images/assessment/official-logo.webp"
        alt=""
        aria-hidden="true"
        className="h-8 w-8 rounded-[10px] object-contain"
      />
      <span>
        LanXgrow
        <span className="sr-only"> — {brand.tagline}</span>
      </span>
    </span>
  );
}
