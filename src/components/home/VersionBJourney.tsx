import { useState } from 'react';
import './VersionBJourney.css';

type Path = 'student' | 'career';
const cards: Record<Path, {title:string; description:string}[]> = {
  student:[
    {title:'Begin with a short conversation',description:'Explore the one-minute English introduction to see what the learning journey could feel like.'},
    {title:'Save your personalized report',description:'The intended app flow lets you continue with a secure account to access and keep your feedback.'},
    {title:'Explore the four core skills',description:'Listening, Reading, Writing and Speaking each support a different part of English communication.'},
    {title:'Let your next plan take shape',description:'A separate formal assessment is designed to deepen the picture and guide what to practise next.'}
  ],
  career:[
    {title:'Start with your story',description:'Use the one-minute introduction to begin reflecting on how you communicate in interviews and at work.'},
    {title:'Keep your feedback together',description:'The intended app journey securely connects your report and recommendations to your learning history.'},
    {title:'Build a deeper picture',description:'One free ten-minute personalized interview and a separate free twenty-minute four-skill assessment are planned.'},
    {title:'Practise what matters most',description:'An AI-guided plan is designed to recommend the next skill activity from completed work and feedback.'}
  ]
};
export function VersionBJourney(){
  const [path,setPath]=useState<Path>('student');
  const begin=()=>window.dispatchEvent(new Event('lx-vb-start-intro'));
  return <section className="lx-vb-journey" id="journey" aria-labelledby="lx-vb-journey-title"><div className="lx-vb-journey-shell">
    <div className="lx-vb-journey-head"><div><p>YOUR JOURNEY / 05</p><h2 id="lx-vb-journey-title">A better first step.<br/><em>A clearer way forward.</em></h2></div><span>Explore the route designed for your goals. Choose a path to see what comes after your first conversation.</span></div>
    <div className="lx-vb-journey-switch" role="group" aria-label="Select your starting point"><button type="button" aria-pressed={path==='student'} onClick={()=>setPath('student')}>For students <span aria-hidden="true">↗</span></button><button type="button" aria-pressed={path==='career'} onClick={()=>setPath('career')}>For freshers &amp; professionals <span aria-hidden="true">↗</span></button></div>
    <div className="lx-vb-journey-grid" aria-live="polite">{cards[path].map((card,i)=><article key={card.title}><span>0{i+1}</span><h3>{card.title}</h3><p>{card.description}</p></article>)}</div>
    <div className="lx-vb-journey-actions"><button type="button" onClick={begin}>Explore the free one-minute introduction <span aria-hidden="true">↗</span></button></div>
    <p className="lx-vb-journey-note">Your learning path is designed to connect the introduction, detailed feedback, four-skill assessment and personalised next-step guidance. Availability and eligibility are shown when you continue.</p>
  </div></section>;
}
