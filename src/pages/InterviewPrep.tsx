import { usePageMeta } from '@/hooks/usePageMeta';
import './InterviewPrep.css';

const stages = [
  {number:'01', title:'Begin with your story', copy:'Start with a short introduction. Tell Lan-X about your goals and where English matters in your life.'},
  {number:'02', title:'Practise a real conversation', copy:'Work through thoughtful questions for a first job or your professional experience.'},
  {number:'03', title:'Understand your next step', copy:'Explore the skills that shape communication: clarity, listening, vocabulary and confident expression.'}
];
const skills = [
  {name:'Speaking', detail:'Explain your ideas with structure, clarity and confidence.'},
  {name:'Listening', detail:'Follow questions, context and the intent behind a conversation.'},
  {name:'Reading', detail:'Understand the language used in work, study and daily life.'},
  {name:'Writing', detail:'Make your message clear, purposeful and easy to understand.'}
];

export default function InterviewPrep() {
  usePageMeta('Interview Preparation', 'Interview preparation and English communication practice for freshers and working professionals.');
  return <div className="lx-ip">
    <section className="lx-ip-hero" aria-labelledby="lx-ip-title">
      <div className="lx-ip-intro">
        <p className="lx-ip-kicker">LANXGROW · INTERVIEW PREPARATION</p>
        <h1 id="lx-ip-title">The interview begins <em>with your voice.</em></h1>
        <p className="lx-ip-lead">Find the words for your ideas. Learn how to introduce yourself, communicate your strengths and respond with greater confidence — one conversation at a time.</p>
        <a className="lx-ip-cta" href="/?interview=1">Try the free 1-minute interview <span aria-hidden="true">↗</span></a>
        <p className="lx-ip-subline">For freshers and working professionals · No account needed for the introduction</p>
      </div>
      <div className="lx-ip-art" aria-label="Lan-X conversation illustration">
        <span className="lx-ip-orbit" aria-hidden="true"/>
        <div className="lx-ip-orb">Lan-X</div>
        <p className="lx-ip-bubble lx-ip-bubble-a">Tell me about yourself.</p>
        <p className="lx-ip-bubble lx-ip-bubble-b">Every answer begins somewhere.</p>
      </div>
    </section>
    <section className="lx-ip-section" aria-labelledby="lx-ip-process">
      <div className="lx-ip-heading"><p className="lx-ip-kicker">HOW IT WORKS</p><h2 id="lx-ip-process">A natural way to <em>find your words.</em></h2></div>
      <div className="lx-ip-steps">{stages.map(stage=><article key={stage.number}><span>{stage.number}</span><h3>{stage.title}</h3><p>{stage.copy}</p></article>)}</div>
    </section>
    <section className="lx-ip-section lx-ip-skills" aria-labelledby="lx-ip-skills-heading">
      <div className="lx-ip-heading"><p className="lx-ip-kicker">CONNECTED COMMUNICATION</p><h2 id="lx-ip-skills-heading">Four skills. <em>One stronger voice.</em></h2></div>
      <div className="lx-ip-skills-grid">{skills.map((skill,index)=><article key={skill.name}><span>0{index+1}</span><h3>{skill.name}</h3><p>{skill.detail}</p></article>)}</div>
    </section>
    <section className="lx-ip-final"><p className="lx-ip-kicker">YOUR FIRST STEP</p><h2>One minute can start a new conversation.</h2><p>Begin with a few questions tailored to your learning goal. Complete the introduction before deciding how to continue.</p><a className="lx-ip-cta" href="/?interview=1">Try the free 1-minute interview <span aria-hidden="true">↗</span></a></section>
  </div>;
}

