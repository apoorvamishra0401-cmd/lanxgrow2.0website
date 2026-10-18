/**
 * Privacy Notice content.
 *
 * Everything here was written after inspecting the actual site code and build
 * configuration. It deliberately makes no claim that cannot be verified from
 * this repository:
 *
 *   - There are no cookies, no analytics and no client storage.
 *   - There is no account system in this launch build.
 *   - The only third-party request made while a page opens is Google Fonts
 *     (see index.html).
 *
 * The enquiry wording is configuration-aware. `getPrivacySections` describes
 * whichever state is actually built: with no enquiry endpoint configured the
 * form is disabled and nothing leaves the browser, and with one configured the
 * notice says plainly what the form transmits. That is what stops this notice
 * from becoming false the moment enquiry delivery is switched on.
 *
 * STILL PENDING FOUNDER / LEGAL CONFIRMATION (do not invent):
 *   - the hosting provider for the public deployment, and whether it keeps
 *     server/access logs;
 *   - a dedicated privacy contact (email or postal address);
 *   - the applicable legal framework and retention wording (e.g. India's DPDP
 *     Act, 2023) for legal review;
 *   - for a build with an enquiry endpoint configured: what the receiving
 *     service does with a submitted enquiry, and how long it keeps it.
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

export type PrivacyConfig = {
  /**
   * True when `VITE_CONTACT_ENDPOINT` is configured, so the Contact form can
   * transmit what a visitor submits. False in the shipped launch build, where
   * the form's controls are disabled.
   */
  enquiryDeliveryEnabled: boolean;
};

export function getPrivacySections({ enquiryDeliveryEnabled }: PrivacyConfig): PrivacySection[] {
  return [
    {
      heading: 'About this notice',
      paragraphs: [
        'This notice describes the current LanXgrow public website. It explains what the site does and does not collect today, and what will change as features are introduced.',
      ],
    },
    {
      heading: 'Information we collect',
      paragraphs: enquiryDeliveryEnabled
        ? [
            'This website does not create accounts, does not run a newsletter and does not track individual visitors. The only personal information it asks for is what you choose to type into the enquiry form on the Contact page.',
            'When you submit that form, the details you entered — your name, email address, an optional phone number, the reason you selected, your message and your confirmation that we may reply — are transmitted to the service LanXgrow has configured to receive enquiries, so that someone can respond to you. This website itself does not store them.',
          ]
        : [
            'This website does not collect or store personal information. There are no accounts, no newsletter sign-up and no tracking of individual visitors.',
            'The enquiry form on the Contact page is not active, so nothing you type into it is sent anywhere — it stays in your browser.',
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
      paragraphs: enquiryDeliveryEnabled
        ? [
            'The site loads its typefaces from Google Fonts. When a page opens, your browser requests those font files from Google, which receives your IP address and standard request information such as your browser type.',
            'If you submit the enquiry form, what you entered is also sent to the enquiry service described above. Google Fonts and that service are the only third-party services the site uses.',
          ]
        : [
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
      paragraphs: enquiryDeliveryEnabled
        ? [
            'The enquiry form on the Contact page is active. The details you provide are sent to the enquiry service LanXgrow has configured, so that someone can respond to you.',
            'This website itself does not store your enquiry. How the receiving service handles and retains it has not been confirmed yet, and will be described here once it is.',
          ]
        : [
            'Online enquiries are not open yet, and the enquiry form on the Contact page is not active. When enquiries open, this section will explain how the details you provide are used.',
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
}
