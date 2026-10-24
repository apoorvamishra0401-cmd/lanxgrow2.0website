import { useState } from 'react';
import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInPage } from '@/content/auth';
import {
  signInWithPassword,
  isAuthConfigured,
  type AuthResult,
} from '@/lib/auth';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Field, Input, useFieldId } from '@/components/ui/Field';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function SignIn() {
  usePageMeta('Sign in', 'Sign in to your LanXgrow account.');

  const navigate = useNavigate();
  const configured = isAuthConfigured();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuthResult<{ userId: string; email: string | null | undefined }> | null>(null);

  const ids = {
    email: useFieldId('signin-email'),
    password: useFieldId('signin-password'),
  };

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

    setSubmitting(true);
    const authResult: AuthResult<{ userId: string; email: string | null | undefined }> = await signInWithPassword(email, password);
    setSubmitting(false);

    if (authResult.ok) {
      setResult(authResult);
      navigate('/placeholder');
    } else {
      setError(authResult.message);
    }
  };

  if (!configured) {
    return (
      <>
        <PageIntro
          eyebrow={signInPage.eyebrow}
          heading={signInPage.heading}
          supporting={signInPage.body}
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
            <h2 className="font-display text-[1.5rem] text-ink-900">{signInPage.supportingHeading}</h2>
            <p className="lx-prose mt-4">{signInPage.supporting}</p>
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
        eyebrow={signInPage.eyebrow}
        heading={signInPage.heading}
        supporting={
          'Enter your email address and password to sign in to your LanXgrow account.'
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
            <Alert tone="success" title="Signed in">
              You are now signed in. Redirecting…
            </Alert>
          )}

          {error && (
            <Alert tone="error" title="Sign-in failed">{error}</Alert>
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
                autoComplete="current-password"
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
              Sign in
            </Button>

            <p className="text-[0.8125rem] text-ink-500 mt-4">
              Don't have an account?{' '}
              <a href="/signup" className="text-terracotta-600 hover:text-terracotta-700 underline underline-offset-2">
                Create one
              </a>
            </p>

            <p className="text-[0.8125rem] text-ink-500 mt-2">
              <a href="/forgot-password" className="text-terracotta-600 hover:text-terracotta-700 underline underline-offset-2">
                Forgot your password?
              </a>
            </p>
          </form>
        </div>
      </Section>
    </>
  );
}
