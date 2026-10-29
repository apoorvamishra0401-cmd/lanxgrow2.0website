import {useEffect,useRef,useState} from 'react';
import './orb.css';
import {createOrbSurface} from './orbSurface';

export type OrbState='ready'|'listening'|'thinking'|'speaking'|'connection';
const names:Record<OrbState,string>={ready:'Ready',listening:'Listening',thinking:'Thinking',speaking:'Speaking',connection:'Connection issue'};

// Input is measured only from a stream the learner explicitly activated.
// The analyser has no speaker destination and sends no audio over the network.
export function useOrbInput(stream:MediaStream|null){
 const level=useRef(0);
 useEffect(()=>{
  level.current=0;if(!stream)return;
  let context:AudioContext|undefined;let frame=0;let disposed=false;
  try{
   context=new AudioContext();const source=context.createMediaStreamSource(stream);const analyser=context.createAnalyser();analyser.fftSize=512;source.connect(analyser);const samples=new Float32Array(analyser.fftSize);
   const measure=()=>{if(disposed)return;analyser.getFloatTimeDomainData(samples);let sum=0;for(const sample of samples)sum+=sample*sample;const rms=Math.sqrt(sum/samples.length);const target=Math.min(1,Math.max(0,rms-.002)*14);level.current+=(target-level.current)*(target>level.current?.4:.12);frame=requestAnimationFrame(measure);};
   void context.resume().catch(()=>{});measure();
   return()=>{disposed=true;cancelAnimationFrame(frame);level.current=0;source.disconnect();analyser.disconnect();void context?.close().catch(()=>{});};
  }catch{void context?.close().catch(()=>{});return()=>{disposed=true;cancelAnimationFrame(frame);level.current=0;};}
 },[stream]);
 return level;
}

