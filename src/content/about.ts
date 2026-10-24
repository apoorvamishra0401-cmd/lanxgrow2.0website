/** About page copy. Human-centred, concise, and limited to what can be stated honestly. */

export const aboutIntro = {
  eyebrow: 'About LanXgrow',
  heading: 'AI-Powered English Learning, Personalised Around You.',
  supporting:
    'English communication shapes how people express their ideas, build confidence and participate in the world around them. At LanXgrow, we bring together personalised learning, guided practice and AI-assisted assessment to help each learner develop at their own pace.',
} as const;

export const aboutPurpose = {
  eyebrow: 'Purpose',
  heading: 'Why LanXgrow Exists',
  paragraphs: [
    'Learning English is one thing. Feeling ready to use it in the real world is another.',
    'English communication develops through more than grammar and vocabulary. Learners need opportunities to express their thoughts, practise real conversations, make mistakes, receive meaningful feedback and try again.',
    'Yet access to these opportunities and the ability to use English can differ widely. At LanXgrow, we want to help close that gap through structured speaking practice, personalised learning and AI-assisted assessment—designed to help learners build practical communication skills at their own pace.',
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
  figure: '42.7%',
  statement: 'of surveyed rural Indian youth aged 14–18 could not read at least simple sentences in English.',
  source:
    'ASER 2023, Beyond Basics. Survey conducted across 28 districts in 26 states.\n\nThis measures basic English reading ability, not speaking fluency or conversational confidence.',
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
      title: 'Communication Before Perfection',
      body: 'Build the confidence to express your thoughts, practise speaking and learn through meaningful feedback.',
    },
    {
      title: 'Learning That Adapts to You',
      body: 'Personalised practice responds to your learning needs, helping you focus on what to work on next.',
    },
    {
      title: 'Technology With a Purpose',
      body: 'LAN-X AI supports voice and video assessments, helping learners practise, review their performance and recognise areas for improvement.',
    },
  ],
} as const;

export const aboutApproach = {
  eyebrow: 'THE LANXGROW APPROACH',
  heading: 'English Is Not Just What You Know. It\'s What You Can Express.',
  body: [
    'You may understand English but struggle to speak. You may know the words but find it difficult to form sentences in the moment. Or you may hold back because you\'re afraid of making mistakes.',
    'Your learning should begin with these challenges, not with a one-size-fits-all lesson. LanXgrow brings together structured English practice, AI-powered guidance, and voice and video assessments to help you understand where you stand, recognise what is holding you back, and work on the skills that matter most to you.',
  ],
} as const;

export const aboutCommitments = {
  eyebrow: 'Commitments',
  heading: 'What you can expect from us',
  items: [
    'Plain, honest descriptions of what our services involve.',
    'Guided practice that treats learners with patience and respect.',
    'A deliberate pace, prioritising real communication over busywork.',
    'No exaggerated claims about outcomes we cannot verify.',
  ],
} as const;
