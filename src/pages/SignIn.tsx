import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import {
  authIntro,
  authLabels,
  authMethods,
  authPreviewNotice,
  type AuthMethod,
} from '@/content/auth';
import { isValidEmail, isValidPhone } from '@/lib/validation';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Field, Input, useFieldId } from '@/components/ui/Field';
import { OTP_LENGTH, OtpInput } from '@/components/ui/OtpInput';
import { cn } from '@/lib/cn';
import { usePageMeta } from '@/hooks/usePageMeta';

type Step = 'identify' | 'verify';

const RESEND_SECONDS = 30;

/** A blank six-slot code, so cleared digits stay in their own position. */
const emptyCode = () => Array.from({ length: OTP_LENGTH }, () => '');

const highlights = [
  'Choose the contact method that suits you.',
  'A six-digit code confirms it is really you.',
  'One account for the learner and their family.',
];

/**
 * Sign in / sign up.
 *
 * Stage 1 scope: a complete, honest interface for the intended flow. The OTP
 * fields, resend timer, loading and error states are all real UI behaviour, but
 * no code is sent and no account exists yet — the page says so plainly.
 */
export default function SignIn() {
  usePageMeta('Sign in', 'Sign in to LanXgrow with an email address or a phone number.');

  const [method, setMethod] = useState<AuthMethod>('email');
  const [step, setStep] = useState<Step>('identify');
  const [identifier, setIdentifier] = useState('');
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState<string[]>(emptyCode);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const identifierId = useFieldId('auth-identifier');
  const codeErrorId = useFieldId('auth-code-error');
  const methodRefs = useRef<Partial<Record<AuthMethod, HTMLButtonElement | null>>>({});

  const activeMethod = useMemo(
    () => authMethods.find((entry) => entry.id === method) ?? authMethods[0],
    [method],
  );

  /* Resend countdown. */
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const resetToIdentify = (nextMethod: AuthMethod) => {
    const changingMethod = nextMethod !== method;

    setMethod(nextMethod);
    setStep('identify');
    setCode(emptyCode());
    setCodeError(null);
    setNotice(null);
    setCooldown(0);

    // An email address should not linger in the phone field (or the reverse).
    if (changingMethod) {
      setIdentifier('');
      setIdentifierError(null);
    }
  };

  /** Arrow keys move between methods, matching the rest of the keyboard UI. */
  const handleMethodKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    if (!forward && !backward) return;

    event.preventDefault();
    const nextIndex = (index + (forward ? 1 : -1) + authMethods.length) % authMethods.length;
    const nextMethod = authMethods[nextIndex].id;

    resetToIdentify(nextMethod);
    methodRefs.current[nextMethod]?.focus();
  };

  const handleSendCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = identifier.trim();
    const invalid =
      method === 'email'
        ? !trimmed
          ? 'Please enter your email address.'
          : !isValidEmail(trimmed)
            ? 'That email address does not look right.'
            : null
        : !trimmed
          ? 'Please enter your phone number.'
          : !isValidPhone(trimmed)
            ? 'Please enter a valid phone number.'
            : null;

    setIdentifierError(invalid);
    if (invalid) {
      document.getElementById(identifierId)?.focus();
      return;
    }

    setSending(true);
    setNotice(null);

    // Simulated request so the loading state is visible.
    window.setTimeout(() => {
      setSending(false);
      setStep('verify');
      setCooldown(RESEND_SECONDS);
    }, 700);
  };

  const handleVerify = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (code.some((digit) => !digit)) {
      setCodeError('Enter all six digits to continue.');
      return;
    }

    setCodeError(null);
    setVerifying(true);

    window.setTimeout(() => {
      setVerifying(false);
      setNotice(
        'Verification is not connected in this stage, so no account was created. This step will be wired to real authentication next.',
      );
    }, 800);
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCode(emptyCode());
    setCodeError(null);
    setNotice(null);
    setCooldown(RESEND_SECONDS);
  };

  return (
    <Section tone="ivory" spacing="loose">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Editorial column */}
        <Reveal className="lg:col-span-5">
          <Eyebrow>{authIntro.eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-lg font-display text-display-sm text-ink-900">
            {authIntro.heading}
          </h1>
          <p className="lx-prose mt-7">{authIntro.supporting}</p>

          <ul className="mt-10 space-y-4 border-t border-line pt-8">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-[1.7] text-ink-500">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="mt-1 h-4 w-4 shrink-0 text-terracotta-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.5 8.5 6.5 11.5l6-7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Auth card */}
        <Reveal delay={80} className="lg:col-span-7">
          <div className="rounded-[22px] border border-line bg-ivory-50 p-7 shadow-soft sm:p-9">
            <Alert tone="info" title="Preview only">
              {authPreviewNotice}
            </Alert>

            {step === 'identify' ? (
              <form noValidate onSubmit={handleSendCode} className="mt-8">
                {/* Method selector */}
                <span className="text-[0.8125rem] font-medium tracking-wide text-ink-700">
                  How would you like to sign in?
                </span>
                <div
                  role="radiogroup"
                  aria-label="Sign-in method"
                  className="mt-3 grid grid-cols-2 gap-1 rounded-full border border-line bg-sand/50 p-1"
                >
                  {authMethods.map((entry, index) => {
                    const active = entry.id === method;
                    return (
                      <button
                        key={entry.id}
                        ref={(el) => {
                          methodRefs.current[entry.id] = el;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => resetToIdentify(entry.id)}
                        onKeyDown={(e) => handleMethodKeyDown(e, index)}
                        className={cn(
                          'inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-[0.9375rem] font-medium transition-all duration-300 ease-editorial',
                          active
                            ? 'bg-ivory-50 text-ink-900 shadow-soft'
                            : 'text-ink-500 hover:text-ink-700',
                        )}
                      >
                        {entry.label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[0.8125rem] text-ink-500">{activeMethod.hint}</p>

                <div className="mt-7">
                  <Field
                    label={method === 'email' ? authLabels.emailLabel : authLabels.phoneLabel}
                    htmlFor={identifierId}
                    required
                    error={identifierError ?? undefined}
                  >
                    <Input
                      id={identifierId}
                      name={method}
                      type={method === 'email' ? 'email' : 'tel'}
                      inputMode={method === 'email' ? 'email' : 'tel'}
                      autoComplete={method === 'email' ? 'email' : 'tel'}
                      value={identifier}
                      invalid={Boolean(identifierError)}
                      placeholder={
                        method === 'email' ? authLabels.emailPlaceholder : authLabels.phonePlaceholder
                      }
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        setIdentifierError(null);
                      }}
                    />
                  </Field>
                </div>

                <div className="mt-8">
                  <Button type="submit" size="lg" fullWidth withArrow loading={sending}>
                    {sending ? authLabels.sending : authLabels.sendCode}
                  </Button>
                </div>
              </form>
            ) : (
              <form noValidate onSubmit={handleVerify} className="mt-8">
                <p className="text-[0.9375rem] text-ink-500">
                  {authLabels.codeSentTo}{' '}
                  <span className="font-medium text-ink-900">{identifier.trim()}</span>.
                </p>

                <div className="mt-7">
                  <span className="mb-3 block text-[0.8125rem] font-medium tracking-wide text-ink-700">
                    {authLabels.otpGroupLabel}
                  </span>
                  <OtpInput
                    value={code}
                    onChange={(next) => {
                      setCode(next);
                      setCodeError(null);
                      setNotice(null);
                    }}
                    invalid={Boolean(codeError)}
                    disabled={verifying}
                    describedBy={codeError ? codeErrorId : undefined}
                    groupLabel={authLabels.otpGroupLabel}
                    digitLabel={authLabels.otpDigitLabel}
                    autoFocus
                  />
                  {codeError && (
                    <p id={codeErrorId} role="alert" className="mt-3 text-[0.8125rem] text-terracotta-700">
                      {codeError}
                    </p>
                  )}
                </div>

                {notice && (
                  <div className="mt-6">
                    <Alert tone="info" title="Nothing verified">
                      {notice}
                    </Alert>
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-4">
                  <Button type="submit" size="lg" fullWidth withArrow loading={verifying}>
                    {verifying ? authLabels.verifying : authLabels.verify}
                  </Button>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-[0.875rem]">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={cooldown > 0}
                      className={cn(
                        'rounded-md transition-colors duration-200',
                        cooldown > 0
                          ? 'cursor-not-allowed text-ink-300'
                          : 'text-terracotta-700 underline-offset-4 hover:underline',
                      )}
                    >
                      {cooldown > 0
                        ? `${authLabels.resend} in ${cooldown}s`
                        : authLabels.resend}
                    </button>

                    <button
                      type="button"
                      onClick={() => resetToIdentify(method)}
                      className="rounded-md text-ink-500 underline-offset-4 transition-colors duration-200 hover:text-ink-900 hover:underline"
                    >
                      {authLabels.changeMethod}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
