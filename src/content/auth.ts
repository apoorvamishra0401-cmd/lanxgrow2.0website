/** Sign-in page copy for the Stage 1 authentication preview. */

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
 * Stage 1 honesty notice.
 *
 * The brief requires that no fake authentication is implied. This notice is
 * displayed prominently on the page and within the verification step.
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
