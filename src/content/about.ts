/** About page copy. Human-centred, concise, and limited to what can be stated honestly. */

export const aboutIntro = {
  eyebrow: 'About LanXgrow',
  heading: 'An education brand built around how people actually learn to speak.',
  supporting:
    'English Communication changes what a person can do — at school, at work and in the world. Our work is to make that growth guided and patient.',
} as const;

export const aboutPurpose = {
  eyebrow: 'Purpose',
  heading: 'Why LanXgrow exists',
  paragraphs: [
    'Learning English and using English in everyday conversation are related, but they are not identical skills.',
    'A 2022 British Council review of English teaching and learning in India discussed the limited space often given to speaking and listening in classroom practice. The review synthesised existing research and policy, alongside a small number of interviews; it was not a nationally representative test of students’ spoken English.',
    'LanXgrow exists to explore how structured speaking practice, supportive human mentorship and thoughtful assessment can help learners put their knowledge to use.',
  ],
} as const;

/**
 * Research note shown on the About page.
 *
 * The figure, age range, rural scope and the reading-only limitation must always
 * appear together. It is never a spoken-English statistic and never belongs in
 * the homepage hero.
 */
export const aboutResearch = {
  eyebrow: 'Research note',
  figure: '57.3%',
  statement: 'of rural youth aged 14–18 could read simple sentences in English.',
  source:
    'Source: ASER 2023, rural India. The finding measures the ability to read simple English sentences; it does not measure spoken English fluency, listening ability or conversational confidence.',
} as const;

/**
 * Progress copy.
 *
 * Deliberately future-facing: it describes an intended approach, and promises
 * neither a fixed timeline nor an outcome.
 */
export const aboutProgress = {
  eyebrow: 'Progress',
  heading: 'Progress, reviewed with care',
  body: 'Our intended approach is to understand a learner’s starting point, use comparable speaking activities to review progress, and give specific feedback along the way. We do not promise a fixed timeline or a particular outcome.',
} as const;

export const aboutPhilosophy = {
  eyebrow: 'Philosophy',
  heading: 'What we believe about learning',
  beliefs: [
    {
      title: 'Communication before correctness',
      body: 'A learner who is willing to speak will improve. Confidence comes first.',
    },
    {
      title: 'Mentorship is the method',
      body: 'A mentor notices what a syllabus cannot, and adapts as the learner does.',
    },
    {
      title: 'Technology should be quiet',
      body: 'Smart AI supports voice and video assessments — leaving more room for human judgement.',
    },
  ],
} as const;

export const aboutApproach = {
  eyebrow: 'Approach',
  heading: 'How we work with English Communication and mentorship',
  body: [
    'Learners are assessed first, so support responds to their real level rather than an assumed one. Mentorship then guides the work: what to practise, what to notice, and what to do next.',
    'Parents and adult learners remain part of the picture. Language growth is easier to sustain when the people around a learner understand what is being worked on.',
  ],
} as const;

export const aboutCommitments = {
  eyebrow: 'Commitments',
  heading: 'What you can expect from us',
  items: [
    'Plain, honest descriptions of what our services involve.',
    'Mentorship that treats learners with patience and respect.',
    'A deliberate pace, prioritising real communication over busywork.',
    'No exaggerated claims about outcomes we cannot verify.',
  ],
} as const;
