import type { ReviewState } from '@/learner/state';
// A per-user draft survives refresh until that exact snapshot is acknowledged.
// It is never an authentication credential or a source of account ownership.
export function markProfileDraft(storage:Storage,key:string,state:ReviewState) {
 try { storage.setItem(key,JSON.stringify(state)); } catch { /* Cloud save can still succeed. */ }
}
export function acknowledgeProfileDraft(storage:Storage,key:string,state:ReviewState) {
 try { if(storage.getItem(key)===JSON.stringify(state))storage.removeItem(key); } catch { /* Retry remains possible. */ }
}
export function readProfileDraft(storage:Storage,key:string):ReviewState|null {
 try { const state=JSON.parse(storage.getItem(key)||'null');return state?.version===1&&Number.isInteger(state.step)&&state.step>=0&&state.step<=14&&state.profile&&Array.isArray(state.profile.goals)&&Array.isArray(state.profile.interests)?state:null; } catch { return null; }
}
