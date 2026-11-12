/** Deterministic first-interview evidence summary. No AI or acoustic scoring. */
export function objectiveIntroductionReview(transcript, bytes) {
  const cleaned = typeof transcript === 'string' ? transcript.trim().slice(0, 4000) : '';
  const words = cleaned.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || [];
  const meaningful = words.length >= 10;
  const lower=cleaned.toLowerCase();
  const structureChecklist=cleaned ? [
    {item:'Personal introduction',found:/\\b(i am|i'm|my name|myself)\\b/i.test(lower)},
    {item:'Goal or motivation',found:/\\b(goal|want|hope|plan|aim|improve|career|learn)\\b/i.test(lower)},
    {item:'Example or experience',found:/\\b(example|project|studied|worked|experience|enjoy|practice|because)\\b/i.test(lower)}
  ] : [];
  return {
    version: 'first-introduction-v1',
    aiEvaluated: false,
    recordingReceived: true,
    recordingBytes: bytes,
    transcriptSource: cleaned ? 'browser-generated-or-user-corrected-unverified' : 'unavailable',
    transcriptWords: cleaned ? words.length : null,
    structureChecklist,
    observations: cleaned
      ? [`The available text contains ${words.length} words.`, meaningful
        ? 'A usable written transcript was provided for reflection.'
        : 'The available text is short; add detail when practising again.']
      : ['Recording uploaded. A reliable spoken-language transcript was not available.'],
    suggestedNextSteps: cleaned
      ? ['Practise a clear opening, one supporting example and a closing sentence.',
         'Review the transcript against the recording before treating it as accurate.']
      : ['Listen to your recording privately and identify one clear opening and example.',
         'Try again in a supported browser to capture optional speech-to-text.'],
    limitations: 'This is an evidence-based completion and basic transcript-structure checklist, not an AI, grammar, pronunciation, fluency, or proficiency evaluation. A browser-generated transcript may be inaccurate.'
  };
}
