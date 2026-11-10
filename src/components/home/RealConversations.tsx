import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import './RealConversations.css';

const moments = [
  { label: 'College', audience: 'Undergraduate & postgraduate', heading: 'Make your thinking visible.', setting: 'A project presentation', prompt: 'Introduce your project, explain your approach and describe what you learned.', example: 'Our project explores a practical problem. My role was to investigate…', focus: ['Structure your ideas', 'Explain your contribution', 'Handle a follow-up'] },
  { label: 'First job', audience: 'Freshers & job seekers', heading: 'More than a rehearsed answer.', setting: 'An interview introduction', prompt: 'Tell someone who you are, what you have worked on and what you want to learn next.', example: 'I recently completed my degree in… During my final project, I learned how to…', focus: ['Introduce yourself clearly', 'Use specific examples', 'Connect experience to goals'] },
  { label: 'At work', audience: 'Professionals across domains', heading: 'Move the conversation forward.', setting: 'A team update', prompt: 'Share what is complete, what is blocked and what you need from the team.', example: 'The first stage is complete. We’re waiting on one decision before we can…', focus: ['Give a concise update', 'Ask a clear question', 'Confirm the next step'] },
];

export function RealConversations() {
  const [selected, setSelected] = useState(0);
  const track = useRef<HTMLElement>(null);
  const swipe = useRef<{ x:number; y:number } | null>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!window.matchMedia('(min-width: 768px) and (min-height: 820px)').matches || !track.current) return;
      const rect = track.current.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.max(0, Math.min(0.9999, -rect.top / travel));
      if (rect.top <= 0 && rect.bottom >= window.innerHeight) setSelected(Math.floor(progress * moments.length));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll',schedule); window.removeEventListener('resize',schedule); };
  }, []);
  const select = (index: number) => {
    setSelected(index);
    if (!track.current || !window.matchMedia('(min-width: 768px) and (min-height: 820px)').matches) return;
    const origin = window.scrollY + track.current.getBoundingClientRect().top;
    const travel = Math.max(1, track.current.offsetHeight - window.innerHeight);
    window.scrollTo({top:origin+travel*((index+.45)/moments.length), behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  };
  const moment = moments[selected];
  return <section ref={track} className="conversation-section lx-vb-conversation-scroll" aria-labelledby="conversation-heading"><div className="lx-container">
    <Reveal className="conversation-top"><div><p className="research-eyebrow">English for the moments that matter</p><h2 id="conversation-heading">Practise for your next<br/>real conversation.</h2></div><p>Different goals. Different situations.<br/>Start with a moment that feels like yours.</p></Reveal>
    <div className="conversation-selector" aria-label="Choose your learning context">{moments.map((item,index)=><button key={item.label} type="button" aria-pressed={index===selected} aria-controls="conversation-example" onClick={()=>select(index)}>{item.label}<span aria-hidden="true">↗</span></button>)}</div>
    <div className="conversation-layout" id="conversation-example" onTouchStart={event=>{const touch=event.touches[0];if(touch)swipe.current={x:touch.clientX,y:touch.clientY};}} onTouchEnd={event=>{const touch=event.changedTouches[0];const start=swipe.current;swipe.current=null;if(!touch||!start)return;const dx=touch.clientX-start.x,dy=touch.clientY-start.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5){setSelected(i=>Math.max(0,Math.min(moments.length-1,i+(dx<0?1:-1))));}}}>
      <div className="conversation-details" key={moment.label}><p className="conversation-audience">{moment.audience}</p><h3>{moment.heading}</h3><p>{moment.prompt}</p><ul>{moment.focus.map(item=><li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul><Button to="/?start=intro" withArrow>Try free 1-minute interview</Button></div>
      <div className="conversation-board"><div className="conversation-board-top"><span className="conversation-light" aria-hidden="true"/>A practice idea<span>0{selected+1} / 03</span></div><div className="conversation-paper" key={moment.setting}><span className="conversation-quote" aria-hidden="true">“</span><p className="conversation-setting">{moment.setting}</p><p className="conversation-example">{moment.example}</p><div className="conversation-lines" aria-hidden="true"><span/><span/><span/></div><p className="conversation-note">A starting prompt. Make the words your own.</p></div><p className="conversation-board-foot">Illustrative prompts · not a live assessment</p></div>
    </div>
  </div></section>;
}
