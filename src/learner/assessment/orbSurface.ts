/** Reusable software surface: no GPU, model, image texture or network required. */
export function createOrbSurface(size:number){
 const pixels=new Uint8ClampedArray(size*size*4);const geometry:{index:number;x:number;y:number;z:number;r:number;a:number;light:number;spec:number}[]=[];
 for(let row=0;row<size;row++)for(let col=0;col<size;col++){
  const x=(col+.5-size/2)/(size*.46),y=-(row+.5-size/2)/(size*.46),r=Math.hypot(x,y);if(r>1.045)continue;
  const z=Math.sqrt(Math.max(0,1-Math.min(1,r*r)));const light=.65+.35*Math.max(0,-x*.36+y*.44+z*.79);const half=Math.max(0,-x*.24+y*.28+z*.93);
  geometry.push({index:(row*size+col)*4,x,y,z,r,a:Math.atan2(y,x),light,spec:Math.pow(half,52)});
 }
 const smooth=(v:number)=>{const n=Math.min(1,Math.max(0,v));return n*n*(3-2*n);};
 function update(time:number,energy:number,attention:number,issue:number,lookX:number,lookY:number){
  const c=Math.cos(time*.18+lookX*.13),s=Math.sin(time*.18+lookX*.13);const deformation=.028+energy*.045+attention*.008;
  for(const p of geometry){
   const edge=1+deformation*(Math.sin(p.a*3+time*.9)+.4*Math.sin(p.a*5-time*.6));const alpha=smooth((edge-p.r)*size*.38);const i=p.index;
   if(alpha===0){pixels[i+3]=0;continue;}
   const x=c*p.x+s*p.z,y=p.y+lookY*.08,z=-s*p.x+c*p.z;
   const curl=Math.sin(x*3.3+y*2.2+time*.42)+.5*Math.sin(z*4.5-y*2.7-time*.36);
   const field=.5+.5*Math.sin(y*3.8+x*1.5+z*2.8+curl*1.8+time*.35);
   const secondary=.5+.5*Math.sin(x*3.2-y*3.6+z*2.6+time*.53);
   const ribbon=smooth((field-.47)*2.2);const silk=Math.pow(field,10);const dark=smooth((secondary-.55)*2.2)*.21;
   // Charcoal depth, terracotta folds and champagne reflected light.
   let red=(198+50*ribbon)*(1-dark),green=(144+90*ribbon)*(1-dark*.94),blue=(111+104*ribbon)*(1-dark*.85);
   const rim=Math.pow(1-p.z,3);const shine=p.spec*74+silk*(21+energy*34);const illumination=p.light;
   red=red*illumination+rim*53+shine;green=green*illumination+rim*48+shine*.94;blue=blue*illumination+rim*37+shine*.79;
   const grey=red*.3+green*.59+blue*.11;pixels[i]=red*(1-issue*.75)+grey*issue*.62;pixels[i+1]=green*(1-issue*.75)+grey*issue*.62;pixels[i+2]=blue*(1-issue*.75)+grey*issue*.62;pixels[i+3]=Math.round(alpha*255);
  }
  return pixels;
 }
 return {size,pixels,update};
}
