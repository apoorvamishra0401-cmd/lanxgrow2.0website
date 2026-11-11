import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isAuthConfigured, signInWithGoogle } from '@/lib/auth';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Logo } from '@/components/ui/Logo';
import './SignIn.css';

/** Google-only login UI in the isolated founder review branch.
 * This does not change provider settings or grant reviewer/admin rights.
 */
export default function SignIn() {
  usePageMeta('Sign in', 'Continue securely with Google on LanXgrow.');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function google() {
    if (!isAuthConfigured() || busy) return;
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
        <p className="login-subtitle">Sign in with your Google account.</p>
        <button className="login-google" type="button" disabled={busy || !isAuthConfigured()} onClick={google}>
          Continue with Google
        </button>
        {!isAuthConfigured() && <p role="status">Google login is unavailable because the website connection is missing. Please contact support.</p>}
        {error && <p role="alert">{error}</p>}
      </section>
    </div>
  </main>;
}
