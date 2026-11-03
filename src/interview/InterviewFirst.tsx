import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useAuthSession } from '@/hooks/useAuthSession';
import { hasCurrentConsent, signOut } from '@/lib/auth';
import LivingOrbDiagnostic from './LivingOrbDiagnostic';
import { isAudience, readAudience, rememberAudience } from './audience';
import { useInterviewDraft } from './InterviewDraft';
import { loadInterviewReports, submitInterview, type InterviewReport } from './api';
import { departments, parseCandidate, type Candidate } from '../../supabase/functions/interview-assessment/domain';
import './interview.css';

export default function InterviewFirst() {
  usePageMeta('Your interview introduction', 'Start your LanXgrow interview preparation with a spoken introduction.');
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { session, loading } = useAuthSession();
  const { draft, setDraft } = useInterviewDraft();
  const requested = params.get('audience');
  const audience = isAudience(requested) ? requested : readAudience();
  const [candidate, setCandidate] = useState<Candidate>(() => draft?.candidate || { name: '', category: audience === 'Working Professional' ? audience : 'Fresher', track: 'Non-Technical', department: '' });
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [processingAgreed, setProcessingAgreed] = useState(false);
  const [playback, setPlayback] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reports, setReports] = useState<InterviewReport[]>([]);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [reportsError, setReportsError] = useState('');
  const [reportsRetry, setReportsRetry] = useState(0);

  useEffect(() => { if (audience) rememberAudience(audience); }, [audience]);
  useEffect(() => {
    if (!draft) { setPlayback(''); return; }
    const url = URL.createObjectURL(draft.recording.audio);
    setPlayback(url);
    return () => URL.revokeObjectURL(url);
  }, [draft?.id]);
  useEffect(() => {
    let active = true;
    setReports([]); setReport(null); setReportsError('');
    if (session) loadInterviewReports().then(value => { if (active) setReports(value); }).catch(e => { if (active) setReportsError(e.message); });
    return () => { active = false; };
  }, [session?.userId, reportsRetry]);

  async function continueToReport(event: FormEvent) {
    event.preventDefault();
    if (!draft || busy) return;
    setError('');
    try {
      const checked = parseCandidate(candidate);
      if (!ageConfirmed) throw Error('Please confirm you are aged 13 or above.');
      if (!processingAgreed) throw Error('Please review and agree to audio processing before submitting.');
      setDraft(current => current ? { ...current, candidate: checked } : current);
      if (!session) { window.open('/signup?interview=' + encodeURIComponent(checked.category), '_blank', 'noopener'); return; }
      setBusy(true);
      const consent = await hasCurrentConsent();
      if (!consent.ok) throw Error(consent.message);
      if (!consent.data) { navigate('/consent'); return; }
      const saved = await submitInterview(draft.id, draft.recording.audio, checked);
      setReports(current => [saved, ...current.filter(item => item.id !== saved.id)]);
      setReport(saved);
      setDraft(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'We could not prepare your report. Please retry.');
    } finally { setBusy(false); }
  }

  if (audience === 'Student') return <Navigate to="/signin" replace />;
  const feedback = report?.status === 'complete' ? report.feedback : null;
  return (
    <main className="if-root">
      <header className="if-header">
        <Link className="if-brand" to="/" aria-label="LanXgrow home"><img src="/images/assessment/official-logo.webp" alt="" /><span>LanXgrow</span></Link>
        {session ? <button disabled={busy} onClick={async () => { const result = await signOut(); if (!result.ok) setError(result.message); }}>Sign out</button> : <Link to="/get-started">Change journey</Link>}
      </header>
      {!draft && session && params.get('account') === 'connected' ? (
        <section className="if-entry"><h1>Your account is ready.</h1><p>Return to your original interview tab to prepare and save your report.</p><button className="if-primary" onClick={() => navigate('/interview?audience=' + encodeURIComponent(audience || 'Fresher'), {replace: true})}>Start a new introduction here</button></section>
      ) : feedback ? (
        <section className="if-entry if-report">
          <p className="if-eyebrow">YOUR SAVED INTERVIEW REPORT</p><h1>Your introduction.<br />Your next step.</h1>
          <p>{feedback.summary}</p>
          <h2>What’s working well</h2><ul>{feedback.strengths.map((value, index) => <li key={index}>{value}</li>)}</ul>
          <h2>Focus next</h2><ul>{feedback.priorities.map((value, index) => <li key={index}>{value}</li>)}</ul>
          <h2>Your words, with guidance</h2>{feedback.evidence.map((item, index) => <blockquote key={index}><q>{item.quote}</q><p>{item.guidance}</p></blockquote>)}
          <h2>Try this next</h2><p>{feedback.nextPractice}</p>
          <details><summary>Read your transcript</summary><p>{report?.transcript}</p></details>
          <p className="if-service-notice">Feedback is based on the transcript of this introduction. Transcription can contain errors. Hiring decisions depend on each employer’s process.</p>
          <button className="if-primary" onClick={() => setReport(null)}>Practise another introduction</button>
        </section>
      ) : draft ? (
        <section className="if-entry if-captured">
          <p className="if-eyebrow">YOUR INTERVIEW INTRODUCTION</p><h1>A little context.<br />More personal practice.</h1>
          <audio controls src={playback} aria-label="Your recorded introduction" />
          <form className="if-form" onSubmit={continueToReport}>
            <fieldset disabled={busy || loading}>
              <label>Your name<input autoComplete="name" required minLength={2} maxLength={100} value={candidate.name} onChange={e => setCandidate(p => ({ ...p, name: e.target.value }))} /></label>
              <label>Career stage<select value={candidate.category} onChange={e => setCandidate(p => ({ ...p, category: e.target.value as Candidate['category'] }))}><option>Fresher</option><option>Working Professional</option></select></label>
              <label>Preparation track<select value={candidate.track} onChange={e => setCandidate(p => ({ ...p, track: e.target.value as Candidate['track'], department: '' }))}><option>Non-Technical</option><option>Technical</option></select></label>
              <label>Department<select required value={candidate.department} onChange={e => setCandidate(p => ({ ...p, department: e.target.value }))}><option value="">Select your department</option>{departments[candidate.track].map(value => <option key={value}>{value}</option>)}</select></label>
              <label className="if-check"><input type="checkbox" checked={ageConfirmed} onChange={e => setAgeConfirmed(e.target.checked)} required /><span>I am aged 13 or above.</span></label>
              <label className="if-check"><input type="checkbox" checked={processingAgreed} onChange={e => setProcessingAgreed(e.target.checked)} required /><span>I agree to send this recording and its transcript to Groq for transcription and communication feedback, and save my transcript and report in my LanXgrow account.</span></label>
              <button className="if-primary" type="submit">{busy ? 'Preparing your report…' : session ? 'Prepare and save my report' : 'Create my account to continue'}</button>
              {!session && <a className="if-secondary" target="_blank" rel="noopener" href={'/signin?interview=' + encodeURIComponent(candidate.category)}>I already have an account</a>}
              <button className="if-secondary" type="button" onClick={() => setDraft(null)}>Record again</button>
            </fieldset>
          </form>
          <p className="if-service-notice">Keep this tab open until your report is saved. Complete account setup in the new tab, then return here. Refreshing clears an unsent recording.</p>
        </section>
      ) : (
        <LivingOrbDiagnostic logoSrc="/images/assessment/official-logo.webp" onComplete={recording => setDraft({ id: crypto.randomUUID(), recording, ownerId: session?.userId || null, candidate: null })} />
      )}
      {error && <p role="alert" className="if-entry if-error">{error}</p>}
      {session && <section className="if-entry if-history"><h2>Your saved introductions</h2>{reportsError ? <><p role="alert">{reportsError}</p><button className="if-secondary" onClick={() => setReportsRetry(value => value + 1)}>Retry saved reports</button></> : reports.length ? reports.map(item => <button className="if-history-item" key={item.id} disabled={busy || item.status !== 'complete'} onClick={() => setReport(item)}><span>{item.candidate.department}</span><small>{new Date(item.created_at).toLocaleDateString('en-IN')} · {item.status === 'complete' ? 'Open report' : item.status === 'failed' ? 'Analysis incomplete' : 'Preparing report'}</small></button>) : <p>Your completed interview reports will appear here.</p>}</section>}
    </main>
  );
}
