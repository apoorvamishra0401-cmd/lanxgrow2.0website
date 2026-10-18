/** Contact page copy and form options. */

export const contactIntro = {
  eyebrow: 'Contact',
  heading: 'Start a conversation with LanXgrow.',
  supporting:
    'Tell us a little about the learner and what you are hoping for. Enquiries are read by the LanXgrow team — the form below is a design preview for this stage.',
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
 * Stage 1 honesty notice.
 *
 * The brief requires that this page must not pretend enquiries are stored or
 * sent. This string is rendered as a visible notice beside the form.
 */
export const contactFormNotice =
  'This form is a frontend preview. Submissions are not stored or sent yet — enquiry delivery is connected in a later stage.' as const;

export const contactAside = {
  heading: 'What happens next',
  points: [
    'Share your details and what you would like help with.',
    'A member of the LanXgrow team reviews your enquiry.',
    'You receive guidance on the most suitable next step.',
  ],
  note: 'Official enquiry channels are being finalised and will be published here before launch.',
} as const;
