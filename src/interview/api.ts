import { getAuthConfig, getClient } from '@/lib/auth';
import type { Candidate, InterviewFeedback } from '../../supabase/functions/interview-assessment/domain';
export type InterviewReport = { id: string; user_id: string; status: 'processing' | 'complete' | 'failed'; candidate: Candidate; transcript: string | null; feedback: InterviewFeedback | null; created_at: string };
export async function submitInterview(id: string, audio: Blob, candidate: Candidate): Promise<InterviewReport> {
  const config = getAuthConfig();
  const client = await getClient();
  if (!config || !client) throw Error('Account services are unavailable. Please try again later.');
  const { data } = await client.auth.getSession();
  if (!data.session) throw Error('Please sign in to save your report.');
  const form = new FormData();
  form.set('id', id);
  form.set('audio', audio, 'introduction');
  form.set('candidate', JSON.stringify(candidate));
  form.set('ageConfirmed', 'true');
  form.set('processingAgreed', 'true');
  const response = await fetch(config.url + '/functions/v1/interview-assessment', {
    method: 'POST', headers: { apikey: config.anonKey, Authorization: 'Bearer ' + data.session.access_token }, body: form,
    signal: AbortSignal.timeout(110000),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.report) throw Error(result?.error || 'Your report could not be confirmed. Check saved reports before retrying.');
  return result.report;
}
export async function loadInterviewReports(): Promise<InterviewReport[]> {
  const client = await getClient();
  if (!client) return [];
  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !user) throw Error('Please sign in again.');
  const { data, error } = await client.from('interview_reports').select('id,user_id,status,candidate,transcript,feedback,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20);
  if (error) throw Error('Your saved reports could not load. Please retry.');
  return data || [];
}
