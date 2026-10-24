import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { acceptCurrentPolicies, getCurrentUser, hasCurrentConsent, signOut } from '@/lib/auth';
import { Logo } from '@/components/ui/Logo';
import { usePageMeta } from '@/hooks/usePageMeta';
import './SignIn.css';
export default function Consent() {
  usePageMeta('Your agreement', 'Review the LanXgrow Terms and Conditions and Privacy Policy.');
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(()=>{let active=true; (async()=>{try { const user=await getCurrentUser(); if(!active)return; if(!user){navigate('/signin',{replace:true});return;} const result=await hasCurrentConsent(); if(!active)return; if(result.ok&&result.data){navigate('/placeholder',{replace:true});return;} if(!result.ok)setError(result.message); setChecking(false); } catch { if(active){setError('Unable to check your agreement. Please try again.');setChecking(false);} }})();return()=>{active=false;};},[navigate]);
  return <main className="lx-login"><Link className="login-brand" to="/" aria-label="LanXgrow home"><Logo/></Link><section className="login-card login-shell" style={{display:'block',maxWidth:520}}><h1 style={{fontSize:32}}>Before your next chapter.</h1><p className="login-subtitle">Please review our Terms and Conditions and Privacy Policy before continuing.</p>{checking?<p role="status">Checking your account…</p>:<form onSubmit={async event=>{event.preventDefault();if(!agreed||busy)return;setBusy(true);setError('');const result=await acceptCurrentPolicies();setBusy(false);if(result.ok)navigate('/placeholder',{replace:true});else setError(result.message);}}><label className="login-consent"><input type="checkbox" required checked={agreed} disabled={busy} onChange={event=>setAgreed(event.target.checked)}/><span>I agree to LanXgrow’s <Link to="/terms" target="_blank" rel="noopener">Terms and Conditions</Link> and <Link to="/privacy" target="_blank" rel="noopener">Privacy Policy</Link>.</span></label>{error&&<p role="alert" className="login-error">{error}</p>}<button className="login-submit" disabled={!agreed||busy} type="submit">{busy?'Saving…':'Agree and continue'}</button><button className="login-back" disabled={busy} type="button" onClick={async()=>{await signOut();navigate('/signin',{replace:true});}}>Sign out instead</button></form>}</section></main>;
}
