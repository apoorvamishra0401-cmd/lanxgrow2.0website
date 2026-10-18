import { cn } from '@/lib/cn';
import { signalToGuidance } from '@/content/visuals';
import { Waveform } from '@/components/assessment/Waveform';

/**
 * From a spoken answer to guidance — the restrained visual for Smart AI.
 *
 * Three beats: the learner speaks, patterns surface, a mentor guides. The
 * middle beat is deliberately abstract (no scores, percentages, results or
 * leaderboards), and the composition is captioned as illustrative so it can
 * never be read as live assessment output.
 *
 * The beats are real text in an ordered list, so assistive technology reads the
 * same story a sighted visitor sees; only the drawings inside each beat are
 * hidden. Everything is built from the site's existing primitives — the
 * assessment waveform, hairlines and a sand note card — so Smart AI looks like
 * LanXgrow rather than like a borrowed product interface.
 */

function SpeakBeat() {
  return <Waveform bars={7} animated={false} tone="inverse" className="h-6 w-full" />;
}

/** Abstract "signals" — three marks, only one emphasised. Never a measurement. */
function PatternBeat() {
  const heights = ['h-3', 'h-6', 'h-4'];

  return (
    <div className="flex h-6 w-full items-end justify-center gap-1.5">
      {heights.map((height, index) => (
        <span
          key={index}
          className={cn(
            'w-[3px] rounded-full',
            index === 1 ? 'bg-terracotta-300' : 'bg-ivory-100/30',
            height,
          )}
        />
      ))}
    </div>
  );
}

/** A mentor's note — three ruled lines, no wording that could read as a result. */
function GuidanceBeat() {
  return (
    <div className="flex h-6 w-full items-center justify-center">
      <div className="w-full max-w-[5.5rem] space-y-1.5 rounded-md bg-ivory-50 px-2 py-1.5">
        <span className="block h-1 w-4/5 rounded-full bg-ink-900/15" />
        <span className="block h-1 w-full rounded-full bg-terracotta-400/70" />
        <span className="block h-1 w-3/5 rounded-full bg-ink-900/15" />
      </div>
    </div>
  );
}

const beats = [SpeakBeat, PatternBeat, GuidanceBeat];

export function SignalToGuidance({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[20px] border border-ivory-100/15 bg-ivory-100/[0.04] p-5 sm:p-6',
        className,
      )}
    >
      <ol className="grid gap-5 sm:grid-cols-3">
        {signalToGuidance.steps.map((step, index) => {
          const Beat = beats[index];
          return (
            <li
              key={step.label}
              className="flex items-start gap-4 sm:flex-col sm:gap-3 sm:border-t sm:border-ivory-100/15 sm:pt-4"
            >
              <div aria-hidden="true" className="w-16 shrink-0 sm:w-full sm:max-w-[7rem]">
                <Beat />
              </div>
              <div className="min-w-0">
                <p className="text-[0.8125rem] font-medium text-ivory-50">{step.label}</p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-ivory-100/60">
                  {step.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-5 border-t border-ivory-100/15 pt-4 text-[0.8125rem] text-ivory-100/55">
        {signalToGuidance.caption}
      </p>
    </div>
  );
}
