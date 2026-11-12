import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { startIntroduction, uploadIntroduction, completeIntroduction,
  type IntroStart } from '@/features/intro/api';
import { usePageMeta } from '@/hooks/usePageMeta';

type Phase = 'ready' | 'preparing' | 'recording' | 'uploading' | 'complete';
type SpeechResult = { results: ArrayLike<ArrayLike<{transcript:string}>>; resultIndex:number };
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event:SpeechResult)=>void) | null;
  onerror: (()=>void) | null;
  start:()=>void;
  stop:()=>void;
};
type BrowserSpeech = typeof window & { SpeechRecognition?:new()=>SpeechRecognitionLike;
  webkitSpeechRecognition?:new()=>SpeechRecognitionLike };

export default function FirstIntroduction() {
  const {session,loading,configured}=useAuthSession();
  const navigate=useNavigate();
  usePageMeta('Your one-minute introduction','Record and securely save your first introduction interview.');
  const video=useRef<HTMLVideoElement>(null);
  const stream=useRef<MediaStream|null>(null);
  const recorder=useRef<MediaRecorder|null>(null);
  const chunks=useRef<Blob[]>([]);
  const speech=useRef<SpeechRecognitionLike|null>(null);
  const started=useRef<IntroStart|null>(null);
  const clock=useRef<number|null>(null);
  const elapsed=useRef(0);
  const [seconds,setSeconds]=useState(60);
  const [phase,setPhase]=useState<Phase>('ready');
  const [consent,setConsent]=useState(false);
  const [speechConsent,setSpeechConsent]=useState(false);
  const [transcript,setTranscript]=useState('');
  const transcriptRef=useRef('');
  const [error,setError]=useState('');
  const [reportId,setReportId]=useState<string|null>(null);
  const [retryBlob,setRetryBlob]=useState<Blob|null>(null);
  const uploadedRef=useRef(false);
  const aliveRef=useRef(true);

  const closeMedia=useCallback(()=>{
    if(clock.current!==null) {window.clearInterval(clock.current);clock.current=null;}
    speech.current?.stop();
    speech.current=null;
    stream.current?.getTracks().forEach(track=>track.stop());
    stream.current=null;
    if(video.current) video.current.srcObject=null;
  },[]);
  useEffect(()=>{aliveRef.current=true;return ()=>{aliveRef.current=false;if(recorder.current?.state==='recording')recorder.current.stop();closeMedia();};},[closeMedia]);

  async function upload(blob:Blob, duration:number) {
    const ticket=started.current;
    if(!ticket) {setError('Missing server upload ticket. Start again.');setPhase('ready');return;}
    setPhase('uploading');setError('');
    try {
      if(!uploadedRef.current){await uploadIntroduction(ticket.upload,blob);uploadedRef.current=true;}
      const saved=await completeIntroduction({
        id:ticket.id,durationSeconds:Math.max(1,Math.min(65,duration)),
        transcript:transcriptRef.current.trim().slice(0,4000)
      });
      if(saved.status!=='complete'||saved.id!==ticket.id)throw new Error('Report receipt did not match your interview.');
      setReportId(saved.id);setRetryBlob(null);setPhase('complete');
    } catch(cause) {
      setError(cause instanceof Error?cause.message:'The interview could not be saved. Retry upload.');
      setRetryBlob(blob);
      setPhase('ready');
    }
  }
  function stopRecording() {
    if(recorder.current?.state!=='recording') return;
    elapsed.current=Math.max(1,(Date.now()-recordStartedAt.current)/1000);
    setSeconds(Math.max(0,60-Math.round(elapsed.current)));
    recorder.current.stop();
    closeMedia();
  }
  const recordStartedAt=useRef(0);

  async function begin() {
    if(!consent || phase!=='ready') return;
    setError('');setPhase('preparing');setReportId(null);setRetryBlob(null);uploadedRef.current=false;
    try {
      if(!window.isSecureContext || !navigator.mediaDevices?.getUserMedia ||
         typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported('video/webm'))
        throw new Error('Camera and microphone with WebM recording require a compatible HTTPS browser.');
      const active=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
      stream.current=active;
      if(video.current) video.current.srcObject=active;
      const ticket=await startIntroduction();
      started.current=ticket;
      chunks.current=[];
      const media=new MediaRecorder(active,{mimeType:'video/webm'});
      recorder.current=media;
      media.ondataavailable=event=>{if(event.data.size)chunks.current.push(event.data);};
      media.onerror=()=>{setError('Recording was interrupted. Please try again.');};
      media.onstop=()=>{
        if(!aliveRef.current)return;
        const blob=new Blob(chunks.current,{type:'video/webm'});
        if(!blob.size){setError('Empty recording. Please record again.');setPhase('ready');return;}
        void upload(blob,elapsed.current);
      };
      setTranscript('');transcriptRef.current='';
      const browser=window as BrowserSpeech;
      const Speech=browser.SpeechRecognition||browser.webkitSpeechRecognition;
      if(Speech && speechConsent) {
        try {
          const listener=new Speech();
          listener.continuous=true;listener.interimResults=false;
          listener.onresult=event=>{
            let text='';
            for(let i=event.resultIndex;i<event.results.length;i++)text+=' '+(event.results[i][0]?.transcript||'');
            setTranscript(old=>{const next=(old+' '+text).trim().slice(0,4000);transcriptRef.current=next;return next;});
          };
          listener.onerror=()=>{};listener.start();speech.current=listener;
        } catch { /* speech-to-text is optional and is not a scoring source */ }
      }
      media.start(1000);
      recordStartedAt.current=Date.now();
      elapsed.current=0;
      setSeconds(60);setPhase('recording');
      clock.current=window.setInterval(()=>{
        const passed=(Date.now()-recordStartedAt.current)/1000;
        setSeconds(Math.max(0,60-Math.ceil(passed)));
        if(passed>=60)stopRecording();
      },250);
    } catch(cause) {
      closeMedia();setPhase('ready');
      setError(cause instanceof Error?cause.message:'Could not start the introduction recording.');
    }
  }

  return <main className="min-h-screen bg-ivory-50 px-4 py-10 text-ink-900">
    <div className="mx-auto max-w-2xl space-y-5 rounded-3xl border border-line bg-white p-6 sm:p-10">
      <p className="text-sm font-semibold text-terracotta-700">LanXgrow · Your first introduction</p>
      <h1 className="font-display text-3xl">Your 1-minute interview</h1>
      <p>Introduce yourself, explain your goal, and share one experience or interest. Your recording is saved privately after submission.</p>
      {!configured||!session ? <p role="status">{loading?'Checking Google session…':<>Please <Link to="/signin" className="underline">sign in with Google</Link> and complete learner enrollment.</>}</p>
      : <>
        {phase!=='complete'&&<div className="space-y-4">
          <p role="timer" className="text-3xl font-semibold tabular-nums">{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</p>
          <video ref={video} autoPlay playsInline muted aria-label="Your private camera preview"
            className="aspect-video w-full rounded-2xl bg-ink-900"/>
          {phase==='ready'&&<>
            <label className="flex gap-3 text-sm"><input type="checkbox" checked={consent}
              onChange={event=>setConsent(event.target.checked)}/>
              I consent to microphone/camera recording and private upload for my introduction report.
            </label>
            <label className="flex gap-3 text-sm"><input type="checkbox" checked={speechConsent}
              onChange={event=>setSpeechConsent(event.target.checked)}/>
              Optional: allow browser speech-to-text. Depending on your browser, recognition may use an external speech service; this is not required to record your interview.
            </label>
            <button type="button" disabled={!consent} onClick={()=>void begin()}
              className="min-h-12 rounded-xl bg-ink-900 px-6 text-white disabled:opacity-40">Start 60-second interview</button>
            {retryBlob&&<button type="button" className="ml-3 min-h-12 rounded-xl border px-4"
              onClick={()=>void upload(retryBlob,elapsed.current)}>Retry secure upload</button>}
          </>}
          {phase==='preparing'&&<p role="status">Checking camera and secure upload access…</p>}
          {phase==='recording'&&<>
            <p role="status">Recording in progress. The interview ends automatically at 60 seconds.</p>
            <button type="button" className="min-h-12 rounded-xl bg-ink-900 px-5 text-white"
              onClick={stopRecording}>Finish and save recording</button>
          </>}
          {phase==='uploading'&&<p role="status">Uploading your private recording and saving the report…</p>}
          <label className="block text-sm font-semibold">Optional transcript (browser-generated text can contain errors)
            <textarea value={transcript} onChange={e=>{setTranscript(e.target.value);transcriptRef.current=e.target.value;}} maxLength={4000}
              className="mt-2 min-h-24 w-full rounded-xl border p-3 font-normal"
              placeholder="Optional: correct the transcript, or leave blank. Your video is the original recording."
              disabled={phase==='uploading'}/>
          </label>
        </div>}
        {phase==='complete'&&<section role="status" className="space-y-4">
          <h2 className="font-display text-2xl">Your first report is saved</h2>
          <p>Report ID: <code className="break-all">{reportId}</code>. Reopen Reports after refresh or sign-in again to retrieve it from your account.</p>
          <button type="button" className="min-h-12 rounded-xl bg-ink-900 px-6 text-white"
            onClick={()=>navigate('/dashboard/'+started.current?.audience)}>Go to dashboard · Start guided tour →</button>
          <p className="text-xs">The current review measures recording delivery and available transcript length. AI speech, fluency and pronunciation scoring are not active.</p>
        </section>}
      </>}
      {error&&<p role="alert" className="rounded-xl border border-red-300 p-4 text-red-900">{error}</p>}
      <Link to="/get-started" className="inline-block underline">Back to Get Started</Link>
    </div>
  </main>;
}
