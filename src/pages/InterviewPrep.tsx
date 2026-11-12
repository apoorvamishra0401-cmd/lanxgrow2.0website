import {useEffect} from 'react';
export default function InterviewPrep(){
 useEffect(()=>{window.location.replace('/interview-prep');},[]);
 return <p role="status">Opening Interview Preparation…</p>;
}
