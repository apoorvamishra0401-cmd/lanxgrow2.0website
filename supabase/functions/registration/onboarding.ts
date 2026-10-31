import { states, validPin } from './location.ts';
export type Profile = {name:string;mobile:string;whatsapp:string;email:string;age:string;city:string;state:string;pincode:string;category:string;education:string;board:string;work:string;experience:string;minutes:string;commitment:string;goals:string[];interests:string[];otherGoal:string;otherInterest:string};
export const emptyProfile = ():Profile => ({name:'',mobile:'',whatsapp:'',email:'',age:'',city:'',state:'',pincode:'',category:'',education:'',board:'',work:'',experience:'',minutes:'',commitment:'',goals:[],interests:[],otherGoal:'',otherInterest:''});
export const validPhone = (value:string) => /^\+[1-9]\d{7,14}$/.test(value.replace(/[\s()-]/g,''));
const education = ['Class 11','Class 12','College / University'];
const experience = ['Less than 1 year','1–2 years','3–5 years','6–10 years','More than 10 years'];
const work = ['IT and Software','Customer Support','Finance and Accounting','Sales and Marketing','Operations','Human Resources','Education','Healthcare','Business and Entrepreneurship','Other'];
export function validateOnboardingStep(p:Profile, step:number):string {
 switch(step){
  case 0:return p.name.trim().length>=2?'':'Please enter your full name.';
  case 1:return validPhone(p.mobile)?'':'Please enter a valid number with country code, for example +91.';
  case 2:return validPhone(p.whatsapp)?'':'Add your WhatsApp number or choose the same number.';
  case 3:return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())?'':'Please enter a valid email address.';
  case 4:return /^\d{1,3}$/.test(p.age)&&Number(p.age)>=1&&Number(p.age)<=120?'':'Please enter a valid age.';
  case 5:return states.includes(p.state)?'':'Please select your state or union territory.';
  case 6:return !p.city.trim()||p.city==='Other'?'Please enter your city.':validPin(p.pincode)?'':'Please enter a valid six-digit PIN code.';
  case 7:return ['Student','Working Professional'].includes(p.category)?'':'Please select an option.';
  case 8:return (p.category==='Student'?education:work).includes(p.category==='Student'?p.education:p.work)?'':'Please select an option.';
  case 9:return p.category==='Student'?(p.board.trim()&&p.board!=='Other'?'':p.education==='College / University'?'Please enter your degree or course.':'Please enter your school board.'):experience.includes(p.experience)?'':'Please select your work experience.';
  case 10:return ['20 minutes','30 minutes','45 minutes','60 minutes'].includes(p.minutes)?'':'Choose at least 20 minutes to continue.';
  case 11:return p.commitment==='Yes, I can commit'?'':'A minimum commitment of 20 minutes a day is required to continue.';
  case 12:return p.goals.length&&(!p.goals.includes('Other')||p.otherGoal.trim())?'':'Choose a goal and describe it if you select Other.';
  case 13:return p.interests.length&&(!p.interests.includes('Other')||p.otherInterest.trim())?'':'Choose an interest and describe it if you select Other.';
  default:return 'Please complete your onboarding in order.';
 }
}
export function firstIncompleteStep(profile:Profile):number {
 for(let step=0;step<14;step++)if(validateOnboardingStep(profile,step))return step;
 return 14;
}
export function updateOnboardingProfile(profile:Profile,key:keyof Profile,value:string|string[]):Profile {
 const next={...profile,[key]:value};
 if(key==='category'&&value!==profile.category)Object.assign(next,{education:'',board:'',work:'',experience:''});
 if(key==='education'&&value!==profile.education)next.board='';
 if(key==='minutes'&&value!==profile.minutes)next.commitment='';
 if(key==='state'&&value!==profile.state)Object.assign(next,{city:'',pincode:''});
 if(key==='mobile'&&profile.whatsapp===profile.mobile)next.whatsapp=String(value);
 return next;
}
