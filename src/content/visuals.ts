/**
 * Copy for the original editorial visuals.
 *
 * Every composition on the site is illustrative. Labels are kept short and
 * captions stay honest about what is and is not happening — no visual claims
 * a measurement, a score or a live recording.
 */

/** Text alternatives, so each composition is described rather than decorative noise. */
export const visualCaptions = {
  conversation: 'Illustration: a conversation moving between speaking and listening.',
  guidedPath: 'Illustration: a mentor standing beside each stage of the path.',
  convergence: 'Illustration: voice and video assessments both lead to one plan made with a mentor.',
  signalToGuidance: 'Illustration: a spoken answer becoming guidance from a mentor.',
} as const;

export const conversationThreads = {
  speakLabel: 'Speak',
  listenLabel: 'Listen',
} as const;

export const guidedPath = {
  mentorLabel: 'Mentor',
  caption: 'Guidance beside each step, never ahead of the learner.',
} as const;

export const twoWaysOnePlan = {
  voiceLabel: 'Voice',
  videoLabel: 'Video',
  planLabel: 'One plan, whichever way you begin.',
} as const;

export const signalToGuidance = {
  steps: [
    { label: 'The learner speaks', detail: 'A voice or video prompt, in their own words.' },
    { label: 'Patterns surface', detail: 'Clearer signals for a mentor to read.' },
    { label: 'A mentor guides', detail: 'The next step stays human.' },
  ],
  caption: 'Illustrative only — nothing is recorded, scored or sent.',
} as const;
