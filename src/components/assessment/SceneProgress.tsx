import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Slim assessment progress indicator.
 *
 * Illustrative only: the value is a fixed visual fill, not a measurement. It
 * animates once on mount and then holds still, and collapses instantly to its
 * final width when motion is reduced.
 */
export function SceneProgress({
  tone = 'light',
  label,
}: {
  tone?: 'light' | 'dark';
  label?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setProgress(62), 260);
    return () => window.clearTimeout(timer);
  }, []);

  const isLight = tone === 'light';

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'h-1 flex-1 overflow-hidden rounded-full',
          isLight ? 'bg-line' : 'bg-ivory-100/12',
        )}
      >
        <div
          className="h-full rounded-full bg-terracotta-400 transition-[width] duration-[1500ms] ease-editorial"
          style={{ width: `${progress}%` }}
        />
      </div>
      {label && (
        <span
          className={cn(
            'shrink-0 text-[0.6875rem] uppercase tracking-[0.14em]',
            isLight ? 'text-ink-500' : 'text-ivory-100/60',
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
