import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLoginMethods, isAuthConfigured, signInWithGoogle, signInWithPassword, signInWithPhonePassword } from '@/lib/auth';
import type { LoginMethods } from '@/lib/auth';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Logo } from '@/components/ui/Logo';
import './SignIn.css';

export default function SignIn() {
  useScrollToTop();
  usePageMeta('Sign in', 'Welcome to your LanXgrow learning journey.');
  const navigate = useNavigate();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [methods, setMethods] = useState<LoginMethods | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const configured = isAuthConfigured();
  useEffect(() => { let mounted = true; getLoginMethods().then(result => { if (mounted) { setMethods(result); setChecking(false); } }); return () => { mounted = false; }; }, []);
  const available = methods?.[method] === true;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy || !available) return;
    setError('');
    const form = new FormData(event.currentTarget);
    const identity = String(form.get('identity') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const phone = identity.replace(/[\s()-]/g, '');
    if (method === 'phone' && !/^\+[1-9]\d{7,14}$/.test(phone)) { setError('Enter your phone number with its country code, for example +91 98765 43210.'); return; }
    setBusy(true);
    try {
      const result = method === 'email' ? await signInWithPassword(identity, password) : await signInWithPhonePassword(phone, password);
      if (result.ok) navigate('/placeholder', { replace: true }); else setError(result.message);
    } catch { setError('We could not sign you in. Please try again.'); } finally { setBusy(false); }
  }
  async function google() {
    if (busy || !methods?.google) return;
    setError(''); setBusy(true);
    try { const result = await signInWithGoogle(); if (!result.ok) { setError(result.message); setBusy(false); } }
    catch { setError('Google sign-in could not start. Please try again.'); setBusy(false); }
  }
  return <main className="lx-login">
    <Link to="/" className="login-brand" aria-label="LanXgrow home"><Logo /></Link>
    <div className="login-shell">
      <aside className="login-story"><span className="login-eyebrow">Your next chapter</span><h1>Find your voice.<br/>Make it yours.</h1><p>A little practice. A little courage.<br/>A more confident you, every day.</p><div className="login-voice" aria-hidden="true">{Array.from({length:21},(_,i)=><span key={i} style={{height:`${14+Math.sin(i*.8)**2*65}px`,animationDelay:`${i*.09}s`}}/>)}</div><span className="login-story-foot">Speak Smart, Think Smart</span></aside>
      <section className="login-card" aria-labelledby="login-heading"><Link to="/get-started" className="login-back">← Back</Link><h2 id="login-heading">Welcome to LanXgrow.</h2><p className="login-subtitle">Your learning journey starts here.</p>
        <button className="login-google" type="button" disabled={busy||checking||!methods?.google} onClick={google} aria-describedby={!methods?.google?'google-availability':undefined}><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3v2.7A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.4H3a10 10 0 0 0 0 9.2l3.4-2.7Z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.6 9.6 0 0 0 12 2 10 10 0 0 0 3 7.4l3.4 2.7C7.2 7.7 9.4 5.9 12 5.9Z"/></svg>Continue with Google</button>
        {!checking&&!methods?.google&&<p id="google-availability" className="login-availability">Google sign-in is not available yet. Use email below.</p>}
        <div className="login-divider"><span/>or continue with<span/></div>
        <div className="login-methods" aria-label="Sign-in method">{(['email','phone'] as const).map(item=><button key={item} type="button" aria-pressed={method===item} onClick={()=>{setMethod(item);setError('');}} disabled={busy}>{item==='email'?'Email address':'Phone number'}</button>)}</div>
        {checking&&<p role="status" className="login-availability">Checking sign-in availability…</p>}
        {!checking&&(!configured||!methods)&&<p role="status" className="login-notice">Sign-in is temporarily unavailable. Please try again later.</p>}
        {!checking&&methods&&!available&&<p role="status" className="login-notice">{method==='phone'?'Phone sign-in is not available yet. You can sign in with email.':'Email sign-in is not available right now.'}</p>}
        {error&&<p role="alert" className="login-error">{error}</p>}
        <form onSubmit={submit} key={method}>
          <label htmlFor="login-identity">{method==='email'?'Email address':'Phone number'}</label><input id="login-identity" name="identity" type={method==='email'?'email':'tel'} inputMode={method==='email'?'email':'tel'} autoComplete={method==='email'?'username':'tel'} placeholder={method==='email'?'you@example.com':'+91 98765 43210'} required disabled={busy} aria-describedby={method==='phone'?'phone-hint':undefined}/>
          {method==='phone'&&<p id="phone-hint" className="login-hint">Include your country code.</p>}
          <label htmlFor="login-password">Password</label><div className="login-password"><input id="login-password" name="password" type={showPassword?'text':'password'} autoComplete="current-password" placeholder="Enter your password" required disabled={busy}/><button type="button" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?'Hide password':'Show password'} aria-pressed={showPassword}>{showPassword?'Hide':'Show'}</button></div>
          <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>
          <button className="login-submit" type="submit" disabled={busy||checking||!available}>{busy?'Signing in…':'Sign in'}<span aria-hidden="true">→</span></button>
        </form>
        <p className="login-signup">New to LanXgrow? <Link to="/signup">Create an account</Link></p>
        <p className="login-privacy">Your learning journey will be personalized to your goals.<br/><Link to="/privacy">Privacy</Link></p>
      </section>
    </div>
  </main>;
}
