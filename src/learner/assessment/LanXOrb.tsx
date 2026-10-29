import {useEffect,useRef,useState} from 'react';
import './orb.css';

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
/** Lan-X artwork with independently rendered, depth-projected light paths. */
export default function LanXOrb({state='ready',compact=false,stream=null}:{state?:OrbState;compact?:boolean;stream?:MediaStream|null}){
 const canvas=useRef<HTMLCanvasElement>(null);const root=useRef<HTMLDivElement>(null);const latest=useRef(state);latest.current=state;const input=useOrbInput(state==='listening'?stream:null);const touch=useRef<Contact>({x:0,y:0,down:false});const [rendered,setRendered]=useState(false);
 useEffect(()=>{
  const node=canvas.current,container=root.current;if(!node||!container)return;const ctx=node.getContext('2d',{alpha:true});if(!ctx)return;
  let disposed=false,frame=0,visible=true,last=0,elapsed=0,size=0;let energy=0,x=0,y=0,press=0,velocity=0;const mode=[0,0,0,0];let lastState='';let dirty=true;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');const image=new Image();image.src='/images/assessment/orb.webp';let loaded=false;
  const resize=()=>{size=container.getBoundingClientRect().width;const pixels=Math.max(1,Math.round(Math.min(size*Math.min(window.devicePixelRatio||1,1.5),520)));if(node.width!==pixels){node.width=pixels;node.height=pixels;}dirty=true;};
  // Every path is projected from a tilted 3D circle; far-side segments are hidden.
  function path(time:number,tilt:number,turn:number,radius:number,strength:number){
   if(!ctx)return;const count=96,points:{x:number;y:number;z:number}[]=[];const a=tilt,b=turn;
   for(let i=0;i<=count;i++){const phase=i/count*Math.PI*2;const px=Math.cos(phase)*radius,py=Math.sin(phase)*radius;const z=py*Math.sin(a);const yy=py*Math.cos(a);const xx=px*Math.cos(b)+z*Math.sin(b);const zz=-px*Math.sin(b)+z*Math.cos(b);points.push({x:.5+xx,y:.48+yy,z:zz});}
   ctx.save();ctx.globalCompositeOperation='screen';
   for(let i=1;i<points.length;i++){const p=points[i],before=points[i-1];if(p.z<-.025&&radius<.36)continue;const phase=i/count*Math.PI*2;const glow=Math.pow(.5+.5*Math.cos(phase-time),8);const alpha=strength*(.12+glow*.65)*(p.z<0?.28:1);ctx.strokeStyle=`rgba(255,211,145,${alpha})`;ctx.lineWidth=.0014+glow*.0012;ctx.beginPath();ctx.moveTo(before.x,before.y);ctx.lineTo(p.x,p.y);ctx.stroke();}
   ctx.restore();
  }
  function paint(now:number){
   if(disposed)return;frame=requestAnimationFrame(paint);if(!visible||document.hidden){last=now;return;}if(now-last<32)return;const dt=Math.min((now-(last||now))/1000,.06);last=now;const current=latest.current;
   if(motion.matches&&!dirty&&lastState===current)return;dirty=false;lastState=current;
   if(!motion.matches)elapsed+=dt;const blend=1.-Math.exp(-dt*8);
   ['listening','thinking','speaking','connection'].forEach((name,i)=>{mode[i]+=(Number(current===name)-mode[i])*(motion.matches?1:blend);});
   energy+=(input.current-energy)*blend;const inputBucket=String(Math.round(energy*100));if(container!.dataset.orbInput!==inputBucket)container!.dataset.orbInput=inputBucket;x+=(touch.current.x-x)*blend;y+=(touch.current.y-y)*blend;
   const target=motion.matches?0:Number(touch.current.down);velocity+=((target-press)*140-velocity*19)*dt;press+=velocity*dt;
   if(!loaded||!size)return;const t=elapsed,listen=mode[0],think=mode[1],speak=mode[2],issue=mode[3];const level=motion.matches?0:energy;
   ctx!.setTransform(node!.width,0,0,node!.height,0,0);ctx!.clearRect(0,0,1,1);ctx!.save();
   ctx!.translate(.5+x*.012,.48-y*.009);const scale=1.-press*.035;ctx!.scale(scale,scale);ctx!.translate(-.5,-.48);
   ctx!.globalAlpha=1.-issue*.25;ctx!.drawImage(image,0,0,1,1);
   // Keep the central brand mark readable; refracted illumination flows around it.
   ctx!.save();ctx!.beginPath();ctx!.arc(.5,.48,.322,0,Math.PI*2);ctx!.clip();ctx!.globalCompositeOperation='screen';
   const activity=.14+listen*level*.5+think*.13+speak*.12;
   for(let i=0;i<3;i++){const angle=t*(.20+think*.18)+i*2.094;const gx=.5+Math.cos(angle)*.235,gy=.48+Math.sin(angle)*.245;const glow=ctx!.createRadialGradient(gx,gy,.004,gx,gy,.13+level*.035);glow.addColorStop(0,`rgba(255,211,153,${activity*(1.-issue)})`);glow.addColorStop(.32,`rgba(245,158,85,${activity*.5*(1.-issue)})`);glow.addColorStop(1,'rgba(245,158,85,0)');ctx!.fillStyle=glow;ctx!.fillRect(.15,.13,.7,.7);}
   ctx!.restore();
   const speed=t*(.28+think*.65+speak*.15);const strength=(.26+listen*level*.55+think*.2+speak*.14)*(1.-issue*.8);
   path(speed,1.05,.4+Math.sin(t*.13)*.24,.31,strength);path(-speed*.8,.8,2.1+Math.cos(t*.11)*.18,.30,strength*.65);
   path(speed*.7,1.23,.15,.368,strength*.5);
   // Narrow rim highlights respond to input without scaling the entire orb to a beat.
   ctx!.save();ctx!.globalCompositeOperation='screen';ctx!.beginPath();ctx!.ellipse(.5,.48,.324,.328,-.2,.85+Math.sin(t*.18)*.1,2.05+Math.sin(t*.18)*.1);ctx!.strokeStyle=`rgba(255,229,180,${.18+level*listen*.6})`;ctx!.lineWidth=.0018+level*.002;ctx!.stroke();ctx!.restore();
   ctx!.restore();
   // Feather the artwork background into the existing ivory page, without a hard box.
   ctx!.globalCompositeOperation='destination-in';const mask=ctx!.createRadialGradient(.5,.5,.31,.5,.5,.54);mask.addColorStop(0,'rgba(0,0,0,1)');mask.addColorStop(.55,'rgba(0,0,0,1)');mask.addColorStop(1,'rgba(0,0,0,0)');ctx!.fillStyle=mask;ctx!.fillRect(0,0,1,1);ctx!.globalCompositeOperation='source-over';
  }
  image.onload=()=>{if(disposed)return;loaded=true;dirty=true;setRendered(true);};image.onerror=()=>{if(!disposed)setRendered(false);};
  resize();if(image.complete&&image.naturalWidth){loaded=true;setRendered(true);}const observer=new ResizeObserver(resize);observer.observe(container);const intersection=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;dirty=true;});intersection.observe(container);frame=requestAnimationFrame(paint);
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();image.onload=null;image.onerror=null;};
 },[input]);
 return <div ref={root} className={`af-orb lx-orb ${compact?'af-orb--compact':''} ${rendered?'lx-orb--rendered':''}`} data-orb-state={state} role="img" aria-label={`Lan-X · ${names[state]}`} onPointerMove={event=>{const rect=event.currentTarget.getBoundingClientRect();touch.current.x=(event.clientX-rect.left)/rect.width*2-1;touch.current.y=1-(event.clientY-rect.top)/rect.height*2;}} onPointerDown={()=>{touch.current.down=true;}} onPointerUp={()=>{touch.current.down=false;}} onPointerCancel={()=>{touch.current={x:0,y:0,down:false};}} onPointerLeave={()=>{touch.current={x:0,y:0,down:false};}}><img className="lx-orb-fallback" src="/images/assessment/orb.webp" alt="" draggable={false}/><canvas ref={canvas} aria-hidden="true"/></div>;
}
