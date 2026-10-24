import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import './LearningEcosystem.css';

const features = [
  { name: 'Call', detail: 'Make space for a real conversation.', icon: 'chat' },
  { name: 'Practice', detail: 'Small steps. Stronger communication.', icon: 'mic' },
  { name: 'Video Assessment', detail: 'See how you express your ideas.', icon: 'camera' },
  { name: 'English Pro Course', detail: 'Give your learning a clear direction.', icon: 'book' },
  { name: 'Learn & Entertainment', detail: 'Discover English through what you love.', icon: 'headphones' },
  { name: 'Dashboard', detail: 'Bring your learning progress together.', icon: 'chart' },
];

function Symbol({ kind }: { kind: string }) {
  if (kind === 'chat') return <><path d="M-51-37q0-16 16-16h47q16 0 16 16v25q0 16-16 16H-9l-20 16 3-16h-9q-16 0-16-16Z" fill="var(--eco-cream)" stroke="#cdb79c" strokeWidth="2"/><path d="M-11-19q0-12 12-12h42q12 0 12 12V2q0 12-12 12h-8l4 14-20-14H1Q-11 14-11 2Z" fill="var(--eco-clay)" stroke="#995331" strokeWidth="2"/><g fill="#f8eddb">{[5,22,39].map(x=><circle key={x} cx={x} cy="-8" r="4"/>)}</g><g fill="#ae6742">{[-33,-15,3].map(x=><circle key={x} cx={x} cy="-30" r="4"/>)}</g></>;
  if (kind === 'mic') return <><g stroke="#bb7d55" strokeWidth="4" strokeLinecap="round">{[-55,-44,-33,33,44,55].map((x,i)=><path className="eco-wave" key={x} d={`M${x} ${-38-(i%3)*6}v${12+(i%3)*12}`} style={{animationDelay:`${i*.13}s`}}/>)}</g><path d="M0 1v27m-22 1h44M-26-28v10a26 26 0 0 0 52 0v-10" fill="none" stroke="#c18a62" strokeWidth="7" strokeLinecap="round"/><rect x="-18" y="-69" width="36" height="63" rx="18" fill="var(--eco-dark)" stroke="#76604a" strokeWidth="2"/><path d="M-10-54v28" stroke="#fff8e3" strokeOpacity=".17" strokeWidth="3" strokeLinecap="round"/></>;
  if (kind === 'camera') return <><path d="M-48-40h21l7-11H7l8 11h24q12 0 12 12V9q0 12-12 12h-77q-12 0-12-12v-37q0-12 12-12Z" fill="var(--eco-dark)" stroke="#b88a62" strokeWidth="4"/><path d="M51-18l20-12V18L51 6Z" fill="var(--eco-clay)" stroke="#9d6240" strokeWidth="2"/><circle cx="0" cy="-10" r="26" fill="var(--eco-clay)" stroke="#ead4b3" strokeWidth="5"/><path d="M-7-24l23 14L-7 4Z" fill="#fff1d6"/><rect x="-14" y="-48" width="24" height="5" rx="2" fill="#ce9164"/></>;
  if (kind === 'book') return <><path d="M-59-26Q-28-31 0-6q28-25 59-20L53 28Q25 20 0 38q-25-18-53-10Z" fill="#a85735" stroke="#864329" strokeWidth="3"/><path d="M-54-34Q-28-41 0-13q28-28 54-21L49 19Q23 14 0 30q-23-16-49-11Z" fill="#dfc7a7"/><path d="M-47-44Q-24-42 0-19q24-23 47-25l-3 53Q20 12 0 29q-20-17-44-20Z" fill="var(--eco-cream)" stroke="#d0b591" strokeWidth="2"/><path d="M0-19v47" stroke="#bc9871" strokeWidth="2"/><path d="M10-16l24-14M10-5l23-13M-10-16l-24-14M-10-5l-23-13" stroke="#bda889" strokeWidth="2" opacity=".5"/></>;
  if (kind === 'headphones') return <><path d="M-45-1v-16a45 45 0 0 1 90 0v16" fill="none" stroke="#302a24" strokeWidth="14"/><path d="M-43-20a43 43 0 0 1 86 0" fill="none" stroke="#bc8963" strokeWidth="5"/><rect x="-54" y="-14" width="20" height="43" rx="9" fill="var(--eco-dark)" stroke="#bd8e68" strokeWidth="3"/><rect x="34" y="-14" width="20" height="43" rx="9" fill="var(--eco-dark)" stroke="#bd8e68" strokeWidth="3"/><circle cx="0" cy="7" r="28" fill="var(--eco-clay)" stroke="#e9cfab" strokeWidth="3"/><path d="M-7-8L15 7-7 22Z" fill="#fff1d6"/></>;
  return <><path d="M-55 25l23 7V-5l-23-7Z" fill="#a45b36"/><path d="M-32 32l14-8V-13l-14 8Z" fill="#7e422b"/><path d="M-55-12l14-8 23 7-14 8Z" fill="#cc8760"/><path d="M-12 32l24 7v-63l-24-7Z" fill="#d29d6d"/><path d="M12 39l14-9v-63l-14 9Z" fill="#b17c50"/><path d="M-12-31l14-9 24 7-14 9Z" fill="#ebc69b"/><path d="M32 39l24 7v-89l-24-7Z" fill="#e8ceaa"/><path d="M56 46l14-9v-89l-14 9Z" fill="#c5a078"/><path d="M32-50l14-9 24 7-14 9Z" fill="#f7e6cc"/><path d="M-58-34Q-9-44 47-76m-16-2 19-2-5 19" fill="none" stroke="#a9603c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/></>;
}

