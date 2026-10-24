/**
 * Audience journeys for the homepage.
 *
 * Each path describes how the programme works — not enrolment that exists,
 * not guaranteed outcomes.
 */

export type JourneyStep = {
  index: string;
  title: string;
  body: string;
};

export type Journey = {
  label: string;
  promise: string;
  supporting: string;
  steps: JourneyStep[];
  cta: { label: string; to: string };
};

export const journeyParent: Journey = {
  label: 'For parents & young learners',
  promise: 'Communication confidence, built through structured, age-appropriate practice.',
  supporting:
    'A calm, repeatable routine for younger learners — listening and speaking first, reading and writing alongside — so English becomes something they do, not something they are tested on.',
  steps: [
    {
      index: '01',
      title: 'Start where they are',
      body: 'A comfortable first speaking task. No score is presented as a verdict.',
    },
    {
      index: '02',
      title: 'Practise in a rhythm',
      body: 'Short sessions with a visible structure — small enough to repeat, real enough to matter.',
    },
    {
      index: '03',
      title: 'Follow the path',
      body: 'Progress shows through comparable practice tasks over time. Families wanting guided direction can work with the team through LanXgrow live learning programmes.',
    },
  ],
  cta: { label: 'See how learning works', to: '/services' },
} as const;

export const journeyProfessional: Journey = {
  label: 'For students, job seekers & professionals',
  promise: 'Clear expression, practised for the moments that matter.',
  supporting:
    'Interviews, presentations, classroom participation, workplace conversations — practised in focused voice and video sessions that fit between classes, shifts and everything else.',
  steps: [
    {
      index: '01',
      title: 'Choose the context',
      body: 'Set the situation you are practising for — academic, everyday or professional.',
    },
    {
      index: '02',
      title: 'Speak on a schedule',
      body: 'Time-boxed voice and video tasks that turn preparation into a habit, not a last night.',
    },
    {
      index: '03',
      title: 'Refine with perspective',
      body: 'Treat your practice output as a starting point — and add human judgement from the team through a live learning programme when you want it.',
    },
  ],
  cta: { label: 'Explore the services', to: '/services' },
} as const;

export const journeyFraming = {
  eyebrow: 'Where do you begin?',
  heading: 'Two paths. One standard of practice.',
  closer:
    'Whichever path is yours, the standard is the same: honest assessment, structured practice, and a next step you can name.',
} as const;