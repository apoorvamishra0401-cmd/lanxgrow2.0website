import { cn } from '@/lib/cn';
import { guidedPath, visualCaptions } from '@/content/visuals';

/**
 * Guided path — an original editorial motif for Mentorship & Guided Learning.
 *
 * A dashed route with four stages, and a mentor marker that sits *beside* one
 * of them rather than at the end. That is the whole point of the service: the
 * mentor accompanies the learner instead of handing over a finished plan.
 *
 * Drawn with hairlines and dots so it reads as part of the same system as the
 * assessment panels. Fully static — no motion, nothing to reduce.
 */

const DOTS = ['start', 'mentor', 'mid', 'goal'] as const;

const dotStyles: Record<(typeof DOTS)[number], string> = {
  start: 'h-1.5 w-1.5 bg-ink-300',
  mentor: 'h-2.5 w-2.5 border border-terracotta-400 bg-ivory-50',
  mid: 'h-1.5 w-1.5 bg-ink-300',
  goal: 'h-2.5 w-2.5 bg-terracotta-500',
};

export function GuidedPath({ className }: { className?: string }) {
  return (
    <div className={cn('select-none', className)}>
      <div role="img" aria-label={visualCaptions.guidedPath} className="relative h-[76px]">
        {/* Mentor, standing alongside rather than ahead. */}
        <div className="absolute left-1/3 top-0 flex -translate-x-1/2 flex-col items-center">
          <span className="whitespace-nowrap rounded-full border border-terracotta-200 bg-terracotta-50 px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-terracotta-700">
            {guidedPath.mentorLabel}
          </span>
          <span
            aria-hidden="true"
            className="mt-0.5 h-[26px] border-l border-dashed border-terracotta-300"
          />
        </div>

        {/* The route itself. */}
        <span aria-hidden="true" className="absolute inset-x-0 top-[54px] border-t border-dashed border-line" />

        <div aria-hidden="true" className="absolute inset-x-0 top-[50px] flex items-center justify-between">
          {DOTS.map((dot) => (
            <span key={dot} className={cn('rounded-full', dotStyles[dot])} />
          ))}
        </div>
      </div>

      <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-500">{guidedPath.caption}</p>
    </div>
  );
}
