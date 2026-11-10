import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './PersonalizedReport.css';

type Skill = { label: string; score: number };
type Example = {
  name: string; context: string; level: string; portrait: string; opening: string;
  strengths: string[]; improvements: string[]; sample: string; better: string;
  plan: string[]; skills: Skill[];
};

const examples: Example[] = [
  {
    name: 'Rahul', context: 'Preparing for a first job interview', level: 'B1', portrait: 'R',
    opening: 'Your ideas are clear. A few changes could help your answers flow more naturally.',
    strengths: ['Clear introductions', 'Relevant examples', 'Good willingness to elaborate'],
    improvements: ['Use consistent past tense when describing projects', 'Connect shorter sentences into one clear answer'],
    sample: 'I am working on this project last year.',
    better: 'I worked on this project last year.',
    plan: ['Speaking · Tell a project story in the past tense', 'Writing · Connect an idea with because, although and therefore'],
    skills: [{label:'Grammar',score:68},{label:'Fluency',score:73},{label:'Pronunciation',score:76},{label:'Vocabulary',score:71},{label:'Pace',score:78},{label:'Conversation flow',score:70}]
  },
  {
    name: 'Priya', context: 'Building everyday English confidence', level: 'A2', portrait: 'P',
    opening: 'You can communicate familiar ideas. Your next step is to make each sentence more complete.',
    strengths: ['Understands familiar questions', 'Useful everyday vocabulary', 'Steady speaking rhythm'],
    improvements: ['Practise complete sentences with a subject and verb', 'Use short connecting words to explain your reasons'],
    sample: 'Yesterday I go market and buy book.',
    better: 'Yesterday I went to the market and bought a book.',
    plan: ['Speaking · Describe yesterday in three complete sentences', 'Listening · Notice common past-tense verbs in short conversations'],
    skills: [{label:'Grammar',score:51},{label:'Fluency',score:60},{label:'Pronunciation',score:64},{label:'Vocabulary',score:58},{label:'Pace',score:67},{label:'Conversation flow',score:56}]
  },
  {
    name: 'Aisha', context: 'Developing workplace communication', level: 'B2', portrait: 'A',
    opening: 'You explain ideas confidently. More precise language can make complex answers even stronger.',
    strengths: ['Well-organised explanations', 'Flexible vocabulary', 'Comfortable conversational pace'],
    improvements: ['Replace general terms with precise workplace language', 'Lead with the main recommendation, then add supporting detail'],
    sample: 'We did many things to make it better.',
    better: 'We streamlined the process to reduce delays and improve consistency.',
    plan: ['Speaking · Lead a recommendation with one clear outcome', 'Writing · Summarise a decision and its supporting evidence'],
    skills: [{label:'Grammar',score:82},{label:'Fluency',score:86},{label:'Pronunciation',score:80},{label:'Vocabulary',score:84},{label:'Pace',score:85},{label:'Conversation flow',score:88}]
  }
];

const levels = ['A1','A2','B1','B2','C1','C2'];

