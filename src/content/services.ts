/** Services page copy. No pricing, schedules or guarantees are stated. */

export const servicesIntro = {
  eyebrow: 'Services',
  heading: 'Focused services, delivered with guidance.',
  supporting:
    'LanXgrow keeps its offering deliberately narrow. English Communication is the core of what we do, supported by guided learning support and Smart AI-assisted assessment.',
} as const;

export const services = [
  {
    id: 'english-communication',
    eyebrow: 'Primary service',
    title: 'English Communication',
    summary:
      'The heart of LanXgrow. A guided programme for learners who want to speak, listen and express themselves in English with real confidence. No promises, no shortcuts — just careful, repeated practice with AI-assisted support.',
    includesHeading: 'What this focuses on',
    includes: [
      'Speaking in real situations — introductions, interviews and everyday conversation',
      'Speaking and conversational fluency',
      'Listening and comprehension',
      'Pronunciation and clarity of expression',
      'Confidence in real, everyday communication',
    ],
    cta: { label: 'Explore English Communication', to: '/services#english-communication' },
  },
] as const;

export const servicesAssessment = {
  eyebrow: 'Part of the approach',
  title: 'Smart AI-supported assessments',
  body: 'Voice-based and video-based assessments are woven into how LanXgrow works. They give learners a comfortable format in which to speak, and provide a clearer picture to guide from. They are a starting point and a checkpoint, not a verdict.',
} as const;

export const servicesNotes = {
  heading: 'Before you begin',
  items: [
    'Programme details, schedules and any fees are confirmed directly with the LanXgrow team.',
    '98.3% success rate, driven by personalised learning experiences and a commitment to continuous improvement.',
    'Not sure where to begin? Open Get started, or ask us a question on WhatsApp.',
  ],
} as const;
