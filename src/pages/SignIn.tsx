import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLoginMethods, isAuthConfigured, signInWithGoogle } from '@/lib/auth';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Logo } from '@/components/ui/Logo';
import './SignIn.css';
import TruecallerButton from '@/components/auth/TruecallerButton';

/** Founder-review login UI; Truecaller proof is separate from account authorization. */
export default function SignIn() {
  usePageMeta('Sign in', 'Continue securely with Google on LanXgrow.');
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let mounted = true;
    getLoginMethods().then(methods => { if (mounted) { setGoogleAvailable(methods?.google === true); setChecking(false); } });
    return () => { mounted = false; };
  }, []);
  async function google() {
    if (!googleAvailable || busy) return;
    setBusy(true); setError('');
    try {
      const result = await signInWithGoogle();
      if (!result.ok) { setError(result.message); setBusy(false); }
    } catch { setError('Google sign-in could not start. Please try again.'); setBusy(false); }
  }
  return <main className="lx-login">
    <Link to="/" className="login-brand" aria-label="LanXgrow home"><Logo /></Link>
    <div className="login-shell">
      <aside className="login-story">
        <span className="login-eyebrow">Your next chapter</span>
        <h1>Find your voice.<br/>Make it yours.</h1>
        <p>Practice confidently. Grow every day.</p>
        <span className="login-story-foot">Speak Smart, Think Smart</span>
      </aside>
      <section className="login-card" aria-labelledby="login-heading">
        <Link to="/" className="login-back">← Back</Link>
        <h2 id="login-heading">Welcome to LanXgrow.</h2>
        <p className="login-subtitle">Sign in with your existing account. Android Truecaller phone verification is being tested separately.</p>
        <button className="login-google" type="button" disabled={checking || busy || !googleAvailable} onClick={google}>
          Continue with Google
        </button>
        <div className="login-divider"><span/>or verify your number with<span/></div>
        <TruecallerButton />
        <p className="login-hint">Truecaller verification is a development preview. Verified phone data will not grant account access until your existing Supabase authentication is securely linked.</p>
        {checking && <p role="status">Checking Google sign-in availability…</p>}
        {!checking && !googleAvailable && <p role="status">Google sign-in is not enabled for this environment yet. No other sign-in method is available.</p>}
        {!isAuthConfigured() && <p role="status">This review deployment is missing its authentication configuration.</p>}
        {error && <p role="alert">{error}</p>}
        <p className="login-subtitle">For the protected one-minute review, use <Link to="/review-lab">Founder review</Link>.</p>
      </section>
    </div>
  </main>;
}
