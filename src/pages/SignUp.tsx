import { useState } from 'react';
import { FormEvent } from 'react';
import { signInPage } from '@/content/auth';
import {
  signUp,
  isAuthConfigured,
  type AuthResult,
} from '@/lib/auth';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Field, Input, useFieldId } from '@/components/ui/Field';
import { usePageMeta } from '@/hooks/usePageMeta';

const ids = {
  email: useFieldId('signup-email'),
  password: useFieldId('signup-password'),
};

export default function SignUp() {
  usePageMeta('Create account', 'Create your LanXgrow account.');

    const configured = isAuthConfigured();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuthResult<{ userId: string; email: string | null | undefined }> | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const authResult: AuthResult<{ userId: string; email: string | null | undefined }> = await signUp(email, password);
    setSubmitting(false);

    if (authResult.ok) {
      setResult(authResult);
    } else {
      setError(authResult.message);
    }
  };

  if (!configured) {
    return (
      <>
        <PageIntro
          eyebrow="Sign up"
          heading="Create your account"
          supporting={
            'Account creation is not currently available. For information about LanXgrow&#39;s English Communication programme, please visit our Services page.'
          }
          aside={
            <div className="mt-8">
              <Button to={signInPage.cta.to} withArrow>
                {signInPage.cta.label}
              </Button>
            </div>
          }
        />

        <Section tone="ivory">
          <div className="max-w-prose">
            <h2 className="font-display text-[1.5rem] text-ink-900">While accounts are unavailable</h2>
            <p className="lx-prose mt-4">
              You can still learn how LanXgrow works. Our Services page sets out the English Communication programme and the mentorship that supports it, and the FAQ answers common questions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={signInPage.cta.to} variant="secondary" withArrow>
                {signInPage.cta.label}
              </Button>
              <Button to={signInPage.faqCta.to} variant="ghost">
                {signInPage.faqCta.label}
              </Button>
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="Create account"
        heading="Create your LanXgrow account"
        supporting={
          'Enter your email address and choose a password. You will receive a verification email — please verify your address before signing in.'
        }
        aside={
          <div className="mt-8">
            <Button to={signInPage.faqCta.to} variant="ghost">
              {signInPage.faqCta.label}
            </Button>
          </div>
        }
      />

      <Section tone="ivory">
        <div className="max-w-prose min-w-0">
          {result && result.ok && (
            <Alert tone="success" title="Account created">
              Your account has been created. Please check your email to verify your address, then sign in.
            </Alert>
          )}

          {error && (
            <Alert tone="error" title="Account creation failed">{error}</Alert>
          )}

          <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-6">
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

            <Field
              label="Password"
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

            <p className="text-[0.8125rem] text-ink-500">
              Password must be at least 6 characters.
            </p>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              disabled={submitting}
            >
              Create account
            </Button>

            <p className="text-[0.8125rem] text-ink-500 mt-4">
              Already have an account?{' '}
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
