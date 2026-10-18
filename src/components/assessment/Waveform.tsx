import { cn } from '@/lib/cn';

/**
 * Deterministic amplitude pattern.
 *
 * Fixed rather than random so every render is stable and there is no layout
 * thrash. Values are percentages of the parent's height.
 */
const AMPLITUDES = [38, 62, 46, 88, 54, 30, 72, 44, 96, 58, 34, 66, 50, 82, 40, 60, 28, 74, 48, 56, 42, 68];

/**
 * Audio waveform.
 *
 * Bars are laid out at their natural heights; motion only scales them on the
 * Y axis, so an animation failure or reduced-motion preference leaves a
 * complete, readable waveform rather than a flat line.
 */
export function Waveform({
  bars = 22,
  animated = true,
  tone = 'terracotta',
  className,
}: {
  bars?: number;
  animated?: boolean;
  tone?: 'terracotta' | 'inverse';
  className?: string;
}) {
  const heights = Array.from({ length: bars }, (_, index) => AMPLITUDES[index % AMPLITUDES.length]);

  return (
    <div
      aria-hidden="true"
      className={cn('flex items-center justify-between gap-[0.28rem]', className)}
    >
      {heights.map((height, index) => (
        <span
          key={index}
          className={cn(
            'w-[3px] shrink-0 origin-center rounded-full',
            tone === 'terracotta' ? 'bg-terracotta-400/75' : 'bg-ivory-100/65',
            animated && 'lx-wave',
          )}
          style={{
            height: `${height}%`,
            animationDelay: `${(index % 8) * 90}ms`,
            animationDuration: `${1.05 + (index % 5) * 0.09}s`,
          }}
        />
      ))}
    </div>
  );
}
