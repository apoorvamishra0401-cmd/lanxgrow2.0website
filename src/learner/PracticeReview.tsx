import {useNavigate} from 'react-router-dom';
import PracticeJourney from './journey/PracticeJourney';
export default function PracticeReview(){const navigate=useNavigate();return <PracticeJourney review interests={['Travel','Technology','Music']} onBack={()=>navigate('/design-review/assessment')}/>;}
