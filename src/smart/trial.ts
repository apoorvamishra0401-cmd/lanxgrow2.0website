/** Persistent browser allowance. Never trust this value as a paid/API quota. */
export const TRIAL_LIMIT=3;
const KEY='lanxgrow.lanx.trial.v1';
const COOKIE='lanx_trial_v1';
const valid=(value:string|null|undefined)=>{const n=Number(value);return value!=null&&/^\d+$/.test(value)?Math.min(TRIAL_LIMIT,Math.max(0,n)):0;};
export function trialUsed():number{let count=0;try{count=valid(localStorage.getItem(KEY));}catch{/* cookie fallback */}try{const saved=document.cookie.split('; ').find(x=>x.startsWith(COOKIE+'='))?.split('=')[1];count=Math.max(count,valid(saved));}catch{/* non-browser tests */}return count;}
export function consumeTrial():boolean{const count=trialUsed();if(count>=TRIAL_LIMIT)return false;const next=count+1;let durable=false;try{localStorage.setItem(KEY,String(next));durable=localStorage.getItem(KEY)===String(next);}catch{/* cookie fallback */}try{document.cookie=`${COOKIE}=${next}; Max-Age=34560000; Path=/; SameSite=Lax; Secure`;durable=durable||document.cookie.split('; ').includes(`${COOKIE}=${next}`);}catch{/* storage unavailable */}return durable;}
