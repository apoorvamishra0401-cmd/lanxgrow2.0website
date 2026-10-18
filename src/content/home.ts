/**
 * Home page copy.
 *
 * Narrative order matters: this is one brand story, not a card grid.
 * Copy is deliberately short so the page can show the product instead of
 * describing it. Keep language honest — no statistics, guarantees, fabricated
 * results or unverified claims.
 */

export const homeHero = {
  eyebrow: 'English Communication',
  headline: 'The confidence to speak English, built with care.',
  supporting:
    'Mentorship, structured practice and Smart AI-supported voice and video assessments — in one calm, deliberate programme.',
  primaryCta: { label: 'Get started', to: '/signin' },
  secondaryCta: { label: 'Explore our services', to: '/services' },
  footnote: 'Frontend preview — account creation opens in the next stage.',
} as const;

/** The three pillars, held together — the compact version of the brand story. */
export const homeApproach = {
  eyebrow: 'Why LanXgrow',
  heading: 'Three things, held together.',
  intro:
    'English Communication is the goal. Mentorship is how we get there. Smart AI keeps the starting point honest.',
  pillars: [
    {
      title: 'English Communication',
      body: 'Speaking, listening and expression — practised until it feels natural.',
    },
    {
      title: 'Mentorship',
      body: 'A mentor who knows the learner, sets the next step and stays with them.',
    },
    {
      title: 'Smart AI assessments',
      body: 'Voice and video assessments that give mentors a clearer place to begin.',
    },
  ],
} as const;

export const homeSmartAi = {
  eyebrow: 'Smart AI',
  heading: 'Smart AI supports the mentor. It never replaces them.',
  body: 'Voice and video assessments give learners a comfortable way to speak, and give mentors a clearer picture to guide from. The technology stays in the background.',
  markers: [
    { label: 'Two ways to begin', detail: 'Voice or video — whichever feels natural.' },
    { label: 'A clearer starting point', detail: 'Guidance responds to the learner, not a script.' },
    { label: 'Human judgement', detail: 'Encouragement and direction stay with the mentor.' },
  ],
  disclaimer:
    'Capabilities described here reflect how Smart AI supports the LanXgrow approach. Specific scoring, accuracy or performance guarantees are not claimed.',
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
      body: 'Create an account and complete a short voice or video assessment.',
    },
    {
      index: '03',
      title: 'Learn and practise',
      body: 'Work with a mentor on a plan built around you.',
    },
  ],
  note: 'Intended journey — accounts and assessments open in a later stage.',
} as const;

export const homeClosing = {
  eyebrow: 'Join LanXgrow',
  heading: 'Give language the attention it deserves.',
  body: 'For parents, students and adult learners — the first step is simply to begin.',
  primaryCta: { label: 'Get started', to: '/signin' },
  secondaryCta: { label: 'Talk to us', to: '/contact' },
} as const;
