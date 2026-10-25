import { LanXCore } from '@/components/ai/LanXCore';
export type CompanionState='idle'|'greeting'|'listening'|'speaking'|'thinking'|'encouragement'|'flying';
export default function Companion({paused}:{state:CompanionState;paused:boolean}){return <div className="sx-core-host"><LanXCore paused={paused}/></div>;}
