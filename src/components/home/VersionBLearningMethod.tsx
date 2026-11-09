import { useEffect, useRef, useState } from 'react';
import './VersionBLearningMethod.css';

const stages = [
  {name:'Assess', eyebrow:'START WITH A CLEARER PICTURE', title:'Know where you stand.', copy:'A short introduction begins the journey. The longer four-skill assessment is designed to build a more complete picture of English proficiency.', symbol:'◎'},
  {name:'Learn', eyebrow:'FOLLOW A RELEVANT NEXT STEP', title:'Learn what matters next.', copy:'An AI-guided plan is designed to select your next skill activity, based on completed practice and assessment results.', symbol:'✧'},
  {name:'Practise', eyebrow:'MAKE THE TOPIC YOURS', title:'Practice with purpose.', copy:'Work on the skill assigned by the learning plan. Choose an appropriate topic within the activity, then build confidence one attempt at a time.', symbol:'↗'},
  {name:'Feedback', eyebrow:'UNDERSTAND THE WHY', title:'See what can improve.', copy:'Feedback is designed to explain strengths, common mistakes and practical ways to improve—not just a number.', symbol:'✦'},
  {name:'Improve', eyebrow:'EACH SESSION SHAPES THE NEXT', title:'Grow with every step.', copy:'After each completed activity, the learning plan is designed to update its priorities, helping you focus on the skills that need attention.', symbol:'∞'}
];

export function VersionBLearningMethod() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const el=section.current;
      if(!el||window.matchMedia('(max-height: 610px)').matches)return;
      const rect=el.getBoundingClientRect();
      const travel=Math.max(1,rect.height-window.innerHeight);
      const progress=Math.max(0,Math.min(.99999,-rect.top/travel));
      if(rect.top<=0&&rect.bottom>=window.innerHeight) setActive(Math.floor(progress*stages.length));
    };
    const onScroll=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}};
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll);
    onScroll();
    return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll)};
  },[]);
  const go=(index:number)=>{
    setActive(index);
    const el=section.current;
    if(!el||window.matchMedia('(max-height: 610px)').matches)return;
    const top=window.scrollY+el.getBoundingClientRect().top;
    const travel=Math.max(1,el.offsetHeight-window.innerHeight);
    window.scrollTo({top:top+travel*((index+.45)/stages.length),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  };
  const stage=stages[active];
  return <section className="lx-vb-method-scroll" id="learning-method" ref={section} aria-labelledby="lx-vb-method-title">
    <div className="lx-vb-method-sticky">
      <div className="lx-vb-method-intro"><div><p>OUR LEARNING METHOD / 03</p><h2 id="lx-vb-method-title">Small steps.<br/><em>Lasting progress.</em></h2></div>
      <span>Follow the five connected stages. Scroll to see how your learning can move from a starting point to a more focused plan.</span></div>
      <div className="lx-vb-method-content">
        <div className="lx-vb-method-list" role="tablist" aria-label="Our five learning stages">
          {stages.map((item,i)=><button key={item.name} type="button" role="tab" aria-selected={i===active} aria-controls="lx-vb-method-display" className={i===active?'is-current':''} onClick={()=>go(i)}
            onKeyDown={e=>{if(e.key==='ArrowDown'||e.key==='ArrowRight'||e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();const nodes=Array.from(e.currentTarget.parentElement?.querySelectorAll('button')||[]);const next=(i+((e.key==='ArrowDown'||e.key==='ArrowRight')?1:-1)+stages.length)%stages.length;nodes[next]?.focus();go(next)}}}>
            <small>0{i+1}</small><strong>{item.name}</strong><span aria-hidden="true">↗</span>
          </button>)}
        </div>
        <div className="lx-vb-method-display" id="lx-vb-method-display" role="tabpanel" aria-label={stage.name+' learning stage'}>
          <div className="lx-vb-method-top"><span>THE LANXGROW CYCLE</span><span>0{active+1} / 05</span></div>
          <div className="lx-vb-method-symbol" key={stage.symbol} aria-hidden="true">{stage.symbol}</div>
          <div className="lx-vb-method-bottom" aria-live="polite"><span>{stage.eyebrow}</span><h3>{stage.title}</h3><p>{stage.copy}</p></div>
        </div>
      </div>
    </div>
  </section>;
}
