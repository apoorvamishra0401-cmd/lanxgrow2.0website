/**
 * Home page copy.
 *
 * Narrative order matters: this is one brand story, not a card grid.
 * Copy is deliberately short so the page can show the product instead of
 * describing it. Keep language honest — no statistics, guarantees, fabricated
 * results or unverified claims.
 */

export const homeHero = {
  eyebrow: 'AI-first English communication practice',
  headline: 'Command the room.',
  supporting:
    'Structured English practice for two kinds of learners — young voices finding their footing, and students and professionals preparing for the moments that matter. Practise with intelligent voice and video tasks; go further with LanXgrow live learning programmes.',
  primaryCta: { label: 'Explore the experience', to: '#experience' },
  secondaryCta: { label: 'Talk to us', to: '/contact' },
} as const;

/** The learning method, stated plainly. */
export const homeApproach = {
  eyebrow: 'Approach',
  heading: 'Our learning method',
  intro:
    'LanXgrow\'s approach to English communication practice is built on structured, progressive exercises that develop practical skills through consistent practice.',
  pillars: [
    {
      title: 'Direct Practice',
      body:
        'Hands-on exercises that build real communication skills, not just theoretical knowledge.',
    },
    {
      title: 'AI-Enhanced Feedback',
      body:
        'Intelligent voice and video tasks provide personalised feedback to accelerate progress.',
    },
    {
      title: 'Human Guidance',
      body:
        'Expert instructors review progress and provide direction tailored to individual goals.',
    },
  ],
} as const;

/** The compact brand story — method pillars stated plainly. */
export const homeWhyLanXgrow = {
  eyebrow: 'Why LanXgrow',
  heading: 'English Communication is the core, AI supports the experience.',
  intro:
    'LanXgrow is built around disciplined English communication practice. AI supports the learning experience through the product\'s intended voice and video assessment approach. Personalisation is a stated direction of the product, not a claim about today\'s build.',
} as const;

type AiCapability = {
  label: string;
  detail: string;
};

export const homeSmartAi = {
  eyebrow: 'Smart AI',
  heading: 'Practice that responds. Progress you can see.',
  body:
    'AI-supported voice and video practice is the centre of the LanXgrow experience — comfortable formats that invite learners to speak, and clearer material for anyone guiding them. What is live today and what comes next is stated plainly.',
  verifiedToday: [] as AiCapability[],
  plannedNext: [
    {
      label: 'Voice and video practice screens',
      detail: 'Comfortable formats that invite learners to speak.',
    },
    {
      label: 'Clearer starting point for mentors',
      detail: 'Practice output used as guidance material, never a verdict.',
    },
  ] as AiCapability[],
  disclaimer:
    'Capabilities described here reflect how Smart AI supports the LanXgrow approach. Specific scoring, accuracy or performance guarantees are not claimed. Planned capabilities are labelled as planned.',
} as const;

export const homeProgrammes = {
  eyebrow: 'Live learning programmes',
  heading: 'Technology brings practice closer. Expertise brings perspective.',
  body:
    'Our expert team brings subject knowledge, practical guidance and a human perspective to LanXgrow live learning programmes — helping learners approach communication with greater intention and direction.',
  points: [
    {
      title: 'Subject knowledge',
      body: 'Instructors who know English communication as a discipline, not just a curriculum.',
    },
    {
      title: 'Practical guidance',
      body: 'Feedback shaped around real situations: the interview, the classroom, the meeting.',
    },
    {
      title: 'A human perspective',
      body: 'Judgement, encouragement and direction that no practice screen can supply.',
    },
  ],
  closer:
    'Programmes run alongside the AI-first experience — for learners who want the human layer, never assumed as part of it.',
} as const;

export const homeClosing = {
  eyebrow: 'Join LanXgrow',
  heading: 'Give language the attention it deserves.',
  body: 'For parents, students and adult learners — the first step is simply to begin.',
  primaryCta: { label: 'Explore the experience', to: '#experience' },
  secondaryCta: { label: 'Talk to us', to: '/contact' },
} as const;

/** The intended customer journey: Explore → Connect → Learn and practise. */
export const homeGetStarted = {
  eyebrow: 'The journey',
  heading: 'Explore, connect, then learn.',
  steps: [
    {
      index: '01',
      title: 'Explore',
      body: 'See how the programme works and what English Communication involves.',
    },
    {
      index: '02',
      title: 'Connect',
      body: 'Tell us about the learner and what you are hoping for.',
    },
    {
      index: '03',
      title: 'Learn and practise',
      body: 'Follow the learning route that fits your goals and pace.',
    },
  ],
} as const;
