/** Contact page copy and form options. */

export const contactIntro = {
  eyebrow: 'Contact',
  heading: 'Start a conversation with LanXgrow.',
  supporting:
    'Online enquiries are not open yet. In the meantime, our Services page explains how LanXgrow works.',
} as const;

/**
 * Shown while no enquiry endpoint is configured.
 *
 * This is a plain availability message for visitors. It states that the form is
 * not active so nothing entered here can be mistaken for a delivered enquiry.
 */
export const contactAvailability = {
  title: 'Enquiries are not open yet',
  body: 'This form is not active, so nothing you enter here is sent to anyone. When enquiries open, this is how you will be able to reach the LanXgrow team.',
} as const;

/** Reason-for-enquiry options. Kept aligned with the published services. */
export const enquiryReasons = [
  'English Communication',
  'Mentorship & guided learning',
  'Smart AI-supported assessments',
  'Something else',
] as const;

export type EnquiryReason = (typeof enquiryReasons)[number];

/**
 * Copy used once a real enquiry endpoint is configured.
 *
 * The success message is only ever rendered after that endpoint has confirmed
 * delivery — there is no local "assume it worked" path.
 */
export const contactLiveCopy = {
  introSupporting:
    'Tell us a little about the learner and what you are hoping for. Enquiries are read by the LanXgrow team.',
  noticeTitle: 'How this works',
  notice:
    'Your enquiry is sent to the LanXgrow team and used only to reply to you. Nothing is stored on this website.',
  successTitle: 'Enquiry sent',
  success:
    'Thank you — your enquiry reached the LanXgrow team. Someone will reply to the address you provided.',
  failedTitle: 'Delivery not confirmed',
  checking: 'Sending…',
  send: 'Send enquiry',
} as const;

export const contactAside = {
  heading: 'What happens next',
  points: [
    'Share your details and what you would like help with.',
    'A member of the LanXgrow team reviews your enquiry.',
    'You receive guidance on the most suitable next step.',
  ],
  note: 'Enquiry channels will open on this page.',
} as const;