export function PersonalizedReport() {
  const [selected, setSelected] = useState(0);
  const showcase = useRef<HTMLElement>(null);
  const lastScroll = useRef<number | null>(null);
  const manualSelectionUntil = useRef(0);
  const chooseExample = (index: number) => {
    manualSelectionUntil.current = Date.now() + 5000;
    setSelected(index);
  };

  useEffect(() => {
    let queued = false;
    const update = () => {
      queued = false;
      const el = showcase.current;
      if (!el || Date.now() < manualSelectionUntil.current) return;
      const current = window.scrollY;
      if (lastScroll.current !== null && Math.abs(lastScroll.current - current) < 4) return;
      lastScroll.current = current;
      const bounds = el.getBoundingClientRect();
      const distance = Math.max(1, el.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(0.9999, -bounds.top / distance));
      if (bounds.top <= 0 && bounds.bottom >= window.innerHeight) setSelected(Math.min(2, Math.floor(progress * 3)));
    };
    const onScroll = () => { if (!queued) { queued = true; window.requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const example = examples[selected];
  return (
    <section className="lx-vb-report-scroll" ref={showcase} id="personalized-report" aria-labelledby="lx-report-title">
      <div className="lx-vb-report-sticky">
        <div className="lx-vb-report-heading">
          <div>
            <p className="lx-vb-kicker">DISCOVER YOUR ENGLISH STRENGTHS / 01</p>
            <h2 id="lx-report-title">Your English has a story.<br /><em>See what it could tell you.</em></h2>
          </div>
          <p>Discover what an individual English feedback report could look like: strengths, areas for improvement, example corrections and a practical next step.</p>
        </div>

        <div className="lx-vb-report-selector" role="tablist" aria-label="Explore example English reports">
          {examples.map((person, i) => (
            <button type="button" key={person.name} role="tab" id={'lx-vb-report-tab-'+i} aria-selected={selected===i} aria-controls="lx-vb-report-panel" tabIndex={selected===i?0:-1}
              onClick={()=>chooseExample(i)}
              onKeyDown={event=>{
                if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
                event.preventDefault();
                const nextIndex = event.key==='Home' ? 0 : event.key==='End' ? examples.length-1 : (i + (event.key==='ArrowRight'?1:-1) + examples.length) % examples.length;
                chooseExample(nextIndex);
                document.getElementById('lx-vb-report-tab-'+nextIndex)?.focus();
              }} className={selected===i?'is-current':''}>
              <span className="lx-vb-report-avatar" aria-hidden="true">{person.portrait}</span>
              <span><strong>{person.name}</strong><small>{person.context}</small></span>
              <span aria-hidden="true" className="lx-vb-report-arrow">↗</span>
            </button>
          ))}
        </div>

        <div className="lx-vb-report-paper" id="lx-vb-report-panel" role="tabpanel" aria-labelledby={'lx-vb-report-tab-'+selected} key={example.name}>
          <div className="lx-vb-report-paper-top">
            <div><span>LANXGROW · PERSONALIZED ENGLISH FEEDBACK</span><h3>{example.name}'s English snapshot</h3><p>{example.opening}</p></div>
            <div className="lx-vb-level"><small>CEFR reference level</small><strong>{example.level}</strong><span>Illustrative</span></div>
          </div>

          <div className="lx-vb-report-bars" aria-label="Illustrative skill breakdown">
            {example.skills.map(skill=> <div className="lx-vb-report-bar" key={skill.label}>
              <div><span>{skill.label}</span><strong>{skill.score}<small>/100</small></strong></div>
              <div className="lx-vb-progress" aria-hidden="true"><span style={{width:skill.score+'%'}} /></div>
            </div>)}
          </div>

          <div className="lx-vb-report-detail">
            <div><h4>What is working well</h4><ul>{example.strengths.map(item=><li key={item}>{item}</li>)}</ul></div>
            <div><h4>Where to focus next</h4><ul>{example.improvements.map(item=><li key={item}>{item}</li>)}</ul></div>
          </div>
          <div className="lx-vb-report-correction"><span>ONE EXAMPLE OF A CLEARER SENTENCE</span><p className="lx-vb-was">“{example.sample}”</p><p className="lx-vb-better">“{example.better}”</p></div>
          <div className="lx-vb-report-plan"><div><span>YOUR NEXT PRACTICE PLAN</span><h4>Small steps, chosen for your next goal.</h4></div><ol>{example.plan.map(item=><li key={item}>{item}</li>)}</ol></div>
        </div>
        <p className="lx-vb-report-disclaimer">These are fictional examples. Scores and CEFR levels are illustrative—not a certified English assessment or results from a live AI service.</p>
        <div className="lx-vb-report-bottom"><p>Six CEFR levels · <strong>{levels.join(' · ')}</strong><br/><small>The CEFR describes language proficiency across listening, reading, speaking and writing.</small></p><a href="https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors" target="_blank" rel="noreferrer">About the CEFR framework ↗</a></div>
        <div className="lx-vb-report-cta"><Link to="/get-started">Explore your English journey <span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>
  );
}
