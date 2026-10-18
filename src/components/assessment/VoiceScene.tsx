import { assessmentScenes } from '@/content/assessment';
import { Waveform } from './Waveform';

const scene = assessmentScenes.voice;

/**
 * Voice assessment scene.
 *
 * Retains the approved motif — terracotta bars on a warm sand panel — and adds
 * a listening state, a larger waveform and an explicit stage label. No
 * microphone is accessed and no audio is captured.
 */
export function VoiceScene() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-sand/70 px-5 py-4 sm:px-6 sm:py-5">
      {/* State */}
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-terracotta-500"
        />
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-terracotta-700">
          {scene.state}
        </span>
      </div>

      {/* Waveform */}
      <Waveform bars={24} className="h-12 sm:h-16" tone="terracotta" />

      {/* Stage */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-[0.75rem] text-ink-500">{scene.stage}</span>
        <span className="hidden text-[0.75rem] text-ink-500 sm:block">{scene.hint}</span>
      </div>
    </div>
  );
}
