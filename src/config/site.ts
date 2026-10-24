/**
 * Central site configuration.
 *
 * Everything a non-developer is likely to edit — brand strings, navigation,
 * contact channels and CTAs — lives here rather than inside components.
 */

export const brand = {
  name: 'LanXgrow',
  /** Short, honest positioning line reused in metadata and the footer. */
  tagline: 'Speak Smart, Think Smart',
  description:
    'LanXgrow is an AI-powered English learning platform designed to help learners build confidence, improve communication skills, and achieve fluency through personalized practice and intelligent guidance. With AI-supported voice and video assessments, interactive learning experiences, and personalized feedback, LanXgrow helps learners identify their strengths, improve their weaknesses, track their progress, and discover the next steps in their learning journey.\n\nOur mission is to make English learning more accessible, engaging, and personalized, empowering every learner to grow at their own pace without the fear of judgment.',
} as const;

export type NavItem = {
  label: string;
  /** Router path. */
  to: string;
};

/** Primary navigation, shared by the desktop header and the mobile drawer. */
export const primaryNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

/** Secondary (utility) navigation shown in the footer. */
export const footerNav: NavItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Sign in', to: '/get-started' },
];

/**
 * Official contact channels.
 *
 * Populated with verified LanXgrow enquiry channels. The Contact page and
 * footer render these as clickable mailto/tel links automatically. No address
 * is published.
 */
export const contactChannels: { email: string; phone: string; address: string } = {
  email: 'official@lanxgrow.com',
  phone: '9826365691',
  address: '',
};

/** Convenience flag so the UI can adapt without knowing why channels are blank. */
export const hasPublishedContactChannels = Boolean(
  contactChannels.email || contactChannels.phone || contactChannels.address,
);

/** Shared CTA targets so every button across the site stays consistent. */
export const cta = {
  getStarted: { label: 'Get started', to: '/get-started' },
  exploreExperience: { label: 'Explore the experience', to: '#experience' },
  talkToUs: { label: 'Get started', to: '/get-started' },
} as const;
