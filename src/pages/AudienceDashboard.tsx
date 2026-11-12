import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { FEATURE_DETAILS, getAudienceDashboardPath, getAudienceFeaturePath, resolveDashboardRoute, visibleDashboardFeatures } from '@/config/audienceNavigation';
import type { LearnerAudience, LearnerFeature } from '@/config/audienceCapabilities';
import FirstReports from '@/features/intro/FirstReports';
import { useAuthSession } from '@/hooks/useAuthSession';
import './AudienceDashboard.css';

const audienceTitle: Record<LearnerAudience,string> = {
  student: 'Student dashboard',
  fresher: 'Fresher dashboard',
  professional: 'Working Professional dashboard',
};
const prompts: Partial<Record<LearnerFeature,string>> = {
  'speaking-practice': 'Introduce yourself in English. What do you enjoy learning?',
  'listening-practice': 'Listen to: “Every small practice session builds confidence.” Then type what you heard.',
  'reading-practice': 'Read: “Communication improves when we listen, ask questions, and practise regularly.” What does the passage suggest?',
  'writing-practice': 'Write a short message to introduce yourself to a new classmate or colleague.',
  'practice-exercises': 'Make a sentence using the word “confident”.',
  'interview-preparation': 'Write three points about your experience and the role you want.',
  'interview-video': 'Write a brief opening answer before your video interview.',
  'interview-assessment': 'Explain how you would approach a difficult question during an assessment.',
};
const storeKey = (audience: LearnerAudience) => 'lanx-role-dashboard-review-' + audience;

function readProgress(audience: LearnerAudience): LearnerFeature[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storeKey(audience)) || '[]');
    return Array.isArray(parsed)
      ? parsed.filter((item): item is LearnerFeature => typeof item === 'string' && visibleDashboardFeatures(audience).some(feature => feature === item))
      : [];
  } catch { return []; }
}

function DeviceCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState('');
  const [active, setActive] = useState(false);
  const stop = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  };
  useEffect(() => () => { streamRef.current?.getTracks().forEach(track => track.stop()); }, []);
  async function start() {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia) { setError('Camera preview is unavailable in this browser or insecure context.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setActive(true);
    } catch { setError('Camera permission was denied or the camera is unavailable.'); }
  }
  return <div className="lx-role-workspace">
    <h2>Private camera practice</h2>
    <p>Preview yourself introducing a topic. This local camera preview does not record, upload or score video.</p>
    <video ref={videoRef} autoPlay playsInline muted aria-label="Private camera preview" />
    <div className="lx-role-choices">
      {!active ? <button className="lx-role-action" onClick={start} type="button">Start camera preview</button>
        : <button className="lx-role-action" onClick={stop} type="button">Stop camera</button>}
    </div>
    {error && <p role="alert">{error}</p>}
  </div>;
}

function Exercise({ audience, feature, onComplete }: { audience: LearnerAudience; feature: LearnerFeature; onComplete: (feature: LearnerFeature) => void }) {
  const [answer, setAnswer] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const prompt = prompts[feature];
  const available = feature === 'listening-practice' && typeof window !== 'undefined' && 'speechSynthesis' in window;
  function speak() {
    if (!available) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance('Every small practice session builds confidence.'));
  }
  useEffect(() => { setAnswer(''); setConfirmed(false); }, [feature, audience]);
  if (feature === 'video-practice') return <DeviceCamera />;
  if (feature === 'ai-soul') return <div className="lx-role-workspace">
    <h2>Meet Lan-X AI</h2>
    <p>The existing SMART AI experience opens in its own page. Review its in-product live/demo labeling before using it.</p>
    <Link className="lx-role-link" to="/smart-ai">Open SMART AI</Link>
  </div>;
  if (feature === 'progress-reports') return null;
  return <section className="lx-role-workspace" aria-labelledby="exercise-title">
    <h2 id="exercise-title">Practice workspace</h2>
    {feature.startsWith('interview-') && <p className="lx-role-notice">This page contains a local practice exercise. The separate authenticated career interview service uses trusted role checks, timed attempts and private recording upload; evaluation reports are not yet connected.</p>}
    <p>{prompt}</p>
    {feature === 'listening-practice' && <button type="button" className="lx-role-action" disabled={!available} onClick={speak}>Play practice sentence</button>}
    {!available && feature === 'listening-practice' && <p>Browser speech playback is not available. You can still complete the typed exercise.</p>}
    <label htmlFor="lx-role-answer" style={{display:'block',margin:'16px 0 8px',fontWeight:700}}>Your response (kept in this page only)</label>
    <textarea id="lx-role-answer" value={answer} onChange={e=>{setAnswer(e.target.value);setConfirmed(false);}} maxLength={2000} placeholder="Type your practice response" />
    <button type="button" className="lx-role-action" disabled={!answer.trim()} onClick={()=>{onComplete(feature);setConfirmed(true);}}>Mark practice complete on this device</button>
    {confirmed && <p role="status">Practice marked complete. No AI evaluation or proficiency score was generated.</p>}
    {feature === 'interview-video' || feature === 'interview-assessment'
      ? <p style={{marginTop:18}}>For your authenticated career assessment, <Link to="/career/interview">open Interview Preparation</Link>. This requires a verified Google session, assigned career access and current consent; otherwise the service will deny access. It is separate from the {feature === 'interview-video' ? '10-minute video interview' : '20-minute assessment'}.</p>
      : null}
  </section>;
}

