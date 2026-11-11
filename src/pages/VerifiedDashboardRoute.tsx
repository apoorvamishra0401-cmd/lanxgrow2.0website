import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { getAccessTokenForCareer, getAuthConfig } from '@/lib/auth';
import { getAudienceDashboardPath, resolveDashboardRoute } from '@/config/audienceNavigation';
import { requestVerifiedAudience } from '@/config/verifiedAudienceApi';
import type { VerifiedAudienceResult } from '@/config/verifiedAudienceApi';
import AudienceDashboard from '@/pages/AudienceDashboard';

/** Every signed-in dashboard transition independently resolves a server-verified audience.
 * No localStorage, URL, preview audience or email can grant a feature.
 */
export default function VerifiedDashboardRoute() {
  const { audience: requestedAudience, feature } = useParams();
  const { configured, loading: authLoading, session } = useAuthSession();
  const [check, setCheck] = useState<{ userId: string; result: VerifiedAudienceResult } | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const recheck = () => setRefresh(previous => previous + 1);
    const onVisibility = () => { if (document.visibilityState === 'visible') recheck(); };
    window.addEventListener('focus', recheck);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', recheck);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!session?.userId || !configured || authLoading) {
      setCheck(null);
      return;
    }
    const controller = new AbortController();
    let active = true;
    setCheck(null);
    void requestVerifiedAudience(getAuthConfig(), getAccessTokenForCareer, { signal: controller.signal })
      .then(result => {
        if (active) setCheck({ userId: session.userId, result });
      });
    return () => { active = false; controller.abort(); };
  }, [configured, authLoading, session?.userId, refresh]);

  const view = (heading: string, message: string, action: string, target: string) =>
    <main className="lx-role-dashboard" style={{ minHeight: '75svh' }}>
      <div className="lx-role-wrap" style={{maxWidth:600}}>
        <h1>{heading}</h1>
        <p role="status">{message}</p>
        <Link className="lx-role-link" to={target}>{action}</Link>
      </div>
    </main>;

  if (!configured) return view('Dashboard unavailable', 'Only the isolated development Career API can verify access. No development Google configuration was found.', 'Return to sign in', '/signin');
  if (authLoading) return view('Checking Google session…', 'Confirming your authenticated learner session.', 'Sign in', '/signin');
  if (!session) return view('Sign in to open your dashboard', 'Guest demonstrations are separate from authenticated learning dashboards.', 'Continue with Google', '/signin');
  if (!check || check.userId !== session.userId) return view('Verifying learner access…', 'Checking your audience against the development Career API and current consent.', 'Return to onboarding', '/activate');
  const verified = check.result;
  if (verified.status === 'unassigned') return view('Complete learner onboarding', 'No server-assigned learner audience exists for this Google account.', 'Choose your learner journey', '/activate');
  if (verified.status === 'consent-required') return view('Consent required', 'The server has not accepted this session with the current policy consent. Check your sign-in and consent.', 'Review consent', '/consent');
  if (verified.status === 'sign-in-required') return view('Session expired', 'Google sign-in must be verified again before loading learning features.', 'Sign in again', '/signin');
  if (verified.status !== 'assigned') return view('Could not verify learner access', 'The development server did not confirm a learner audience. Access is closed until verification succeeds.', 'Retry verification', '/activate');

  const canonicalPath = getAudienceDashboardPath(verified.audience);
  if (requestedAudience && requestedAudience !== verified.audience)
    return view('Dashboard access denied', 'Your account is not assigned to the requested learner category.', 'Open your assigned dashboard', canonicalPath);
  if (!resolveDashboardRoute(verified.audience, feature).allowed)
    return view('Feature unavailable for your audience', 'Your server-verified learner category does not include this resource.', 'Return to your dashboard', canonicalPath);

  return <AudienceDashboard verifiedAudience={verified.audience} verifiedUserId={session.userId} />;
}