type Contact={x:number;y:number;down:boolean};
/** A live generated surface, with the original Lan-X mark embedded in its centre. */
export default function LanXOrb({state='ready',compact=false,stream=null}:{state?:OrbState;compact?:boolean;stream?:MediaStream|null}){
 const canvas=useRef<HTMLCanvasElement>(null),root=useRef<HTMLDivElement>(null);const latest=useRef(state);latest.current=state;const input=useOrbInput(state==='listening'?stream:null);const touch=useRef<Contact>({x:0,y:0,down:false});const [rendered,setRendered]=useState(false);
 useEffect(()=>{
  const node=canvas.current,container=root.current;if(!node||!container)return;const ctx=node.getContext('2d',{alpha:true});if(!ctx)return;
  const surface=createOrbSurface(compact?80:window.matchMedia('(max-width: 600px)').matches?144:200),texture=document.createElement('canvas');texture.width=surface.size;texture.height=surface.size;const brush=texture.getContext('2d');if(!brush)return;const bitmap=brush.createImageData(surface.size,surface.size);
  let disposed=false,frame=0,visible=true,last=0,elapsed=0,size=0,first=true,dirty=true;let energy=0,x=0,y=0,press=0,velocity=0,phase=0;const mode=[0,0,0,0];let lastState='';
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');const mark=new Image();mark.src='/images/assessment/official-logo.webp';mark.onload=()=>{dirty=true;};
  const resize=()=>{size=container.getBoundingClientRect().width;const pixels=Math.max(1,Math.round(Math.min(size*Math.min(window.devicePixelRatio||1,1.5),520)));if(node.width!==pixels){node.width=pixels;node.height=pixels;}dirty=true;};
  const paint=(now:number)=>{
   if(disposed)return;frame=requestAnimationFrame(paint);if(!visible||document.hidden){last=now;return;}if(now-last<40)return;const dt=Math.min((now-(last||now))/1000,.07);last=now;const current=latest.current;
   if(motion.matches&&!dirty&&lastState===current)return;dirty=false;lastState=current;const blend=1-Math.exp(-dt*9);
   ['listening','thinking','speaking','connection'].forEach((name,i)=>{mode[i]+=(Number(current===name)-mode[i])*(motion.matches?1:blend);});
   energy+=(input.current-energy)*blend;const bucket=String(Math.round(energy*100));if(container.dataset.orbInput!==bucket)container.dataset.orbInput=bucket;
   x+=(touch.current.x-x)*blend;y+=(touch.current.y-y)*blend;const target=motion.matches?0:Number(touch.current.down);velocity+=((target-press)*135-velocity*18)*dt;press+=velocity*dt;
   const [listen,think,speak,issue]=mode,signal=motion.matches?0:energy*listen;
   if(!motion.matches){elapsed+=dt;phase+=dt*(.55+think*.65+speak*.30+signal*.8)*(1-issue*.85);}
   surface.update(phase,signal,think+speak*.7,issue,x,y);bitmap.data.set(surface.pixels);brush.putImageData(bitmap,0,0);
   ctx.setTransform(node.width,0,0,node.height,0,0);ctx.clearRect(0,0,1,1);
   const cx=.5+(motion.matches?0:x*.022),cy=.47+(motion.matches?0:y*-.014+Math.sin(elapsed*.7)*.004),radius=.36;
   // A quiet halo and broad contact shadow, rather than satellites or racing rings.
   const halo=ctx.createRadialGradient(cx,cy,.18,cx,cy,.43);halo.addColorStop(0,'rgba(215,161,95,.13)');halo.addColorStop(1,'rgba(215,161,95,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,1,1);
   ctx.save();ctx.translate(.5,.86);ctx.scale(1,.15);const shadow=ctx.createRadialGradient(0,0,0,0,0,.25);shadow.addColorStop(0,`rgba(92,58,33,${.15+press*.04})`);shadow.addColorStop(1,'rgba(92,58,33,0)');ctx.fillStyle=shadow;ctx.fillRect(-.3,-.3,.6,.6);ctx.restore();
   const squash=motion.matches?0:press*.055;ctx.save();ctx.translate(cx,cy);ctx.scale(1+squash*.45,1-squash);ctx.imageSmoothingEnabled=true;ctx.drawImage(texture,-radius,-radius,radius*2,radius*2);
   // The brand is its own layer; the surrounding surface is not an animated picture.
   if(mark.complete&&mark.naturalWidth){const badge=.105;ctx.save();ctx.globalAlpha=.82;ctx.globalCompositeOperation='screen';ctx.translate(x*.004,-y*.004);ctx.drawImage(mark,mark.naturalWidth*.28,mark.naturalHeight*.28,mark.naturalWidth*.44,mark.naturalHeight*.44,-badge/2,-badge/2,badge,badge);ctx.restore();}
   ctx.restore();
   if(first){first=false;setRendered(true);}
  };
  resize();const observer=new ResizeObserver(resize);observer.observe(container);const intersection=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;dirty=true;});intersection.observe(container);frame=requestAnimationFrame(paint);
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();mark.onload=null;};
 },[input,compact]);
 return <div ref={root} className={`af-orb lx-orb ${compact?'af-orb--compact':''} ${rendered?'lx-orb--rendered':''}`} data-orb-state={state} data-orb-renderer="generated-surface" role="img" aria-label={`Lan-X · ${names[state]}`} onPointerMove={event=>{const rect=event.currentTarget.getBoundingClientRect();touch.current.x=(event.clientX-rect.left)/rect.width*2-1;touch.current.y=1-(event.clientY-rect.top)/rect.height*2;}} onPointerDown={()=>{touch.current.down=true;}} onPointerUp={()=>{touch.current.down=false;}} onPointerCancel={()=>{touch.current={x:0,y:0,down:false};}} onPointerLeave={()=>{touch.current={x:0,y:0,down:false};}}><img className="lx-orb-fallback" src="/images/assessment/orb.webp" alt="" draggable={false}/><canvas ref={canvas} aria-hidden="true"/></div>;
}
