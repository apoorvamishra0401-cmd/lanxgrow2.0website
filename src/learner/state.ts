import {scopedStorageKey} from './storageScope';
export const KEY = 'lanxgrow.learner.review.v1';
export type Profile = {name:string;mobile:string;whatsapp:string;email:string;age:string;city:string;state:string;pincode:string;category:string;education:string;board:string;work:string;experience:string;minutes:string;commitment:string;goals:string[];interests:string[];otherGoal:string;otherInterest:string};
export type ReviewState={version:1;step:number;profile:Profile;completedAt:string|null;welcomeSeen:boolean;assessmentReviewedAt?:string;waitlists:string[]};
export function initial():ReviewState{return {version:1,step:0,profile:{name:'',mobile:'',whatsapp:'',email:'',age:'',city:'',state:'',pincode:'',category:'',education:'',board:'',work:'',experience:'',minutes:'',commitment:'',goals:[],interests:[],otherGoal:'',otherInterest:''},completedAt:null,welcomeSeen:false,waitlists:[]};}
export function loadReview():ReviewState{try{const d=JSON.parse(localStorage.getItem(scopedStorageKey(KEY))||'null');if(d?.version!==1||!d.profile||!Number.isInteger(d.step)||d.step<0||d.step>14)return initial();const p={...initial().profile,...d.profile};if(!Array.isArray(p.goals)||!Array.isArray(p.interests))return initial();return {...initial(),...d,profile:p,waitlists:Array.isArray(d.waitlists)?d.waitlists:[]};}catch{return initial();}}
export function saveReview(s:ReviewState){try{localStorage.setItem(scopedStorageKey(KEY),JSON.stringify(s));return true;}catch{return false;}}
// Calendar dates in India, not browser timezone or 168-hour intervals.
export function trialEnd(completedAt:string){const date=new Date(new Date(completedAt).getTime()+330*60000);return new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()+7)-330*60000);}
export function trialDays(completedAt:string,now=Date.now()){return Math.max(0,Math.ceil((trialEnd(completedAt).getTime()-now)/86400000));}
