import type {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {readReviewAccount} from './reviewAccountState';
export default function ReviewGate({children}:{children:ReactNode}){return readReviewAccount()?<>{children}</>:<Navigate to="/signup" replace/>;}
