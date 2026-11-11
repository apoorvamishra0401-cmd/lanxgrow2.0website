import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { assertAttempt, formatRemaining, remainingMs, resumeKey, submissionKey,
  type Attempt, type CareerTransport, type JourneyKind, type Receipt,
  type VerifiedCareerAccess } from './lifecycle';

/** Owner-scoped LANX-02 component; LANX-00 registers a route and trusted adapter.
 * Never infer entitlement from the UI, or render invented evaluation scores.
 */
export default function InterviewPreparation({ transport }: { transport?: CareerTransport }) {
  const { session, configured, loading } = useAuthSession();
  const [access, setAccess] = useState<VerifiedCareerAccess | null>(null);
  const [kind, setKind] = useState<JourneyKind>('video-interview');
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [consent, setConsent] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [interrupted, setInterrupted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const autoSubmitRef = useRef(false);
  const pendingRef = useRef(false);

  const closeCamera = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder?.state === 'recording') recorder.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraReady(false);
  }, []);
  useEffect(() => () => {
    const recorder = recorderRef.current;
    if (recorder?.state === 'recording') recorder.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  const restore = useCallback(async (identity: VerifiedCareerAccess, journey: JourneyKind) => {
    if (!transport) return;
    const id = localStorage.getItem(resumeKey(identity.userId, journey));
    if (!id) return;
    try {
      const saved = await transport.recover(id);
      assertAttempt(identity, saved, journey);
      setAttempt(saved);
      setReceipt(saved.receipt ?? null);
      setIndex(0);
      setAnswer(saved.answers[saved.questions[0].id] ?? '');
      setSecondsLeft(remainingMs(saved.deadlineAt));
      setInterrupted(journey === 'video-interview' && !saved.receipt);
    } catch {
      setError('The previous attempt could not be recovered. Your server record was not deleted.');
    }
  }, [transport]);

  useEffect(() => {
    if (!transport || !session?.userId || loading) return;
    let current = true;
    setAccess(null);
    void transport.authorize().then(async identity => {
      if (!current) return;
      if (!identity.allowed || identity.userId !== session.userId ||
          (identity.audience !== 'fresher' && identity.audience !== 'professional')) {
        setError('Career preparation requires server-verified Fresher or Working Professional access.');
        return;
      }
      setAccess(identity);
      await restore(identity, kind);
    }).catch(() => { if (current) setError('Career authorization could not be verified.'); });
    return () => { current = false; };
  // The journey switch uses restore explicitly, not this authorization effect.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transport, session?.userId, loading]);

  useEffect(() => {
    if (!attempt || receipt) return;
    const tick = () => setSecondsLeft(remainingMs(attempt.deadlineAt));
    tick();
    const timer = setInterval(tick, 500);
    return () => clearInterval(timer);
  }, [attempt, receipt]);

  async function choose(next: JourneyKind) {
    if (!access || busy || (attempt && !receipt)) return;
    closeCamera();
    setKind(next);
    setAttempt(null);
    setError('');
    setConsent(false);
    setReceipt(null);
    setIndex(0);
    setAnswer('');
    autoSubmitRef.current = false;
    await restore(access, next);
  }

  async function camera() {
    setError('');
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('Camera recording requires HTTPS and a compatible browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraReady(true);
      if (attempt && !receipt && remainingMs(attempt.deadlineAt) > 0) record();
    } catch {
      setError('Camera or microphone permission denied. Enable both to begin recording.');
    }
  }

  function record() {
    if (!streamRef.current || !window.MediaRecorder) throw new Error('Camera recording unavailable');
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);
    recorderRef.current = recorder;
    recorder.ondataavailable = e => { if (e.data.size) chunksRef.current.push(e.data); };
    recorder.onerror = () => setError('Recording interrupted. You may need to record again.');
    recorder.start(1000);
    setInterrupted(false);
  }

  async function start() {
    if (!access || !transport || !consent || busy) return;
    if (kind === 'video-interview' && !cameraReady) { setError('Enable camera and microphone first.'); return; }
    setBusy(true); setError('');
    try {
      // Store the pending idempotency token until start is acknowledged.
      // A new completed attempt must receive a fresh token, not reuse an old start.
      const pendingKey = `${resumeKey(access.userId, kind)}:pending-start`;
      const startToken = sessionStorage.getItem(pendingKey) ?? crypto.randomUUID();
      sessionStorage.setItem(pendingKey, startToken);
      const started = await transport.start(kind, startToken);
      assertAttempt(access, started, kind);
      if (started.status !== 'active') throw new Error('This attempt cannot be started.');
      if (kind === 'video-interview') record();
      localStorage.setItem(resumeKey(access.userId, kind), started.id);
      sessionStorage.removeItem(pendingKey);
      setAttempt(started);
      setIndex(0);
      setAnswer(started.answers[started.questions[0].id] ?? '');
      setSecondsLeft(remainingMs(started.deadlineAt));
      autoSubmitRef.current = false;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start this attempt.');
    } finally { setBusy(false); }
  }

  async function next() {
    if (!attempt || !transport || !access || busy) return;
    // Camera questions are recorded as a continuous MediaRecorder stream.
    // An empty text answer must not be submitted as fabricated video evidence.
    if (attempt.questions[index].format === 'video') {
      setIndex(Math.min(index + 1, attempt.questions.length - 1));
      setAnswer('');
      return;
    }
    setBusy(true); setError('');
    try {
      const updated = await transport.saveAnswer(attempt.id, attempt.questions[index].id, answer);
      assertAttempt(access, updated, kind);
      const position = Math.min(index + 1, updated.questions.length - 1);
      setAttempt(updated);
      setIndex(position);
      setAnswer(updated.answers[updated.questions[position].id] ?? '');
    } catch { setError('Answer not saved. Retry without leaving this question.'); }
    finally { setBusy(false); }
  }

  async function videoBlob(): Promise<Blob | undefined> {
    const recorder = recorderRef.current;
    if (recorder?.state === 'recording') {
      await new Promise<void>(resolve => {
        recorder.addEventListener('stop', () => resolve(), {once:true});
        recorder.stop();
      });
    }
    const blob = new Blob(chunksRef.current, {type:recorder?.mimeType || 'video/webm'});
    return blob.size ? blob : undefined;
  }

  async function finish() {
    if (!attempt || !transport || !access || busy || pendingRef.current || receipt) return;
    pendingRef.current = true; setBusy(true); setError('');
    try {
      const question = attempt.questions[index];
      if (question.format !== 'video') {
        const updated = await transport.saveAnswer(attempt.id, question.id, answer);
        assertAttempt(access, updated, kind);
      }
      const media = kind === 'video-interview' ? await videoBlob() : undefined;
      if (kind === 'video-interview' && !media) throw new Error('No video captured. Re-record before submitting.');
      const result = await transport.submit(attempt.id, submissionKey(attempt.id), media);
      if (!result.id) throw new Error('No durable submission receipt returned.');
      setReceipt(result);
      closeCamera();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Submission failed. Retry safely with the same key.');
    } finally { setBusy(false); pendingRef.current = false; }
  }

  useEffect(() => {
    if (!attempt || receipt || busy || autoSubmitRef.current ||
        remainingMs(attempt.deadlineAt) > 0) return;
    autoSubmitRef.current = true;
    void finish(); // Only once automatically: avoid an unbounded failure/retry loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, receipt, busy, secondsLeft]);

  async function refreshReceipt() {
    if (!receipt || !transport || busy) return;
    setBusy(true); setError('');
    try {
      const updated = await transport.readReceipt(receipt.id);
      if (updated.id !== receipt.id) throw new Error('Receipt mismatch');
      setReceipt(updated);
    } catch { setError('Receipt read failed. Retry this lookup; do not submit again.'); }
    finally { setBusy(false); }
  }

  const question = attempt?.questions[index];
  return <main className="min-h-screen bg-ivory-50 px-4 py-10 text-ink-900 sm:px-6">
    <div className="mx-auto max-w-3xl space-y-6">
      <header><p className="text-sm font-semibold text-terracotta-700">LanXgrow · Career preparation</p>
        <h1 className="font-display text-3xl">Interview Preparation</h1>
        <p>10-minute camera-based video interview · Separate 20-minute skills assessment</p></header>
      {!configured || !session ? <p role="status">{loading ? 'Checking your session…' : <>Sign in to continue: <Link to="/signin" className="underline">Sign in</Link></>}</p>
        : !transport ? <p role="status">Authenticated interview services are not connected in this build. No recording, score or report is claimed.</p>
        : !access ? <p role="status">Checking server-verified career access…</p> : <>
          <nav className="flex flex-wrap gap-3" aria-label="Preparation format">
            <button type="button" className="min-h-12 rounded-xl border p-3" disabled={(!!attempt && !receipt) || busy} aria-pressed={kind === 'video-interview'} onClick={() => void choose('video-interview')}>Video interview · 10 min</button>
            <button type="button" className="min-h-12 rounded-xl border p-3" disabled={(!!attempt && !receipt) || busy} aria-pressed={kind === 'skills-assessment'} onClick={() => void choose('skills-assessment')}>Skills assessment · 20 min</button>
          </nav>
          {kind === 'video-interview' && !receipt && <video ref={videoRef} muted playsInline autoPlay aria-label="Live camera preview" className="w-full max-w-md rounded-xl bg-black" />}
          {!attempt ? <section className="space-y-4 rounded-2xl border bg-white p-6">
            <h2 className="text-2xl">Consent and permissions</h2>
            <p>Timed attempts use a trusted server clock. Refreshing does not pause time. Camera recording stays in browser memory until upload; a refresh loses unsubmitted video.</p>
            <label className="flex gap-3"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /> I agree to the applicable recording and submission notice.</label>
            {kind === 'video-interview' && <button type="button" className="min-h-12 rounded-xl border px-5" onClick={() => void camera()}>Request camera and microphone</button>}
            <button type="button" className="min-h-12 rounded-xl bg-ink-900 px-5 text-white disabled:opacity-40" disabled={!consent || busy || (kind === 'video-interview' && !cameraReady)} onClick={() => void start()}>Start</button>
          </section> : <section className="space-y-4 rounded-2xl border bg-white p-6">
            <div className="flex justify-between gap-4"><h2 className="text-xl">{kind === 'video-interview' ? 'Video interview' : 'Skills assessment'}</h2><p role="timer" className="font-mono">{formatRemaining(secondsLeft)}</p></div>
            {interrupted && !receipt && <p role="alert">This attempt resumed after interruption. Your previous local recording cannot be recovered. Re-enable the camera; the original deadline still applies.</p>}
            {kind === 'video-interview' && !cameraReady && !receipt && <button type="button" className="min-h-12 rounded-xl border px-5" onClick={() => void camera()}>Re-enable camera and record</button>}
            {!receipt ? <><p>Question {index+1} / {attempt.questions.length}</p><p className="font-semibold">{question?.prompt}</p>
              {question?.format === 'choice' && question.choices ? <fieldset><legend>Choose an answer</legend>{question.choices.map(option => <label className="flex gap-2 p-2" key={option}><input type="radio" name="answer" checked={answer===option} onChange={() => setAnswer(option)}/>{option}</label>)}</fieldset>
                : question?.format === 'text' ? <textarea className="w-full rounded-xl border p-4" rows={5} aria-label="Assessment answer" value={answer} onChange={e => setAnswer(e.target.value)} />
                : <p>Respond aloud to the camera. Recording is not a completed AI evaluation.</p>}
              <div className="flex flex-wrap gap-3">
                {index < attempt.questions.length-1 && <button className="min-h-12 rounded-xl border px-5" disabled={busy || secondsLeft === 0} onClick={() => void next()}>{kind === 'video-interview' ? 'Next video question' : 'Save and next'}</button>}
                <button className="min-h-12 rounded-xl bg-ink-900 px-5 text-white disabled:opacity-40" disabled={busy || (kind === 'video-interview' && !cameraReady)} onClick={() => void finish()}>Finish and submit</button>
              </div></> : <section role="status" className="space-y-3"><h3>Durable receipt: {receipt.id}</h3><p>Processing status: {receipt.status}</p>
              {receipt.status === 'complete' && receipt.reportId ? <p>Server report reference: {receipt.reportId}. LANX-03's verified report reader must be connected to display feedback.</p> : <p>No AI evaluation score is displayed by this component.</p>}
              <button type="button" className="min-h-12 rounded-xl border px-5" onClick={() => void refreshReceipt()} disabled={busy}>Read latest receipt</button></section>}
          </section>}
          {attempt && receipt && <button type="button" className="min-h-12 rounded-xl border px-5" disabled={busy} onClick={() => {
            if (!access) return;
            localStorage.removeItem(resumeKey(access.userId, kind));
            setAttempt(null); setReceipt(null); setAnswer(''); setIndex(0);
            setConsent(false); setInterrupted(false); autoSubmitRef.current = false;
          }}>Start a new attempt</button>}
        </>}
      {error && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-900">{error}</p>}
      <p className="text-sm">Separate from the one-minute guest introduction and student Video Practice. Backend authorization, receipt persistence and evaluator accuracy require independent hosted verification.</p>
    </div>
  </main>;
}
