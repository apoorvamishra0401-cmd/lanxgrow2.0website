import { Waveform } from '@/components/assessment/Waveform';

/**
 * Small decorative voice motif.
 *
 * Kept as the compact variant of the assessment waveform. The visual language
 * is unchanged from the original motif — terracotta rounded bars — but it now
 * delegates to the shared `Waveform` primitive so motion and reduced-motion
 * behaviour stay consistent across the site.
 */
export function VoiceMotif({
  className,
  tone = 'terracotta',
  bars = 13,
}: {
  className?: string;
  tone?: 'terracotta' | 'inverse';
  bars?: number;
}) {
  return <Waveform bars={bars} tone={tone} className={className} />;
}
