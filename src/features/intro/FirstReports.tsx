import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { getIntroductionReport, listIntroductionReports,
  type IntroductionReport } from '@/features/intro/api';

export default function FirstReports() {
  const {session,configured,loading}=useAuthSession();
  const [reports,setReports]=useState<IntroductionReport[]>([]);
  const [selected,setSelected]=useState<IntroductionReport|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  useEffect(()=>{
    let active=true;
    setReports([]);setSelected(null);setError('');
    if(!session?.userId)return;
    setBusy(true);
    void listIntroductionReports().then(data=>{
      if(active) setReports(data.filter(item=>item.status==='complete'));
    }).catch(cause=>{
      if(active)setError(cause instanceof Error?cause.message:'Cannot read your reports.');
    }).finally(()=>{if(active)setBusy(false);});
    return ()=>{active=false;};
  },[session?.userId]);
  async function open(id:string) {
    setError('');setBusy(true);setSelected(null);
    try {
      const report=await getIntroductionReport(id);
      if(report.id!==id || report.status!=='complete')throw new Error('Report ownership could not be confirmed.');
      setSelected(report);
    } catch(cause){setError(cause instanceof Error?cause.message:'Report lookup failed.');}
    finally {setBusy(false);}
  }
  return <section className="lx-role-workspace" aria-labelledby="first-report-heading">
    <h2 id="first-report-heading">My Interview Reports</h2>
    {!configured||!session ? <p role="status">{loading?'Checking your account…':
      <>Your saved reports require <Link to="/signin">Google sign in</Link>.</>}</p> : <>
      {busy&&<p role="status">Reading your private saved reports…</p>}
      {!busy&&!reports.length&&!error&&<p role="status">Your first 1-minute interview report is not saved yet. Record and submit the introduction to create it.</p>}
      <Link className="lx-role-link" to="/intro-interview">{reports.length?'Record another 1-minute introduction':'Start your 1-minute introduction'}</Link>
      {reports.length>0&&<ul className="space-y-3">
        {reports.map(item=><li key={item.id} className="rounded-xl border p-4">
          <strong>1-minute introduction</strong> · Saved {new Date(item.updatedAt).toLocaleDateString()}
          <button type="button" className="ml-3 underline" disabled={busy}
            onClick={()=>void open(item.id)}>Open my report</button>
        </li>)}
      </ul>}
      {selected&&<article className="space-y-3 rounded-xl border p-5" aria-label="Saved introduction report">
        <h3 className="font-semibold">Your first introduction report</h3>
        <p>Saved on {new Date(selected.updatedAt).toLocaleString()}</p>
        <p>Recording: {selected.feedback.recordingReceived?'Uploaded privately':'Not confirmed'}</p>
        <p>Transcript words: {selected.feedback.transcriptWords??'Unavailable'}</p>
        <h4 className="font-semibold">Evidence-based observations</h4>
        <ul>{selected.feedback.observations?.map((item,i)=><li key={i}>{item}</li>)}</ul>
        {selected.feedback.structureChecklist?.length ? <><h4 className="font-semibold">Transcript structure (text only)</h4><ul>{selected.feedback.structureChecklist.map(item=><li key={item.item}>{item.found?'✓':'○'} {item.item}</li>)}</ul></> : null}
        <h4 className="font-semibold">Try next</h4>
        <ul>{selected.feedback.suggestedNextSteps?.map((item,i)=><li key={i}>{item}</li>)}</ul>
        {selected.transcript&&<details><summary>Available transcript (not verified against speech)</summary>
          <p className="whitespace-pre-wrap break-words">{selected.transcript}</p></details>}
        <p className="text-sm">{selected.feedback.limitations}</p>
      </article>}
      {error&&<p role="alert">{error} <button type="button" className="underline"
        onClick={()=>{setError('');setBusy(true);void listIntroductionReports().then(setReports).catch(()=>setError('Unable to retry report lookup.')).finally(()=>setBusy(false));}}>Retry</button></p>}
    </>}
  </section>;
}
