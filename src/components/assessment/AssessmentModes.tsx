import { cn } from '@/lib/cn';
import { assessmentTiles } from '@/content/assessment';
import { VoiceMotif } from '@/components/ui/VoiceMotif';
import { LearnerPortrait } from './LearnerPortrait';

/**
 * Compact, non-interactive voice + video pair.
 *
 * Used where the full interactive showcase would compete with the surrounding
 * layout. Both tiles are given the same weight so video never reads as an
 * afterthought next to voice.
 */
export function AssessmentModes({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
  const isDark = tone === 'dark';

  const tile = cn(
    'rounded-2xl border p-4',
    isDark ? 'border-ivory-100/15 bg-ivory-100/[0.04]' : 'border-line bg-ivory-50',
  );
  const media = cn(
    'relative flex h-20 items-center justify-center overflow-hidden rounded-xl',
    isDark ? 'bg-ink-900/45' : 'bg-sand/70',
  );
  const label = cn('mt-3 font-display text-[1rem]', isDark ? 'text-ivory-50' : 'text-ink-900');
  const hint = cn('mt-0.5 text-[0.8125rem]', isDark ? 'text-ivory-100/70' : 'text-ink-500');

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      <li className={tile}>
        <div className={media}>
          <VoiceMotif
            bars={11}
            tone={isDark ? 'inverse' : 'terracotta'}
            className="h-10 w-full px-4"
          />
        </div>
        <p className={label}>{assessmentTiles.voice.label}</p>
        <p className={hint}>{assessmentTiles.voice.hint}</p>
      </li>

      <li className={tile}>
        <div className={media}>
          <LearnerPortrait
            tone={isDark ? 'dark' : 'light'}
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <p className={label}>{assessmentTiles.video.label}</p>
        <p className={hint}>{assessmentTiles.video.hint}</p>
      </li>
    </ul>
  );
}
