/**
 * Account and sign-in copy.
 *
 * The launch site does not offer accounts, so the visitor-facing pages use
 * `signInPage` and `accountPage` below.
 *
 * Everything from `authIntro` down to `accountCopy` belongs to the optional
 * Supabase one-time-code sign-in that can be re-enabled in a later stage. It is
 * retained here (not rendered) so that work is not lost; see `src/lib/auth.ts`
 * and `src/hooks/useAuthSession.ts`.
 */

/* -------------------------------------------------------------------------
   Launch copy — accounts are not available
   ------------------------------------------------------------------------- */

export const signInPage = {
  eyebrow: 'Sign in',
  heading: 'Your LanXgrow account',
  body: 'Account access is not currently available. For information about LanXgrow’s English Communication programme, please visit our Services page.',
  supportingHeading: 'While accounts are unavailable',
  supporting:
    'You can still learn how LanXgrow works. Our Services page sets out the English Communication programme and the mentorship that supports it, and the FAQ answers common questions.',
  cta: { label: 'Explore our services', to: '/services' },
  faqCta: { label: 'Read the FAQ', to: '/faq' },
} as const;

export const accountPage = {
  eyebrow: 'Your account',
  heading: 'Your learning journey starts with a conversation.',
  body: 'Explore LanXgrow’s approach to English Communication and guided learning.',
  supportingHeading: 'Where to begin',
  supporting:
    'Our Services page explains how LanXgrow works and what English Communication covers. The FAQ answers the questions families ask most often.',
  cta: { label: 'Explore our services', to: '/services' },
  faqCta: { label: 'Read the FAQ', to: '/faq' },
} as const;

/* -------------------------------------------------------------------------
   Retained for a future authentication stage (not currently rendered)
   ------------------------------------------------------------------------- */

export const authIntro = {
  eyebrow: 'Sign in',
  heading: 'One account, either contact method.',
  supporting:
    'Choose how you would like to sign in. LanXgrow supports an email address or a phone number, whichever is easier for you.',
} as const;

export type AuthMethod = 'email' | 'phone';

export const authMethods: { id: AuthMethod; label: string; hint: string }[] = [
  { id: 'email', label: 'Email', hint: 'We will send a six-digit code to your inbox.' },
  { id: 'phone', label: 'Phone', hint: 'We will send a six-digit code by SMS.' },
];

/**
 * Shown while no provider is configured.
 *
 * Nothing is sent and no account exists, and the page says so plainly rather
 * than simulating a successful sign-in.
 */
export const authPreviewNotice =
  'Preview only. Verification is not connected yet — no code is actually sent and no account is created in this stage.' as const;

export const authLabels = {
  emailLabel: 'Email address',
  phoneLabel: 'Phone number',
  emailPlaceholder: 'you@example.com',
  phonePlaceholder: '+91 98765 43210',
  sendCode: 'Send code',
  sending: 'Sending code…',
  verify: 'Verify and continue',
  verifying: 'Verifying…',
  resend: 'Resend code',
  resending: 'Sending…',
  changeMethod: 'Change sign-in method',
  codeSentTo: 'Enter the six-digit code sent to',
  otpGroupLabel: 'Six-digit verification code',
  otpDigitLabel: (position: number) => `Digit ${position} of 6`,
} as const;

/* -------------------------------------------------------------------------
   Copy used once a real provider is configured
   ------------------------------------------------------------------------- */

export const authLiveCopy = {
  heading: 'Sign in with your email address.',
  supporting:
    'We email you a six-digit code. Phone sign-in follows once an SMS provider is in place, because sending text messages is not free to run.',
  noticeTitle: 'How sign-in works',
  notice:
    'A six-digit code is sent to you by our authentication provider and checked by them — it is never displayed on this page. Your account is created the first time you sign in.',
  phoneHint: 'Phone sign-in is not enabled yet — it needs an SMS provider.',
  phoneUnavailable:
    'Phone sign-in is not enabled yet. Sending SMS requires a paid provider, and we are not activating one without approval. Please use your email address for now.',
} as const;

export const authNotices = {
  /** Shown after a verification attempt while nothing is connected. */
  previewVerify:
    'Verification is not connected, so no account was created. This step becomes real once the authentication provider is configured.',
  signedOut: 'You have been signed out.',
} as const;

/** Home-page copy that changes once sign-in is connected. */
export const authStatusCopy = {
  liveFootnote: 'Sign in with a six-digit code sent to your email address.',
  liveJourneyNote: 'Email sign-in is live; assessments and learning features follow in a later stage.',
} as const;

/* -------------------------------------------------------------------------
   Account placeholder
   ------------------------------------------------------------------------- */

export const accountCopy = {
  eyebrow: 'Your account',
  signedInHeading: 'You are signed in.',
  signedInBody:
    'This is a placeholder for the signed-in area. Courses, assessments and learning features are not part of this stage, so there is nothing else here yet.',
  signedInAs: 'Signed in as',
  signOut: 'Sign out',
  signingOut: 'Signing out…',
  signedOutHeading: 'You are not signed in.',
  signedOutBody: 'Sign in with a six-digit code sent to your email address.',
  signedOutCard: 'Signing in takes a six-digit code, sent to your email address.',
  signInCta: 'Go to sign in',
  unconfiguredHeading: 'Accounts are not connected yet.',
  unconfiguredBody:
    'This deployment has no authentication provider configured, so no account can exist and nothing is stored here. See the project README for the configuration that enables it.',
  unconfiguredShort: 'No authentication provider is configured for this build.',
  backHome: 'Back to home',
  checking: 'Checking your session…',
} as const;
