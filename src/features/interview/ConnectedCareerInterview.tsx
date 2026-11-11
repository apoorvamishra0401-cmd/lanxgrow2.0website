import { useMemo } from 'react';
import InterviewPreparation from './InterviewPreparation';
import { createHttpCareerTransport } from './httpTransport';
import { getAccessTokenForCareer, getAuthConfig } from '@/lib/auth';

/** Development-only authenticated integration; never default to a production backend. */
export default function ConnectedCareerInterview() {
  const transport = useMemo(() => {
    const config = getAuthConfig();
    if (!config || new URL(config.url).hostname !== 'kzjvvwuyigiclryoqpkv.supabase.co') return undefined;
    return createHttpCareerTransport({
      baseUrl: new URL('/functions/v1/', config.url).toString(),
      getAccessToken: getAccessTokenForCareer,
      storage: { url: config.url, publishableKey: config.anonKey },
    });
  }, []);
  return <InterviewPreparation transport={transport} />;
}
