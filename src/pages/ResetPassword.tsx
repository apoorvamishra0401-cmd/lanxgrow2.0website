import { useState, useEffect } from 'react';
import { FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import {
  resetPasswordForEmail,
  updatePassword,
  isAuthConfigured,
  type AuthResult,
} from '@/lib/auth';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Field, Input, useFieldId } from '@/components/ui/Field';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function ResetPassword() {
    const location = useLocation();
  const configured = isAuthConfigured();
  const [step, setStep] = useState<'request' | 'reset' | 'done'>('request');
  const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

  const ids = {
    email: useFieldId('reset-email'),
    password: useFieldId('reset-password'),
    confirmPassword: useFieldId('reset-confirm-password'),
  };

  const searchParams = new URLSearchParams(location.search);
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const type = searchParams.get('type');

  useEffect(() => {
    // If we have recovery tokens in the URL, allow password reset
    if (accessToken && refreshToken && type === 'recovery') {
      setStep('reset');
    }
  }, [accessToken, refreshToken, type]);

  const handleRequestReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    const authResult: AuthResult = await resetPasswordForEmail(email);
    setSubmitting(false);

    if (authResult.ok) {
      setStep('done');
    } else {
      setError(authResult.message);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const authResult: AuthResult = await updatePassword(password);
    setSubmitting(false);

    if (authResult.ok) {
      setStep('done');
    } else {
      setError(authResult.message);
    }
  };

  if (!configured) {
    usePageMeta('Password reset', 'Password reset is not currently available.');
    return (
      <>
        <PageIntro
          eyebrow="Password reset"
          heading="Reset your password"
          supporting={
            'Password reset is not currently available. Please contact LanXgrow support for assistance.'
          }
        />
      </>
    );
  }

  if (step === 'done') {
    usePageMeta('Password reset', 'Your password has been reset.');
    return (
      <>
        <PageIntro
          eyebrow="Password reset"
          heading="Password reset"
          supporting="Check your email for further instructions."
        />
        <Section tone="ivory">
          <div className="max-w-prose min-w-0">
            <Alert tone="success" title="Reset email sent">
              If an account exists for this address, you will receive a password reset link. Check your inbox (and spam folder).
            </Alert>
            <Button to="/signin" variant="primary" size="lg">
              Go to sign in
            </Button>
          </div>
        </Section>
      </>
    );
  }

  if (step === 'reset') {
    usePageMeta('Reset password', 'Create a new password.');
    return (
      <>
        <PageIntro
          eyebrow="Reset password"
          heading="Create a new password"
          supporting="Enter your new password below."
        />
        <Section tone="ivory">
          <div className="max-w-prose min-w-0">
            {error && <Alert tone="error" title="Reset failed">{error}</Alert>}

            <form noValidate onSubmit={handleResetPassword} className="mt-8 space-y-6">
              <Field
                label="New password"
                htmlFor={ids.password}
                required
                error={error ? 'password' : undefined}
              >
                <Input
                  id={ids.password}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  invalid={Boolean(error)}
                  disabled={submitting}
                />
              </Field>

              <Field
                label="Confirm password"
                htmlFor={ids.confirmPassword}
                required
                error={error ? 'confirmPassword' : undefined}
              >
                <Input
                  id={ids.confirmPassword}
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  invalid={Boolean(error)}
                  disabled={submitting}
                />
              </Field>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                disabled={submitting}
              >
                Reset password
              </Button>
            </form>
          </div>
        </Section>
      </>
    );
  }

  // step === 'request'
  usePageMeta('Forgot password', 'Reset your LanXgrow password.');
  return (
    <>
      <PageIntro
        eyebrow="Forgot password"
        heading="Reset your password"
        supporting="Enter your email address and we will send you a link to reset your password."
      />
      <Section tone="ivory">
        <div className="max-w-prose min-w-0">
          {error && <Alert tone="error" title="Request failed">{error}</Alert>}

          <form noValidate onSubmit={handleRequestReset} className="mt-8 space-y-6">
            <Field
              label="Email address"
              htmlFor={ids.email}
              required
              error={error ? 'email' : undefined}
            >
              <Input
                id={ids.email}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                invalid={Boolean(error)}
                disabled={submitting}
              />
            </Field>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              disabled={submitting}
            >
              Send reset link
            </Button>

            <p className="text-[0.8125rem] text-ink-500 mt-4">
              Remember your password?{' '}
              <a href="/signin" className="text-terracotta-600 hover:text-terracotta-700 underline underline-offset-2">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </Section>
    </>
  );
}
