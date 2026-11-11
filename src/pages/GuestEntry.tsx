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
  const [phase, setPhase] = useState<'onboarding'|'preparing'|'question'|'processing'|'report'>('onboarding');
  const [demoAnswer, setDemoAnswer] = useState('');
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
  function startDemo() {
    setError('');
    if (!draft.preference || !ack) {
      setError('Select an interview focus and confirm the simulation notice.');
      return;
    }
    setPhase('preparing');
  }
  const roleQuestion = audience === 'student'
    ? `Hello ${draft.firstName}. What would you most like to improve about your English communication for ${draft.goal}?`
    : `Hello ${draft.firstName}. Imagine you are interviewing for ${draft.goal}. How would your ${draft.education} background and ${draft.experience} experience help you succeed?`;
  const field = (key: keyof Draft, label: string, placeholder: string, type: 'text' | 'tel' = 'text') => (
    <label key={key} className="flex flex-col gap-2 text-sm font-medium text-ink-900">
      {label}
      <input className="min-h-12 rounded-xl border border-line bg-ivory px-4 py-3 text-ink-900" type={type}
        value={draft[key]} placeholder={placeholder} onChange={event => update(key, event.target.value)}
        required autoComplete="off" maxLength={key === 'goal' ? 180 : 100}/>
    </label>
  );
  if (!isAudience) return <main className="mx-auto max-w-3xl px-6 py-24"><h1>Choose your audience first.</h1><Link to="/">Return home</Link></main>;
  if (phase !== 'onboarding') return <main className="min-h-screen bg-ivory-50 px-4 py-12 text-ink-900 sm:px-6">
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link to="/" className="font-display text-2xl font-bold">Lan<span className="text-terracotta-700">X</span>grow</Link>
        <span className="rounded-full border border-line px-3 py-2 text-xs font-semibold">INTERACTIVE SIMULATION · NOT LIVE AI</span>
      </div>
      <section className="rounded-[28px] border border-line bg-ivory p-7 shadow-lift sm:p-10">
        <div className="mx-auto mb-7 grid h-24 w-24 place-items-center rounded-full border-4 border-terracotta-700/30 bg-ink-900 font-display text-3xl font-bold tracking-tight text-white shadow-lift" aria-label="LanXgrow LX visual placeholder">LX</div>
        {phase === 'preparing' && <>
          <p className="text-xs font-semibold uppercase tracking-widest text-terracotta-700">Step 1 · Preparing</p>
          <h1 className="mt-3 font-display text-3xl">Personalizing your interview preview.</h1>
          <div className="mt-6 space-y-3 text-sm text-ink-700">
            <p>✓ Profile loaded in this browser tab</p>
            <p>✓ Focus: {draft.preference}</p>
            <p>✓ Goal: {draft.goal}</p>
            <p>✓ Preparing a simulated question for {draft.firstName}</p>
          </div>
          <p className="mt-5 rounded-xl bg-sand/50 p-4 text-sm">The actual AI engine, speech and backend are not connected. This shows the proposed user experience, not a real assessment.</p>
          <button type="button" className="mt-6 min-h-12 rounded-xl bg-ink-900 px-6 font-semibold text-white" onClick={()=>setPhase('question')}>Continue to simulated AI interview →</button>
        </>}
        {phase === 'question' && <>
          <p className="text-xs font-semibold uppercase tracking-widest text-terracotta-700">Step 2 · Sample interview</p>
          <h1 className="mt-3 font-display text-3xl">Meet your AI interviewer</h1>
          <p className="mt-5 rounded-xl border border-line bg-sand/50 p-5 text-base leading-relaxed" role="status">{roleQuestion}</p>
          <label className="mt-6 flex flex-col gap-2 text-sm font-medium">Your sample answer (typed for prototype testing only)
            <textarea value={demoAnswer} onChange={e=>setDemoAnswer(e.target.value)} maxLength={1200}
              className="min-h-32 rounded-xl border border-line bg-white p-4 text-ink-900" placeholder="Write a sample answer to see how the next screen reacts. Voice input will replace this in the actual product."/>
          </label>
          <p className="mt-2 text-xs text-ink-700">This is NOT an actual voice assessment. No scores are inferred from this answer and nothing is uploaded.</p>
          <button type="button" disabled={!demoAnswer.trim()} className="mt-6 min-h-12 rounded-xl bg-ink-900 px-6 font-semibold text-white disabled:opacity-40" onClick={()=>setPhase('processing')}>Finish sample interview →</button>
        </>}
        {phase === 'processing' && <>
          <p className="text-xs font-semibold uppercase tracking-widest text-terracotta-700">Step 3 · Report journey</p>
          <h1 className="mt-3 font-display text-3xl">Your response is ready for review.</h1>
          <div className="mt-6 space-y-3 rounded-xl border border-line bg-sand/50 p-5 text-sm">
            <p>✓ Interview step completed in this simulation</p>
            <p>✓ Sample response held only in browser memory</p>
            <p>◌ Live AI evaluation and secure report storage: not connected</p>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-ink-700">In the finished app, Get Report will invite you to sign in with Google, complete your profile and securely unlock your actual feedback.</p>
          <button type="button" className="mt-6 min-h-12 rounded-xl bg-ink-900 px-6 font-semibold text-white" onClick={()=>setPhase('report')}>Get Report · See sample format →</button>
        </>}
        {phase === 'report' && <>
          <p className="text-xs font-semibold uppercase tracking-widest text-terracotta-700">Step 4 · Sample report</p>
          <h1 className="mt-3 font-display text-3xl">This is how your report could look, {draft.firstName}.</h1>
          <p className="mt-4 rounded-xl border border-line bg-sand/50 p-4 text-sm font-semibold">SAMPLE REPORT ONLY · No evaluation or accuracy claims</p>
          <dl className="mt-6 grid gap-3 text-sm">
            <div className="rounded-xl border border-line p-4"><dt className="font-semibold">Your goal</dt><dd className="mt-1 text-ink-700">{draft.goal}</dd></div>
            <div className="rounded-xl border border-line p-4"><dt className="font-semibold">Interview focus</dt><dd className="mt-1 text-ink-700">{draft.preference}</dd></div>
            <div className="rounded-xl border border-line p-4"><dt className="font-semibold">Sample response</dt><dd className="mt-1 whitespace-pre-wrap break-words text-ink-700">{demoAnswer}</dd></div>
            <div className="rounded-xl border border-line p-4"><dt className="font-semibold">Scores and recommendations</dt><dd className="mt-1 text-ink-700">Available only after real AI evaluation is integrated and validated.</dd></div>
          </dl>
          <p className="mt-5 text-sm text-ink-700">The finished flow requires Google sign-in to save and retrieve a real report. This sample stays in memory and disappears when this page is refreshed.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="min-h-12 rounded-xl border border-line px-5 font-semibold" onClick={()=>{setDemoAnswer('');setPhase('question');}}>Try another response</button>
            <button type="button" className="min-h-12 rounded-xl border border-line px-5 font-semibold" onClick={()=>{setPhase('onboarding');setStep(0);}}>Review onboarding</button>
            <Link className="min-h-12 rounded-xl border border-line px-5 py-3 font-semibold underline" to={`/dashboard/${audience}`}>Open your dashboard</Link>
          </div>
        </>}
      </section>
    </div>
  </main>;
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
              <strong>Live AI interview unavailable in this review build.</strong> The one-minute guest assessment, Google sign-in unlock and saved report are not activated. A clearly labeled interactive simulation is available for review; it does not generate real scores.
            </div>
          </>}
          {error && <p role="alert" className="text-sm font-semibold text-terracotta-700">{error}</p>}
          <div className="flex items-center justify-between gap-3 border-t border-line pt-5">
            <button type="button" className="min-h-12 rounded-xl border border-line px-5 font-semibold disabled:opacity-40" disabled={step===0} onClick={()=>{setError('');setStep(current=>Math.max(0,current-1));}}>Back</button>
            {step < 2 ? <button className="min-h-12 rounded-xl bg-ink-900 px-7 font-semibold text-white" type="submit">Next →</button> : <button className="min-h-12 rounded-xl bg-ink-900 px-7 font-semibold text-white" type="button" onClick={startDemo}>Start interactive simulation →</button>}
          </div>
        </form>
      </section>
      <div className="mt-5 flex justify-center"><Link className="min-h-12 rounded-xl border border-line bg-ivory px-6 py-3 font-semibold underline" to={`/dashboard/${audience}`}>Open {audience === 'student' ? 'Student' : audience === 'fresher' ? 'Fresher' : 'Working Professional'} dashboard →</Link></div>
      <p className="mt-5 text-center text-xs text-ink-700">Do not enter real personal information in this incomplete review build.</p>
    </div>
  </main>;
}
