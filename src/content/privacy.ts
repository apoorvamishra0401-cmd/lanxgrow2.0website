export const privacyIntro = { eyebrow: 'Privacy', heading: 'Privacy Notice', supporting: 'What this website does with your information, explained in plain language.' } as const;
export type PrivacySection = { heading: string; paragraphs: string[] };
export function getPrivacySections(): PrivacySection[] {
  return [
    { heading: 'About this notice', paragraphs: ['This notice describes the current LanXgrow website, sign-in and offline features. It will be updated as the learning app develops.'] },
    { heading: 'Accounts and sign-in', paragraphs: ['Sign-in is handled by Supabase. When you sign in, your browser sends the login details you enter to that service. Authentication session information is stored in your browser so you can stay signed in. Provider choices are available only when configured.', 'Passwords and authentication responses are not stored in the website’s offline cache. Account access requires an internet connection.'] },
    { heading: 'Offline storage', paragraphs: ['The service worker stores public HTML, JavaScript, styles, icons and images on your device to support repeat visits and offline browsing. It does not cache personal account information, authentication requests or messages.', 'You can remove this local copy through your browser’s site-data settings. Browsers may also clear cached files to manage device storage. A first online visit must finish caching before offline access is available.'] },
    { heading: 'Direct messages', paragraphs: ['There is no contact form on this website. The WhatsApp button opens WhatsApp with a suggested message; it is sent only if you choose to send it. Email links open your email app. Messages are handled by those services and the LanXgrow team, not by the offline cache.'] },
    { heading: 'Other services', paragraphs: ['The website is hosted on Vercel, loads typefaces from Google Fonts and uses Supabase for authentication. These services receive the request information needed to provide their functionality. WhatsApp and your email provider handle messages you choose to send.', 'No analytics or advertising tracking code is installed by this application. This does not describe independent logging or processing performed by service providers.'] },
    { heading: 'Questions about privacy', paragraphs: ['For privacy questions, email official@lanxgrow.com. Avoid sharing passwords or verification codes in messages.'] },
    { heading: 'Changes to this notice', paragraphs: ['The current notice will remain available on this page as the app evolves.'] },
  ];
}
