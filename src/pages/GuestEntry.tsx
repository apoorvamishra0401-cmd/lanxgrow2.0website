import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';

/**
 * Founder entry review candidate. No personal information is transmitted or saved.
 * The voice interview and secure identity/report handoff must be connected before
 * this route can be accepted as a functional learner journey.
 */
type Audience = 'student' | 'fresher' | 'professional';
type Draft = { firstName: string; mobile: string; whatsapp: string; education: string; experience: string; goal: string; industry: string; preference: string };
const empty: Draft = { firstName: '', mobile: '', whatsapp: '', education: '', experience: '', goal: '', industry: '', preference: '' };
const heading: Record<Audience,string> = {
  student: 'Your learning, your next step.',
  fresher: 'Your first role starts with your story.',
  professional: 'An interview built around your experience.'
};

export default function GuestEntry() {
  const { audience: rawAudience } = useParams();
  const isAudience = rawAudience === 'student' || rawAudience === 'fresher' || rawAudience === 'professional';
  const audience: Audience = isAudience ? rawAudience : 'fresher';
  usePageMeta('Your AI introduction', 'A private preview of the LanXgrow introduction journey.');
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState(false);
  const [draft, setDraft] = useState<Draft>(empty);
  const [ack, setAck] = useState(false);
  const [error, setError] = useState('');
  const update = (key: keyof Draft, value: string) => setDraft(current => ({ ...current, [key]: value }));
  const validPhone = (value: string) => /^\+?[0-9\s()-]{8,20}$/.test(value.trim());
  const steps = useMemo(() => audience === 'student' ? [
    'A personal introduction', 'Your learning goals', 'Your first conversation'
  ] : ['An introduction to you', 'Your career direction', 'Your interview briefing'], [audience]);
  function next(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (step === 0 && (!consent || !draft.firstName.trim() || !validPhone(draft.mobile) || !validPhone(draft.whatsapp))) {
      setError('Agree to the introduction notice and complete your name, mobile and WhatsApp fields.');
      return;
    }
    if (step === 1 && (!draft.education.trim() || !draft.goal.trim() || (audience !== 'student' && (!draft.experience.trim() || !draft.industry.trim())))) {
      setError('Complete your learning or career information to continue.');
      return;
    }
    if (step === 2 && (!draft.preference.trim() || !ack)) {
      setError('Choose a preference and acknowledge the interview notice.');
      return;
    }
    if (step < 2) setStep(step + 1);
  }
  const field = (key: keyof Draft, label: string, placeholder: string, type: 'text' | 'tel' = 'text') => (
    <label key={key} className="flex flex-col gap-2 text-sm font-medium text-ink-900">
      {label}
      <input className="min-h-12 rounded-xl border border-line bg-ivory px-4 py-3 text-ink-900" type={type}
        value={draft[key]} placeholder={placeholder} onChange={event => update(key, event.target.value)}
        required autoComplete="off" maxLength={key === 'goal' ? 180 : 100}/>
    </label>
  );
  if (!isAudience) return <main className="mx-auto max-w-3xl px-6 py-24"><h1>Choose your audience first.</h1><Link to="/">Return home</Link></main>;
  return <main className="min-h-screen bg-ivory-50 px-4 py-10 text-ink-900 sm:px-6">
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="font-display text-2xl font-bold">Lan<span className="text-terracotta-700">X</span>grow</Link>
        <span className="rounded-full border border-line px-4 py-2 text-xs font-semibold uppercase tracking-widest">Private development preview</span>
      </div>
      <section className="overflow-hidden rounded-[28px] border border-line bg-ivory shadow-lift">
        <div className="border-b border-line bg-sand/50 px-6 py-7 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[.17em] text-terracotta-700">Meet Lan-X · {audience === 'student' ? 'Student' : audience === 'fresher' ? 'Fresher' : 'Working professional'} journey</p>
          <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{heading[audience]}</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-700">Three thoughtful steps before a short, personalized introduction. The AI voice interview is not yet connected in this preview.</p>
          <div className="mt-6 flex gap-2" aria-label={`Step ${step + 1} of 3`}>
            {steps.map((label,index) => <div className="flex-1" key={label}>
              <div className={`h-1.5 rounded-full ${index <= step ? 'bg-terracotta-700' : 'bg-ink-900/10'}`}/>
              <p className="mt-2 text-xs text-ink-700">{index+1}. {label}</p>
            </div>)}
          </div>
        </div>
        <form className="space-y-6 px-6 py-8 sm:px-10" onSubmit={next}>
          {step === 0 && <>
            <p className="text-sm leading-relaxed text-ink-700">These details are requested to tailor your introductory experience. In this review build they stay only in this screen's memory; they are not sent to a server or saved for later.</p>
            <label className="flex items-start gap-3 text-sm leading-relaxed"><input type="checkbox" className="mt-1" checked={consent} onChange={event => setConsent(event.target.checked)}/> I understand this is an unconnected development preview and agree to enter sample details for review. <Link to="/privacy" className="underline">Privacy notice</Link></label>
            {field('firstName','First name','Your first name')}
            {field('mobile','Mobile number','+91 ...','tel')}
            {field('whatsapp','WhatsApp number','+91 ...','tel')}
          </>}
          {step === 1 && <>
            <p className="text-sm leading-relaxed text-ink-700">{audience === 'student' ? 'Your learning background helps tailor your future practice.' : 'Your experience and goals help the interviewer ask more relevant questions.'}</p>
            {field('education',audience === 'student' ? 'Course or year of study' : 'Qualification and education','Tell us briefly')}
            {audience !== 'student' && field('experience',audience === 'fresher' ? 'Projects, internships or fresher experience' : 'Current role and professional experience','A short description')}
            {audience !== 'student' && field('industry','Industry you are interested in','e.g. finance, technology')}
            {field('goal',audience === 'student' ? 'Your English learning goal' : 'Target position and career goal','What would you like to achieve?')}
          </>}
          {step === 2 && <>
            <p className="text-sm leading-relaxed text-ink-700">Thanks{draft.firstName ? ', '+draft.firstName : ''}. Your introduction will be shaped around your {audience === 'student' ? 'learning goal' : 'career goal'} when the voice interviewer is connected.</p>
            <label className="flex flex-col gap-2 text-sm font-medium">Your interview preference
              <select className="min-h-12 rounded-xl border border-line bg-ivory px-4" value={draft.preference} onChange={e=>update('preference',e.target.value)} required>
                <option value="">Choose a focus</option>
                <option value="communication">English communication</option>
                <option value="hr">HR conversation</option>
                <option value="role">Role-specific questions</option>
              </select>
            </label>
            <label className="flex items-start gap-3 text-sm leading-relaxed"><input type="checkbox" className="mt-1" checked={ack} onChange={e=>setAck(e.target.checked)}/> I understand microphone permission and a separate start confirmation are required for a real voice interview.</label>
            <div className="rounded-xl border border-line bg-ivory-50 p-4 text-sm leading-relaxed text-ink-700">
              <strong>AI interview unavailable in this review build.</strong> The one-minute guest assessment, Google sign-in unlock and saved report are not activated. No result will be invented.
            </div>
          </>}
          {error && <p role="alert" className="text-sm font-semibold text-terracotta-700">{error}</p>}
          <div className="flex items-center justify-between gap-3 border-t border-line pt-5">
            <button type="button" className="min-h-12 rounded-xl border border-line px-5 font-semibold disabled:opacity-40" disabled={step===0} onClick={()=>{setError('');setStep(current=>Math.max(0,current-1));}}>Back</button>
            {step < 2 ? <button className="min-h-12 rounded-xl bg-ink-900 px-7 font-semibold text-white" type="submit">Next →</button> : <button className="min-h-12 rounded-xl bg-ink-900 px-7 font-semibold text-white opacity-50" type="button" disabled aria-label="Start AI interview unavailable until voice integration">Start AI interview — coming soon</button>}
          </div>
        </form>
      </section>
      <p className="mt-5 text-center text-xs text-ink-700">Do not enter real personal information in this incomplete review build.</p>
    </div>
  </main>;
}
