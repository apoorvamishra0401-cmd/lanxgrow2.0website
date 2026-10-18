import { cn } from '@/lib/cn';
import { assessmentScenes } from '@/content/assessment';
import { LearnerPortrait } from './LearnerPortrait';
import { Waveform } from './Waveform';

const scene = assessmentScenes.video;

/**
 * Video assessment scene.
 *
 * A camera-frame treatment around an abstract, faceless learner, with a
 * restrained recording indicator and a small voice-activity waveform. Purely a
 * visual demonstration: no webcam access, recording, face analysis or scoring.
 */
export function VideoScene({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const isLight = tone === 'light';

  const pill = cn(
    'inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-sm',
    isLight
      ? 'border-ink-900/10 bg-ivory-50/85 text-ink-700'
      : 'border-ivory-100/15 bg-ink-900/55 text-ivory-100/85',
  );

  return (
    <div
      className={cn(
        'relative h-full overflow-hidden rounded-2xl',
        isLight ? 'bg-sand/70' : 'bg-ink-900',
      )}
    >
      <LearnerPortrait tone={tone} className="absolute inset-0 h-full w-full" />

      {/* Camera framing guides, kept very faint */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute inset-y-0 left-1/3 w-px bg-ink-900/[0.06]" />
        <span className="absolute inset-y-0 left-2/3 w-px bg-ink-900/[0.06]" />
        <span className="absolute inset-x-0 top-1/3 h-px bg-ink-900/[0.06]" />
        <span className="absolute inset-x-0 top-2/3 h-px bg-ink-900/[0.06]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ink-900/[0.08]"
      />

      {/* Recording indicator */}
      <div className="absolute left-4 top-4">
        <span className={pill}>
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-terracotta-500"
          />
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em]">
            {scene.state}
          </span>
        </span>
      </div>

      {/* Stage label and voice activity.
          The row wraps rather than squeezing, so the activity meter stays
          visible on phones instead of being hidden below `sm`. */}
      <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span className={cn(pill, 'text-[0.75rem]')}>{scene.stage}</span>
        <span className={cn(pill, 'shrink-0')} title={scene.hint}>
          <Waveform bars={9} className="h-3.5" tone={isLight ? 'terracotta' : 'inverse'} />
        </span>
      </div>
    </div>
  );
}
