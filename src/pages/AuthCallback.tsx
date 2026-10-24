import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/auth';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function AuthCallback() {
  usePageMeta('Completing sign in', 'Completing your secure LanXgrow sign-in.');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  useEffect(() => {
    let mounted = true;
    const parameters = new URLSearchParams(window.location.search);
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const failed = parameters.has('error') || fragment.has('error');
    const recovery = parameters.get('type') === 'recovery' || fragment.get('type') === 'recovery';
    async function complete() {
      try {
        if (failed) throw new Error('provider');
        // SDK initialization processes and verifies the PKCE callback before getUser resolves.
        const user = await getCurrentUser();
        if (!mounted) return;
        window.history.replaceState(null, '', window.location.pathname);
        if (!user) throw new Error('session');
        navigate(recovery ? '/reset-password' : '/placeholder', { replace: true });
      } catch {
        if (mounted) { window.history.replaceState(null, '', window.location.pathname); setError('We could not complete sign-in. Please try again.'); }
      }
    }
    void complete();
    return () => { mounted = false; };
  }, [navigate]);
  return <section className="lx-container py-20"><h1 className="text-display-sm">{error ? 'Let’s try again.' : 'Completing sign-in…'}</h1><p className="mt-6 text-ink-500" role={error?'alert':'status'}>{error || 'Please wait while we confirm your account.'}</p>{error&&<Link className="mt-6 inline-flex min-h-11 items-center underline" to="/signin">Return to sign in</Link>}</section>;
}