function Scene({ compact, active, select, pause, resume, uid }: { compact: boolean; active: number; select: (i: number) => void; pause: () => void; resume: () => void; uid: string }) {
  const positions = compact ? [[140,150],[460,150],[490,410],[460,680],[140,680],[110,410]] : [[330,155],[870,155],[1030,365],[870,575],[330,575],[170,365]];
  const center = compact ? [300,410] : [600,365];
  const prefix = `${uid}-${compact ? 'small' : 'wide'}`;
  const keyboard = (event: KeyboardEvent<SVGGElement>, i: number) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(i); } };
  return <svg className={`eco-scene ${compact ? 'eco-small' : 'eco-wide'}`} viewBox={compact ? '0 0 600 800' : '0 0 1200 690'} aria-label="Interactive LanXgrow learning ecosystem">
    <defs>
      <linearGradient id={`${prefix}-cream`} x2=".7" y2="1"><stop stopColor="#fff9ec"/><stop offset=".5" stopColor="#ead8bd"/><stop offset="1" stopColor="#c7a47f"/></linearGradient>
      <linearGradient id={`${prefix}-clay`} x2="1" y2="1"><stop stopColor="#dc9e70"/><stop offset=".45" stopColor="#b76b42"/><stop offset="1" stopColor="#87482d"/></linearGradient>
      <linearGradient id={`${prefix}-dark`} x2="1" y2="1"><stop stopColor="#51473c"/><stop offset=".45" stopColor="#302a24"/><stop offset="1" stopColor="#1e1b18"/></linearGradient>
      <linearGradient id={`${prefix}-edge`} x2="0" y2="1"><stop stopColor="#ead3b2"/><stop offset=".5" stopColor="#bc8254"/><stop offset=".7" stopColor="#fae5c8"/><stop offset="1" stopColor="#ba8a60"/></linearGradient>
      <radialGradient id={`${prefix}-top`}><stop stopColor="#fffcf3"/><stop offset="1" stopColor="#ebddc9"/></radialGradient>
      <radialGradient id={`${prefix}-pulse`}><stop stopColor="#fffdf0"/><stop offset=".25" stopColor="#ffe8a9"/><stop offset=".6" stopColor="#d89553" stopOpacity=".6"/><stop offset="1" stopColor="#d89553" stopOpacity="0"/></radialGradient>
      <filter id={`${prefix}-shadow`} x="-50%" y="-50%" width="200%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>
      <filter id={`${prefix}-glow`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <g style={{'--eco-cream': `url(#${prefix}-cream)`, '--eco-clay': `url(#${prefix}-clay)`, '--eco-dark': `url(#${prefix}-dark)`} as CSSProperties}>
      {positions.map(([x,y],i)=>{const [cx,cy]=center;const path=`M${cx} ${cy+12} C${(cx+x)/2} ${cy+12},${(cx+x)/2} ${y+22},${x} ${y+22}`;return <g key={`path${i}`} className={active===i?'eco-connection is-lit':'eco-connection'} aria-hidden="true"><path d={path} fill="none" stroke="#967453" strokeWidth="13" opacity=".12" transform="translate(0 8)"/><path d={path} fill="none" stroke="#c89d76" strokeWidth="10"/><path d={path} fill="none" stroke="#f7e8cf" strokeWidth="6"/><path className="eco-path-glow" d={path} fill="none" stroke="#db9c5e" strokeWidth="12" filter={`url(#${prefix}-glow)`}/><path className="eco-travel" d={path} pathLength="100" fill="none" stroke="#fff4c8" strokeWidth="5" strokeLinecap="round"/><circle className="eco-end-light" cx={x+(cx-x)*.2} cy={y+22} r="22" fill={`url(#${prefix}-pulse)`}/></g>;})}
      {positions.map(([x,y],i)=><g key={features[i].name} transform={`translate(${x} ${y})`} className={`eco-node ${active===i?'is-active':''}`} role="button" tabIndex={0} aria-label={`${features[i].name}: ${features[i].detail}`} aria-pressed={active===i} onPointerEnter={event=>{if(event.pointerType==='mouse'){pause();select(i);}}} onPointerLeave={resume} onFocus={()=>{pause();select(i);}} onBlur={resume} onClick={()=>select(i)} onKeyDown={event=>keyboard(event,i)}>
        <title>{features[i].name}</title><rect className="eco-hit" x="-89" y="-100" width="178" height="175" rx="30" fill="transparent"/>
        <ellipse cx="0" cy="45" rx="85" ry="22" fill="#68513b" opacity=".18" filter={`url(#${prefix}-shadow)`}/>
        <path d="M-83 14v15a83 30 0 0 0 166 0V14Z" fill={`url(#${prefix}-edge)`}/><ellipse cy="14" rx="83" ry="30" fill={`url(#${prefix}-top)`} stroke="#ebd9c0" strokeWidth="2"/><path d="M-79 26a79 25 0 0 0 158 0" fill="none" stroke="#a96b43" strokeWidth="2" opacity=".7"/>
        <ellipse className="eco-node-halo" cy="14" rx="86" ry="32" fill="none" stroke="#d99e6c" strokeWidth="2"/>
        <g className="eco-symbol" transform="translate(0 -27)"><g className="eco-symbol-float"><Symbol kind={features[i].icon}/></g></g>
        <text y="76" textAnchor="middle" className="eco-svg-label">{features[i].name}</text>
      </g>)}
      <g transform={`translate(${center[0]} ${center[1]})`} aria-hidden="true">
        <ellipse cy="66" rx="130" ry="31" fill="#68513b" opacity=".18" filter={`url(#${prefix}-shadow)`}/>
        <path d="M-120 26v23a120 43 0 0 0 240 0V26Z" fill={`url(#${prefix}-edge)`}/><ellipse cy="26" rx="120" ry="43" fill={`url(#${prefix}-top)`} stroke="#f2e4d0" strokeWidth="3"/><path d="M-113 44a113 35 0 0 0 226 0" fill="none" stroke="#af734c" strokeWidth="2"/>
        <g className="eco-core-float"><rect x="-81" y="-139" width="170" height="169" rx="44" fill="#715f4b"/><rect x="-87" y="-145" width="170" height="169" rx="44" fill={`url(#${prefix}-dark)`} stroke="#74614d" strokeWidth="1.5"/><path d="M-78-104q0-32 32-32h84" fill="none" stroke="#d0b08a" opacity=".22" strokeWidth="2"/>
          <path d="M-29-94v58h25" stroke="#251d16" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(2 3)"/><path d="M-29-94v58h25" stroke="#fff0d6" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M30-94L9-65l21 29" stroke="#251d16" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(2 3)"/><path d="M30-94L9-65l21 29" stroke="#cb8056" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </g>
        <ellipse className="eco-core-ring" cy="26" rx="111" ry="37" fill="none" stroke="#f5c48e" strokeWidth="2"/>
      </g>
    </g>
  </svg>;
}

