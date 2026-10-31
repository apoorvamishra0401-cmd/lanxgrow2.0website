import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClient } from '@/lib/auth';
import { completeAuthCallback } from '@/auth/callback';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function AuthCallback() {
  usePageMeta('Completing sign in', 'Completing your secure LanXgrow sign-in.');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  useEffect(() => {
    let mounted = true;
    const href = window.location.href;
    async function complete() {
      try {
        const client = await getClient();
        if (!client) throw new Error('Sign-in is unavailable. Please try again later.');
        const destination = await completeAuthCallback(client, href);
        if (!mounted) return;
        window.history.replaceState(null, '', window.location.pathname);
        navigate(destination, { replace: true });
      } catch (cause) {
        if (mounted) { window.history.replaceState(null, '', window.location.pathname); setError(cause instanceof Error ? cause.message : 'We could not complete sign-in. Please try again.'); }
      }
    }
    void complete();
    return () => { mounted = false; };
  }, [navigate]);
  return <section className="lx-container py-20"><h1 className="text-display-sm">{error ? 'Let’s try again.' : 'Completing sign-in…'}</h1><p className="mt-6 text-ink-500" role={error?'alert':'status'}>{error || 'Please wait while we confirm your account.'}</p>{error&&<div className="mt-6 flex flex-wrap gap-6"><Link className="inline-flex min-h-11 items-center underline" to="/signin">Return to sign in</Link><Link className="inline-flex min-h-11 items-center underline" to="/forgot-password">Request a new reset link</Link></div>}</section>;
}
