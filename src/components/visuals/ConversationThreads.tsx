import { cn } from '@/lib/cn';
import { conversationThreads, visualCaptions } from '@/content/visuals';

/**
 * Conversation rhythm — an original editorial motif for English Communication.
 *
 * Two voice threads, one speaking and one listening, separated by a turn rule.
 * It shows what the service summary describes in a sentence: communication is a
 * back-and-forth, not a monologue.
 *
 * Drawn with the same rounded bars as the assessment waveform so the visual
 * language stays consistent. Heights are fixed, so the motif renders
 * identically every time and nothing animates.
 */

/** Deterministic envelopes — a spoken burst, then the reply that follows it. */
const SPEAK = [44, 70, 52, 88, 64, 40, 76, 96, 58, 46, 82, 50, 68, 38, 72, 48];
const LISTEN = [32, 46, 58, 42, 64, 74, 50, 36, 56, 70, 44, 62, 40, 54, 34, 44];

function Thread({
  label,
  heights,
  barClass,
}: {
  label: string;
  heights: number[];
  barClass: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-11 shrink-0 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-ink-500">
        {label}
      </span>
      <div className="flex h-8 flex-1 items-center gap-[0.18rem]">
        {heights.map((height, index) => (
          <span
            key={index}
            className={cn('flex-1 rounded-full', barClass)}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ConversationThreads({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label={visualCaptions.conversation}
      className={cn('select-none', className)}
    >
      <Thread
        label={conversationThreads.speakLabel}
        heights={SPEAK}
        barClass="bg-terracotta-500"
      />

      {/* The turn between one voice and the other. */}
      <div aria-hidden="true" className="my-3 flex items-center gap-2 pl-14">
        <span className="h-px flex-1 bg-line" />
        <span className="h-1 w-1 rounded-full bg-terracotta-300" />
        <span className="h-px flex-1 bg-line" />
      </div>

      <Thread
        label={conversationThreads.listenLabel}
        heights={LISTEN}
        barClass="bg-ink-300"
      />
    </div>
  );
}
