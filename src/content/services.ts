/** Services page copy. No pricing, schedules or guarantees are stated. */

export const servicesIntro = {
  eyebrow: 'Services',
  heading: 'Focused services, delivered with guidance.',
  supporting:
    'LanXgrow keeps its offering deliberately narrow. English Communication is the core of what we do, supported by mentorship, guided learning support, and Smart AI-assisted assessment.',
} as const;

export const services = [
  {
    id: 'english-communication',
    eyebrow: 'Primary service',
    title: 'English Communication',
    summary:
      'The heart of LanXgrow. A guided programme for learners who want to speak, listen and express themselves in English with real confidence.',
    includesHeading: 'What this focuses on',
    includes: [
      'Speaking and conversational fluency',
      'Listening and comprehension',
      'Pronunciation and clarity of expression',
      'Confidence in real, everyday communication',
    ],
    cta: { label: 'Get started', to: '/signin' },
  },
  {
    id: 'mentorship',
    eyebrow: 'Support',
    title: 'Mentorship & Guided Learning',
    summary:
      'Personal guidance that keeps progress steady. A mentor works with the learner on what matters next, rather than leaving them to navigate alone.',
    includesHeading: 'What this provides',
    includes: [
      'A mentor who works alongside the learner',
      'Direction on what to practise and why',
      'Support shaped around the learner’s pace and goals',
      'A point of contact for parents and adult learners',
    ],
    cta: { label: 'Start a conversation', to: '/contact' },
  },
] as const;

export const servicesAssessment = {
  eyebrow: 'Part of the approach',
  title: 'Smart AI-supported assessments',
  body: 'Voice-based and video-based assessments are woven into how LanXgrow works. They give learners a comfortable format in which to speak, and give mentors a clearer picture to guide from.',
} as const;

export const servicesNotes = {
  heading: 'Before you begin',
  items: [
    'Programme details, schedules and any fees are confirmed directly with the LanXgrow team.',
    'We do not publish guarantees about outcomes, because genuine progress depends on the learner.',
    'If you are unsure which service fits, the enquiry form is the right place to start.',
  ],
} as const;