export default function AudienceDashboard() {
  const {session}=useAuthSession();
  const { audience: rawAudience, feature: rawFeature } = useParams();
  const route = resolveDashboardRoute(rawAudience, rawFeature);
  const audience = route.allowed ? route.audience : 'student';
  const activeFeature = route.allowed ? route.feature : null;
  const [completed, setCompleted] = useState<LearnerFeature[]>(() => readProgress(audience));
  const [tourOpen, setTourOpen] = useState(false);
  useEffect(() => {
    if (!route.allowed || activeFeature) return;
    try { setTourOpen(localStorage.getItem('lanx-report-tour-seen-' + (session?.userId || 'guest') + '-' + audience) !== 'yes'); }
    catch { setTourOpen(true); }
  }, [audience, route.allowed, activeFeature, session?.userId]);
  function finishTour() {
    setTourOpen(false);
    try { localStorage.setItem('lanx-report-tour-seen-' + (session?.userId || 'guest') + '-' + audience, 'yes'); } catch { /* private storage may be unavailable */ }
  }
  useEffect(() => { setCompleted(readProgress(audience)); }, [audience]);
  usePageMeta(route.allowed ? audienceTitle[audience] : 'Unavailable dashboard',
    'Learner-specific practice and progress in the private LanXgrow review build.');
  if (!route.allowed) return <main className="lx-role-dashboard">
    <div className="lx-role-wrap"><h1>That dashboard feature is unavailable for this audience.</h1>
      <p>Choose a valid learning audience or return to onboarding. UI restrictions are not server authorization.</p>
      <Link className="lx-role-link" to="/get-started">Choose your journey</Link></div></main>;
  const features = visibleDashboardFeatures(audience);
  const progressCount = completed.filter(item => features.includes(item)).length;
  const updateComplete = (feature: LearnerFeature) => {
    const next = Array.from(new Set([...completed,feature]));
    setCompleted(next);
    try { localStorage.setItem(storeKey(audience), JSON.stringify(next)); } catch { /* storage unavailable */ }
  };
  const learning = features.filter(feature => FEATURE_DETAILS[feature].group === 'learning');
  const interviews = features.filter(feature => FEATURE_DETAILS[feature].group === 'interview');
  const featureCard = (feature: LearnerFeature) => <article className="lx-role-card" key={feature}>
    <h2>{feature === 'progress-reports' ? 'My Reports' : FEATURE_DETAILS[feature].title}</h2>
    <p>{FEATURE_DETAILS[feature].description}</p>
    {completed.includes(feature) && <span aria-label="Practice marked complete">✓ Practised on this device</span>}
    <Link className="lx-role-link" to={getAudienceFeaturePath(audience,feature)}>
      {feature === 'progress-reports' ? 'Open Reports' : 'Open '+FEATURE_DETAILS[feature].title}
    </Link>
  </article>;
  return <main className="lx-role-dashboard">
    <div className="lx-role-wrap">
      <div className="lx-role-top">
        <Link className="lx-role-brand" to="/">LanXgrow</Link>
        <nav aria-label="Dashboard navigation">
          <Link to={getAudienceDashboardPath(audience)}>Dashboard</Link>
          <Link to={'/guest/'+audience}>Onboarding preview</Link>
          <Link to="/get-started">Choose another journey</Link>
        </nav>
      </div>
      <header className="lx-role-banner">
        <span className="lx-role-kicker">Audience-specific private review</span>
        <h1>{audienceTitle[audience]}</h1>
        <p>Learn, practise and review activity with tools selected for your journey. Some exercises are device-only previews; they are not connected to live AI assessment or verified reports.</p>
        <p>Practice activities marked on this device: {progressCount} of {features.filter(f=>f!=='progress-reports' && f!=='ai-soul').length} possible.</p>
      </header>
      <p className="lx-role-status">UI feature filtering is for navigation only. Authentication and server-side audience authorization require independent verification.</p>
      {tourOpen && !activeFeature && <section role="region" aria-label="First-time dashboard guide" className="lx-role-workspace">
        <h2>Welcome! Start with Reports</h2>
        <p>Step 1: Open the Reports section below to check your first interview report. If your interview has not been securely submitted and evaluated yet, the report will show as not available — never as a sample score.</p>
        <div className="lx-role-choices">
          <Link className="lx-role-link" to={getAudienceFeaturePath(audience,'progress-reports')} onClick={finishTour}>Open Reports →</Link>
          <button className="lx-role-action" type="button" onClick={finishTour}>Skip guide</button>
        </div>
      </section>}
      {activeFeature ? <>
        <div className="lx-role-choices"><Link className="lx-role-back" to={getAudienceDashboardPath(audience)}>← All dashboard features</Link></div>
        <h2 className="lx-role-section-title">{FEATURE_DETAILS[activeFeature].title}</h2>
        {activeFeature === 'progress-reports'
          ? <><FirstReports /><section className="lx-role-workspace"><h3>Practice activity on this device</h3><p>{progressCount} locally completed activities. This is not a verified learner history or AI score.</p>
              <ul>{completed.map(item=><li key={item}>{FEATURE_DETAILS[item].title}</li>)}</ul></section></>
          : <Exercise audience={audience} feature={activeFeature} onComplete={updateComplete} />}
      </> : <>
        <h2 className="lx-role-section-title">Learning & practice</h2>
        <div className="lx-role-grid">{learning.map(featureCard)}</div>
        {interviews.length > 0 && <>
          <h2 className="lx-role-section-title">Interview Preparation</h2>
          <div className="lx-role-grid">{interviews.map(featureCard)}</div>
        </>}
        <h2 className="lx-role-section-title">Progress</h2>
        <div className="lx-role-grid">{featureCard('progress-reports')}</div>
      </>}
    </div>
  </main>;
}
