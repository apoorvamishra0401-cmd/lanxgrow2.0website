import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Founder-only REVIEW WALKTHROUGH, not privileged admin authentication.
 * The Vercel preview must remain SSO-protected. Typed email is an extra
 * UI confirmation only; never grants an admin role or server permission.
 * All answers live in component state and are discarded on page reload.
 */
const REVIEW_EMAIL = 'apoorvamishra0401@gmail.com';
const customerPaths = [
  { label: 'Student: three-step onboarding + demo', path: '/guest/student' },
  { label: 'Fresher: three-step onboarding + demo', path: '/guest/fresher' },
  { label: 'Professional: three-step onboarding + demo', path: '/guest/professional' },
  { label: 'Home', path: '/' },
  { label: 'Get started', path: '/get-started' },
  { label: 'Google sign-in', path: '/signin' },
  { label: 'Consent', path: '/consent' },
  { label: 'Account', path: '/account' },
  { label: 'SMART AI', path: '/smart-ai' },
  { label: 'Services', path: '/services' }
] as const;
type Stage = 'email' | 'interview' | 'tour';
export default function FounderReviewLab() {
  const [email, setEmail] = useState('');
  const [denied, setDenied] = useState(false);
  const [stage, setStage] = useState<Stage>('email');
  const [seconds, setSeconds] = useState(60);
  const [answer, setAnswer] = useState('');
  const [finished, setFinished] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (stage !== 'interview' || finished) return;
    const timer = window.setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [stage, finished]);
  function confirmEmail(event: React.FormEvent) {
    event.preventDefault();
    if (email.trim().toLowerCase() !== REVIEW_EMAIL) { setDenied(true); return; }
    setStage('interview');
  }
  if (denied) return <main style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}><h1>Sorry, not authorized. Access not authorized.</h1></main>;
  return <main style={{ minHeight: '100vh', background: '#0b101b', color: '#fff', padding: 'clamp(24px,5vw,72px)', fontFamily: 'system-ui,sans-serif' }}>
    <div style={{ maxWidth: 860, margin: 'auto' }}>
      <p style={{ color: '#b9cbf5', letterSpacing: 2, textTransform: 'uppercase' }}>LanXgrow · isolated founder review</p>
      <h1 style={{ fontSize: 'clamp(32px,5vw,54px)' }}>Test the app, one screen at a time.</h1>
      <p style={{ color: '#b7c4d6' }}>This private review entry does not create an admin session, bypass Google authentication, save interview answers, or call a paid AI service. Vercel SSO must be enabled for access.</p>
      {stage === 'email' && <form onSubmit={confirmEmail} style={{ display: 'grid', gap: 16, maxWidth: 470 }}>
        <label htmlFor="founder-email">Confirm review email</label>
        <input id="founder-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" style={{ padding: 14, borderRadius: 9, color: '#101827', background: '#fff' }} />
        <button type="submit" style={{ padding: 14, background: '#a6e5d1', color: '#051a14', borderRadius: 9, fontWeight: 700 }}>Confirm and continue</button>
      </form>}
      {stage === 'interview' && <section style={{ display: 'grid', gap: 18 }}>
        <h2>One-minute interview · diagnostic only</h2>
        <p>Tell us about yourself and the role you are preparing for. You can give a real answer or type “demo.”</p>
        <p role="timer" aria-live="off">Time remaining: {seconds} seconds</p>
        <textarea aria-label="Interview answer" value={answer} onChange={e => setAnswer(e.target.value)} rows={5} placeholder="Type your answer (not stored)" style={{ padding: 16, borderRadius: 9, color: '#101827', background: '#fff' }} />
        <button type="button" onClick={() => { setFinished(true); setStage('tour'); }} style={{ padding: 14, borderRadius: 9, background: '#a6e5d1', color: '#051a14', fontWeight: 700 }}>Complete interview and inspect app</button>
      </section>}
      {stage === 'tour' && <section>
        <h2>Customer journey · live route checks</h2>
        <p>These links open actual pages in this website build, not screenshots. The guest routes include interactive local-only demo onboarding. Live AI, real reports and Google authentication are not yet accepted. Mark what works as you inspect it.</p>
        <div style={{ display: 'grid', gap: 12 }}>
          {customerPaths.map(p => <div key={p.path} style={{ background: '#172235', padding: 16, borderRadius: 10, display: 'flex', gap: 14, justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to={p.path} style={{ color: '#a6e5d1', textDecoration: 'underline', fontWeight: 600 }}>{p.label} · {p.path}</Link>
            <label><input type="checkbox" checked={!!checked[p.path]} onChange={e => setChecked(v => ({ ...v, [p.path]: e.target.checked }))} /> Checked</label>
          </div>)}
        </div>
        <p style={{ color: '#d2dcf0' }}>Reviewed {Object.values(checked).filter(Boolean).length} of {customerPaths.length} routes. Checkmarks are temporary and not saved.</p>
        <button onClick={() => { setStage('interview'); setSeconds(60); setAnswer(''); setFinished(false); setChecked({}); }} style={{ padding: 14, background: '#a6e5d1', color: '#051a14', borderRadius: 9 }}>Run another one-minute demo</button>
      </section>}
    </div>
  </main>;
}
