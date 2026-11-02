import {useState} from 'react';
import type {Answer,JourneySession,Skill,SkillInsight} from './domain';
import {responseIssue,wordCount,minimumWritingWords} from './domain';
import {practiceRequest} from './api';
import AudioResponse from './AudioResponse';
export default function ImprovementAttempt({session,skill,index,review,insight,onSaved}:{session:JourneySession;skill:Skill;index:number;review:boolean;insight?:SkillInsight;onSaved:(session:JourneySession)=>void}){
 const original=session.responses[skill]?.[index];
 const [open,setOpen]=useState(false),[answer,setAnswer]=useState<Answer>({text:''}),[busy,setBusy]=useState(false),[audioBusy,setAudioBusy]=useState(false),[error,setError]=useState('');
 if(!original)return null;
 if(original.improvement)return <aside className="pj-focus"><h3>Your improvement attempt</h3>{original.improvement.text&&<p>{original.improvement.text}</p>}<p className="pj-quiet">Your first response is kept above. {original.improvement.audioPath?'Your revised recording is saved. ':''}This attempt does not use another daily session. Updated feedback is pending review.</p></aside>;
 // A retry is useful only after evidence-based feedback. Do not invent feedback to unlock it.
 if(!insight)return <p className="pj-quiet">One improvement attempt will be available after your feedback is ready. Your first response will be kept.</p>;
 async function submit(){if(busy||audioBusy||responseIssue(skill,answer,session.day_index))return;setBusy(true);setError('');try{
  let saved:JourneySession;
  if(review){const values=[...(session.responses[skill]||[])];values[index]={...original!,improvement:{...answer,submittedAt:new Date().toISOString()}};saved={...session,responses:{...session.responses,[skill]:values}};}
  else saved=(await practiceRequest<{session:JourneySession}>({action:'improve',id:session.id,revision:session.updated_at,skill,index,answer})).session;
  onSaved(saved);setOpen(false);
 }catch(cause){setError(cause instanceof Error?cause.message:'Could not save your improvement. Your first response is safe.');}finally{setBusy(false);}}
 return <section className="pj-improvement">{!open?<button className="pj-secondary" onClick={()=>setOpen(true)}>Improve this response</button>:<><h3>One more try, in your own words</h3><p className="pj-quiet">Use your feedback to try again. Your original response stays unchanged. No new daily session is used.</p>{skill==='writing'||skill==='listening'?<label className="pj-field">Your revised response<textarea disabled={busy} maxLength={12000} value={answer.text} onChange={e=>setAnswer({...answer,text:e.target.value})}/><span className="pj-quiet">{wordCount(answer.text)} words{skill==='writing'?` · ${minimumWritingWords(session.day_index)} minimum`:''}</span></label>:<AudioResponse sessionId={session.id} path={answer.audioPath} review={review} onSaved={audioPath=>setAnswer({...answer,audioPath})} onBusy={setAudioBusy}/>}<p className="pj-quiet">{responseIssue(skill,answer,session.day_index)}</p><button className="pj-primary" disabled={busy||audioBusy||Boolean(responseIssue(skill,answer,session.day_index))} onClick={()=>void submit()}>{busy?'Saving…':'Submit my improvement'}</button><button className="pj-text-button" disabled={busy||audioBusy} onClick={()=>setOpen(false)}>Keep my first response</button></>}{error&&<p role="alert" className="pj-error">{error}</p>}</section>;
}
