import {useEffect,useState,type ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {readReviewAccount} from './reviewAccountState';
import {useAuthSession} from '@/hooks/useAuthSession';
import {getCurrentUser} from '@/lib/auth';
import {loadCloudProfile,verificationEnabled,type CloudProfile} from '@/auth/registration';
import {VerifiedLearnerContext} from '@/auth/learnerContext';
import {setReviewOwner} from './storageScope';
import {initial,saveReview} from './state';
function VerifiedGate({children}:{children:ReactNode}){
 const {session,loading}=useAuthSession();const [profile,setProfile]=useState<CloudProfile|null>(null),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;setProfile(null);setError('');if(!session)return;
  (async()=>{try{const user=await getCurrentUser();if(!user||user.id!==session.userId)throw Error('Please sign in again.');const result=await loadCloudProfile();if(!active)return;setReviewOwner(user.id);saveReview(result.state||initial());setProfile(result);}catch(e){if(active)setError(e instanceof Error?e.message:'Could not load your account.');}})();
  return()=>{active=false;setReviewOwner(null);};
 },[session?.userId,retry]);
 if(loading)return <main className="af-root"><div className="af-shell"><p role="status">Restoring your session…</p></div></main>;
 if(!session)return <Navigate to="/signin" replace/>;
 if(error)return <main className="af-root"><div className="af-shell"><h1>Let’s reconnect.</h1><p role="alert">{error}</p><button className="af-secondary" onClick={()=>setRetry(r=>r+1)}>Try again</button></div></main>;
 if(profile&&(!profile.consentCurrent||!profile.homeScreenRequested))return <Navigate to="/consent" replace/>;
 if(!profile)return <main className="af-root"><div className="af-shell"><p role="status">Loading your learning profile…</p></div></main>;
 return <VerifiedLearnerContext.Provider value={{userId:session.userId,verification:profile.verification}}><div key={session.userId}>{children}</div></VerifiedLearnerContext.Provider>;
}
export default function ReviewGate({children}:{children:ReactNode}){return verificationEnabled?<VerifiedGate>{children}</VerifiedGate>:readReviewAccount()?<>{children}</>:<Navigate to="/signup" replace/>;}
