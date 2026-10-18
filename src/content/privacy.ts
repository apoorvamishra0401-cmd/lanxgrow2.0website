/**
 * Privacy Notice content.
 *
 * Everything here was written after inspecting the actual site code and build
 * configuration. It deliberately makes no claim that cannot be verified from
 * this repository:
 *
 *   - There are no cookies, no analytics and no client storage.
 *   - There is no account system in this launch build.
 *   - The contact form is not active, so it sends nothing.
 *   - The only third-party request is Google Fonts (see index.html).
 *
 * PENDING FOUNDER / LEGAL CONFIRMATION (do not invent):
 *   - the hosting provider for the public deployment, and whether it keeps
 *     server/access logs;
 *   - a dedicated privacy contact (email or postal address);
 *   - the applicable legal framework and retention wording (e.g. India's DPDP
 *     Act, 2023) for legal review.
 * Update this file once those facts are confirmed.
 */

export const privacyIntro = {
  eyebrow: 'Privacy',
  heading: 'Privacy Notice',
  supporting:
    'What this website does with your information, explained in plain language.',
} as const;

export type PrivacySection = {
  heading: string;
  paragraphs: string[];
};

export const privacySections: PrivacySection[] = [
  {
    heading: 'About this notice',
    paragraphs: [
      'This notice describes the current LanXgrow public website. It explains what the site does and does not collect today, and what will change as features are introduced.',
    ],
  },
  {
    heading: 'Information we collect',
    paragraphs: [
      'The LanXgrow website does not ask for, collect or store personal information. There are no accounts, no newsletter sign-up and no tracking of individual visitors.',
      'Any details you type into a form on this site stay in your browser. Nothing is transmitted to LanXgrow.',
    ],
  },
  {
    heading: 'Cookies, analytics and advertising',
    paragraphs: [
      'This website does not use cookies, analytics tools, advertising identifiers or third-party trackers. It does not build a profile of your visit.',
    ],
  },
  {
    heading: 'Third-party requests',
    paragraphs: [
      'The site loads its typefaces from Google Fonts. When a page opens, your browser requests those font files from Google, which receives your IP address and standard request information such as your browser type. This is the only third-party service the site uses.',
    ],
  },
  {
    heading: 'Accounts and sign-in',
    paragraphs: [
      'LanXgrow accounts are not available yet. If account sign-in is introduced, this notice will be updated to explain what information is collected, why it is needed and how long it is kept, before that feature goes live.',
    ],
  },
  {
    heading: 'Enquiries',
    paragraphs: [
      'Online enquiries are not open yet, and the enquiry form on the Contact page is not active. When enquiries open, the details you provide will be used only to respond to you, and this notice will be updated to say so.',
    ],
  },
  {
    heading: 'Questions about privacy',
    paragraphs: [
      'A dedicated contact channel for privacy questions will be published here once it is available. This page will always show the current, accurate way to reach us.',
    ],
  },
  {
    heading: 'Changes to this notice',
    paragraphs: [
      'As the website changes, this notice will be updated to match. The most recent version will always appear on this page.',
    ],
  },
];
