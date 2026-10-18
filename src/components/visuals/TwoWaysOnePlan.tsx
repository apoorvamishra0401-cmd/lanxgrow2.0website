import { cn } from '@/lib/cn';
import { twoWaysOnePlan, visualCaptions } from '@/content/visuals';

/**
 * Two ways, one plan — the hero's mentorship motif.
 *
 * The assessment panel above shows the two ways a learner can begin. This small
 * composition closes the loop: both of them arrive at a single plan made with a
 * mentor. It is the visual half of the sentence beside it, and it gives the
 * mentor note a reason to sit under the product panel.
 *
 * Drawn with pills, hairlines and a bracketed join — the same vocabulary as the
 * rest of the site, and it aligns itself to the pills at every width, so there
 * are no fixed measurements to drift.
 */
export function TwoWaysOnePlan({ className }: { className?: string }) {
  const pill =
    'whitespace-nowrap rounded-full border border-line bg-ivory-50 px-2.5 py-1 text-[0.6875rem] font-medium text-ink-700';

  return (
    <div
      role="img"
      aria-label={visualCaptions.convergence}
      className={cn('flex items-center gap-2.5', className)}
    >
      <div className="flex shrink-0 flex-col gap-1.5">
        <span className={pill}>{twoWaysOnePlan.voiceLabel}</span>
        <span className={pill}>{twoWaysOnePlan.videoLabel}</span>
      </div>

      {/* The two ways joining into one. Inset by half a pill, so the bracket
          meets the centre of each label rather than its edge. */}
      <span
        aria-hidden="true"
        className="relative w-3 shrink-0 self-stretch"
      >
        <span className="absolute bottom-[13px] left-0 top-[13px] w-3 rounded-l-[9px] border-y border-l border-terracotta-300" />
      </span>

      {/* …and the single line that leaves it. */}
      <span aria-hidden="true" className="relative h-px w-4 shrink-0 bg-terracotta-300">
        <span className="absolute -top-[3px] right-0 h-1.5 w-1.5 rotate-45 border-r border-t border-terracotta-300" />
      </span>

      <p className="text-[0.75rem] leading-snug text-ink-500">{twoWaysOnePlan.planLabel}</p>
    </div>
  );
}
