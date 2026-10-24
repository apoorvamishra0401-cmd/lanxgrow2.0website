import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import './RealConversations.css';

const moments = [
  { label: 'School', audience: 'Class XI–XII', heading: 'An idea worth sharing.', setting: 'A classroom discussion', prompt: 'Explain a topic you care about. What makes it important to you?', example: 'I’m interested in how technology changes the way we learn. One example is…', focus: ['Build an explanation', 'Choose useful words', 'Speak in complete thoughts'] },
  { label: 'College', audience: 'Undergraduate & postgraduate', heading: 'Make your thinking visible.', setting: 'A project presentation', prompt: 'Introduce your project, explain your approach and describe what you learned.', example: 'Our project explores a practical problem. My role was to investigate…', focus: ['Structure your ideas', 'Explain your contribution', 'Handle a follow-up'] },
  { label: 'First job', audience: 'Freshers & job seekers', heading: 'More than a rehearsed answer.', setting: 'An interview introduction', prompt: 'Tell someone who you are, what you have worked on and what you want to learn next.', example: 'I recently completed my degree in… During my final project, I learned how to…', focus: ['Introduce yourself clearly', 'Use specific examples', 'Connect experience to goals'] },
  { label: 'At work', audience: 'Professionals across domains', heading: 'Move the conversation forward.', setting: 'A team update', prompt: 'Share what is complete, what is blocked and what you need from the team.', example: 'The first stage is complete. We’re waiting on one decision before we can…', focus: ['Give a concise update', 'Ask a clear question', 'Confirm the next step'] },
];

export function RealConversations() {
  const [selected, setSelected] = useState(0);
  const moment = moments[selected];
  return <section className="conversation-section" aria-labelledby="conversation-heading"><div className="lx-container">
    <Reveal className="conversation-top"><div><p className="research-eyebrow">English for the moments that matter</p><h2 id="conversation-heading">Practise for your next<br/>real conversation.</h2></div><p>Different goals. Different situations.<br/>Start with a moment that feels like yours.</p></Reveal>
    <div className="conversation-selector" aria-label="Choose your learning context">{moments.map((item,index)=><button key={item.label} type="button" aria-pressed={index===selected} aria-controls="conversation-example" onClick={()=>setSelected(index)}>{item.label}<span aria-hidden="true">↗</span></button>)}</div>
    <div className="conversation-layout" id="conversation-example">
      <div className="conversation-details" key={moment.label}><p className="conversation-audience">{moment.audience}</p><h3>{moment.heading}</h3><p>{moment.prompt}</p><ul>{moment.focus.map(item=><li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul><Button to="/get-started" withArrow>Get started</Button></div>
      <div className="conversation-board"><div className="conversation-board-top"><span className="conversation-light" aria-hidden="true"/>A practice idea<span>0{selected+1} / 04</span></div><div className="conversation-paper" key={moment.setting}><span className="conversation-quote" aria-hidden="true">“</span><p className="conversation-setting">{moment.setting}</p><p className="conversation-example">{moment.example}</p><div className="conversation-lines" aria-hidden="true"><span/><span/><span/></div><p className="conversation-note">A starting prompt. Make the words your own.</p></div><p className="conversation-board-foot">Illustrative prompts · not a live assessment</p></div>
    </div>
  </div></section>;
}
