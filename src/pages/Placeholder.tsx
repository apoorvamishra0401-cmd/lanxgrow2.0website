import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentSession,
  signOut as signOutOfProvider,
  type AuthSession,
} from '@/lib/auth';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function Placeholder() {
  usePageMeta(
    'Your learning space',
    'Your LanXgrow learning space is coming soon.'
  );

  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const current = await getCurrentSession();
      if (!active) return;
      if (!current) {
        navigate('/signin');
        return;
      }
      setSession(current);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <>
        <PageIntro
          eyebrow="Your learning space"
          heading="Loading…"
          supporting="Checking your session."
        />
      </>
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="Your learning space"
        heading="Your learning space is coming soon"
        supporting={
          'You are signed in as ' + (session?.email ?? 'a LanXgrow learner') + '. Courses, assessments and learning features are not part of this stage, so there is nothing else here yet.'
        }
        aside={
          <div className="mt-8">
            <Button
              onClick={async () => {
                await signOutOfProvider();
                navigate('/signin');
              }}
              variant="secondary"
              withArrow
            >
              Sign out
            </Button>
          </div>
        }
      />

      <Section tone="ivory">
        <div className="max-w-prose">
          <Alert tone="info" title="Placeholder page">
            This is a placeholder for the signed-in area. The full learner dashboard is not part of this stage.
          </Alert>
        </div>
      </Section>
    </>
  );
}
