/**
 * Copy for the voice / video assessment demonstration.
 *
 * This is a *visual demonstration* of how assessments are presented to
 * learners. Nothing here claims that audio or video is captured, or that any
 * assessment engine is running.
 */

export type AssessmentMode = 'voice' | 'video';

export const assessmentModes: AssessmentMode[] = ['voice', 'video'];

export const assessmentShowcase = {
  selectorLabel: 'Assessment type',
  smartAiLabel: 'Smart AI',
  /** Shown in the panel footer for both modes. */
  disclaimer: 'Visual demonstration — no camera or microphone is in use.',
  progressLabel: 'Illustrative preview',
} as const;

export const assessmentScenes: Record<
  AssessmentMode,
  {
    tab: string;
    /** Visible state indicator inside the scene. */
    state: string;
    /** Assessment-stage label. */
    stage: string;
    hint: string;
  }
> = {
  voice: {
    tab: 'Voice',
    state: 'Listening',
    stage: 'Speaking prompt',
    hint: 'Speak naturally',
  },
  video: {
    tab: 'Video',
    state: 'Rec',
    stage: 'Speaking prompt',
    hint: 'Seen and heard',
  },
};

/** Compact tiles used where the full interactive scene would be too much. */
export const assessmentTiles = {
  voice: { label: 'Voice-based', hint: 'Speak naturally' },
  video: { label: 'Video-based', hint: 'Seen and heard' },
  note: 'They support mentorship — they never stand in for it.',
} as const;
