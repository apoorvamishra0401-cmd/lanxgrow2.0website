import { Link, Navigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { getAuthConfig, getAccessTokenForCareer } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { getAudienceDashboardPath } from '@/config/audienceNavigation';
import { requestVerifiedAudience } from '@/config/verifiedAudienceApi';
import type { VerifiedAudienceResult } from '@/config/verifiedAudienceApi';

/** Target of the existing Google PKCE callback -> consent -> /placeholder chain.
 * Replaces only the frontend placeholder; the owned auth and policy code is untouched.
 */
export default function SignedInDashboardEntry() {
  const { configured, loading, session } = useAuthSession();
  const [check, setCheck] = useState<{ userId: string; result: VerifiedAudienceResult } | null>(null);
  useEffect(() => {
    if (!session?.userId || !configured || loading) { setCheck(null); return; }
    let active = true;
    const controller = new AbortController();
    setCheck(null);
    void requestVerifiedAudience(getAuthConfig(), getAccessTokenForCareer, { signal: controller.signal })
      .then(result => { if (active) setCheck({ userId: session.userId, result }); });
    return () => { active = false; controller.abort(); };
  }, [configured, loading, session?.userId]);
  if (!configured) return <main className="lx-container py-16"><h1>Signed-in learning unavailable</h1><p>The development Google and Career API configuration is missing.</p><Link to="/signin">Sign in</Link></main>;
  if (loading) return <main className="lx-container py-16"><h1>Checking Google session…</h1></main>;
  if (!session) return <Navigate to="/signin" replace />;
  if (!check || check.userId !== session.userId) return <main className="lx-container py-16"><h1>Checking your learner assignment…</h1></main>;
  if (check.result.status === 'assigned') return <Navigate to={getAudienceDashboardPath(check.result.audience)} replace />;
  if (check.result.status === 'unassigned') return <Navigate to="/activate" replace />;
  if (check.result.status === 'consent-required') return <Navigate to="/consent" replace />;
  return <main className="lx-container py-16"><h1>Could not verify your learner account</h1>
    <p>Signed-in navigation is blocked until the development server confirms consent and an assigned audience.</p>
    <Link to="/signin">Sign in again</Link>
  </main>;
}
