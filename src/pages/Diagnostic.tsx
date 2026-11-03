import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
type Persona = 'student' | 'fresher' | 'professional';
const PROMPT = 'Introduce yourself, where you belong, what you have done, and talk about your interests vs hobbies.';
export default function Diagnostic() {
  usePageMeta('Free 1-Minute Interview', 'Begin with a short conversation and discover your next learning step.');
  const [stage, setStage] = useState(0);
  const [status, setStatus] = useState<'idle'|'recording'|'complete'|'unavailable'>('idle');
  const [persona, setPersona] = useState<Persona>('student');
  const [identity, setIdentity] = useState({name:'',email:'',phone:'',whatsapp:'',age:''});
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  useEffect(() => () => { recorder.current?.state === 'recording' && recorder.current.stop(); stream.current?.getTracks().forEach(track => track.stop()); }, []);
  async function begin() {
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setStatus('unavailable'); return; }
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = audio;
      const recorded = new MediaRecorder(audio);
      recorder.current = recorded;
      recorded.ondataavailable = () => {}; // Private preview: audio stays on device and is discarded.
      recorded.start();
      setStatus('recording');
    } catch { setStatus('unavailable'); }
  }
  function finish() {
    if (recorder.current?.state === 'recording') recorder.current.stop();
    stream.current?.getTracks().forEach(track => track.stop());
    setStatus('complete');
    setStage(1);
  }
  const label = 'text-[0.8rem] font-semibold uppercase tracking-[0.11em] text-ink-500';
  const field = 'mt-2 w-full rounded-xl border border-line bg-ivory-50 px-4 py-3 text-ink-900 focus:border-terracotta-500';
  return <div className="min-h-[75svh] bg-ivory-50">
    <Container><div className="mx-auto max-w-[770px] py-14 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-600">LanXgrow · A conversation to begin</p>
      <h1 className="mt-5 font-display text-display-sm sm:text-display-md">Your voice. Your starting point.</h1>
      <p className="mt-5 max-w-prose text-base leading-relaxed text-ink-500">Begin with a short conversation. The next step will be shaped around your goals.</p>
      <div className="mt-9 flex gap-2" aria-label="Step progress">{[0,1,2,3].map(n => <span key={n} className={`h-1.5 flex-1 rounded-full ${n<=stage?'bg-terracotta-500':'bg-line'}`} />)}</div>
      {stage===0 && <section className="mt-9 rounded-[22px] border border-line bg-alabaster p-6 sm:p-10">
        <p className={label}>01 · First conversation</p>
        <h2 className="mt-4 font-display text-3xl">Tell us about yourself.</h2>
        <p className="mt-5 text-[1.0625rem] leading-[1.8] text-ink-700">{PROMPT}</p>
        <div className="mt-7 rounded-xl bg-sand/60 p-6 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-terracotta-200 bg-ivory text-terracotta-700"><span className="text-3xl">{status==='recording'?'◉':'◎'}</span></div>
          <p className="mt-4 text-sm text-ink-600">{status==='recording'?'Microphone active · Speak naturally':status==='unavailable'?'Microphone unavailable. You can continue to explore the flow.':'A free 1-minute introduction · No visible countdown'}</p>
          <p className="mt-2 text-xs text-ink-500">This preview keeps audio on your device. AI analysis requires a connected assessment service.</p>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          {status!=='recording'&&<Button onClick={begin} withArrow>Begin my conversation</Button>}
          <Button variant="secondary" onClick={finish}>Complete Interview</Button>
        </div>
      </section>}
      {stage===1 && <form className="mt-9 rounded-[22px] border border-line bg-alabaster p-6 sm:p-10" onSubmit={e=>{e.preventDefault();setStage(2);}}>
        <p className={label}>02 · Your details</p>
        <h2 className="mt-4 font-display text-3xl">We are preparing your next step.</h2>
        <p className="mt-4 text-ink-500">Where should we send your free diagnostic scorecard when assessment processing is connected?</p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {([{key:'name',title:'Full Name',type:'text'},{key:'email',title:'Email ID',type:'email'},{key:'phone',title:'Calling Phone Number',type:'tel'},{key:'whatsapp',title:'WhatsApp Number',type:'tel'},{key:'age',title:'Age',type:'number'}] as const).map(item=><label key={item.key}><span className={label}>{item.title}</span><input className={field} type={item.type} required min={item.key==='age'?13:undefined} max={item.key==='age'?120:undefined} value={identity[item.key]} onChange={e=>setIdentity(v=>({...v,[item.key]:e.target.value}))} autoComplete={item.key==='email'?'email':'off'}/></label>)}
        </div>
        <p className="mt-4 text-xs text-ink-500">Preview only: your details stay in this browser session and are not submitted to a database.</p>
        <div className="mt-7"><Button type="submit" withArrow>Continue</Button></div>
      </form>}
      {stage===2 && <section className="mt-9 rounded-[22px] border border-line bg-alabaster p-6 sm:p-10">
        <p className={label}>03 · Choose your learning path</p><h2 className="mt-4 font-display text-3xl">What best describes you?</h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">{([{id:'student',name:'Student',detail:'School / College Foundation'},{id:'fresher',name:'Fresher',detail:'Campus Placement / Job Seeker'},{id:'professional',name:'Working Professional',detail:'Career Growth / Operations'}] as const).map(p=><button type="button" key={p.id} onClick={()=>setPersona(p.id)} aria-pressed={persona===p.id} className={`min-h-[145px] rounded-xl border p-5 text-left transition-colors ${persona===p.id?'border-terracotta-600 bg-terracotta-50':'border-line hover:border-terracotta-300'}`}><strong className="block text-base text-ink-900">{p.name}</strong><span className="mt-2 block text-sm text-ink-500">{p.detail}</span></button>)}</div>
        <div className="mt-7"><Button onClick={()=>setStage(3)} withArrow>View my next step</Button></div>
      </section>}
      {stage===3 && <section className="mt-9 rounded-[22px] border border-line bg-alabaster p-6 sm:p-10">
        <p className={label}>04 · Your communication snapshot</p><h2 className="mt-4 font-display text-3xl">Your journey begins here.</h2>
        <p className="mt-4 text-ink-500">A genuine speaking score needs the assessment engine. Until it is connected, this preview shows the planned measurements without presenting invented results.</p>
        <div className="mt-7 grid grid-cols-3 gap-3">{['Speaking Pace · WPM','Pause Count','Filler-word Frequency'].map(m=><div className="rounded-xl border border-line bg-ivory p-4" key={m}><p className="text-[0.72rem] text-ink-500">{m}</p><p className="mt-3 font-display text-xl text-ink-900">Pending</p></div>)}</div>
        <div className="mt-8 rounded-xl bg-sand/60 p-5"><h3 className="font-display text-2xl">{persona==='student'?'Continue your learning journey':'Explore your interview pathway'}</h3><p className="mt-2 text-sm leading-relaxed text-ink-600">{persona==='student'?'Your existing student onboarding experience is ready to explore.':'Next: target company and role, a 10-minute AI interview, and a four-skill assessment. These backend services are under development.'}</p></div>
        <div className="mt-7"><Button to={persona==='student'?'/get-started':'/interview-prep'} withArrow>{persona==='student'?'Continue as a Student':'Explore Interview Preparation'}</Button></div>
      </section>}
    </div></Container>
  </div>;
}
