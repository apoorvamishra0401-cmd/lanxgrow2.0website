import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './VersionBHero.css';

const skillCards = [
  { name: 'Listening', detail: 'Understand conversations, key ideas and everyday English.' },
  { name: 'Reading', detail: 'Recognise meaning and build comprehension with real contexts.' },
  { name: 'Writing', detail: 'Organise sentences, improve grammar and express ideas clearly.' },
  { name: 'Speaking', detail: 'Build fluency, pronunciation and confidence in conversation.' }
];
const questions = [
  'What is one thing you enjoy learning, and why?',
  'Tell us about a recent day that made you happy.',
  'When do you most want to speak English confidently?',
  'What is one goal you would like to achieve this year?'
];

export function VersionBHero() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [answer, setAnswer] = useState('');
  const [audience, setAudience] = useState<'student' | 'fresher' | 'professional'>('student');
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [skillActive, setSkillActive] = useState(0);
  const { search } = useLocation();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  function start() {
    setStep(0); setAnswer(''); setSecondsLeft(60);
    setStarted(false); setOpen(true);
  }
  useEffect(() => {
    if (!open || !started || step < 1 || step > questions.length) return;
    if (secondsLeft <= 0) {
      setStep(questions.length + 1);
      setStarted(false);
      return;
    }
    const timer = window.setTimeout(() => setSecondsLeft(value => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [open, started, step, secondsLeft]);
  useEffect(() => { const onStart = () => start(); window.addEventListener('lx-vb-start-intro',onStart); return () => window.removeEventListener('lx-vb-start-intro',onStart); }, []);
  useEffect(() => { if (new URLSearchParams(search).get('start') === 'intro') start(); }, [search]);
  function next() {
    if (step === 0) { setStarted(true); setStep(1); return; }
    setAnswer('');
    setStep(current => current + 1);
  }

  const displayName = name.trim() || 'there';
  return (
    <>
      <section className="lx-vb-hero" aria-labelledby="lx-vb-hero-title">
        <div className="lx-vb-hero-wash" aria-hidden="true"/>
        <div className="lx-vb-hero-shell">
          <div className="lx-vb-hero-copy">
            <p className="lx-vb-hero-kicker">AI ENGLISH SPEAKING PRACTICE · A CLEARER WAY TO GROW</p>
            <h1 id="lx-vb-hero-title"><span>Command</span><em>the room.</em></h1>
            <p className="lx-vb-hero-lead">Your English deserves more than a score. Explore a short conversation, discover the kind of personalized feedback LanXgrow is creating, and see how a focused practice plan can help you move forward.</p>
            <div className="lx-vb-hero-actions">
              <button type="button" onClick={start} className="lx-vb-primary">Try the free 1-minute introduction <span aria-hidden="true">↗</span></button>
              <a className="lx-vb-secondary" href="#personalized-report">See a personalized report <span aria-hidden="true">↓</span></a>
            </div>
            <div className="lx-vb-hero-notes"><span>One minute to begin</span><span>Personalized insights explained</span><span>Your next step, made clearer</span></div>
          </div>

          <div className="lx-vb-hero-visual" aria-label="Illustration of a personalized English feedback report">
            <div className="lx-vb-orb"><span>Lan-X</span><i aria-hidden="true"/></div>
            <span className="lx-vb-orb-tag lx-vb-orb-tag-left">Your voice matters.</span>
            <span className="lx-vb-orb-tag lx-vb-orb-tag-right">Your next step is personal.</span>
            <div className="lx-vb-hero-visual-bottom"><div className="lx-vb-wave" aria-hidden="true">{Array.from({length:13},(_,i)=><i key={i}/>)}</div><div><strong>Listen. Speak. Understand.</strong><small>Feedback that leads somewhere.</small></div><a href="#personalized-report" aria-label="Explore example reports">↗</a></div>
          </div>
        </div>
      </section>
      <section className="lx-vb-skill-band" aria-labelledby="lx-vb-skills">
        <div className="lx-vb-skill-band-inner"><div><span>FOUR SKILLS · ONE CONNECTED JOURNEY</span><h2 id="lx-vb-skills">Every skill has <em>its moment.</em></h2></div>
          <div className="lx-vb-skill-grid">{skillCards.map((skill,index)=><button key={skill.name} type="button" aria-pressed={skillActive===index} onMouseEnter={()=>setSkillActive(index)} onFocus={()=>setSkillActive(index)} onClick={()=>setSkillActive(index)}><small>0{index+1}</small><strong>{skill.name}</strong><span className="lx-vb-skill-detail">{skill.detail}</span><span aria-hidden="true" className="lx-vb-skill-arrow">↗</span></button>)}</div>
        </div>
      </section>

      <dialog ref={dialog} className="lx-vb-intro-dialog" onClose={()=>setOpen(false)} aria-labelledby="lx-vb-intro-title">
        <div className="lx-vb-intro-head"><span>LANXGROW · YOUR FIRST CONVERSATION</span><button type="button" aria-label="Close introduction" onClick={()=>setOpen(false)}>×</button></div>
        {step===0 ? <div className="lx-vb-intro-content">
          <h2 id="lx-vb-intro-title">One conversation.<br/><em>A meaningful beginning.</em></h2>
          <p>Tell us a little about your goal. Answer up to four short questions in one minute. One sentence is enough. Your answers stay on this page until you choose to continue.</p>
          <label htmlFor="lx-vb-intro-name">Your first name <small>(optional)</small></label>
          <input id="lx-vb-intro-name" autoComplete="given-name" maxLength={60} value={name} onChange={event=>setName(event.target.value)} placeholder="What should Lan-X call you?"/>
          <label htmlFor="lx-vb-intro-goal">What would you like to improve? <small>(optional)</small></label>
          <select id="lx-vb-intro-goal" value={goal} onChange={event=>setGoal(event.target.value)}>
            <option value="">Choose a learning goal</option><option>Everyday English confidence</option><option>Job interview preparation</option><option>Workplace communication</option><option>College and presentations</option>
          </select>
          <label htmlFor="lx-vb-intro-audience">I am a</label>
          <select id="lx-vb-intro-audience" value={audience} onChange={event=>setAudience(event.target.value as typeof audience)}>
            <option value="student">Student</option><option value="fresher">Fresher</option><option value="professional">Working professional</option>
          </select>
          <button className="lx-vb-primary" onClick={next}>Begin my introduction <span>↗</span></button>
        </div> : step<=questions.length ? <div className="lx-vb-intro-content">
          <p className="lx-vb-intro-step">QUESTION {step} OF {questions.length} · {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')} REMAINING</p>
          <progress value={60-secondsLeft} max={60} aria-label="Introduction time elapsed" style={{width:'100%',accentColor:'#b85c38'}} />
          <h2 id="lx-vb-intro-title">{step===1?'Hello, '+displayName+'.':'Thank you, '+displayName+'.'}</h2>
          <p>{questions[step-1]}</p>
          <label htmlFor="lx-vb-answer">Your answer</label>
          <textarea id="lx-vb-answer" rows={4} maxLength={1200} value={answer} onChange={event=>setAnswer(event.target.value)} placeholder="Write how you would answer in a conversation…" />
          <p className="lx-vb-intro-hint">One sentence is enough. You may move on without answering. The introduction finishes when the minute ends.</p>
          <button className="lx-vb-primary" onClick={next}>{step===questions.length?'Finish introduction':'Next question'} <span>↗</span></button>
        </div> : <div className="lx-vb-intro-content">
          <p className="lx-vb-intro-step">INTRODUCTION COMPLETE</p>
          <h2 id="lx-vb-intro-title">Well done, {displayName}.</h2>
          <p>You've completed your first minute. Continue to discover how personalized English feedback can highlight grammar, pronunciation, fluency, vocabulary, speaking pace and your next practice priorities.</p>
          <p className="lx-vb-intro-hint">Continue with Google to access your English feedback when your introduction has been securely connected to your account.</p>
          <Link to="/get-started" onClick={()=>setOpen(false)} className="lx-vb-primary">Continue with Google to get the report <span>↗</span></Link>
          <a href="#personalized-report" className="lx-vb-intro-link" onClick={()=>setOpen(false)}>See what an English report includes →</a>
        </div>}
      </dialog>
    </>
  );
}
