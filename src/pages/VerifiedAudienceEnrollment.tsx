import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { getAuthConfig, getAccessTokenForCareer } from '@/lib/auth';
import type { LearnerAudience } from '@/config/audienceCapabilities';

type Assigned = { assigned: boolean; role: string | null; audience: LearnerAudience | null };
const choices: { value: LearnerAudience; title: string; description: string }[] = [
  { value: 'student', title: 'Student', description: 'Learning activities and separate Video Practice. No Interview Preparation.' },
  { value: 'fresher', title: 'Fresher', description: 'Learning, practice, and career interview/assessment.' },
  { value: 'professional', title: 'Working Professional', description: 'Learning, practice, and career interview/assessment.' }
];

/** Development-only one-time, server-recorded audience selection, never admin authorization. */
export default function VerifiedAudienceEnrollment() {
  const { configured, session, loading } = useAuthSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requested = searchParams.get('audience');
  const [choice, setChoice] = useState<LearnerAudience>(
    requested === 'fresher' || requested === 'professional' ? requested : 'student');
  useEffect(() => {
    const next = searchParams.get('audience');
    if (next === 'student' || next === 'fresher' || next === 'professional') setChoice(next);
  }, [searchParams]);
  const [existing, setExisting] = useState<Assigned | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const config = getAuthConfig();
  const isDev = config && new URL(config.url).hostname === 'kzjvvwuyigiclryoqpkv.supabase.co';
  const base = isDev ? new URL('/functions/v1/career/', config.url).toString() : null;
  useEffect(() => {
    if (!session || !base || !config) return;
    let active = true;
    void (async () => {
      try {
        const token = await getAccessTokenForCareer();
        if (!token) throw new Error('Sign in again before choosing an audience.');
        const response = await fetch(base + 'audience', {
          headers: { Authorization: 'Bearer ' + token, apikey: config.anonKey }
        });
        if (!response.ok) throw new Error('Accept the current privacy/terms consent before enrollment.');
        const data = await response.json() as Assigned;
        if (active) setExisting(data);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Audience lookup failed.');
      }
    })();
    return () => { active = false; };
  }, [session?.userId, base]);
  async function enroll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!base || !config || !session || busy) return;
    setBusy(true);
    setError('');
    try {
      const token = await getAccessTokenForCareer();
      if (!token) throw new Error('Google session has expired. Sign in again.');
      const response = await fetch(base + 'enroll', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, apikey: config.anonKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ audience: choice })
      });
      const data = await response.json() as Assigned & { error?: string };
      if (!response.ok || data.role !== 'learner' || data.audience !== choice)
        throw new Error(data.error || 'Audience could not be assigned.');
      setExisting(data);
      navigate('/intro-interview');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Enrollment failed.');
    } finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-ivory-50 px-4 py-10 text-ink-900">
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-display text-3xl">Choose your learning journey</h1>
      <p>Your choice is recorded once on the development server after Google login and current consent. It cannot be switched here. This is self-declared learning audience, not a verified employment status or paid entitlement.</p>
      {!configured || !isDev ? <p role="alert">Development Google authentication is not configured on this build.</p>
       : loading || !session ? <p>Google login required. <Link className="underline" to="/signin">Sign in</Link>, then accept the current consent notice.</p>
       : existing?.assigned ? <div className="rounded-2xl border p-5">
           <p>Already assigned: <strong>{existing.audience || existing.role}</strong></p>
           {existing.audience && <div className="space-y-3"><Link className="block underline" to="/intro-interview">Continue your first 1-minute interview</Link><Link className="block underline" to={'/dashboard/' + existing.audience}>Open your dashboard and Reports</Link></div>}
         </div>
       : <form onSubmit={enroll} className="space-y-5">
           <fieldset className="space-y-3"><legend className="font-semibold">Your learner category</legend>
             {choices.map(item => <label key={item.value} className="flex min-h-16 gap-3 rounded-2xl border p-4">
               <input type="radio" name="audience" value={item.value} checked={choice===item.value}
                 onChange={() => setChoice(item.value)} />
               <span><strong>{item.title}</strong><span className="block text-sm">{item.description}</span></span>
             </label>)}
           </fieldset>
           <button disabled={busy || !session} className="min-h-12 rounded-xl bg-ink-900 px-6 font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Confirm learner category'}</button>
         </form>}
      {error && <p role="alert" className="rounded-xl border border-red-400 p-4">{error}</p>}
      <p className="text-sm">No admin rights are assigned by this form. Existing assignments can only be changed through a verified administrative process.</p>
    </div>
  </main>;
}
