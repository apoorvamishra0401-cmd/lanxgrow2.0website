import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { getClient, getCurrentUser, resetPasswordForEmail, updatePassword, isAuthConfigured } from '@/lib/auth';
import { completeAuthCallback } from '@/auth/callback';
import { Brand } from '@/learner/assessment/AssessmentFlow';
import { usePageMeta } from '@/hooks/usePageMeta';
import '@/auth/verification.css';
import '@/learner/assessment/assessment.css';
import '@/learner/appScreens.css';

type Step = 'checking' | 'request' | 'reset' | 'sent' | 'changed';
export default function ResetPassword() {
  usePageMeta('Password recovery', 'Recover access to your LanXgrow account.');
  const [step, setStep] = useState<Step>('checking');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    const href = window.location.href;
    const url = new URL(href);
    const callback = Boolean(url.search || url.hash);
    setStep('checking');
    void (async () => {
      try {
        if (!isAuthConfigured()) throw new Error('Password recovery is unavailable. Please contact support.');
        if (callback) {
          const client = await getClient();
          if (!client || await completeAuthCallback(client, href) !== '/reset-password') {
            throw new Error('Please request a password-reset link to continue.');
          }
        }
        const user = await getCurrentUser();
        if (active) setStep(user ? 'reset' : 'request');
      } catch (cause) {
        if (active) { setError(cause instanceof Error ? cause.message : 'Could not check your session. Please retry.'); setStep('request'); }
      } finally {
        if (active && callback) window.history.replaceState(null, '', window.location.pathname);
      }
    })();
    return () => { active = false; };
  }, [retry]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const password = String(values.get('password') ?? '');
    setError('');
    if (step === 'reset' && (password.length < 8 || password.length > 128)) { setError('Use a password with 8–128 characters.'); return; }
    if (step === 'reset' && password !== values.get('confirm')) { setError('The passwords do not match.'); return; }
    setBusy(true);
    try {
      if (step === 'reset' && !await getCurrentUser()) throw new Error('Your recovery session has expired. Please request a new link.');
      const result = step === 'reset' ? await updatePassword(password) : await resetPasswordForEmail(String(values.get('email') ?? ''));
      if (!result.ok) throw new Error(result.message);
      form.reset();
      setStep(step === 'reset' ? 'changed' : 'sent');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not complete this step. Please retry.'); }
    finally { setBusy(false); }
  }

  const finished = step === 'sent' || step === 'changed';
  return <main className="af-root"><div className="af-shell la-account"><Brand/>
    <h1>{step === 'changed' ? 'Your password is updated.' : step === 'sent' ? 'Check your inbox.' : step === 'reset' ? 'A fresh start.' : 'Let’s get you back in.'}</h1>
    <p className="af-lead">{step === 'changed' ? 'Your new password is ready to use.' : step === 'sent' ? 'If an eligible account exists, you’ll receive a reset link. Check your inbox and spam folder, and open it in this browser.' : step === 'reset' ? 'Choose a new password for your account.' : 'Enter your account email to request a password-reset link.'}</p>
    {error && <p role="alert" className="af-error">{error}</p>}
    {step === 'checking' ? <p role="status">Checking your session…</p> : !finished && <form className="la-form" onSubmit={submit}>
      {step === 'request' ? <label>Email address<input name="email" type="email" required autoComplete="email" disabled={busy}/></label> : <>
        <label>New password<div className="la-password"><input name="password" type={show?'text':'password'} required minLength={8} maxLength={128} autoComplete="new-password" disabled={busy}/><button type="button" aria-label={show?'Hide password':'Show password'} onClick={()=>setShow(value=>!value)}>{show?<EyeOff size={20}/>:<Eye size={20}/>}</button></div><small>Use 8–128 characters.</small></label>
        <label>Confirm new password<input name="confirm" type={show?'text':'password'} required minLength={8} maxLength={128} autoComplete="new-password" disabled={busy}/></label>
      </>}
      <button className="af-primary" disabled={busy || !isAuthConfigured()}>{busy ? 'Please wait…' : step === 'reset' ? 'Save new password' : 'Send reset link'}</button>
    </form>}
    {step === 'sent' && <button className="af-text-button" onClick={()=>{setError('');setStep('request');}}>Use another email or request again</button>}
    {step === 'reset' && <button className="af-text-button" disabled={busy} onClick={()=>{setError('');setStep('request');}}>Request a new reset link</button>}
    {error && <button className="af-text-button" disabled={busy} onClick={()=>setRetry(value=>value+1)}>Check connection again</button>}
    <Link className={finished?'af-primary':'af-text-button'} to={step==='changed'?'/app-preview?begin=1':'/signin'}>{step==='changed'?'Continue learning':'Return to sign in'}</Link>
    {step === 'request' && <p className="af-small">For a phone-only account, <a className="underline" href="mailto:official@lanxgrow.com?subject=Account%20recovery">contact support</a> for help recovering access. An unverified number cannot authorise a password reset.</p>}
  </div></main>;
}
