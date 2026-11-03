import { useNavigate } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, GraduationCap, Sprout } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { audienceDestination, rememberAudience, type Audience } from './audience';
import './interview.css';
import {useInterviewDraft} from './InterviewDraft';

const options = [
  { name: 'Student', icon: GraduationCap, copy: 'Build your English through your existing personalised learning journey.' },
  { name: 'Fresher', icon: Sprout, copy: 'Start with an interview introduction and prepare for your first professional opportunity.' },
  { name: 'Working Professional', icon: BriefcaseBusiness, copy: 'Start with interview practice shaped around your professional communication.' },
] as const;

export default function AudienceEntry() {
  usePageMeta('Your next chapter', 'Choose your LanXgrow learning or interview preparation journey.');
  const navigate = useNavigate();
  const {setDraft} = useInterviewDraft();

  function choose(audience: Audience) {
    setDraft(null);
    rememberAudience(audience);
    navigate(audienceDestination(audience));
  }

  return (
    <main className="if-root">

      <section className="if-entry" aria-labelledby="audience-title">
        <p className="if-eyebrow">YOUR NEXT CHAPTER</p>
        <h1 id="audience-title">A starting point<br />that feels like you.</h1>
        <p>Tell us where you are today. We’ll open the journey that fits.</p>
        <div className="if-audiences">
          {options.map(({ name, icon: Icon, copy }) => (
            <button key={name} type="button" onClick={() => choose(name)}>
              <Icon size={25} aria-hidden="true" />
              <span><strong>{name}</strong><small>{copy}</small></span>
              <ArrowRight size={21} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
