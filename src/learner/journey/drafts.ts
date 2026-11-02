// Store text only. Never persist raw recordings, signed URLs, tokens or audio paths.
export const DRAFT_LIFETIME=7*24*60*60*1000;
export type TextDraft={createdAt:number;expiresAt:number;revision:string;texts:Record<string,string[]>};
export function readTextDraft(raw:string|null,revision:string,now=Date.now()):TextDraft|null {
 try{const value=JSON.parse(raw||'null');
  if(!value||value.revision!==revision||!Number.isFinite(value.createdAt)||!Number.isFinite(value.expiresAt)||value.createdAt>now||value.expiresAt<=now||value.expiresAt-value.createdAt>DRAFT_LIFETIME||!value.texts||typeof value.texts!=='object'||Array.isArray(value.texts))return null;
  for(const values of Object.values(value.texts))if(!Array.isArray(values)||values.length>5||values.some(text=>typeof text!=='string'||text.length>12000))return null;
  return value;
 }catch{return null;}
}
export function textDraft(responses:Record<string,{text:string}[]|undefined>,revision:string,previous:TextDraft|null,now=Date.now()):TextDraft {
 const createdAt=previous?.createdAt||now;
 return {createdAt,expiresAt:createdAt+DRAFT_LIFETIME,revision,texts:Object.fromEntries(Object.entries(responses).map(([skill,answers])=>[skill,(answers||[]).map(a=>a.text)]))};
}
