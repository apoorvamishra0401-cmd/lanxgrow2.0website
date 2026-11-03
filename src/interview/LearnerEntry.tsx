import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useVerifiedLearner } from '@/auth/learnerContext';
import LearnerPreview from '@/learner/LearnerPreview';
import { loadReview } from '@/learner/state';
import AudienceEntry from './AudienceEntry';
import { audienceDestination, isAudience, readAudience, type Audience } from './audience';
import { loadInterviewReports } from './api';

export default function LearnerEntry() {
  const verified = useVerifiedLearner();
  const profileCategory = loadReview().profile.category;
  const remembered = readAudience();
  const known = isAudience(profileCategory) ? profileCategory : remembered;
  const [restored, setRestored] = useState<Audience | null>(null);
  const [checking, setChecking] = useState(Boolean(verified && !known));
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    if (!verified || known) return;
    loadInterviewReports().then(reports => {
      if (active) setRestored(reports[0]?.candidate.category || null);
    }).catch(() => { if (active) setFailed(true); }).finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [verified?.userId, known]);
  const audience = known || restored;
  if (checking) return <main className="if-root if-entry"><p role="status">Opening your journey…</p></main>;
  if (audience && audience !== 'Student') return <Navigate to={audienceDestination(audience)} replace />;
  if (failed) return <AudienceEntry />;
  return <LearnerPreview />;
}