export function LearningEcosystem() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const section = useRef<HTMLElement>(null);
  const interacted = useRef(0);
  const uid = useId().replace(/:/g,'');
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15});if(section.current)observer.observe(section.current);return()=>observer.disconnect();},[]);
  useEffect(()=>{if(paused||interacting||!visible||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=window.setInterval(()=>{if(document.hidden||Date.now()-interacted.current<6500)return;setActive(i=>(i+1)%features.length);},3200);return()=>window.clearInterval(timer);},[paused,interacting,visible]);
  const select = (i:number)=>{interacted.current=Date.now();setActive(i);};
  const sceneProps={active,select,pause:()=>setInteracting(true),resume:()=>setInteracting(false),uid};
  const reactToPointer = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty('--eco-light-x', `${x*100}%`);
    event.currentTarget.style.setProperty('--eco-light-y', `${y*100}%`);
    event.currentTarget.style.setProperty('--eco-tilt-x', `${(y-.5)*-2}deg`);
    event.currentTarget.style.setProperty('--eco-tilt-y', `${(x-.5)*2}deg`);
  };
  const resetPointer = () => { section.current?.style.setProperty('--eco-tilt-x','0deg'); section.current?.style.setProperty('--eco-tilt-y','0deg'); };
  return <section onPointerMove={reactToPointer} onPointerLeave={resetPointer} id="experience" ref={section} className={`learning-ecosystem ${visible&&!paused&&!interacting?'is-playing':''}`} aria-labelledby="ecosystem-heading">
    <div className="lx-container eco-heading"><p className="eco-eyebrow">The LanXgrow connection</p><h2 id="ecosystem-heading">Every part of learning.<br className="sm:hidden"/> Connected.</h2><p>One space to speak, practise, discover and grow.</p></div>
    <div className="eco-canvas"><Scene compact={false} {...sceneProps}/><Scene compact {...sceneProps}/></div>
    <div className="lx-container eco-bottom"><div className="eco-feature-status"><span className="eco-status-dot" aria-hidden="true"/><div><p className="eco-active-name">{features[active].name}</p><p className="eco-active-detail">{features[active].detail}</p></div><button type="button" className="eco-pause" onClick={()=>setPaused(p=>!p)} aria-label={paused?'Play feature animation':'Pause feature animation'}>{paused?'Play':'Pause'}<span aria-hidden="true">{paused?' ▷':' Ⅱ'}</span></button></div><p className="eco-instruction">Select a feature to explore the connection.</p></div>
  </section>;
}
