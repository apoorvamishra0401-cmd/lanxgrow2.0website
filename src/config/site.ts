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
    'LanXgrow helps students, freshers and working professionals practise English communication for study, interviews and work. Explore guided communication practice, interview preparation and a learning approach shaped around your goals.',
} as const;

export type NavItem = {
  label: string;
  /** Router path. */
  to: string;
};

/** Primary navigation, shared by the desktop header and the mobile drawer. */
export const primaryNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Meet our Lan-X AI', to: '/smart-ai' },
  { label: 'About', to: '/about' },
  { label: 'Interview Prep', to: '/interview-prep' },
  { label: 'Services', to: '/services' },
];

/** Secondary (utility) navigation shown in the footer. */
export const footerNav: NavItem[] = [
  { label: 'Meet our Lan-X AI', to: '/smart-ai' },
  { label: 'About', to: '/about' },
  { label: 'Interview Prep', to: '/interview-prep' },
  { label: 'Services', to: '/services' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Sign In', to: '/signin' },
];

/**
 * Official contact channels.
 *
 * Populated with verified LanXgrow enquiry channels. The Contact page and
 * footer render these as clickable mailto/tel links automatically. No address
 * is published.
 */
export const contactChannels: { email: string; phone: string; whatsapp: string; address: string } = {
  email: 'official@lanxgrow.com',
  phone: '9826365691',
  whatsapp: '919826365691',
  address: '',
};

/** Convenience flag so the UI can adapt without knowing why channels are blank. */
export const hasPublishedContactChannels = Boolean(
  contactChannels.email || contactChannels.phone || contactChannels.address,
);

/** Shared CTA targets so every button across the site stays consistent. */
export const cta = {
  getStarted: { label: 'Try free 1-minute interview', to: '/?start=intro' },
  exploreExperience: { label: 'Explore the experience', to: '#experience' },
  talkToUs: { label: 'Try free 1-minute interview', to: '/?start=intro' },
} as const;
