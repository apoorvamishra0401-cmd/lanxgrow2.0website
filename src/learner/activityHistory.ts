export const historyKey='lanxgrow.frontend.activity.v1';
export type Attempt={id:string;kind:string;startedAt:string;status:'started'|'ready'|'discarded'};
export function readAttempts():Attempt[]{try{const a=JSON.parse(localStorage.getItem(historyKey)||'[]');return Array.isArray(a)?a.filter(x=>typeof x.id==='string'&&typeof x.startedAt==='string').slice(-100):[];}catch{return [];}}
export function saveAttempt(a:Attempt){try{localStorage.setItem(historyKey,JSON.stringify([...readAttempts().filter(x=>x.id!==a.id),a].slice(-100)));}catch{/* preview remains usable without history */}}

// Local UI identifiers only; server session IDs will be issued by the backend.
export function previewId(){return typeof crypto.randomUUID==='function'?crypto.randomUUID():`preview-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;}
