import {createContext,useContext} from 'react';
import type {CloudProfile} from './registration';
export const VerifiedLearnerContext=createContext<{userId:string;verification:CloudProfile['verification']}|null>(null);
export const useVerifiedLearner=()=>useContext(VerifiedLearnerContext);
