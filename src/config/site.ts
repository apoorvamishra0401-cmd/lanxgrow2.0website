/**
 * Central site configuration.
 *
 * Everything a non-developer is likely to edit — brand strings, navigation,
 * contact channels and CTAs — lives here rather than inside components.
 */

export const brand = {
  name: 'LanXgrow',
  /** Short, honest positioning line reused in metadata and the footer. */
  tagline: 'English Communication & Mentorship',
  description:
    'LanXgrow is an education brand built around English Communication, guided mentorship and Smart AI-supported voice and video assessments.',
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
  { label: 'Sign in', to: '/signin' },
];

/**
 * Official contact channels.
 *
 * Intentionally left empty for Stage 1: the brief forbids inventing company
 * facts, and no verified enquiry inbox has been provided yet. The Contact page
 * renders a graceful note while these are blank, and will show real channels
 * automatically once they are filled in.
 *
 * TODO(stage-2): populate with verified LanXgrow enquiry channels before launch.
 */
export const contactChannels: { email: string; phone: string; address: string } = {
  email: '',
  phone: '',
  address: '',
};

/** Convenience flag so the UI can adapt without knowing why channels are blank. */
export const hasPublishedContactChannels = Boolean(
  contactChannels.email || contactChannels.phone || contactChannels.address,
);

/** Shared CTA targets so every button across the site stays consistent. */
export const cta = {
  getStarted: { label: 'Get started', to: '/services' },
  exploreServices: { label: 'Explore our services', to: '/services' },
  talkToUs: { label: 'Start a conversation', to: '/contact' },
} as const;
