// @ts-nocheck
/** Original interview storyboard, retained without altering its approved content. */
export function initializeInterviewStory(wrapper: ShadowRoot) {
const host=wrapper.querySelector('#interview-animation-root'); if(!host) return () => {};
 const root=host.attachShadow({mode:'open'});
 root.append(wrapper.querySelector('#interview-story-template').content.cloneNode(true));
 
const stages=[{mini:'Starting point',label:'The Interview',phase:'THE BEGINNING',title:'The first interview.<br>The first real challenge.',description:"A learner walks into an interview with ideas to share, but finds that confidence, clarity and the right words don't always arrive together.",eTitle:'An honest first attempt',eDesc:'Every journey needs a starting point.'},{mini:'Awareness',label:'The Mistakes',phase:'THE REALIZATION',title:'The mistakes become<br>a turning point.',description:'Instead of guessing what went wrong, the learner sees concrete examples of unclear answers, grammar slips and moments of hesitation.',eTitle:'Understand what needs work',eDesc:'Mistakes are examples, not labels or judgments.'},{mini:'Support',label:'AI Coaching',phase:'THE GUIDANCE',title:'Clear feedback.<br>Real chances to improve.',description:'AI explains mistakes in plain language, models stronger responses and helps the learner practise again. Each lesson connects to what happened in the interview.',eTitle:'Learn, practise, retry',eDesc:'From “I am agree” to “I agree”, with context.'},{mini:'Progress',label:'The Evolution',phase:'THE TRANSFORMATION',title:'Small improvements.<br>A stronger speaker.',description:'With repeated practice, the learner becomes clearer, more prepared and more confident. Progress is built through feedback and effort, not instant promises.',eTitle:'Confidence comes from practice',eDesc:'Growth shown here is illustrative, not a measured learner result.'},{mini:'Outcome',label:'The Breakthrough',phase:'THE POSSIBILITY',title:'Ready for the next<br>big opportunity.',description:'A new interview. Better answers. A calmer voice. With consistent preparation, that dream offer can become a real possibility.',eTitle:'A possible success story',eDesc:'Interview results depend on role, preparation and employer decisions.'}];
 const nav=root.querySelector('#stageNav'), graphics=[...root.querySelectorAll('.graphic')];
 const labels={meta:root.querySelector('#meta'),phase:root.querySelector('#phase'),title:root.querySelector('#title'),description:root.querySelector('#description'),eTitle:root.querySelector('#eTitle'),eDesc:root.querySelector('#eDesc'),counter:root.querySelector('#counter'),sceneNo:root.querySelector('#sceneNo'),progress:root.querySelector('#progress')};
 const section=wrapper.querySelector('#interview-story');
 let current=-1;
 function render(i){if(i===current)return;current=i;const s=stages[i];
  [...nav.children].forEach((b,j)=>{b.classList.toggle('active',j===i);b.setAttribute('aria-current',j===i?'step':'false')});
  graphics.forEach((g,j)=>{g.classList.toggle('active',j===i);g.setAttribute('aria-hidden',j===i?'false':'true')});
  labels.meta.textContent=`CHAPTER ${String(i+1).padStart(2,'0')}`;
  labels.phase.textContent=s.phase;labels.title.innerHTML=s.title;
  labels.description.textContent=s.description;labels.eTitle.textContent=s.eTitle;labels.eDesc.textContent=s.eDesc;
  labels.counter.textContent=labels.sceneNo.textContent=`${String(i+1).padStart(2,'0')} / 05`;
  labels.progress.style.width=`${(i+1)*20}%`;
 }
 stages.forEach((s,i)=>{const b=document.createElement('button');b.className='stage';b.type='button';b.innerHTML=`<span class="num">${String(i+1).padStart(2,'0')}</span><span><span class="stage-label">${s.label}</span><span class="stage-mini">${s.mini}</span></span>`;b.setAttribute('aria-label',`Go to stage ${i+1}: ${s.label}`);b.addEventListener('click',()=>{const offset=section.offsetTop+Math.max(0,section.offsetHeight-window.innerHeight)*i/4;window.scrollTo({top:offset,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});nav.append(b)});
 let ticking=false;
 function update(){ticking=false;const r=section.getBoundingClientRect();const travel=Math.max(1,section.offsetHeight-window.innerHeight+98);const p=Math.max(0,Math.min(1,-r.top/travel));const i=Math.min(4,Math.floor(p*5));render(i);wrapper.querySelector('#story-scroll-progress').style.height=`${(p*100).toFixed(2)}%`;}
 function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
 window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);render(0);update();
return () => { window.removeEventListener('scroll',onScroll); window.removeEventListener('resize',onScroll); };

}
