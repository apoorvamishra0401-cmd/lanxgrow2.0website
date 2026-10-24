import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLoginMethods, signUp, signUpWithPhone, verifyPhoneRegistration, signInWithGoogle, POLICY_VERSION } from '@/lib/auth';
import type { LoginMethods } from '@/lib/auth';
import { Logo } from '@/components/ui/Logo';
import { LoginSupport } from '@/components/support/SupportLinks';
import { usePageMeta } from '@/hooks/usePageMeta';
import './SignIn.css';

export default function SignUp() {
  usePageMeta('Create account', 'Start your English communication journey with LanXgrow.');
  const navigate = useNavigate();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [methods, setMethods] = useState<LoginMethods | null>(null);
  const [checking, setChecking] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [verifyPhone, setVerifyPhone] = useState('');
  useEffect(() => { let active = true; getLoginMethods().then(value => { if (active) { setMethods(value); setChecking(false); } }); return () => { active = false; }; }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !agreed || !methods?.[method]) return;
    setError(''); setNotice('');
    const values = new FormData(event.currentTarget);
    const identity = String(values.get('identity') ?? '').trim();
    const phone = identity.replace(/[\s()-]/g, '');
    if (method === 'phone' && !/^\+[1-9]\d{7,14}$/.test(phone)) { setError('Include your country code, for example +91 98765 43210.'); return; }
    setBusy(true);
    try {
      const password = String(values.get('password') ?? '');
      const result = method === 'email' ? await signUp(identity, password, { policy_version: POLICY_VERSION }) : await signUpWithPhone(phone, password);
      if (!result.ok) setError(result.message);
      else if (method === 'phone') { setVerifyPhone(phone); setNotice('If registration can proceed, a verification code will arrive by SMS. Enter it below.'); }
      else setNotice('If this address is eligible, check your inbox for a verification link. Already registered? Sign in instead.');
    } catch { setError('We could not reach the account service. Please try again.'); } finally { setBusy(false); }
  }
  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    setError(''); setBusy(true);
    const token = String(new FormData(event.currentTarget).get('code') ?? '').trim();
    const result = await verifyPhoneRegistration(verifyPhone, token);
    setBusy(false);
    if (result.ok) navigate('/consent', { replace: true }); else setError(result.message);
  }
  async function google() {
    if (!agreed) { setError('Please read and agree to the Terms and Conditions and Privacy Policy first.'); return; }
    setError(''); setBusy(true);
    const result = await signInWithGoogle();
    if (!result.ok) { setError(result.message); setBusy(false); }
  }
  return <main className="lx-login">
    <Link to="/" className="login-brand" aria-label="LanXgrow home"><Logo /></Link>
    <div className="login-shell"><aside className="login-story"><span className="login-eyebrow">Make room for your voice</span><h1>Small beginnings.<br/>Bigger conversations.</h1><p>Bring your curiosity.<br/>Build the confidence to be heard.</p><div className="login-voice" aria-hidden="true">{Array.from({length:21},(_,i)=><span key={i} style={{height:`${14+Math.sin(i*.8)**2*65}px`,animationDelay:`${i*.09}s`}}/>)}</div><span className="login-story-foot">Speak Smart, Think Smart</span></aside>
    <section className="login-card" aria-labelledby="signup-heading"><Link to="/signin" className="login-back">← Back to sign in</Link><h2 id="signup-heading">Your voice belongs here.</h2><p className="login-subtitle">Create your LanXgrow account.</p>
      <button className="login-google" type="button" onClick={google} disabled={busy||checking||!methods?.google}>Continue with Google</button>
      {!checking&&!methods?.google&&<p className="login-availability">Google registration is not available yet. Choose an available method below.</p>}
      <div className="login-divider"><span/>or create an account with<span/></div>
      <div className="login-methods" aria-label="Registration method">{(['email','phone'] as const).map(item=><button type="button" key={item} aria-pressed={method===item} disabled={busy||Boolean(verifyPhone)} onClick={()=>{setMethod(item);setError('');setNotice('');}}>{item==='email'?'Email address':'Phone number'}</button>)}</div>
      {checking&&<p role="status" className="login-availability">Checking account options…</p>}
      {!checking&&!methods?.[method]&&<p className="login-notice" role="status">{method==='phone'?'Phone registration is not available yet.':'Email registration is temporarily unavailable.'}</p>}
      {error&&<p className="login-error" role="alert">{error}</p>}{notice&&<p className="login-notice" role="status">{notice}</p>}
      {!verifyPhone ? <form onSubmit={submit} key={method}>
        <label htmlFor="signup-identity">{method==='email'?'Email address':'Phone number'}</label><input id="signup-identity" name="identity" type={method==='email'?'email':'tel'} autoComplete={method==='email'?'email':'tel'} inputMode={method==='email'?'email':'tel'} placeholder={method==='email'?'you@example.com':'+91 98765 43210'} required disabled={busy}/>
        <label htmlFor="signup-password">Create a password</label><div className="login-password"><input id="signup-password" name="password" type={showPassword?'text':'password'} minLength={8} autoComplete="new-password" required disabled={busy} aria-describedby="password-help"/><button type="button" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?'Hide password':'Show password'} aria-pressed={showPassword}>{showPassword?'Hide':'Show'}</button></div><p id="password-help" className="login-hint">Use at least 8 characters and a unique password.</p>
        <label className="login-consent"><input type="checkbox" checked={agreed} required disabled={busy} onChange={event=>setAgreed(event.target.checked)}/><span>I agree to LanXgrow’s <Link to="/terms" target="_blank" rel="noopener">Terms and Conditions</Link> and <Link to="/privacy" target="_blank" rel="noopener">Privacy Policy</Link>.</span></label>
        <button className="login-submit" type="submit" disabled={busy||checking||!methods?.[method]||!agreed}>{busy?'Creating your account…':'Create account'}<span aria-hidden="true">→</span></button>
      </form> : <form onSubmit={verify}><label htmlFor="signup-code">SMS verification code</label><input id="signup-code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required disabled={busy}/><button className="login-submit" disabled={busy} type="submit">{busy?'Verifying…':'Verify phone number'}</button><button className="login-back" type="button" disabled={busy} onClick={()=>{setVerifyPhone('');setNotice('');}}>Use a different number</button></form>}
      <p className="login-signup">Already have an account? <Link to="/signin">Sign in</Link></p><LoginSupport />
    </section></div>
  </main>;
}
