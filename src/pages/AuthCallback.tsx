import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function AuthCallback() {
  usePageMeta('Auth callback', 'Processing authentication response.');

  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const errorDescription = searchParams.get('error_description');
    const errorCode = searchParams.get('error_code');
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');

    if (errorDescription || errorCode) {
      setStatus('error');
      setMessage(
        errorDescription ||
        'Authentication failed. Please try signing in again.'
      );
      return;
    }

    if (accessToken && type === 'recovery') {
      // Password recovery flow - redirect to reset-password with tokens
      navigate('/reset-password', { replace: true });
      return;
    }

    if (accessToken || type === 'signup' || type === 'login') {
      setStatus('success');
      setMessage('Authentication successful. Redirecting…');
      setTimeout(() => navigate('/placeholder'), 1500);
      return;
    }

    setStatus('error');
    setMessage('No authentication response found.');
  }, [location, navigate]);

  if (status === 'checking') {
    return (
      <>
        <PageIntro
          eyebrow="Auth callback"
          heading="Processing…"
          supporting="Please wait while we handle the authentication response."
        />
      </>
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="Auth callback"
        heading={status === 'success' ? 'Authentication successful' : 'Authentication failed'}
        supporting={message}
      />
      <Section tone="ivory">
        <div className="max-w-prose min-w-0">
          {status === 'success' ? (
            <Alert tone="success" title="Signed in">{message}</Alert>
          ) : (
            <Alert tone="error" title="Error">{message}</Alert>
          )}
          <Button to="/signin" variant="primary" size="lg" withArrow>
            Go to sign in
          </Button>
        </div>
      </Section>
    </>
  );
}
