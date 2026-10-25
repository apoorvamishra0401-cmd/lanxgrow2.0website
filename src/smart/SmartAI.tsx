import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { persist, readStore, topics } from './model';
import type { AreaId, Mode, Store } from './model';
import type { CompanionState } from './Companion';
import Conversation from './Conversation';
import { getCurrentUser } from '@/lib/auth';
import { consumeTrial, trialUsed, TRIAL_LIMIT } from './trial';
import TrialInvite from './TrialInvite';
import SevenPillars from './SevenPillars';
import { OrbitalScene } from './MotionScenes';
import { MiniCourse, StoryPractice, WrittenPractice } from './Lessons';
import './smart.css';
const Companion=lazy(()=>import('./Companion'));
const Recorder=lazy(()=>import('./Recorder'));
const SpeechLab=lazy(()=>import('./SpeechLab'));
const modeTitles:Record<Exclude<Mode,null>,string>={talk:'A conversation, at your pace.',call:'Make the call. Find your words.',practice:'Shape a thought into a message.',video:'Your speaking rehearsal.',voice:'Make room for your voice.',course:'A little structure. A clearer message.',entertainment:'A story worth talking about.',dashboard:'Grow Decoder',onboarding:'Let’s make this yours.',accents:'Three accents. One conversation.'};
function Dialog({mode,onClose,children}:{mode:Exclude<Mode,null>;onClose:()=>void;children:React.ReactNode}){const dialog=useRef<HTMLDialogElement>(null);useEffect(()=>{const el=dialog.current;const previous=document.activeElement as HTMLElement|null;el?.showModal();return()=>{el?.close();previous?.focus();};},[]);return <dialog className="sx-dialog" ref={dialog} onCancel={event=>{event.preventDefault();onClose();}} aria-labelledby="sx-dialog-title"><div className="sx-dialog-top"><div><span className="sx-eyebrow">LanXgrow · Meet Lan-X</span><h2 id="sx-dialog-title">{modeTitles[mode]}</h2></div><button className="sx-close" type="button" aria-label="Close activity" onClick={onClose}>×</button></div><div className="sx-dialog-body">{children}</div></dialog>;}
export default function SmartAI(){
 usePageMeta('Meet our Lan-X AI','Explore LanXgrow SMART AI: a mobile-first, interactive English communication showcase.');
 const [store,setStore]=useState<Store>(readStore);const [storageError,setStorageError]=useState(false);const [mode,setMode]=useState<Mode>(null);const topic='Daily life';const [character,setCharacter]=useState<CompanionState>('idle');const [heroVisible,setHeroVisible]=useState(true);const [activeSeconds,setActiveSeconds]=useState(0);const [used,setUsed]=useState(trialUsed);const [signedIn,setSignedIn]=useState(false);const [gateOnEntry,setGateOnEntry]=useState(false);const hero=useRef<HTMLElement>(null);const lastInteraction=useRef(0);const animationReset=useRef<ReturnType<typeof setTimeout>>();
 useEffect(()=>{setStorageError(!persist(store));},[store]);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setHeroVisible(entry.isIntersecting),{threshold:.12});if(hero.current)observer.observe(hero.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{const timer=setInterval(()=>{if(mode&&mode!=='onboarding'&&mode!=='dashboard'&&document.visibilityState==='visible'&&Date.now()-lastInteraction.current<15000)setActiveSeconds(value=>{const next=Math.min(180,value+1);return next;});},1000);return()=>clearInterval(timer);},[mode]);
 useEffect(()=>()=>clearTimeout(animationReset.current),[]);
 const activity=useCallback(()=>{lastInteraction.current=Date.now();},[]);
 const speaking=useCallback((value:boolean)=>setCharacter(value?'speaking':'idle'),[]);
 const celebrate=()=>{setCharacter('encouragement');clearTimeout(animationReset.current);animationReset.current=setTimeout(()=>setCharacter('idle'),2200);};
 const save=(area:AreaId,words=0,seconds=0,kind='guided activity')=>{setStore(s=>({...s,attempts:[...s.attempts,{id:crypto.randomUUID(),area,topic,words,seconds,date:new Date().toISOString(),kind}].slice(-30)}));celebrate();};
 const open=(value:Mode)=>{setUsed(trialUsed());setGateOnEntry(Boolean((value==='talk'||value==='call')&&!signedIn&&trialUsed()>=TRIAL_LIMIT));setMode(value);setCharacter(value==='call'||value==='talk'?'listening':value?'thinking':'idle');};
 useEffect(()=>{let alive=true;void getCurrentUser().then(user=>{if(alive)setSignedIn(Boolean(user));}).catch(()=>{});const sync=()=>setUsed(trialUsed());window.addEventListener('storage',sync);window.addEventListener('focus',sync);return()=>{alive=false;window.removeEventListener('storage',sync);window.removeEventListener('focus',sync);};},[]);
 const consume=()=>{if(signedIn)return true;const allowed=consumeTrial();setUsed(trialUsed());return allowed;};
 return <div className="sx-page">
  <nav className="sx-page-tools sx-shell" aria-label="AI learning tools"><a href="#sx-journey">Our approach</a><a href="#sx-labs">Try the labs</a></nav>
  <main>
  <section className="sx-hero sx-shell" ref={hero}>
   <div className="sx-hero-copy"><p className="sx-eyebrow"><span className="sx-line"/>Intelligence with a human purpose</p><h1>Meet the intelligence <br/>behind your <em>growth.</em></h1><p className="sx-hero-body">Speak freely. Explore your potential.<br/>Grow through every conversation.</p><div className="sx-row sx-hero-actions"><button className="sx-primary" onClick={()=>open('talk')}>Meet Lan-X, your AI companion <span>↗</span></button><a className="sx-secondary" href="#sx-journey">Explore your journey <span>↓</span></a></div><p className="sx-small">Start with a guided demo. No account needed to explore.</p><div className="sx-hero-bottom"><span>Speak.<br/><b>With purpose.</b></span><span>Practise.<br/><b>Without judgement.</b></span><span>Grow.<br/><b>In your own way.</b></span></div></div>
   <div className="sx-character-scene"><OrbitalScene paused={Boolean(mode)}/><div className="sx-scene-grid" aria-hidden="true"/><div className="sx-character-label"><span className="sx-dot"/>LAN-X <span>Your communication companion</span></div><Suspense fallback={<div className="sx-loading" role="status">Lan-X is arriving…</div>}><Companion state={character} paused={Boolean(mode)}/></Suspense></div>
  </section>
  <SevenPillars open={open}/>
  <section className="sx-final sx-shell"><p className="sx-eyebrow">Your voice is worth the practice.</p><h2>A thought today.<br/>A clearer <em>voice tomorrow.</em></h2><p>Try a small activity. Find something to say.<br/>Take your next step with LanXgrow.</p><button className="sx-primary" onClick={()=>open('talk')}>Begin a guided conversation ↗</button><p className="sx-small">Three complimentary guided demo replies. Sign in to continue your journey.</p></section>
  </main>
  <footer className="sx-footer"><div className="sx-shell"><div className="sx-footer-top"><Link to="/">LanXgrow</Link><span>Speak Smart, Think Smart</span><div><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link><a href="mailto:official@lanxgrow.com">Email us ↗</a></div></div><img src="/images/brand/lanxgrow-footer-transparent.webp" alt="LanXgrow sculpted brand signature" loading="lazy"/><div className="sx-footer-bottom"><span>SMART AI · interactive learning showcase</span><span>Your practice. Your pace.</span></div></div></footer>
  {!heroVisible&&<div className="sx-dock"><button aria-label="Practise with Lan-X" onClick={()=>open('talk')}><span>⌁</span> Lan-X <small>Let’s practise</small></button></div>}
  {storageError&&<p className="sx-storage-notice" role="status">Your browser cannot save learning preferences.</p>}
  {mode&&<Dialog mode={mode} onClose={()=>open(null)}>{gateOnEntry?<TrialInvite/>:<>
   {(mode==='talk'||mode==='call')&&<Conversation remaining={signedIn?null:Math.max(0,TRIAL_LIMIT-used)} onConsume={consume} topic={topic} call={mode==='call'} difficulty={store.prefs.difficulty} activeSeconds={activeSeconds} onActivity={activity} onComplete={(words,seconds)=>save('call',words,seconds,mode==='call'?'scripted call rehearsal':'guided conversation')}/>}
   {mode==='practice'&&<WrittenPractice topic={topics[topic]||topic} seconds={activeSeconds} onActivity={activity} onComplete={(words,seconds)=>save('practice',words,seconds,'structured self-review')}/>}
   {mode==='course'&&<MiniCourse onActivity={activity} onComplete={()=>save('course',0,0,'three correct lesson checks')}/>}
   {mode==='entertainment'&&<StoryPractice seconds={activeSeconds} onActivity={activity} onComplete={(words,seconds)=>save('entertainment',words,seconds,'story comprehension and summary')}/>}
   {(mode==='video'||mode==='voice')&&<Suspense fallback={<p role="status">Preparing your local recorder…</p>}><Recorder onActivity={activity} video={mode==='video'} topic={topic} onComplete={seconds=>save(mode==='video'?'video':'practice',0,seconds,'local recording rehearsal')}/></Suspense>}
   {mode==='accents'&&<Suspense fallback={<p role="status">Preparing the listening lab…</p>}><SpeechLab onSpeaking={speaking} onActivity={activity}/></Suspense>}
  </>}</Dialog>}
 </div>;
}
