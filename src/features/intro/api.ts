import { getAccessTokenForCareer, getAuthConfig } from '@/lib/auth';

export type IntroductionReport = {
  id: string;
  status: 'complete';
  updatedAt: string;
  transcript?: string | null;
  feedback: {
    version: string;
    aiEvaluated: false;
    recordingReceived: boolean;
    recordingBytes: number;
    transcriptSource: string;
    transcriptWords: number | null;
    structureChecklist?: {item:string;found:boolean}[];
    observations: string[];
    suggestedNextSteps: string[];
    limitations: string;
  };
};
export type IntroStart = {
  id: string;
  audience: 'student' | 'fresher' | 'professional';
  startedAt: string;
  durationSeconds: number;
  prompt: string;
  upload: { bucket: string; path: string; token: string };
};

function config() {
  const c = getAuthConfig();
  if (!c || new URL(c.url).hostname !== 'kzjvvwuyigiclryoqpkv.supabase.co')
    throw new Error('Private development introduction service is not configured.');
  return c;
}

async function request<T>(path: string, body?: unknown): Promise<T> {
  const c = config();
  const token = await getAccessTokenForCareer();
  if (!token) throw new Error('Sign in with Google again to access your report.');
  const url = new URL('/functions/v1/career/intro/' + path, c.url);
  const response = await fetch(url, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { Authorization: 'Bearer ' + token, apikey: c.anonKey,
      ...(body === undefined ? {} : {'Content-Type':'application/json'}) },
    credentials: 'omit',
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403)
      throw new Error('Google sign-in, current consent and learner enrollment are required.');
    throw new Error('Introduction service returned HTTP ' + response.status);
  }
  return response.json() as Promise<T>;
}

export function startIntroduction(): Promise<IntroStart> { return request('start', {}); }
export function completeIntroduction(input: { id: string; durationSeconds: number; transcript?: string }):
  Promise<{ id: string; status: 'complete' }> { return request('complete', input); }
export async function listIntroductionReports(): Promise<IntroductionReport[]> {
  const result=await request<{reports:IntroductionReport[]}>('reports');
  return result.reports;
}
export function getIntroductionReport(id: string): Promise<IntroductionReport> {
  if (!/^[a-f0-9-]{36}$/i.test(id)) throw new Error('Invalid report identifier');
  return request('reports/' + encodeURIComponent(id));
}
export async function uploadIntroduction(ticket: IntroStart['upload'], file: Blob): Promise<void> {
  const c=config();
  if (!file.size || file.size>50*1024*1024 || !file.type.startsWith('video/webm'))
    throw new Error('A nonempty WebM recording under 50 MB is required.');
  const {createClient}=await import('@supabase/supabase-js');
  const client=createClient(c.url,c.anonKey);
  const {error}=await client.storage.from(ticket.bucket)
    .uploadToSignedUrl(ticket.path,ticket.token,file,{contentType:'video/webm'});
  if (error) throw new Error('Private recording upload failed: '+error.message);
}
